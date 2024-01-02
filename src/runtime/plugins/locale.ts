import { defineNuxtPlugin, useHead, useRequestHeaders } from '#imports'
import { createI18n } from 'vue-i18n'
import { decodeBrowserAcceptLang, lazyImportLang } from '../utils'
import { useLocalesInternal } from '../composables/internal'
import { defaultLang } from '#build/locales/available'


export default defineNuxtPlugin(async (nuxtApp) => {
  const { browserPrefer, browserMatch, userPrefer } = useLocalesInternal()

  if (process.server) {
    const rawAcceptLang = useRequestHeaders(['accept-language'])['accept-language'] ?? ''
    browserPrefer.value = [...decodeBrowserAcceptLang(rawAcceptLang)]
  }

  // setup i18n
  const locale = userPrefer.value ?? browserMatch.value ?? defaultLang
  const vueApp = nuxtApp.vueApp
  const i18n = createI18n({
    locale,
    legacy: false,
    globalInjection: true,
    fallbackLocale: defaultLang,
    messages: {
      [defaultLang]: await lazyImportLang(defaultLang),
      ...(locale !== defaultLang ? {
        [locale]: await lazyImportLang(locale),
      } : {}),
    },
  })
  vueApp.use(i18n)

  if (process.server) {
    useHead({
      htmlAttrs: {
        lang: locale,
      },
    })
  }
})
