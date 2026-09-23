import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building2, Clock, CheckCircle, PauseCircle, Users, LayoutDashboard, ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import PlatformLayout from '../../Layouts/PlatformLayout';
import { StatCard } from '../../Components/Molecules/StatCard';
import { Button } from '../../Components/Atoms/Button';
import { useTranslation } from '../../Hooks/useTranslation';

interface Stats {
    total_tenants: number;
    active_tenants: number;
    pending_requests: number;
    approved_requests: number;
    suspended_requests: number;
    platform_users: number;
}

interface Props {
    stats: Stats;
}

export default function Dashboard({ stats }: Props) {
    const { t } = useTranslation();

    return (
        <PlatformLayout>
            <Head title={t('platform.dashboard.title')} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                        {t('platform.dashboard.title')}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('platform.dashboard.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Link href="/">
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Globe className="w-4 h-4 text-indigo-500" />
                            <span>{t('platform.nav.go_to_dashboard')}</span>
                        </Button>
                    </Link>
                    <Link href="/admin/requests">
                        <Button variant="primary" size="sm" className="gap-2">
                            <span>{t('platform.nav.requests')}</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Clean Main Content Placeholder for Future Admin Widgets */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center border-dashed">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {t('platform.dashboard.title')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t('platform.dashboard.subtitle')}
                    </p>
                </div>
            </div>
        </PlatformLayout>
    );
}
