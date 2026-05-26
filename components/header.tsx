"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "Galerie", href: "/galerie" },
  { name: "Contact", href: "/contact" },
  { name: "Réservation", href: "/reservation" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold text-foreground">
            Barber Shop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Button asChild variant="outline" size="sm">
            <a href="tel:0952655185" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Appeler
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/reservation">Réserver</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button asChild variant="outline" className="w-full">
                <a href="tel:0952655185" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  09 52 65 51 85
                </a>
              </Button>
              <Button asChild className="w-full">
                <Link href="/reservation">Prendre rendez-vous</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
