"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  // Replace with the actual WhatsApp number (without + or spaces)
  const whatsappNumber = "33952655185"
  const message = encodeURIComponent("Bonjour, je souhaite prendre rendez-vous au Barber Shop.")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
