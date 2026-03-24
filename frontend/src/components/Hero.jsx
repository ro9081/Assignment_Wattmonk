export default function Hero({ onChatClick }) {
  return (
    <section id="home" className="pt-40 pb-20 px-6 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-yellow-300 text-yellow-700 text-sm font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            Next-Gen RAG System
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
            Decode <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-500">Solar</span> Complexities.
          </h1>
          
          <p className="text-lg text-slate-700/80 max-w-xl leading-relaxed font-medium">
            Empower your workflow with instantaneous answers regarding NEC codes, system designs, and Wattmonk services—driven by bleeding-edge AI and grounded in local intelligence.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onChatClick}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 overflow-hidden transform hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <span className="relative flex items-center gap-2">
                Open Assistant
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <a href="#features" className="px-8 py-4 glass-panel text-blue-900 font-bold hover:bg-white/60 transition-colors flex items-center justify-center">
              Explore Features
            </a>
          </div>
        </div>

        {/* Visual Content */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 to-blue-400/30 blur-3xl -z-10 rounded-full animate-pulse"></div>
          <div className="glass-panel p-8 transform rotate-2 hover:rotate-0 transition-all duration-500 ease-out">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 p-6 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors">
                <div className="text-4xl font-black text-blue-600 mb-2">99.9%</div>
                <div className="text-sm font-semibold text-slate-600">Retrieval Accuracy</div>
              </div>
              <div className="bg-white/40 p-6 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors">
                <div className="text-4xl font-black text-yellow-500 mb-2">{'<1s'}</div>
                <div className="text-sm font-semibold text-slate-600">Latency</div>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-blue-100/50 to-yellow-100/50 p-6 rounded-2xl border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-700 mb-1">Vector Database</div>
                    <div className="text-xs text-slate-500">FAISS Indices Synced</div>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
