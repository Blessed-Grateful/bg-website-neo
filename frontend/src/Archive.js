import { useState } from "react";
import { allArchive, anchorQuotes, sacredNeutralityQuotes, anchorMentalityQuotes } from "./quotes";

function QuoteModal({ quote, onClose }) {
  if (!quote) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 leading-tight pr-4">
              "{quote.q}"
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light flex-shrink-0 w-8 h-8 flex items-center justify-center"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {quote.context && (
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Context & Reflection</h4>
              <div className="prose prose-gray max-w-none">
                {quote.context.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {!quote.context && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <PresenceIndicator isActive={true} />
              <p className="text-gray-600 italic">
                Let this wisdom resonate in the silence...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteSection({ title, quotes, accentColor = "border-gray-200" }) {
  const [selectedQuote, setSelectedQuote] = useState(null);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((item, i) => {
          const quote = typeof item === 'string' ? { q: item } : item;
          
          return (
            <div
              key={i}
              className={`card cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 ${accentColor} group`}
              onClick={() => setSelectedQuote(quote)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedQuote(quote);
                }
              }}
              role="button"
              aria-label={`Read more about quote: ${quote.q}`}
            >
              <div className="flex items-start justify-between">
                <p className="text-lg leading-relaxed group-hover:text-gray-900 transition-colors">
                  "{quote.q}"
                </p>
              </div>
              {quote.context && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 italic">
                    Click to explore the deeper context...
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedQuote && (
        <QuoteModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </section>
  );
}

function ArchivePage() {
  return (
    <div className="page-transition">
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-center mb-12">
            <h1 className="section-title mb-4">Wisdom Archive</h1>
            <p className="lead max-w-2xl mx-auto">
              A curated collection of insights on Sacred Neutrality, Relational Intelligence, 
              and the recognition that Love All, All is One.
            </p>
          </div>

          <QuoteSection 
            title="Anchor Quotes" 
            quotes={anchorQuotes} 
            accentColor="border-blue-300"
          />
          
          <QuoteSection 
            title="Sacred Neutrality" 
            quotes={sacredNeutralityQuotes}
            accentColor="border-green-300" 
          />
          
          <QuoteSection 
            title="Anchor Mentality" 
            quotes={anchorMentalityQuotes}
            accentColor="border-purple-300"
          />

          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4 italic">
              "Every section is a door. Ti Amo Energy invites you to walk through it."
            </p>
            <div className="flex justify-center">
              <PresenceIndicator isActive={true} />
            </div>
          </div>
        </div>

        <DiscoveryPath 
          from="/archive"
          suggestions={[
            { to: '/between', text: 'Pause and reflect in The Between', icon: '◦' },
            { to: '/recognition-lab', text: 'Document your recognition moments', icon: '※' },
            { to: '/dr-chen', text: 'Meet the source of this wisdom', icon: '⟡' }
          ]}
        />
      </div>
    </div>
  );
}

export default ArchivePage;