import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Wisdom connection mappings - living threads between content
const wisdomConnections = {
  'beliefs-quote': {
    threads: [
      { to: '/between', text: 'Pause with this wisdom', icon: '◦' },
      { to: '/dr-chen', text: 'Explore Sacred Neutrality', icon: '⟡' }
    ]
  },
  'love-all-quote': {
    threads: [
      { to: '/between', text: 'Feel into oneness', icon: '◦' },
      { to: '/recognition-lab', text: 'Document this recognition', icon: '※' }
    ]
  },
  'neutrality-wisdom': {
    threads: [
      { to: '/archive', text: 'More neutrality wisdom', icon: '◈' },
      { to: '/between', text: 'Practice presence', icon: '◦' }
    ]
  }
};

// Gentle discovery component that appears on hover/focus
export function WisdomThread({ connectionKey, children }) {
  const [showThreads, setShowThreads] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const connection = wisdomConnections[connectionKey];
  if (!connection) return children;

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ 
      x: rect.left + rect.width / 2, 
      y: rect.top - 10 
    });
    setTimeout(() => setShowThreads(true), 800); // Gentle delay
  };

  const handleMouseLeave = () => {
    setShowThreads(false);
  };

  return (
    <div 
      ref={containerRef}
      className="wisdom-thread-container relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      {showThreads && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{ 
            left: mousePos.x - 100, 
            top: mousePos.y,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="wisdom-threads bg-white/95 backdrop-blur rounded-lg shadow-lg border p-3 animate-fade-in">
            <div className="text-xs text-gray-500 mb-2 text-center">wisdom threads</div>
            <div className="space-y-2">
              {connection.threads.map((thread, i) => (
                <a
                  key={i}
                  href={thread.to}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors pointer-events-auto"
                >
                  <span className="text-gray-400">{thread.icon}</span>
                  <span>{thread.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Breathing presence indicator
export function PresenceIndicator({ isActive = false }) {
  return (
    <div className={`presence-indicator ${isActive ? 'active' : ''}`}>
      <div className="presence-circle"></div>
    </div>
  );
}

// Gentle path suggestions
export function DiscoveryPath({ from, suggestions }) {
  const [showPath, setShowPath] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show path suggestions after user has spent time on current page
    const timer = setTimeout(() => {
      if (location.pathname === from) {
        setShowPath(true);
      }
    }, 30000); // 30 seconds of presence

    return () => clearTimeout(timer);
  }, [location, from]);

  if (!showPath || location.pathname !== from) return null;

  return (
    <div className="discovery-path fixed bottom-6 right-6 max-w-sm">
      <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg border p-4 animate-slide-up">
        <div className="text-sm text-gray-600 mb-3">
          If this resonates with you...
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <a
              key={i}
              href={suggestion.to}
              className="block text-sm text-gray-800 hover:text-black p-2 rounded hover:bg-gray-50 transition-colors"
              onClick={() => setShowPath(false)}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{suggestion.icon}</span>
                <span>{suggestion.text}</span>
              </div>
            </a>
          ))}
        </div>
        <button
          onClick={() => setShowPath(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close suggestions"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Memory with grace - remembers beautiful moments
export function GracefulMemory() {
  const location = useLocation();
  
  useEffect(() => {
    // Gently remember meaningful interactions
    const currentPath = location.pathname;
    const timeSpent = Date.now();
    
    // Store with expiration - memory fades naturally like real memory
    const memory = {
      path: currentPath,
      timestamp: timeSpent,
      expires: timeSpent + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    localStorage.setItem('gentle_memory', JSON.stringify(memory));
  }, [location]);

  return null; // This component just manages memory gracefully
}

// Accessibility enhancements
export function AccessibilityEnhancements() {
  useEffect(() => {
    // Enhanced keyboard navigation
    const handleKeyPress = (e) => {
      // Skip to main content with 'S'
      if (e.key === 's' || e.key === 'S') {
        const main = document.querySelector('main, [role="main"]');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Skip to navigation with 'N'  
      if (e.key === 'n' || e.key === 'N') {
        const nav = document.querySelector('nav, [role="navigation"]');
        if (nav) {
          const firstLink = nav.querySelector('a, button');
          if (firstLink) firstLink.focus();
        }
      }
    };

    // Announce page changes to screen readers
    const announcePageChange = () => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Navigated to ${document.title}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    document.addEventListener('keydown', handleKeyPress);
    
    // Announce on route changes
    announcePageChange();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null;
}