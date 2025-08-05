import { cn } from '@/lib/utils';
import { Shield, Settings } from 'lucide-react';
import { useState } from 'react';
import { AdminNavMain } from './admin-nav-main';
import { AdminNavUser } from './admin-nav-user';
import { AdminNavFooter } from './admin-nav-footer';

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={cn(
            'flex flex-col bg-slate-800 border-r border-slate-700 transition-all duration-300',
            isCollapsed ? 'w-16' : 'w-64'
        )}>
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-lg font-bold text-white">Admin Portal</h2>
                            <p className="text-xs text-slate-400">Management Console</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-4 right-4 p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                    <Settings className="h-4 w-4" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4">
                <AdminNavMain isCollapsed={isCollapsed} />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700">
                <AdminNavUser isCollapsed={isCollapsed} />
                <AdminNavFooter isCollapsed={isCollapsed} />
            </div>
        </div>
    );
}
