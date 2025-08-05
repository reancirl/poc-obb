import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { User, LogOut, Settings } from 'lucide-react';

interface AdminNavUserProps {
    isCollapsed: boolean;
}

export function AdminNavUser({ isCollapsed }: AdminNavUserProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    if (!user) return null;

    return (
        <div className="p-3 border-b border-slate-700">
            <div className={cn(
                'flex items-center gap-3 p-3 rounded-lg bg-slate-700/50',
                isCollapsed && 'justify-center'
            )}>
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                
                {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                            {user.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                            {user.email}
                        </div>
                        <div className="text-xs text-green-400 font-medium">
                            Administrator
                        </div>
                    </div>
                )}
            </div>
            
            {!isCollapsed && (
                <div className="mt-2 space-y-1">
                    <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            )}
        </div>
    );
}
