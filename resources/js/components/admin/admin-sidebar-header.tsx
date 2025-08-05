import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem } from '@/types';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface AdminSidebarHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AdminSidebarHeader({ breadcrumbs = [] }: AdminSidebarHeaderProps) {
    const allBreadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Portal', label: 'Admin Portal', href: '/admin/dashboard', icon: Home },
        ...breadcrumbs,
    ];

    return (
        <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm">
                {allBreadcrumbs.map((crumb, index) => {
                    const isLast = index === allBreadcrumbs.length - 1;
                    const Icon = crumb.icon;
                    
                    return (
                        <div key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="h-4 w-4 text-slate-500 mx-2" />
                            )}
                            
                            {isLast ? (
                                <span className="flex items-center gap-2 text-white font-medium">
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {crumb.label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
