import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CARD_DATA } from '../data/cards';

export default function CodeCard({ cardIndex, innerRef, customWisdom, isLoadingWisdom }) {
  const baseData = CARD_DATA[cardIndex] || CARD_DATA[0];
  const data = customWisdom || baseData;
  const isPersonalized = Boolean(customWisdom?.isAiGenerated);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'tanglish' | 'tamil' | 'english'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    if (isModalOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsModalOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  if (isLoadingWisdom) {
    return (
      <div className="code gita-wisdom-card is-loading-card" id={`code-${cardIndex}`} ref={innerRef}>
        <div className="wisdom-inner loading-inner">
          <div className="divine-lotus-spin">🪷</div>
          <h4 className="divine-loader-title">Lord Krishna is hearing your prayer...</h4>
          <p className="divine-loader-sub">பகவான் கிருஷ்ணர் உங்கள் மனக்குறைக்கான கீதை ஞானத்தை அருள்கிறார்...</p>
          <div className="divine-pulse-bar" />
        </div>
      </div>
    );
  }

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = (e) => {
    e?.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ─── RESTING GITA WISDOM CARD ON BELT ─── */}
      <div
        className={`code gita-wisdom-card ${isPersonalized ? 'is-personalized' : ''}`}
        id={`code-${cardIndex}`}
        ref={innerRef}
        onClick={handleOpenModal}
        title="Click to pop up and read Gita wisdom in large view"
      >
        <div className="wisdom-inner">
          {/* Header */}
          <div className="wisdom-header">
            <div className="wisdom-badge">
              <span className="om-symbol">ॐ</span>
              <span className="shloka-ref">{data.shlokaRef}</span>
            </div>

            <div className="wisdom-badges-right">
              {isPersonalized ? (
                <span className="wisdom-ai-badge">✦ Divine AI · நேரடி அருளுரை</span>
              ) : (
                <span className="wisdom-lang-tag">Gita Wisdom</span>
              )}

              {/* Quick Language Filter Tabs */}
              <div className="lang-tabs-container">
                <button
                  type="button"
                  className={`lang-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setActiveTab('all'); }}
                >
                  All 3
                </button>
                <button
                  type="button"
                  className={`lang-tab-btn ${activeTab === 'tanglish' ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setActiveTab('tanglish'); }}
                >
                  Tanglish
                </button>
                <button
                  type="button"
                  className={`lang-tab-btn ${activeTab === 'tamil' ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setActiveTab('tamil'); }}
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  className={`lang-tab-btn ${activeTab === 'english' ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setActiveTab('english'); }}
                >
                  English
                </button>
              </div>

              <button
                type="button"
                className="btn-gita-popup-hint"
                onClick={handleOpenModal}
                title="Pop up and read in large comfortable view"
              >
                🔍 Large View
              </button>
            </div>
          </div>

          {/* Sanskrit Box */}
          <div className="wisdom-sanskrit-box" onClick={handleOpenModal}>
            <p className="wisdom-sanskrit">{data.sanskrit}</p>
          </div>

          {/* Translations */}
          <div className={`wisdom-translations view-${activeTab}`} onClick={handleOpenModal}>
            {(activeTab === 'all' || activeTab === 'english') && (
              <div className="wisdom-block english-block">
                <div className="lang-header-row">
                  <span className="lang-flag">🇬🇧</span>
                  <span className="lang-label">
                    {isPersonalized ? "KRISHNA'S GUIDANCE (ENGLISH)" : "ENGLISH GUIDANCE"}
                  </span>
                </div>
                <p className="wisdom-text">{data.english}</p>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'tanglish') && (
              <div className="wisdom-block tanglish-block">
                <div className="lang-header-row">
                  <span className="lang-flag">🪶</span>
                  <span className="lang-label">
                    {isPersonalized ? "TANGLISH (கிருஷ்ணரின் உரை)" : "TANGLISH ARULURAI"}
                  </span>
                </div>
                <p className="wisdom-text-tanglish">{data.tanglish || data.english}</p>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'tamil') && (
              <div className="wisdom-block tamil-block">
                <div className="lang-header-row">
                  <span className="lang-flag">🕉️</span>
                  <span className="lang-label">
                    {isPersonalized ? "நேரடி தமிழ் அருளுரை" : "தமிழ் அருளுரை"}
                  </span>
                </div>
                <p className="wisdom-text-tamil">{data.tamil}</p>
              </div>
            )}
          </div>

          {/* Positive Affirmation Pills & Expand Prompt */}
          <div className="wisdom-footer">
            <div className="positive-tags">
              {data.positiveWords.map((word, idx) => (
                <span key={idx} className="positive-pill">
                  ✦ {word}
                </span>
              ))}
            </div>
            <span className="wisdom-click-hint">🔍 Click to read in large view ➔</span>
          </div>
        </div>
      </div>

      {/* ─── EXPANDED GITA WISDOM POP-UP MODAL (COMES FRONT) ─── */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="gita-popup-overlay" onClick={handleCloseModal}>
            <div
              className="gita-popup-dialog"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gita-popup-shloka-ref"
            >
              {/* Header */}
              <div className="gita-popup-header">
                <div className="gita-popup-badge-group">
                  <span className="gita-popup-om">ॐ</span>
                  <div>
                    <h2 id="gita-popup-shloka-ref" className="gita-popup-title">
                      {data.shlokaRef}
                    </h2>
                    <span className="gita-popup-subtitle">
                      {isPersonalized
                        ? '✦ Direct Divine Counsel for Your Prayer · உங்கள் வேண்டுதலுக்கான அருளுரை'
                        : 'Eternal Gita Wisdom for Inner Peace · பகவத் கீதை அமுதம்'}
                    </span>
                  </div>
                </div>

                <div className="gita-popup-controls">
                  <div className="lang-tabs-container">
                    <button
                      type="button"
                      className={`lang-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All 3
                    </button>
                    <button
                      type="button"
                      className={`lang-tab-btn ${activeTab === 'tanglish' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tanglish')}
                    >
                      Tanglish
                    </button>
                    <button
                      type="button"
                      className={`lang-tab-btn ${activeTab === 'tamil' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tamil')}
                    >
                      தமிழ்
                    </button>
                    <button
                      type="button"
                      className={`lang-tab-btn ${activeTab === 'english' ? 'active' : ''}`}
                      onClick={() => setActiveTab('english')}
                    >
                      English
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-popup-close-x"
                    onClick={handleCloseModal}
                    title="Close and return to belt (Esc)"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Large Sanskrit Verse in Devanagari */}
              <div className="gita-popup-sanskrit-box">
                <div className="gita-popup-sanskrit-label">संस्कृत श्लोक (Sanskrit Shloka)</div>
                <p className="gita-popup-sanskrit">{data.sanskrit}</p>
              </div>

              {/* Large Translations */}
              <div className={`gita-popup-translations view-${activeTab}`}>
                {(activeTab === 'all' || activeTab === 'tanglish') && (
                  <div className="gita-popup-block tanglish-block">
                    <div className="lang-header-row">
                      <span className="lang-flag">🪶</span>
                      <span className="lang-label">
                        {isPersonalized ? "TANGLISH (கிருஷ்ணரின் நேரடி உரை)" : "TANGLISH ARULURAI"}
                      </span>
                    </div>
                    <p className="gita-popup-text-tanglish">{data.tanglish || data.english}</p>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'tamil') && (
                  <div className="gita-popup-block tamil-block">
                    <div className="lang-header-row">
                      <span className="lang-flag">🕉️</span>
                      <span className="lang-label">
                        {isPersonalized ? "கிருஷ்ணரின் நேரடி தமிழ் அருளுரை" : "தமிழ் அருளுரை"}
                      </span>
                    </div>
                    <p className="gita-popup-text-tamil">{data.tamil}</p>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'english') && (
                  <div className="gita-popup-block english-block">
                    <div className="lang-header-row">
                      <span className="lang-flag">🇬🇧</span>
                      <span className="lang-label">
                        {isPersonalized ? "KRISHNA'S GUIDANCE (ENGLISH)" : "ENGLISH GUIDANCE"}
                      </span>
                    </div>
                    <p className="gita-popup-text-english">{data.english}</p>
                  </div>
                )}
              </div>

              {/* Footer with Blessing Pills & Return Button */}
              <div className="gita-popup-footer">
                <div className="positive-tags">
                  {data.positiveWords.map((word, idx) => (
                    <span key={idx} className="positive-pill">
                      ✦ {word}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-popup-done"
                  onClick={handleCloseModal}
                  title="Close and return to belt"
                >
                  <span className="btn-done-check">✓</span>
                  <span>Done Reading · Return to Belt (பின் செல்)</span>
                  <span className="btn-done-arrow">➔</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
