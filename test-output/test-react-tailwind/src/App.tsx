import { useState } from 'react'



import { HelloWorld } from './components/HelloWorld'
import { Counter } from './components/Counter'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            test-react-tailwind
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Modern web app powered by React + Vite + Tailwind CSS
          </p>
          
          <div className="space-y-8 mb-12">
            <HelloWorld msg="Welcome to test-react-tailwind!" />
            <Counter />
            <p className="text-gray-400">
              Edit <code className="text-purple-400 bg-slate-900/50 px-2 py-1 rounded font-mono text-sm">src/App.tsx</code> and save to test HMR
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://vitejs.dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/50"
            >
              <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.8836 6.146L16.7418 29.6457c-.2714.4851-.9684.488-1.2439.0052L2.0956 6.1482c-.3-.5262.1498-1.1635.746-1.057l13.156 2.3516a.7144.7144 0 00.2537-.0004l12.8808-2.3478c.5942-.1083 1.0463.5241.7515 1.0513z" fill="url(#paint0_linear)"/>
                <path d="M22.2644 2.0069l-9.7253 1.9056a.3571.3571 0 00-.2879.3294l-.5982 10.1038c-.014.238.2045.4227.4367.3691l2.7077-.6248c.2534-.0585.4823.1647.4302.4194l-.8044 3.9393c-.0542.265.1947.4918.4536.4132l1.6724-.5082c.2593-.0787.5084.1487.4543.414l-1.2784 6.2617c-.08.392.4348.598.6495.2606L26.659 9.3477c.1327-.2085-.0266-.4848-.2596-.4498l-2.5108.3779c-.2522.038-.4691-.1961-.4222-.4547l1.2562-6.9177c.0493-.2716-.1925-.4917-.4425-.4024z" fill="url(#paint1_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="1.7191" y1="4.9909" x2="18.0704" y2="37.1859" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#41D1FF"/>
                    <stop offset="1" stopColor="#BD34FE"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="17.8531" y1="1.4616" x2="26.2717" y2="21.4865" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFEA83"/>
                    <stop offset=".0833" stopColor="#FFDD35"/>
                    <stop offset="1" stopColor="#FFA800"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-gray-300">Learn Vite</span>
            </a>
            
            <a 
              href="https://react.dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/50"
            >
              <svg className="w-6 h-6" viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="0" cy="0" r="2" fill="#61dafb"/>
                <g stroke="#61dafb" strokeWidth="1" fill="none">
                  <ellipse rx="10" ry="4.5"/>
                  <ellipse rx="10" ry="4.5" transform="rotate(60)"/>
                  <ellipse rx="10" ry="4.5" transform="rotate(120)"/>
                </g>
              </svg>
              <span className="text-gray-300">Learn React</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App