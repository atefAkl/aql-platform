import React from 'react';
import TenantLayout from '../../Layouts/TenantLayout';
import { ClipboardList } from 'lucide-react';
import { useTranslation } from '../../Hooks/useTranslation';

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
    const { t, locale } = useTranslation();

    return (
        <TenantLayout title={t('tenant.audit.title')}>
            <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-400" />
                            {t('tenant.audit.header')}
                        </h1>
                        <p className="text-xs text-slate-400">{t('tenant.audit.desc')}</p>
                    </div>
                </div>

                {/* Audit Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-start text-xs">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                            <tr>
                                <th className="p-3.5 text-start">{t('tenant.audit.table_date')}</th>
                                <th className="p-3.5 text-start">{t('tenant.audit.table_user')}</th>
                                <th className="p-3.5 text-start">{t('tenant.audit.table_action')}</th>
                                <th className="p-3.5 text-start">{t('tenant.audit.table_entity')}</th>
                                <th className="p-3.5 text-start">{t('tenant.audit.table_desc')}</th>
                                <th className="p-3.5 text-start">{t('tenant.audit.table_ip')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {auditLogs?.data && auditLogs.data.length > 0 ? (
                                auditLogs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-3.5 font-mono text-slate-400" dir="ltr">
                                            {new Date(log.created_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                        </td>
                                        <td className="p-3.5 font-semibold text-slate-200">
                                            {log.user_name || t('tenant.audit.system_guest')}
                                        </td>
                                        <td className="p-3.5">
                                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-semibold">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-mono text-slate-300" dir="ltr">
                                            {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                                        </td>
                                        <td className="p-3.5 text-slate-300">
                                            {log.description}
                                        </td>
                                        <td className="p-3.5 font-mono text-slate-500 text-[10px]" dir="ltr">
                                            {log.ip_address || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                                        {t('tenant.audit.no_records')}
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
