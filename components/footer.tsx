import Link from "next/link"
import { Scissors, MapPin, Phone, Clock } from "lucide-react"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "Galerie", href: "/galerie" },
  
  { name: "Réservation", href: "/reservation" },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-semibold text-foreground">
                Barber Shop
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre barbier à Évreux. Spécialiste coiffure homme, barbe et dégradés depuis des années.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <a 
                  href="https://maps.google.com/?q=15+Bd+de+la+Buffardière,+27000+Évreux" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  15 Bd de la Buffardière<br />27000 Évreux
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:0952655185" className="hover:text-primary transition-colors">
                  09 52 65 51 85
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Horaires</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Lun - Ven: 9h - 19h</span>
              </li>
              <li className="pl-6">Samedi: 9h - 18h</li>
              <li className="pl-6">Dimanche: Fermé</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Barber Shop Évreux. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
