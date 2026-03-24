import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'

/**
 * Send a chat message to the backend RAG API.
 *
 * @param {string} message - User message
 * @param {Array}  history - Conversation history [{role, content}]
 * @returns {Promise<{answer, source, confidence, intent, retrieved_chunks}>}
 */
export async function sendChat(message, history = []) {
  const response = await axios.post(`${API_BASE}/chat`, {
    message,
    history: history.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  })
  return response.data
}

/**
 * Health check — verify the backend is reachable.
 */
export async function healthCheck() {
  const response = await axios.get(`${API_BASE}/health`)
  return response.data
}
