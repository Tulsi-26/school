"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Info,
    ListOrdered,
    Table,
    LineChart,
    ShieldCheck,
    TrendingUp,
    Download,
    Trash2,
    ListChecks,
    Trophy,
    PlayCircle,
    Maximize,
    X,
} from '@/lib/icons';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { ExperimentChecklist } from './ExperimentChecklist';
import { YouTubeVideos } from './YouTubeVideos';
import { GamificationPanel, useGamification } from './GamificationPanel';
import { CircuitFeedback } from './CircuitFeedback';
import { useLanguage } from '@/context/LanguageContext';

export const ExperimentGuide: React.FC<{ experimentId: string }> = ({ experimentId }) => {
    const [activeTab, setActiveTab] = useState<'theory' | 'procedure' | 'observation' | 'graph' | 'checklist' | 'videos' | 'progress'>('theory');
    const [isPopup, setIsPopup] = useState(false);
    const { simulationResults, validationErrors, validationSuggestions, circuitIsValid, instruments } = usePhysicsLab();

    const { t } = useLanguage();

    const tabs = [
        { id: 'theory', icon: BookOpen, label: t('guide.tabs.theory') },
        { id: 'procedure', icon: ListOrdered, label: t('guide.tabs.procedure') },
        { id: 'checklist', icon: ListChecks, label: t('guide.tabs.checklist') },
        { id: 'observation', icon: Table, label: t('guide.tabs.observation') },
        { id: 'graph', icon: LineChart, label: t('guide.tabs.graph') },
        { id: 'videos', icon: PlayCircle, label: t('guide.tabs.videos') },
        { id: 'progress', icon: Trophy, label: t('guide.tabs.progress') },
    ];

    const GuideContent = ({ isInsidePopup = false }) => (
        <div className={`flex flex-col h-full bg-slate-50 dark:bg-[#020617] ${isInsidePopup ? '' : ''}`}>
            {/* Tab Header */}
            <div className="flex p-1.5 overflow-x-auto no-scrollbar shadow-sm z-10 shrink-0" style={{ borderBottom: '1px solid var(--lab-border)', backgroundColor: 'var(--lab-surface)' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 min-w-[3.2rem] flex flex-col items-center gap-1.5 py-3 transition-all relative rounded-xl ${activeTab === tab.id
                            ? 'bg-blue-500/5 text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? 'animate-bounce' : ''} />
                        <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-1 w-6 h-1 bg-blue-500 rounded-full" 
                            />
                        )}
                    </button>
                ))}
                
                {/* Fullscreen Toggle Button */}
                <button
                    onClick={() => setIsPopup(!isInsidePopup)}
                    className="ml-1 p-2 self-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
                    title={isInsidePopup ? t('common.exitFullscreen') : t('common.fullscreen')}
                >
                    {isInsidePopup ? <X size={18} /> : <Maximize size={18} />}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none rounded-full"></div>
                
                <div className="relative z-10">
                    {activeTab === 'theory' && (
                        experimentId === 'ohm-law' ? <OhmTheory /> :
                            experimentId === 'wheatstone-bridge' ? <WheatstoneTheory /> :
                                experimentId === 'reflection-refraction' ? <OpticsTheory /> :
                                    <MechanicsTheory />
                    )}
                    {activeTab === 'procedure' && (
                        experimentId === 'ohm-law' ? <OhmProcedure /> :
                            experimentId === 'wheatstone-bridge' ? <WheatstoneProcedure /> :
                                experimentId === 'reflection-refraction' ? <OpticsProcedure /> :
                                    <MechanicsProcedure />
                    )}
                    {activeTab === 'checklist' && <ExperimentChecklist experimentId={experimentId} />}
                    {activeTab === 'observation' && <Observation experimentId={experimentId} isModal={isInsidePopup} />}
                    {activeTab === 'graph' && (
                        experimentId === 'ohm-law' ? <Graph experimentId={experimentId} /> :
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                                <Info size={32} className="opacity-20" />
                                <p className="text-xs font-medium italic">{t('guide.graph.ohmLawOnly')}</p>
                            </div>
                    )}
                    {activeTab === 'videos' && <YouTubeVideos experimentId={experimentId} />}
                    {activeTab === 'progress' && <GamificationPanel />}
                </div>
            </div>

            {/* Sticky bottom Circuit Feedback */}
            {instruments.length > 0 && (experimentId === 'ohm-law' || experimentId === 'wheatstone-bridge') && (validationErrors.length > 0 || validationSuggestions.length > 0) && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
                    <CircuitFeedback
                        errors={validationErrors}
                        suggestions={validationSuggestions}
                        isValid={circuitIsValid}
                    />
                </div>
            )}
        </div>
    );

    return (
        <>
            <GuideContent isInsidePopup={false} />

            <AnimatePresence>
                {isPopup && typeof document !== 'undefined' && createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-white dark:bg-[#020617]"
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full relative"
                        >
                            <button 
                                onClick={() => setIsPopup(false)}
                                className="absolute top-4 right-6 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all z-[10001] shadow-2xl flex items-center gap-2 group"
                            >
                                <X size={24} />
                                <span className="text-sm font-black uppercase tracking-widest px-2">{t('common.close')}</span>
                            </button>
                            
                            <div className="w-full h-full overflow-hidden">
                                <GuideContent isInsidePopup={true} />
                            </div>
                        </motion.div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
};

// Ohm's Law Components
const OhmTheory = () => {
    const { t } = useLanguage();
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <section className="space-y-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {t('guide.ohm.aim')}
                </h3>
                <p className="font-medium leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>
                    {t('guide.ohm.aimDesc')}
                </p>
            </section>

            <section className="space-y-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {t('guide.ohm.concept')}
                </h3>
                <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
                    <p className="text-sm italic" style={{ color: 'var(--lab-text-secondary)' }}>
                        {t('guide.ohm.conceptDesc')}
                    </p>
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '1px solid var(--lab-border)' }}>
                        <code className="text-blue-400 font-bold text-lg">V = I × R</code>
                    </div>
                </div>
            </section>
        </div>
    );
};

const OhmProcedure = () => {
    const { t } = useLanguage();
    const steps = t('guide.ohm.steps') as unknown as string[];
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <ul className="space-y-3">
                {Array.isArray(steps) && steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}>
                            {i + 1}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>{step}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const WheatstoneTheory = () => {
    const { t } = useLanguage();
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <section className="space-y-2">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    {t('guide.wheatstone.aim')}
                </h3>
                <p className="font-medium leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>
                    {t('guide.wheatstone.aimDesc')}
                </p>
            </section>

            <section className="space-y-2">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    {t('guide.wheatstone.principle')}
                </h3>
                <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
                    <p className="text-sm italic" style={{ color: 'var(--lab-text-secondary)' }}>
                        {t('guide.wheatstone.principleDesc')}
                    </p>
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '1px solid var(--lab-border)' }}>
                        <code className="text-purple-400 font-bold text-lg">P / Q = R / S</code>
                    </div>
                </div>
            </section>
        </div>
    );
};

const WheatstoneProcedure = () => {
    const { t } = useLanguage();
    const steps = t('guide.wheatstone.steps') as unknown as string[];
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <ul className="space-y-3">
                {Array.isArray(steps) && steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}>
                            {i + 1}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>{step}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const OpticsTheory = () => {
    const { t } = useLanguage();
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <section className="space-y-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {t('guide.optics.aim')}
                </h3>
                <p className="font-medium leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>
                    {t('guide.optics.aimDesc')}
                </p>
            </section>

            <section className="space-y-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {t('guide.optics.lensFormula')}
                </h3>
                <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
                    <p className="text-sm italic" style={{ color: 'var(--lab-text-secondary)' }}>
                        {t('guide.optics.lensFormulaDesc')}
                    </p>
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '1px solid var(--lab-border)' }}>
                        <code className="text-blue-400 font-bold text-lg">1/f = 1/v - 1/u</code>
                    </div>
                </div>
            </section>
        </div>
    );
};

const OpticsProcedure = () => {
    const { t } = useLanguage();
    const steps = t('guide.optics.steps') as unknown as string[];
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <ul className="space-y-3">
                {Array.isArray(steps) && steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}>
                            {i + 1}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>{step}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MechanicsTheory = () => {
    const { t } = useLanguage();
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <section className="space-y-2">
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                    {t('guide.mechanics.aim')}
                </h3>
                <p className="font-medium leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>
                    {t('guide.mechanics.aimDesc')}
                </p>
            </section>

            <section className="space-y-2">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {t('guide.mechanics.forceEquation')}
                </h3>
                <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
                    <p className="text-sm italic" style={{ color: 'var(--lab-text-secondary)' }}>
                        {t('guide.mechanics.forceEquationDesc')}
                    </p>
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '1px solid var(--lab-border)' }}>
                        <code className="text-red-400 font-bold text-lg">F = m × a</code>
                    </div>
                </div>
            </section>
        </div>
    );
};

const MechanicsProcedure = () => {
    const { t } = useLanguage();
    const steps = t('guide.mechanics.steps') as unknown as string[];
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <ul className="space-y-3">
                {Array.isArray(steps) && steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}>
                            {i + 1}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>{step}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Observation = ({ experimentId, isModal = false }: { experimentId: string; isModal?: boolean }) => {
    const { observations, recordObservation, clearObservations } = usePhysicsLab();
    const { recordObservationXP } = useGamification();
    const { t } = useLanguage();

    const handleRecord = () => {
        recordObservation();
        recordObservationXP();
    };

    const handleExport = () => {
        if (observations.length === 0) return;

        let headers = [];
        let rows = [];

        if (experimentId === 'ohm-law') {
            headers = ["Serial No.", "Voltage (V)", "Current (A)", "Total Resistance (Ω)", "Rheostat (Ω)"];
            rows = observations.map((o, i) => [i + 1, o.v, o.i, o.r, o.rheostatR]);
        } else {
            headers = ["Serial No.", "P/Q Ratio", "R (Ohm)", "Deflection"];
            rows = observations.map((o, i) => [i + 1, (o.p / o.q), o.r, o.reading]);
        }

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `experiment_${experimentId}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t('guide.observation.system')}</div>
                <div className="flex gap-2">
                    <button
                        onClick={clearObservations}
                        className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title={t('guide.observation.clear')}
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={handleRecord}
                        className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 transition-colors uppercase tracking-widest"
                    >
                        {t('guide.observation.record')}
                    </button>
                </div>
            </div>

            <div className={`overflow-hidden border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl bg-white dark:bg-[#0b1120] w-full`}>
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        {experimentId === 'ohm-law' ? (
                            <tr className="bg-slate-900 dark:bg-slate-950 text-white">
                                <th className={`w-[10%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>SR.</th>
                                <th className={`w-[22.5%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>Voltage (V)</th>
                                <th className={`w-[22.5%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>Current (A)</th>
                                <th className={`w-[22.5%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>Rheostat (Ω)</th>
                                <th className={`w-[22.5%] font-black uppercase tracking-tighter text-center ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>Resist. (Ω)</th>
                            </tr>
                        ) : (
                            <tr className="bg-slate-900 dark:bg-slate-950 text-white">
                                <th className={`w-[15%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>SR.</th>
                                <th className={`w-[28%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>P/Q Ratio</th>
                                <th className={`w-[28%] font-black uppercase tracking-tighter text-center border-r border-white/10 ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>Resistance (R)</th>
                                <th className={`w-[29%] font-black uppercase tracking-tighter text-center ${isModal ? 'p-6 text-[10px] sm:text-xs' : 'p-2 text-[8px]'}`}>Deflection</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {observations.length === 0 && (
                            <tr>
                                <td colSpan={experimentId === 'ohm-law' ? 5 : 4} className="p-16 text-center text-slate-400 font-bold italic uppercase tracking-widest opacity-30">
                                    <Table className="mx-auto mb-4 opacity-50" size={48} />
                                    {t('guide.observation.noData')}
                                </td>
                            </tr>
                        )}
                        {observations.map((obs: any, i) => (
                            <tr key={i} className="even:bg-slate-50/50 dark:even:bg-slate-800/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                                <td className={`font-black text-center border-r border-slate-100 dark:border-slate-800 text-slate-400 ${isModal ? 'p-6 text-xl' : 'p-2 text-[10px]'}`}>{i + 1}</td>
                                {experimentId === 'ohm-law' ? (
                                    <>
                                        <td className={`font-black text-center border-r border-slate-100 dark:border-slate-800 ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} text-blue-600 dark:text-blue-400 drop-shadow-sm truncate`}>{obs.v?.toFixed(2)}</td>
                                        <td className={`font-black text-center border-r border-slate-100 dark:border-slate-800 ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} text-emerald-600 dark:text-emerald-400 drop-shadow-sm truncate`}>{obs.i?.toFixed(4)}</td>
                                        <td className={`font-black text-center border-r border-slate-100 dark:border-slate-800 ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} text-amber-600 dark:text-amber-400 drop-shadow-sm truncate`}>{obs.rheostatR?.toFixed(1)}</td>
                                        <td className={`font-black text-center ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} text-slate-600 dark:text-slate-300 drop-shadow-sm truncate`}>{obs.r?.toFixed(2)}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className={`font-black text-center border-r border-slate-100 dark:border-slate-800 ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} text-purple-600 dark:text-purple-400 truncate`}>{(obs.p / obs.q).toFixed(2)}</td>
                                        <td className={`font-black text-center border-r border-slate-100 dark:border-slate-800 ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} text-blue-600 dark:text-blue-400 truncate`}>{obs.r?.toFixed(0)}</td>
                                        <td className={`font-black text-center ${isModal ? 'p-6 text-xl sm:text-2xl lg:text-3xl' : 'p-2 text-[10px]'} ${obs.reading > 0 ? 'text-amber-500' : obs.reading < 0 ? 'text-rose-500' : 'text-emerald-500'} truncate`}>
                                            {obs.reading > 0 ? 'R' : obs.reading < 0 ? 'L' : '0'}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleExport}
                disabled={observations.length === 0}
                className="w-full p-3 bg-blue-500/5 text-slate-400 border border-slate-800 rounded-xl hover:bg-blue-500/10 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download size={14} />
                {t('guide.observation.export')}
            </button>
        </div>
    );
};

const Graph = ({ experimentId }: { experimentId: string }) => {
    const { observations } = usePhysicsLab();
    const [isFull, setIsFull] = useState(false);
    const { t } = useLanguage();

    if (experimentId !== 'ohm-law') {
        return (
            <div className="h-72 flex flex-col items-center justify-center gap-4 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-inner">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('guide.graph.notApplicable')}</h4>
            </div>
        );
    }

    // Determine scales based on data or defaults
    const valsV = observations.map((o: any) => o.v || 0);
    const valsI = observations.map((o: any) => o.i || 0);
    const maxV = Math.max(...valsV, 10);
    const maxI = Math.max(...valsI, 0.1);

    // Grid config
    const horzSteps = 10;
    const vertSteps = 10;

    return (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                    {t('guide.graph.title')}
                </h3>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#fbbf24]"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{t('guide.graph.readings')}</span>
                </div>
            </div>

            <div 
                className={`relative aspect-[4/3] w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl group transition-all hover:ring-4 ring-blue-500/20 active:scale-[0.98]`}
            >
                {/* Clickable Overlay */}
                <div 
                    onClick={() => {
                        console.log("Graph Clicked - Opening Popup");
                        setIsFull(true);
                    }} 
                    className="absolute inset-0 z-[50] cursor-pointer" 
                    title="Click to expand graph"
                />

                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg text-white">
                        <Maximize size={14} />
                    </div>
                </div>
                
                <GraphContent observations={observations} maxV={maxV} maxI={maxI} isModal={false} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-relaxed">
                    {observations.length < 2
                        ? t('guide.graph.minReadings')
                        : t('guide.graph.verification')
                    }
                </p>
                <div className="mt-2 text-[9px] italic text-[#ec4899] font-bold">
                    {t('guide.graph.slopeFormula')}
                </div>
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {isFull && typeof document !== 'undefined' && createPortal(
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-white dark:bg-[#020617]"
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="w-full h-full flex flex-col p-4 sm:p-10"
                        >
                            <button 
                                onClick={() => setIsFull(false)}
                                className="absolute top-6 right-8 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all z-[10001] shadow-2xl flex items-center gap-2"
                            >
                                <X size={24} />
                                <span className="text-sm font-black uppercase tracking-widest px-2 font-sans">{t('guide.graph.closeAnalysis')}</span>
                            </button>

                            <div className="mb-6 mt-4 px-4">
                                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-5">
                                    <div className="w-4 h-14 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                    {t('guide.graph.fullTitle')}
                                </h1>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-bold ml-9 mt-2 uppercase tracking-tight">{t('guide.graph.subTitle')}</p>
                            </div>

                            <div className="flex-1 relative bg-white dark:bg-slate-900 border-y-2 border-slate-100 dark:border-slate-800 shadow-inner">
                                 <GraphContent observations={observations} maxV={maxV} maxI={maxI} isModal={true} />
                            </div>

                            <div className="h-24 bg-slate-50 dark:bg-slate-900 flex items-center justify-between px-10 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-10">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Formula Used</p>
                                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">V = I × R</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-300 dark:bg-slate-700"></div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Slope Interpretation</p>
                                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">Slope = Resistance (Ω)</p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setIsFull(false)}
                                    className="px-12 py-4 bg-slate-900 dark:bg-blue-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all text-sm shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
                                >
                                    {t('guide.graph.return')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>

        </div>
    );
};

// Extracted core graph content for reuse in modal
const GraphContent = ({ observations, maxV, maxI, isModal = false }: { observations: any[], maxV: number, maxI: number, isModal?: boolean }) => {
    const { t } = useLanguage();
    return (
        <>
            {/* Reference Grid Paper Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.15]">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#06b6d4 0.5px, transparent 0.5px)', backgroundSize: isModal ? '15px 15px' : '10px 10px' }}></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #06b6d4 0.5px, transparent 0.5px), linear-gradient(to bottom, #06b6d4 0.5px, transparent 0.5px)', backgroundSize: isModal ? '75px 75px' : '50px 50px' }}></div>
            </div>

            <div className={`absolute inset-6 bottom-16 left-24 sm:left-28 flex flex-col items-center justify-center`}>
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={`${isModal ? 'modal-' : ''}lineGrad`} x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <filter id={`${isModal ? 'modal-' : ''}glow`}>
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Axes */}
                    <g className="stroke-slate-800 dark:stroke-slate-400" strokeWidth="2" fill="none">
                        {/* Y-Axis */}
                        <line x1="0" y1="0" x2="0" y2="150" />
                        <path d="M -4,6 L 0,0 L 4,6" />
                        {/* X-Axis */}
                        <line x1="0" y1="150" x2="200" y2="150" />
                        <path d="M 194,146 L 200,150 L 194,154" />
                        
                        {/* Origin & Tips */}
                        <text x="-12" y="162" fontSize="8" fill="currentColor" fontWeight="bold">O</text>
                        <text x="-10" y="8" fontSize="8" fill="currentColor" fontWeight="bold">Y</text>
                        <text x="210" y="152" fontSize="8" fill="currentColor" fontWeight="bold">X</text>
                    </g>

                    {/* Tick Marks & Text */}
                    {Array.from({ length: 6 }).map((_, i) => {
                        const v = (i / 5) * maxV;
                        const cur = (i / 5) * maxI;
                        const x = (i / 5) * 200;
                        const y = 150 - (i / 5) * 150;

                        return (
                            <g key={i}>
                                <line x1={x} y1="150" x2={x} y2="155" stroke="#64748b" strokeWidth="1" />
                                <text x={x} y="168" fontSize={isModal ? "5" : "6"} fill="#64748b" textAnchor="middle" fontWeight="black">{v.toFixed(1)}</text>
                                <line x1="-5" y1={y} x2="0" y2={y} stroke="#64748b" strokeWidth="1" />
                                <text x="-8" y={y} fontSize={isModal ? "5" : "6"} fill="#64748b" textAnchor="end" dominantBaseline="middle" fontWeight="black">{cur.toFixed(2)}</text>
                            </g>
                        );
                    })}

                    {/* Projections */}
                    <g>
                        {observations.map((obs: any, i) => {
                            const px = (obs.i / maxI) * 200;
                            const py = 150 - (obs.v / maxV) * 150;
                            if (isNaN(px) || isNaN(py)) return null;
                            return (
                                <g key={`proj-${i}`} stroke="#64748b" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4">
                                    <line x1={px} y1={py} x2={px} y2="150" />
                                    <line x1={px} y1={py} x2="0" y2={py} />
                                </g>
                            );
                        })}
                    </g>

                    {/* Slope Triangle */}
                    {observations.length >= 2 && (
                        <g opacity="0.8">
                            {(() => {
                                const sorted = [...observations]
                                    .filter((o: any) => o.v !== undefined && o.i !== undefined)
                                    .sort((a: any, b: any) => a.i - b.i);
                                const p1 = sorted[sorted.length - 2];
                                const p2 = sorted[sorted.length - 1];
                                const x1 = (p1.i / maxI) * 200;
                                const y1 = 150 - (p1.v / maxV) * 150;
                                const x2 = (p2.i / maxI) * 200;
                                const y2 = 150 - (p2.v / maxV) * 150;
                                return (
                                    <>
                                        <line x1={x1} y1={y2} x2={x2} y2={y2} stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3,1" />
                                        <line x1={x1} y1={y1} x2={x1} y2={y2} stroke="#ec4899" strokeWidth="1" strokeDasharray="3,1" />
                                        <text x={(x1 + x2) / 2} y={y2 - 4} fontSize="5" fill="#8b5cf6" textAnchor="middle" fontWeight="bold">ΔI</text>
                                        <text x={x1 - 4} y={(y1 + y2) / 2} fontSize="5" fill="#ec4899" textAnchor="end" fontWeight="bold" transform={`rotate(-90, ${x1 - 4}, ${(y1 + y2) / 2})`}>ΔV</text>
                                    </>
                                );
                            })()}
                        </g>
                    )}

                    {/* Characteristic Line - Solid Red like reference */}
                    {observations.length > 1 && (
                        <motion.polyline
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            points={observations
                                .filter((o: any) => o.v !== undefined && o.i !== undefined)
                                .sort((a: any, b: any) => a.i - b.i)
                                .map((o: any) => `${(o.i / maxI) * 200},${150 - (o.v / maxV) * 150}`)
                                .join(' ')}
                        />
                    )}

                    {/* Data Points */}
                    {observations
                        .filter((obs: any) => typeof obs.i === 'number' && typeof obs.v === 'number')
                        .map((obs: any, i) => (
                            <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                                <circle
                                    cx={(obs.i / maxI) * 200}
                                    cy={150 - (obs.v / maxV) * 150}
                                    r={isModal ? "2.5" : "3.5"}
                                    fill="#fbbf24"
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                    className="drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]"
                                />
                            </motion.g>
                        ))}
                </svg>
            </div>
            
            {/* Axis Labels - Match reference style */}
            <div className={`absolute top-[48%] left-1 sm:left-2 -rotate-90 -translate-y-1/2 whitespace-nowrap font-black uppercase tracking-[0.2em] text-[#8b5cf6] ${isModal ? 'text-3xl' : 'text-[10px]'}`}>
                {t('guide.graph.axisI') ?? 'I (Ampere)'} ———›
            </div>
            <div className={`absolute bottom-2 sm:bottom-4 left-[55%] -translate-x-1/2 whitespace-nowrap font-black uppercase tracking-[0.2em] text-[#ec4899] ${isModal ? 'text-3xl' : 'text-[10px]'}`}>
                {t('guide.graph.axisV') ?? 'V (Volt)'} ———›
            </div>
        </>
    );
};
