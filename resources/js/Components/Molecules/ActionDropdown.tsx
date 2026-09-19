import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, CheckCircle2, PauseCircle, Trash2, ShieldAlert } from 'lucide-react';

export interface ActionItem {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    disabled?: boolean;
}

export interface ActionDropdownProps {
    onView?: () => void;
    onApprove?: () => void;
    onSuspend?: () => void;
    onDelete?: () => void;
    status?: string;
    isApproved?: boolean;
    isSuspended?: boolean;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
    onView,
    onApprove,
    onSuspend,
    onDelete,
    status = 'pending',
    isApproved = false,
    isSuspended = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-right" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm focus:outline-none"
                title="خيارات الإجراءات"
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-30 animate-scale-up text-xs font-medium">
                    {onView && (
                        <button
                            onClick={() => { setIsOpen(false); onView(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span>عرض التفاصيل</span>
                        </button>
                    )}

                    {onApprove && status === 'pending' && (
                        <button
                            onClick={() => { setIsOpen(false); onApprove(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>اعتماد وتفعيل</span>
                        </button>
                    )}

                    {onSuspend && (
                        <button
                            onClick={() => { setIsOpen(false); onSuspend(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                        >
                            <PauseCircle className="w-4 h-4 text-amber-500" />
                            <span>{status === 'suspended' ? 'إلغاء التعليق' : 'إيقاف / تعطيل مؤقت'}</span>
                        </button>
                    )}

                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                    {onDelete && (
                        <button
                            onClick={() => { setIsOpen(false); onDelete(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <span>حذف الطلب</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
