import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Tarifs & Prestations | Barber Shop Évreux",
  description: "Découvrez nos tarifs : coupe homme, taille de barbe, dégradé, soins. Barber Shop Évreux, 15 Bd de la Buffardière.",
}

const services = [
  {
    category: "Coupes",
    items: [
      {
        name: "Coupe Homme",
        description: "Coupe complète avec finitions soignées",
        duration: "30 min",
        price: "18",
      },
      {
        name: "Coupe + Barbe",
        description: "Forfait complet coupe et taille de barbe",
        duration: "45 min",
        price: "28",
      },
      {
        name: "Dégradé / Fade",
        description: "Dégradé américain, skin fade ou mid fade",
        duration: "35 min",
        price: "20",
      },
      {
        name: "Coupe Enfant",
        description: "Pour les moins de 12 ans",
        duration: "20 min",
        price: "12",
      },
      {
        name: "Coupe Étudiant",
        description: "Sur présentation de la carte étudiant",
        duration: "30 min",
        price: "15",
      },
    ],
  },
  {
    category: "Barbe",
    items: [
      {
        name: "Taille de Barbe",
        description: "Taille et mise en forme de la barbe",
        duration: "20 min",
        price: "12",
      },
      {
        name: "Contours Barbe",
        description: "Tracé et contours nets",
        duration: "15 min",
        price: "8",
      },
      {
        name: "Rasage Traditionnel",
        description: "Rasage au coupe-chou avec serviette chaude",
        duration: "25 min",
        price: "18",
      },
    ],
  },
  {
    category: "Soins & Finitions",
    items: [
      {
        name: "Soin Barbe",
        description: "Huile et baume pour une barbe souple et brillante",
        duration: "10 min",
        price: "8",
      },
      {
        name: "Serviette Chaude",
        description: "Relaxation et ouverture des pores",
        duration: "5 min",
        price: "5",
      },
      {
        name: "Coloration Barbe",
        description: "Couverture des cheveux blancs",
        duration: "20 min",
        price: "15",
      },
    ],
  },
]

export default function TarifsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tarifs & Prestations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des services de qualité pour tous les styles. 
              Réservez en ligne ou passez directement au salon.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-16">
            {services.map((category) => (
              <div key={category.category}>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 pb-4 border-b border-border">
                  {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                        <span className="text-2xl font-bold text-primary">{item.price}€</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-12 p-6 bg-secondary/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Les tarifs sont indicatifs et peuvent varier selon les demandes spécifiques. 
              N&apos;hésitez pas à nous contacter pour plus d&apos;informations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Prêt pour votre prochaine coupe ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Réservez votre créneau en quelques clics et profitez d&apos;un moment de détente au salon.
            </p>
            <Button asChild size="lg">
              <Link href="/reservation" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Réserver en ligne
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
