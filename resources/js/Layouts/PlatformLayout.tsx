import React, { useState, useEffect, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '../types';
import { SidebarNav } from '../Components/Organisms/SidebarNav';
import { ToastContainer } from '../Components/Molecules/ToastContainer';

interface PlatformLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
    const { direction, locale } = usePage<PageProps>().props;

    // Theme Mode State (ADR-005)
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
        <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir={(direction as string) || 'rtl'}>
            
            {/* Centralized Toast Notification System */}
            <ToastContainer />

            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Organism Sidebar Component */}
                <SidebarNav darkMode={darkMode} setDarkMode={setDarkMode} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
