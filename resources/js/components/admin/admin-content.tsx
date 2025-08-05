import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface AdminContentProps {
    children: ReactNode;
    variant?: 'sidebar' | 'default';
    className?: string;
}

export function AdminContent({ children, variant = 'default', className }: AdminContentProps) {
    return (
        <main
            className={cn(
                'flex-1 bg-slate-900',
                variant === 'sidebar' && 'ml-0',
                className
            )}
        >
            {children}
        </main>
    );
}
