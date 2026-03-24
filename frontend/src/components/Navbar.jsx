export default function Navbar({ onChatClick }) {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-panel px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-blue-400 flex items-center justify-center shadow-lg transform hover:rotate-12 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-yellow-600 tracking-tight">
            Solar<span className="font-extrabold text-blue-900">Intelligence</span>
          </span>
        </div>
        
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-blue-900/80">
          <li><a href="#home" className="hover:text-blue-700 transition">Home</a></li>
          <li><a href="#features" className="hover:text-blue-700 transition">Capabilities</a></li>
          <li>
            <button 
              onClick={onChatClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all"
            >
              Start Chat
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
