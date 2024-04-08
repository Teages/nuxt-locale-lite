import { addImports, addPlugin, addTemplate, addTypeTemplate, createResolver, defineNuxtModule, updateTemplates, useLogger } from '@nuxt/kit'
import type { LocaleOptions } from './options'
import { genAvailableLocalesCode, genAvailableLocalesType, genLazyImportLangCode, genLazyImportLangCodeType } from './gen'

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
    const langDir = srcResolver.resolve(options.langDir)
    const localesResolver = createResolver(langDir)

    const logger = useLogger('nuxt-locale-lite')

    const lang = options.lang

    if (Object.keys(lang).length === 0) {
      lang['en-US'] = { name: 'English' }
      logger.warn('No language is configured, added English (en-US) as default.')
    }

    const available = Object.entries(lang).map(([code, lang]) => {
      return {
        code,
        name: lang.name,
      }
    })
    const defaultLang = options.defaultLocale ?? available[0].code

    addTemplate({
      filename: 'locales/available.mjs',
      getContents: () => genAvailableLocalesCode(available, defaultLang),
    })
    addTypeTemplate({
      filename: 'locales/available.d.ts',
      getContents: () => genAvailableLocalesType(available, defaultLang),
    })
    addTemplate({
      filename: 'locales/lazy-import.mjs',
      getContents: () => genLazyImportLangCode(lang, localesResolver.resolve),
    })
    addTypeTemplate({
      filename: 'locales/lazy-import.d.ts',
      getContents: () => genLazyImportLangCodeType(lang),
    })

    // HMR updates
    nuxt.hooks.hook('builder:watch', async (event, path) => {
      // no file add or remove, skip
      if (event === 'change') {
        return
      }

      // only watch langDir
      if (!srcResolver.resolve(path).startsWith(langDir)) {
        return
      }

      const templatesName = [
        'locales/available.mjs',
        'locales/available.d.ts',
        'locales/lazy-import.mjs',
        'locales/lazy-import.d.ts',
      ]

      await updateTemplates({
        filter: template => templatesName.includes(template.filename),
      })
    })

    addPlugin(resolver.resolve('./runtime/plugins/locale'))
    addImports({
      name: 'useLocales',
      as: 'useLocales',
      from: resolver.resolve('./runtime/composables/locale'),
    })
  },
})
