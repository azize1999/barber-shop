"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  XCircle,
  Trash2,
  LogOut,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

type Reservation = {
  id: number
  name: string
  telephone: string
  email: string | null
  service: string
  barber: string
  date: string
  time: string
  status: "PENDING" | "ACCEPTED" | "REFUSED"
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REFUSED: "bg-red-100 text-red-800",
}

export default function AdminReservations() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [token, setToken] = useState("") // stored in memory only — never in localStorage

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // ── Auth ────────────────────────────────────────────────────────────────────
  // Password is verified by the API (server-side). We never compare it in the
  // browser — removing the NEXT_PUBLIC_ADMIN_PASSWORD exposure entirely.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    if (!password.trim()) {
      setAuthError("Veuillez saisir le mot de passe")
      return
    }

    // Probe the API to verify credentials before granting access
    const res = await fetch("/api/reservations", {
      headers: { Authorization: `Bearer ${password}` },
    })

    if (res.ok) {
      setToken(password)
      setAuthenticated(true)
      setPassword("") // clear from state immediately
    } else if (res.status === 401 || res.status === 403) {
      setAuthError("Mot de passe incorrect")
    } else {
      setAuthError("Erreur de connexion. Réessayez.")
    }
  }

  const handleLogout = () => {
    setAuthenticated(false)
    setToken("")
    setReservations([])
    setFilterStatus("")
    setFilterDate("")
  }

  // ── Data fetching ───────────────────────────────────────────────────────────

  const fetchReservations = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setFetchError("")
    try {
      const params = new URLSearchParams()
      if (filterDate) params.append("date", filterDate)
      const url = `/api/reservations${params.toString() ? `?${params}` : ""}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setReservations(data)
    } catch {
      setFetchError("Impossible de charger les réservations.")
    } finally {
      setLoading(false)
    }
  }, [token, filterDate])

  // Initial load + re-fetch when filters change
  useEffect(() => {
    if (authenticated) fetchReservations()
  }, [authenticated, fetchReservations])

  // Auto-refresh every 30 s (only when tab is visible)
  useEffect(() => {
    if (!authenticated) return
    const interval = setInterval(() => {
      if (!document.hidden) fetchReservations()
    }, 15_000)
    return () => clearInterval(interval)
  }, [authenticated, fetchReservations])

  // ── Actions ─────────────────────────────────────────────────────────────────

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/reservations", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) return
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: status as Reservation["status"] } : r))
    )
  }

  const deleteReservation = async (id: number) => {
    if (!confirm("Supprimer définitivement cette réservation ?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/reservations?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  // ── Filtered list ───────────────────────────────────────────────────────────

  const filtered = reservations.filter((r) =>
    filterStatus ? r.status === filterStatus : true
  )

  // ── Login screen ─────────────────────────────────────────────────────────────

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <form onSubmit={handleLogin} className="space-y-4 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-foreground text-center">Admin</h2>
          <p className="text-sm text-muted-foreground text-center">
            Accès réservé à l&apos;équipe de gestion
          </p>

          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setAuthError("")
            }}
            className={authError ? "border-red-500" : ""}
            autoComplete="current-password"
          />

          {authError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {authError}
            </div>
          )}

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </div>
    )
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen py-8 bg-background px-4 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Gestion des réservations
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReservations} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(["PENDING", "ACCEPTED", "REFUSED"] as const).map((s) => {
          const count = reservations.filter((r) => r.status === s).length
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${filterStatus === s ? "ring-2 ring-offset-1 ring-current" : ""}
                ${STATUS_STYLES[s]}`}
            >
              {STATUS_LABELS[s]} · {count}
            </button>
          )
        })}
        {filterStatus && (
          <button
            onClick={() => setFilterStatus("")}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground"
          >
            Tout afficher
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-background max-w-xs"
          placeholder="Filtrer par date"
        />
        {filterDate && (
          <Button variant="outline" size="sm" onClick={() => setFilterDate("")}>
            Effacer la date
          </Button>
        )}
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 text-sm text-red-600 mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {fetchError}
        </div>
      )}

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full table-auto">
          <thead className="bg-card">
            <tr>
              {["Nom & Contact", "Service", "Barbier", "Date / Heure", "Reçu le", "Statut", "Actions"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {loading ? "Chargement…" : "Aucune réservation trouvée"}
                </td>
              </tr>
            )}
            {filtered.map((res) => (
              <tr key={res.id} className="hover:bg-card/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{res.name}</p>
                  <a
                    href={`tel:${res.telephone}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3 w-3" />
                    {res.telephone}
                  </a>
                  {res.email && (
                    <a
                      href={`mailto:${res.email}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-3 w-3" />
                      {res.email}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{res.service}</td>
                <td className="px-4 py-3 text-sm text-foreground capitalize">{res.barber}</td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {new Date(res.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                  <br />
                  <span className="text-muted-foreground">{res.time}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(res.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[res.status]}`}
                  >
                    {STATUS_LABELS[res.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(res.id, "ACCEPTED")}
                      disabled={res.status === "ACCEPTED"}
                      title="Accepter"
                      className="h-8 w-8 p-0"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(res.id, "REFUSED")}
                      disabled={res.status === "REFUSED"}
                      title="Refuser"
                      className="h-8 w-8 p-0"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReservation(res.id)}
                      disabled={deletingId === res.id}
                      title="Supprimer"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {loading ? "Chargement…" : "Aucune réservation trouvée"}
          </p>
        )}
        {filtered.map((res) => (
          <div key={res.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{res.name}</p>
                <a href={`tel:${res.telephone}`} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {res.telephone}
                </a>
                {res.email && (
                  <a href={`mailto:${res.email}`} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {res.email}
                  </a>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[res.status]}`}>
                {STATUS_LABELS[res.status]}
              </span>
            </div>

            <div className="text-sm text-foreground space-y-1">
              <p><span className="text-muted-foreground">Prestation :</span> {res.service}</p>
              <p>
                <span className="text-muted-foreground">Date :</span>{" "}
                {new Date(res.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                à {res.time}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-green-700"
                onClick={() => updateStatus(res.id, "ACCEPTED")}
                disabled={res.status === "ACCEPTED"}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accepter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600"
                onClick={() => updateStatus(res.id, "REFUSED")}
                disabled={res.status === "REFUSED"}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Refuser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteReservation(res.id)}
                disabled={deletingId === res.id}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}