import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PlatformLayout from '../../../Layouts/PlatformLayout';
import { Badge } from '../../../Components/Atoms/Badge';
import { Button } from '../../../Components/Atoms/Button';
import { StatCard } from '../../../Components/Molecules/StatCard';
import { ConfirmDialog } from '../../../Components/Molecules/ConfirmDialog';
import { Database, Server, PauseCircle, Archive, RotateCcw, Search, ExternalLink, Trash2, PlayCircle } from 'lucide-react';
import { useTranslation } from '../../../Hooks/useTranslation';

export interface TenantAccountData {
    id: string;
    name: string;
    status: 'active' | 'suspended' | 'archived' | string;
    created_at: string;
    domains: string[];
    primary_domain: string;
}

interface IndexProps {
    tenants: TenantAccountData[];
    currentFilter: string;
}

export default function TenantAccountsIndex({ tenants, currentFilter = 'all' }: IndexProps) {
    const { t, locale } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmAction, setConfirmAction] = useState<{
        type: 'suspend' | 'archive' | 'restore' | 'delete';
        tenant: TenantAccountData;
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Compute Stats
    const totalCount = tenants.length;
    const activeCount = tenants.filter(t => t.status === 'active' || !t.status).length;
    const suspendedCount = tenants.filter(t => t.status === 'suspended').length;
    const archivedCount = tenants.filter(t => t.status === 'archived').length;

    // Filter Logic
    const filteredTenants = tenants.filter(t => {
        const matchesFilter = 
            currentFilter === 'all' || 
            (currentFilter === 'active' && (t.status === 'active' || !t.status)) ||
            t.status === currentFilter;
        
        const matchesSearch = 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.primary_domain.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const handleFilterChange = (filter: string) => {
        router.get('/admin/tenants', filter === 'all' ? {} : { status: filter }, { preserveState: true });
    };

    const handleExecuteAction = () => {
        if (!confirmAction) return;
        setIsSubmitting(true);

        const { type, tenant } = confirmAction;

        if (type === 'suspend') {
            router.post(`/admin/tenants/${tenant.id}/suspend`, {}, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        } else if (type === 'archive') {
            router.post(`/admin/tenants/${tenant.id}/archive`, {}, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        } else if (type === 'restore') {
            router.post(`/admin/tenants/${tenant.id}/restore`, {}, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        } else if (type === 'delete') {
            router.delete(`/admin/tenants/${tenant.id}`, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        }
    };

    return (
        <PlatformLayout>
            <Head title={t('platform.tenants.title')} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Database className="w-6 h-6 text-blue-500" />
                        {t('platform.tenants.header_title')}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('platform.tenants.header_subtitle')}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                
                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard 
                        title={t('platform.tenants.stats.total')}
                        value={totalCount}
                        icon={<Database className="w-4 h-4" />}
                        color="indigo"
                    />
                    <StatCard 
                        title={t('platform.tenants.stats.active')}
                        value={activeCount}
                        subtext={t('platform.tenants.stats.active_subtext')}
                        icon={<Server className="w-4 h-4" />}
                        color="emerald"
                    />
                    <StatCard 
                        title={t('platform.tenants.stats.suspended')}
                        value={suspendedCount}
                        subtext={t('platform.tenants.stats.suspended_subtext')}
                        icon={<PauseCircle className="w-4 h-4" />}
                        color="amber"
                    />
                    <StatCard 
                        title={t('platform.tenants.stats.archived')}
                        value={archivedCount}
                        subtext={t('platform.tenants.stats.archived_subtext')}
                        icon={<Archive className="w-4 h-4" />}
                        color="slate"
                    />
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {[
                                { id: 'all', label: t('platform.tenants.tabs.all'), count: totalCount },
                                { id: 'active', label: t('platform.tenants.tabs.active'), count: activeCount },
                                { id: 'suspended', label: t('platform.tenants.tabs.suspended'), count: suspendedCount },
                                { id: 'archived', label: t('platform.tenants.tabs.archived'), count: archivedCount },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleFilterChange(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                        currentFilter === tab.id
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                        currentFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('platform.tenants.search_placeholder')}
                                className="w-full ps-9 pe-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-start text-xs md:text-sm">
                            <thead className="bg-slate-100/70 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">{t('platform.tenants.table.name')}</th>
                                    <th className="px-4 py-3">{t('platform.tenants.table.domain')}</th>
                                    <th className="px-4 py-3">{t('platform.tenants.table.date')}</th>
                                    <th className="px-4 py-3">{t('platform.tenants.table.status')}</th>
                                    <th className="px-4 py-3 text-center">{t('platform.tenants.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredTenants.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                                            {t('platform.tenants.table.empty')}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTenants.map((tenant) => {
                                        const status = tenant.status || 'active';
                                        return (
                                            <tr key={tenant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                                                    {tenant.name}
                                                    <span className="block text-[10px] text-slate-400 font-mono font-normal">ID: {tenant.id}</span>
                                                </td>
                                                <td className="px-4 py-3.5 font-mono text-blue-600 dark:text-blue-400 text-xs">
                                                    <a 
                                                        href={`http://${tenant.primary_domain}`} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 hover:underline text-start"
                                                        dir="ltr"
                                                    >
                                                        <span>{tenant.primary_domain}</span>
                                                        <ExternalLink className="w-3 h-3 opacity-60" />
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                                                    {new Date(tenant.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <Badge variant={status}>
                                                        {t(`platform.tenants.status.${status}`)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {status === 'active' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmAction({ type: 'suspend', tenant: tenant })}
                                                                className="p-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-all shadow-sm"
                                                                title={t('platform.tenants.actions.suspend_title')}
                                                            >
                                                                <PauseCircle className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {(status === 'suspended' || status === 'archived') && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmAction({ type: 'restore', tenant: tenant })}
                                                                className="p-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all shadow-sm"
                                                                title={t('platform.tenants.actions.restore_title')}
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {status !== 'archived' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmAction({ type: 'archive', tenant: tenant })}
                                                                className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all shadow-sm"
                                                                title={t('platform.tenants.actions.archive_title')}
                                                            >
                                                                <Archive className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmAction({ type: 'delete', tenant: tenant })}
                                                            className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all shadow-sm"
                                                            title={t('platform.tenants.actions.delete_title')}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog Modal */}
            {confirmAction && (
                <ConfirmDialog 
                    isOpen={true}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={handleExecuteAction}
                    isLoading={isSubmitting}
                    title={
                        confirmAction.type === 'suspend' ? t('platform.tenants.confirm.suspend_title') :
                        confirmAction.type === 'archive' ? t('platform.tenants.confirm.archive_title') :
                        confirmAction.type === 'restore' ? t('platform.tenants.confirm.restore_title') :
                        t('platform.tenants.confirm.delete_title')
                    }
                    description={
                        confirmAction.type === 'suspend' ? t('platform.tenants.confirm.suspend_message').replace(':name', confirmAction.tenant.name) :
                        confirmAction.type === 'archive' ? t('platform.tenants.confirm.archive_message').replace(':name', confirmAction.tenant.name) :
                        confirmAction.type === 'restore' ? t('platform.tenants.confirm.restore_message').replace(':name', confirmAction.tenant.name) :
                        t('platform.tenants.confirm.delete_message').replace(':name', confirmAction.tenant.name)
                    }
                    confirmText={
                        confirmAction.type === 'suspend' ? t('platform.tenants.confirm.suspend_confirm') :
                        confirmAction.type === 'archive' ? t('platform.tenants.confirm.archive_confirm') :
                        confirmAction.type === 'restore' ? t('platform.tenants.confirm.restore_confirm') :
                        t('platform.tenants.confirm.delete_confirm')
                    }
                    variant={confirmAction.type === 'archive' || confirmAction.type === 'delete' ? 'danger' : 'primary'}
                />
            )}
        </PlatformLayout>
    );
}
