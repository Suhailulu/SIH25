import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en.json'
import ta from '../locales/ta.json'
import hi from '../locales/hi.json'

export type LanguageCode = 'en' | 'ta' | 'hi'

interface AccessibilitySettings {
  highContrast: boolean
  fontSizeScale: 'normal' | 'large' | 'xlarge'
  reducedMotion: boolean
}

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (keyPath: string, fallback?: string) => string
  accessibility: AccessibilitySettings
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void
}

const dictionaries: Record<LanguageCode, any> = { en, ta, hi }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANG_STORAGE_KEY = 'lst_selected_lang'
const A11Y_STORAGE_KEY = 'lst_a11y_settings'

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    return (saved as LanguageCode) || 'en'
  })

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY)
    return saved ? JSON.parse(saved) : { highContrast: false, fontSizeScale: 'normal', reducedMotion: false }
  })

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(accessibility))
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }

    if (accessibility.fontSizeScale === 'large') {
      document.documentElement.style.fontSize = '18px'
    } else if (accessibility.fontSizeScale === 'xlarge') {
      document.documentElement.style.fontSize = '20px'
    } else {
      document.documentElement.style.fontSize = '16px'
    }
  }, [accessibility])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
  }

  const updateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...updates }))
  }

  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.')
    let current = dictionaries[language]

    for (const k of keys) {
      if (!current || typeof current !== 'object') {
        current = undefined
        break
      }
      current = current[k]
    }

    if (typeof current === 'string') return current

    // Fallback to English dictionary
    let enCurrent = dictionaries['en']
    for (const k of keys) {
      if (!enCurrent || typeof enCurrent !== 'object') {
        enCurrent = undefined
        break
      }
      enCurrent = enCurrent[k]
    }

    if (typeof enCurrent === 'string') return enCurrent

    return fallback || keyPath
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        accessibility,
        updateAccessibility
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
