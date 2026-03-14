import Link from "next/link"
import { Atom } from "@/lib/icons"
import { useLanguage } from "@/context/LanguageContext"

export function Footer() {
    const { t } = useLanguage();
    
    return (
        <footer className="bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href="/physics-lab" className="text-slate-400 hover:text-blue-600 text-sm transition-colors">
                        {t('footer.experiments')}
                    </Link>
                    <Link href="/lab-reports" className="text-slate-400 hover:text-blue-600 text-sm transition-colors">
                        {t('footer.reports')}
                    </Link>
                    <Link href="/dashboard" className="text-slate-400 hover:text-blue-600 text-sm transition-colors">
                        {t('footer.dashboard')}
                    </Link>
                    <Link href="/templates" className="text-slate-400 hover:text-blue-600 text-sm transition-colors">
                        {t('footer.templates')}
                    </Link>
                    <Link href="/docs" className="text-slate-400 hover:text-blue-600 text-sm transition-colors">
                        {t('footer.docs')}
                    </Link>
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                    <div className="flex items-center justify-center md:justify-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <Atom className="w-3.5 h-3.5 text-white" />
                        </div>
                        <p className="text-sm text-slate-400">
                            &copy; {new Date().getFullYear()} {t('footer.copyright')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
