import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { Lock, Mail, ShieldAlert, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../../Hooks/useTranslation';

export default function Login() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const params = new URLSearchParams(window.location.search);
    const nextUrl = params.get('next') || '';

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
        next: nextUrl,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
            <Head title={t('platform.login.title')} />
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-900/30">
                        <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-100">{t('platform.login.header_title')}</h1>
                    <p className="text-xs text-slate-400">{t('platform.login.header_subtitle')}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('platform.login.email_label')}</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute start-3 top-3" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder={t('platform.login.email_placeholder')}
                                required
                            />
                        </div>
                        {errors.email && <span className="text-[11px] text-red-400 mt-1 block">{errors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('platform.login.password_label')}</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute start-3 top-3" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-10 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder={t('platform.login.password_placeholder')}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute end-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded"
                                title={showPassword ? t('platform.login.hide_password') : t('platform.login.show_password')}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4 text-indigo-400" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && <span className="text-[11px] text-red-400 mt-1 block">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <KeyRound className="w-4 h-4" />
                        {processing ? t('platform.login.submitting') : t('platform.login.submit')}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                        {t('platform.login.new_tenant')}{' '}
                        <Link href="/onboarding" className="text-indigo-400 font-semibold hover:underline">
                            {t('platform.login.register_now')}
                        </Link>
                    </p>
                    <span className="text-[10px] text-slate-500 block">Landlord Context Active (No Tenancy)</span>
                </div>
            </div>
        </div>
    );
}
