"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { useGamification } from './GamificationPanel';

interface ChecklistItem {
  id: string;
  label: string;
}

const checklistsByExperiment: Record<string, ChecklistItem[]> = {
  'ohm-law': [
    { id: 'place-battery', label: 'Place the Battery on the workspace' },
    { id: 'place-resistor', label: 'Place a Resistor' },
    { id: 'place-ammeter', label: 'Place an Ammeter (series)' },
    { id: 'place-voltmeter', label: 'Place a Voltmeter (parallel)' },
    { id: 'place-rheostat', label: 'Place a Rheostat' },
    { id: 'place-switch', label: 'Place the Plug Key (Switch)' },
    { id: 'connect-all', label: 'Connect all terminals to form a circuit' },
    { id: 'close-switch', label: 'Close the switch' },
    { id: 'record-reading', label: 'Record at least 1 observation' },
    { id: 'vary-rheostat', label: 'Adjust rheostat for different readings' },
  ],
  'wheatstone-bridge': [
    { id: 'place-battery', label: 'Place the Battery' },
    { id: 'place-resistors', label: 'Place all 4 resistors (P, Q, R, S)' },
    { id: 'place-galvanometer', label: 'Place the Galvanometer' },
    { id: 'place-switches', label: 'Place the switches' },
    { id: 'connect-bridge', label: 'Wire up the bridge configuration' },
    { id: 'close-switches', label: 'Close both switches' },
    { id: 'balance-bridge', label: 'Adjust R until galvanometer reads 0' },
    { id: 'record-reading', label: 'Record the balanced resistance values' },
  ],
  'reflection-refraction': [
    { id: 'place-source', label: 'Place a light source (Object)' },
    { id: 'place-lens', label: 'Place a convex or concave lens' },
    { id: 'observe-rays', label: 'Observe the ray tracing paths' },
    { id: 'vary-position', label: 'Move the object to different positions' },
    { id: 'record-reading', label: 'Record image distances' },
  ],
  'newton-second-law': [
    { id: 'place-pulley', label: 'Place the fixed pulley' },
    { id: 'place-m1', label: 'Place mass block M1' },
    { id: 'place-m2', label: 'Place mass block M2' },
    { id: 'observe-vectors', label: 'Observe force and acceleration vectors' },
    { id: 'record-reading', label: 'Record acceleration and tension values' },
  ],
};

export const ExperimentChecklist: React.FC<{ experimentId: string }> = ({ experimentId }) => {
  const items = checklistsByExperiment[experimentId] || [];
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const { addXP, completeExperiment } = useGamification();
  const completedRef = useRef(false);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(`checklist-${experimentId}`) || '[]');
      setChecked(new Set(saved));
      // If already completed, mark ref so we don't re-award
      if (saved.length === items.length && items.length > 0) {
        completedRef.current = true;
      }
    }
  }, [experimentId, items.length]);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      const wasChecked = next.has(id);
      if (wasChecked) {
        next.delete(id);
      } else {
        next.add(id);
        // Award XP for first checklist tick ever (reuses first-circuit-closed)
        if (prev.size === 0) {
          addXP('first-circuit-closed');
        }
      }
      localStorage.setItem(`checklist-${experimentId}`, JSON.stringify([...next]));

      // If all items just got completed, award experiment completion XP
      if (!wasChecked && next.size === items.length && !completedRef.current) {
        completedRef.current = true;
        completeExperiment(experimentId);
        addXP('checklist-complete');
      }

      return next;
    });
  };

  const progress = items.length > 0 ? Math.round((checked.size / items.length) * 100) : 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <ListChecks className="w-4 h-4" style={{ color: 'var(--lab-tab-active)' }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--lab-text-secondary)' }}>Guided Checklist</span>
        <span className="ml-auto text-xs font-mono" style={{ color: 'var(--lab-tab-active)' }}>{progress}%</span>
      </div>

      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--lab-border)' }}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const done = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${done
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'hover:opacity-90'
                }`}
              style={done ? {} : { backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}
            >
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 shrink-0" style={{ color: 'var(--lab-text-muted)' }} />
              )}
              <span className={`text-xs leading-relaxed ${done ? 'text-emerald-600 dark:text-emerald-300 line-through opacity-70' : ''}`} style={done ? {} : { color: 'var(--lab-text-secondary)' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {progress === 100 && (
        <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            🎉 All steps completed!
          </span>
        </div>
      )}
    </div>
  );
};
