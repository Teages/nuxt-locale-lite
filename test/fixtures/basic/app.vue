<script setup>
const { locale } = useLocales()
</script>

<template>
  <div>
    <span>
      locale: {{ locale }}
    </span>
    <ul id="messages">
      <li verify="general.hello">
        general.hello: {{ $t('general.hello') }}
      </li>
      <li verify="general.deep.hello">
        general.deep.hello: {{ $t('general.deep.hello') }}
      </li>
      <li verify="another.hello">
        another.hello: {{ $t('another.hello') }}
      </li>
      <li verify="another.deep.hello">
        another.deep.hello: {{ $t('another.deep.hello') }}
      </li>
    </ul>
  </div>
</template>
