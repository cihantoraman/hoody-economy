/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useLayoutEffect, useState } from 'react';
import Icon from './ui/Icon';
import { ICON } from './ui/icons';

const STEPS = [
  {
    title: 'Welcome to Hoody Economy',
    body: 'A living economy where wealth keeps circulating and no one stays on top for long. It is paused while you read, and will run as soon as you finish.',
    target: null,
  },
  {
    title: 'The control bar',
    body: 'Status, the current turn, the Gini inequality index and average wealth live here, alongside Pause/Resume, a single Turn, speed, and Restart.',
    target: '[data-tour="controls"]',
  },
  {
    title: 'Society and a fixed money supply',
    body: 'The class mix, plus a fixed money supply: Total capital and the Treasury always add up to the same amount, money only moves between them.',
    target: '[data-tour="society"]',
  },
  {
    title: 'Charts over time',
    body: 'Inequality, class movement and prices plotted over time. Toggle the charts with the Show button.',
    target: '[data-tour="analytics"]',
  },
  {
    title: 'Your player',
    body: 'This card is your own position in the economy. Change your strategy from its dropdown whenever you like.',
    target: '[data-tour="player"]',
  },
  {
    title: 'You are set',
    body: 'That is the whole loop. You can replay this tour anytime with "Reset tutorial" in Setup.',
    target: null,
  },
];

const cardWidth = () => Math.min(448, (typeof window !== 'undefined' ? window.innerWidth : 800) - 32);

const positionFor = (rect) => {
  if (!rect) {
    return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: cardWidth() };
  }
  const margin = 14;
  const width = cardWidth();
  const estimatedHeight = 200;
  const below = rect.top + rect.height + margin;
  const top = below + estimatedHeight < window.innerHeight ? below : Math.max(margin, rect.top - estimatedHeight - margin);
  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
  return { top, left, width, transform: 'none' };
};

const Tutorial = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  useLayoutEffect(() => {
    const measure = () => {
      const element = current.target ? document.querySelector(current.target) : null;
      if (!element) {
        setRect(null);
        return;
      }
      element.scrollIntoView({ block: 'center' });
      const box = element.getBoundingClientRect();
      setRect({ top: box.top, left: box.left, width: box.width, height: box.height });
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [step, current.target]);

  return (
    <>
      {rect ? (
        <div
          className="fixed z-40 rounded-xl pointer-events-none transition-all duration-300"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
            border: '2px solid var(--accent)',
          }}
        />
      ) : (
        <div className="fixed inset-0 z-40 bg-black/55 pointer-events-none" />
      )}

      <div className="tutorial-pop fixed z-50 bg-surface border border-line shadow-card rounded-xl p-4" style={positionFor(rect)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
              Tutorial · {step + 1}/{STEPS.length}
            </p>
            <h3 className="font-semibold text-lg">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            title="Skip tutorial"
            className="shrink-0 h-8 w-8 rounded-md border border-line text-muted hover:text-fg flex items-center justify-center"
          >
            <Icon path={ICON.close} className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted mt-2">{current.body}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            {STEPS.map((stepItem, index) => (
              <span
                key={stepItem.title}
                className={`h-1.5 rounded-full transition-all ${index === step ? 'w-5 bg-accent' : 'w-1.5 bg-line'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((value) => value - 1)}
                className="h-8 px-3 rounded-md border border-line text-sm font-semibold text-muted hover:text-fg"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? onClose() : setStep((value) => value + 1))}
              className="h-8 px-4 rounded-md bg-accent text-accent-fg text-sm font-semibold"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
