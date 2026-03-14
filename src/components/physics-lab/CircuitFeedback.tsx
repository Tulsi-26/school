"use client";

import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, Lightbulb } from '@/lib/icons';
import type { ValidationError } from '@/lib/physics/core/circuitValidator';
import { useLanguage } from '@/context/LanguageContext';

interface CircuitFeedbackProps {
  errors: ValidationError[];
  suggestions: string[];
  isValid: boolean;
}

export const CircuitFeedback: React.FC<CircuitFeedbackProps> = ({ errors, suggestions, isValid }) => {
  const { t } = useLanguage();
  if (errors.length === 0 && suggestions.length === 0) return null;

  const visibleErrors = errors.slice(0, 3);
  const visibleSuggestions = suggestions.slice(0, 2);

  return (
    <div className="w-full space-y-2 animate-in slide-in-from-bottom-4 duration-300 shrink-0">
      {/* Validation Status */}
      {errors.length > 0 && (
        <div className={`rounded-xl border backdrop-blur-md p-3 space-y-2 ${isValid
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-slate-900/80 border-slate-700/50'
          }`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {isValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t('feedback.valid')}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">{t('feedback.issues')}</span>
              </>
            )}
          </div>

          <div className="space-y-1.5">
            {visibleErrors.map((err, i) => {
              // Try to translate using code, fallback to message
              let message = t(`feedback.${err.code}`);
              if (message === `feedback.${err.code}`) {
                message = err.message;
              }

              // Handle dynamic unconnected terminal message
              if (err.code === 'UNCONNECTED_TERMINAL' && err.message.includes(' has an unconnected ')) {
                const parts = err.message.split(' has an unconnected ');
                if (parts.length === 2) {
                  const name = parts[0];
                  const terminalRaw = parts[1].split(' terminal')[0];
                  const terminalTranslated = t(`common.terminals.${terminalRaw}`);
                  
                  message = t('feedback.UNCONNECTED_TERMINAL')
                    .replace('{name}', name)
                    .replace('{terminal}', terminalTranslated);
                }
              }

              return (
                <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                  {err.type === 'error' && <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />}
                  {err.type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />}
                  {err.type === 'info' && <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />}
                  <span className={
                    err.type === 'error' ? 'text-red-300' :
                      err.type === 'warning' ? 'text-amber-300' :
                        'text-blue-300'
                  }>
                    {message}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {visibleSuggestions.length > 0 && !isValid && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Lightbulb className="w-3.5 h-3.5" />
            {t('feedback.suggestions')}
          </div>
          <div className="space-y-1.5">
            {visibleSuggestions.map((s, i) => {
              // Map literal suggestions to translation keys
              const suggestionMap: Record<string, string> = {
                'Drag a Battery from the instrument panel to the workspace': 'feedback.SUGGEST_BATTERY',
                'Drag a Battery to the workspace': 'feedback.SUGGEST_BATTERY',
                'Add a Resistor to measure V=IR relationship': 'feedback.SUGGEST_RESISTOR',
                'Add all four resistors: P, Q, R, and S': 'feedback.SUGGEST_ALL_RESISTORS',
                'Add an Ammeter in series to measure current': 'feedback.SUGGEST_AMMETER',
                'Add a Voltmeter in parallel to measure potential difference': 'feedback.SUGGEST_VOLTMETER',
                'Add a Switch (Plug Key) to control the circuit': 'feedback.SUGGEST_SWITCH',
                'Add at least one switch to control the circuit': 'feedback.SUGGEST_ANY_SWITCH',
                'Connect the remaining terminals to form a complete circuit path': 'feedback.SUGGEST_CLOSE_LOOP',
                'Add a Galvanometer to detect bridge balance': 'feedback.SUGGEST_GALVANOMETER'
              };
              
              const key = suggestionMap[s];
              const message = key ? t(key) : s;

              return (
                <div key={i} className="flex items-start gap-2 text-[11px] text-blue-300/80 leading-relaxed">
                  <span className="text-blue-500 mt-0.5">→</span>
                  {message}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
