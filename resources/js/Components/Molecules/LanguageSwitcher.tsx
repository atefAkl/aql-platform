import React, { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher() {
    const { locale, supported_locales } = usePage<any>().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (code: string) => {
        setIsOpen(false);
        if (code !== locale) {
            router.post('/locale', { locale: code }, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const currentLocale = supported_locales?.[locale] || supported_locales?.['ar'];

    if (!supported_locales || Object.keys(supported_locales).length < 2) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                title="تغيير لغة العرض / Change Language"
            >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline-block uppercase tracking-wider">{locale}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden"
                     style={{ [locale === 'ar' ? 'left' : 'right']: 0 }}>
                    {Object.entries(supported_locales).map(([code, lang]: [string, any]) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => handleLanguageChange(code)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-start"
                        >
                            <span className={`text-sm ${code === locale ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {lang.native_name}
                            </span>
                            {code === locale && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
