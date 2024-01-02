export interface LocaleOptions {
  /**
   * The directory where the language files are located.
   */
  langDir: string

  /**
   * The locales data.
   * Use the locale code as the key, and the module will try to find the language source in the `langDir` directory.
   * @example
   * ```ts
   * {
   *   'en-US': { name: 'English' },
   *   'zh-CN': { name: '中文（简体）' },
   *   'ja-JP': { name: '日本語' },
   * }
   * ```
   */
  readonly lang: Record<string, {
    name: string
  }>

  /**
   * The default locale. If not set, the first locale in the `lang` object will be used.
   */
  defaultLocale?: string
}
