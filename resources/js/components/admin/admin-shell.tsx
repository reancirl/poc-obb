import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface AdminShellProps {
    children: ReactNode;
    variant?: 'sidebar' | 'default';
    className?: string;
}

export function AdminShell({ children, variant = 'default', className }: AdminShellProps) {
    return (
        <div
            className={cn(
                'flex min-h-screen bg-slate-900',
                variant === 'sidebar' && 'flex-row',
                className
            )}
        >
            {children}
        </div>
    );
}
