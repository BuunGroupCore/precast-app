import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
    <main class="text-center space-y-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">test-vite-tw with Vite</h1>
      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Counter</h2>
        <div class="flex items-center justify-center space-x-4">
          <button id="decrement" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">-</button>
          <span id="counter" class="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">0</span>
          <button id="increment" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">+</button>
        </div>
      </div>
    </main>
  </div>
`

let count: number = 0

document.querySelector('#increment')!.addEventListener('click', () => {
  count++
  document.querySelector('#counter')!.textContent = count.toString()
})

document.querySelector('#decrement')!.addEventListener('click', () => {
  count--
  document.querySelector('#counter')!.textContent = count.toString()
})