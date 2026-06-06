/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useState } from 'react';
import Card from './ui/Card';

const messageDot = ({ category, text }) => {
  if (category === 'warning') return 'bg-danger';
  if (category === 'event') return 'bg-accent';
  if (category === 'market') return 'bg-warn';
  if (category === 'status') {
    if (text.includes('risen')) return 'bg-accent';
    if (text.includes('fallen')) return 'bg-danger';
  }
  return 'bg-muted';
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md text-sm font-semibold ${active ? 'bg-accent text-accent-fg' : 'bg-surface-2 text-muted hover:text-fg'}`}
  >
    {children}
  </button>
);

const EventCard = ({ event, turnCount }) => {
  const negative = event.effectCapital < 0;
  const turnsLeft = event.duration - (turnCount - event.startTurn);
  const remaining = Math.max(0, Math.min(100, (turnsLeft / event.duration) * 100));

  return (
    <div className="rounded-lg border border-line bg-surface-2 overflow-hidden">
      <div className="h-1 bg-line">
        <div className={`h-full ${negative ? 'bg-danger' : 'bg-accent'}`} style={{ width: `${remaining}%` }} />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold">{event.event}</p>
          <span
            className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md ${
              negative ? 'bg-danger-weak text-danger' : 'bg-accent-weak text-accent'
            }`}
          >
            {event.effectCapital > 0 ? '+' : ''}
            {Math.round(event.effectCapital * 100)}%
          </span>
        </div>
        <p className="text-sm text-muted mt-1">{event.description}</p>
        <p className="text-xs text-muted mt-2">
          {turnsLeft} week{turnsLeft === 1 ? '' : 's'} left
        </p>
      </div>
    </div>
  );
};

const EventLog = ({ activeEvents, messages, turnCount }) => {
  const [tab, setTab] = useState('events');

  return (
    <Card className="p-4 flex flex-col md:h-full">
      <div className="flex items-center gap-2 mb-3">
        <TabButton active={tab === 'events'} onClick={() => setTab('events')}>
          Active Events
        </TabButton>
        <TabButton active={tab === 'messages'} onClick={() => setTab('messages')}>
          Messages
        </TabButton>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {tab === 'events' ? (
          activeEvents.length ? (
            <div className="space-y-2">
              {activeEvents.map((event) => (
                <EventCard key={event.id} event={event} turnCount={turnCount} />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-sm text-muted italic">No active market events</div>
          )
        ) : (
          <div className="space-y-1.5">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${messageDot(message)}`} />
                <span className={message.category === 'system' ? 'text-muted' : 'text-fg'}>{message.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventLog;
