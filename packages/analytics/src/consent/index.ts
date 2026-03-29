import { z } from 'zod'
import type { ConsentState, ConsentManager } from '../types'

/**
 * Consent management system
 * Implements privacy-compliant consent handling for 2026 standards
 */

// Consent categories for granular consent
export const ConsentCategorySchema = z.enum([
  'analytics',
  'marketing', 
  'functional',
  'essential'
])
export type ConsentCategory = z.infer<typeof ConsentCategorySchema>

// Consent configuration
export interface ConsentConfig {
  defaultState: ConsentState
  categories: ConsentCategory[]
  cookieDomain?: string
  cookieExpiryDays?: number
  consentRefreshDays?: number
}

// Consent storage interface
export interface ConsentStorage {
  getConsent(category?: ConsentCategory): ConsentState
  setConsent(consent: ConsentState, category?: ConsentCategory): void
  clearConsent(): void
}

// Browser-based consent storage using cookies/localStorage
export class BrowserConsentStorage implements ConsentStorage {
  private cookieDomain?: string
  private cookieExpiryDays: number

  constructor(config: { cookieDomain?: string; cookieExpiryDays?: number } = {}) {
    this.cookieDomain = config.cookieDomain
    this.cookieExpiryDays = config.cookieExpiryDays || 365
  }

  private getCookieKey(category?: ConsentCategory): string {
    const baseKey = 'analytics_consent'
    return category ? `${baseKey}_${category}` : baseKey
  }

  private setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') return

    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    
    let cookie = `${name}=${value};${expires};path=/`
    if (this.cookieDomain) {
      cookie += `;domain=${this.cookieDomain}`
    }
    
    document.cookie = cookie
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null

    const nameEQ = `${name}=`
    const cookies = document.cookie.split(';')
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length)
      }
    }
    return null
  }

  getConsent(category?: ConsentCategory): ConsentState {
    // Try localStorage first (server-side compatible)
    if (typeof localStorage !== 'undefined') {
      const key = this.getCookieKey(category)
      const stored = localStorage.getItem(key)
      if (stored) {
        return stored as ConsentState
      }
    }

    // Fallback to cookies
    const cookieValue = this.getCookie(this.getCookieKey(category))
    return cookieValue as ConsentState || 'unknown'
  }

  setConsent(consent: ConsentState, category?: ConsentCategory): void {
    const key = this.getCookieKey(category)

    // Store in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, consent)
    }

    // Store in cookies
    this.setCookie(key, consent, this.cookieExpiryDays)
  }

  clearConsent(): void {
    const categories: ConsentCategory[] = ['analytics', 'marketing', 'functional', 'essential']
    
    categories.forEach(category => {
      const key = this.getCookieKey(category)
      
      // Clear from localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key)
      }
      
      // Clear from cookies
      if (typeof document !== 'undefined') {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
      }
    })
  }
}

// Server-side consent storage (for trusted_server surface)
export class ServerConsentStorage implements ConsentStorage {
  private consentStore: Map<string, ConsentState> = new Map()

  getConsent(category?: ConsentCategory): ConsentState {
    const key = category ? `analytics_consent_${category}` : 'analytics_consent'
    return this.consentStore.get(key) || 'unknown'
  }

  setConsent(consent: ConsentState, category?: ConsentCategory): void {
    const key = category ? `analytics_consent_${category}` : 'analytics_consent'
    this.consentStore.set(key, consent)
  }

  clearConsent(): void {
    this.consentStore.clear()
  }
}

// Default consent manager implementation
export class DefaultConsentManager implements ConsentManager {
  private storage: ConsentStorage
  private callbacks: Array<(consent: ConsentState) => void> = []
  private currentConsent: ConsentState = 'unknown'

  constructor(storage: ConsentStorage) {
    this.storage = storage
    this.currentConsent = this.storage.getConsent()
  }

  getCurrentConsent(): ConsentState {
    return this.currentConsent
  }

  setConsent(consent: ConsentState): void {
    const previousConsent = this.currentConsent
    this.currentConsent = consent
    this.storage.setConsent(consent)

    // Notify callbacks if consent changed
    if (previousConsent !== consent) {
      this.callbacks.forEach(callback => callback(consent))
    }
  }

  onConsentChange(callback: (consent: ConsentState) => void): void {
    this.callbacks.push(callback)
  }

  // Check if consent allows tracking
  canTrack(category: ConsentCategory = 'analytics'): boolean {
    const consent = this.getCurrentConsent()
    
    // Essential cookies can always be used
    if (category === 'essential') return true
    
    // Check consent state
    return consent === 'granted'
  }

  // Get consent for specific category
  getCategoryConsent(category: ConsentCategory): ConsentState {
    return this.storage.getConsent(category)
  }

  // Set consent for specific category
  setCategoryConsent(category: ConsentCategory, consent: ConsentState): void {
    this.storage.setConsent(consent, category)
  }
}

// Factory function to create appropriate consent manager
export function createConsentManager(
  surface: 'marketing_site' | 'product_app' | 'trusted_server',
  config?: ConsentConfig
): ConsentManager {
  const storage = surface === 'trusted_server' 
    ? new ServerConsentStorage()
    : new BrowserConsentStorage({
        cookieDomain: config?.cookieDomain,
        cookieExpiryDays: config?.cookieExpiryDays
      })

  return new DefaultConsentManager(storage)
}

// Export types
export * from '../types'
