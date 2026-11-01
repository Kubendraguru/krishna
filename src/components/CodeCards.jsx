import React, { useState } from 'react';
import { CARD_DATA } from '../data/cards';

export default function CodeCard({ cardIndex, innerRef, customWisdom, isLoadingWisdom }) {
  const baseData = CARD_DATA[cardIndex] || CARD_DATA[0];
  const data = customWisdom || baseData;
  const isPersonalized = Boolean(customWisdom?.isAiGenerated);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'tanglish' | 'tamil' | 'english'

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

  const hasTanglish = Boolean(data.tanglish);

  return (
    <div
      className={`code gita-wisdom-card ${isPersonalized ? 'is-personalized' : ''}`}
      id={`code-${cardIndex}`}
      ref={innerRef}
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
              <span className="wisdom-lang-tag">Eng · Tanglish · தமிழ்</span>
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
          </div>
        </div>

        {/* Sanskrit Box */}
        <div className="wisdom-sanskrit-box">
          <p className="wisdom-sanskrit">{data.sanskrit}</p>
        </div>

        {/* Translations (Supports All 3 side-by-side or focused view) */}
        <div className={`wisdom-translations view-${activeTab}`}>
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
                  {isPersonalized ? "TANGLISH (கிருஷ்ணரின் நேரடி உரை)" : "TANGLISH ARULURAI"}
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
                  {isPersonalized ? "கிருஷ்ணரின் நேரடி தமிழ் அருளுரை" : "தமிழ் அருளுரை"}
                </span>
              </div>
              <p className="wisdom-text-tamil">{data.tamil}</p>
            </div>
          )}
        </div>

        {/* Positive Affirmation Pills */}
        <div className="wisdom-footer">
          <div className="positive-tags">
            {data.positiveWords.map((word, idx) => (
              <span key={idx} className="positive-pill">
                ✦ {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
