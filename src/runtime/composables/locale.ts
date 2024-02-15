import { useI18n } from 'vue-i18n'
import type { WritableComputedRef } from 'vue'
import { useLocalesInternal } from './internal'
import { type LocaleCode, lazyImportLang } from '#build/locales/lazy-import'
import { computed, useHead } from '#imports'

export function useLocales(): {
  t: ReturnType<typeof useI18n>['t']
  loadedLocales: LocaleCode[]
  locales: ReturnType<typeof useLocalesInternal>['locales']
  locale: WritableComputedRef<LocaleCode>
  setLocale: (code: LocaleCode) => Promise<void>
  userPrefer: ReturnType<typeof useLocalesInternal>['userPrefer']
  browserPrefer: ReturnType<typeof useLocalesInternal>['browserPrefer']
  browserMatch: ReturnType<typeof useLocalesInternal>['browserMatch']
} {
  const { locale: _locale, availableLocales: loadedLocales, t, setLocaleMessage } = useI18n()
  const { locales, browserPrefer, browserMatch, userPrefer } = useLocalesInternal()

  const setLocaleWithoutSave = async (code: LocaleCode) => {
    // lazy load
    if (locales.value.find(l => l.code === code && !loadedLocales.includes(code))) {
      const m = await lazyImportLang(code)
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
      },
    })
    return setLocaleWithoutSave(code)
  }

  const locale = computed<LocaleCode>({
    get: () => userPrefer.value ?? browserMatch.value ?? _locale.value as LocaleCode,
    set: setLocale,
  })

  return {
    t,
    loadedLocales: loadedLocales as LocaleCode[],
    locales,
    locale,
    setLocale,
    userPrefer,
    browserPrefer,
    browserMatch,
  }
}
