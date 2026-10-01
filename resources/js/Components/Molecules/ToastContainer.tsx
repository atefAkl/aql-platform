import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { PageProps, NotificationItem } from '../../types';

interface DisplayToast extends NotificationItem {
    id: string;
}

export function ToastContainer() {
    const { notifications, flash, errors } = usePage<PageProps>().props;
    const [toasts, setToasts] = useState<DisplayToast[]>([]);

    // Handle incoming notifications & flash messages
    useEffect(() => {
        const newToasts: DisplayToast[] = [];

        // Add from structured notifications array
        if (notifications && notifications.length > 0) {
            notifications.forEach((item) => {
                newToasts.push({
                    id: item.id || `${Date.now()}-${Math.random()}`,
                    type: item.type,
                    message: item.message,
                });
            });
        } else {
            // Fallback for direct flash props
            if (flash?.success) {
                newToasts.push({ id: `succ-${Date.now()}`, type: 'success', message: flash.success });
            }
            if (flash?.error) {
                newToasts.push({ id: `err-${Date.now()}`, type: 'error', message: flash.error });
            }
            if (flash?.warning) {
                newToasts.push({ id: `warn-${Date.now()}`, type: 'warning', message: flash.warning });
            }
            if (flash?.info) {
                newToasts.push({ id: `inf-${Date.now()}`, type: 'info', message: flash.info });
            }
        }

        // Trigger operation-level error toast on form validation errors
        if (errors && Object.keys(errors).length > 0) {
            const hasExistingErrorToast = newToasts.some((t) => t.type === 'error');
            if (!hasExistingErrorToast) {
                newToasts.push({
                    id: `val-err-${Date.now()}`,
                    type: 'error',
                    message: 'يرجى التحقق من البيانات المدخلة وتصحيح الأخطاء.',
                });
            }
        }

        if (newToasts.length > 0) {
            setToasts((prev) => {
                const existingIds = new Set(prev.map((t) => t.id));
                const filteredNew = newToasts.filter((t) => !existingIds.has(t.id));
                return [...prev, ...filteredNew];
            });
        }
    }, [notifications, flash, errors]);

    // Auto-dismiss toasts after 5 seconds
    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setInterval(() => {
            setToasts((prev) => prev.slice(1));
        }, 5000);

        return () => clearInterval(timer);
    }, [toasts]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 end-4 z-50 max-w-md w-full flex flex-col gap-2.5 pointer-events-none p-4">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 transition-all duration-300 animate-slide-in ${
                        toast.type === 'success'
                            ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/50 dark:bg-emerald-950/95 dark:text-emerald-100'
                            : toast.type === 'error'
                            ? 'bg-rose-950/95 text-rose-100 border-rose-500/50 dark:bg-rose-950/95 dark:text-rose-100'
                            : toast.type === 'warning'
                            ? 'bg-amber-950/95 text-amber-100 border-amber-500/50 dark:bg-amber-950/95 dark:text-amber-100'
                            : 'bg-blue-950/95 text-blue-100 border-blue-500/50 dark:bg-blue-950/95 dark:text-blue-100'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
                        <span className="text-xs font-semibold leading-snug">{toast.message}</span>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10 shrink-0"
                        title="إغلاق"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
