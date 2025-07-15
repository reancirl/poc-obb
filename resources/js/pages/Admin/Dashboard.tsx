import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Users, Store, Briefcase, Eye } from 'lucide-react';

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
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.name}!</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Users Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    
                    {/* Sellers Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.sellerCount}</div>
                            <p className="text-xs text-muted-foreground">+5% from last month</p>
                        </CardContent>
                    </Card>
                    
                    {/* Buyers Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.buyerCount}</div>
                            <p className="text-xs text-muted-foreground">+18% from last month</p>
                        </CardContent>
                    </Card>
                    
                    {/* Total Listings Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.listingsCount}</div>
                            <p className="text-xs text-muted-foreground">+7% from last month</p>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Second row with site metrics */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Site Visits Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Site Visits</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3,245</div>
                            <p className="text-xs text-muted-foreground">+25% from last month</p>
                        </CardContent>
                    </Card>
                    
                    {/* Average Time on Site Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4m 32s</div>
                            <p className="text-xs text-muted-foreground">+8% from last month</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
