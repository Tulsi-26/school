"use client";

import React from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentPanel } from '@/components/physics-lab/InstrumentPanel';
import { ExperimentWorkspace } from '@/components/physics-lab/ExperimentWorkspace';
import { ExperimentGuide } from '@/components/physics-lab/ExperimentGuide';
import { ChevronRight, Home, Beaker, RotateCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface LabShellProps {
    experimentId: string;
}

export const LabShell: React.FC<LabShellProps> = ({ experimentId }) => {
    const { resetLab, setActiveExperimentId, masteredExperiments, toggleMastery } = usePhysicsLab();
    const experimentName = experimentId === 'ohm-law' ? "Ohm's Law Verification" : "Wheatstone Bridge";
    const isMastered = masteredExperiments.includes(experimentId);

    // Track visit and set active experiment
    React.useEffect(() => {
        setActiveExperimentId(experimentId);

        if (typeof window !== 'undefined') {
            const history = JSON.parse(localStorage.getItem('physics-lab-history') || '[]');
            if (!history.includes(experimentId)) {
                localStorage.setItem('physics-lab-history', JSON.stringify([experimentId, ...history].slice(0, 5)));
            }
        }

        return () => setActiveExperimentId(null);
    }, [experimentId, setActiveExperimentId]);

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
            {/* Left Sidebar - Instruments */}
            <aside className="w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-lg tracking-tight">Instruments</h2>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase font-medium tracking-wider">Physics Lab</span>
                </div>
                <InstrumentPanel experimentId={experimentId} />
            </aside>

            {/* Center - Workspace */}
            <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black flex flex-col">
                {/* Breadcrumbs / Header */}
                <div className="h-14 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm flex items-center px-6 gap-3 z-30">
                    <Link href="/physics-lab" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
                        <Home className="w-3.5 h-3.5" />
                        Labs
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                        <Beaker className="w-4 h-4" />
                        {experimentName}
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={() => toggleMastery(experimentId)}
                            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${isMastered
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400'
                                }`}
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${isMastered ? 'hidden' : ''}`} />
                            <ShieldCheck className={`w-3.5 h-3.5 ${!isMastered ? 'hidden' : ''}`} />
                            {isMastered ? 'Completed' : 'Mark as Completed'}
                        </button>

                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to reset the lab? All current connections and instruments will be removed.")) {
                                    resetLab();
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-slate-700 rounded-lg text-xs font-bold transition-all text-slate-400"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset Lab
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <ExperimentWorkspace experimentId={experimentId} />
                </div>
            </main>

            {/* Right Sidebar - Guide */}
            <aside className="w-96 border-l border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold text-lg tracking-tight">Experiment Guide</h2>
                </div>
                <ExperimentGuide experimentId={experimentId} />
            </aside>
        </div>
    );
};
