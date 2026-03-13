"use client"

import Link from "next/link"
import { ArrowRight, Check, Play, Zap, Beaker, Lightbulb, Microscope, Quote, Globe, BookOpen, Clock, PenTool } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Card } from "@/components/ui/card"
import { motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"
const Hero3D = dynamic(() => import("@/components/hero-3d").then((mod) => mod.Hero3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-slate-50/50" />
})

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* --- HERO SECTION --- */}
        {/* --- HERO SECTION: TEXT AREA WITH BACKGROUND --- */}
        <section className="relative pt-32 pb-24 flex items-center min-h-[85vh] overflow-hidden isolate">
          {/* Background Layers */}
          <div className="absolute inset-0 -z-50 bg-slate-50" />
          
          <div className="absolute inset-0 -z-40">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src="/physics-hero-bg.png"
              alt="Physics Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />

            {/* Decorative Grid Overlay */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.2] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Glowing Orbs for physics vibe */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          </div>

          <Hero3D />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-blue-600 mb-8 uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                The Future of STEM Education
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Master Physics <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 animate-gradient-x drop-shadow-sm">
                  Through Discovery.
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-4 text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Step into an interactive virtual laboratory. Build circuits, trace rays, and explore the laws of nature with precision simulations.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/physics-lab">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-16 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/30 rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95 group">
                    <Beaker className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Enter Virtual Lab
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 h-16 bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95 group">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Join for Free
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- VIDEO PREVIEW SECTION --- */}
        <section id="demo-video" className="pb-40 pt-10 bg-white relative overflow-hidden">
          {/* Section decorative background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          {/* Decorative Glowing Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mx-auto max-w-5xl rounded-[3.5rem] border border-slate-200/50 bg-white/50 backdrop-blur-sm p-5 shadow-[0_48px_100px_-20px_rgba(37,99,235,0.12)]"
            >
              <div className="aspect-[16/10] rounded-[2.5rem] bg-slate-900 flex items-center justify-center overflow-hidden relative border border-slate-800 shadow-2xl">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- STATS SECTION: SCIENTIFIC DASHBOARD --- */}
        <section className="py-24 relative bg-slate-50 overflow-hidden isolate">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#eff6ff,transparent_50%)]" />
          <div 
            className="absolute inset-0 opacity-[0.03] -z-10"
            style={{ 
              backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { val: "100%", label: "Curriculum Aligned", icon: Check, color: "blue" },
                { val: "4+", label: "Physics Domains", icon: Globe, color: "indigo" },
                { val: "Real-time", label: "Simulation Engine", icon: Zap, color: "cyan" },
                { val: "24/7", label: "Accessible Anywhere", icon: Clock, color: "violet" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="h-full p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    {/* Inner glowing orb on hover */}
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="mb-6 flex">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-${stat.color}-100`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="text-4xl font-black tracking-tighter text-slate-900 mb-2">{stat.val}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</div>
                      
                      {/* Decorative progress-like bar */}
                      <div className="mt-6 h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-blue-500`}
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- EXPERIMENT DOMAINS --- */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Explore Diverse <br /> <span className="text-blue-600">Learning Domains</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                From subatomic particles to celestial mechanics, our laboratory covers the entire spectrum of high-school and undergraduate physics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Electricity & Magnetism",
                  desc: "Design complex circuits with real-world instruments. Master Ohm’s Law, Wheatstone Bridge, and RLC series.",
                  icon: Zap,
                  color: "from-amber-400 to-orange-500",
                  img: "⚡"
                },
                {
                  title: "Optics & Light",
                  desc: "Trace laser rays through lenses, prisms, and mirrors. Visualize refraction and discover image formation properties.",
                  icon: Lightbulb,
                  color: "from-cyan-400 to-blue-500",
                  img: "🔭"
                },
                {
                  title: "Classical Mechanics",
                  desc: "Investigate forces, torque, and motion. Conduct virtual Atwood machine experiments and verify Newton's Laws.",
                  icon: Clock,
                  color: "from-emerald-400 to-teal-500",
                  img: "⚙️"
                }
              ].map((domain, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative"
                >
                  <Card className="h-full p-8 bg-white border-slate-200 hover:border-blue-300 transition-all duration-500 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${domain.color} opacity-5 -translate-y-12 translate-x-12 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-8 shadow-lg shadow-current/20`}>
                      <domain.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{domain.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">{domain.desc}</p>
                    <Link href="/physics-lab" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                      Browse Experiments <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WHY VIRTUAL LAB? --- */}
        <section className="py-32 bg-slate-900 overflow-hidden relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight"
                >
                  Designed for the <br /> <span className="text-blue-400 font-serif italic font-medium">Digital-First</span> Generation
                </motion.h2>
                <div className="space-y-10">
                  {[
                    {
                      title: "Risk-Free Exploration",
                      desc: "Experiments that are dangerous or expensive in real life are now completely safe and infinitely repeatable.",
                      icon: Microscope
                    },
                    {
                      title: "Intelligent Feedback",
                      desc: "Our engine detects circuit errors and provides real-time hints, acting like a private tutor at every step.",
                      icon: BookOpen
                    },
                    {
                      title: "Automated Lab Reports",
                      desc: "Focus on the science, not the formatting. Generate professional lab reports with your observations instantly.",
                      icon: PenTool
                    }
                  ].map((feat, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                          <feat.icon className="h-6 w-6 text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Feature Visual - Interactive Tool Cards */}
              <div className="relative">
                <div className="relative rounded-[2rem] bg-slate-800/50 border border-slate-700 p-8 shadow-3xl backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-900/80 border-slate-700 p-6 flex flex-col items-center gap-3">
                      <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
                      <span className="text-slate-200 font-bold text-xs uppercase tracking-tighter">Live Calculation</span>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "95%" }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-full bg-amber-500"
                        />
                      </div>
                    </Card>
                    <Card className="bg-slate-900/80 border-slate-700 p-6 flex flex-col items-center gap-3 translate-y-8">
                      <Beaker className="w-8 h-8 text-blue-500" />
                      <span className="text-slate-200 font-bold text-xs uppercase tracking-tighter">Experiment State</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    </Card>
                    <Card className="bg-slate-900/80 border-slate-700 p-6 flex flex-col items-center gap-3 -translate-y-4">
                      < Microscope className="w-8 h-8 text-emerald-500" />
                      <span className="text-slate-200 font-bold text-xs uppercase tracking-tighter">Circuit Valid</span>
                      <Check className="w-6 h-6 text-emerald-500" />
                    </Card>
                    <Card className="bg-slate-900/80 border-slate-700 p-6 flex flex-col items-center gap-3 translate-y-4">
                      <Lightbulb className="w-8 h-8 text-purple-500" />
                      <span className="text-slate-200 font-bold text-xs uppercase tracking-tighter">Ray Tracing</span>
                      <div className="w-full flex justify-center py-1">
                        <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                          <div className="w-px h-8 bg-blue-400 rotate-45" />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS: LAB OBSERVATIONS STYLE --- */}
        <section className="py-32 bg-white relative overflow-hidden">
          {/* Decorative scientific background elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-bold text-blue-600 mb-4 uppercase tracking-widest">
                  Scientific Impact
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Empowering Learners <span className="text-blue-600">Globally</span></h2>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Join thousands of students and educators transforming the STEM experience through active experimentation.</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  quote: "This lab turned complex circuit diagrams into something I could actually see and play with. My grades improved within weeks!",
                  author: "Sarah J.",
                  role: "High School Student",
                  status: "Verified Learner"
                },
                {
                  quote: "As a teacher, PhysicsLab has been a lifesaver for remote learning. It’s the most accurate web-based simulation I've used.",
                  author: "Dr. Marcus V.",
                  role: "Physics Professor",
                  status: "Expert Educator"
                },
                {
                  quote: "The ray tracing visualization is simply stunning. It's so much easier to explain focal lengths when you can actually see the rays bend.",
                  author: "Elena R.",
                  role: "Science Educator",
                  status: "Curriculum Lead"
                }
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Card className="p-8 h-full bg-slate-50/50 backdrop-blur-sm border-slate-200/60 rounded-[2.5rem] hover:bg-white transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] group relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <Quote className="w-12 h-12 text-blue-100 group-hover:text-blue-200 transition-colors" />
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        {t.status}
                      </div>
                    </div>

                    <p className="text-slate-700 font-bold italic mb-10 leading-relaxed text-lg">"{t.quote}"</p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center font-black text-slate-400 border border-white shadow-sm group-hover:from-blue-100 group-hover:to-blue-50 group-hover:text-blue-500 transition-all duration-500">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 leading-tight">{t.author}</div>
                        <div className="text-xs font-bold text-blue-600 tracking-wide">{t.role}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 relative overflow-hidden bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative rounded-[4rem] bg-slate-900 p-12 md:p-24 text-center overflow-hidden shadow-[0_50px_100px_-20px_rgba(30,58,138,0.4)] group"
            >
              {/* --- SCIENTIFIC BACKGROUND ELEMENTS (CSS ONLY) --- */}
              
              {/* Modern Mesh Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 opacity-90" />
              
              {/* Animated Blueprint Grid */}
              <div 
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ 
                  backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}
              />
              
              {/* Glowing High-Tech Orbs */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] -ml-48 -mb-48" />

              {/* Decorative Physics "Atomic" Rings (CSS) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none rotate-45" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 mb-8 uppercase tracking-[0.2em]"
                >
                  Ready to explore?
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                  Start Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Virtual Experiment
                  </span> <br />
                  Today.
                </h2>
                
                <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                  Join the digital frontier of STEM education. No physical equipment required—just curiosity and a browser.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/physics-lab">
                    <Button size="lg" className="h-18 px-12 text-lg font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 group/btn">
                      Get Started Free
                      <Zap className="ml-2 w-5 h-5 fill-current group-hover/btn:animate-bounce" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" className="h-18 px-12 text-lg font-black bg-white text-blue-900 hover:bg-slate-100 rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 group/guide">
                      Explore the Guide
                      <BookOpen className="ml-2 w-5 h-5 fill-current group-hover/guide:animate-pulse" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Glassy Sweep Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
