"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, CheckCircle, Bell, ExternalLink } from "lucide-react"

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
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
]

export default function ReservationPage() {
  const [formState, setFormState] = useState({
    nom: "",
    telephone: "",
    email: "",
    service: "",
    barber: "any",
    date: "",
    time: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const selectedService = services.find(s => s.id === formState.service)

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get date 30 days from now as maximum
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

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
                  <li><strong>Prestation :</strong> {selectedService?.name}</li>
                  <li><strong>Date souhaitée :</strong> {new Date(formState.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
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
                  setFormState({
                    nom: "",
                    telephone: "",
                    email: "",
                    service: "",
                    barber: "any",
                    date: "",
                    time: "",
                  })
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
          {/* External Platform Link */}
          <div className="bg-secondary/50 border border-border rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Réservation instantanée</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Vous pouvez également réserver directement via notre plateforme partenaire 
                  pour une confirmation immédiate.
                </p>
                <Button asChild variant="outline" size="sm">
                  <a 
                    href="https://www.planity.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Réserver sur Planity
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
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
                      onChange={(e) => setFormState({ ...formState, nom: e.target.value })}
                      placeholder="Votre nom"
                      className="bg-background"
                    />
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
                      onChange={(e) => setFormState({ ...formState, telephone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      className="bg-background"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email (optionnel)
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Prestation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        formState.service === service.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={formState.service === service.id}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
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
              </div>

              {/* Barber Selection */}
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

              {/* Date & Time */}
              <div>
                <h2 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Date et heure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
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
                      onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>
                
                {formState.date && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Heure *
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {timeSlots.map((time) => (
                        <label
                          key={time}
                          className={`px-3 py-2 rounded-lg border text-center cursor-pointer transition-colors text-sm ${
                            formState.time === time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="time"
                            value={time}
                            checked={formState.time === time}
                            onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                            className="sr-only"
                          />
                          {time}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reminder Info */}
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

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || !formState.service || !formState.date || !formState.time}
              >
                {isSubmitting ? "Envoi en cours..." : "Confirmer la réservation"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
