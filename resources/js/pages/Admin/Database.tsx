import AdminLayout from '@/layouts/admin-layout';
import { AdminCard, AdminCardContent, AdminCardDescription, AdminCardHeader, AdminCardTitle } from '@/components/admin/admin-card';
import { Head } from '@inertiajs/react';
import { Database, Table, BarChart3, HardDrive } from 'lucide-react';

type TableInfo = {
    name: string;
    rows: number;
    engine: string | null;
    size: number;
};

type Totals = {
    tables: number;
    rows: number;
    size: number;
    driver: string;
};

type Props = {
    tables: TableInfo[];
    totals: Totals;
};

const formatBytes = (size: number) => {
    if (!size) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

export default function AdminDatabase({ tables = [], totals }: Props) {
    return (
        <AdminLayout>
            <Head title="Database Overview" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Database Overview</h1>
                        <p className="text-slate-400">Connection: {totals.driver.toUpperCase()} — tables and row counts.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Total Tables</AdminCardTitle>
                                <AdminCardDescription>Schema objects</AdminCardDescription>
                            </div>
                            <Table className="h-5 w-5 text-blue-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white">{totals.tables}</div>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Total Rows</AdminCardTitle>
                                <AdminCardDescription>Sum of reported rows</AdminCardDescription>
                            </div>
                            <BarChart3 className="h-5 w-5 text-emerald-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white">{totals.rows.toLocaleString()}</div>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Approx. Size</AdminCardTitle>
                                <AdminCardDescription>Data + indexes</AdminCardDescription>
                            </div>
                            <HardDrive className="h-5 w-5 text-orange-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white">{formatBytes(totals.size)}</div>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard variant="stat">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Driver</AdminCardTitle>
                                <AdminCardDescription>Connection type</AdminCardDescription>
                            </div>
                            <Database className="h-5 w-5 text-purple-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="text-3xl font-bold text-white uppercase">{totals.driver}</div>
                        </AdminCardContent>
                    </AdminCard>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
                    <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Tables</h2>
                            <p className="text-xs text-slate-400">Top-level metadata per table</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Rows</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Engine</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Size</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {tables.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-sm text-slate-400">
                                            No table metadata available.
                                        </td>
                                    </tr>
                                )}
                                {tables.map((table) => (
                                    <tr key={table.name} className="hover:bg-slate-750/50">
                                        <td className="px-4 py-3 text-sm text-slate-100 font-semibold">{table.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-200">{table.rows.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-slate-300 uppercase">
                                            {table.engine || totals.driver}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-200">{formatBytes(table.size)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
