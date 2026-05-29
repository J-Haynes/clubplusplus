import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    <div
      style={{
        background: '#0f172a',
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
      <div style={{ display: 'flex', fontSize: 220, color: 'white', letterSpacing: '-6px' }}>
        C<span style={{ color: '#fbbf24' }}>++</span>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
        {[20, 36, 16, 36, 26, 16, 36, 20, 30, 16].map((h, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: h,
              background: i % 3 === 0 ? '#fbbf24' : '#334155',
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </div>,
    { width: 512, height: 512 },
  );
}
