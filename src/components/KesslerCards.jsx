import React, { useState, useRef } from 'react';
import { CARD_DATA } from '../data/cards';

export function WishPaperCard({
  innerRef,
  cardIndex = 0,
  onWishChange,
  isAiGenerating = false,
  hasCustomWisdom = false,
  onSeekWisdom
}) {
  const data = CARD_DATA[cardIndex] || CARD_DATA[0];
  const [text, setText] = useState(data.defaultWish || '');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleCardClick = (e) => {
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (onWishChange) onWishChange(cardIndex, val);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setText('');
    if (onWishChange) onWishChange(cardIndex, '');
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleAskWisdom = (e) => {
    e.stopPropagation();
    if (onSeekWisdom && text.trim().length > 3) {
      onSeekWisdom(cardIndex, text.trim());
    }
  };

  const handleQuickPrompt = (promptText) => {
    setText(promptText);
    if (onWishChange) onWishChange(cardIndex, promptText);
    if (textareaRef.current) textareaRef.current.focus();
    if (onSeekWisdom) onSeekWisdom(cardIndex, promptText);
  };

  return (
    <div
      className={`k-card wish-paper-card ${isFocused ? 'is-focused' : ''}`}
      id={`card-${cardIndex}`}
      ref={innerRef}
      onClick={handleCardClick}
    >
      <div className="paper-texture-overlay" />
      <div className="wish-paper-inner">
        <div className="wish-paper-header">
          <div className="wish-feather-badge">
            <span className="feather-icon">🪶</span>
            <div className="feather-text">
              <span className="feather-sanskrit">श्री कृष्णाय नमः</span>
              <span className="feather-sub">Sacred Prayer Slip · English / Tanglish / தமிழ்</span>
            </div>
          </div>
          <div className="wish-header-actions">
            {text.length > 3 && (
              <button
                type="button"
                className={`btn-seek-gita ${isAiGenerating ? 'is-loading' : ''}`}
                onClick={handleAskWisdom}
                title="Ask Lord Krishna for Gita guidance through Gemini AI"
              >
                {isAiGenerating ? '✨ Discerning...' : '✨ Seek Wisdom · அருள்'}
              </button>
            )}
            {text.length > 0 && (
              <button
                type="button"
                className="btn-clear-wish"
                onClick={handleClear}
                title="Clear and write a fresh wish"
              >
                Clear · வெற்று மடல்
              </button>
            )}
            <div className="wish-paper-date">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="wish-title-bar">
          <div className="wish-title-row">
            <h3 className="wish-card-title">{data.title}</h3>
            <div className="status-pills-row">
              {isAiGenerating ? (
                <span className="typing-status-pill pill-ai-loading">
                  ✨ Krishna is discerning...
                </span>
              ) : hasCustomWisdom ? (
                <span className="typing-status-pill pill-ai-ready">
                  ✦ Gita Wisdom Ready!
                </span>
              ) : isFocused ? (
                <span className="typing-status-pill">✍️ Writing...</span>
              ) : null}
            </div>
          </div>
          <p className="wish-card-subtitle">{data.subTitle}</p>
        </div>

        <div
          className={`wish-textarea-container ${isFocused ? 'container-focused' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (textareaRef.current) textareaRef.current.focus();
          }}
        >
          <textarea
            ref={textareaRef}
            className="wish-paper-textarea"
            value={text}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="✍️ Type your prayer, wish, or life burdens in English, Tanglish, or தமிழ்...&#10;&#10;(e.g., 'Kanna romba bayama irukku, future pathi tension ah irukku' or 'Lord Krishna, please grant me peace')"
            autoComplete="off"
            spellCheck="true"
          />
        </div>

        {/* Quick Feeling Tags */}
        <div className="prayer-quick-prompts">
          <span className="quick-prompt-label">Quick prayer:</span>
          <button
            type="button"
            className="btn-quick-tag"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickPrompt('Kanna romba bayama irukku, enaku nalla vazhi kaatu');
            }}
          >
            🛡️ பயம் & நல்வழி (Fear & Path)
          </button>
          <button
            type="button"
            className="btn-quick-tag"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickPrompt('I surrender all my worries and anxieties at Your lotus feet');
            }}
          >
            🕊️ அமைதி (Surrender & Peace)
          </button>
        </div>

        <div className="wish-paper-footer">
          <div className="wish-drag-hint">
            <span className="spark-bullet">✨</span>
            <span>Drag across Lord Krishna to reveal divine Gita wisdom ➔</span>
          </div>
          <div className="wish-char-count">
            {text.length} chars
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeCard(props) {
  return <WishPaperCard cardIndex={0} {...props} />;
}

export function PriceCard(props) {
  return <WishPaperCard cardIndex={1} {...props} />;
}

export function CaseCard(props) {
  return <WishPaperCard cardIndex={2} {...props} />;
}

export function VisionCard(props) {
  return <WishPaperCard cardIndex={3} {...props} />;
}

export function AlloyCard(props) {
  return <WishPaperCard cardIndex={4} {...props} />;
}

export function JournalCard(props) {
  return <WishPaperCard cardIndex={5} {...props} />;
}
