import React from 'react';
import TenantLayout from '../../Layouts/TenantLayout';
import { ClipboardList } from 'lucide-react';

interface AuditLogItem {
    id: number;
    user_id?: number | string;
    user_name?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    description: string;
    ip_address?: string;
    created_at: string;
}

interface AuditIndexProps {
    auditLogs: {
        data: AuditLogItem[];
    };
}

export default function AuditIndex({ auditLogs }: AuditIndexProps) {
    return (
        <TenantLayout title="سجل العمليات الحساسة">
            <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-400" />
                            سجل العمليات المهمة والحساسة أمنياً (Audit Trail)
                        </h1>
                        <p className="text-xs text-slate-400">تتبع انتقائي للعمليات المهمة لضمان الـ Traceability التامة دون إفراط</p>
                    </div>
                </div>

                {/* Audit Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-right text-xs">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                            <tr>
                                <th className="p-3.5">التاريخ والوقت</th>
                                <th className="p-3.5">المستخدم</th>
                                <th className="p-3.5">نوع الإجراء</th>
                                <th className="p-3.5">الكيان التابع له</th>
                                <th className="p-3.5">الوصف والتأثير</th>
                                <th className="p-3.5">عنوان IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {auditLogs?.data && auditLogs.data.length > 0 ? (
                                auditLogs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-3.5 font-mono text-slate-400">
                                            {new Date(log.created_at).toLocaleString('ar-EG')}
                                        </td>
                                        <td className="p-3.5 font-semibold text-slate-200">
                                            {log.user_name || 'System / Guest'}
                                        </td>
                                        <td className="p-3.5">
                                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-semibold">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-mono text-slate-300">
                                            {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                                        </td>
                                        <td className="p-3.5 text-slate-300">
                                            {log.description}
                                        </td>
                                        <td className="p-3.5 font-mono text-slate-500 text-[10px]">
                                            {log.ip_address || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                                        لا توجد حركات مسجلة حالياً في سجل الأمان.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </TenantLayout>
    );
}
