import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PlatformLayout from '../../../Layouts/PlatformLayout';
import { Badge } from '../../../Components/Atoms/Badge';
import { Button } from '../../../Components/Atoms/Button';
import { StatCard } from '../../../Components/Molecules/StatCard';
import { ActionDropdown } from '../../../Components/Molecules/ActionDropdown';
import { ConfirmDialog } from '../../../Components/Molecules/ConfirmDialog';
import { RegistrationRequestDetailsModal, RegistrationRequestData } from '../../../Components/Organisms/RegistrationRequestDetailsModal';
import { Building2, Clock, CheckCircle, Ban, Search, Filter, ShieldAlert, Plus } from 'lucide-react';

interface IndexProps {
    requests: RegistrationRequestData[];
    currentFilter: string;
}

export default function RegistrationRequestsIndex({ requests, currentFilter = 'all' }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequestData | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    
    // Confirm Dialog State
    const [confirmAction, setConfirmAction] = useState<{
        type: 'approve' | 'reject' | 'delete';
        request: RegistrationRequestData;
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Compute Stats
    const totalCount = requests.length;
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;

    // Filter Logic
    const filteredRequests = requests.filter(r => {
        const matchesFilter = 
            currentFilter === 'all' || 
            r.status === currentFilter;
        
        const matchesSearch = 
            r.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.admin_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const handleFilterChange = (filter: string) => {
        router.get('/admin/requests', filter === 'all' ? {} : { status: filter }, { preserveState: true });
    };

    const handleExecuteAction = () => {
        if (!confirmAction) return;
        setIsSubmitting(true);

        const { type, request } = confirmAction;

        if (type === 'approve') {
            router.post(`/admin/requests/${request.id}/approve`, {}, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        } else if (type === 'reject') {
            router.post(`/admin/requests/${request.id}/reject`, {}, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        } else if (type === 'delete') {
            router.delete(`/admin/requests/${request.id}`, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmAction(null);
                }
            });
        }
    };


    return (
        <PlatformLayout>
            <Head title="إدارة طلبات تسجيل المؤسسات" />

            <div className="space-y-6" dir="rtl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                            <Building2 className="w-6 h-6 text-blue-500" />
                            طلبات تسجيل المؤسسات والمستأجرين
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            عرض وإدارة وتفعيل أو تعطيل طلبات التسجيل المقدمة للإنضمام إلى منصة AQL Platform
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => router.get('/onboarding')}
                        >
                            <Plus className="w-4 h-4" />
                            <span>طلب تسجيل جديد</span>
                        </Button>
                    </div>
                </div>

                {/* Stat Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="إجمالي الطلبات"
                        value={totalCount}
                        icon={<Building2 className="w-5 h-5" />}
                        colorScheme="indigo"
                    />
                    <StatCard 
                        title="طلبات قيد الانتظار"
                        value={pendingCount}
                        icon={<Clock className="w-5 h-5" />}
                        colorScheme="amber"
                        subtext="بانتظار موافقة الإدارة"
                    />
                    <StatCard 
                        title="طلبات بانتظار التفعيل"
                        value={approvedCount}
                        icon={<CheckCircle className="w-5 h-5" />}
                        colorScheme="emerald"
                        subtext="تم التفعيل وإرسال الرابط"
                    />
                    <StatCard 
                        title="مؤسسات تم تفعيلها"
                        value={completedCount}
                        icon={<CheckCircle className="w-5 h-5" />}
                        colorScheme="emerald"
                        subtext="تم التجهيز والتشغيل"
                    />
                    <StatCard 
                        title="طلبات مرفوضة"
                        value={rejectedCount}
                        icon={<Ban className="w-5 h-5" />}
                        colorScheme="rose"
                        subtext="مرفوضة نهائياً"
                    />
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {[
                                { id: 'all', label: 'كافة الطلبات', count: totalCount },
                                { id: 'pending', label: 'قيد الانتظار', count: pendingCount },
                                { id: 'approved', label: 'بانتظار التفعيل', count: approvedCount },
                                { id: 'completed', label: 'مكتملة', count: completedCount },
                                { id: 'rejected', label: 'مرفوضة', count: rejectedCount },
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
                                placeholder="بحث باسم المؤسسة، Slug، أو البريد..."
                                className="w-full pr-9 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-right text-xs md:text-sm">
                            <thead className="bg-slate-100/70 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">المؤسسة</th>
                                    <th className="px-4 py-3">النطاق (Slug)</th>
                                    <th className="px-4 py-3">المدير الرئيسي</th>
                                    <th className="px-4 py-3">تاريخ الطلب</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                                             لا يوجد طلبات تسجيل مطابقة للبحث أو التصفية الحالية.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                                                {req.organization_name}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-blue-600 dark:text-blue-400 text-xs dir-ltr text-right">
                                                {req.slug}.aql-platform.local
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">{req.admin_name}</div>
                                                <div className="text-[11px] text-slate-400 font-mono">{req.admin_email}</div>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                                                {new Date(req.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <Badge variant={req.status}>
                                                    {req.status === 'pending' ? 'قيد الانتظار' : req.status === 'approved' ? 'بانتظار التفعيل' : req.status === 'completed' ? 'مكتمل' : 'مرفوض'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <ActionDropdown 
                                                    status={req.status}
                                                    onView={() => {
                                                        setSelectedRequest(req);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                    onApprove={req.status === 'pending' ? () => setConfirmAction({ type: 'approve', request: req }) : undefined}
                                                    onReject={req.status === 'pending' ? () => setConfirmAction({ type: 'reject', request: req }) : undefined}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <RegistrationRequestDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                request={selectedRequest}
                onApprove={(req) => setConfirmAction({ type: 'approve', request: req })}
                onReject={(req) => setConfirmAction({ type: 'reject', request: req })}
            />

            {/* Confirmation Dialog Modal */}
            {confirmAction && (
                <ConfirmDialog 
                    isOpen={true}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={handleExecuteAction}
                    isLoading={isSubmitting}
                    title={
                        confirmAction.type === 'approve' ? 'تأكيد اعتماد وتفعيل الطلب' :
                        confirmAction.type === 'reject' ? 'تأكيد رفض الطلب' :
                        'تأكيد الإجراء'
                    }
                    description={
                        confirmAction.type === 'approve' ? `هل أنت متأكد من موافقتك على طلب تسجيل مؤسسة (${confirmAction.request.organization_name}) وتوليد رابط التفعيل؟` :
                        confirmAction.type === 'reject' ? `هل تريد حقاً رفض طلب تسجيل مؤسسة (${confirmAction.request.organization_name})؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.` :
                        `تأكيد الإجراء`
                    }
                    confirmText={
                        confirmAction.type === 'approve' ? 'نعم، اعتماد الطلب' :
                        confirmAction.type === 'reject' ? 'نعم، رفض الطلب' :
                        'تأكيد'
                    }
                    variant={confirmAction.type === 'reject' ? 'danger' : 'primary'}
                />
            )}
        </PlatformLayout>
    );
}

