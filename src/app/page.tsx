'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  const prefix = '605917425470';
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const partial = prefix + random;
  return partial + luhnCheckDigit(partial);
}

function formatCardNumber(n: string): string {
  return n.replace(/(.{4})/g, '$1 ').trim();
}

export default function Home() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setCardNumber(generateLoyaltyNumber());
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  useEffect(() => {
    if (!cardNumber || !svgRef.current) return;

    import('jsbarcode').then(({ default: JsBarcode }) => {
      JsBarcode(svgRef.current!, cardNumber, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 16,
        textMargin: 6,
        margin: 14,
        width: 2.2,
        height: 80,
        background: '#f8fafc',
        lineColor: '#0f172a',
        font: 'monospace',
      });

      const svg = svgRef.current!;
      const w = svg.getAttribute('width');
      const h = svg.getAttribute('height');
      if (w && h) {
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.style.width = '100%';
        svg.style.height = 'auto';
      }
    });
  }, [cardNumber]);

  function copyNumber() {
    if (!cardNumber) return;
    navigator.clipboard.writeText(cardNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">👁️</span>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Club<span className="text-amber-400">++</span>
          </h1>
          <span className="text-2xl">👁️</span>
        </div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
          Earn points. Lose privacy. Repeat.
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">

        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-6">
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
          <div className="bg-slate-100 px-3 py-4">
            {cardNumber ? (
              <svg ref={svgRef} />
            ) : (
              <div className="h-28 flex items-center justify-center text-slate-400 text-sm">
                Generating...
              </div>
            )}
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

        {/* Generate button */}
        <button
          onClick={generate}
          className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-amber-900/30 mb-6"
        >
          Generate New Card
        </button>

        {/* Sub-note */}
        <p className="text-center text-slate-500 text-xs px-4 mb-10">
          Show this barcode at the till, just like a real loyalty card. It&apos;s technically
          valid — but unlike the real thing, this one won&apos;t sell your shopping habits
          to your insurance company.
        </p>

        {/* Info section */}
        <div className="space-y-4">
          <h2 className="text-center text-slate-300 font-bold text-lg uppercase tracking-widest">
            Why loyalty schemes are bad for you
          </h2>

          <InfoCard
            icon="🛒"
            title="Your shopping basket is a goldmine"
            body="Every item you scan builds a detailed profile of your diet, lifestyle, health conditions, family size, and income. This isn't a byproduct — it's the entire business model."
          />

          <InfoCard
            icon="💊"
            title="It gets sold to insurers and data brokers"
            body="Loyalty data is routinely sold to data brokers, marketing firms, and in some markets, health and life insurance underwriters. Buying a lot of alcohol or junk food can quietly affect premiums."
          />

          <InfoCard
            icon="📍"
            title="It reveals where you live, work, and travel"
            body="Stores with multiple branches can triangulate your home, workplace, and daily patterns from which locations you visit and when. This is incredibly precise location tracking without GPS."
          />

          <InfoCard
            icon="💸"
            title="The 'discount' is a terrible deal"
            body="Typical loyalty schemes return around 0.5–1% of your spend as points. Meanwhile, the data they collect about you is worth orders of magnitude more. You're selling your privacy for the price of a coffee."
          />

          <InfoCard
            icon="🔗"
            title="Your data lives forever"
            body="Unlike a bad purchase, your data profile can't be returned. It gets aggregated, re-sold, and enriched with data from other sources for years. Deleting your account rarely deletes your data."
          />

          <InfoCard
            icon="🛡️"
            title="How to protect yourself"
            body="Use cash where possible, or generated cards like this one. In the UK, you can request a copy of your data under GDPR (Subject Access Request) and ask for deletion. Supermarkets are required to comply."
          />
        </div>

        <p className="text-center text-slate-600 text-xs mt-8 pb-4">
          Club++ is a satire project. No data is collected or stored.{' '}
          <span className="text-slate-500">Unlike actual loyalty schemes.</span>
        </p>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
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
