"use client"

import Link from "next/link"
import { Atom, Beaker, Zap, Lightbulb, Microscope, Check, Globe, ShieldCheck, Sparkles, GraduationCap, Users, Clock, Star, Award, ArrowRight, FlaskConical } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"

export default function PosterPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-slate-900 font-sans overflow-x-hidden">
            {/* ===== POSTER CONTENT — optimized for screenshot / print ===== */}

            {/* --- TOP HERO BANNER --- */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />

                {/* Animated Blueprint Grid */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                />

                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Decorative Atomic Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/[0.03] rounded-full pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.04] rounded-full pointer-events-none rotate-[30deg]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.05] rounded-full pointer-events-none rotate-[60deg]" />

                {/* Radial dots pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                />

                <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Logo */}
                        <div className="flex items-center justify-center gap-3 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                                <Atom className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-3xl font-black text-white tracking-tight leading-tight">PhysicsLab</div>
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Virtual Laboratory</div>
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-xs font-bold text-blue-300 mb-8 uppercase tracking-[0.2em]">
                            <Sparkles className="w-3.5 h-3.5" />
                            {t("poster.badge")}
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
                            {t("poster.headline1")}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                                {t("poster.headline2")}
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            {t("poster.subheadline")}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/signup">
                                <Button size="lg" className="h-14 px-10 text-lg font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 gap-2">
                                    <Zap className="w-5 h-5" />
                                    {t("poster.ctaPrimary")}
                                </Button>
                            </Link>
                            <Link href="/physics-lab">
                                <Button size="lg" className="h-14 px-10 text-lg font-black bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95 gap-2">
                                    <Beaker className="w-5 h-5" />
                                    {t("poster.ctaSecondary")}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- STATS BAR --- */}
            <section className="relative py-16 bg-slate-900/80 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { value: "4+", label: t("poster.stats.domains"), icon: FlaskConical, color: "text-blue-400" },
                            { value: "100%", label: t("poster.stats.curriculum"), icon: Check, color: "text-emerald-400" },
                            { value: "24/7", label: t("poster.stats.access"), icon: Globe, color: "text-cyan-400" },
                            { value: "0", label: t("poster.stats.cost"), icon: Star, color: "text-amber-400" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group"
                            >
                                <div className={`flex justify-center mb-3 ${stat.color}`}>
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <div className="text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- KEY FEATURES --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/50" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            {t("poster.features.title1")}{" "}
                            <span className="text-blue-400">{t("poster.features.title2")}</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                            {t("poster.features.subtitle")}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: t("poster.features.electricity.title"),
                                desc: t("poster.features.electricity.desc"),
                                gradient: "from-amber-500 to-orange-500",
                                glow: "bg-amber-500/10",
                            },
                            {
                                icon: Lightbulb,
                                title: t("poster.features.optics.title"),
                                desc: t("poster.features.optics.desc"),
                                gradient: "from-cyan-400 to-blue-500",
                                glow: "bg-cyan-500/10",
                            },
                            {
                                icon: FlaskConical,
                                title: t("poster.features.mechanics.title"),
                                desc: t("poster.features.mechanics.desc"),
                                gradient: "from-emerald-400 to-teal-500",
                                glow: "bg-emerald-500/10",
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="group relative"
                            >
                                <div className="relative h-full p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-500 overflow-hidden">
                                    {/* Hover glow */}
                                    <div className={`absolute -top-12 -right-12 w-32 h-32 ${feature.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- WHY PHYSICSLAB --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 to-slate-900" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Benefits List */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-10 tracking-tight leading-tight">
                                {t("poster.why.title1")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    {t("poster.why.title2")}
                                </span>
                            </h2>

                            <div className="space-y-8">
                                {[
                                    { icon: ShieldCheck, title: t("poster.why.safe.title"), desc: t("poster.why.safe.desc") },
                                    { icon: Microscope, title: t("poster.why.feedback.title"), desc: t("poster.why.feedback.desc") },
                                    { icon: GraduationCap, title: t("poster.why.curriculum.title"), desc: t("poster.why.curriculum.desc") },
                                    { icon: Users, title: t("poster.why.accessible.title"), desc: t("poster.why.accessible.desc") },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-5"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                <item.icon className="w-6 h-6 text-blue-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                            <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Visual Feature Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative rounded-[2.5rem] bg-slate-800/50 border border-slate-700/50 p-8 backdrop-blur-xl overflow-hidden">
                                {/* Inner glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 blur-[80px] pointer-events-none" />

                                <div className="relative z-10 space-y-6">
                                    {/* Feature header */}
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                            <Atom className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{t("poster.visual.labTitle")}</div>
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t("poster.visual.labSubtitle")}</div>
                                        </div>
                                    </div>

                                    {/* Mini Feature Cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Zap, label: t("poster.visual.circuits"), color: "text-amber-500" },
                                            { icon: Lightbulb, label: t("poster.visual.rayTracing"), color: "text-cyan-400" },
                                            { icon: Award, label: t("poster.visual.gamified"), color: "text-violet-400" },
                                            { icon: Clock, label: t("poster.visual.realtime"), color: "text-emerald-400" },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
                                            >
                                                <item.icon className={`w-6 h-6 ${item.color}`} />
                                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("poster.visual.progress")}</span>
                                            <span className="text-xs font-bold text-blue-400">100%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "100%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- AUDIENCE SECTION --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            {t("poster.audience.title1")}{" "}
                            <span className="text-blue-400">{t("poster.audience.title2")}</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: GraduationCap,
                                title: t("poster.audience.students.title"),
                                desc: t("poster.audience.students.desc"),
                                gradient: "from-blue-500 to-indigo-500",
                            },
                            {
                                icon: Users,
                                title: t("poster.audience.teachers.title"),
                                desc: t("poster.audience.teachers.desc"),
                                gradient: "from-cyan-500 to-blue-500",
                            },
                            {
                                icon: Award,
                                title: t("poster.audience.schools.title"),
                                desc: t("poster.audience.schools.desc"),
                                gradient: "from-violet-500 to-purple-500",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className="relative h-full p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08] text-center hover:bg-white/[0.07] transition-all duration-500">
                                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- BOTTOM CTA --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 to-slate-900" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.95]">
                            {t("poster.cta.title1")}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                {t("poster.cta.title2")}
                            </span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 font-medium">
                            {t("poster.cta.description")}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                            <Link href="/signup">
                                <Button size="lg" className="h-16 px-12 text-lg font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 gap-2">
                                    {t("poster.cta.getStarted")}
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/book-demo">
                                <Button size="lg" className="h-16 px-12 text-lg font-black bg-white text-blue-900 hover:bg-slate-100 rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95 gap-2">
                                    {t("poster.cta.bookDemo")}
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-6 text-slate-500">
                            {[
                                { icon: ShieldCheck, text: t("poster.trust.secure") },
                                { icon: Clock, text: t("poster.trust.setup") },
                                { icon: Star, text: t("poster.trust.free") },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                    <badge.icon className="w-4 h-4 text-blue-400/60" />
                                    {badge.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- FOOTER BRAND --- */}
            <div className="py-8 border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <Atom className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-500">
                        &copy; {new Date().getFullYear()} PhysicsLab — {t("poster.footer")}
                    </span>
                </div>
            </div>
        </div>
    )
}
