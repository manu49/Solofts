import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function safetyColor(score: number): string {
  if (score >= 8) return '#7DBB8A'   // sage green
  if (score >= 6) return '#FFB830'   // gold
  return '#FF4D4D'                   // coral/red
}

export function safetyLabel(score: number): string {
  if (score >= 8) return 'Very Safe'
  if (score >= 6) return 'Generally Safe'
  if (score >= 4) return 'Use Caution'
  return 'Extra Caution'
}

export const TAG_LABELS: Record<string, string> = {
  wild_solo:       '🌿 Wild Solo',
  budget:          '💰 Budget',
  first_timer:     '✨ First Timer',
  career_traveler: '💼 Career Traveler',
  road_trip:       '🚗 Road Trip',
  backpacking:     '🎒 Backpacking',
  luxury:          '✨ Luxury',
  adventure:       '⛰️ Adventure',
  digital_nomad:   '💻 Digital Nomad',
}

export const GEAR_CATEGORY_LABELS: Record<string, string> = {
  camera:     '📷 Camera',
  safety:     '🛡️ Safety',
  backpack:   '🎒 Backpack',
  clothing:   '👕 Clothing',
  tech:       '📱 Tech',
  health:     '💊 Health',
  navigation: '🗺️ Navigation',
  sleep:      '😴 Sleep',
  footwear:   '👟 Footwear',
  other:      '📦 Other',
}
