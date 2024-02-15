/**
 * decode accept-language:
 * keep browser locale order, add the language without region code
 * and keep user's language code order
 */
export function decodeBrowserAcceptLang(rawAcceptLang: string): string[] {
  const acceptLang = rawAcceptLang
    .split(',')
    .map((lang) => {
      const [name, langQ] = lang.split(';')
      const q = langQ ? Number.parseFloat(langQ.split('=')[1]) : 1
      const langM = { code: name, q }
      return langM
    }).sort((a, b) => b.q - a.q)
  const langSet = new Set<string>()
  const keepSet = new Set<string>()
  for (const lang of acceptLang) {
    langSet.add(lang.code)
    const langCode = lang.code.split('-')
    if (langCode.length > 1) {
      if (langSet.has(langCode[0]) && !keepSet.has(langCode[0])) {
        langSet.delete(langCode[0])
      }
      langSet.add(langCode[0])
    }
    else {
      keepSet.add(lang.code)
    }
  }
  return [...langSet]
}

/**
 * import locale file dynamically
 */
export { lazyImportLang } from '#build/locales/lazy-import'
