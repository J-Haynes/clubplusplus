'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import InstallPrompt from './components/InstallPrompt';

function luhnCheckDigit(partial: string): number {
  const digits = partial.split('').map(Number).reverse();
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}

function generateLoyaltyNumber(): string {
  // 11-digit prefix + 4 random digits + 1 Luhn check = 16 digits (10,000 possible numbers)
  const prefix = '60591742547';
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  const partial = prefix + random;
  return partial + luhnCheckDigit(partial);
}

function formatCardNumber(n: string): string {
  return n.replace(/(.{4})/g, '$1 ').trim();
}

export default function Home() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setCardNumber(generateLoyaltyNumber());
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  // Keep the screen awake while the barcode is on display
  useEffect(() => {
    let sentinel: WakeLockSentinel | null = null;

    async function acquire() {
      if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
      try {
        await sentinel?.release();
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // Wake lock unavailable or denied — silently ignored
      }
    }

    acquire();
    document.addEventListener('visibilitychange', acquire);
    return () => {
      document.removeEventListener('visibilitychange', acquire);
      sentinel?.release().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!cardNumber || !svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    import('jsbarcode').then(({ default: JsBarcode }) => {
      const svg = svgRef.current!;
      const opts = {
        format: 'CODE128',
        displayValue: true,
        fontSize: 18,
        textMargin: 8,
        margin: 6,
        height: 210,
        background: '#f8fafc',
        lineColor: '#0f172a',
        font: 'monospace',
      };

      // Measure the pure bar-module span at width=1, no text, no margins influencing it
      svg.style.display = 'none';
      JsBarcode(svg, cardNumber, { ...opts, width: 1, displayValue: false });
      const baseWidth = parseFloat(svg.getAttribute('width') || '200');

      // margin is a fixed pixel value on each side — subtract it from both sides so the
      // bar modules scale to fill (containerWidth - 2*margin) exactly, not containerWidth.
      // Without this, the final SVG is narrower than the container and appears off-centre.
      const margin = opts.margin;
      const barWidth = (containerWidth - 2 * margin) / (baseWidth - 2 * margin);
      JsBarcode(svg, cardNumber, { ...opts, width: barWidth });

      // Make the SVG fill the container width while keeping its natural pixel height
      const w = svg.getAttribute('width');
      const h = svg.getAttribute('height');
      if (w && h) {
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('width', '100%');
        // Leave height as the pixel value JsBarcode computed — the container grows around it
        svg.style.display = 'block';
      }
    });
  }, [cardNumber]);

  function copyNumber() {
    if (!cardNumber) return;

    const succeed = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // Clipboard API requires HTTPS — fall back to execCommand on plain HTTP (e.g. LAN dev)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cardNumber).then(succeed).catch(fallback);
    } else {
      fallback();
    }

    function fallback() {
      const el = document.createElement('textarea');
      el.value = cardNumber;
      el.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      try { document.execCommand('copy'); succeed(); } catch (_) { /* silent */ }
      document.body.removeChild(el);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 pt-10 pb-0 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">👁️</span>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Club<span className="text-amber-400">++</span>
          </h1>
          <span className="text-2xl">👁️</span>
        </div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">
          Earn points. Lose privacy. Repeat.
        </p>
        <Mascot className="w-32 mx-auto" />
      </header>

      <main className="flex-1 pb-16 max-w-lg mx-auto w-full">

        {/* Card — breaks out of any side padding to fill the screen */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-10">
          {/* Card top strip */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-300 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-slate-900 font-black text-lg leading-none">
                Club<span className="text-slate-700">++</span>
              </p>
              <p className="text-slate-800 text-xs font-semibold">
                LOYALTY &amp; SURVEILLANCE CARD
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-800 text-xs">Member Since</p>
              <p className="text-slate-900 font-bold text-sm">RIGHT NOW</p>
            </div>
          </div>

          {/* Barcode area */}
          <div className="bg-slate-100 py-6 px-4">
            <div ref={containerRef}>
              {cardNumber ? (
                <svg ref={svgRef} />
              ) : (
                <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
                  Generating...
                </div>
              )}
            </div>
          </div>

          {/* Card bottom strip */}
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">
                Card Number
              </p>
              <p className="text-white font-mono font-bold text-base tracking-widest">
                {cardNumber ? formatCardNumber(cardNumber) : '---- ---- ---- ----'}
              </p>
            </div>
            <button
              onClick={copyNumber}
              aria-label="Copy card number"
              className="text-xs bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Padded content below the card */}
        <div className="px-4">

          {/* Generate button */}
          <button
            onClick={generate}
            className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-amber-900/30"
          >
            Generate New Card
          </button>

          <InstallPrompt />

          {/* What is this */}
          <div className="mt-6 mb-6">
            <h2 className="text-center text-slate-300 font-bold text-base uppercase tracking-widest mb-4">
              What is this?
            </h2>
            <InfoCard
              icon="💳"
              title="Your Club++ card"
              body="A private, randomly generated barcode that scans at the till - no account, no sign-up, no data trail."
              className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4"
            />
          </div>

          {/* Info section */}
          <div className="space-y-4 mb-6">
            <h2 className="text-center text-slate-300 font-bold text-base uppercase tracking-widest mb-4">
              Wait, why does any of this matter?
            </h2>

            <InfoCard
              icon="🛒"
              title="Your basket is more valuable than the points"
              body='Every scan builds a profile - what you eat, when you shop, how much you spend. That profile is worth a lot more to data brokers and marketers than reward points or member "deals".'
            />

            <InfoCard
              icon="📬"
              title="It doesn't just power coupons"
              body="Loyalty data gets shared well beyond sending you targeted offers. It can end up with insurers, research firms, and third-party data brokers. Worth knowing what you're signing up for."
            />

            <InfoCard
              icon="🏷️"
              title="Be a smarter shopper"
              body={<>Consumer NZ warned Kiwis to{' '}
                <a href="https://www.consumer.org.nz/about-us/media-releases/consumer-nz-warns-supermarket-shoppers-beware-of-loyalty-lure" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">&ldquo;beware of the loyalty lure&rdquo;</a>
                {' '}- their research found loyalty &ldquo;special&rdquo; prices are regularly not "deals" at all. Before you shop, compare prices at{' '}
                <a href="https://grocer.nz/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">grocer.nz</a>
                {' '}or{' '}
                <a href="https://grosave.co.nz/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">grosave.co.nz</a>
                .</>}
            />
          </div>

          {/* Legal notice — at the bottom where it belongs */}
          <div className="mb-6 bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              <span className="font-semibold text-slate-400">⚠️ Important Notice</span>
              <br />
              Please <em>DO NOT</em> use this as a replacement for your actual Club+ card. This
              may result in missing reward points and/or a meaningful improvement to your personal data footprint.
              Club++ is not affiliated with any supermarket or loyalty scheme and accepts no
              responsibility for any of the above, or indeed anything at all.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-600 text-xs pb-6">
            No data is collected or stored here.{' '}
            <span className="text-slate-500">Unlike actual loyalty schemes.</span>
            {' · '}
          </p>
              <p className="text-center text-slate-600 text-xs pb-6">
            <a
              href="https://github.com/J-Haynes/clubplusplus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-400 underline transition-colors"
            >
              Source code
            </a>
                
              </p>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
  className,
}: {
  icon: string;
  title: string;
  body: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? 'bg-slate-800/60 border border-slate-700/50 rounded-xl p-4'}>
      <div className="flex gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
        <div>
          <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

function Mascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 144 86"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Starburst — amber instead of original purple */}
      <g transform="translate(8.68,7.28) scale(0.34)">
        <path
          fill="#fbbf24"
          d="M189.09,35.75 L219.04,0 L236.42,43.17 L276.02,18.43 L279.12,64.83
             L324.5,53.41 L313.01,98.48 L359.69,101.6 L334.76,140.97 L378.22,158.21
             L342.27,188.02 L378.22,217.79 L334.76,235.07 L359.69,274.43 L313.01,277.52
             L324.5,322.59 L279.12,311.21 L276.02,357.61 L236.42,332.83 L219.04,376
             L189.09,340.29 L159.15,376 L141.76,332.83 L102.17,357.61 L99.07,311.21
             L53.73,322.59 L65.18,277.52 L18.5,274.43 L43.42,235.07 L0,217.79
             L35.92,188.02 L0,158.21 L43.42,140.97 L18.5,101.6 L65.18,98.48
             L53.73,53.41 L99.07,64.83 L102.17,18.43 L141.76,43.17 L159.15,0 Z"
        />
      </g>

      {/* Left eye — white sclera + dark pupil directly on amber starburst */}
      <circle cx="59.9" cy="63.6" r="9.5" fill="white" />
      <circle cx="59.9" cy="63.6" r="3.5" fill="#282820" />
      <circle cx="59.9" cy="63.6" r="1.2" fill="#fbbf24" />

      {/* Right eye */}
      <circle cx="83.1" cy="63.5" r="9.5" fill="white" />
      <circle cx="83.1" cy="63.5" r="3.5" fill="#282820" />
      <circle cx="83.1" cy="63.5" r="1.2" fill="#fbbf24" />
    </svg>
  );
}
