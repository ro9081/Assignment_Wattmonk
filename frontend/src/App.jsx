import './index.css'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ChatInterface from './components/ChatInterface.jsx'
import Features from './components/Features.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const scrollToChat = () => {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Navbar onChatClick={scrollToChat} />
      <main>
        <Hero onChatClick={scrollToChat} />
        <ChatInterface />
        <Features />
      </main>
      <Footer />
    </>
  )
}
