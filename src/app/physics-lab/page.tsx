"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Beaker, Zap, ArrowRight, Star, TrendingUp, BookOpen, Search, Filter, ShieldCheck } from 'lucide-react';
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { usePhysicsLab } from '@/context/PhysicsLabContext';

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
    }
];

export default function PhysicsLabDashboard() {
    const { masteredExperiments } = usePhysicsLab();
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [history, setHistory] = React.useState<string[]>([]);
    const categories = ['All', 'Electricity', 'Mechanics', 'Optics'];

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = JSON.parse(localStorage.getItem('physics-lab-history') || '[]');
            setHistory(savedHistory);
        }
    }, []);

    const filteredExperiments = experiments.filter(e => {
        const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const recentExps = experiments.filter(e => history.includes(e.id));

    return (
        <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans">
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
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Physics</span> via Experimentation
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                            Master complex concepts through immersive, hands-on simulations. Build circuits, collect real-time data, and visualize the laws of nature.
                        </p>
                    </motion.div>
                </div>

                {/* Recently Viewed */}
                {recentExps.length > 0 && (
                    <div className="mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <h2 className="text-sm font-bold uppercase tracking-widest italic">Pick up where you left off</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentExps.map((exp) => (
                                <Link key={exp.id} href={`/physics-lab/${exp.id}`}>
                                    <div className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all">
                                        <div className={`w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20`}>
                                            <exp.icon className={`w-5 h-5 text-blue-400`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight flex items-center gap-2">
                                                {exp.title}
                                                {masteredExperiments.includes(exp.id) && (
                                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                                )}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 font-medium">Last active section</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
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
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-slate-100"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex items-center gap-2 border rounded-2xl px-6 py-4 transition-all whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                                    }`}
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
                                <div className="h-full bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                                    <div className={`w-14 h-14 rounded-2xl bg-${exp.color}-500/10 flex items-center justify-center mb-6 border border-${exp.color}-500/20 group-hover:scale-110 transition-transform`}>
                                        <exp.icon className={`w-7 h-7 text-${exp.color}-400`} />
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{exp.category}</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-bold text-slate-400">4.9</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-3">
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

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-semibold text-slate-400">{exp.difficulty}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wide">
                                            START LAB <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Placeholder Card for Future Experiments */}
                    <div className="relative group overflow-hidden rounded-3xl border border-slate-800 border-dashed p-8 flex flex-col items-center justify-center text-center bg-slate-900/20">
                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <BookOpen className="w-7 h-7 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">More Experiments Coming Soon</h3>
                        <p className="text-slate-700 text-xs mt-2">Optics, Mechanics, and Thermodynamics are in development.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
