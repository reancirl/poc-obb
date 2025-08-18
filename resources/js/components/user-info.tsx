import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials, useInitialsFromNames } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    const getInitialsFromNames = useInitialsFromNames();

    // Fallback to first_name + last_name if name is not available
    const displayName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const initials = user.name 
        ? getInitials(user.name) 
        : getInitialsFromNames(user.first_name, user.last_name);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
