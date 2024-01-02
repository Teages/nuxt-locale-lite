# @teages/nuxt-locale-lite

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Use minimal configuration to setup i18n for your Nuxt app.

## Quick Setup

1. Add `@teages/nuxt-locale-lite` dependency to your project

```bash
# Using pnpm
pnpm add -D @teages/nuxt-locale-lite

# Using yarn
yarn add --dev @teages/nuxt-locale-lite

# Using npm
npm install --save-dev @teages/nuxt-locale-lite
```

2. Add `@teages/nuxt-locale-lite` to the `modules` section of `nuxt.config.ts`, and configure it:

```ts
export default defineNuxtConfig({
  modules: [
    '@teages/nuxt-locale-lite'
  ],

  locale: {
    lang: {
      'en-US': { name: 'English' },
      'zh-CN': { name: '中文（简体）' },
      'ja-JP': { name: '日本語' },
    },
  },
})
```

3. Setup VSCode

> You need to install [i18n-ally](https://github.com/lokalise/i18n-ally).

Add these config to your `settings.json`:

```jsonc
{
  "i18n-ally.localesPaths": [
    "locales" // or any other path you configured
  ],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.pathMatcher": "{locale}/{namespaces}.json",
  "i18n-ally.namespace": true,
  "i18n-ally.sourceLanguage": "en-US", // or your default locale
}
```

That's it! ✨

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@teages/nuxt-locale-lite/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@teages/nuxt-locale-lite

[npm-downloads-src]: https://img.shields.io/npm/dm/@teages/nuxt-locale-lite.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@teages/nuxt-locale-lite

[license-src]: https://img.shields.io/npm/l/@teages/nuxt-locale-lite.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@teages/nuxt-locale-lite

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
