"use client"

import Link from "next/link"
import { ArrowRight, Beaker, Zap, Lightbulb, Clock, Star, Users, FlaskConical, GraduationCap, LayoutTemplate } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"

const templates = [
    {
        id: "ohm-law",
        icon: Zap,
        color: "from-amber-400 to-orange-500",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-200",
        category: "electricity",
        difficulty: "beginner",
        duration: "20",
        students: "2.4k",
        featured: true,
    },
    {
        id: "wheatstone-bridge",
        icon: Zap,
        color: "from-orange-400 to-red-500",
        bgColor: "bg-orange-50",
        textColor: "text-orange-600",
        borderColor: "border-orange-200",
        category: "electricity",
        difficulty: "intermediate",
        duration: "30",
        students: "1.8k",
        featured: false,
    },
    {
        id: "reflection-refraction",
        icon: Lightbulb,
        color: "from-cyan-400 to-blue-500",
        bgColor: "bg-cyan-50",
        textColor: "text-cyan-600",
        borderColor: "border-cyan-200",
        category: "optics",
        difficulty: "intermediate",
        duration: "25",
        students: "2.1k",
        featured: true,
    },
    {
        id: "newton-second-law",
        icon: FlaskConical,
        color: "from-emerald-400 to-teal-500",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
        category: "mechanics",
        difficulty: "intermediate",
        duration: "25",
        students: "1.6k",
        featured: false,
    },
    {
        id: "series-parallel",
        icon: Zap,
        color: "from-violet-400 to-purple-500",
        bgColor: "bg-violet-50",
        textColor: "text-violet-600",
        borderColor: "border-violet-200",
        category: "electricity",
        difficulty: "beginner",
        duration: "15",
        students: "3.2k",
        featured: true,
    },
    {
        id: "pendulum",
        icon: FlaskConical,
        color: "from-teal-400 to-green-500",
        bgColor: "bg-teal-50",
        textColor: "text-teal-600",
        borderColor: "border-teal-200",
        category: "mechanics",
        difficulty: "beginner",
        duration: "20",
        students: "2.8k",
        featured: false,
    },
]

const difficultyConfig: Record<string, { label: string; color: string }> = {
    beginner: { label: "Beginner", color: "bg-green-100 text-green-700" },
    intermediate: { label: "Intermediate", color: "bg-blue-100 text-blue-700" },
    advanced: { label: "Advanced", color: "bg-purple-100 text-purple-700" },
}

export default function TemplatesPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-slate-50" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
                            backgroundSize: "30px 30px",
                        }}
                    />
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-blue-600 mb-8 uppercase tracking-widest">
                                <LayoutTemplate className="w-3.5 h-3.5" />
                                {t("templates.badge")}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                                {t("templates.title1")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                                    {t("templates.title2")}
                                </span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                                {t("templates.description")}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Category Pills */}
                <section className="pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            {[
                                { key: "all", icon: Beaker },
                                { key: "electricity", icon: Zap },
                                { key: "optics", icon: Lightbulb },
                                { key: "mechanics", icon: FlaskConical },
                            ].map((cat, i) => (
                                <button
                                    key={cat.key}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                        i === 0
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                            : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    {t(`templates.categories.${cat.key}`)}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Templates Grid */}
                <section className="pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {templates.map((template, i) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="group relative"
                                >
                                    <Card className="h-full p-0 bg-white border-slate-200 hover:border-blue-300 transition-all duration-500 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
                                        {/* Card Header with gradient */}
                                        <div className={`relative h-36 bg-gradient-to-br ${template.color} p-6 flex items-end`}>
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                                {template.featured && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                                                        <Star className="w-3 h-3" /> {t("templates.featured")}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <template.icon className="w-7 h-7 text-white" />
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${template.bgColor} ${template.textColor}`}>
                                                    {t(`templates.categories.${template.category}`)}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${difficultyConfig[template.difficulty]?.color ?? ""}`}>
                                                    {t(`templates.difficulty.${template.difficulty}`)}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                                {t(`templates.items.${template.id}.title`)}
                                            </h3>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                                {t(`templates.items.${template.id}.desc`)}
                                            </p>

                                            <div className="flex items-center gap-4 mb-6 text-xs text-slate-400 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {template.duration} {t("templates.minutes")}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {template.students} {t("templates.students")}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <GraduationCap className="w-3.5 h-3.5" />
                                                    {t(`templates.gradeLevel.${template.difficulty}`)}
                                                </div>
                                            </div>

                                            <Link href={`/physics-lab/${template.id}`}>
                                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-bold gap-2 group/btn">
                                                    {t("templates.tryTemplate")}
                                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 mb-8 uppercase tracking-widest">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {t("templates.cta.badge")}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                {t("templates.cta.title1")}{" "}
                                <span className="text-blue-400">{t("templates.cta.title2")}</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
                                {t("templates.cta.description")}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/physics-lab">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto text-lg px-10 h-14 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/30 rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Beaker className="w-5 h-5" />
                                        {t("templates.cta.exploreLab")}
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full sm:w-auto text-lg px-10 h-14 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {t("templates.cta.joinFree")}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
