import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldCheck, Lock, Eye, EyeOff, Sun, Moon, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
    token: string;
    organization_name: string;
    admin_email: string;
}

export default function ActivateTenant({ token, organization_name, admin_email }: Props) {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') !== 'light';
        }
        return true;
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/activation/${token}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200 font-sans">
            <Head title={`تفعيل حساب ${organization_name} - منصة عقل`} />

            {/* Top Navigation Bar */}
            <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                        A
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">منصة عقل (AQL Platform)</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">تفعيل حساب المؤسسة</p>
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
                        href="/login"
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 px-3 py-2"
                    >
                        تسجيل الدخول
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 my-8">
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                    
                    {/* Header Info */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-2 border border-indigo-200 dark:border-indigo-800">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">تفعيل حساب المؤسسة</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            مرحباً بك! يرجى تعيين كلمة المرور الخاصة بحساب مسئول النظام لإكمال تهيئة بيئة مؤسستك
                        </p>
                    </div>

                    {/* Organization details card */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">اسم المؤسسة:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{organization_name}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">البريد الإلكتروني للـ Admin:</span>
                            <span className="font-mono text-indigo-600 dark:text-indigo-400" dir="ltr">{admin_email}</span>
                        </div>
                    </div>

                    {/* Errors Notification */}
                    {(errors as any).error && (
                        <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-800">
                            {(errors as any).error}
                        </div>
                    )}

                    {/* Activation Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                كلمة المرور الجديدة <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full ps-9 pe-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute end-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                تأكيد كلمة المرور <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full ps-9 pe-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute end-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-xs text-rose-500 mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    جاري تفعيل الحساب وتجهيز البيئة...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    تفعيل الحساب والدخول
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
                AQL Platform &copy; 2026 — All Rights Reserved. Enterprise Multi-Tenant Engine.
            </footer>
        </div>
    );
}
