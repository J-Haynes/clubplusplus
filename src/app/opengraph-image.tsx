import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#020617',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial Black, sans-serif',
        fontWeight: 900,
      }}
    >
      {/* Decorative barcode lines */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 48, opacity: 0.15 }}>
        {[3, 8, 3, 16, 3, 8, 3, 24, 3, 8, 3, 16, 3, 8, 3, 24, 3, 8, 3, 16, 3, 8, 3].map(
          (w, i) => (
            <div
              key={i}
              style={{ width: w, height: 120, background: 'white', borderRadius: 2 }}
            />
          ),
        )}
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 140, letterSpacing: '-4px' }}>
        <span style={{ color: 'white' }}>Club</span>
        <span style={{ color: '#fbbf24' }}>++</span>
      </div>

      {/* Tagline */}
      <div
        style={{
          color: '#64748b',
          fontSize: 32,
          letterSpacing: '6px',
          textTransform: 'uppercase',
          marginTop: 16,
          fontWeight: 400,
        }}
      >
        Earn points. Lose privacy. Repeat.
      </div>
    </div>,
    { ...size },
  );
}
