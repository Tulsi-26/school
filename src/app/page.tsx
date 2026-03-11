"use client"

import Link from "next/link"
import { ArrowRight, Check, Play, Zap, Beaker, Lightbulb, Microscope, Quote, Globe, BookOpen, Clock, PenTool } from "lucide-react"
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
        <section className="relative pt-32 pb-24 flex items-center min-h-[85vh] overflow-hidden bg-slate-50/50">
          {/* Background Image for Text Area */}
          <div className="absolute inset-0 -z-30">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.12 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
              alt="Physics Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white/40 to-white" />

            {/* Decorative Grid Overlay */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.3] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Glowing Orbs for physics vibe */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
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
                <Link href="/docs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 h-16 bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95">
                    <Play className="w-5 h-5 fill-slate-700" /> Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- VIDEO PREVIEW SECTION --- */}
        <section className="pb-40 pt-10 bg-white relative overflow-hidden">
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
              <div className="aspect-[16/10] rounded-[2.5rem] bg-slate-900 flex items-center justify-center overflow-hidden relative border border-slate-800 shadow-2xl group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                  alt="Physics Laboratory" 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" 
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping -z-10" />
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse -z-10" style={{ animationDuration: '3s' }} />
                    
                    <div className="p-8 rounded-full bg-blue-600 border border-white/30 shadow-[0_0_50px_-10px_rgba(37,99,235,0.6)] group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                      <Play className="w-14 h-14 text-white fill-white ml-2" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom Badge */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl">
                    <p className="text-white text-sm font-bold tracking-wide uppercase">Virtual Lab Tour</p>
                    <p className="text-blue-200 text-xs">Watch the 2-minute walkthrough</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="py-20 relative bg-white border-y border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { val: "100%", label: "Curriculum Aligned", icon: Check },
                { val: "4+", label: "Physics Domains", icon: Globe },
                { val: "Real-time", label: "Simulation Engine", icon: Zap },
                { val: "24/7", label: "Accessible Anywhere", icon: Clock }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-4xl font-black text-slate-900 mb-1">{stat.val}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
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

        {/* --- TESTIMONIALS --- */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Empowering Learners Globally</h2>
              <p className="text-slate-500 font-medium">Join thousands of students and educators transforming the STEM experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "This lab turned complex circuit diagrams into something I could actually see and play with. My grades improved within weeks!",
                  author: "Sarah J.",
                  role: "High School Student"
                },
                {
                  quote: "As a teacher, PhysicsLab has been a lifesaver for remote learning. It’s the most accurate web-based simulation I've used.",
                  author: "Dr. Marcus V.",
                  role: "Physics Professor"
                },
                {
                  quote: "The ray tracing visualization is simply stunning. It's so much easier to explain focal lengths when you can actually see the rays bend.",
                  author: "Elena R.",
                  role: "Science Educator"
                }
              ].map((t, i) => (
                <Card key={i} className="p-8 border-slate-100 bg-slate-50/50 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                  <Quote className="w-10 h-10 text-blue-200 mb-6" />
                  <p className="text-slate-700 font-medium italic mb-8 leading-relaxed">"{t.quote}"</p>
                  <div>
                    <div className="font-black text-slate-900">{t.author}</div>
                    <div className="text-sm font-bold text-blue-600">{t.role}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 relative overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 md:p-20 text-center overflow-hidden shadow-[0_40px_80px_-20px_rgba(59,130,246,0.5)]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                  Start Your Virtual <br /> Experiment Today
                </h2>
                <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                  No equipment? No Problem. Access the full laboratory experience from any browser, at any time.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/physics-lab">
                    <Button size="lg" className="h-16 px-12 text-lg font-bold bg-white text-blue-700 hover:bg-blue-50 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" variant="outline" className="h-16 px-12 text-lg font-bold text-white border-white/30 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 active:scale-95">
                      Read the Guide
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
