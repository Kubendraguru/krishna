import React from 'react';

export default function Scanner({ count, percent }) {
  return (
    <>
      <div className="badge divine-badge">
        <span className="badge-label">Divine Transformation · ஞான மாற்றம்</span>
        <div className="badge-pill">
          <span className="badge-num" id="badge-num">
            {count || '100% Peace'}
          </span>
          <span className="badge-pct" id="badge-pct">
            {percent || 'அருள் · Blessing'}
          </span>
        </div>
      </div>

      {/* Divine Central Krishna Avatar replacing the orange laser screen */}
      <div className="krishna-central-avatar" aria-hidden="true">
        <div className="krishna-celestial-halo" />
        <img
          src="/krishna-divider.png"
          alt="Lord Krishna Divine Blessing"
          className="krishna-avatar-img"
        />
        <div className="krishna-water-glow" />
      </div>

      {/* Refined Ethereal Golden Light Beam aligned with Lord Krishna */}
      <div className="scan golden-scan">
        <b className="scan-halo golden-halo" />
        <i className="scan-core golden-core" />
      </div>
    </>
  );
}
