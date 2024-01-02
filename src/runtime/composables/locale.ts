import { useI18n } from 'vue-i18n'
import { lazyImportLang, type LocaleCode } from '#build/locales/lazy-import'
import { computed, useHead } from '#imports'
import { useLocalesInternal } from './internal'
import type { WritableComputedRef } from 'vue'

export function useLocales(): {
  t: ReturnType<typeof useI18n>['t']
  loadedLocales: string[]
  locales: ReturnType<typeof useLocalesInternal>['locales']
  locale: WritableComputedRef<LocaleCode>
  setLocale: (code: LocaleCode) => Promise<void>
  userPrefer: ReturnType<typeof useLocalesInternal>['userPrefer']
  browserPrefer: ReturnType<typeof useLocalesInternal>['browserPrefer']
  browserMatch: ReturnType<typeof useLocalesInternal>['browserMatch']
} {
  const { locale: _locale, availableLocales: loadedLocales, t, setLocaleMessage } = useI18n()
  const { locales, browserPrefer, browserMatch, userPrefer } = useLocalesInternal()

  const setLocaleWithoutSave = async (code: string) => {
    // lazy load
    if (locales.value.find(l => l.code === code && !loadedLocales.includes(code))) {
      const m = await lazyImportLang(code as any)
      console.log('set locale', code, m)
      setLocaleMessage(code, m)
      loadedLocales.push(code)
    }
    _locale.value = code
  }

  const setLocale = (code: LocaleCode) => {
    userPrefer.value = code
    useHead({
      htmlAttrs: {
        lang: code,
        // lang: code
      },
    })
    return setLocaleWithoutSave(code)
  }

  const locale = computed<LocaleCode>({
    get: () => userPrefer.value ?? browserMatch.value ?? _locale.value,
    set: setLocale,
  })

  return { t, loadedLocales, locales, locale, setLocale, userPrefer, browserPrefer, browserMatch }
}
