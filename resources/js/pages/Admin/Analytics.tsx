import AdminLayout from '@/layouts/admin-layout';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
    AdminCardTitle,
} from '@/components/admin/admin-card';
import { Head } from '@inertiajs/react';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    TrendingUp,
    Users,
} from 'lucide-react';

type Trend = 'up' | 'down';

type TopItem = {
    name: string;
    count: number;
    share: number;
};

type RecentUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string | null;
};

interface Props {
    stats: {
        total: number;
        admins: number;
        members: number;
        sellers: number;
        buyers: number;
        verified: number;
        suspended: number;
        newLast30: number;
    };
    listingStats: {
        total: number;
        published: number;
        draft: number;
        sold: number;
        inactive: number;
        avgPrice: number;
        totalValue: number;
        newLast30: number;
    };
    topIndustries: TopItem[];
    topLocations: TopItem[];
    leadStats: {
        total: number;
        recentLast30: number;
    };
    recentUsers: RecentUser[];
}

export default function AdminAnalytics({
    stats,
    listingStats,
    topIndustries = [],
    topLocations = [],
    leadStats,
    recentUsers = [],
}: Props) {
    const verifiedRate = stats.total ? Math.round((stats.verified / stats.total) * 100) : 0;
    const listingTotal = listingStats.total || 0;

    const statusBreakdown = [
        { name: 'Published', value: listingStats.published },
        { name: 'Draft', value: listingStats.draft },
        { name: 'Sold', value: listingStats.sold },
        { name: 'Inactive', value: listingStats.inactive },
    ].map((item) => ({
        ...item,
        percent: listingTotal ? Math.round((item.value / listingTotal) * 100) : 0,
    }));

    const kpis = [
        {
            title: 'Total Users',
            value: stats.total.toLocaleString(),
            change: `${stats.newLast30.toLocaleString()} new / 30d`,
            trend: 'up' as Trend,
            icon: Users,
            caption: 'All roles',
        },
        {
            title: 'Published Listings',
            value: listingStats.published.toLocaleString(),
            change: `${listingStats.newLast30.toLocaleString()} new / 30d`,
            trend: 'up' as Trend,
            icon: BarChart3,
            caption: 'Live inventory',
        },
        {
            title: 'Verified Users',
            value: `${verifiedRate}%`,
            change: `${stats.verified.toLocaleString()} verified`,
            trend: verifiedRate >= 50 ? 'up' : ('down' as Trend),
            icon: Activity,
            caption: 'Email verified',
        },
        {
            title: 'Lead Activity',
            value: leadStats.total.toLocaleString(),
            change: `${leadStats.recentLast30.toLocaleString()} last 30d`,
            trend: 'up' as Trend,
            icon: TrendingUp,
            caption: 'Interested listings',
        },
    ];

    const insights = [
        {
            color: 'bg-green-400',
            title: `${stats.newLast30.toLocaleString()} new users in the last 30 days`,
            description: `${stats.total.toLocaleString()} total users${stats.suspended ? `, ${stats.suspended.toLocaleString()} suspended` : ''}.`,
        },
        {
            color: 'bg-blue-400',
            title: `${listingStats.newLast30.toLocaleString()} new listings in the last 30 days`,
            description: `${listingStats.published.toLocaleString()} published, ${listingStats.draft.toLocaleString()} drafts.`,
        },
        {
            color: 'bg-yellow-400',
            title: `${leadStats.recentLast30.toLocaleString()} lead submissions in the last 30 days`,
            description: `${leadStats.total.toLocaleString()} total leads captured.`,
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Analytics" />

            <div className="space-y-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                        <p className="text-slate-400">
                            Key signals for traffic, engagement, and conversion performance powered by live data.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-800/40 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-300" />
                        <span className="text-blue-100 text-sm font-medium">Live updates enabled</span>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((item) => {
                        const Icon = item.icon;
                        const isUp = item.trend === 'up';
                        const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
                        const trendColor = isUp ? 'text-green-400' : 'text-red-400';
                        const trendBg = isUp ? 'bg-green-500/10' : 'bg-red-500/10';

                        return (
                            <AdminCard key={item.title} variant="stat">
                                <AdminCardHeader>
                                    <div>
                                        <AdminCardTitle>{item.title}</AdminCardTitle>
                                        <AdminCardDescription>{item.caption}</AdminCardDescription>
                                    </div>
                                    <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-700/60">
                                        <Icon className="h-5 w-5 text-blue-200" />
                                    </div>
                                </AdminCardHeader>
                                <AdminCardContent>
                                    <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${trendBg} ${trendColor}`}
                                        >
                                            <TrendIcon className="h-4 w-4" />
                                            {item.change}
                                        </span>
                                        <span className="text-slate-400 text-sm">vs. previous period</span>
                                    </div>
                                </AdminCardContent>
                            </AdminCard>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AdminCard className="lg:col-span-2">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Listings by Status</AdminCardTitle>
                                <AdminCardDescription>Current distribution across lifecycle states</AdminCardDescription>
                            </div>
                            <BarChart3 className="h-5 w-5 text-slate-300" />
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-4">
                            {statusBreakdown.map((status) => (
                                <div key={status.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-200 font-medium">{status.name}</span>
                                        <span className="text-slate-400">
                                            {status.value.toLocaleString()} {listingTotal ? `(${status.percent}%)` : ''}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                            style={{ width: `${status.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {topLocations.length > 0 && (
                                <div className="pt-2 border-t border-slate-800">
                                    <div className="text-xs text-slate-400 font-medium mb-2">Top locations</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
                                        {topLocations.map((loc) => (
                                            <div key={loc.name} className="flex justify-between">
                                                <span>{loc.name}</span>
                                                <span className="text-slate-400">
                                                    {loc.count.toLocaleString()} ({loc.share}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Conversion Health</AdminCardTitle>
                                <AdminCardDescription>Lead and signup momentum</AdminCardDescription>
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-300" />
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-4">
                            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                                <div className="text-sm text-slate-400">Lead submissions (30d)</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white">
                                        {leadStats.recentLast30.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                        <ArrowUpRight className="h-4 w-4" />
                                        {leadStats.total
                                            ? `${Math.round((leadStats.recentLast30 / (leadStats.total || 1)) * 100)}% of total`
                                            : 'New data'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {leadStats.total.toLocaleString()} leads captured overall.
                                </p>
                            </div>
                            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                                <div className="text-sm text-slate-400">Verification rate</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white">{verifiedRate}%</span>
                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                        <ArrowUpRight className="h-4 w-4" />
                                        {stats.verified.toLocaleString()} verified
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {stats.total.toLocaleString()} total users, {stats.suspended.toLocaleString()} suspended.
                                </p>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <AdminCard>
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Top Performing Categories</AdminCardTitle>
                                <AdminCardDescription>Share of listings by industry</AdminCardDescription>
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3">
                            <div className="grid grid-cols-3 text-xs text-slate-400 pb-2 border-b border-slate-800">
                                <span>Industry</span>
                                <span className="text-center">Listings</span>
                                <span className="text-right">% share</span>
                            </div>
                            {topIndustries.length === 0 && (
                                <div className="text-sm text-slate-400">No industry data available yet.</div>
                            )}
                            {topIndustries.map((industry) => (
                                <div key={industry.name} className="grid grid-cols-3 text-sm text-slate-200">
                                    <span>{industry.name}</span>
                                    <span className="text-center text-slate-300">{industry.count.toLocaleString()}</span>
                                    <span className="text-right text-slate-300">{industry.share}%</span>
                                </div>
                            ))}
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Engagement Notes</AdminCardTitle>
                                <AdminCardDescription>Snapshots from the last 30 days</AdminCardDescription>
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-4">
                            {insights.map((insight) => (
                                <div key={insight.title} className="flex items-start gap-3">
                                    <div className={`h-2.5 w-2.5 mt-2 rounded-full ${insight.color}`} />
                                    <div>
                                        <p className="text-sm text-white">{insight.title}</p>
                                        <p className="text-xs text-slate-400">{insight.description}</p>
                                    </div>
                                </div>
                            ))}
                            {recentUsers.length > 0 && (
                                <div className="pt-2 border-t border-slate-800">
                                    <div className="text-xs text-slate-400 font-medium mb-2">Latest signups</div>
                                    <div className="space-y-2">
                                        {recentUsers.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between text-sm text-slate-200">
                                                <span className="truncate">{user.name}</span>
                                                <span className="text-slate-400 text-xs uppercase">{user.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>
        </AdminLayout>
    );
}
