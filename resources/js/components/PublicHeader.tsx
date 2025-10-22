import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Buy a Business', href: '/buy' },
    { title: 'Sell a Business', href: '/sell' },
    { title: 'Brokers', href: '/brokers' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Mobile menu */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-8">
              <nav className="flex flex-col space-y-6 text-lg font-medium">
                {navLinks.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="pt-6 border-t border-gray-200 mt-4">
                  <Link
                    href="/login"
                    className="block py-2 text-gray-800 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-blue-600 font-semibold hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Join
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/logo_monarch.svg"
              alt="Monarch"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex flex-1 justify-end pr-24 items-center space-x-8">
          {/* Added pr-24 to push nav slightly left */}
          {navLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden lg:flex flex-1 justify-end items-center space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
          >
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}
