import React, { ReactNode } from 'react';

export interface StatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    colorScheme?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';
    subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    colorScheme = 'blue',
    subtext,
}) => {
    const schemeStyles = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400',
        emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
        rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400',
        indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400',
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{value}</h3>
                    {subtext && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl border ${schemeStyles[colorScheme]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
