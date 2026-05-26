"use client"

import React from 'react'

interface StatusBadgeProps {
  status: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const base = 'inline-block px-2 py-1 rounded-full text-xs font-medium'
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REFUSED: 'bg-red-100 text-red-800',
  }
  const colorClass = colors[status] || 'bg-gray-100 text-gray-800'
  return <span className={`${base} ${colorClass}`}>{status}</span>
}
