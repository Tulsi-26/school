"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, ListChecks } from '@/lib/icons';
import { useGamification } from './GamificationPanel';
import { usePhysicsLab } from '@/context/PhysicsLabContext';

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

  // Extract necessary state from physics lab for auto-evaluation
  const { instruments, connections, simulationResults, observations } = usePhysicsLab();

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(`checklist-${experimentId}`) || '[]');
      setChecked(new Set(saved));
      if (saved.length === items.length && items.length > 0) {
        completedRef.current = true;
      }
    }
  }, [experimentId, items.length]);

  // Auto-evaluate conditions
  useEffect(() => {
    if (items.length === 0) return;

    setChecked(prev => {
      const next = new Set(prev);
      let changed = false;

      // Helper to check instrument existence
      const hasInst = (type: string) => instruments.some((i: any) => i.type === type);
      const instCount = (type: string) => instruments.filter((i: any) => i.type === type).length;

      items.forEach(item => {
        if (next.has(item.id)) return; // Already checked

        let isMet = false;
        switch (item.id) {
          // Ohm's Law
          case 'place-battery': isMet = hasInst('battery'); break;
          case 'place-resistor': isMet = hasInst('resistor'); break;
          case 'place-ammeter': isMet = hasInst('ammeter'); break;
          case 'place-voltmeter': isMet = hasInst('voltmeter'); break;
          case 'place-rheostat': isMet = hasInst('rheostat'); break;
          case 'place-switch': isMet = hasInst('switch'); break;
          case 'connect-all': isMet = connections.length >= 5; break;
          case 'close-switch': isMet = simulationResults?.isClosed === true; break;
          case 'vary-rheostat': isMet = observations.length >= 2; break; // Approximated by taking multiple obs

          // Wheatstone Bridge
          case 'place-resistors': isMet = instCount('resistor') >= 4; break;
          case 'place-galvanometer': isMet = hasInst('galvanometer'); break;
          case 'place-switches': isMet = instCount('switch') >= 2; break;
          case 'connect-bridge': isMet = connections.length >= 8; break;
          case 'close-switches': isMet = simulationResults?.isClosed === true; break;
          case 'balance-bridge': isMet = simulationResults?.isValid === true && simulationResults?.galvanometerReading === 0; break;

          // Optics
          case 'place-source': isMet = hasInst('block'); break; // Using block for source currently
          case 'place-lens': isMet = hasInst('lens'); break;
          case 'observe-rays': isMet = simulationResults?.isValid === true; break;
          case 'vary-position': isMet = observations.length >= 2; break;

          // Mechanics
          case 'place-pulley': isMet = hasInst('pulley'); break;
          case 'place-m1': isMet = instCount('block') >= 1; break;
          case 'place-m2': isMet = instCount('block') >= 2; break;
          case 'observe-vectors': isMet = simulationResults?.isValid === true; break;

          // Shared
          case 'record-reading': isMet = observations.length >= 1; break;
        }

        if (isMet) {
          next.add(item.id);
          changed = true;
          if (prev.size === 0) addXP('first-circuit-closed'); // Award for first step
        }
      });

      if (changed) {
        localStorage.setItem(`checklist-${experimentId}`, JSON.stringify([...next]));
        if (next.size === items.length && !completedRef.current) {
          completedRef.current = true;
          completeExperiment(experimentId);
          addXP('checklist-complete');
        }
      }

      return changed ? next : prev;
    });
  }, [items, instruments, connections, simulationResults, observations, experimentId, addXP, completeExperiment]);

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

      {/* Items - Now non-interactive displays */}
      <div className="space-y-2">
        {items.map((item) => {
          const done = checked.has(item.id);
          return (
            <div
              key={item.id}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${done
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'opacity-70'
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
            </div>
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
