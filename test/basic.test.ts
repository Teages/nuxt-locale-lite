import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('basic', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('with no accept-language', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    check(html, 'en')
  })

  it('with accept-language', async () => {
    const html = await $fetch('/', {
      headers: {
        'Accept-Language': 'zh-CN',
      },
    })
    check(html, 'zh-CN')
  })

  it('with language-code-only accept-language', async () => {
    const html = await $fetch('/', {
      headers: {
        'Accept-Language': 'ru',
      },
    })
    check(html, 'ru-RU')
  })

  it('with accept-language and cookie', async () => {
    const html = await $fetch('/', {
      headers: {
        'Accept-Language': 'zh-CN',
        'Cookie': 'locale=ja-JP',
      },
    })
    check(html, 'ja-JP')
  })

  it('with accept-language and wrong cookie', async () => {
    const html = await $fetch('/', {
      headers: {
        'Accept-Language': 'zh-CN',
        'Cookie': 'locale=ha-CK',
      },
    })
    check(html, 'zh-CN')
  })
})

function check(html: string, locale: string) {
  expect(html).toContain(`locale: ${locale}`)

  if (locale === 'en') {
    expect(html).toContain(`general.hello: Hello`)
    expect(html).toContain(`general.deep.hello: Deep: Hello`)
    expect(html).toContain(`another.hello: Another Hello`)
    expect(html).toContain(`another.deep.hello: Deep: Another Hello`)
  }
  else if (locale === 'zh-CN') {
    expect(html).toContain(`general.hello: 你好`)
    expect(html).toContain(`general.deep.hello: 深层: 你好`)
    expect(html).toContain(`another.hello: 另一个你好`)
    expect(html).toContain(`another.deep.hello: 深层: 另一个你好`)
  }
  else if (locale === 'ja-JP') {
    expect(html).toContain(`general.hello: こんにちは`)
    expect(html).toContain(`general.deep.hello: 次の層: こんにちは`)
    expect(html).toContain(`another.hello: もう一度こんにちは`)
    expect(html).toContain(`another.deep.hello: 次の層: もう一度こんにちは`)
  }
  else if (locale === 'ru-RU') {
    expect(html).toContain(`general.hello: Привет`)
    expect(html).toContain(`general.deep.hello: Глубоко: Привет`)
    expect(html).toContain(`another.hello: Еще один привет`)
    expect(html).toContain(`another.deep.hello: Глубоко: Еще один привет`)
  }
  else {
    throw new Error(`Unknown locale: ${locale}`)
  }
}
