import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, CheckCircle2, PauseCircle, Trash2, Ban } from 'lucide-react';
import { useTranslation } from '../../Hooks/useTranslation';

export interface ActionDropdownProps {
    onView?: () => void;
    onApprove?: () => void;
    onSuspend?: () => void;
    onReject?: () => void;
    onDelete?: () => void;
    status?: string;
    isApproved?: boolean;
    isSuspended?: boolean;
    mode?: 'horizontal' | 'dropdown';
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
    onView,
    onApprove,
    onSuspend,
    onReject,
    onDelete,
    status = 'pending',
    mode = 'horizontal',
}) => {
    const { t } = useTranslation();
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

    // Horizontal Inline Layout
    if (mode === 'horizontal') {
        return (
            <div className="flex items-center justify-center gap-1.5">
                {onView && (
                    <button
                        type="button"
                        onClick={onView}
                        className="p-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-sm"
                        title={t('common.actions.view_details')}
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                )}

                {onApprove && status === 'pending' && (
                    <button
                        type="button"
                        onClick={onApprove}
                        className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-sm"
                        title={t('platform.actions.approve')}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                )}

                {onReject && status === 'pending' && (
                    <button
                        type="button"
                        onClick={onReject}
                        className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-sm"
                        title={t('platform.actions.reject')}
                    >
                        <Ban className="w-4 h-4" />
                    </button>
                )}

                {onSuspend && (
                    <button
                        type="button"
                        onClick={onSuspend}
                        className={`p-2 rounded-xl border transition-all shadow-sm ${
                            status === 'suspended'
                                ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                                : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                        }`}
                        title={status === 'suspended' ? t('platform.actions.unsuspend') : t('platform.actions.suspend')}
                    >
                        <PauseCircle className="w-4 h-4" />
                    </button>
                )}

                {onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-sm"
                        title={t('platform.actions.delete')}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    }

    // Dropdown Layout with Smart Dropup Positioning (Option 1)
    return (
        <div className="relative inline-block text-start" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm focus:outline-none"
                title={t('common.actions.options')}
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute end-0 bottom-full mb-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50 animate-scale-up text-xs font-medium">
                    {onView && (
                        <button
                            onClick={() => { setIsOpen(false); onView(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span>{t('common.actions.view_details')}</span>
                        </button>
                    )}

                    {onApprove && status === 'pending' && (
                        <button
                            onClick={() => { setIsOpen(false); onApprove(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>{t('platform.actions.approve')}</span>
                        </button>
                    )}

                    {onReject && status === 'pending' && (
                        <button
                            onClick={() => { setIsOpen(false); onReject(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                            <Ban className="w-4 h-4 text-rose-500" />
                            <span>{t('platform.actions.reject')}</span>
                        </button>
                    )}

                    {onSuspend && (
                        <button
                            onClick={() => { setIsOpen(false); onSuspend(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                        >
                            <PauseCircle className="w-4 h-4 text-amber-500" />
                            <span>{status === 'suspended' ? t('platform.actions.unsuspend') : t('platform.actions.suspend')}</span>
                        </button>
                    )}

                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                    {onDelete && (
                        <button
                            onClick={() => { setIsOpen(false); onDelete(); }}
                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <span>{t('platform.actions.delete')}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

