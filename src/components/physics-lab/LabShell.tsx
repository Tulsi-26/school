"use client";

import React from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentPanel } from '@/components/physics-lab/InstrumentPanel';
import { ExperimentWorkspace } from '@/components/physics-lab/ExperimentWorkspace';
import { ExperimentGuide } from '@/components/physics-lab/ExperimentGuide';
import { ChevronRight, Home, Beaker, RotateCcw, ShieldCheck, PanelLeft, BookOpen, X, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface LabShellProps {
    experimentId: string;
}

export const LabShell: React.FC<LabShellProps> = ({ experimentId }) => {
    const { resetLab, setActiveExperimentId, masteredExperiments, toggleMastery } = usePhysicsLab();
    const experimentName = experimentId === 'ohm-law' ? "Ohm's Law Verification" : "Wheatstone Bridge";
    const isMastered = masteredExperiments.includes(experimentId);
    const [showInstruments, setShowInstruments] = React.useState(false);
    const [showGuide, setShowGuide] = React.useState(false);
    const [showRotateOverlay, setShowRotateOverlay] = React.useState(false);

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

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia('(orientation: portrait)');
        const sync = () => {
            setShowRotateOverlay(window.innerWidth < 768 && media.matches);
        };

        sync();
        media.addEventListener('change', sync);
        window.addEventListener('resize', sync);
        return () => {
            media.removeEventListener('change', sync);
            window.removeEventListener('resize', sync);
        };
    }, []);

    React.useEffect(() => {
        if (showRotateOverlay) {
            setShowGuide(false);
            setShowInstruments(false);
        }
    }, [showRotateOverlay]);

    return (
        <div className="flex h-[100dvh] w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
            {/* Left Sidebar - Instruments */}
            <aside className="hidden xl:flex w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-lg tracking-tight">Instruments</h2>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase font-medium tracking-wider">Physics Lab</span>
                </div>
                <InstrumentPanel experimentId={experimentId} />
            </aside>

            {/* Center - Workspace */}
            <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black flex flex-col min-w-0">
                {/* Breadcrumbs / Header */}
                <div className="min-h-14 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-3 z-30 flex-wrap py-2">
                    <button
                        onClick={() => setShowInstruments(true)}
                        className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200"
                        title="Open Instruments"
                    >
                        <PanelLeft className="w-4 h-4" />
                    </button>
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
                            onClick={() => setShowGuide(true)}
                            className="xl:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 text-xs font-bold"
                            title="Open Guide"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            Guide
                        </button>

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
            <aside className="hidden xl:flex w-96 border-l border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold text-lg tracking-tight">Experiment Guide</h2>
                </div>
                <ExperimentGuide experimentId={experimentId} />
            </aside>

            {/* Tablet/Phone Drawer: Instruments */}
            {showInstruments && (
                <div className="xl:hidden absolute inset-0 z-[70] bg-black/60 backdrop-blur-[2px]">
                    <aside className="h-full w-[min(24rem,88vw)] bg-slate-900 border-r border-slate-700 flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-lg tracking-tight">Instruments</h2>
                            <button
                                onClick={() => setShowInstruments(false)}
                                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <InstrumentPanel experimentId={experimentId} />
                    </aside>
                </div>
            )}

            {/* Tablet/Phone Drawer: Guide */}
            {showGuide && (
                <div className="xl:hidden absolute inset-0 z-[70] bg-black/60 backdrop-blur-[2px] flex justify-end">
                    <aside className="h-full w-[min(30rem,92vw)] bg-slate-900 border-l border-slate-700 flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-lg tracking-tight">Experiment Guide</h2>
                            <button
                                onClick={() => setShowGuide(false)}
                                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <ExperimentGuide experimentId={experimentId} />
                    </aside>
                </div>
            )}

            {/* Phone portrait lock */}
            {showRotateOverlay && (
                <div className="absolute inset-0 z-[80] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="max-w-xs text-center border border-slate-700 rounded-2xl bg-slate-900/80 p-6">
                        <Smartphone className="w-9 h-9 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">Rotate Your Phone</h3>
                        <p className="mt-2 text-xs text-slate-400">For the best lab experience on mobile, use landscape mode.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
