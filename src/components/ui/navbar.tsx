"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Atom, Beaker } from "@/lib/icons"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Atom className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-tight text-slate-900 leading-tight">PhysicsLab</span>
                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em] leading-tight">Virtual Laboratory</span>
                            </div>
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-1">
                            <Link href="/physics-lab" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                Experiments
                            </Link>
                            <Link href="/lab-reports" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                Lab Reports
                            </Link>
                            <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                Dashboard
                            </Link>
                            <Link href="/docs" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                Docs
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                        <Link href="/signin">
                            <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">Sign In</Button>
                        </Link>
                        <Link href="/physics-lab">
                            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-blue-500/20 gap-2">
                                <Beaker className="w-4 h-4" /> Open Lab
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
                        <Link href="/physics-lab" className="block px-3 py-2.5 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50">
                            Experiments
                        </Link>
                        <Link href="/lab-reports" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            Lab Reports
                        </Link>
                        <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            Dashboard
                        </Link>
                        <Link href="/docs" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            Docs
                        </Link>
                        <div className="pt-4 flex flex-col gap-2 border-t border-slate-200 mt-2">
                            <Link href="/signin" className="w-full">
                                <Button variant="ghost" className="w-full justify-start text-slate-600">Sign In</Button>
                            </Link>
                            <Link href="/physics-lab" className="w-full">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-2">
                                    <Beaker className="w-4 h-4" /> Open Lab
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
