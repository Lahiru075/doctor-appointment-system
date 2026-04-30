function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 text-center max-w-md">
        
        {/* Tailwind Color & Font Size Test */}
        <h1 className="text-4xl font-black text-emerald-600 mb-4">
          Work Tailwind v4 🚀
        </h1>
        
        {/* Text Color & Line Height Test */}
        <p className="text-slate-600 text-lg leading-relaxed">
          Your <span className="font-bold text-slate-800">Doctor Appointment System</span> frontend has been successfully set up.
        </p>

        {/* Button with Hover & Transition Test */}
        <button className="mt-8 px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-300">
          Let't Start Backend Work
        </button>

        <div className="mt-6 flex justify-center gap-2">
          <span className="w-3 h-3 bg-red-400 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  )
}

export default App