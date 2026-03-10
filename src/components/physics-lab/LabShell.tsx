"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentPanel } from '@/components/physics-lab/InstrumentPanel';
import { ExperimentWorkspace } from '@/components/physics-lab/ExperimentWorkspace';
import { ExperimentGuide } from '@/components/physics-lab/ExperimentGuide';
import { GamificationPanel } from '@/components/physics-lab/GamificationPanel';
import {
    ChevronRight, Home, Beaker, RotateCcw, ShieldCheck,
    Maximize, Minimize, Sun, Moon, PanelLeft, BookOpen, X, Smartphone
} from 'lucide-react';
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
    const [showInstruments, setShowInstruments] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [showRotateOverlay, setShowRotateOverlay] = useState(false);
    const [guideWidth, setGuideWidth] = useState(384);
    const containerRef = useRef<HTMLDivElement>(null);

    const startRightResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = guideWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const maxW = window.innerWidth * 0.6;
            const newWidth = startWidth - (moveEvent.clientX - startX);
            setGuideWidth(Math.max(250, Math.min(newWidth, maxW)));
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'default';
            document.body.classList.remove('select-none');
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.classList.add('select-none');
    }, [guideWidth]);

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
            containerRef.current?.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => { });
        } else {
            document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => { });
        }
    }, []);

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    // Portrait-mode rotate overlay for mobile
    useEffect(() => {
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

    // Close drawers when rotate overlay appears
    useEffect(() => {
        if (showRotateOverlay) {
            setShowGuide(false);
            setShowInstruments(false);
        }
    }, [showRotateOverlay]);

    const isDark = theme === 'dark';

    return (
        <div
            ref={containerRef}
            className="flex h-[100dvh] w-full bg-slate-950 text-slate-50 overflow-hidden font-sans"
        >
            {/* Left Sidebar - Instruments (desktop only) */}
            <aside className="hidden xl:flex w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col shrink-0">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-lg tracking-tight">Instruments</h2>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase font-medium tracking-wider">
                        Physics Lab
                    </span>
                </div>
                <InstrumentPanel experimentId={experimentId} />
            </aside>

            {/* Center - Workspace */}
            <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black flex flex-col min-w-0">

                {/* Header / Breadcrumbs */}
                <div className="min-h-14 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-3 z-30 flex-wrap py-2">

                    {/* Open instruments drawer (tablet/mobile) */}
                    <button
                        onClick={() => setShowInstruments(true)}
                        className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200"
                        title="Open Instruments"
                    >
                        <PanelLeft className="w-4 h-4" />
                    </button>

                    <Link
                        href="/physics-lab"
                        className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
                    >
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

                        {/* Open guide drawer (tablet/mobile) */}
                        <button
                            onClick={() => setShowGuide(true)}
                            className="xl:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-200 text-xs font-bold"
                            title="Open Guide"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            Guide
                        </button>

                        {/* Mark as completed */}
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

                        {/* Reset lab */}
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
                    </div>
                </div>

                {/* Experiment canvas */}
                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <ExperimentWorkspace experimentId={experimentId} />
                </div>
            </main>

            {/* Right Sidebar - Guide (desktop only) */}
            <aside
                className="hidden xl:flex border-l border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col shrink-0 relative z-40"
                style={{ width: guideWidth }}
            >
                {/* Resizer Handle */}
                <div
                    className="absolute left-[-4px] top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500/80 z-[60] transition-colors"
                    onMouseDown={startRightResize}
                />

                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold text-lg tracking-tight">Experiment Guide</h2>
                </div>
                <ExperimentGuide experimentId={experimentId} />
            </aside>

            {/* Mobile/Tablet Drawer: Instruments */}
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

            {/* Mobile/Tablet Drawer: Guide */}
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

            {/* Phone portrait lock overlay */}
            {showRotateOverlay && (
                <div className="absolute inset-0 z-[80] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="max-w-xs text-center border border-slate-700 rounded-2xl bg-slate-900/80 p-6">
                        <Smartphone className="w-9 h-9 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">Rotate Your Phone</h3>
                        <p className="mt-2 text-xs text-slate-400">
                            For the best lab experience on mobile, use landscape mode.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};