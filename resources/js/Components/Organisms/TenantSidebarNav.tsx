import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Building2, 
    Layers, 
    Settings, 
    ChevronDown, 
    ChevronLeft, 
    FileText, 
    Clock, 
    CheckCircle, 
    Ban, 
    ShieldCheck, 
    Activity, 
    Globe, 
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { PageProps } from '../../types';

interface SubMenuItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface MainMenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    children?: SubMenuItem[];
}

interface SidebarNavProps {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
}

export const TenantSidebarNav: React.FC<SidebarNavProps> = ({ darkMode, setDarkMode }) => {
    const { url, props } = usePage<PageProps>();
    const authUser = props.auth?.user;
    const organizationName = (props.auth as any)?.organization_name || 'لوحة تحكم المؤسسة';

    // State for single-open accordion (Only 1 menu open at a time)
    const [openMenuId, setOpenMenuId] = useState<string | null>('users');

    const navigationItems: MainMenuItem[] = [
        {
            id: 'users',
            label: 'إدارة الموظفين والصلاحيات',
            icon: <Activity className="w-4 h-4 text-blue-500" />,
            href: '/users',
        },
        {
            id: 'audit',
            label: 'سجل العمليات الحساسة',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
            href: '/audit',
        },
    ];

    const toggleMenu = (id: string) => {
        // Single-open accordion logic: if clicked menu is open, close it; else open ONLY clicked menu.
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    return (
        <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0 shadow-sm" dir="rtl">
            <div>
                {/* Brand Header */}
                <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-black flex items-center justify-center text-base shadow-lg shadow-emerald-500/20">
                        {organizationName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{organizationName}</h4>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block truncate">إدارة المؤسسة</span>
                    </div>
                </div>

                {/* 2-Level Accordion Navigation */}
                <nav className="space-y-1.5">
                    {navigationItems.map((item) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isOpen = openMenuId === item.id;
                        const isActive = item.href ? url === item.href : item.children?.some(child => url.startsWith(child.href));

                        if (!hasChildren && item.href) {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                                        url === item.href
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        }

                        return (
                            <div key={item.id} className="rounded-xl overflow-hidden border border-transparent transition-all">
                                <button
                                    onClick={() => toggleMenu(item.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="transition-transform duration-200">
                                        {isOpen ? <ChevronDown className="w-4 h-4 opacity-70" /> : <ChevronLeft className="w-4 h-4 opacity-50" />}
                                    </div>
                                </button>

                                {/* Sub-menu Items */}
                                {isOpen && hasChildren && (
                                    <div className="mt-1 mr-4 space-y-1 pr-3 border-r-2 border-slate-200 dark:border-slate-800 py-1 animate-fade-in">
                                        {item.children?.map((subItem) => {
                                            const isSubActive = url === subItem.href;
                                            return (
                                                <Link
                                                    key={subItem.id}
                                                    href={subItem.href}
                                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                                        isSubActive
                                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                                    }`}
                                                >
                                                    {subItem.icon}
                                                    <span>{subItem.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions & Theme Mode */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:opacity-90 transition-all shadow-sm"
                >
                    <span className="flex items-center gap-2">
                        {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                        {darkMode ? 'المظهر الداكن (Dark)' : 'المظهر الفاتح (Light)'}
                    </span>
                    <span className="text-[10px] opacity-60">تغيير</span>
                </button>

                {authUser && (
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow">
                                {authUser.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{authUser.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Super Admin</p>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="تسجيل الخروج"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
};
