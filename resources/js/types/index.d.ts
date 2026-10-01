export interface User {
    id: number;
    name: string;
    email: string;
    role_title?: string;
    permissions?: string[];
}

export interface Tenant {
    id: string;
    name: string;
    status: string;
}

export interface NotificationItem {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp?: string;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface PageProps {
    auth: {
        user: User | null;
        guard?: string | null;
    };
    tenant: Tenant | null;
    flash: FlashMessages;
    notifications?: NotificationItem[];
    locale?: string;
    direction?: 'rtl' | 'ltr' | string;
    errors?: Record<string, string>;
}
