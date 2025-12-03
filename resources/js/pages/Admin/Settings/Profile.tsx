import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Mail, User, CheckCircle2, AlertTriangle, Lock, Settings } from 'lucide-react';
import { AdminCard, AdminCardContent, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/admin-card';
import { type SharedData } from '@/types';

export default function AdminSettingsProfile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    return (
        <AdminLayout>
            <Head title="Admin Settings" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
                        <p className="text-slate-400">
                            Manage your admin profile, security, and account preferences.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AdminCard className="lg:col-span-2">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Account summary</AdminCardTitle>
                                <AdminCardDescription>Current admin identity details</AdminCardDescription>
                            </div>
                            <Shield className="h-5 w-5 text-blue-300" />
                        </AdminCardHeader>
                        <AdminCardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-slate-200 font-semibold">{user?.name ?? 'Admin User'}</div>
                                        <div className="text-slate-400 text-sm">{user?.email ?? '—'}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-200 text-xs font-semibold border border-blue-500/30 uppercase">
                                        <Shield className="h-3.5 w-3.5" />
                                        Admin
                                    </span>
                                    {user?.email_verified_at ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-200 text-xs font-semibold border border-green-500/30">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Verified email
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-200 text-xs font-semibold border border-amber-500/30">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            Email not verified
                                        </span>
                                    )}
                                    {user?.suspended_at && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-200 text-xs font-semibold border border-red-500/30">
                                            Suspended
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                                    <div className="text-slate-300 font-semibold mb-1">Profile management</div>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Update your name, email, and contact preferences from the profile editor.
                                    </p>
                                    <Link
                                        href={route('admin.settings.profile.edit')}
                                        className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 font-semibold"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Open profile settings
                                    </Link>
                                </div>
                                <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                                    <div className="text-slate-300 font-semibold mb-1">Security</div>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Use the password settings to rotate your credentials regularly.
                                    </p>
                                    <Link
                                        href={route('admin.settings.password.edit')}
                                        className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 font-semibold"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Update password
                                    </Link>
                                </div>
                            </div>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Contact & access</AdminCardTitle>
                                <AdminCardDescription>Administrative contact information</AdminCardDescription>
                            </div>
                            <Mail className="h-5 w-5 text-slate-300" />
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between text-slate-200">
                                <span>Email</span>
                                <span className="text-slate-400">{user?.email ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-200">
                                <span>Role</span>
                                <span className="text-slate-400 uppercase">{user?.role ?? 'ADMIN'}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-200">
                                <span>Status</span>
                                <span className="text-green-400">Active</span>
                            </div>
                            <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                                Admin settings are restricted. Keep your contact email accurate for security alerts and recovery.
                            </p>
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>
        </AdminLayout>
    );
}
