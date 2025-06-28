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
        
          // Seller only items
          {
            title: 'Add Listing',
            href: '/seller/listings/new',
            icon: PlusCircle,
            roles: ['seller', 'admin'],
          },
          {
            title: 'Listing Page',
            href: '/seller/listings',
            icon: ClipboardList,
            roles: ['seller', 'admin'],
          },
          {
            title: 'Browse Listings',
            href: '/seller/browse',
            icon: Eye,
            roles: ['seller', 'admin'],
          },
          {
            title: 'Account',
            href: '/seller/account',
            icon: User,
            roles: ['seller', 'admin'],
          },
          {
            title: 'Message Center',
            href: '/seller/messages',
            icon: MessageSquare,
            roles: ['seller', 'admin'],
          },
          {
            title: 'Feedback',
            href: '/seller/feedback',
            icon: Star,
            roles: ['seller', 'admin'],
          },
        
          // Buyer only items
          {
            title: 'Interested Listings',
            href: '/buyer/interested',
            icon: Heart,
            roles: ['buyer'],
          },
          {
            title: 'All Listings',
            href: '/buyer/listings',
            icon: ClipboardList,
            roles: ['buyer'],
          },
          {
            title: 'Recently Viewed',
            href: '/buyer/recent',
            icon: Eye,
            roles: ['buyer'],
          },
          {
            title: 'Message Center',
            href: '/buyer/messages',
            icon: MessageSquare,
            roles: ['buyer'],
          },
          {
            title: 'Account',
            href: '/buyer/account',
            icon: User,
            roles: ['buyer'],
          },
          {
            title: 'Feedback',
            href: '/buyer/feedback',
            icon: Star,
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
