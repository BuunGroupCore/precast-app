interface HelloWorldProps {
  msg: string
}

export function HelloWorld({ msg }: HelloWorldProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
        {msg}
      </h2>
      <p className="text-gray-300">
        This is a reusable HelloWorld component with Tailwind CSS styling.
      </p>
    </div>
  )
}