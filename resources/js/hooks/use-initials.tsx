import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string | undefined): string => {
        if (!fullName || typeof fullName !== 'string') return '';
        
        const names = fullName.trim().split(' ');

        if (names.length === 0) return '';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}

export function useInitialsFromNames() {
    return useCallback((firstName: string | undefined, lastName: string | undefined): string => {
        const first = firstName?.trim() || '';
        const last = lastName?.trim() || '';

        if (!first && !last) return '';
        if (!last) return first.charAt(0).toUpperCase();
        if (!first) return last.charAt(0).toUpperCase();

        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }, []);
}
