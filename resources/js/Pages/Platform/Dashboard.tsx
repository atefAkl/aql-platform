import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building2, Clock, CheckCircle, PauseCircle, Users, LayoutDashboard, ArrowLeft } from 'lucide-react';
import PlatformLayout from '../../Layouts/PlatformLayout';
import { StatCard } from '../../Components/Molecules/StatCard';
import { Button } from '../../Components/Atoms/Button';

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
    return (
        <PlatformLayout>
            <Head title="لوحة التحكّم الرئيسية" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                        لوحة تحكّم المنصة (Landlord)
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        مرحباً بك في المركز الرئيسي لإدارة منصة عقل لخدمات Cloud SaaS
                    </p>
                </div>
                <div>
                    <Link href="/admin/requests">
                        <Button variant="primary" size="sm" className="gap-2">
                            إدارة طلبات التسجيل
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* High Level Stats Grid (Temporarily Hidden per Request) */}
            {/* 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="إجمالي المستأجرين"
                    value={stats.total_tenants}
                    icon={<Building2 className="w-5 h-5" />}
                    colorScheme="indigo"
                    subtext="المؤسسات المسجلة"
                />
                <StatCard
                    title="المستأجرين النشطين"
                    value={stats.active_tenants}
                    icon={<CheckCircle className="w-5 h-5" />}
                    colorScheme="emerald"
                    subtext="مستأجرين يعملون حالياً"
                />
                <StatCard
                    title="طلبات قيد الانتظار"
                    value={stats.pending_requests}
                    icon={<Clock className="w-5 h-5" />}
                    colorScheme="amber"
                    subtext="تتطلب المراجعة"
                />
                <StatCard
                    title="طلبات معتمدة"
                    value={stats.approved_requests}
                    icon={<CheckCircle className="w-5 h-5" />}
                    colorScheme="blue"
                    subtext="في انتظار تفعيل العميل"
                />
                <StatCard
                    title="طلبات موقوفة"
                    value={stats.suspended_requests}
                    icon={<PauseCircle className="w-5 h-5" />}
                    colorScheme="rose"
                    subtext="معطلة مؤقتاً"
                />
                <StatCard
                    title="مدراء المنصة"
                    value={stats.platform_users}
                    icon={<Users className="w-5 h-5" />}
                    colorScheme="indigo"
                    subtext="طاقم إدارة Landlord"
                />
            </div>
            */}

            {/* Clean Main Content Placeholder for Future Admin Widgets */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center border-dashed">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        مرحباً بك في لوحة القيادة
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        تم تخصيص هذه المساحة للتحليلات المتقدمة ومخططات الأداء ومراقبة خوادم المنصة والتي سيتم إضافتها في المراحل القادمة.
                    </p>
                </div>
            </div>
        </PlatformLayout>
    );
}
