import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ClipboardList, 
  Megaphone, 
  Globe, 
  Cog, 
  Code, 
  PlusCircle, 
  Eye, 
  User, 
  MessageSquare,
  Star,
  Heart
} from 'lucide-react';

type NavItemWithRoles = NavItem & {
    roles?: string[]; // Array of roles that can see this item (empty means all roles)
};

export function NavMain() {
    const page = usePage();
    const { auth } = page.props as any;
    const userRole = auth.user?.role || 'guest';
    const isBroker = auth.user?.is_broker || false;

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
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
            roles: ['admin'],
          },
          {
            title: 'Listing Management',
            href: '/admin/listings',
            icon: ClipboardList,
            roles: ['admin'],
          },
          {
            title: 'Marketing',
            href: '/admin/marketing',
            icon: Megaphone,
            roles: ['admin'],
          },
          {
            title: 'Manage Website',
            href: '/admin/website',
            icon: Globe,
            roles: ['admin'],
          },
          {
            title: 'Setup',
            href: '/admin/setup',
            icon: Cog,
            roles: ['admin'],
          },
          {
            title: 'Settings',
            href: '/admin/settings',
            icon: Cog,
            roles: ['admin'],
          },
          {
            title: 'Developer Settings',
            href: '/admin/dev-settings',
            icon: Code,
            roles: ['admin'],
          },
        
          // Member items (unified buying and selling)
          {
            title: 'Add Listing',
            href: '/member/listings/create',
            icon: PlusCircle,
            roles: ['member'],
          },
          {
            title: 'My Listings',
            href: '/member/listings',
            icon: ClipboardList,
            roles: ['member'],
          },
          {
            title: 'Interested Listings',
            href: '/member/interested',
            icon: Heart,
            roles: ['member'],
          },
          {
            title: 'All Listings',
            href: '/listings',
            icon: Eye,
            roles: ['member'],
          },
          {
            title: 'Message Center',
            href: '/messages',
            icon: MessageSquare,
            roles: ['member'],
          },
          {
            title: 'Account',
            href: isBroker ? '/broker/profile' : '/settings/account',
            icon: User,
            roles: ['member', 'admin'],
          },
          {
            title: 'Feedback',
            href: '/member/feedback',
            icon: Star,
            roles: ['member', 'admin'],
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
