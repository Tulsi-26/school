"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Atom, Beaker } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/LanguageContext"
import { Globe } from "@/lib/icons"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { data: session } = useSession()
    const { language, setLanguage, t } = useLanguage()

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
                                {t('nav.experiments')}
                            </Link>
                            <Link href="/lab-reports" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                {t('nav.labReports')}
                            </Link>
                            <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                {t('nav.dashboard')}
                            </Link>
                            <Link href="/docs" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                {t('nav.docs')}
                            </Link>
                            <Link href="/templates" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50">
                                {t('nav.templates')}
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                        <Link href="/physics-lab">
                            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-blue-500/20 gap-2">
                                <Beaker className="w-4 h-4" /> {t('nav.openLab')}
                            </Button>
                        </Link>

                        {/* Language Switcher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-600">
                                    <Globe className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={language} onValueChange={(v) => setLanguage(v as any)}>
                                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="gu">ગુજરાતી</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                            <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                            {session.user?.role === "OWNER" && (
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mt-1">School Owner</p>
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href="/dashboard/profile">
                                        <DropdownMenuItem className="cursor-pointer">
                                            {t('nav.profile')}
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                                        {t('nav.logOut')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/signin">
                                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">{t('nav.signIn')}</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5">{t('nav.signUp')}</Button>
                                </Link>
                            </div>
                        )}
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
                        {session && (
                            <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100 mb-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900">{session.user?.name}</span>
                                    <span className="text-xs text-slate-500">{session.user?.email}</span>
                                </div>
                            </div>
                        )}
                        <Link href="/physics-lab" className="block px-3 py-2.5 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50">
                            {t('nav.experiments')}
                        </Link>
                        <Link href="/lab-reports" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            {t('nav.labReports')}
                        </Link>
                        <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            {t('nav.dashboard')}
                        </Link>
                        <Link href="/docs" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            {t('nav.docs')}
                        </Link>
                        <Link href="/templates" className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            {t('nav.templates')}
                        </Link>
                        <div className="flex items-center gap-4 px-3 py-2 border-y border-slate-100 my-2">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('nav.language')}</span>
                             <div className="flex gap-2">
                                 <button 
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1 text-xs font-bold rounded-full border ${language === 'en' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}
                                 >EN</button>
                                 <button 
                                    onClick={() => setLanguage('gu')}
                                    className={`px-3 py-1 text-xs font-bold rounded-full border ${language === 'gu' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}
                                 >GU</button>
                             </div>
                        </div>
                        <div className="pt-4 flex flex-col gap-2 border-t border-slate-200 mt-2">
                            {session ? (
                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut()}>
                                    {t('nav.logOut')}
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link href="/signin" className="w-full">
                                        <Button variant="ghost" className="w-full justify-start text-slate-600">{t('nav.signIn')}</Button>
                                    </Link>
                                    <Link href="/signup" className="w-full">
                                        <Button className="w-full bg-slate-900 text-white">{t('nav.signUp')}</Button>
                                    </Link>
                                </div>
                            )}
                            <Link href="/physics-lab" className="w-full">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-2">
                                    <Beaker className="w-4 h-4" /> {t('nav.openLab')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
