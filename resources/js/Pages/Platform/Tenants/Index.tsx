import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PlatformLayout from '../../../Layouts/PlatformLayout';
import { Badge } from '../../../Components/Atoms/Badge';
import { Button } from '../../../Components/Atoms/Button';
import { StatCard } from '../../../Components/Molecules/StatCard';
import { ConfirmDialog } from '../../../Components/Molecules/ConfirmDialog';
import { Building2, CheckCircle, PauseCircle, Archive, RotateCcw, Search, ExternalLink, ShieldCheck, Clock, Trash2 } from 'lucide-react';

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
            <Head title="إدارة حسابات المؤسسات والمستأجرين" />

            <div className="space-y-6" dir="rtl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                            <Building2 className="w-6 h-6 text-emerald-500" />
                            حسابات المؤسسات والمستأجرين
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            إدارة الحالات التشغيلية للمؤسسات المفعلة (نشطة، معطلة مؤقتاً، أرشفة) وفقاً لسياسات المنصة
                        </p>
                    </div>
                </div>

                {/* Stat Overview Cards (Temporarily Hidden per Request) */}
                {/* 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="إجمالي حسابات المؤسسات"
                        value={totalCount}
                        icon={<Building2 className="w-5 h-5" />}
                        colorScheme="indigo"
                    />
                    <StatCard 
                        title="مؤسسات نشطة"
                        value={activeCount}
                        icon={<CheckCircle className="w-5 h-5" />}
                        colorScheme="emerald"
                        subtext="تشغيل كامل وبيئة متوفرة"
                    />
                    <StatCard 
                        title="موقوفة مؤقتاً (Read-Only)"
                        value={suspendedCount}
                        icon={<PauseCircle className="w-5 h-5" />}
                        colorScheme="amber"
                        subtext="قراءة فقط وحظر كتابة"
                    />
                    <StatCard 
                        title="مؤسسات مؤرشفة"
                        value={archivedCount}
                        icon={<Archive className="w-5 h-5" />}
                        colorScheme="rose"
                        subtext="حفظ بيانات متوقف"
                    />
                </div>
                */}

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {[
                                { id: 'all', label: 'كافة الحسابات', count: totalCount },
                                { id: 'active', label: 'المؤسسات النشطة', count: activeCount },
                                { id: 'suspended', label: 'الموقوفة مؤقتاً', count: suspendedCount },
                                { id: 'archived', label: 'المؤرشفة', count: archivedCount },
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
                            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="بحث باسم المؤسسة أو النطاق..."
                                className="w-full pr-9 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-right text-xs md:text-sm">
                            <thead className="bg-slate-100/70 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">اسم المؤسسة</th>
                                    <th className="px-4 py-3">النطاق الرئيسي</th>
                                    <th className="px-4 py-3">تاريخ الإنشاء</th>
                                    <th className="px-4 py-3">الحالة التشغيلية</th>
                                    <th className="px-4 py-3 text-center">إجراءات Lifecycle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredTenants.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                                             لا يوجد حسابات مؤسسات مطابقة للبحث أو التصفية الحالية.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTenants.map((t) => {
                                        const status = t.status || 'active';
                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                                                    {t.name}
                                                    <span className="block text-[10px] text-slate-400 font-mono font-normal">ID: {t.id}</span>
                                                </td>
                                                <td className="px-4 py-3.5 font-mono text-blue-600 dark:text-blue-400 text-xs">
                                                    <a 
                                                        href={`http://${t.primary_domain}`} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 hover:underline dir-ltr text-right"
                                                    >
                                                        <span>{t.primary_domain}</span>
                                                        <ExternalLink className="w-3 h-3 opacity-60" />
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                                                    {new Date(t.created_at).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <Badge variant={status}>
                                                        {status === 'active' ? 'نشط' : status === 'suspended' ? 'معطل مؤقتاً' : 'مؤرشف'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {status === 'active' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmAction({ type: 'suspend', tenant: t })}
                                                                className="p-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-all shadow-sm"
                                                                title="إيقاف مؤقت (Read-Only Mode)"
                                                            >
                                                                <PauseCircle className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {(status === 'suspended' || status === 'archived') && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmAction({ type: 'restore', tenant: t })}
                                                                className="p-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all shadow-sm"
                                                                title="استعادة للحالة النشطة"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {status === 'suspended' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmAction({ type: 'archive', tenant: t })}
                                                                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all shadow-sm"
                                                                title="أرشفة المؤسسة"
                                                            >
                                                                <Archive className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmAction({ type: 'delete', tenant: t })}
                                                            className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-sm"
                                                            title="حذف حساب المؤسسة نهائياً"
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
                        confirmAction.type === 'suspend' ? 'تأكيد إيقاف المؤسسة مؤقتاً' :
                        confirmAction.type === 'archive' ? 'تأكيد أرشفة المؤسسة' :
                        confirmAction.type === 'restore' ? 'تأكيد استعادة المؤسسة' :
                        'تأكيد حذف حساب المؤسسة'
                    }
                    description={
                        confirmAction.type === 'suspend' ? `هل أنت متأكد من إيقاف مؤسسة (${confirmAction.tenant.name}) مؤقتاً؟ ستحول المؤسسة لوضع القراءة فقط (Read-Only) ويحظر خادم المنصة أي تعديل.` :
                        confirmAction.type === 'archive' ? `هل تريد أرشفة مؤسسة (${confirmAction.tenant.name})؟ سيتم حجز الحساب للأرشيف التاريخي.` :
                        confirmAction.type === 'restore' ? `هل تريد استعادة مؤسسة (${confirmAction.tenant.name}) إلى الحالة التشغيلية النشطة (Active)؟` :
                        `هل أنت متأكد من حذف حساب مؤسسة (${confirmAction.tenant.name}) نهائياً؟ سيتم مسح بيانات المؤسسة والنطاقات وقاعدة البيانات التابعة لها بشكل كلي.`
                    }
                    confirmText={
                        confirmAction.type === 'suspend' ? 'نعم، إيقاف مؤقت' :
                        confirmAction.type === 'archive' ? 'نعم، أرشفة' :
                        confirmAction.type === 'restore' ? 'نعم، استعادة الحساب' :
                        'نعم، حذف الحساب نهائياً'
                    }
                    variant={confirmAction.type === 'archive' || confirmAction.type === 'delete' ? 'danger' : 'primary'}
                />
            )}
        </PlatformLayout>
    );
}
