import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api/chat.js'

const SUGGESTIONS = [
  'What does Wattmonk do?',
  'What is the Zippy tool?',
  'Explain NEC Article 690',
  'How fast is plan set delivery?',
  'What is the 120% busbar rule?',
  'What is rapid shutdown?',
]

function SourceBadge({ source }) {
  const map = {
    'NEC Code': 'bg-blue-100 text-blue-700',
    'Wattmonk': 'bg-yellow-100 text-yellow-700',
    'General Knowledge': 'bg-gray-100 text-gray-700',
    'ERROR': 'bg-red-100 text-red-700',
  }
  const cls = map[source] || 'bg-gray-100 text-gray-700'
  return <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${cls}`}>{source}</span>
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[80%] my-2">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg self-end shrink-0">
         <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
      </div>
      <div className="flex gap-1.5 items-center px-4 py-3 bg-white/60 border border-white/80 rounded-2xl rounded-bl-sm shadow-sm backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

const AiIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md self-end shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  </div>
)

const UserIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md self-end shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  </div>
)

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const query = (text || input).trim()
    if (!query || loading) return

    setInput('')
    const userMsg = { role: 'user', content: query, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.slice(-10)
      const data = await sendChat(query, history)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        source: data.source,
        confidence: data.confidence,
        id: Date.now() + 1,
      }])
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Connection error — is the backend running?'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: msg,
        source: 'ERROR',
        id: Date.now() + 1,
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="py-24 px-6 relative" id="chat">
      <div className="max-w-4xl mx-auto mb-10 text-center">
         <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-widest uppercase mb-3">Live Intelligence</span>
         <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Chat with Solar Sage</h2>
         <p className="text-blue-800/70 max-w-lg mx-auto">Ask about Wattmonk services, NEC code requirements, or any solar question.</p>
      </div>

      <div className="max-w-4xl mx-auto glass-panel overflow-hidden flex flex-col h-[700px]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white/40 border-b border-white/50 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-blue-500 shadow-inner flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-sm">Solar Sage</h3>
            <p className="text-xs text-blue-700/80 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active System
            </p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 p-3 flex-wrap border-b border-white/30 bg-white/20">
          {SUGGESTIONS.map(q => (
            <button
              key={q}
              className="px-3 py-1.5 rounded-full bg-white/50 hover:bg-yellow-100 hover:text-yellow-800 border border-white/60 text-xs font-semibold text-blue-800 transition-colors shadow-sm disabled:opacity-50"
              onClick={() => handleSend(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-2xl flex items-center justify-center shadow-lg border border-white mb-4 text-yellow-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <h4 className="font-bold text-lg text-blue-900">Awaiting your query</h4>
              <p className="text-sm text-blue-700 max-w-sm mt-1">Select a suggestion above or type your question below.</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] animate-fade-in-up ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              {msg.role === 'user' ? <UserIcon /> : <AiIcon />}
              <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 text-sm rounded-2xl shadow-sm border border-white/60 
                  ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm' : 'bg-white/80 text-blue-900 rounded-bl-sm backdrop-blur-md'}
                `}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && msg.source && (
                  <SourceBadge source={msg.source} />
                )}
              </div>
            </div>
          ))}

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white/40 border-t border-white/50 backdrop-blur-md">
          <div className="relative flex items-end gap-2 bg-white rounded-2xl shadow-inner border border-blue-100 p-2">
            <textarea
              ref={inputRef}
              className="flex-1 max-h-32 bg-transparent outline-none resize-none px-3 py-2 text-sm text-blue-900 placeholder-blue-300"
              placeholder="Type your question..."
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white flex items-center justify-center shadow-md disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
