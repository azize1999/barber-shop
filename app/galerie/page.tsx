"use client"

import { useState } from "react"
import Image from "next/image"
import { Metadata } from "next"
import { X } from "lucide-react"

const galleryImages = [
  {
    src: "/images/gallery/fade-1.jpg",
    alt: "Dégradé fade précis",
    category: "Coupes",
  },
  {
    src: "/images/gallery/beard-1.jpg",
    alt: "Barbe sculptée avec contours nets",
    category: "Barbes",
  },
  {
    src: "/images/gallery/curly-1.jpg",
    alt: "Coupe cheveux bouclés avec dégradé",
    category: "Coupes",
  },
  {
    src: "/images/gallery/classic-1.jpg",
    alt: "Coupe classique pompadour",
    category: "Coupes",
  },
  {
    src: "/images/gallery/fade-2.jpg",
    alt: "Mid fade texturé moderne",
    category: "Coupes",
  },
  {
    src: "/images/gallery/beard-2.jpg",
    alt: "Contours barbe précis",
    category: "Barbes",
  },
  {
    src: "/images/haircut-fade.jpg",
    alt: "Dégradé américain",
    category: "Coupes",
  },
  {
    src: "/images/beard-trim.jpg",
    alt: "Taille de barbe professionnelle",
    category: "Barbes",
  },
]

const categories = ["Tous", "Coupes", "Barbes"]

export default function GaleriePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const filteredImages = selectedCategory === "Tous" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Galerie Photos
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos réalisations : coupes, dégradés, barbes et styles variés. 
              Inspirez-vous pour votre prochaine visite.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setLightboxImage(image.src)}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-start p-4">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                    {image.alt}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            onClick={() => setLightboxImage(null)}
            aria-label="Fermer"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Image agrandie"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
