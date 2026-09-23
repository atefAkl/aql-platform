import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Building2, ShieldCheck, User, Mail, Lock, Eye, EyeOff, Sun, Moon, ArrowRight, Loader2 } from 'lucide-react';

export default function Onboarding({ central_domain }: { central_domain: string }) {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const { data, setData, post, processing, errors } = useForm({
        organization_name: '',
        slug: '',
        admin_name: '',
        admin_email: '',
    });

    const { flash, auth } = usePage<any>().props;

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        setData('slug', formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
            <Head title="تسجيل مؤسسة جديدة - AQL Platform" />

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
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                        title={darkMode ? 'التحويل للمظهر الفاتح' : 'التحويل للمظهر الداكن'}
                        type="button"
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                    </button>

                    <Link
                        href={auth?.user ? "/admin/dashboard" : "/login"}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-3 py-2"
                    >
                        {auth?.user ? 'لوحة التحكم' : 'تسجيل الدخول'}
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </header>

            {/* Main Form Section */}
            <main className="flex-1 flex items-center justify-center p-6 my-8">
                <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-2">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">تأسيس وتجهيز مؤسسة جديدة</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            قم بإدخال بيانات مؤسستك لطلب تسجيل بيئتك المعزولة والمستقلة على المنصة
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-xl text-sm font-medium border border-rose-200 dark:border-rose-800">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Section 1: Organization Details */}
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                بيانات المؤسسة ومساحة العمل
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        اسم المؤسسة / الشركة <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.organization_name}
                                        onChange={(e) => setData('organization_name', e.target.value)}
                                        placeholder="مثال: شركة الأفق العالمية"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.organization_name && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.organization_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        المعرف الفريد (Slug) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.slug}
                                        onChange={handleSlugChange}
                                        placeholder="مثال: acme-corp"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-end"
                                        dir="ltr"
                                    />
                                    {data.slug && (
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono" dir="ltr">
                                            النطاق: <span className="text-blue-600 dark:text-blue-400 font-semibold">{data.slug}.{central_domain}</span>
                                        </p>
                                    )}
                                    {errors.slug && <p className="text-xs text-rose-500 mt-1">{errors.slug}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Administrator User Credentials */}
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                بيانات مسئول النظام الرئيسي (Initial Administrator)
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        اسم المسئول <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                                        <input
                                            type="text"
                                            required
                                            value={data.admin_name}
                                            onChange={(e) => setData('admin_name', e.target.value)}
                                            placeholder="أحمد محمود"
                                            className="w-full ps-9 pe-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    {errors.admin_name && <p className="text-xs text-rose-500 mt-1">{errors.admin_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        البريد الإلكتروني <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                                        <input
                                            type="email"
                                            required
                                            value={data.admin_email}
                                            onChange={(e) => setData('admin_email', e.target.value)}
                                            placeholder="admin@acme.com"
                                            className="w-full ps-9 pe-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-end"
                                            dir="ltr"
                                        />
                                    </div>
                                    {errors.admin_email && <p className="text-xs text-rose-500 mt-1">{errors.admin_email}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    جاري إرسال الطلب...
                                </>
                            ) : (
                                <>
                                    <Building2 className="w-5 h-5" />
                                    إرسال طلب التسجيل
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
                AQL Platform &copy; 2026 — All Rights Reserved. Powered by Clean Multi-Tenant Architecture.
            </footer>
        </div>
    );
}
