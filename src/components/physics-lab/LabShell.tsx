"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentPanel } from '@/components/physics-lab/InstrumentPanel';
import { ExperimentWorkspace } from '@/components/physics-lab/ExperimentWorkspace';
import { ExperimentGuide } from '@/components/physics-lab/ExperimentGuide';
import { GamificationPanel, useGamification } from '@/components/physics-lab/GamificationPanel';
import {
    ChevronRight, Home, Beaker, RotateCcw, ShieldCheck,
    Maximize, Minimize, Sun, Moon, PanelLeft, BookOpen, X, Smartphone, Save, Loader2, Check, Globe
} from '@/lib/icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

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
    const { resetLab, setActiveExperimentId, masteredExperiments, toggleMastery: toggleContextMastery, saveExperiment, isSaving, lastSavedAt } = usePhysicsLab();
    const { completeExperiment } = useGamification();
    const { language, setLanguage, t } = useLanguage();
    
    // Check if translation exists, otherwise fallback to default record
    const experimentName = t(`experiments.${experimentId}.title`) !== `experiments.${experimentId}.title` 
        ? t(`experiments.${experimentId}.title`) 
        : (experimentNames[experimentId] || experimentId);

    const isMastered = masteredExperiments.includes(experimentId);
    const { theme, setTheme } = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInstruments, setShowInstruments] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [showRotateOverlay, setShowRotateOverlay] = useState(false);
    const [guideWidth, setGuideWidth] = useState(384);
    const [instrumentWidth, setInstrumentWidth] = useState(320);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleMastery = useCallback((id: string) => {
        const alreadyMastered = masteredExperiments.includes(id);
        toggleContextMastery(id);
        if (!alreadyMastered) {
            completeExperiment(id);
        }
    }, [masteredExperiments, toggleContextMastery, completeExperiment]);

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

    const startLeftResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = instrumentWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const maxW = window.innerWidth * 0.5;
            const newWidth = startWidth + (moveEvent.clientX - startX);
            setInstrumentWidth(Math.max(280, Math.min(newWidth, maxW)));
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
    }, [instrumentWidth]);

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

    const handleSave = useCallback(async () => {
        try {
            await saveExperiment();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch {
            // Error already logged in context
        }
    }, [saveExperiment]);

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
            className="flex h-[100dvh] w-full overflow-hidden font-sans"
            style={{ backgroundColor: 'var(--lab-bg)', color: 'var(--lab-text)' }}
        >
            {/* Left Sidebar - Instruments (desktop only) */}
            <aside 
                className="hidden xl:flex flex-col shrink-0 relative" 
                style={{ 
                    width: instrumentWidth,
                    backgroundColor: 'var(--lab-sidebar)', 
                    borderRight: '1px solid var(--lab-border)' 
                }}
            >
                {/* Resizer Handle */}
                <div
                    className="absolute right-[-4px] top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500/80 z-[60] transition-colors"
                    onMouseDown={startLeftResize}
                />

                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--lab-border)' }}>
                    <h2 className="font-bold text-lg tracking-tight">{t('common.instruments')}</h2>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase font-medium tracking-wider">
                        {t('common.labName')}
                    </span>
                </div>
                <InstrumentPanel experimentId={experimentId} />
            </aside>

            {/* Center - Workspace */}
            <main className="flex-1 relative overflow-hidden flex flex-col min-w-0" style={{ background: 'var(--lab-workspace)' }}>

                {/* Header / Breadcrumbs */}
                <div className="min-h-14 flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-3 z-30 flex-wrap py-2 backdrop-blur-sm" style={{ borderBottom: '1px solid var(--lab-border)', backgroundColor: 'var(--lab-header)' }}>

                    <button
                        onClick={() => setShowInstruments(true)}
                        className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
                        title="Open Instruments"
                    >
                        <PanelLeft className="w-4 h-4" />
                    </button>

                    <Link
                        href="/physics-lab"
                        className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm"
                        style={{ color: 'var(--lab-text-muted)' }}
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('nav.experiments')}</span>
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--lab-border)' }} />
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
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ color: 'var(--lab-text-secondary)' }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Fullscreen toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ color: 'var(--lab-text-secondary)' }}
                            title={isFullscreen ? t('common.exitFullscreen') : t('common.fullscreen')}
                        >
                            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        </button>

                        {/* Language switcher for quick access */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-1.5 rounded-lg transition-all hover:opacity-80"
                                    style={{ color: 'var(--lab-text-secondary)' }}
                                    title="Switch Language"
                                >
                                    <Globe size={16} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                <DropdownMenuRadioGroup value={language} onValueChange={(v) => setLanguage(v as any)}>
                                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="gu">ગુજરાતી</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Open guide drawer (tablet/mobile) */}
                        <button
                            onClick={() => setShowGuide(true)}
                            className="xl:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
                            title={t('common.guide')}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            {t('common.guide')}
                        </button>

                        {/* Mark as completed */}
                        <button
                            onClick={() => toggleMastery(experimentId)}
                            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isMastered
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'hover:bg-emerald-500/10 hover:text-emerald-400'
                                }`}
                            style={isMastered ? { border: '1px solid rgba(16,185,129,0.3)' } : { backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${isMastered ? 'hidden' : ''}`} />
                            <ShieldCheck className={`w-3.5 h-3.5 ${!isMastered ? 'hidden' : ''}`} />
                            {isMastered ? t('common.completed') : t('common.markCompleted')}
                        </button>

                        {/* Save experiment to database */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${saveSuccess
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'hover:bg-blue-500/20 hover:text-blue-400'
                                }`}
                            style={saveSuccess ? { border: '1px solid rgba(16,185,129,0.3)' } : { backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
                            title={lastSavedAt ? `Last saved: ${lastSavedAt.toLocaleTimeString()}` : 'Save experiment progress to database'}
                        >
                            {isSaving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : saveSuccess ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">
                                {isSaving ? t('common.saving') : saveSuccess ? t('common.saved') : t('common.save')}
                            </span>
                        </button>

                        {/* Reset lab */}
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to reset the lab? All current connections and instruments will be removed.")) {
                                    resetLab();
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-red-500/20 hover:text-red-400"
                            style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t('common.reset')}</span>
                        </button>
                    </div>
                </div>

                {/* Experiment canvas */}
                <div className="flex-1 relative">
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--lab-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--lab-grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
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
                    <h2 className="font-bold text-lg tracking-tight">{t('common.guide')}</h2>
                </div>
                <ExperimentGuide experimentId={experimentId} />
            </aside>

            {/* Mobile/Tablet Drawer: Instruments */}
            {showInstruments && (
                <div className="xl:hidden absolute inset-0 z-[70] bg-black/60 backdrop-blur-[2px]">
                    <aside className="h-full w-[min(24rem,88vw)] flex flex-col" style={{ backgroundColor: 'var(--lab-bg-secondary)', borderRight: '1px solid var(--lab-border)' }}>
                        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--lab-border)' }}>
                            <h2 className="font-bold text-lg tracking-tight">{t('common.instruments')}</h2>
                            <button
                                onClick={() => setShowInstruments(false)}
                                className="p-2 rounded-lg" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
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
                    <aside className="h-full w-[min(30rem,92vw)] flex flex-col" style={{ backgroundColor: 'var(--lab-bg-secondary)', borderLeft: '1px solid var(--lab-border)' }}>
                        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--lab-border)' }}>
                            <h2 className="font-bold text-lg tracking-tight">{t('common.guide')}</h2>
                            <button
                                onClick={() => setShowGuide(false)}
                                className="p-2 rounded-lg" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
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
                <div className="absolute inset-0 z-[80] backdrop-blur-md flex items-center justify-center p-6" style={{ backgroundColor: 'var(--lab-overlay)' }}>
                    <div className="max-w-xs text-center rounded-2xl p-6" style={{ backgroundColor: 'var(--lab-surface)', border: '1px solid var(--lab-border)' }}>
                        <Smartphone className="w-9 h-9 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-sm font-bold uppercase tracking-wide">Rotate Your Phone</h3>
                        <p className="mt-2 text-xs" style={{ color: 'var(--lab-text-muted)' }}>
                            For the best lab experience on mobile, use landscape mode.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};