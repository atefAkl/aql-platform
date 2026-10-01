import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import PlatformLayout from '../../../Layouts/PlatformLayout';
import { CreditCard, Plus, Edit3, Users, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react';
import { PageProps } from '../../../types';

export interface PlanData {
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    status: string;
    subscriptions_count?: number;
    created_at?: string;
}

interface IndexProps {
    plans: PlanData[];
}

export default function Index({ plans }: IndexProps) {
    const { flash } = usePage<PageProps & { flash: { requires_price_change_confirmation?: boolean } }>().props;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
    const [warningModalPlan, setWarningModalPlan] = useState<PlanData | null>(null);

    // Form for Create Plan
    const createForm = useForm({
        name: '',
        description: '',
        price: '',
    });

    // Form for Edit Plan
    const editForm = useForm({
        name: '',
        description: '',
        price: '',
        confirm_price_change: false,
    });

    // Watch for backend warning confirmation requirement
    useEffect(() => {
        if (flash?.requires_price_change_confirmation && editingPlan) {
            setWarningModalPlan(editingPlan);
        }
    }, [flash, editingPlan]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/plans', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (plan: PlanData) => {
        setEditingPlan(plan);
        setWarningModalPlan(null);
        editForm.setData({
            name: plan.name,
            description: plan.description || '',
            price: plan.price.toString(),
            confirm_price_change: false,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;

        editForm.put(`/admin/plans/${editingPlan.id}`, {
            onSuccess: () => {
                if (!editForm.data.confirm_price_change) {
                    setEditingPlan(null);
                    setWarningModalPlan(null);
                }
            },
        });
    };

    const handleConfirmWarningAndContinue = () => {
        if (!warningModalPlan) return;

        editForm.setData('confirm_price_change', true);
        
        editForm.put(`/admin/plans/${warningModalPlan.id}`, {
            data: {
                ...editForm.data,
                confirm_price_change: true,
            },
            onSuccess: () => {
                setEditingPlan(null);
                setWarningModalPlan(null);
                editForm.reset();
            },
        });
    };

    const handleCancelWarning = () => {
        setWarningModalPlan(null);
        editForm.setData('confirm_price_change', false);
    };

    return (
        <PlatformLayout>
            <Head title="إدارة خطط الاشتراك - Platform Admin" />

            <div className="space-y-6">
                {/* Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                خطط الاشتراك (Subscription Plans)
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                إدارة باقات وأسعار اشتراكات المنصة المتاحة للمؤسسات والمستأجرين
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
                        type="button"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة خطة جديدة</span>
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm hover:border-blue-500/40 transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{plan.name}</h3>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle className="w-3 h-3" />
                                            نشط
                                        </span>
                                    </div>
                                    <div className="text-end">
                                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                            ${parseFloat(plan.price.toString()).toFixed(2)}
                                        </span>
                                        <span className="text-xs text-slate-400 block font-medium">/شهرياً</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[40px]">
                                    {plan.description || 'لا يوجد وصف مضاف لهذه الخطة.'}
                                </p>

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span>المشتركون الحاليون:</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                        {plan.subscriptions_count || 0} مؤسسة
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleEditOpen(plan)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                                type="button"
                            >
                                <Edit3 className="w-4 h-4 text-blue-500" />
                                <span>تعديل الخطة</span>
                            </button>
                        </div>
                    ))}

                    {plans.length === 0 && (
                        <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
                            <CreditCard className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">لا توجد خطط اشتراك مسجلة</h3>
                            <p className="text-xs text-slate-500">قم بإضافة خطة اشتراك جديدة لإتاحة الباقات للمؤسسات والمستأجرين.</p>
                        </div>
                    )}
                </div>

                {/* Create Plan Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-fade-in">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-blue-500" />
                                    إضافة خطة اشتراك جديدة
                                </h3>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    type="button"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        اسم الخطة <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="مثال: الخطة المتقدمة (Pro Plan)"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-xs text-rose-500 mt-1">{createForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        الوصف
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        placeholder="وصف مميزات الخطة والحدود المتاحة..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {createForm.errors.description && (
                                        <p className="text-xs text-rose-500 mt-1">{createForm.errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        السعر الشهري ($) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={createForm.data.price}
                                        onChange={(e) => createForm.setData('price', e.target.value)}
                                        placeholder="99.00"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                        dir="ltr"
                                    />
                                    {createForm.errors.price && (
                                        <p className="text-xs text-rose-500 mt-1">{createForm.errors.price}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                    >
                                        {createForm.processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        <span>حفظ الخطة</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Plan Modal */}
                {editingPlan && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-fade-in">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Edit3 className="w-5 h-5 text-blue-500" />
                                    تعديل خطة الاشتراك ({editingPlan.name})
                                </h3>
                                <button
                                    onClick={() => setEditingPlan(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    type="button"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Warning Prompt inside Edit Modal if Price change warning triggered */}
                            {warningModalPlan && (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-3 animate-fade-in">
                                    <div className="flex items-start gap-2.5">
                                        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-xs">تنبيه تغيير سعر الخطة</h4>
                                            <p className="text-xs leading-relaxed opacity-90">
                                                تغيير سعر هذه الخطة قد يؤثر على المشتركين الحاليين ({warningModalPlan.subscriptions_count || 0} مؤسسة). هل ترغب في المتابعة وتأكيد السعر الجديد؟
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={handleCancelWarning}
                                            className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/20"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleConfirmWarningAndContinue}
                                            disabled={editForm.processing}
                                            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow"
                                        >
                                            {editForm.processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'متابعة وتأكيد'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        اسم الخطة <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-xs text-rose-500 mt-1">{editForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        الوصف
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {editForm.errors.description && (
                                        <p className="text-xs text-rose-500 mt-1">{editForm.errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        السعر الشهري ($) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                        dir="ltr"
                                    />
                                    {editForm.errors.price && (
                                        <p className="text-xs text-rose-500 mt-1">{editForm.errors.price}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPlan(null)}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                    >
                                        {editForm.processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        <span>تحديث الخطة</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PlatformLayout>
    );
}
