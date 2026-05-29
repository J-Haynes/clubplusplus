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
      <div style={{ display: 'flex', fontSize: 80, color: 'white', letterSpacing: '-2px' }}>
        C<span style={{ color: '#fbbf24' }}>++</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
        {[8, 14, 6, 14, 10, 6, 14, 8, 12, 6].map((h, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: h,
              background: i % 3 === 0 ? '#fbbf24' : '#334155',
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>,
    { width: 192, height: 192 },
  );
}
