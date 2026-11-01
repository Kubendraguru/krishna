import React from 'react';

export default function Nav({ onReplayIntro }) {
  return (
    <header className="nav">
      <a href="#" className="nav-logo" aria-label="Distill Home">
        <svg viewBox="0 0 19 23" fill="currentColor">
          <path d="M 9.5 1.5 C 9.5 1.5 1.5 11.5 1.5 16 A 8 8 0 0 0 17.5 16 C 17.5 11.5 9.5 1.5 9.5 1.5 Z" />
          <path
            d="M 5.8 14.5 C 5.3 11.5 7.2 7.2 9.5 4"
            stroke="var(--bg)"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span>Distill</span>
      </a>

      <nav className="nav-links">
        {onReplayIntro && (
          <button
            type="button"
            className="nav-btn-replay"
            onClick={onReplayIntro}
            title="Watch intro video"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Intro</span>
          </button>
        )}
        <a href="#">
          Product
          <svg viewBox="0 0 8 5" fill="none">
            <path
              d="M1 1L4 4L7 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a href="#">
          Use cases
          <svg viewBox="0 0 8 5" fill="none">
            <path
              d="M1 1L4 4L7 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a href="#">
          Resources
          <svg viewBox="0 0 8 5" fill="none">
            <path
              d="M1 1L4 4L7 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a href="#">Pricing</a>
      </nav>

      <div className="nav-right">
        <a href="#" className="btn-signin">Sign in</a>
        <a href="#" className="btn-trial">Start a free trial</a>
        <a href="#" className="btn-demo">Book a demo</a>
      </div>
    </header>
  );
}
