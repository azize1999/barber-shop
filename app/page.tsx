import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Calendar, MapPin, Clock, Scissors, Award, Users, Sparkles } from "lucide-react"

const features = [
  {
    icon: Scissors,
    title: "Spécialiste Homme",
    description: "Coupes modernes, dégradés, fades et finitions impeccables pour un style affirmé.",
  },
  {
    icon: Award,
    title: "Expertise Barbe",
    description: "Taille, contours et soins pour une barbe parfaitement sculptée et entretenue.",
  },
  {
    icon: Users,
    title: "Ambiance Conviviale",
    description: "Un moment de détente entre hommes dans une atmosphère chaleureuse.",
  },
  {
    icon: Sparkles,
    title: "Rapide & Efficace",
    description: "Service professionnel sans prise de tête, respectueux de votre temps.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-barber.jpg"
            alt="Intérieur du Barber Shop Évreux"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Barber Shop
            <span className="block text-primary mt-2">Coiffeur Barbier à Évreux</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            15 Bd de la Buffardière. Dégradés précis, barbes sculptées, style moderne. 
            Votre coiffeur homme dans le quartier Bel-Ébat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/reservation" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Prendre rendez-vous
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a href="tel:0952655185" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                09 52 65 51 85
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <a 
                href="https://wa.me/33952655185?text=Bonjour,%20je%20souhaite%20prendre%20rendez-vous." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Quick Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>15 Bd de la Buffardière, Évreux</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Lun-Ven 9h-19h | Sam 9h-18h</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Info Section with Map */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Info */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Nous trouver
              </h2>
              <div className="space-y-6">
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
                      15 Bd de la Buffardière<br />27000 Évreux, France
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
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      09 52 65 51 85
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
            </div>

            {/* Map */}
            <div className="h-[400px] rounded-xl overflow-hidden border border-border">
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
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une expérience barbier authentique au coeur d&apos;Évreux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Des coupes et des barbes impeccables
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Que vous cherchiez un dégradé tendance, une coupe classique ou un entretien de barbe soigné, 
                notre équipe de barbiers expérimentés vous garantit un résultat à la hauteur de vos attentes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Coupe homme et dégradés
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Taille et sculptage de barbe
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Contours et finitions précises
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Soins et conseils personnalisés
                </li>
              </ul>
              <Button asChild>
                <Link href="/tarifs">Voir nos tarifs</Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image
                  src="/images/haircut-fade.jpg"
                  alt="Dégradé coupe homme"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden mt-8">
                <Image
                  src="/images/beard-trim.jpg"
                  alt="Taille de barbe"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prêt pour un nouveau style ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Réservez votre créneau en ligne ou appelez-nous directement. 
              Nous vous accueillons du lundi au samedi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/reservation" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Réserver maintenant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:0952655185" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Appeler le salon
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
