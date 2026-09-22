import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Building2, 
    ShieldCheck, 
    Zap, 
    Layers, 
    ArrowLeft, 
    CheckCircle2, 
    Globe, 
    Lock, 
    Sparkles, 
    Sun, 
    Moon, 
    FileText, 
    Server, 
    ExternalLink,
    ChevronLeft,
    LayoutDashboard
} from 'lucide-react';
import { PageProps } from '../../types';

export default function Landing() {
    const { props } = usePage<PageProps>();
    const authUser = props.auth?.user;

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

    return (
        <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
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
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block -mt-1">Cloud Multi-Tenant Platform</span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            مميزات المنصة
                        </a>
                        <a href="#architecture" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            البنية المعمارية
                        </a>
                        <Link href="/changelog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>سجل الإصدارات</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">v0.4.0</span>
                        </Link>
                    </nav>

                    {/* Actions & Theme Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:opacity-80 transition-all"
                            title="تغيير المظهر"
                        >
                            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                        </button>

                        {authUser ? (
                            <Link
                                href="/admin/dashboard"
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>لوحة التحكم المركزية</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-sm"
                                >
                                    تسجيل الدخول
                                </Link>

                                <Link
                                    href="/onboarding"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                                >
                                    <span>تسجيل مؤسسة</span>
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    
                    {/* Release Badge Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-8 animate-fade-in shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>منصة AQL الإصدار الرابع (Sprint 3 Delivered)</span>
                        <Link href="/changelog" className="inline-flex items-center gap-1 hover:underline text-blue-700 dark:text-blue-300 font-extrabold mr-1">
                            <span>عرض التحديثات</span>
                            <ChevronLeft className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight sm:leading-tight">
                        المنصة السحابية المتقدمة لإدارة المؤسسات وتعدد المستأجرين
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        بنية تحتية متكاملة تضمن <strong className="text-blue-600 dark:text-blue-400 font-extrabold">العزل التام للبيانات والهوية</strong>، مع أداء فائق وموديولات أعمال مستقلة سهلة التجهيز والتركيب.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {authUser ? (
                            <Link
                                href="/admin/dashboard"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-3"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>الانتقال إلى لوحة التحكم المركزية</span>
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/onboarding"
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <span>ابدأ الآن — تسجيل مؤسسة جديدة</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    <span>تسجيل الدخول إلى حسابك</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Quick Trust Badges */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>قواعد بيانات معزولة (Database Per Tenant)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>نطاقات فرعية مخصصة لكل مؤسسة</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>تأمين عزل هوية المنصة والمستأجرين</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Features Section */}
            <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">مميزات المنصة المركزية</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                            مصممة لأعلى مستويات الأمان والتوسع
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                            تلتزم AQL Platform بأحدث المعايير المعمارية لتوفير بيئة عمل مستقرة لكل مؤسسة.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                عزل شامل للمؤسسات (Multi-Tenancy)
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                تحصل كل مؤسسة على بيئة تشغيل مستقلة مع قاعدة بيانات معزولة بنسبة 100% ونطاق فرعي مخصص لمنع أي تداخل في البيانات.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                موديولات أعمال قابلة للتركيب
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                معمارية قائمة على الموديولات المستقلة (Modular Architecture)، تتيح للمؤسسات تمكين التطبيقات والخدمات حسب الحاجة.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                عزل الهوية والصلاحيات
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                فصل صارم بين هويات مدراء المنصة المركزية ومستخدمي المؤسسات التشغيلية، مع حوكمة دقيقة للصلاحيات والتدقيق (Audit Logs).
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-violet-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                أداء فائق وتفاعل لحظي
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                مبنية باستخدام PHP 8.3 و Laravel 11 مع واجهات React 18 و Inertia.js v3 لتوفير سرعة استجابة فائقة بدون تعقيد SPAs.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                إدارة النطاقات وتفعيل الحسابات
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                دورة حياة منظمة لطلب التسجيل، الموافقة، إرسال رابط التفعيل الفردي، ثم تجهيز قاعدة البيانات وتفعيل المستأجر.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-rose-500/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                <Server className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                إدارة الحالات التشغيلية
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                دعم كامل للتحكم في حالة المؤسسات التشغيلية (نشطة، موقوفة مؤقتاً وضع القراءة فقط Read-Only، مؤرشفة، أو محذوفة).
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
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">البنية المعمارية المعتمدة</span>
                            <h2 className="text-2xl sm:text-4xl font-black">
                                الالتزام بالعقود والقرارات المعمارية الموثقة
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                تم بناء المنصة استناداً إلى أكثر من 24 قراراً معمارياً موثقاً (ADR) يضمن الفصل الحقيقي بين طلبات التسجيل، سجل المؤسسات المركزي، والبيئات التشغيلية المستقلة للمستأجرين.
                            </p>
                            <div className="pt-4 flex flex-wrap gap-4">
                                <Link
                                    href="/onboarding"
                                    className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md"
                                >
                                    قدم طلب تسجيل مؤسستك الآن
                                </Link>
                                <Link
                                    href="/changelog"
                                    className="px-6 py-3 rounded-xl bg-slate-800/80 text-white font-bold text-xs hover:bg-slate-800 transition-all border border-slate-700"
                                >
                                    تصفح سجل التحديثات الإداري
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
                            جميع الحقوق محفوظة © 2026 AQL Platform
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 font-semibold">
                        <Link href="/onboarding" className="hover:text-blue-600 dark:hover:text-blue-400">
                            تسجيل جديد
                        </Link>
                        <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                            تسجيل الدخول
                        </Link>
                        <Link href="/changelog" className="hover:text-blue-600 dark:hover:text-blue-400">
                            سجل التحديثات
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
