import React from 'react';
import { Modal } from '../Atoms/Modal';
import { Badge } from '../Atoms/Badge';
import { Button } from '../Atoms/Button';
import { Building2, User, Mail, Globe, Calendar, Key, CheckCircle, PauseCircle, Trash2 } from 'lucide-react';

export interface RegistrationRequestData {
    id: number;
    organization_name: string;
    slug: string;
    admin_name: string;
    admin_email: string;
    status: 'pending' | 'approved' | 'suspended';
    activation_token?: string | null;
    token_expires_at?: string | null;
    created_at: string;
}

export interface RegistrationRequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RegistrationRequestData | null;
    onApprove?: (req: RegistrationRequestData) => void;
    onSuspend?: (req: RegistrationRequestData) => void;
    onDelete?: (req: RegistrationRequestData) => void;
}

export const RegistrationRequestDetailsModal: React.FC<RegistrationRequestDetailsModalProps> = ({
    isOpen,
    onClose,
    request,
    onApprove,
    onSuspend,
    onDelete,
}) => {
    if (!request) return null;

    const centralDomain = 'aql-platform.local';
    const domainUrl = `${request.slug}.${centralDomain}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل طلب تسجيل المؤسسة" maxWidth="lg">
            <div className="space-y-6 text-xs md:text-sm">
                {/* Header Summary */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{request.organization_name}</h4>
                            <p className="text-slate-500 dark:text-slate-400 font-mono text-xs">{domainUrl}</p>
                        </div>
                    </div>
                    <Badge variant={request.status}>
                        {request.status === 'pending' ? 'قيد الانتظار' : request.status === 'approved' ? 'معتمد / بانتظار التفعيل' : 'معطل مؤقتاً'}
                    </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[11px] font-medium">مسؤول النظام الرئيسي</span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{request.admin_name}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Mail className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] font-medium">البريد الإلكتروني</span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{request.admin_email}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[11px] font-medium">معرف النطاق (Slug)</span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{request.slug}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[11px] font-medium">تاريخ تقديم الطلب</span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{new Date(request.created_at).toLocaleDateString('ar-EG')}</p>
                    </div>
                </div>

                {/* Activation Token Info if Approved */}
                {request.status === 'approved' && request.activation_token && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Key className="w-4 h-4" />
                            <span>رابط التفعيل الخاص بالمؤسسة</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/30 text-xs font-mono break-all text-slate-700 dark:text-slate-300">
                            http://{domainUrl}/activation/{request.activation_token}
                        </div>
                    </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        {onApprove && request.status === 'pending' && (
                            <Button variant="success" size="sm" onClick={() => { onClose(); onApprove(request); }}>
                                <CheckCircle className="w-4 h-4" />
                                <span>اعتماد وتفعيل</span>
                            </Button>
                        )}
                        {onSuspend && (
                            <Button variant="warning" size="sm" onClick={() => { onClose(); onSuspend(request); }}>
                                <PauseCircle className="w-4 h-4" />
                                <span>{request.status === 'suspended' ? 'إلغاء التعليق' : 'إيقاف / تعطيل مؤقت'}</span>
                            </Button>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {onDelete && (
                            <Button variant="danger" size="sm" onClick={() => { onClose(); onDelete(request); }}>
                                <Trash2 className="w-4 h-4" />
                                <span>حذف</span>
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={onClose}>
                            إغلاق
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
