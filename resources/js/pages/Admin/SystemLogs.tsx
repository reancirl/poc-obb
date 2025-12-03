import AdminLayout from '@/layouts/admin-layout';
import { AdminCard, AdminCardContent, AdminCardDescription, AdminCardHeader, AdminCardTitle } from '@/components/admin/admin-card';
import { Head, Link } from '@inertiajs/react';
import { FileText, AlertTriangle, Shield, Clock, CalendarDays } from 'lucide-react';

type LogEntry = {
    timestamp: string | null;
    channel: string | null;
    level: string | null;
    message: string;
    raw: string;
};

type Props = {
    entries: LogEntry[];
    file: {
        name: string;
        path: string;
        lastModified: string;
        size: number;
    } | null;
    files: {
        name: string;
        lastModified: string;
        size: number;
    }[];
    activeFile: string | null;
};

export default function SystemLogs({ entries = [], file, files = [], activeFile }: Props) {
    const levelColor = (level?: string | null) => {
        const lvl = (level || '').toUpperCase();
        if (lvl.includes('ERROR') || lvl.includes('CRITICAL')) return 'text-red-300';
        if (lvl.includes('WARNING') || lvl.includes('WARN')) return 'text-amber-300';
        if (lvl.includes('INFO')) return 'text-green-300';
        return 'text-slate-300';
    };

    return (
        <AdminLayout>
            <Head title="System Logs" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">System Logs</h1>
                        <p className="text-slate-400">Latest entries from the Laravel log file.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-900/30 px-3 py-2 border border-blue-800/50">
                        <Shield className="h-4 w-4 text-blue-200" />
                        <span className="text-sm text-blue-100 font-semibold">Read only</span>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AdminCard className="lg:col-span-2">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Recent entries</AdminCardTitle>
                                <AdminCardDescription>Showing the latest 200 lines</AdminCardDescription>
                            </div>
                            <FileText className="h-5 w-5 text-slate-200" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            {entries.length === 0 ? (
                                <div className="text-sm text-slate-400">No log entries found.</div>
                            ) : (
                                <div className="rounded-lg border border-slate-700 bg-slate-900 max-h-[60vh] overflow-y-auto">
                                    <div className="divide-y divide-slate-800">
                                        {entries.map((entry, idx) => (
                                            <div key={idx} className="px-4 py-3">
                                                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>{entry.timestamp || '—'}</span>
                                                    </div>
                                                    <span className={`font-semibold ${levelColor(entry.level)}`}>
                                                        {entry.level || 'LOG'}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-sm text-slate-100 whitespace-pre-wrap break-words">
                                                    {entry.message}
                                                </div>
                                                {entry.channel && (
                                                    <div className="mt-1 text-xs text-slate-500 uppercase">{entry.channel}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </AdminCardContent>
                    </AdminCard>

                    <div className="space-y-4">
                        <AdminCard>
                            <AdminCardHeader>
                                <div>
                                    <AdminCardTitle>Log file</AdminCardTitle>
                                    <AdminCardDescription>Active Laravel log</AdminCardDescription>
                                </div>
                                <AlertTriangle className="h-5 w-5 text-amber-300" />
                            </AdminCardHeader>
                            <AdminCardContent className="space-y-2 text-sm text-slate-200">
                                {file ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">File</span>
                                            <span className="font-semibold">{file.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Last modified</span>
                                            <span className="font-semibold">{file.lastModified}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Size</span>
                                            <span className="font-semibold">{(file.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                        <p className="text-xs text-slate-500 pt-2">
                                            For security, log files are read-only from the admin UI.
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-slate-400">No log file found in storage/logs.</p>
                                )}
                            </AdminCardContent>
                        </AdminCard>

                        <AdminCard>
                            <AdminCardHeader>
                                <div>
                                    <AdminCardTitle>Log by day</AdminCardTitle>
                                    <AdminCardDescription>Select a file to view</AdminCardDescription>
                                </div>
                                <CalendarDays className="h-5 w-5 text-slate-200" />
                            </AdminCardHeader>
                            <AdminCardContent className="space-y-2 max-h-[280px] overflow-y-auto">
                                {files.length === 0 && <p className="text-sm text-slate-400">No log files found.</p>}
                                {files.map((logFile) => (
                                    <Link
                                        key={logFile.name}
                                        href={route('admin.logs', { file: logFile.name })}
                                        preserveScroll
                                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                                            activeFile === logFile.name
                                                ? 'border-blue-500 bg-blue-500/10 text-blue-100'
                                                : 'border-slate-700 bg-slate-900 hover:border-slate-600 text-slate-200'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{logFile.name}</span>
                                            <span className="text-xs text-slate-400">{logFile.lastModified}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{(logFile.size / 1024).toFixed(1)} KB</span>
                                    </Link>
                                ))}
                            </AdminCardContent>
                        </AdminCard>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
