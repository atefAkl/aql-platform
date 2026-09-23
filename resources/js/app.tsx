import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import React from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'منصة إدارة الأعمال المشتركة';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob<{ default: React.ComponentType }>('./Pages/**/*.tsx', { eager: true });
        const pageComponent = pages[`./Pages/${name}.tsx`];
        if (!pageComponent) {
            throw new Error(`Page component not found: ./Pages/${name}.tsx`);
        }
        return pageComponent;
    },
    setup({ el, App, props }) {
        // Also set on initial load to avoid flash of incorrect direction
        const initialProps = props.initialPage.props as any;
        if (initialProps.locale) document.documentElement.lang = initialProps.locale;
        if (initialProps.direction) document.documentElement.dir = initialProps.direction;

        router.on('success', (event) => {
            const pageProps = event.detail.page.props as any;
            if (pageProps.locale) document.documentElement.lang = pageProps.locale;
            if (pageProps.direction) document.documentElement.dir = pageProps.direction;
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#10b981',
    },
});
