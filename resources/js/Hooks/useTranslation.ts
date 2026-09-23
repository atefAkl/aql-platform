import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { locale, direction, translations } = usePage<any>().props;

    /**
     * Get a translation by dot-notation key (e.g., 'platform.nav.dashboard')
     */
    const t = (key: string, replacements: Record<string, string | number> = {}): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            if (value === undefined || value === null) break;
            value = value[k];
        }

        if (typeof value !== 'string') {
            return key; // Fallback to the key itself if translation is missing
        }

        // Handle replacements (e.g. :name)
        let result = value;
        for (const [rKey, rValue] of Object.entries(replacements)) {
            result = result.replace(new RegExp(`:${rKey}`, 'g'), String(rValue));
        }

        return result;
    };

    return { t, locale, direction };
}
