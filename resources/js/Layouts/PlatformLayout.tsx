import React, { useState, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Users, ClipboardList, LogOut, CheckCircle, AlertCircle, AlertTriangle, Info, Sun, Moon, X } from 'lucide-react';
import { PageProps } from '../types';

interface PlatformLayoutProps {
    children: ReactNode;
    title?: string;
}

interface ToastState {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
    const { auth, tenant, flash } = usePage<PageProps>().props;

    // Theme Mode State (ADR-005)
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') !== 'light';
        }
        return true;
    });

    // Toast State
    const [toast, setToast] = useState<ToastState | null>(null);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Auto trigger Toast on Flash message
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Auto dismiss Toast after 5s
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
            
            {/* Top-Left Toast Notification System (ADR-005 - Opposite to RTL Right Sidebar) */}
            {toast && (
                <div className="fixed top-4 left-4 z-50 max-w-md w-full animate-bounce-short">
                    <div className={`p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 ${
                        toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 dark:bg-emerald-950/90 dark:text-emerald-200' :
                        toast.type === 'error' ? 'bg-red-950/90 text-red-200 border-red-500/40 dark:bg-red-950/90 dark:text-red-200' :
                        toast.type === 'warning' ? 'bg-amber-950/90 text-amber-200 border-amber-500/40 dark:bg-amber-950/90 dark:text-amber-200' :
                        'bg-blue-950/90 text-blue-200 border-blue-500/40'
                    }`}>
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
                            <span className="text-xs font-semibold">{toast.message}</span>
                        </div>
                        <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 transition-opacity p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0 shadow-sm">
                    <div>
                        {/* Tenant Switcher Widget */}
                        <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{tenant?.name || 'مؤسستك الشخصية'}</h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">{tenant?.id || 'tenant'}.platform.com</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                                PostgreSQL
                            </span>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-1">
                            <Link
                                href="/users"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <Users className="w-4 h-4 text-emerald-500" />
                                إدارة الموظفين والصلاحيات
                            </Link>

                            <Link
                                href="/audit"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <ClipboardList className="w-4 h-4 text-blue-500" />
                                سجل العمليات (Audit Trail)
                            </Link>
                        </nav>
                    </div>

                    {/* Footer Actions & Theme Toggle */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                        {/* Theme Mode Toggle Button (ADR-005) */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:opacity-90 transition-all shadow-sm"
                        >
                            <span className="flex items-center gap-2">
                                {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                                {darkMode ? 'المظهر الداكن (Dark)' : 'المظهر الفاتح (Light)'}
                            </span>
                            <span className="text-[10px] opacity-60">تغيير</span>
                        </button>

                        {/* Authenticated User Widget */}
                        {auth?.user && (
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{auth.user.name}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{auth.user.role_title || 'عضو الفريق'}</p>
                                    </div>
                                </div>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title="تسجيل الخروج"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
