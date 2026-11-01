import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const textareaRef = useRef(null);
  const popupTextareaRef = useRef(null);

  // Focus popup textarea when opened
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        if (popupTextareaRef.current) {
          popupTextareaRef.current.focus();
          const len = popupTextareaRef.current.value.length;
          popupTextareaRef.current.setSelectionRange(len, len);
        }
      }, 100);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsPopupOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isPopupOpen]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (onWishChange) onWishChange(cardIndex, val);
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    setText('');
    if (onWishChange) onWishChange(cardIndex, '');
    if (popupTextareaRef.current) popupTextareaRef.current.focus();
    else if (textareaRef.current) textareaRef.current.focus();
  };

  const handleAskWisdom = (e) => {
    e?.stopPropagation();
    if (onSeekWisdom && text.trim().length > 3) {
      onSeekWisdom(cardIndex, text.trim());
    }
  };

  const handleQuickPrompt = (promptText) => {
    setText(promptText);
    if (onWishChange) onWishChange(cardIndex, promptText);
    if (onSeekWisdom) onSeekWisdom(cardIndex, promptText);
    if (popupTextareaRef.current) popupTextareaRef.current.focus();
  };

  const handleOpenPopup = (e) => {
    e?.stopPropagation();
    setIsPopupOpen(true);
  };

  const handleClosePopup = (e) => {
    e?.stopPropagation();
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* ─── RESTING CARD ON CONVEYOR BELT ─── */}
      <div
        className={`k-card wish-paper-card ${isFocused ? 'is-focused' : ''}`}
        id={`card-${cardIndex}`}
        ref={innerRef}
        onClick={handleOpenPopup}
      >
        <div className="paper-texture-overlay" />
        <div className="wish-paper-inner">
          <div className="wish-paper-header">
            <div className="wish-feather-badge">
              <span className="feather-icon">🪶</span>
              <div className="feather-text">
                <span className="feather-sanskrit">श्री कृष्णाय नमः</span>
                <span className="feather-sub">Sacred Prayer Slip · தமிழ் / Eng</span>
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
                  {isAiGenerating ? '✨ Discerning...' : '✨ Seek Wisdom'}
                </button>
              )}
              {text.length > 0 && (
                <button
                  type="button"
                  className="btn-clear-wish"
                  onClick={handleClear}
                  title="Clear and write a fresh wish"
                >
                  Clear
                </button>
              )}
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
                ) : (
                  <button
                    type="button"
                    className="btn-popup-trigger-pill"
                    onClick={handleOpenPopup}
                    title="Click to pop up and write in large view"
                  >
                    🔍 Click to write in large view
                  </button>
                )}
              </div>
            </div>
            <p className="wish-card-subtitle">{data.subTitle}</p>
          </div>

          <div
            className={`wish-textarea-container ${isFocused ? 'container-focused' : ''}`}
            onClick={handleOpenPopup}
            title="Click to pop up and write in large comfortable view"
          >
            <textarea
              ref={textareaRef}
              className="wish-paper-textarea"
              value={text}
              onChange={handleTextChange}
              onFocus={() => {
                setIsFocused(true);
                setIsPopupOpen(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder="✍️ Click anywhere here to pop up and write your prayer in large view... (English, Tanglish, or தமிழ்)"
              autoComplete="off"
              spellCheck="true"
              readOnly
            />
            <div className="textarea-click-overlay-hint">
              <span>✍️ Click to open writing pop-up</span>
            </div>
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

      {/* ─── EXPANDED POP-UP WRITING MODAL (COMES FRONT) ─── */}
      {isPopupOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="writing-popup-overlay" onClick={handleClosePopup}>
            <div
              className="writing-popup-dialog"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="popup-prayer-title"
            >
              <div className="popup-paper-texture" />

              {/* Popup Header */}
              <div className="popup-header">
                <div className="popup-feather-badge">
                  <span className="popup-feather-icon">🪶</span>
                  <div className="popup-feather-titles">
                    <span className="popup-feather-sanskrit">श्री कृष्णाय नमः</span>
                    <h2 id="popup-prayer-title" className="popup-main-title">
                      {data.title}
                    </h2>
                  </div>
                </div>

                <div className="popup-header-controls">
                  {text.length > 3 && (
                    <button
                      type="button"
                      className={`btn-popup-seek ${isAiGenerating ? 'is-loading' : ''}`}
                      onClick={handleAskWisdom}
                      title="Seek Gita Wisdom from Gemini AI"
                    >
                      {isAiGenerating ? '✨ Discerning...' : '✨ Seek Wisdom · அருள்'}
                    </button>
                  )}
                  {text.length > 0 && (
                    <button
                      type="button"
                      className="btn-popup-clear"
                      onClick={handleClear}
                      title="Clear written prayer"
                    >
                      Clear · வெற்று
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-popup-close-x"
                    onClick={handleClosePopup}
                    title="Close and return to belt (Esc)"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Popup Subtitle & Language Guidance */}
              <div className="popup-subtitle-bar">
                <p className="popup-subtitle-text">
                  Pour your heart out freely. Type in <strong>English</strong>, <strong>Tanglish</strong> (e.g. <em>"Kanna romba bayama irukku"</em>), or <strong>தமிழ்</strong>.
                </p>
                <div className="popup-status-pill-area">
                  {isAiGenerating ? (
                    <span className="popup-status-pill pill-ai-loading">
                      ✨ Krishna is discerning your words...
                    </span>
                  ) : hasCustomWisdom ? (
                    <span className="popup-status-pill pill-ai-ready">
                      ✦ Divine Gita Wisdom is Ready!
                    </span>
                  ) : (
                    <span className="popup-status-pill">✍️ Writing Prayer</span>
                  )}
                </div>
              </div>

              {/* Large, Beautiful Ruled Parchment Textarea */}
              <div className="popup-textarea-container">
                <textarea
                  ref={popupTextareaRef}
                  className="popup-large-textarea"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="✍️ Type your prayer, wish, life burdens, or worries here in English, Tanglish, or தமிழ்...&#10;&#10;Examples:&#10;• 'Kanna romba bayama irukku, future pathi tension ah irukku'&#10;• 'Lord Krishna, please grant me peace, clarity and strength in this difficult time'&#10;• 'என் மனதில் இருக்கும் குழப்பங்கள் நீங்கி எனக்கு நல்வழி காட்டு'"
                  autoComplete="off"
                  spellCheck="true"
                />
              </div>

              {/* Quick Feeling Tags in Large Popup */}
              <div className="popup-quick-prompts">
                <span className="popup-quick-label">Need inspiration? Quick prayer:</span>
                <button
                  type="button"
                  className="btn-popup-tag"
                  onClick={() => handleQuickPrompt('Kanna romba bayama irukku, enaku nalla vazhi kaatu')}
                >
                  🛡️ பயம் & நல்வழி (Fear & Path)
                </button>
                <button
                  type="button"
                  className="btn-popup-tag"
                  onClick={() => handleQuickPrompt('I surrender all my worries and anxieties at Your lotus feet')}
                >
                  🕊️ அமைதி (Surrender & Peace)
                </button>
                <button
                  type="button"
                  className="btn-popup-tag"
                  onClick={() => handleQuickPrompt('Lord Krishna, please give me courage, focus, and strength to perform my duty')}
                >
                  ⚡ தைரியம் & கடமை (Courage & Duty)
                </button>
              </div>

              {/* Popup Bottom Bar: Return to Belt */}
              <div className="popup-footer-bar">
                <div className="popup-char-count">
                  <span>{text.length} characters written</span>
                </div>
                <button
                  type="button"
                  className="btn-popup-done"
                  onClick={handleClosePopup}
                  title="Save and return to the conveyor belt"
                >
                  <span className="btn-done-check">✓</span>
                  <span>Done Writing · Return to Belt (பின் செல்)</span>
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
