// src/pages/ChatPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sendChatMessage } from '../api'
import { useLang } from '../context/LanguageContext'
import { Loader2, Send, User, Bot } from 'lucide-react'

function Message({ role, text, time }) {
  const isUser = role === 'user'
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center"><Bot className="w-5 h-5" /></div>}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-md ${isUser ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-100 rounded-bl-none'}`}>
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        <div className="mt-1 text-[10px] text-gray-300 text-right">{time}</div>
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"><User className="w-5 h-5" /></div>}
    </div>
  )
}

function ChatPage() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I am your health assistant. How can I help you today?', time: new Date().toLocaleTimeString() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollerRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const prefill = location.state?.prefill
    if (prefill) {
      setInput(prefill)
      // reset state so it doesn't persist on back/forward
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  async function onSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date().toLocaleTimeString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const data = await sendChatMessage({ question: text, language: lang })
      const botMsg = { id: Date.now() + 1, role: 'assistant', text: data.answer, time: new Date().toLocaleTimeString() }
      setMessages((m) => [...m, botMsg])
    } catch (err) {
      const botMsg = { id: Date.now() + 1, role: 'assistant', text: 'Sorry, something went wrong. Please try again.', time: new Date().toLocaleTimeString() }
      setMessages((m) => [...m, botMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-padded py-4 h-full flex flex-col">
      <div className="card flex-1 p-4 flex flex-col min-h-0">
        <div ref={scrollerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => (
            <Message key={m.id} role={m.role} text={m.text} time={m.time} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.loading}</span>
            </div>
          )}
        </div>
        <form onSubmit={onSend} className="mt-4 flex items-center gap-2">
          <input
            className="input"
            placeholder={t.typeMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label={t.typeMessage}
          />
          <button type="submit" className="btn-primary h-10 px-4 inline-flex items-center gap-2" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.send}</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage