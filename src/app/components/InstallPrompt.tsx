'use client';

import { useEffect, useState } from 'react';

type State = 'hidden' | 'android' | 'ios';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [state, setState] = useState<State>('hidden');
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('clubpp-install-dismissed')) return;

    const isIOS =
      /iPhone|iPad|iPod/.test(navigator.userAgent) &&
      !(navigator as Navigator & { standalone?: boolean }).standalone;

    if (isIOS) {
      setState('ios');
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setState('android');
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    localStorage.setItem('clubpp-install-dismissed', '1');
    setState('hidden');
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setState('hidden');
    setDeferred(null);
  }

  if (state === 'hidden') return null;

  return (
    <div className="mx-4 mb-4 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-xl flex-shrink-0">📲</span>
      <div className="flex-1 min-w-0">
        {state === 'ios' ? (
          <p className="text-slate-300 text-sm leading-snug">
            Add to your home screen for quick access at the till —{' '}
            <span className="text-amber-400 font-medium">tap Share → Add to Home Screen</span>
          </p>
        ) : (
          <p className="text-slate-300 text-sm leading-snug">
            Add Club++ to your home screen for quick access at the till.
          </p>
        )}
      </div>
      {state === 'android' && (
        <button
          onClick={install}
          className="flex-shrink-0 bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg"
        >
          Add
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 text-slate-500 hover:text-slate-300 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
