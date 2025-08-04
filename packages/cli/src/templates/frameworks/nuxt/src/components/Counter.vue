<template>
  <div class="{{#if (eq styling 'tailwind')}}bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto{{else}}counter{{/if}}">
    <h2 class="{{#if (eq styling 'tailwind')}}text-xl font-semibold text-gray-800 mb-4{{else}}counter-title{{/if}}">
      Counter Example
    </h2>
    <div class="{{#if (eq styling 'tailwind')}}flex items-center justify-center space-x-4{{else}}counter-controls{{/if}}">
      <button
        @click="decrement"
        class="{{#if (eq styling 'tailwind')}}px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors{{else}}counter-button counter-button-minus{{/if}}"
      >
        -
      </button>
      <span class="{{#if (eq styling 'tailwind')}}text-2xl font-bold text-gray-800 min-w-[3rem] text-center{{else}}counter-value{{/if}}">
        {{ count }}
      </span>
      <button
        @click="increment"
        class="{{#if (eq styling 'tailwind')}}px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors{{else}}counter-button counter-button-plus{{/if}}"
      >
        +
      </button>
    </div>
    <button
      @click="reset"
      class="{{#if (eq styling 'tailwind')}}mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors w-full{{else}}counter-reset{{/if}}"
    >
      Reset
    </button>
  </div>
</template>

<script{{#if typescript}} lang="ts"{{/if}} setup>
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}
</script>

{{#unless (eq styling "tailwind")}}
<style scoped>
.counter {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 20rem;
  margin: 0 auto;
}

.counter-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.counter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.counter-button {
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: bold;
  transition: background-color 0.2s;
}

.counter-button-minus {
  background-color: #ef4444;
}

.counter-button-minus:hover {
  background-color: #dc2626;
}

.counter-button-plus {
  background-color: #10b981;
}

.counter-button-plus:hover {
  background-color: #059669;
}

.counter-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  min-width: 3rem;
  text-align: center;
}

.counter-reset {
  padding: 0.5rem 1rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.counter-reset:hover {
  background-color: #4b5563;
}
</style>
{{/unless}}