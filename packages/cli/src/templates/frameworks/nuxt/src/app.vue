<template>
  <div class="{{#if (eq styling 'tailwind')}}min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100{{else}}app{{/if}}">
    <NuxtPage />
  </div>
</template>

{{#unless (eq styling "tailwind")}}
<style>
.app {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f9ff, #e0e7ff);
}
</style>
{{/unless}}