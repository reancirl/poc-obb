import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
