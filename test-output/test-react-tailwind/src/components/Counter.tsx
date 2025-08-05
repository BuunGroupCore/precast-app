import { useState } from 'react'

interface CounterProps {
  initialCount?: number
}

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount)

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-4">Counter Component</h2>
      <button 
        className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
        onClick={() => setCount(count + 1)}
      >
        Count is {count}
      </button>
      <button 
        className="ml-4 px-6 py-4 text-lg font-semibold text-gray-300 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"
        onClick={() => setCount(0)}
      >
        Reset
      </button>
    </div>
  )
}