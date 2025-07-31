import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                {/* Admin Warning Banner */}
                {isAdmin && (
                    <div className="bg-green-200 border-b border-red-200 px-6 py-3">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <p className="text-red-600 text-sm font-medium">
                                You are logged in as admin, be careful with the steps you will do in this portal
                            </p>
                        </div>
                    </div>
                )}
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
