import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, CheckCircle, Clock, Globe, ShieldAlert, LogOut } from 'lucide-react';

interface RegistrationRequest {
    id: number;
    organization_name: string;
    slug: string;
    admin_name: string;
    admin_email: string;
    status: 'pending' | 'approved' | 'provisioned';
    created_at: string;
}

interface Props {
    requests: RegistrationRequest[];
}

export default function Dashboard({ requests }: Props) {
    const { post, processing } = useForm();

    const approveRequest = (id: number) => {
        if (confirm('هل أنت متأكد من اعتماد هذا الطلب وإرسال رابط التفعيل؟')) {
            post(`/admin/requests/${id}/approve`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
            <Head title="لوحة تحكم المنصة" />

            {/* Navbar */}
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/30">
                        <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">لوحة تحكم المنصة (Landlord)</h1>
                        <p className="text-xs text-slate-400">إدارة المستأجرين والطلبات</p>
                    </div>
                </div>
                
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-8 mt-6">
                
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-4 bg-emerald-900/30 text-emerald-400 rounded-xl">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">المستأجرين النشطين</p>
                            <h3 className="text-2xl font-bold text-white">
                                {requests.filter(r => r.status === 'provisioned').length}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-4 bg-amber-900/30 text-amber-400 rounded-xl">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">طلبات قيد الانتظار</p>
                            <h3 className="text-2xl font-bold text-white">
                                {requests.filter(r => r.status === 'pending').length}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-4 bg-indigo-900/30 text-indigo-400 rounded-xl">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">طلبات بانتظار التفعيل</p>
                            <h3 className="text-2xl font-bold text-white">
                                {requests.filter(r => r.status === 'approved').length}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-400" />
                            طلبات تسجيل المؤسسات
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">المؤسسة</th>
                                    <th className="px-6 py-4 font-semibold">الدومين (Slug)</th>
                                    <th className="px-6 py-4 font-semibold">المدير</th>
                                    <th className="px-6 py-4 font-semibold">التاريخ</th>
                                    <th className="px-6 py-4 font-semibold">الحالة</th>
                                    <th className="px-6 py-4 font-semibold">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            لا توجد طلبات تسجيل حالياً
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 font-medium">{request.organization_name}</td>
                                            <td className="px-6 py-4 text-indigo-400" dir="ltr">{request.slug}.platform.local</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">{request.admin_name}</div>
                                                <div className="text-xs text-slate-400">{request.admin_email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {new Date(request.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {request.status === 'pending' && (
                                                    <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/20">قيد الانتظار</span>
                                                )}
                                                {request.status === 'approved' && (
                                                    <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/20">بانتظار تفعيل العميل</span>
                                                )}
                                                {request.status === 'provisioned' && (
                                                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">نشط (مُهيأ)</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {request.status === 'pending' ? (
                                                    <button
                                                        onClick={() => approveRequest(request.id)}
                                                        disabled={processing}
                                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                                    >
                                                        اعتماد الطلب
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-500 text-xs">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
