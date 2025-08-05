import { Head } from '@inertiajs/react';
import { AdminCard, AdminCardContent, AdminCardDescription, AdminCardHeader, AdminCardTitle } from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { Users, Store, Briefcase, Eye, TrendingUp, Activity, Shield, BarChart3 } from 'lucide-react';

interface Props {
    user: any;
    stats?: {
        totalUsers: number;
        sellerCount: number;
        buyerCount: number;
        listingsCount: number;
    };
}

export default function AdminDashboard({ user, stats = { totalUsers: 10, sellerCount: 3, buyerCount: 7, listingsCount: 15 } }: Props) {
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
                            <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers}</div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm font-medium">+12%</span>
                                <span className="text-slate-400 text-sm">from last month</span>
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
                            <div className="text-3xl font-bold text-white mb-2">{stats.sellerCount}</div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm font-medium">+5%</span>
                                <span className="text-slate-400 text-sm">from last month</span>
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
                            <div className="text-3xl font-bold text-white mb-2">{stats.buyerCount}</div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm font-medium">+8%</span>
                                <span className="text-slate-400 text-sm">from last month</span>
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
                            <div className="text-3xl font-bold text-white mb-2">{stats.listingsCount}</div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm font-medium">+20%</span>
                                <span className="text-slate-400 text-sm">from last month</span>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                </div>
                
                {/* Second row with site metrics */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Site Visits Card */}
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Total Site Visits</AdminCardTitle>
                                <AdminCardDescription>Unique visitors</AdminCardDescription>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Eye className="h-6 w-6 text-blue-400" />
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white mb-2">3,245</div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm font-medium">+25%</span>
                                <span className="text-slate-400 text-sm">from last month</span>
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
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
