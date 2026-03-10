"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Award, TrendingUp } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (stats: UserStats) => boolean;
}

interface UserStats {
  totalXP: number;
  experimentsCompleted: string[];
  observationsRecorded: number;
}

const BADGES: Badge[] = [
  { id: 'first-circuit', name: 'First Circuit', icon: '⚡', description: 'Complete your first experiment', condition: (s) => s.experimentsCompleted.length >= 1 },
  { id: 'data-collector', name: 'Data Collector', icon: '📊', description: 'Record 5 observations', condition: (s) => s.observationsRecorded >= 5 },
  { id: 'scientist', name: 'Young Scientist', icon: '🔬', description: 'Complete 3 experiments', condition: (s) => s.experimentsCompleted.length >= 3 },
  { id: 'master', name: 'Lab Master', icon: '🏆', description: 'Complete all 4 experiments', condition: (s) => s.experimentsCompleted.length >= 4 },
  { id: 'xp-100', name: 'Rising Star', icon: '⭐', description: 'Earn 100 XP', condition: (s) => s.totalXP >= 100 },
  { id: 'xp-500', name: 'Physics Pro', icon: '🌟', description: 'Earn 500 XP', condition: (s) => s.totalXP >= 500 },
];

const XP_REWARDS: Record<string, number> = {
  'experiment-complete': 50,
  'observation-recorded': 10,
  'checklist-complete': 25,
  'first-circuit-closed': 15,
};

function loadStats(): UserStats {
  if (typeof window === 'undefined') return { totalXP: 0, experimentsCompleted: [], observationsRecorded: 0 };
  try {
    const raw = localStorage.getItem('physics-lab-gamification');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { totalXP: 0, experimentsCompleted: [], observationsRecorded: 0 };
}

function saveStats(stats: UserStats) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('physics-lab-gamification', JSON.stringify(stats));
  }
}

export function useGamification() {
  const [stats, setStats] = useState<UserStats>(loadStats);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const addXP = (reason: string) => {
    const xp = XP_REWARDS[reason] || 0;
    if (xp === 0) return;
    setStats(prev => {
      const next = { ...prev, totalXP: prev.totalXP + xp };
      saveStats(next);
      return next;
    });
  };

  const completeExperiment = (experimentId: string) => {
    setStats(prev => {
      if (prev.experimentsCompleted.includes(experimentId)) return prev;
      const next = {
        ...prev,
        experimentsCompleted: [...prev.experimentsCompleted, experimentId],
        totalXP: prev.totalXP + XP_REWARDS['experiment-complete'],
      };
      saveStats(next);
      return next;
    });
  };

  const recordObservationXP = () => {
    setStats(prev => {
      const next = {
        ...prev,
        observationsRecorded: prev.observationsRecorded + 1,
        totalXP: prev.totalXP + XP_REWARDS['observation-recorded'],
      };
      saveStats(next);
      return next;
    });
  };

  const earnedBadges = BADGES.filter(b => b.condition(stats));

  return { stats, addXP, completeExperiment, recordObservationXP, earnedBadges, allBadges: BADGES };
}

export const GamificationPanel: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { stats, earnedBadges, allBadges } = useGamification();

  const level = Math.floor(stats.totalXP / 100) + 1;
  const xpInLevel = stats.totalXP % 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-yellow-500">{stats.totalXP} XP</span>
        </div>
        <div className="w-px h-4" style={{ backgroundColor: 'var(--lab-border)' }} />
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-xs font-bold text-purple-500">Lv.{level}</span>
        </div>
        <div className="w-px h-4" style={{ backgroundColor: 'var(--lab-border)' }} />
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-amber-500">{earnedBadges.length}/{allBadges.length}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* XP & Level */}
      <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Level {level}</span>
          </div>
          <span className="text-lg font-bold font-mono text-white">{stats.totalXP} XP</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${xpInLevel}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-500">{xpInLevel}/100 to next level</span>
          <span className="text-[10px] text-slate-500">{stats.experimentsCompleted.length}/4 experiments</span>
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badges</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {allBadges.map((badge) => {
            const earned = earnedBadges.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border text-center transition-all ${earned
                    ? 'bg-amber-500/10 border-amber-500/20'
                    : 'bg-slate-800/30 border-slate-800 opacity-50'
                  }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className={`text-[10px] font-bold ${earned ? 'text-amber-300' : 'text-slate-500'}`}>
                  {badge.name}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score breakdown */}
      <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Score Breakdown</div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Experiments completed</span>
            <span className="font-mono text-emerald-400">+{stats.experimentsCompleted.length * 50} XP</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Observations recorded</span>
            <span className="font-mono text-blue-400">+{stats.observationsRecorded * 10} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
