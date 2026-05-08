"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Clock, MessageCircle, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    nom: "",
    telephone: "",
    email: "",
    message: "",
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
    setFormState({ nom: "", telephone: "", email: "", message: "" })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une question ? Besoin d&apos;informations ? Contactez-nous par téléphone, 
              WhatsApp ou via le formulaire ci-dessous.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                    <a 
                      href="https://maps.google.com/?q=15+Bd+de+la+Buffardière,+27000+Évreux" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Barber Shop<br />
                      15 Bd de la Buffardière<br />
                      27000 Évreux, France
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                    <a 
                      href="tel:0952655185"
                      className="text-muted-foreground hover:text-primary transition-colors text-lg"
                    >
                      09 52 65 51 85
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                    <a 
                      href="https://wa.me/33952655185?text=Bonjour,%20je%20souhaite%20prendre%20rendez-vous."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Envoyer un message WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Horaires</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lundi - Vendredi: 9h00 - 19h00</p>
                      <p>Samedi: 9h00 - 18h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="h-[300px] rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2610.6!2d1.1489!3d49.0208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e1c7f0c8c8c8c7%3A0x1234567890abcdef!2s15%20Bd%20de%20la%20Buffardi%C3%A8re%2C%2027000%20%C3%89vreux!5e0!3m2!1sfr!2sfr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Barber Shop Évreux"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Envoyez-nous un message
              </h2>
              
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">Message envoyé !</h3>
                    <p className="text-muted-foreground">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
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

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message / Prestation souhaitée *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Décrivez votre demande ou la prestation souhaitée..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Nous répondons rapidement pour confirmer un créneau ou vous rappeler.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
