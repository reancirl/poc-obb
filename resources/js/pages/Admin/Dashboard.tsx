import { Head, Link } from '@inertiajs/react';
import { AdminCard, AdminCardContent, AdminCardDescription, AdminCardHeader, AdminCardTitle } from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { Users, Store, Briefcase, Eye, TrendingUp, Activity, Shield, BarChart3, Settings } from 'lucide-react';

interface Props {
    user: any;
    stats?: {
        totalUsers: number;
        adminCount: number;
        memberCount: number;
        sellerCount: number;
        buyerCount: number;
        verifiedUsers: number;
        suspendedUsers: number;
        newUsers30: number;
    };
    listingStats?: {
        total: number;
        published: number;
        draft: number;
        sold: number;
        inactive: number;
        newLast30: number;
    };
    leadStats?: {
        total: number;
        recentLast30: number;
    };
}

export default function AdminDashboard({ user, stats, listingStats, leadStats }: Props) {
    const safeStats = {
        totalUsers: stats?.totalUsers ?? 0,
        adminCount: stats?.adminCount ?? 0,
        memberCount: stats?.memberCount ?? 0,
        sellerCount: stats?.sellerCount ?? 0,
        buyerCount: stats?.buyerCount ?? 0,
        verifiedUsers: stats?.verifiedUsers ?? 0,
        suspendedUsers: stats?.suspendedUsers ?? 0,
        newUsers30: stats?.newUsers30 ?? 0,
    };

    const safeListing = {
        total: listingStats?.total ?? 0,
        published: listingStats?.published ?? 0,
        draft: listingStats?.draft ?? 0,
        sold: listingStats?.sold ?? 0,
        inactive: listingStats?.inactive ?? 0,
        newLast30: listingStats?.newLast30 ?? 0,
    };

    const safeLeads = {
        total: leadStats?.total ?? 0,
        recentLast30: leadStats?.recentLast30 ?? 0,
    };

    const sellerTotal = safeStats.sellerCount + safeStats.memberCount;
    const buyerTotal = safeStats.buyerCount + safeStats.memberCount;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Welcome back, <span className="text-blue-400 font-medium">{user.name}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-800/30 rounded-lg">
                        <Activity className="h-4 w-4 text-green-400" />
                        <span className="text-green-300 text-sm font-medium">System Online</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Users Card */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Total Users</AdminCardTitle>
                                <AdminCardDescription>Registered accounts</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{safeStats.totalUsers.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">{safeStats.newUsers30.toLocaleString()} new</span>
                                <span>last 30 days</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                    
                    {/* Sellers Card */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Active Sellers</AdminCardTitle>
                                <AdminCardDescription>Business owners</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <Store className="h-6 w-6 text-purple-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{sellerTotal.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">{safeStats.memberCount.toLocaleString()} members</span>
                                <span>included</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                    
                    {/* Buyers Card */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Active Buyers</AdminCardTitle>
                                <AdminCardDescription>Potential customers</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Briefcase className="h-6 w-6 text-green-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{buyerTotal.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">{safeStats.buyerCount.toLocaleString()} buyers</span>
                                <span>+ members</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                    
                    {/* Listings Card */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Active Listings</AdminCardTitle>
                                <AdminCardDescription>Published businesses</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-orange-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{safeListing.published.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">{safeListing.newLast30.toLocaleString()} new</span>
                                <span>last 30 days</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                </div>
                
                {/* Second row with site metrics */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Verified users */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Verified Users</AdminCardTitle>
                                <AdminCardDescription>Email verified accounts</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Shield className="h-6 w-6 text-blue-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{safeStats.verifiedUsers.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">
                                    {safeStats.suspendedUsers.toLocaleString()} suspended
                                </span>
                                <span>currently</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>

                    {/* New Users */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>New Users (30d)</AdminCardTitle>
                                <AdminCardDescription>Recent signups</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Users className="h-6 w-6 text-green-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{safeStats.newUsers30.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">{safeStats.totalUsers.toLocaleString()} total</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>

                    {/* Lead activity */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Lead Activity</AdminCardTitle>
                                <AdminCardDescription>Interested listings</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-lg">
                                <Eye className="h-6 w-6 text-orange-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">{safeLeads.total.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">{safeLeads.recentLast30.toLocaleString()} new</span>
                                <span>last 30 days</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                        <span className="text-sm text-slate-400">Frequently used admin tools</span>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link href={route('admin.users.index')}>
                            <AdminCard className="cursor-pointer hover:scale-105 transition-transform group">
                                <AdminCardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-400 group-hover:to-blue-500 transition-all">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Manage Users</h3>
                                            <p className="text-sm text-slate-400">Add, edit, or remove users</p>
                                        </div>
                                    </div>
                                </AdminCardContent>
                            </AdminCard>
                        </Link>
                        
                        <Link href={route('admin.listings.index')}>
                            <AdminCard className="cursor-pointer hover:scale-105 transition-transform group">
                                <AdminCardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:from-green-400 group-hover:to-green-500 transition-all">
                                            <Store className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors">Manage Listings</h3>
                                            <p className="text-sm text-slate-400">Review and moderate listings</p>
                                        </div>
                                    </div>
                                </AdminCardContent>
                            </AdminCard>
                        </Link>
                        
                        <Link href={route('admin.analytics')}>
                            <AdminCard className="cursor-pointer hover:scale-105 transition-transform group">
                                <AdminCardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-400 group-hover:to-purple-500 transition-all">
                                            <BarChart3 className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">View Analytics</h3>
                                            <p className="text-sm text-slate-400">Reports and insights</p>
                                        </div>
                                    </div>
                                </AdminCardContent>
                            </AdminCard>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
