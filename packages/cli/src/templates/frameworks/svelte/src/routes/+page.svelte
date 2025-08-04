<script{{#if typescript}} lang="ts"{{/if}}>
  import Counter from '$lib/components/Counter.svelte';
  import HelloWorld from '$lib/components/HelloWorld.svelte';
</script>

<svelte:head>
  <title>{{name}}</title>
  <meta name="description" content="Welcome to {{name}}" />
</svelte:head>

<div class="{{#if (eq styling 'tailwind')}}min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100{{else}}container{{/if}}">
  <main class="{{#if (eq styling 'tailwind')}}text-center space-y-8{{else}}main{{/if}}">
    <h1 class="{{#if (eq styling 'tailwind')}}text-4xl font-bold text-gray-800 mb-8{{else}}title{{/if}}">
      Welcome to {{name}}
    </h1>
    
    <div class="{{#if (eq styling 'tailwind')}}space-y-6{{else}}components{{/if}}">
      <HelloWorld />
      <Counter />
    </div>
    
    <div class="{{#if (eq styling 'tailwind')}}text-gray-600{{else}}links{{/if}}">
      <p>
        Get started by editing
        <code class="{{#if (eq styling 'tailwind')}}bg-gray-100 px-2 py-1 rounded text-sm font-mono{{else}}code{{/if}}">
          src/routes/+page.svelte
        </code>
      </p>
    </div>
  </main>
</div>

{{#unless (eq styling "tailwind")}}
<style>
  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .main {
    text-align: center;
    max-width: 600px;
  }

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #1f2937;
  }

  .components {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 2rem 0;
  }

  .links {
    margin-top: 2rem;
    color: #6b7280;
  }

  .code {
    background-color: rgba(229, 231, 235, 0.5);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }
</style>
{{/unless}}