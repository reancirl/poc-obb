import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Users, Filter, Plus, Shield, Search, Ban, CheckCircle, Settings } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer' | 'member';
    created_at: string;
    suspended_at: string | null;
}

interface PaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

type Props = {
    users: {
        data: User[];
        links: PaginationProps['links'];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
};

export default function UserIndex({ users }: Props) {
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            { search, role: selectedRole === 'all' ? '' : selectedRole },
            { preserveState: true }
        );
    };

    interface ErrorResponse {
        response?: {
            data?: { message?: string };
            status?: number;
        };
        message?: string;
    }

    const handleSuspendUser = (userId: number, isSuspended: boolean) => {
        if (confirm(`Are you sure you want to ${isSuspended ? 'unsuspend' : 'suspend'} this user?`)) {
            const url = isSuspended
                ? route('admin.users.unsuspend', userId)
                : route('admin.users.suspend', userId);

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };

            const data = {
                _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            };

            router.post(url, data, {
                headers,
                onSuccess: (response: any) => {
                    const message =
                        response?.data?.message ||
                        `User has been ${isSuspended ? 'unsuspended' : 'suspended'} successfully.`;
                    toast.success(message);
                    router.reload({ only: ['users'] });
                },
                onError: (errors: ErrorResponse | string) => {
                    if (typeof errors === 'object') {
                        if (errors.response?.data?.message) {
                            toast.error(errors.response.data.message);
                        } else if (errors.message) {
                            toast.error(errors.message);
                        } else {
                            toast.error('An error occurred while processing your request.');
                        }
                    } else if (typeof errors === 'string') {
                        toast.error(errors);
                    } else {
                        toast.error('An unknown error occurred.');
                    }
                },
            });
        }
    };

    const roleBadge = (role: User['role'], suspended: boolean) => {
        if (suspended) return 'bg-slate-700 text-slate-300 border border-slate-600';
        switch (role) {
            case 'admin':
                return 'bg-purple-500/20 text-purple-200 border border-purple-500/30';
            case 'seller':
                return 'bg-blue-500/20 text-blue-200 border border-blue-500/30';
            case 'buyer':
                return 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30';
            default:
                return 'bg-slate-500/20 text-slate-200 border border-slate-500/30';
        }
    };

    return (
        <AdminLayout>
            <Head title="Users" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-300" /> Admin
                        </p>
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email"
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="all">All roles</option>
                                <option value="admin">Admin</option>
                                <option value="seller">Seller</option>
                                <option value="buyer">Buyer</option>
                                <option value="member">Member</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            Apply
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Created
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.data.map((user: User) => (
                                    <tr key={user.id} className="hover:bg-slate-750/50">
                                        <td className="px-4 py-4 text-sm text-slate-100">
                                            <div className="font-semibold">{user.name}</div>
                                            {user.suspended_at && (
                                                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-200">
                                                    <Ban className="h-3 w-3" />
                                                    Suspended
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-300">{user.email}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${roleBadge(
                                                    user.role,
                                                    !!user.suspended_at
                                                )}`}
                                            >
                                                <Users className="h-3.5 w-3.5" />
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-slate-200 space-x-2">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="inline-flex items-center gap-1 rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold text-blue-200 hover:border-blue-500 hover:text-white"
                                            >
                                                <Settings className="h-3.5 w-3.5" />
                                                Edit
                                            </Link>
                                            {user.suspended_at ? (
                                                <button
                                                    onClick={() => handleSuspendUser(user.id, true)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-green-600 px-3 py-1.5 text-xs font-semibold text-green-200 hover:bg-green-600/20"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Unsuspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSuspendUser(user.id, false)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-red-600 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-600/20"
                                                >
                                                    <Ban className="h-3.5 w-3.5" />
                                                    Suspend
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-700 bg-slate-900 px-4 py-3 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-slate-400">
                            Showing <span className="font-semibold text-white">{users.from}</span> to{' '}
                            <span className="font-semibold text-white">{users.to}</span> of{' '}
                            <span className="font-semibold text-white">{users.total}</span> results
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url || link.active}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
