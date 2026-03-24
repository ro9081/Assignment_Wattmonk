const STEPS = [
  { num: '01', name: 'User Query' },
  { num: '02', name: 'Intent Classifier' },
  { num: '03', name: 'FAISS Vector DB' },
  { num: '04', name: 'Context Injection' },
  { num: '05', name: 'Gemini API' },
  { num: '06', name: 'Response + Source' },
]

const TECH = [
  'FastAPI', 'Gemini 1.5 Flash', 'FAISS', 'React + Vite',
  'sentence-transformers', 'python-dotenv', 'Tailwind CSS',
]

export default function Architecture() {
  return (
    <section className="arch-section section" id="architecture">
      <div className="section-header">
        <span className="section-tag">Architecture</span>
        <h2 className="section-title">How RAG Works</h2>
        <p className="section-sub">
          A real retrieval-augmented generation pipeline — not a simple chatbot wrapper.
          Queries are classified, chunks retrieved, and Gemini generates grounded answers.
        </p>
      </div>

      <div className="arch-steps">
        {STEPS.map(({ num, name }) => (
          <div key={num} className="arch-step">
            <div className="arch-step-num">{num}</div>
            <div className="arch-step-name">{name}</div>
          </div>
        ))}
      </div>

      <div className="tech-pills">
        {TECH.map(t => (
          <span key={t} className="tech-pill">{t}</span>
        ))}
      </div>
    </section>
  )
}
