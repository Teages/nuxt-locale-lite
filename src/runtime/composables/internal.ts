import type { LocaleCode } from "#build/locales/lazy-import"
import { available } from '#build/locales/available'
import { computed, useCookie, useState } from "#imports"
import destr from "destr"

export function useLocalesInternal() {
  const _locales: Array<{ name: string, code: LocaleCode }> = available as any

  const browserPrefer = useState<string[]>('locale-lite:browserAcceptLocale', () => [])
  const browserMatch = computed<LocaleCode | null>(() => {
    const available = new Map<string, string>()
    for (const lang of _locales) {
      available.set(lang.code, lang.code)
      const langCode = lang.code.split('-')
      if (langCode.length > 1) {
        available.set(langCode[0], lang.code)
      }
    }

    for (const lang of browserPrefer.value) {
      if (available.has(lang)) {
        return lang as LocaleCode
      }
    }
    return null
  })
  const userPrefer = useCookie<LocaleCode | null>('locale', {
    maxAge: 35_600 * 24 * 60 * 60, // forever
    decode: val => {
      const parsed = destr<string>(decodeURIComponent(val))
      if (_locales.find(l => l.code === parsed)) {
        return parsed as LocaleCode
      }
      return null
    },
    encode: val => encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val)),
  })
  const locales = computed(() => _locales)

  return {
    locales, browserPrefer, browserMatch, userPrefer,
  }
}
