import { addImports, addPlugin, addTemplate, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { LocaleOptions } from './options'
import { genAvailableLocalesCode, genLazyImportLangCode } from './gen'

export default defineNuxtModule<LocaleOptions>({
  meta: {
    name: '@teages/nuxt-locale-lite',
    configKey: 'locale',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    langDir: 'locales',
    lang: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const srcResolver = createResolver(nuxt.options.srcDir)
    const localesResolver = createResolver(srcResolver.resolve(
      options.langDir,
    ))

    const logger = useLogger('nuxt-locale-lite')

    const lang = options.lang

    if (Object.keys(lang).length === 0) {
      lang['en-US'] = { name: 'English' }
      logger.warn('No language is configured, added English (en-US) as default.')
    }

    const available = Object.entries(options.lang).map(([code, lang]) => {
      return {
        code,
        name: lang.name,
      }
    })
    const defaultLang = options.defaultLocale ?? available[0].code

    const availableCodes = genAvailableLocalesCode(available, defaultLang)
    addTemplate({
      filename: 'locales/available.mjs',
      getContents: () => availableCodes.code,
    })
    addTypeTemplate({
      filename: 'locales/available.d.ts',
      getContents: () => availableCodes.type,
    })

    const lazyImportLangCode = genLazyImportLangCode(options.lang, localesResolver.resolve)
    addTemplate({
      filename: 'locales/lazy-import.mjs',
      getContents: () => lazyImportLangCode.code,
    })
    addTypeTemplate({
      filename: 'locales/lazy-import.d.ts',
      getContents: () => lazyImportLangCode.type,
    })

    addPlugin(resolver.resolve('./runtime/plugins/locale'))
    addImports({
      name: 'useLocales',
      as: 'useLocales',
      from: resolver.resolve('./runtime/composables/locale'),
    })
  },
})
