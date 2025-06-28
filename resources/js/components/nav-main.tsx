import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';

type NavItemWithRoles = NavItem & {
    roles?: string[]; // Array of roles that can see this item (empty means all roles)
};

export function NavMain() {
    const page = usePage();
    const { auth } = page.props as any;
    const userRole = auth.user?.role || 'guest';

    // Define navigation items with role-based visibility
    const navItems: NavItemWithRoles[] = [
        // Common items for all authenticated users
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        // Admin only items
        {
            title: 'Users',
            href: '/admin/users',
            icon: Users,
            roles: ['admin'],
        },
        {
            title: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            roles: ['admin'],
        },
        // Seller only items
        {
            title: 'Products',
            href: '/seller/products',
            icon: Package,
            roles: ['seller', 'admin'],
        },
        {
            title: 'Orders',
            href: '/seller/orders',
            icon: ShoppingCart,
            roles: ['seller', 'admin'],
        },
        // Buyer only items
        {
            title: 'My Orders',
            href: '/buyer/orders',
            icon: ShoppingCart,
            roles: ['buyer'],
        },
        {
            title: 'Wishlist',
            href: '/buyer/wishlist',
            icon: Package,
            roles: ['buyer'],
        },
    ];

    // Filter items based on user role
    const filteredItems = navItems.filter(
        (item) => !item.roles || item.roles.includes(userRole)
    );

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            asChild 
                            isActive={page.url.startsWith(item.href)} 
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="w-5 h-5" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
