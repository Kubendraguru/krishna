import React, { useRef, useState, useEffect } from 'react';

const VIDEO_URL = 'https://res.cloudinary.com/qrhgjdrs/video/upload/v1793454466/krish_v7zsx6.mp4';

export default function IntroScene({ onFinish }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleEnd = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 750);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  return (
    <div className={`intro-container ${isExiting ? 'intro-exit' : ''}`}>
      <video
        ref={videoRef}
        src={VIDEO_URL}
        className="intro-video"
        playsInline
        autoPlay
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnd}
      />

      {/* Ambient cinematic overlay */}
      <div className="intro-vignette" />

      {/* Top Header */}
      <div className="intro-topbar">
        <div className="intro-logo">
          <svg viewBox="0 0 19 23" fill="currentColor">
            <path d="M 9.5 1.5 C 9.5 1.5 1.5 11.5 1.5 16 A 8 8 0 0 0 17.5 16 C 17.5 11.5 9.5 1.5 9.5 1.5 Z" />
            <path
              d="M 5.8 14.5 C 5.3 11.5 7.2 7.2 9.5 4"
              stroke="#07090C"
              strokeWidth="1.7"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span>Distill</span>
        </div>

        <div className="intro-actions">
          <button
            type="button"
            className="intro-btn-audio"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span>Unmute</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span>Mute</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="intro-btn-skip"
            onClick={handleEnd}
          >
            <span>Skip Intro</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="intro-progress-track">
        <div
          className="intro-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
