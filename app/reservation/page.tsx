"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, CheckCircle, Bell, ExternalLink, AlertCircle } from "lucide-react"

const services = [
  { id: "coupe", name: "Coupe Homme", duration: "30 min", price: "18€" },
  { id: "coupe-barbe", name: "Coupe + Barbe", duration: "45 min", price: "28€" },
  { id: "degrade", name: "Dégradé / Fade", duration: "35 min", price: "20€" },
  { id: "barbe", name: "Taille de Barbe", duration: "20 min", price: "12€" },
  { id: "contours", name: "Contours Barbe", duration: "15 min", price: "8€" },
  { id: "rasage", name: "Rasage Traditionnel", duration: "25 min", price: "18€" },
  { id: "enfant", name: "Coupe Enfant", duration: "20 min", price: "12€" },
  { id: "etudiant", name: "Coupe Étudiant", duration: "30 min", price: "15€" },
]

const barbers = [
  { id: "any", name: "Pas de préférence" },
  { id: "ahmed", name: "Ahmed" },
  { id: "karim", name: "Karim" },
]

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
]

// French phone number validation (mobile + landline)
function isValidFrenchPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.\-()]/g, "")
  return /^(\+33|0033|0)[1-9]\d{8}$/.test(cleaned)
}

const emptyForm = {
  nom: "",
  telephone: "",
  email: "",
  service: "",
  barber: "any",
  date: "",
  time: "",
}

type FormErrors = Partial<Record<keyof typeof emptyForm, string>>

export default function ReservationPage() {
  const [formState, setFormState] = useState(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Min = tomorrow, Max = 30 days from now
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  // Fetch booked slots whenever date changes
  useEffect(() => {
    if (!formState.date) {
      setBookedTimes([])
      return
    }
    const fetchBooked = async () => {
      setLoadingSlots(true)
      try {
        const res = await fetch(`/api/reservations?date=${formState.date}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        // Only block slots that are ACCEPTED (not REFUSED or PENDING)
        setBookedTimes(
          data
            .filter((r: any) => r.status === "ACCEPTED" || r.status === "PENDING")
            .map((r: any) => r.time)
        )
      } catch {
        setBookedTimes([])
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchBooked()
    // Reset time selection when date changes
    setFormState((prev) => ({ ...prev, time: "" }))
  }, [formState.date])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formState.nom.trim()) newErrors.nom = "Le nom est obligatoire"
    if (!formState.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire"
    } else if (!isValidFrenchPhone(formState.telephone)) {
      newErrors.telephone = "Numéro de téléphone invalide"
    }
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Adresse email invalide"
    }
    if (!formState.service) newErrors.service = "Veuillez choisir une prestation"
    if (!formState.date) newErrors.date = "Veuillez choisir une date"
    if (!formState.time) newErrors.time = "Veuillez choisir un horaire"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.nom.trim(),
          telephone: formState.telephone.trim(),
          email: formState.email.trim() || null,
          service: formState.service,
          barber: formState.barber,
          date: formState.date,
          time: formState.time,
        }),
      })

      if (res.status === 409) {
        setSubmitError("Ce créneau vient d'être réservé. Veuillez choisir un autre horaire.")
        // Refresh slots
        setFormState((prev) => ({ ...prev, time: "" }))
        return
      }

      if (!res.ok) {
        const text = await res.text()
        setSubmitError(text || "Une erreur est survenue. Veuillez réessayer.")
        return
      }

      setIsSubmitted(true)
    } catch {
      setSubmitError("Impossible de contacter le serveur. Vérifiez votre connexion.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedService = services.find((s) => s.id === formState.service)

  // ── Success screen ────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20">
        <section className="py-16">
          <div className="mx-auto max-w-xl px-4 lg:px-8">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                Demande envoyée !
              </h1>
              <p className="text-muted-foreground mb-6">
                Votre demande de rendez-vous a bien été reçue.
                Nous vous contacterons rapidement pour confirmer votre créneau.
              </p>

              <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-foreground mb-3">Récapitulatif :</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Nom :</strong> {formState.nom}</li>
                  <li><strong>Téléphone :</strong> {formState.telephone}</li>
                  {formState.email && <li><strong>Email :</strong> {formState.email}</li>}
                  <li><strong>Prestation :</strong> {selectedService?.name}</li>
                  <li>
                    <strong>Date souhaitée :</strong>{" "}
                    {new Date(formState.date + "T12:00:00").toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </li>
                  <li><strong>Heure :</strong> {formState.time}</li>
                </ul>
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg mb-6">
                <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground text-left">
                  Un SMS ou WhatsApp de rappel vous sera envoyé la veille de votre rendez-vous.
                </p>
              </div>

              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormState(emptyForm)
                  setErrors({})
                  setSubmitError("")
                }}
                variant="outline"
              >
                Nouvelle réservation
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Réservation en ligne
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Réservez votre créneau en quelques clics.
              Nous vous confirmerons votre rendez-vous par SMS ou WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">

        

          {/* Global submit error */}
          {submitError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Form */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>

              {/* ── Personal Info ─────────────────────────────────────────── */}
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Vos informations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-2">
                      Nom *
                    </label>
                    <Input
                      id="nom"
                      type="text"
                      required
                      value={formState.nom}
                      onChange={(e) => {
                        setFormState({ ...formState, nom: e.target.value })
                        if (errors.nom) setErrors({ ...errors, nom: undefined })
                      }}
                      placeholder="Votre nom"
                      className={`bg-background ${errors.nom ? "border-red-500" : ""}`}
                      aria-describedby={errors.nom ? "nom-error" : undefined}
                    />
                    {errors.nom && (
                      <p id="nom-error" className="mt-1 text-xs text-red-500">{errors.nom}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-foreground mb-2">
                      Téléphone *
                    </label>
                    <Input
                      id="telephone"
                      type="tel"
                      required
                      value={formState.telephone}
                      onChange={(e) => {
                        setFormState({ ...formState, telephone: e.target.value })
                        if (errors.telephone) setErrors({ ...errors, telephone: undefined })
                      }}
                      placeholder="06 12 34 56 78"
                      className={`bg-background ${errors.telephone ? "border-red-500" : ""}`}
                      aria-describedby={errors.telephone ? "tel-error" : undefined}
                    />
                    {errors.telephone && (
                      <p id="tel-error" className="mt-1 text-xs text-red-500">{errors.telephone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email (optionnel)
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => {
                        setFormState({ ...formState, email: e.target.value })
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      placeholder="votre@email.com"
                      className={`bg-background ${errors.email ? "border-red-500" : ""}`}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Service Selection ─────────────────────────────────────── */}
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Prestation *
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        formState.service === service.id
                          ? "border-primary bg-primary/10"
                          : errors.service
                          ? "border-red-300 bg-background hover:border-red-400"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={formState.service === service.id}
                        onChange={(e) => {
                          setFormState({ ...formState, service: e.target.value })
                          if (errors.service) setErrors({ ...errors, service: undefined })
                        }}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <span className="block font-medium text-foreground">{service.name}</span>
                        <span className="text-sm text-muted-foreground">{service.duration}</span>
                      </div>
                      <span className="font-semibold text-primary">{service.price}</span>
                    </label>
                  ))}
                </div>
                {errors.service && (
                  <p className="mt-2 text-xs text-red-500">{errors.service}</p>
                )}
              </div>

              {/* ── Barber Selection ──────────────────────────────────────── */}
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-4">
                  Choix du barbier
                </h2>
                <div className="flex flex-wrap gap-3">
                  {barbers.map((barber) => (
                    <label
                      key={barber.id}
                      className={`px-4 py-2 rounded-full border cursor-pointer transition-colors ${
                        formState.barber === barber.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="barber"
                        value={barber.id}
                        checked={formState.barber === barber.id}
                        onChange={(e) => setFormState({ ...formState, barber: e.target.value })}
                        className="sr-only"
                      />
                      {barber.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Date & Time ───────────────────────────────────────────── */}
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Date et heure
                </h2>

                <div className="mb-4 max-w-xs">
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <Input
                    id="date"
                    type="date"
                    required
                    min={minDate}
                    max={maxDateStr}
                    value={formState.date}
                    onChange={(e) => {
                      setFormState({ ...formState, date: e.target.value })
                      if (errors.date) setErrors({ ...errors, date: undefined })
                    }}
                    className={`bg-background ${errors.date ? "border-red-500" : ""}`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                  )}
                </div>

                {formState.date && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Heure *
                      {loadingSlots && (
                        <span className="ml-2 text-xs text-muted-foreground">Chargement…</span>
                      )}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {timeSlots.map((time) => {
                        const isBooked = bookedTimes.includes(time)
                        const isSelected = formState.time === time
                        return (
                          <label
                            key={time}
                            title={isBooked ? "Créneau indisponible" : time}
                            className={`px-3 py-2 rounded-lg border text-center text-sm transition-colors
                              ${isBooked
                                ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed line-through"
                                : isSelected
                                ? "border-primary bg-primary text-primary-foreground cursor-pointer"
                                : "border-border bg-background text-foreground hover:border-primary/50 cursor-pointer"
                              }`}
                          >
                            <input
                              type="radio"
                              name="time"
                              value={time}
                              checked={isSelected}
                              disabled={isBooked}
                              onChange={(e) => {
                                setFormState({ ...formState, time: e.target.value })
                                if (errors.time) setErrors({ ...errors, time: undefined })
                              }}
                              className="sr-only"
                            />
                            {time}
                          </label>
                        )
                      })}
                    </div>
                    {errors.time && (
                      <p className="mt-2 text-xs text-red-500">{errors.time}</p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Reminder notice ───────────────────────────────────────── */}
              <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
                <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground text-sm mb-1">Rappel automatique</h3>
                  <p className="text-sm text-muted-foreground">
                    Un SMS ou WhatsApp de rappel vous sera envoyé la veille de votre rendez-vous
                    pour vous confirmer l&apos;heure et éviter les oublis.
                  </p>
                </div>
              </div>

              {/* ── Submit ────────────────────────────────────────────────── */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours…" : "Confirmer la réservation"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}