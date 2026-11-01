import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CARD_DATA, PALETTE, hash3 } from '../data/cards';
import {
  HomeCard,
  PriceCard,
  CaseCard,
  VisionCard,
  AlloyCard,
  JournalCard
} from './KesslerCards';
import CodeCard from './CodeCards';
import { fetchGeminiGitaWisdom } from '../services/geminiService';

const CARD_COMPONENTS = [
  HomeCard,
  PriceCard,
  CaseCard,
  VisionCard,
  AlloyCard,
  JournalCard
];

export default function Belt({ onCounterUpdate }) {
  const beltRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef([]);
  const codeRefs = useRef([]);

  // Store AI-generated personalized wisdom per card index
  const [customWisdoms, setCustomWisdoms] = useState({});
  const debounceTimers = useRef({});

  const generateWisdom = useCallback(async (cardIndex, text) => {
    if (!text || text.trim().length < 5) return;
    
    setCustomWisdoms((prev) => ({
      ...prev,
      [cardIndex]: { ...prev[cardIndex], isLoading: true }
    }));

    try {
      const result = await fetchGeminiGitaWisdom(text);
      if (result) {
        setCustomWisdoms((prev) => ({
          ...prev,
          [cardIndex]: { wisdom: result, isLoading: false }
        }));
      } else {
        setCustomWisdoms((prev) => ({
          ...prev,
          [cardIndex]: { ...prev[cardIndex], isLoading: false }
        }));
      }
    } catch (_) {
      setCustomWisdoms((prev) => ({
        ...prev,
        [cardIndex]: { ...prev[cardIndex], isLoading: false }
      }));
    }
  }, []);

  const handleWishChange = useCallback((cardIndex, newText) => {
    // Clear previous debounce timer
    if (debounceTimers.current[cardIndex]) {
      clearTimeout(debounceTimers.current[cardIndex]);
    }

    if (!newText || newText.trim().length < 5) {
      setCustomWisdoms((prev) => {
        const next = { ...prev };
        delete next[cardIndex];
        return next;
      });
      return;
    }

    // Auto-generate after 1200ms pause in typing
    debounceTimers.current[cardIndex] = setTimeout(() => {
      generateWisdom(cardIndex, newText);
    }, 1200);
  }, [generateWisdom]);

  const handleSeekWisdom = useCallback((cardIndex, text) => {
    if (debounceTimers.current[cardIndex]) {
      clearTimeout(debounceTimers.current[cardIndex]);
    }
    generateWisdom(cardIndex, text);
  }, [generateWisdom]);

  useEffect(() => {
    const belt = beltRef.current;
    const canvas = canvasRef.current;
    if (!belt || !canvas) return;

    const ctx = canvas.getContext('2d');
    const NUM_CARDS = CARD_DATA.length;

    // Geometry state
    let cw = 0;
    let ch = 0;
    let gap = 0;
    let span = 0;
    let period = 0;
    let Lx = 0;
    let dpr = 1;
    const cardTop = 70;

    let off = 0;
    let vel = 0;
    let hover = 0;
    let hoverTarget = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let dragVelocity = 0;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sparks
    const sparks = [];

    // Counter interpolation
    let displayedCounter = 48193;
    let activeCardIndex = 0;

    function updateGeometry() {
      const W = window.innerWidth;
      Lx = W / 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const firstCard = cardRefs.current[0];
      if (firstCard) {
        const rect = firstCard.getBoundingClientRect();
        cw = rect.width;
        ch = rect.height;
      }

      const isMobile = window.innerWidth <= 767;
      if (isMobile) {
        gap = Math.max(260, Math.round(W * 0.65));
      } else {
        // Measure Krishna's avatar image width to dynamically guarantee no overlap with his hands or arms
        const avatarImg = document.querySelector('.krishna-avatar-img');
        const avatarW = avatarImg ? avatarImg.getBoundingClientRect().width : 460;
        // Provide at least avatar width + 50px buffer (25px breathing room on each side of Krishna's outstretched hands)
        const minKrishnaGap = Math.round(avatarW + 50);
        const preferredGap = Math.round((36 / 100) * W);
        gap = Math.max(minKrishnaGap, Math.min(560, preferredGap));
      }

      span = cw + gap;
      period = span * NUM_CARDS;

      const beltRect = belt.getBoundingClientRect();
      canvas.width = Math.round(beltRect.width * dpr);
      canvas.height = Math.round(beltRect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    updateGeometry();
    // Position the active paper card to the right of Lord Krishna with comfortable breathing room so neither hand is obscured
    off = Lx + gap / 2;

    const handleResize = () => {
      updateGeometry();
      if (!isDragging && Math.abs(vel) < 0.1) {
        if (off < Lx) {
          off = Lx - gap / 2 - cw;
        } else {
          off = Lx + gap / 2;
        }
      }
    };
    window.addEventListener('resize', handleResize);

    // Hover
    const onMouseEnter = () => { hoverTarget = 1; };
    const onMouseLeave = () => { hoverTarget = 0; };
    belt.addEventListener('pointerenter', onMouseEnter);
    belt.addEventListener('pointerleave', onMouseLeave);

    // Pointer Drag vs Click Handling
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isPotentialDrag = false;
    let activePointerId = null;

    const onPointerDown = (e) => {
      // Allow user to click, focus, select and type into textareas/inputs/buttons cleanly
      const isInput =
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('textarea') ||
        e.target.closest('input') ||
        e.target.closest('button') ||
        e.target.closest('.wish-textarea-container');

      if (isInput) {
        // Native input interaction - do not intercept or capture pointer
        return;
      }

      // If user clicked anywhere on the paper card (e.g. background, header, margins)
      const paperCard = e.target.closest('.wish-paper-card');
      if (paperCard) {
        const ta = paperCard.querySelector('textarea');
        if (ta) {
          ta.focus();
        }
      }

      // Prepare potential drag, but do NOT capture pointer until drag threshold is exceeded
      isPotentialDrag = true;
      isDragging = false;
      activePointerId = e.pointerId;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      lastPointerX = e.clientX;
      lastPointerTime = performance.now();
      dragVelocity = 0;
    };

    const onPointerMove = (e) => {
      if (!isPotentialDrag && !isDragging) return;

      const totalDx = Math.abs(e.clientX - pointerStartX);
      const totalDy = Math.abs(e.clientY - pointerStartY);

      // Only engage belt dragging if the pointer has moved beyond a 6px threshold
      if (!isDragging && (totalDx > 6 || totalDy > 6)) {
        // If the movement is mostly vertical on a card, let the user scroll the page instead
        if (totalDy > totalDx && e.target.closest('.wish-paper-card')) {
          isPotentialDrag = false;
          return;
        }

        isDragging = true;
        try {
          belt.setPointerCapture(activePointerId);
        } catch (_) {}
        belt.classList.add('is-dragging');
      }

      if (isDragging) {
        const now = performance.now();
        const dt = Math.max(0.008, (now - lastPointerTime) / 1000);
        const dx = e.clientX - lastPointerX;

        off += dx;
        dragVelocity = (dx / dt) * 0.8 + dragVelocity * 0.2;

        lastPointerX = e.clientX;
        lastPointerTime = now;
      }
    };

    const stopDragging = () => {
      isPotentialDrag = false;
      if (isDragging) {
        isDragging = false;
        vel = dragVelocity;
        belt.classList.remove('is-dragging');
        if (activePointerId !== null) {
          try {
            belt.releasePointerCapture(activePointerId);
          } catch (_) {}
          activePointerId = null;
        }
      }
    };

    belt.addEventListener('pointerdown', onPointerDown);
    belt.addEventListener('pointermove', onPointerMove);
    belt.addEventListener('pointerup', stopDragging);
    belt.addEventListener('pointercancel', stopDragging);

    // Wheel
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        vel += -e.deltaX * 6;
      }
    };
    belt.addEventListener('wheel', onWheel, { passive: false });

    // Dissolve FX (Haze + Dithered particles)
    function drawCardDissolve(cardIndex, x, cut, tSec) {
      // 1. Haze
      const hazeWidth = Math.min(150, x + cw - Lx);
      if (hazeWidth > 0) {
        const hazeGrad = ctx.createLinearGradient(Lx, 0, Lx + 150, 0);
        hazeGrad.addColorStop(0, 'rgba(212, 175, 55, 0.45)');
        hazeGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.22)');
        hazeGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(Lx, cardTop, hazeWidth, ch);
      }

      // 2. Dithered particles
      const R = 0.3 * cw;
      const startGx = Math.max(0, Math.floor((Lx - x) / 3));
      const endGx = Math.min(Math.floor(cw / 3), Math.floor((Lx - x + R) / 3));
      const totalRows = Math.floor(ch / 3);
      const twinkleTime = Math.floor(tSec * 9) + 97;

      for (let gx = startGx; gx <= endGx; gx++) {
        const sx = x + gx * 3;
        const d = sx - Lx;
        if (d < 0 || d > R) continue;

        const p = Math.pow(1 - d / R, 1.7);
        const isNearLine = d < 10;

        for (let row = -5; row <= totalRows + 5; row++) {
          let threshold;
          if (row >= 0 && row <= totalRows) {
            threshold = p * 0.92;
          } else {
            const rowDist = row < 0 ? -row : row - totalRows;
            threshold = p * 0.16 * Math.max(0, 1 - rowDist / 5);
          }

          if (threshold <= 0) continue;

          // Spatial hash
          const h = hash3(gx, row, cardIndex);
          if (h >= threshold) continue;

          // Twinkle
          if (!prefersReducedMotion) {
            const tw = hash3(gx, row, twinkleTime);
            if (tw < 0.22) continue;
          }

          // Color selection
          const h2 = hash3(row, gx, cardIndex + 31);
          let color;
          if (isNearLine) {
            const colorIdx = 4 + Math.floor(h2 * 3);
            color = PALETTE[Math.min(6, colorIdx)];
          } else {
            const colorIdx = Math.floor(h2 * h2 * 7);
            color = PALETTE[Math.min(6, colorIdx)];
          }

          const size = 1.1 + h2 * 1.7;

          let jx = 0;
          let jy = 0;
          if (!prefersReducedMotion) {
            jx = (hash3(gx, row, 11) - 0.5) * 1.6;
            jy = (hash3(row, gx, 23) - 0.5) * 1.6;
          }

          ctx.fillStyle = color;
          ctx.fillRect(sx + jx, cardTop + row * 3 + jy, size, size);
        }
      }
    }

    // Sparks
    function drawSparks(dt) {
      if (!prefersReducedMotion) {
        for (let s = 0; s < 3; s++) {
          if (Math.random() < 0.7) {
            sparks.push({
              x: Lx + Math.random() * 30,
              y: cardTop - 10 + Math.random() * (ch + 20),
              vx: -30 + Math.random() * 70 + vel * 0.6,
              vy: (Math.random() - 0.5) * 50,
              life: 0,
              maxLife: 0.3 + Math.random() * 0.8,
              size: 0.8 + Math.random() * 1.8,
              color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
            });
          }
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life += dt;

        if (sp.life >= sp.maxLife) {
          sparks.splice(i, 1);
          continue;
        }

        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;

        const alpha = Math.min(1, sp.life * 2.2) * Math.max(0, 1 - sp.life / sp.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = sp.color;
        ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
      }
      ctx.globalAlpha = 1;
    }

    // Animation Loop
    let animId;
    let lastTime = performance.now();

    function tick(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const tSec = now / 1000;

      // User-driven interaction: the belt stays still so user can write and drag at their own pace
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT');

      if (!isDragging) {
        // Natural friction/inertia when user releases after dragging
        vel *= Math.exp(-3.8 * dt);
        if (Math.abs(vel) < 0.1) vel = 0;
        off += vel * dt;
      }

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      let crossingCardFound = false;
      let crossingIndex = -1;
      let crossingCut = 0;

      for (let i = 0; i < NUM_CARDS; i++) {
        const raw = off + i * span + span;
        const x = ((((raw % period) + period) % period)) - span;

        const card = cardRefs.current[i];
        const code = codeRefs.current[i];
        if (!card || !code) continue;

        const cut = Math.min(Math.max(Lx - x, 0), cw);

        card.style.transform = `translate3d(${x}px, 0, 0)`;

        if (cut > 0) {
          card.style.clipPath = `inset(0 0 0 ${cut}px round 0 1.6vw 1.6vw 0)`;
          const maskGrad = `linear-gradient(90deg, transparent ${cut}px, #000 ${cut + 26}px)`;
          card.style.webkitMaskImage = maskGrad;
          card.style.maskImage = maskGrad;
        } else {
          card.style.clipPath = 'none';
          card.style.webkitMaskImage = 'none';
          card.style.maskImage = 'none';
        }

        code.style.transform = `translate3d(${x}px, 0, 0)`;
        code.style.clipPath = `inset(0 ${cw - cut}px 0 0)`;
        code.style.visibility = cut === 0 ? 'hidden' : 'visible';

        if (cut > 0 && cut < cw) {
          crossingCardFound = true;
          crossingIndex = i;
          crossingCut = cut;
        }

        if (cut > 0 && x + cw > Lx) {
          drawCardDissolve(i, x, cut, tSec);
        }
      }

      // Divine Transformation Progress
      if (crossingCardFound) {
        const progress = Math.min(1, Math.max(0, crossingCut / cw));
        const peacePct = Math.round(progress * 100);

        if (onCounterUpdate) {
          onCounterUpdate(
            peacePct + '% Peace',
            'அருள் · Blessing'
          );
        }
      }

      drawSparks(dt);
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      belt.removeEventListener('pointerenter', onMouseEnter);
      belt.removeEventListener('pointerleave', onMouseLeave);
      belt.removeEventListener('pointerdown', onPointerDown);
      belt.removeEventListener('pointermove', onPointerMove);
      belt.removeEventListener('pointerup', stopDragging);
      belt.removeEventListener('pointercancel', stopDragging);
      belt.removeEventListener('wheel', onWheel);
    };
  }, [onCounterUpdate]);

  return (
    <div className="belt" ref={beltRef}>
      {/* Layer 1: Code (Divine Scanned Card) */}
      <div className="belt-layer codes">
        {CARD_DATA.map((_, i) => (
          <CodeCard
            key={i}
            cardIndex={i}
            innerRef={(el) => { codeRefs.current[i] = el; }}
            customWisdom={customWisdoms[i]?.wisdom}
            isLoadingWisdom={Boolean(customWisdoms[i]?.isLoading)}
          />
        ))}
      </div>

      {/* Layer 2: Cards (Interactive Sacred Prayer Papers) */}
      <div className="belt-layer cards">
        {CARD_COMPONENTS.map((Component, i) => (
          <Component
            key={i}
            innerRef={(el) => { cardRefs.current[i] = el; }}
            onWishChange={handleWishChange}
            onSeekWisdom={handleSeekWisdom}
            isAiGenerating={Boolean(customWisdoms[i]?.isLoading)}
            hasCustomWisdom={Boolean(customWisdoms[i]?.wisdom)}
          />
        ))}
      </div>

      {/* Layer 3: FX Canvas */}
      <canvas className="fx" ref={canvasRef} />
    </div>
  );
}
