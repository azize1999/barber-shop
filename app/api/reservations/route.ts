import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { broadcast } from "@/lib/sse"

// ─── Simple in-memory rate limiter ────────────────────────────────────────────
// Limits POST /api/reservations to 5 requests per IP per 10 minutes.
// For production, replace with Upstash Redis or similar.
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse a "YYYY-MM-DD" string into a Date at midnight UTC.
 * All reservations are stored at midnight UTC in the DB, so this ensures
 * the date range window [dayStart, dayEnd) always covers every record for
 * that calendar day regardless of server timezone.
 */
function parseDateSafe(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`)
}

/** Return the next day at midnight UTC — used as the exclusive upper bound. */
function nextDayUTC(d: Date): Date {
  const next = new Date(d)
  next.setUTCDate(next.getUTCDate() + 1)
  return next
}

const VALID_STATUSES = ["PENDING", "ACCEPTED", "REFUSED"] as const
type Status = (typeof VALID_STATUSES)[number]

// ─── Notifications (Email + SMS) ─────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
}

// ── Email via Resend ──────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.warn("[email] RESEND_API_KEY not set — skipping"); return }
  if (!to)     { console.warn("[email] No recipient — skipping"); return }

  const from = process.env.EMAIL_FROM || "onboarding@resend.dev"

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    })
    const json = await res.json()
    if (!res.ok) {
      console.error("[email] Resend rejected:", res.status, JSON.stringify(json))
    } else {
      console.log("[email] Sent OK →", json.id, "to", to)
    }
  } catch (err) {
    console.error("[email] Network error:", err)
  }
}

// ── SMS via Twilio ────────────────────────────────────────────────────────────

async function sendSMS(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const from       = process.env.TWILIO_PHONE_NUMBER
  if (!accountSid || !authToken || !from) return
  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64")
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    })
  } catch (err) {
    console.error("[sms] Failed:", err)
  }
}

// ── Booking received (sent on POST) ──────────────────────────────────────────

async function sendConfirmationEmail(to: string, name: string, service: string, date: string, time: string) {
  const dateFormatted = formatDate(date)
  await sendEmail(
    to,
    "Votre demande de réservation a bien été reçue",
    `<div style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2>Bonjour ${name},</h2>
      <p>Nous avons bien reçu votre demande de rendez-vous.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;color:#666">Prestation</td><td style="padding:8px;font-weight:bold">${service}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Date</td><td style="padding:8px;font-weight:bold">${dateFormatted}</td></tr>
        <tr><td style="padding:8px;color:#666">Heure</td><td style="padding:8px;font-weight:bold">${time}</td></tr>
      </table>
      <p>Nous vous contacterons rapidement pour confirmer votre créneau.</p>
      <p style="color:#888;font-size:12px">Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
    </div>`
  )
}

// ── Status changed by admin (sent on PATCH) ───────────────────────────────────

async function notifyStatusChange(
  status: string,
  name: string,
  telephone: string,
  email: string | null,
  service: string,
  date: string,
  time: string,
) {
  const dateFormatted = formatDate(date)
  const shopName = process.env.SHOP_NAME || "Votre Barbershop"

  if (status === "ACCEPTED") {
    const smsBody = `Bonjour ${name}, votre RDV chez ${shopName} est CONFIRMÉ ✅\n📅 ${dateFormatted} à ${time}\n✂️ ${service}\nÀ bientôt !`
    const emailHtml = `<div style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#16a34a">✅ Rendez-vous confirmé !</h2>
      <p>Bonjour ${name},</p>
      <p>Votre rendez-vous chez <strong>${shopName}</strong> est <strong>confirmé</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;color:#666">Prestation</td><td style="padding:8px;font-weight:bold">${service}</td></tr>
        <tr style="background:#f0fdf4"><td style="padding:8px;color:#666">Date</td><td style="padding:8px;font-weight:bold">${dateFormatted}</td></tr>
        <tr><td style="padding:8px;color:#666">Heure</td><td style="padding:8px;font-weight:bold">${time}</td></tr>
      </table>
      <p>Merci et à bientôt !</p>
    </div>`

    await Promise.all([
      sendSMS(telephone, smsBody),
      email ? sendEmail(email, `✅ RDV confirmé — ${shopName}`, emailHtml) : Promise.resolve(),
    ])

  } else if (status === "REFUSED") {
    const smsBody = `Bonjour ${name}, nous sommes désolés mais votre demande de RDV chez ${shopName} le ${dateFormatted} à ${time} n'a pas pu être acceptée. Appelez-nous pour choisir un autre créneau.`
    const emailHtml = `<div style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#dc2626">❌ Rendez-vous non disponible</h2>
      <p>Bonjour ${name},</p>
      <p>Nous sommes désolés, nous ne pouvons pas honorer votre demande de rendez-vous pour le créneau suivant :</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;color:#666">Prestation</td><td style="padding:8px;font-weight:bold">${service}</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;color:#666">Date</td><td style="padding:8px;font-weight:bold">${dateFormatted}</td></tr>
        <tr><td style="padding:8px;color:#666">Heure</td><td style="padding:8px;font-weight:bold">${time}</td></tr>
      </table>
      <p>N'hésitez pas à nous contacter ou à réserver un autre créneau sur notre site.</p>
    </div>`

    await Promise.all([
      sendSMS(telephone, smsBody),
      email ? sendEmail(email, `❌ RDV annulé — ${shopName}`, emailHtml) : Promise.resolve(),
    ])
  }
  // PENDING → no notification needed
}

// ─── Admin auth helper ────────────────────────────────────────────────────────

/**
 * Verify the admin secret sent in the Authorization header.
 * Header format:  Authorization: Bearer <ADMIN_PASSWORD>
 * This is checked server-side — ADMIN_PASSWORD is never exposed to the browser.
 */
function isAdminAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") ?? ""
  const [scheme, token] = authHeader.split(" ")
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  return scheme === "Bearer" && token === adminPassword
}

// ─── GET /api/reservations ────────────────────────────────────────────────────
// Public: returns booked times for a given date (time + status only, no PII).
// Admin:  returns full reservation list when Authorization header is valid.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")
  const admin = isAdminAuthorized(req)

  let where: Record<string, unknown> = {}

  if (date) {
    const dayStart = parseDateSafe(date)
    where.date = { gte: dayStart, lt: nextDayUTC(dayStart) }
  }

  if (admin) {
    // Admin gets everything
    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [{ date: "asc" }, { time: "asc" }],
    })
    return NextResponse.json(reservations)
  }

  // Public clients only get time + status (no names, phones, emails)
  const reservations = await prisma.reservation.findMany({
    where,
    select: { time: true, status: true },
  })
  return NextResponse.json(reservations)
}

// ─── POST /api/reservations ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  if (!checkRateLimit(ip)) {
    return new NextResponse("Trop de demandes. Veuillez réessayer dans quelques minutes.", {
      status: 429,
    })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Corps de requête invalide", { status: 400 })
  }

  const { name, telephone, email, service, barber, date, time } = body as Record<string, string>

  // Required fields
  if (!name?.trim() || !telephone?.trim() || !service || !date || !time) {
    return new NextResponse("Champs obligatoires manquants", { status: 400 })
  }

  // Basic phone sanity check (server-side)
  const cleanedPhone = telephone.replace(/[\s.\-()]/g, "")
  if (!/^(\+33|0033|0)[1-9]\d{8}$/.test(cleanedPhone)) {
    return new NextResponse("Numéro de téléphone invalide", { status: 422 })
  }

  // Email format check (if provided)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new NextResponse("Adresse email invalide", { status: 422 })
  }

  // Date range check: must be between tomorrow and 30 days from now
  const reservationDate = parseDateSafe(date)
  const now = new Date()
  const minAllowed = new Date(now)
  minAllowed.setUTCDate(minAllowed.getUTCDate() + 1)
  minAllowed.setUTCHours(0, 0, 0, 0)
  const maxAllowed = new Date(now)
  maxAllowed.setUTCDate(maxAllowed.getUTCDate() + 30)
  maxAllowed.setUTCHours(23, 59, 59, 999)

  if (reservationDate < minAllowed || reservationDate > maxAllowed) {
    return new NextResponse("Date hors de la plage autorisée", { status: 422 })
  }

  // Conflict check — wide window covers midnight-stored records in existing DB
  const dayStart = parseDateSafe(date)

  const conflict = await prisma.reservation.findFirst({
    where: {
      date: { gte: dayStart, lt: nextDayUTC(dayStart) },
      time,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
  })
  if (conflict) {
    return new NextResponse("Ce créneau est déjà réservé", { status: 409 })
  }

  const reservation = await prisma.reservation.create({
    data: {
      name: name.trim(),
      telephone: telephone.trim(),
      email: email?.trim() || null,
      service,
      barber: barber || "any",
      date: reservationDate,
      time,
      status: "PENDING",
    },
  })

  // Notify all connected admin tabs in real time
  broadcast("reservation:created", reservation)

  // Send confirmation email (fire-and-forget)
  if (email) {
    sendConfirmationEmail(email, name.trim(), service, date, time)
  }

  return NextResponse.json(reservation, { status: 201 })
}

// ─── PATCH /api/reservations ──────────────────────────────────────────────────
// Admin only — requires Authorization: Bearer <ADMIN_PASSWORD>

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Corps de requête invalide", { status: 400 })
  }

  const { id, status } = body as { id: unknown; status: unknown }

  if (!id || !status) {
    return new NextResponse("id et status sont obligatoires", { status: 400 })
  }

  if (!VALID_STATUSES.includes(status as Status)) {
    return new NextResponse("Statut invalide", { status: 400 })
  }

  try {
    const updated = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: status as Status },
    })
    broadcast("reservation:updated", updated)
    // Notify client by SMS + email (fire-and-forget)
    if (status === "ACCEPTED" || status === "REFUSED") {
      notifyStatusChange(
        status as string,
        updated.name,
        updated.telephone,
        updated.email ?? null,
        updated.service,
        updated.date.toISOString().split("T")[0],
        updated.time,
      )
    }
    return NextResponse.json(updated)
  } catch {
    return new NextResponse("Réservation introuvable", { status: 404 })
  }
}

// ─── DELETE /api/reservations ─────────────────────────────────────────────────
// Admin only — requires Authorization: Bearer <ADMIN_PASSWORD>

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id || isNaN(Number(id))) {
    return new NextResponse("id invalide", { status: 400 })
  }

  try {
    await prisma.reservation.delete({ where: { id: Number(id) } })
    broadcast("reservation:deleted", { id: Number(id) })
    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse("Réservation introuvable", { status: 404 })
  }
}