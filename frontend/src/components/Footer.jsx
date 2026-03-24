export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/40 glass-panel rounded-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
            WM
          </div>
          <span className="font-bold text-blue-900 text-sm tracking-tight border-r border-blue-900/10 pr-4 mr-2">Solar<span className="text-yellow-600">Intelligence</span></span>
          <span className="text-xs font-semibold text-blue-700/60">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-6 text-xs font-bold text-blue-800/60">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Docs</a>
        </div>
      </div>
    </footer>
  )
}
