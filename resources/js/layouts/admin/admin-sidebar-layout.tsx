import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AdminSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <div className="min-h-screen bg-slate-900">
            <AdminShell variant="sidebar">
                <AdminSidebar />
                <AdminContent variant="sidebar" className="overflow-x-hidden">
                    {/* Admin Security Banner */}
                    {isAdmin && (
                        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-800/30 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-red-400 flex-shrink-0" />
                                    <AlertTriangle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="text-red-300 text-sm font-semibold">
                                        ADMIN PORTAL - RESTRICTED ACCESS
                                    </p>
                                    <p className="text-red-400/80 text-xs">
                                        You have administrative privileges. Exercise caution with all operations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <AdminSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="p-6">
                        {children}
                    </div>
                </AdminContent>
            </AdminShell>
        </div>
    );
}
