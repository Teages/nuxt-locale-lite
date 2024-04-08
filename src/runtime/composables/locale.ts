import { type UseI18nOptions, useI18n } from 'vue-i18n'
import type { WritableComputedRef } from 'vue'
import { useLocalesInternal } from './internal'
import { type LocaleCode, lazyImportLang } from '#build/locales/lazy-import'
import { computed, useHead, useNuxtApp } from '#imports'

type useLocalesArgsType = {
  // get the global i18n instance, it is very useful when you want to use $t out of setup()
  global: true
} | {
  global?: false
  i18n: UseI18nOptions
}

interface useLocalesReturnType {
  t: ReturnType<typeof useI18n>['t']
  loadedLocales: LocaleCode[]
  locales: ReturnType<typeof useLocalesInternal>['locales']
  locale: WritableComputedRef<LocaleCode>
  setLocale: (code: LocaleCode) => Promise<void>
  userPrefer: ReturnType<typeof useLocalesInternal>['userPrefer']
  browserPrefer: ReturnType<typeof useLocalesInternal>['browserPrefer']
  browserMatch: ReturnType<typeof useLocalesInternal>['browserMatch']
  i18n: ReturnType<typeof useI18n>
}

export function useLocales(options?: useLocalesArgsType): useLocalesReturnType {
  const i18n = options?.global === true
    ? useNuxtApp().$i18n.global
    : useI18n()

  const { locale: _locale, availableLocales: loadedLocales, t, setLocaleMessage } = i18n as ReturnType<typeof useI18n>

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
    i18n,
  }
}
