import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface AdminCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'gradient' | 'stat';
}

interface AdminCardHeaderProps {
    children: ReactNode;
    className?: string;
}

interface AdminCardContentProps {
    children: ReactNode;
    className?: string;
}

interface AdminCardTitleProps {
    children: ReactNode;
    className?: string;
}

interface AdminCardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function AdminCard({ children, className, variant = 'default' }: AdminCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border transition-all duration-200 hover:shadow-lg',
                variant === 'default' && 'bg-slate-800 border-slate-700 hover:border-slate-600',
                variant === 'gradient' && 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600',
                variant === 'stat' && 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 hover:border-blue-700/50',
                className
            )}
        >
            {children}
        </div>
    );
}

export function AdminCardHeader({ children, className }: AdminCardHeaderProps) {
    return (
        <div className={cn('flex flex-row items-center justify-between space-y-0 p-6 pb-3', className)}>
            {children}
        </div>
    );
}

export function AdminCardContent({ children, className }: AdminCardContentProps) {
    return (
        <div className={cn('p-6 pt-0', className)}>
            {children}
        </div>
    );
}

export function AdminCardTitle({ children, className }: AdminCardTitleProps) {
    return (
        <h3 className={cn('text-sm font-semibold tracking-tight text-slate-200', className)}>
            {children}
        </h3>
    );
}

export function AdminCardDescription({ children, className }: AdminCardDescriptionProps) {
    return (
        <p className={cn('text-xs text-slate-400 mt-1', className)}>
            {children}
        </p>
    );
}
