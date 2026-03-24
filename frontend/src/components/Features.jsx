export default function Features() {
  const feats = [
    {
      title: "NEC Knowledge Base",
      desc: "Instant lookups for complex Articles like 690, 705, and more.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    },
    {
      title: "Wattmonk Intelligence",
      desc: "Information about our PTO, engineering reviews, and Zippy tool.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    },
    {
      title: "General Solar Engineering",
      desc: "Broad answers addressing panel orientations, irradiance, and optimal layouts.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )
    }
  ]

  return (
    <section id="features" className="py-24 px-6 mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Unmatched Domain Expertise</h2>
          <p className="text-blue-800/70 max-w-2xl mx-auto text-lg">
            Harnessing the power of Faiss Vector Local Embeddings coupled with Google Gemini context injection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {feats.map((f, i) => (
            <div key={i} className="glass-panel p-8 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-white flex items-center justify-center shadow-lg mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">{f.title}</h3>
              <p className="text-blue-800/70 leading-relaxed font-medium text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
