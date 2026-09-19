import React, { useState, useEffect, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { PageProps } from '../types';
import { TenantSidebarNav } from '../Components/Organisms/TenantSidebarNav';

interface TenantLayoutProps {
    children: ReactNode;
    title?: string;
}

interface ToastState {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
    const { flash } = usePage<PageProps>().props;

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
                    <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 ${
                        toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40' :
                        toast.type === 'error' ? 'bg-rose-950/90 text-rose-200 border-rose-500/40' :
                        toast.type === 'warning' ? 'bg-amber-950/90 text-amber-200 border-amber-500/40' :
                        'bg-blue-950/90 text-blue-200 border-blue-500/40'
                    }`}>
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
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
                {/* Organism Sidebar Component */}
                <TenantSidebarNav darkMode={darkMode} setDarkMode={setDarkMode} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
