"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Beaker, Zap, ArrowRight, Star, TrendingUp, BookOpen, Search, Filter, ShieldCheck, Database, Clock, Trash2 } from 'lucide-react';
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useSession } from "next-auth/react";
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import type { SavedSession } from '@/context/PhysicsLabContext';
import { GamificationPanel } from '@/components/physics-lab/GamificationPanel';
import { PhysicsLabProvider } from '@/context/PhysicsLabContext';

const experiments = [
    {
        id: 'ohm-law',
        title: "Ohm's Law Verification",
        description: "Study the relationship between voltage, current, and resistance in a conductor.",
        difficulty: "Beginner",
        icon: Zap,
        color: "blue",
        category: "Electricity"
    },
    {
        id: 'wheatstone-bridge',
        title: "Wheatstone Bridge",
        description: "Learn to determine an unknown resistance using the bridge balance principle.",
        difficulty: "Intermediate",
        icon: Beaker,
        color: "purple",
        category: "Electricity"
    },
    {
        id: 'reflection-refraction',
        title: "Reflection & Refraction",
        description: "Explore the laws of light as it interacts with mirrors and lenses.",
        difficulty: "Intermediate",
        icon: Search,
        color: "blue",
        category: "Optics"
    },
    {
        id: 'newton-second-law',
        title: "Newton's Second Law",
        description: "Study force, mass, and acceleration using blocks and pulleys.",
        difficulty: "Intermediate",
        icon: TrendingUp,
        color: "red",
        category: "Mechanics"
    }
];

function PhysicsLabDashboardContent() {
    const { data: session, status } = useSession();
    const { masteredExperiments } = usePhysicsLab();
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [history, setHistory] = React.useState<string[]>([]);
    const [savedSessions, setSavedSessions] = React.useState<SavedSession[]>([]);
    const categories = ['All', 'Electricity', 'Mechanics', 'Optics'];

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = JSON.parse(localStorage.getItem('physics-lab-history') || '[]');
            setHistory(savedHistory);
        }
    }, []);

    // Fetch saved experiments from database
    React.useEffect(() => {
        async function fetchSessions() {
            try {
                const res = await fetch('/api/experiment-sessions');
                if (res.ok) {
                    const data = await res.json();
                    setSavedSessions(data.sessions || []);
                }
            } catch {
                // User may not be logged in — silently ignore
            }
        }
        fetchSessions();
    }, []);

    const handleDeleteSession = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/experiment-sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
            if (res.ok) {
                setSavedSessions(prev => prev.filter(s => s.id !== sessionId));
            }
        } catch {
            // Silently ignore
        }
    };

    const filteredExperiments = experiments.filter(e => {
        const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const recentExps = experiments.filter(e => history.includes(e.id));

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--lab-bg)', color: 'var(--lab-text)' }}>
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                {/* Hero Header */}
                <div className="relative mb-16">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full">
                                Virtual Laboratory
                            </div>
                            <div className="h-px w-12 bg-slate-800"></div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{ color: 'var(--lab-text)' }}>
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Physics</span> via Experimentation
                        </h1>
                        <p className="text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--lab-text-secondary)' }}>
                            Master complex concepts through immersive, hands-on simulations. Build circuits, collect real-time data, and visualize the laws of nature.
                        </p>
                    </motion.div>
                </div>

                {/* Gamification Stats Banner */}
                <div className="mb-16">
                    <GamificationPanel compact />
                </div>

                {/* Recently Viewed */}
                {recentExps.length > 0 && (
                    <div className="mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--lab-text-secondary)' }}>
                            <Star className="w-4 h-4 text-yellow-500" />
                            <h2 className="text-sm font-bold uppercase tracking-widest italic">Pick up where you left off</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentExps.map((exp) => (
                                <Link key={exp.id} href={`/physics-lab/${exp.id}`}>
                                    <div className="group border rounded-2xl p-4 flex items-center gap-4 transition-all" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border`} style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '1px solid var(--lab-border)' }}>
                                            <exp.icon className={`w-5 h-5 text-blue-400`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight flex items-center gap-2" style={{ color: 'var(--lab-text)' }}>
                                                {exp.title}
                                                {masteredExperiments.includes(exp.id) && (
                                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                                )}
                                            </h4>
                                            <p className="text-[10px] font-medium" style={{ color: 'var(--lab-text-muted)' }}>Last active section</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Saved Experiments from Database */}
                {savedSessions.length > 0 && (
                    <div className="mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <Database className="w-4 h-4 text-blue-500" />
                            <h2 className="text-sm font-bold uppercase tracking-widest italic">Saved Experiments</h2>
                            <span className="ml-2 text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                                {savedSessions.length} saved
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedSessions.map((session) => {
                                const exp = experiments.find(e => e.id === session.experimentId);
                                const Icon = exp?.icon || Beaker;
                                const obsCount = Array.isArray(session.observations) ? session.observations.length : 0;
                                return (
                                    <div key={session.id} className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all">
                                        <Link href={`/physics-lab/${session.experimentId}?sessionId=${session.id}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                    <Icon className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate">
                                                        {session.experimentTitle}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-slate-600" />
                                                            <p className="text-[10px] text-slate-500 font-medium">
                                                                {new Date(session.updatedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {obsCount > 0 && (
                                                            <span className="text-[10px] text-emerald-500 font-medium">
                                                                {obsCount} observation{obsCount !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                                            </div>
                                        </Link>
                                        <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-end">
                                            <button
                                                onClick={() => handleDeleteSession(session.id)}
                                                className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search experiments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text)' }}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex items-center gap-2 border rounded-2xl px-6 py-4 transition-all whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                    : 'hover:opacity-80'
                                    }`}
                                style={activeCategory === cat ? {} : { backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)', color: 'var(--lab-text-secondary)' }}
                            >
                                {cat === 'All' && <Filter className="w-4 h-4" />}
                                <span className="font-semibold text-sm">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Experiment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredExperiments.map((exp, i) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group relative"
                        >
                            <Link href={`/physics-lab/${exp.id}`}>
                                <div className="h-full border rounded-3xl p-8 backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: 'var(--lab-card-bg)', border: '1px solid var(--lab-border)' }}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border group-hover:scale-110 transition-transform`} style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '1px solid var(--lab-border)' }}>
                                        <exp.icon className={`w-7 h-7 text-${exp.color}-400`} />
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{exp.category}</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-bold text-slate-400">4.9</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-3" style={{ color: 'var(--lab-text)' }}>
                                        {exp.title}
                                        {masteredExperiments.includes(exp.id) && (
                                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-1">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Mastered</span>
                                            </div>
                                        )}
                                    </h3>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                        {exp.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t" style={{ borderTop: '1px solid var(--lab-border)' }}>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-semibold" style={{ color: 'var(--lab-text-secondary)' }}>{exp.difficulty}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wide">
                                            {status === 'authenticated' ? (
                                                <>START LAB <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            ) : (
                                                <>SIGN UP TO START <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Placeholder Card for Future Experiments */}
                    <div className="relative group overflow-hidden rounded-3xl border border-dashed p-8 flex flex-col items-center justify-center text-center shadow-sm" style={{ backgroundColor: 'var(--lab-bg-secondary)', border: '2px dashed var(--lab-border)' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--lab-card-bg)' }}>
                            <BookOpen className="w-7 h-7 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--lab-text-muted)' }}>More Experiments Coming Soon</h3>
                        <p className="text-xs mt-2" style={{ color: 'var(--lab-text-muted)' }}>Optics, Mechanics, and Thermodynamics are in development.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PhysicsLabDashboard() {
    return (
        <PhysicsLabProvider>
            <PhysicsLabDashboardContent />
        </PhysicsLabProvider>
    );
}
