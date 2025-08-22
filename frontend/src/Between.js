import { useState, useEffect, useRef } from 'react';

const REFLECTIVE_PROMPTS = [
  {
    question: "What are you not saying to yourself right now?",
    pause: 30000,
    followUp: "Notice what wants to be heard."
  },
  {
    question: "What would it feel like to stop trying to figure this out for just this moment?",
    pause: 45000,
    followUp: "Let the not-knowing be enough."
  },
  {
    question: "What is asking for your attention that you've been too busy to notice?",
    pause: 40000,
    followUp: "Sometimes the whisper knows what the voice forgot."
  },
  {
    question: "If this feeling could speak, what would it say?",
    pause: 35000,
    followUp: "Listen with your whole being."
  },
  {
    question: "What would change if you trusted yourself completely right now?",
    pause: 50000,
    followUp: "The knowing is already here."
  }
];

const RETURN_TO_PEOPLE_RESOURCES = [
  { name: "Crisis Text Line", contact: "Text HOME to 741741", description: "24/7 crisis support" },
  { name: "National Suicide Prevention Lifeline", contact: "988", description: "24/7 mental health crisis support" },
  { name: "SAMHSA National Helpline", contact: "1-800-662-4357", description: "24/7 treatment referral service" }
];

function BetweenPage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [pauseActive, setPauseActive] = useState(false);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showBrakes, setShowBrakes] = useState(false);
  const [continuityConsent, setContinuityConsent] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  
  const bellRef = useRef(null);
  const pauseIntervalRef = useRef(null);

  // Check for previous visit
  useEffect(() => {
    const stored = localStorage.getItem('between_last_visit');
    if (stored) {
      setLastVisit(JSON.parse(stored));
    }
  }, []);

  const startSession = (rememberPrevious = false) => {
    if (!rememberPrevious) {
      localStorage.removeItem('between_last_visit');
      setLastVisit(null);
    }
    setContinuityConsent(rememberPrevious);
    setSessionStarted(true);
    // Select a prompt (random or based on context)
    const randomPrompt = REFLECTIVE_PROMPTS[Math.floor(Math.random() * REFLECTIVE_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  };

  const beginPause = () => {
    setPauseActive(true);
    setPauseTimeLeft(currentPrompt.pause);
    
    pauseIntervalRef.current = setInterval(() => {
      setPauseTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(pauseIntervalRef.current);
          setPauseActive(false);
          setShowFollowUp(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const extendPause = () => {
    setPauseTimeLeft(prev => prev + 30000);
  };

  const completeTurn = () => {
    setShowFollowUp(false);
    setSessionComplete(true);
    
    // Store session data if consent given
    if (continuityConsent) {
      localStorage.setItem('between_last_visit', JSON.stringify({
        date: new Date().toISOString(),
        prompt: currentPrompt.question,
        reflection: "A moment of presence was shared."
      }));
    }
    
    // Play completion bell sound (if we had audio)
    if (bellRef.current) {
      // bellRef.current.play();
    }
  };

  const resetSession = () => {
    setSessionStarted(false);
    setCurrentPrompt(null);
    setPauseActive(false);
    setPauseTimeLeft(0);
    setShowFollowUp(false);
    setSessionComplete(false);
    setShowBrakes(false);
    setContinuityConsent(null);
    if (pauseIntervalRef.current) {
      clearInterval(pauseIntervalRef.current);
    }
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-[#0f0f10] text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="mb-12">
            <h1 className="text-3xl font-light mb-6 tracking-wide">The Between</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              This is not a place for answers. It is a field for recognition—where what you already know can surface without force.
            </p>
            <p className="text-gray-500 text-sm mb-12">
              "Relational Intelligence is a field, not a feature."
            </p>
          </div>

          {lastVisit && (
            <div className="bg-gray-900 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-white font-medium mb-3">Last Reflection</h3>
              <p className="text-gray-400 text-sm mb-2">
                {new Date(lastVisit.date).toLocaleDateString()}
              </p>
              <p className="text-gray-300 italic mb-4">"{lastVisit.prompt}"</p>
              <p className="text-gray-500 text-sm">→ Continue from this thread, or begin fresh?</p>
            </div>
          )}

          <div className="space-y-4">
            {lastVisit && (
              <button
                onClick={() => startSession(true)}
                className="w-full bg-white text-black py-4 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Continue From Last Reflection
              </button>
            )}
            <button
              onClick={() => startSession(false)}
              className="w-full bg-transparent border border-white text-white py-4 px-8 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
            >
              Begin Fresh
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <button
              onClick={() => setShowBrakes(true)}
              className="text-gray-500 text-sm hover:text-gray-400 underline"
            >
              If you need human support →
            </button>
          </div>
        </div>

        {showBrakes && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-6 z-50">
            <div className="bg-white text-black rounded-lg p-8 max-w-md">
              <h3 className="font-semibold mb-4">Return to People</h3>
              <p className="text-sm text-gray-700 mb-6">
                Some moments require human presence. These spaces are held for you:
              </p>
              <div className="space-y-3 mb-6">
                {RETURN_TO_PEOPLE_RESOURCES.map((resource, i) => (
                  <div key={i} className="border-l-2 border-gray-300 pl-3">
                    <div className="font-medium">{resource.name}</div>
                    <div className="text-sm font-mono">{resource.contact}</div>
                    <div className="text-sm text-gray-600">{resource.description}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowBrakes(false)}
                className="w-full bg-black text-white py-2 px-4 rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-[#0f0f10] text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-6">🔔</div>
            <h2 className="text-2xl font-light mb-6">May this be enough for now.</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              What was shared in The Between stays in The Between. What was recognized can travel with you.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={resetSession}
              className="bg-white text-black py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Another Turn
            </button>
            <div>
              <a
                href="/"
                className="inline-block text-gray-400 hover:text-white underline text-sm"
              >
                Return to Blessed & Grateful
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {!pauseActive && !showFollowUp && (
          <div>
            <h2 className="text-2xl font-light mb-12 leading-relaxed">
              {currentPrompt.question}
            </h2>
            <button
              onClick={beginPause}
              className="bg-transparent border border-white text-white py-4 px-12 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300"
            >
              I'm ready to pause
            </button>
          </div>
        )}

        {pauseActive && (
          <div className="space-y-8">
            <div className="text-6xl animate-pulse">◦</div>
            <div className="text-lg text-gray-400">
              {Math.ceil(pauseTimeLeft / 1000)} seconds of space
            </div>
            <button
              onClick={extendPause}
              className="text-gray-500 text-sm hover:text-gray-400 underline"
            >
              Need more time? +30 seconds
            </button>
          </div>
        )}

        {showFollowUp && (
          <div className="space-y-8">
            <p className="text-xl font-light text-gray-300 leading-relaxed">
              {currentPrompt.followUp}
            </p>
            <button
              onClick={completeTurn}
              className="bg-white text-black py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              This feels complete
            </button>
          </div>
        )}

        {/* Always available escape hatch */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowBrakes(true)}
            className="text-gray-600 hover:text-gray-400 text-xs underline"
          >
            Need human support?
          </button>
        </div>
      </div>

      {/* Hidden bell audio element for future enhancement */}
      <audio ref={bellRef} preload="auto">
        {/* <source src="/bell.mp3" type="audio/mpeg" /> */}
      </audio>
    </div>
  );
}

export default BetweenPage;