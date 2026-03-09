"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentPanel } from '@/components/physics-lab/InstrumentPanel';
import { ExperimentWorkspace } from '@/components/physics-lab/ExperimentWorkspace';
import { ExperimentGuide } from '@/components/physics-lab/ExperimentGuide';
import { GamificationPanel } from '@/components/physics-lab/GamificationPanel';
import { ChevronRight, Home, Beaker, RotateCcw, ShieldCheck, Maximize, Minimize, Sun, Moon, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const experimentNames: Record<string, string> = {
    'ohm-law': "Ohm's Law Verification",
    'wheatstone-bridge': "Wheatstone Bridge",
    'reflection-refraction': "Reflection & Refraction",
    'newton-second-law': "Newton's Second Law",
};

interface LabShellProps {
    experimentId: string;
}

export const LabShell: React.FC<LabShellProps> = ({ experimentId }) => {
    const { resetLab, setActiveExperimentId, masteredExperiments, toggleMastery } = usePhysicsLab();
    const experimentName = experimentNames[experimentId] || experimentId;
    const isMastered = masteredExperiments.includes(experimentId);
    const { theme, setTheme } = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track visit and set active experiment
    useEffect(() => {
        setActiveExperimentId(experimentId);

        if (typeof window !== 'undefined') {
            const history = JSON.parse(localStorage.getItem('physics-lab-history') || '[]');
            if (!history.includes(experimentId)) {
                localStorage.setItem('physics-lab-history', JSON.stringify([experimentId, ...history].slice(0, 5)));
            }
        }

        return () => setActiveExperimentId(null);
    }, [experimentId, setActiveExperimentId]);

    // Fullscreen API
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
        }
    }, []);

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    // Auto-collapse panels on small screens (landscape mobile)
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1024px)');
        const handler = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setShowLeftPanel(false);
                setShowRightPanel(false);
            }
        };
        handler(mq);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const isDark = theme === 'dark';

    return (
        <div ref={containerRef} className="flex h-screen w-full bg-slate-950 dark:bg-slate-950 text-slate-50 overflow-hidden font-sans">
            {/* Left Sidebar - Instruments */}
            {showLeftPanel && (
                <aside className="w-64 lg:w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold text-lg tracking-tight">Instruments</h2>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase font-medium tracking-wider">Physics Lab</span>
                    </div>
                    <InstrumentPanel experimentId={experimentId} />
                </aside>
            )}

            {/* Center - Workspace */}
            <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black flex flex-col min-w-0">
                {/* Breadcrumbs / Header */}
                <div className="h-14 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm flex items-center px-3 lg:px-6 gap-2 lg:gap-3 z-30">
                    {/* Panel toggles (visible on all screens) */}
                    <button
                        onClick={() => setShowLeftPanel(v => !v)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                        title={showLeftPanel ? 'Hide Instruments' : 'Show Instruments'}
                    >
                        <PanelLeftClose size={16} />
                    </button>

                    <Link href="/physics-lab" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
                        <Home className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Labs</span>
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-400 truncate">
                        <Beaker className="w-4 h-4 shrink-0" />
                        <span className="truncate">{experimentName}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-2 lg:gap-4 shrink-0">
                        {/* Gamification compact display */}
                        <div className="hidden md:block">
                            <GamificationPanel compact />
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Fullscreen toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        </button>

                        <button
                            onClick={() => toggleMastery(experimentId)}
                            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${isMastered
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
                            <span className="hidden sm:inline">Reset Lab</span>
                        </button>

                        <button
                            onClick={() => setShowRightPanel(v => !v)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                            title={showRightPanel ? 'Hide Guide' : 'Show Guide'}
                        >
                            <PanelRightClose size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <ExperimentWorkspace experimentId={experimentId} />
                </div>
            </main>

            {/* Right Sidebar - Guide */}
            {showRightPanel && (
                <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-800">
                        <h2 className="font-bold text-lg tracking-tight">Experiment Guide</h2>
                    </div>
                    <ExperimentGuide experimentId={experimentId} />
                </aside>
            )}
        </div>
    );
};
