/**
 * Hoody Economy: gamified cyclical-capital economy simulation
 * Copyright (c) 2026 Cihan Toraman
 */

import { useEffect, useMemo, useState } from 'react';
import { STRATEGIES } from '../constants/economy';
import { useHoodyEconomy } from '../hooks/useHoodyEconomy';
import { useTheme } from '../hooks/useTheme';
import { chartTheme, seriesColors, tierColors } from '../theme/palette';
import { summarize } from '../utils/economy';
import Analytics from './Analytics';
import EventLog from './EventLog';
import Header from './Header';
import Leaderboards from './Leaderboards';
import MarketPanel from './MarketPanel';
import PlayerPanel from './PlayerPanel';
import RuntimeBar from './RuntimeBar';
import SetupPanel from './SetupPanel';
import StatsPanel from './StatsPanel';
import SystemGuide from './SystemGuide';
import Tutorial from './Tutorial';

const TUTORIAL_KEY = 'hoody-tutorial-seen';

const readTutorialSeen = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(TUTORIAL_KEY) === 'true';
  } catch {
    return false;
  }
};

// Staggers each dashboard section in when it first mounts (after Start).
const Reveal = ({ delay = 0, children }) => (
  <div className="reveal" style={{ animationDelay: `${delay}ms` }}>
    {children}
  </div>
);

const HoodyEconomy = () => {
  const { theme, toggleTheme } = useTheme();
  const economy = useHoodyEconomy();
  const [selectedId, setSelectedId] = useState(null);
  const [tutorialSeen, setTutorialSeen] = useState(readTutorialSeen);
  const [showTutorial, setShowTutorial] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);

  const stats = useMemo(() => summarize(economy.players), [economy.players]);
  const chart = chartTheme(theme);
  const tiers = tierColors(theme);
  const series = seriesColors();
  const selectedPlayer = economy.players.find((player) => player.id === selectedId) ?? null;

  // Show the mini tutorial once, shortly after the dashboard reveals on Start.
  useEffect(() => {
    if (!economy.started || tutorialSeen) return undefined;
    const timer = setTimeout(() => setShowTutorial(true), 700);
    return () => clearTimeout(timer);
  }, [economy.started, tutorialSeen]);

  // The "How it works" guide is open during setup and folds away once the game starts.
  useEffect(() => {
    setGuideOpen(!economy.started);
  }, [economy.started]);

  const finishTutorial = () => {
    setShowTutorial(false);
    setTutorialSeen(true);
    try {
      window.localStorage.setItem(TUTORIAL_KEY, 'true');
    } catch {
      // Storage may be unavailable; the tutorial simply won't persist this session.
    }
  };

  const resetTutorial = () => {
    setTutorialSeen(false);
    try {
      window.localStorage.removeItem(TUTORIAL_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-bg text-fg min-h-screen">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {!economy.started && (
        <SetupPanel
          parameters={economy.parameters}
          newProduct={economy.newProduct}
          onPlayerCount={economy.setPlayerCount}
          onApplyPopulation={economy.applyPopulation}
          onNewProduct={economy.setNewProduct}
          onAddProduct={economy.addProduct}
          onToggleRobinHood={economy.toggleRobinHood}
          onToggleBailout={economy.toggleBailout}
          onToggleEvents={economy.toggleEvents}
          onVolatility={economy.setVolatility}
          onResetTutorial={resetTutorial}
          onStart={economy.start}
          tutorialSeen={tutorialSeen}
        />
      )}

      {economy.started && (
        <RuntimeBar
          active={economy.parameters.active}
          speed={economy.parameters.speedMultiplier}
          onTogglePause={economy.togglePause}
          onStep={economy.step}
          onRestart={economy.restart}
          onSpeed={economy.setSpeed}
        />
      )}

      {economy.started && (
        <>
          <Reveal delay={0}>
            <PlayerPanel
              player={stats.player}
              strategies={STRATEGIES}
              onStrategy={economy.setPlayerStrategy}
              chart={chart}
            />
          </Reveal>

          <Reveal delay={140}>
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[29rem] gap-4 mb-4">
              <StatsPanel
                stats={stats}
                tiers={tiers}
                treasury={economy.treasury}
                mobility={economy.mobility}
                turnCount={economy.turnCount}
              />
              <EventLog activeEvents={economy.activeEvents} messages={economy.messages} turnCount={economy.turnCount} />
              <MarketPanel products={economy.products} canEdit={!economy.parameters.active} onRemove={economy.removeProduct} />
            </div>
          </Reveal>

          <Reveal delay={280}>
            <Analytics
              open={economy.parameters.showDetailedStats}
              onToggle={economy.toggleDetailedStats}
              chart={chart}
              tiers={tiers}
              series={series}
              historicalData={economy.historicalData}
              counts={stats.counts}
              players={economy.players}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedId}
            />
          </Reveal>

          <Reveal delay={420}>
            <Leaderboards topRichest={stats.topRichest} offenders={stats.offenders} onSelect={setSelectedId} />
          </Reveal>
        </>
      )}

      <SystemGuide
        parameters={economy.parameters}
        open={guideOpen}
        onToggle={() => setGuideOpen((value) => !value)}
      />

      <footer className="mt-10 pt-6 border-t border-line text-center">
        <p className="text-sm font-semibold">Hoody Economy</p>
        <p className="text-xs text-muted mt-1">v0.2.0 · © 2026 Cihan Toraman. All rights reserved.</p>
      </footer>

      {showTutorial && <Tutorial onClose={finishTutorial} />}
    </div>
  );
};

export default HoodyEconomy;
