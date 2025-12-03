import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

interface AdminNavFooterProps {
    isCollapsed: boolean;
}

export function AdminNavFooter({ isCollapsed }: AdminNavFooterProps) {
    const footerItems = [
        {
            title: 'Support',
            href: 'https://support.example.com',
            icon: ExternalLink,
            external: true,
        },
    ];

    return (
        <div className="p-3">
            {!isCollapsed && (
                <div className="text-xs text-slate-500 font-medium mb-2 px-3">
                    ADMIN TOOLS
                </div>
            )}
            
            <div className="space-y-1">
                {footerItems.map((item) => {
                    const Icon = item.icon;
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-300 hover:bg-slate-700/30 rounded-lg transition-colors',
                                isCollapsed && 'justify-center'
                            )}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {!isCollapsed && (
                                <span>{item.title}</span>
                            )}
                            {item.external && !isCollapsed && (
                                <ExternalLink className="h-3 w-3 ml-auto" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
