"use client";

import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, Lightbulb } from 'lucide-react';
import type { ValidationError } from '@/lib/physics/core/circuitValidator';

interface CircuitFeedbackProps {
  errors: ValidationError[];
  suggestions: string[];
  isValid: boolean;
}

export const CircuitFeedback: React.FC<CircuitFeedbackProps> = ({ errors, suggestions, isValid }) => {
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
                <span className="text-emerald-400">Circuit Valid</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Circuit Issues</span>
              </>
            )}
          </div>

          <div className="space-y-1.5">
            {visibleErrors.map((err, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                {err.type === 'error' && <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />}
                {err.type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />}
                {err.type === 'info' && <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />}
                <span className={
                  err.type === 'error' ? 'text-red-300' :
                    err.type === 'warning' ? 'text-amber-300' :
                      'text-blue-300'
                }>
                  {err.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {visibleSuggestions.length > 0 && !isValid && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Lightbulb className="w-3.5 h-3.5" />
            Suggestions
          </div>
          <div className="space-y-1.5">
            {visibleSuggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-blue-300/80 leading-relaxed">
                <span className="text-blue-500 mt-0.5">→</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
