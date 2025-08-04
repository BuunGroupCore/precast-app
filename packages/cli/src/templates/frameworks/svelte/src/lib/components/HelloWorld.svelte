<script{{#if typescript}} lang="ts"{{/if}}>
  {{#if typescript}}export let name: string = 'Svelte';{{else}}export let name = 'Svelte';{{/if}}
</script>

<div class="{{#if (eq styling 'tailwind')}}bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto{{else}}hello-world{{/if}}">
  <h2 class="{{#if (eq styling 'tailwind')}}text-xl font-semibold text-gray-800 mb-4{{else}}hello-title{{/if}}">
    Hello World!
  </h2>
  <p class="{{#if (eq styling 'tailwind')}}text-gray-600{{else}}hello-description{{/if}}">
    Welcome to your {name} application! This is a simple component example.
  </p>
  <div class="{{#if (eq styling 'tailwind')}}mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400{{else}}hello-info{{/if}}">
    <p class="{{#if (eq styling 'tailwind')}}text-sm text-blue-700{{else}}hello-info-text{{/if}}">
      🚀 You're ready to start building amazing things!
    </p>
  </div>
</div>

{{#unless (eq styling "tailwind")}}
<style>
  .hello-world {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 20rem;
    margin: 0 auto;
  }

  .hello-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
    text-align: center;
  }

  .hello-description {
    color: #6b7280;
    text-align: center;
    line-height: 1.5;
  }

  .hello-info {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #eff6ff;
    border-radius: 0.25rem;
    border-left: 4px solid #3b82f6;
  }

  .hello-info-text {
    font-size: 0.875rem;
    color: #1d4ed8;
    margin: 0;
  }
</style>
{{/unless}}