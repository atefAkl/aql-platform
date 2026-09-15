import React, { useState } from 'react';
import PlatformLayout from '../../Layouts/PlatformLayout';
import { useForm, router } from '@inertiajs/react';
import { Users, UserPlus, Shield, Check, Save, UserCheck, Briefcase } from 'lucide-react';
import { User as UserType } from '../../types';

interface RoleType {
    id: number;
    name: string;
    description: string;
    permissions?: Array<{ id: number; code: string }>;
}

interface PermissionType {
    id: number;
    code: string;
    name: string;
    module: string;
}

interface UsersIndexProps {
    users: Array<UserType & { permissions: PermissionType[]; role_id?: number; role?: RoleType }>;
    roles: RoleType[];
    permissions: Record<string, PermissionType[]>;
}

export default function UsersIndex({ users, roles, permissions }: UsersIndexProps) {
    const [selectedUser, setSelectedUser] = useState<UsersIndexProps['users'][0] | null>(users[0] || null);
    const [selectedRoleId, setSelectedRoleId] = useState<number | string | null>(
        selectedUser ? selectedUser.role_id || null : null
    );
    const [selectedPermIds, setSelectedPermIds] = useState<number[]>(
        selectedUser ? selectedUser.permissions.map((p) => p.id) : []
    );
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const { data: newUser, setData: setNewUser, post, reset, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: roles[0]?.id ? String(roles[0].id) : '',
    });

    const handleSelectUser = (u: UsersIndexProps['users'][0]) => {
        setSelectedUser(u);
        setSelectedRoleId(u.role_id || null);
        setSelectedPermIds(u.permissions.map((p) => p.id));
    };

    const handleRoleChange = (roleId: string) => {
        setSelectedRoleId(roleId);
        const targetRole = roles.find((r) => r.id === parseInt(roleId));
        if (targetRole && targetRole.permissions) {
            const rolePermIds = targetRole.permissions.map((p) => p.id);
            setSelectedPermIds(rolePermIds);
        }
    };

    const togglePermission = (permId: number) => {
        if (selectedPermIds.includes(permId)) {
            setSelectedPermIds(selectedPermIds.filter((id) => id !== permId));
        } else {
            setSelectedPermIds([...selectedPermIds, permId]);
        }
    };

    const handleSavePermissions = () => {
        if (!selectedUser) return;
        router.post(`/users/${selectedUser.id}/permissions`, {
            role_id: selectedRoleId,
            permission_ids: selectedPermIds,
        });
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
            },
        });
    };

    return (
        <PlatformLayout title="إدارة الموظفين والأدوار والصلاحيات">
            <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            إدارة الموظفين والأدوار والصلاحيات (Hybrid Role Model)
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">تطبيق ADR-003 & ADR-005: اختيار دور وظيفي رئيسي مع إمكانية التعيين والتعديل المباشر للصلاحيات الفردية</p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        إضافة موظف جديد
                    </button>
                </div>

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-emerald-500" />
                                إضافة موظف جديد للفريق
                            </h3>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser('name', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                                        placeholder="سامي محمود"
                                        required
                                    />
                                    {errors.name && <span className="text-[11px] text-red-500 mt-1 block">{errors.name}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser('email', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                                        placeholder="sami@acme.com"
                                        required
                                    />
                                    {errors.email && <span className="text-[11px] text-red-500 mt-1 block">{errors.email}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور الأولية</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser('password', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password && <span className="text-[11px] text-red-500 mt-1 block">{errors.password}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الدور الوظيفي الرئيسي (Role Template)</label>
                                    <select
                                        value={newUser.role_id}
                                        onChange={(e) => setNewUser('role_id', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">بدون دور افتراضي (صلاحيات مخصصة فقط)</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name} - ({r.description})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-all disabled:opacity-50"
                                    >
                                        حفظ وإضافة الموظف
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Team Users List */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
                        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span>فريق العمل الحالي ({users.length})</span>
                        </h3>

                        <div className="space-y-2">
                            {users.map((u) => {
                                const isSelected = selectedUser?.id === u.id;
                                return (
                                    <div
                                        key={u.id}
                                        onClick={() => handleSelectUser(u)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500 shadow-sm'
                                                : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{u.role_title || u.role?.name || 'عضو فريق'}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                            {u.permissions.length} صلاحية
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hybrid Role & Direct Permissions Editor */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
                        {selectedUser ? (
                            <>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-emerald-500" />
                                            إدارة الدور والصلاحيات للموظف: {selectedUser.name}
                                        </h3>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.email}</span>
                                    </div>

                                    <button
                                        onClick={handleSavePermissions}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        حفظ التغييرات
                                    </button>
                                </div>

                                {/* Primary Role Selection Dropdown (Hybrid Model) */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-emerald-500" />
                                        الدور الوظيفي الرئيسي (Role Template):
                                    </label>
                                    <select
                                        value={selectedRoleId || ''}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">بدون قالب دور (صلاحيات مخصصة بالكامل)</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name} - ({r.description})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        اختيار دور محدد يقوم بتطبيق حزمة الصلاحيات التابعة له تلقائياً، مع احتفاظك بحرية استثناء أو إضافة صلاحيات صريحة بالأسفل (Direct Permissions Overrides).
                                    </p>
                                </div>

                                {/* Direct Permissions Grid by Module */}
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-emerald-500" />
                                        مصفوفة الصلاحيات الصريحة المباشرة (Direct Permissions Overrides):
                                    </h4>

                                    {Object.keys(permissions).map((moduleName) => (
                                        <div key={moduleName} className="space-y-2">
                                            <h5 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                موديول: {moduleName}
                                            </h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {permissions[moduleName].map((p) => {
                                                    const isChecked = selectedPermIds.includes(p.id);
                                                    return (
                                                        <div
                                                            key={p.id}
                                                            onClick={() => togglePermission(p.id)}
                                                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                                                isChecked
                                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/60 text-emerald-900 dark:text-emerald-200 shadow-sm'
                                                                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                                            }`}
                                                        >
                                                            <div className="space-y-0.5">
                                                                <p className="text-xs font-semibold">{p.name}</p>
                                                                <span className="text-[10px] font-mono opacity-60">{p.code}</span>
                                                            </div>
                                                            <div
                                                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                                                    isChecked
                                                                        ? 'bg-emerald-600 border-emerald-500 text-white'
                                                                        : 'border-slate-300 dark:border-slate-700'
                                                                }`}
                                                            >
                                                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-slate-400 text-xs">اختر موظفاً من القائمة لتعديل دوره وصلاحياته المباشرة.</div>
                        )}
                    </div>
                </div>
            </div>
        </PlatformLayout>
    );
}
