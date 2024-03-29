export default defineNuxtConfig({
  modules: ['../src/module'],
  locale: {
    lang: {
      'en-US': { name: 'English' },
      'zh-CN': { name: '中文（简体）' },
      'ja-JP': { name: '日本語' },
      'ru-RU': { name: 'русский' },
    },
  },
  devtools: { enabled: true },
})
