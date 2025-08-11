import AppLogoIcon from '@/components/app-logo-icon';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { type SharedData } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            {/* Admin Warning Banner */}
            {isAdmin && (
                <div className="w-full max-w-4xl">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <div className="text-red-800">
                                <p className="font-medium text-sm">
                                    You are logged in as admin, be careful with the steps you will do in this portal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-6">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-2 flex items-center justify-center">
                                <img 
                                    src="/images/FullLogo_NoBuffer.png" 
                                    alt="Logo" 
                                    className="h-32 w-auto"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
