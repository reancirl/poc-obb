import AdminLayout from '@/layouts/admin-layout';
import { AdminCard, AdminCardContent, AdminCardDescription, AdminCardHeader, AdminCardTitle } from '@/components/admin/admin-card';
import { Head, Link } from '@inertiajs/react';
import { Shield, Users, CheckCircle2, AlertTriangle, Lock, Settings, Activity } from 'lucide-react';

type Stats = {
    totalUsers: number;
    admins: number;
    members: number;
    sellers: number;
    buyers: number;
    verified: number;
    suspended: number;
};

type Props = {
    stats: Stats;
};

export default function AdminSecurity({ stats }: Props) {
    const safe = {
        totalUsers: stats?.totalUsers ?? 0,
        admins: stats?.admins ?? 0,
        members: stats?.members ?? 0,
        sellers: stats?.sellers ?? 0,
        buyers: stats?.buyers ?? 0,
        verified: stats?.verified ?? 0,
        suspended: stats?.suspended ?? 0,
    };

    return (
        <AdminLayout>
            <Head title="Security Center" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Security Center</h1>
                        <p className="text-slate-400">Account integrity, roles, and verification health.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-red-900/30 px-3 py-2 border border-red-800/50">
                        <Shield className="h-4 w-4 text-red-200" />
                        <span className="text-sm text-red-100 font-semibold">Admin visibility</span>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Total Users</AdminCardTitle>
                                <AdminCardDescription>All roles</AdminCardDescription>
                            </div>
                            <Users className="h-5 w-5 text-blue-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white">{safe.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-slate-400 mt-1">
                                Admins: {safe.admins.toLocaleString()} • Members: {safe.members.toLocaleString()}
                            </p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Verified</AdminCardTitle>
                                <AdminCardDescription>Email verified accounts</AdminCardDescription>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-green-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white">{safe.verified.toLocaleString()}</div>
                            <p className="text-xs text-slate-400 mt-1">
                                {safe.totalUsers ? Math.round((safe.verified / safe.totalUsers) * 100) : 0}% verified rate
                            </p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Suspended</AdminCardTitle>
                                <AdminCardDescription>Blocked accounts</AdminCardDescription>
                            </div>
                            <AlertTriangle className="h-5 w-5 text-amber-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white">{safe.suspended.toLocaleString()}</div>
                            <p className="text-xs text-slate-400 mt-1">Review and unsuspend if needed.</p>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Role Mix</AdminCardTitle>
                                <AdminCardDescription>Sellers & Buyers</AdminCardDescription>
                            </div>
                            <Activity className="h-5 w-5 text-purple-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-xl font-semibold text-white">
                                Sellers {safe.sellers.toLocaleString()} • Buyers {safe.buyers.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Member role can cover both.</p>
                        </AdminCardContent>
                    </AdminCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AdminCard className="lg:col-span-2">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Security checks</AdminCardTitle>
                                <AdminCardDescription>Recommended periodic actions</AdminCardDescription>
                            </div>
                            <Lock className="h-5 w-5 text-slate-200" />
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3 text-sm text-slate-100">
                            <div className="flex items-start gap-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-green-400" />
                                <div>
                                    <p className="font-semibold text-white">Audit suspended accounts</p>
                                    <p className="text-slate-400">Unsuspend false positives; enforce policy on violations.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-blue-400" />
                                <div>
                                    <p className="font-semibold text-white">Push verification completion</p>
                                    <p className="text-slate-400">Follow up with unverified admins/members.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-amber-400" />
                                <div>
                                    <p className="font-semibold text-white">Rotate credentials</p>
                                    <p className="text-slate-400">Encourage password rotation for elevated roles.</p>
                                </div>
                            </div>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Quick actions</AdminCardTitle>
                                <AdminCardDescription>High-signal destinations</AdminCardDescription>
                            </div>
                            <Settings className="h-5 w-5 text-blue-200" />
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3">
                            <Link
                                href={route('admin.users.index')}
                                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:border-blue-500"
                            >
                                <span>Manage users</span>
                                <Users className="h-4 w-4 text-blue-300" />
                            </Link>
                            <Link
                                href={route('admin.settings.password.edit')}
                                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:border-blue-500"
                            >
                                <span>Update admin password</span>
                                <Lock className="h-4 w-4 text-blue-300" />
                            </Link>
                            <Link
                                href={route('admin.logs')}
                                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:border-blue-500"
                            >
                                <span>Review system logs</span>
                                <Shield className="h-4 w-4 text-blue-300" />
                            </Link>
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>
        </AdminLayout>
    );
}
