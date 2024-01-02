import { globSync } from "glob"
import { genDynamicImport } from "knitwork"
import { relative } from "pathe"

export function genAvailableLocalesCode(
  available: Array<{ code: string, name: string }>,
  defaultLang: string,
) {
  const code = [
    `export const available = ${JSON.stringify(available)}`,
    `export const defaultLang = '${defaultLang}'`
  ].join('\n')

  const type = [
    `export declare const available: { code: string, name: string }[]`,
    `export declare const defaultLang: '${defaultLang}'`
  ].join('\n')

  return { code, type }
}

export function genLazyImportLangCode(
  lang: Record<string, any>,
  resolve: (...path: string[]) => string,
) {
  const code = [
    `const locales = {`,
    Object.entries(lang).map(([code]) => {
      const langPath = resolve(code)
      const paths = globSync(resolve(code, '**/*.json'))
      return [
        `  '${code}': async () => ({`,
        paths.map((p) => {
          const absPath = relative(langPath, p)
          const name = absPath
            .replace(/\.json$/, '')
            .replace(/\//g, '.')
          return `    ${name}: (await (${genDynamicImport(p)})()).default`
        }).join(',\n'),
        `  })`
      ].join('\n')
    }),
    `}`,
    `export function lazyImportLang(locale) {`,
    `  return locales[locale]()`,
    `}`
  ].join('\n')

  const type = [
    `interface LocaleRecord {`,
    `  [key: string]: string | LocaleRecord;`,
    `}`,
    `type LocaleCode = ${Object.keys(lang).map((code) => `'${code}'`).join(' | ')};`,
    `export function lazyImportLang(locale: LocaleCode): Promise<LocaleRecord>`
  ].join('\n')

  return { code, type }
}
