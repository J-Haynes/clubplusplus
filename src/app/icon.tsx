import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#0f172a',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial Black, sans-serif',
        fontWeight: 900,
        fontSize: 14,
        color: 'white',
        letterSpacing: '-1px',
      }}
    >
      C<span style={{ color: '#fbbf24' }}>++</span>
    </div>,
    { ...size },
  );
}
