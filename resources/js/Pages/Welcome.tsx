import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, ArrowRight } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<any>().props;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
            <Head title="مرحباً بك في AQL Platform" />

            {/* Top Navigation Bar */}
            <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                        A
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">AQL Platform</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Multi-Tenant SaaS</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={auth?.user ? "/admin/dashboard" : "/login"}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-3 py-2"
                    >
                        {auth?.user ? 'لوحة التحكم' : 'تسجيل الدخول'}
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-3xl space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm mb-4 border border-blue-100 dark:border-blue-800">
                        <Building2 className="w-4 h-4" />
                        المنصة السحابية المتكاملة
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                        أدر مؤسستك بذكاء <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-600">
                            في بيئة معزولة وآمنة
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        منصة AQL Platform توفر لك مساحة عمل مستقلة ومتكاملة لإدارة مواردك، موظفيك، وتقاريرك المالية بكفاءة عالية وأمان تام وفق أعلى المعايير.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/onboarding"
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Building2 className="w-5 h-5" />
                            تأسيس مؤسسة جديدة
                        </Link>
                        <Link
                            href={auth?.user ? "/admin/dashboard" : "/login"}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-lg border-2 border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center"
                        >
                            {auth?.user ? 'الذهاب للوحة التحكم' : 'تسجيل الدخول للنظام'}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
