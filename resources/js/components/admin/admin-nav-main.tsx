import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  BarChart3,
  Database,
  Shield,
  Activity
} from 'lucide-react';

interface AdminNavMainProps {
    isCollapsed: boolean;
}

export function AdminNavMain({ isCollapsed }: AdminNavMainProps) {
    const page = usePage();
    const currentPath = page.url;

    const navItems = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            description: 'Overview & Analytics'
        },
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
            description: 'Manage Users & Roles'
        },
        {
            title: 'Listing Management',
            href: '/admin/listings',
            icon: ClipboardList,
            description: 'Business Listings'
        },
        {
            title: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
            description: 'Reports & Insights'
        },
        {
            title: 'System Logs',
            href: '/admin/logs',
            icon: Activity,
            description: 'Activity Monitoring'
        },
        {
            title: 'Database',
            href: '/admin/database',
            icon: Database,
            description: 'Data Management'
        },
        {
            title: 'Security',
            href: '/admin/security',
            icon: Shield,
            description: 'Access Control'
        },
        {
            title: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            description: 'System Configuration'
        }
    ];

    return (
        <nav className="px-3 space-y-1">
            {navItems.map((item) => {
                const isActive = currentPath.startsWith(item.href);
                const Icon = item.icon;
                
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                            isActive 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50',
                            isCollapsed && 'justify-center px-2'
                        )}
                    >
                        <Icon className={cn(
                            'flex-shrink-0 transition-transform group-hover:scale-110',
                            isActive ? 'h-5 w-5' : 'h-4 w-4'
                        )} />
                        
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="font-medium">{item.title}</div>
                                <div className={cn(
                                    'text-xs opacity-75 truncate',
                                    isActive ? 'text-blue-100' : 'text-slate-400'
                                )}>
                                    {item.description}
                                </div>
                            </div>
                        )}
                        
                        {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-slate-300">{item.description}</div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-700 rotate-45" />
                            </div>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
