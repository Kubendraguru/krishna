import React, { useState, useCallback } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import Belt from './components/Belt';
import IntroScene from './components/IntroScene';
import GlowCursor from './components/GlowCursor';

export default function App() {
  const [count, setCount] = useState('100% Peace');
  const [percent, setPercent] = useState('அருள் · Blessing');
  const [showIntro, setShowIntro] = useState(true);

  const handleCounterUpdate = useCallback((newCount, newPercent) => {
    const numEl = document.getElementById('badge-num');
    const pctEl = document.getElementById('badge-pct');
    if (numEl) numEl.textContent = newCount;
    if (pctEl) pctEl.textContent = newPercent;
  }, []);

  return (
    <>
      <GlowCursor
        color="#5f8bff"
        intensity={1.3}
        trailWidth={3}
        linger={1.4}
        glow={1.2}
        clickBurst
        theme="dark"
        className="global-glow-cursor"
      />
      <div className="stage">
        {showIntro && (
          <IntroScene onFinish={() => setShowIntro(false)} />
        )}
        <Nav onReplayIntro={() => setShowIntro(true)} />
        <Hero />
        <Scanner count={count} percent={percent} />
        <Belt onCounterUpdate={handleCounterUpdate} />
      </div>
    </>
  );
}
