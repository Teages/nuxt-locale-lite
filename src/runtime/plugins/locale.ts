import { createI18n as _createI18n } from 'vue-i18n'
import { decodeBrowserAcceptLang, lazyImportLang } from '../utils'
import { useLocalesInternal } from '../composables/internal'
import { defineNuxtPlugin, useHead, useRequestHeaders } from '#imports'
import { defaultLang } from '#build/locales/available'
import type { LocaleCode } from '#build/locales/lazy-import'

type I18n = Awaited<ReturnType<typeof createI18n>>

async function createI18n(locale: LocaleCode) {
  return _createI18n({
    locale,
    legacy: false,
    globalInjection: true,
    fallbackLocale: defaultLang,
    messages: {
      [defaultLang]: await lazyImportLang(defaultLang),
      ...(locale !== defaultLang
        ? {
            [locale]: await lazyImportLang(locale),
          }
        : {}),
    },
  })
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const { browserPrefer, browserMatch, userPrefer } = useLocalesInternal()

  if (import.meta.server) {
    const rawAcceptLang = useRequestHeaders(['accept-language'])['accept-language'] ?? ''
    browserPrefer.value = [...decodeBrowserAcceptLang(rawAcceptLang)]
  }

  // setup i18n
  const locale = userPrefer.value ?? browserMatch.value ?? defaultLang
  const vueApp = nuxtApp.vueApp
  const i18n = await createI18n(locale)
  vueApp.use(i18n)

  if (import.meta.server) {
    useHead({
      htmlAttrs: {
        lang: locale,
      },
    })
  }

  return {
    provide: {
      i18n,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $i18n: I18n
  }
}
