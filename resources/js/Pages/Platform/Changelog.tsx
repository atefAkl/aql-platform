import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Layers, 
    Sparkles, 
    GitCommit, 
    ShieldCheck, 
    Wrench, 
    CheckCircle2, 
    Building2, 
    ArrowRight, 
    Sun, 
    Moon, 
    Calendar,
    Tag,
    ChevronLeft
} from 'lucide-react';

export interface CategoryData {
    label: string;
    items: string[];
}

export interface ReleaseData {
    version: string;
    sprint: string;
    title: string;
    date: string;
    status: string;
    summary: string;
    categories: {
        added?: CategoryData;
        changed?: CategoryData;
        improved?: CategoryData;
        fixed?: CategoryData;
        architecture?: CategoryData;
        security?: CategoryData;
    };
}

interface ChangelogProps {
    releases: ReleaseData[];
    latestVersion: string;
}

export default function Changelog({ releases = [], latestVersion = 'v0.4.0' }: ChangelogProps) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark') || 
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const categoryBadges: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
        added: {
            bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
            text: 'text-emerald-700 dark:text-emerald-400',
            border: 'border-emerald-500/30',
            icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
        },
        changed: {
            bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
            text: 'text-indigo-700 dark:text-indigo-400',
            border: 'border-indigo-500/30',
            icon: <GitCommit className="w-3.5 h-3.5 text-indigo-500" />,
        },
        improved: {
            bg: 'bg-blue-500/10 dark:bg-blue-500/20',
            text: 'text-blue-700 dark:text-blue-400',
            border: 'border-blue-500/30',
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />,
        },
        fixed: {
            bg: 'bg-amber-500/10 dark:bg-amber-500/20',
            text: 'text-amber-700 dark:text-amber-400',
            border: 'border-amber-500/30',
            icon: <Wrench className="w-3.5 h-3.5 text-amber-500" />,
        },
        security: {
            bg: 'bg-rose-500/10 dark:bg-rose-500/20',
            text: 'text-rose-700 dark:text-rose-400',
            border: 'border-rose-500/30',
            icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />,
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200" dir="rtl">
            <Head title="سجل إصدارات وتحديثات المنصة - Changelog" />

            {/* Public Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/onboarding" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                                AQL
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">منصة AQL Platform</span>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">سجل التحديثات والإصدارات الرسمية</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-80 transition-all"
                            title="تغيير المظهر"
                        >
                            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                        </button>

                        <Link
                            href="/onboarding"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <span>التسجيل في المنصة</span>
                            <ChevronLeft className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Hero Banner */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-3xl text-white shadow-xl shadow-blue-500/10 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-wider dir-ltr inline-block">
                            {latestVersion}
                        </span>
                        <span className="text-xs font-semibold bg-emerald-400/20 text-emerald-100 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                            أحدث إصدار مستقر
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black">
                        سجل التحديثات والإصدارات (Release Changelog)
                    </h1>
                    
                    <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-3xl">
                        توثيق رسمي وحي لجميع التحسينات، والتغييرات المعمارية، والموديولات الجديدة، والإصلاحات التي تم إطلاقها في منصة AQL Platform مع كل سبرنت تطويري.
                    </p>
                </div>

                {/* Release Timeline */}
                <div className="space-y-8">
                    {releases.map((release, idx) => (
                        <article 
                            key={release.version}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md"
                        >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <code dir="ltr" className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono font-bold text-sm border border-blue-200 dark:border-blue-900/60 inline-block">
                                            {release.version}
                                        </code>
                                        <code dir="ltr" className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs inline-block">
                                            {release.sprint}
                                        </code>
                                        {idx === 0 && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                الإصدار الحالي
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                                        {release.title}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 shrink-0">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{new Date(release.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Release Summary */}
                            {release.summary && (
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 leading-relaxed">
                                    {release.summary}
                                </p>
                            )}

                            {/* Categorized Changes */}
                            <div className="space-y-6 pt-2">
                                {Object.entries(release.categories || {}).map(([catKey, category]) => {
                                    if (!category || !category.items || category.items.length === 0) return null;
                                    const meta = categoryBadges[catKey] || categoryBadges.added;

                                    return (
                                        <div key={catKey} className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`p-1.5 rounded-lg border ${meta.bg} ${meta.border}`}>
                                                    {meta.icon}
                                                </span>
                                                <h3 className={`text-xs sm:text-sm font-bold ${meta.text}`}>
                                                    {category.label}
                                                </h3>
                                            </div>

                                            <ul className="space-y-2 pr-6 border-r-2 border-slate-200 dark:border-slate-800">
                                                {category.items.map((item, itemIdx) => (
                                                    <li key={itemIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc list-inside">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                <div className="max-w-5xl mx-auto px-4">
                    <p>© 2026 AQL Platform. جميع الحقوق محفوظة — بنية تحتية تكاملية قوية ومستقلة.</p>
                </div>
            </footer>
        </div>
    );
}
