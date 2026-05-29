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
        fontSize: 18,
        textMargin: 8,
        margin: 0,
        width: 2.8,
        height: 120,
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
        svg.removeAttribute('height');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
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
      <header className="px-4 pt-10 pb-6 text-center">
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

      <main className="flex-1 pb-16 max-w-lg mx-auto w-full">

        {/* Card — breaks out of any side padding to fill the screen */}
        <div className="overflow-hidden shadow-2xl shadow-black/50 mb-10">
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

          {/* Barcode area — full width, no horizontal padding */}
          <div className="bg-slate-100 py-6">
            {cardNumber ? (
              <svg ref={svgRef} />
            ) : (
              <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
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

        {/* Padded content below the card */}
        <div className="px-4">

          {/* Generate button */}
          <button
            onClick={generate}
            className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-amber-900/30"
          >
            Generate New Card
          </button>

          {/* Tongue-in-cheek disclaimer */}
          <div className="mt-6 mb-16 bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-400 text-sm leading-relaxed text-center">
              <span className="font-semibold text-slate-300">⚠️ Important Legal-ish Notice</span>
              <br />
              Please <em>DO NOT</em> use this as a replacement for your actual Club+ card. This
              may result in missing reward points, a mildly confused checkout operator, and —
              if we&apos;re being honest — a slight improvement to your personal data footprint.
              Club++ accepts no responsibility for any of the above, or indeed anything at all.
            </p>
          </div>

          {/* Info section */}
          <div className="space-y-4 mb-8">
            <h2 className="text-center text-slate-300 font-bold text-base uppercase tracking-widest mb-5">
              Wait, why does any of this matter?
            </h2>

            <InfoCard
              icon="🛒"
              title="Your basket is more valuable than the points"
              body="Every scan builds a profile — what you eat, when you shop, how much you spend. That profile is worth a lot more to data brokers and marketers than the 1% cashback you get back."
            />

            <InfoCard
              icon="📬"
              title="It doesn't just power coupons"
              body="Loyalty data gets shared well beyond sending you targeted offers. It can end up with insurers, research firms, and third-party data brokers. Worth knowing what you're signing up for."
            />

            <InfoCard
              icon="📋"
              title="You can ask for your data back"
              body="Under GDPR, you're legally entitled to see what any company holds on you — just Google 'Subject Access Request [retailer name]'. Most supermarkets have a form for it."
            />
          </div>

          <p className="text-center text-slate-600 text-xs pb-4">
            Club++ is a satire project. No data is collected or stored here.{' '}
            <span className="text-slate-500">Unlike actual loyalty schemes.</span>
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
