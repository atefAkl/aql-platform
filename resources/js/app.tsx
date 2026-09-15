import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

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
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#10b981',
    },
});
