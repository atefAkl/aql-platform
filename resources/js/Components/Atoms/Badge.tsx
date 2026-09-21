import React, { ReactNode } from 'react';

export interface BadgeProps {
    children: ReactNode;
    variant?: 'pending' | 'approved' | 'completed' | 'rejected' | 'suspended' | 'active' | 'archived' | 'default' | 'info' | string;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border transition-colors';

    const variantStyles: Record<string, string> = {
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
        approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
        completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
        rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
        active: 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
        suspended: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
        archived: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30',
        info: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30',
        default: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30',
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
                variant === 'pending' ? 'bg-amber-500 animate-pulse' :
                variant === 'approved' ? 'bg-emerald-500' :
                (variant === 'completed' || variant === 'active') ? 'bg-blue-500' :
                (variant === 'rejected' || variant === 'suspended') ? 'bg-rose-500' : 'bg-slate-400'
            }`} />
            {children}
        </span>
    );
};

