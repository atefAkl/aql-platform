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

export interface FlashMessages {
    success?: string;
    error?: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    tenant: Tenant | null;
    flash: FlashMessages;
    errors?: Record<string, string>;
}
