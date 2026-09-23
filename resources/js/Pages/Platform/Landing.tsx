import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Building2, 
    ShieldCheck, 
    Zap, 
    Globe, 
    Server, 
    Sparkles, 
    LayoutDashboard
} from 'lucide-react';
import { PageProps } from '../../types';
import { useTranslation } from '../../Hooks/useTranslation';
import LanguageSwitcher from '../../Components/Molecules/LanguageSwitcher';

export default function Landing() {
    const { props } = usePage<PageProps>();
    const authUser = props.auth?.user;
    const { t, locale, direction } = useTranslation();

    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') !== 'light';
        }
        return true;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Sync HTML lang and dir for SPA navigation
    useEffect(() => {
        document.documentElement.lang = (locale as string) === 'ar' ? 'ar' : 'en';
        document.documentElement.dir = (direction as string) || 'rtl';
    }, [locale, direction]);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <Head title="منصة AQL Cloud — المنصة السحابية المتقدمة لإدارة المؤسسات" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-blue-500/25">
                            AQL
                        </div>
                        <div>
                            <span className="text-lg font-black text-slate-900 dark:text-slate-100 block">منصة AQL</span>
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block -mt-1 text-start">Cloud Multi-Tenant Platform</span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {t('platform.landing.nav_features')}
                        </a>
                        <a href="#architecture" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {t('platform.landing.nav_architecture')}
                        </a>
                        <Link href="/changelog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>{t('platform.landing.nav_changelog')}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]" dir="ltr">v0.5.0</span>
                        </Link>
                    </nav>

                    {/* Actions & Theme Toggle */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />

                        {authUser ? (
                            <Link
                                href="/admin/dashboard"
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>{t('platform.nav.go_to_dashboard')}</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-sm"
                                >
                                    {t('common.actions.login')}
                                </Link>
                                <Link
                                    href="/onboarding"
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md hidden sm:flex"
                                >
                                    {t('common.actions.register')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 -z-10" />
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4 animate-fade-in border border-blue-200 dark:border-blue-800/60">
                            <Sparkles className="w-4 h-4" />
                            {t('platform.landing.hero_badge')}
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight animate-slide-up">
                            {t('platform.landing.hero_title_1')} <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                                {t('platform.landing.hero_title_2')}
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
                            {t('platform.landing.hero_subtitle')}
                        </p>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/onboarding"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
                            >
                                {t('platform.landing.action_register')}
                            </Link>
                            <Link
                                href="/changelog"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                {t('platform.landing.action_changelog')}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Core Features */}
            <section id="features" className="py-24 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                            {t('platform.landing.features_title')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t('platform.landing.features_subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {t('platform.landing.feature_1_title')}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('platform.landing.feature_1_desc')}
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {t('platform.landing.feature_2_title')}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('platform.landing.feature_2_desc')}
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {t('platform.landing.feature_3_title')}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('platform.landing.feature_3_desc')}
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-violet-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {t('platform.landing.feature_4_title')}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('platform.landing.feature_4_desc')}
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {t('platform.landing.feature_5_title')}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('platform.landing.feature_5_desc')}
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-rose-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                <Server className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {t('platform.landing.feature_6_title')}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('platform.landing.feature_6_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Overview */}
            <section id="architecture" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="max-w-2xl space-y-6">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
                                {t('platform.landing.arch_badge')}
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-black">
                                {t('platform.landing.arch_title')}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {t('platform.landing.arch_desc')}
                            </p>
                            <div className="pt-4 flex flex-wrap gap-4">
                                <Link
                                    href="/onboarding"
                                    className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md"
                                >
                                    {t('platform.landing.action_register')}
                                </Link>
                                <Link
                                    href="/changelog"
                                    className="px-6 py-3 rounded-xl bg-slate-800/80 text-white font-bold text-xs hover:bg-slate-800 transition-all border border-slate-700"
                                >
                                    {t('platform.landing.action_changelog')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                            AQL
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">
                            {t('platform.landing.footer_rights')}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 font-semibold">
                        <Link href="/onboarding" className="hover:text-blue-600 dark:hover:text-blue-400">
                            {t('platform.landing.footer_new_register')}
                        </Link>
                        <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                            {t('platform.landing.footer_login')}
                        </Link>
                        <Link href="/changelog" className="hover:text-blue-600 dark:hover:text-blue-400">
                            {t('platform.landing.footer_changelog')}
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
