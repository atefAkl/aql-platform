import React from 'react';
import { Modal } from '../Atoms/Modal';
import { Button } from '../Atoms/Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    variant = 'danger',
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
            <div className="text-center space-y-4">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                    variant === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-4">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} size="sm" onClick={onConfirm} isLoading={isLoading}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
