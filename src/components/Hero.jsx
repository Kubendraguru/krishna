import React from 'react';
import RippleDistortion from './RippleDistortion';

const HEADER_VIDEO_URL =
  'https://res.cloudinary.com/qrhgjdrs/video/upload/v1793456312/Figure_floating_in_water_d7123c0b_1080p_gwr_video_mvp_gf3xr5.mp4';

export default function Hero() {
  return (
    <section className="hero-video-section">
      <div className="hero-video-frame">
        <RippleDistortion
          src={HEADER_VIDEO_URL}
          brushSize={85}
          strength={0.048}
          swirl={0.22}
          rings={3}
          grayscale={false}
          spread={4.2}
          fade={2.4}
          spacing={22}
          dispersion={0}
          glint={0.15}
          tintAmount={0}
          highlightColor="#ffffff"
          trigger="hover"
          clickStrength={1.5}
          quality="high"
          enabled
        />
      </div>
    </section>
  );
}

