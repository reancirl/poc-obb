import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Crown, ArrowRight, CheckCircle, User, Building, Phone, Globe, MapPin, FileText, Award } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Account settings',
        href: '/settings/account',
    },
];

export default function AccountSettings() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const isBroker = (user as any).is_broker || false;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall title="Account Information" description="Manage your account type and professional status" />

                    {/* Current Account Status */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isBroker ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                                    {isBroker ? (
                                        <Crown className="h-6 w-6 text-yellow-600" />
                                    ) : (
                                        <User className="h-6 w-6 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {isBroker ? 'Verified Broker Account' : 'Member Account'}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {isBroker 
                                            ? 'You have a professional broker account with enhanced features.'
                                            : 'You currently have a standard member account.'
                                        }
                                    </p>
                                    {isBroker && (user as any).broker_upgraded_at && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Broker since: {formatDate((user as any).broker_upgraded_at)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {isBroker && (
                                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    <CheckCircle className="h-4 w-4" />
                                    Verified
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Broker Information (if broker) */}
                    {isBroker && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(user as any).company_name && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                                            <Building className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Company</p>
                                            <p className="font-medium text-gray-900">{(user as any).company_name}</p>
                                        </div>
                                    </div>
                                )}

                                {(user as any).broker_phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                                            <Phone className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Business Phone</p>
                                            <p className="font-medium text-gray-900">{(user as any).broker_phone}</p>
                                        </div>
                                    </div>
                                )}

                                {(user as any).serving_area && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                                            <MapPin className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Serving Area</p>
                                            <p className="font-medium text-gray-900">{(user as any).serving_area}</p>
                                        </div>
                                    </div>
                                )}

                                {(user as any).website && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                                            <Globe className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <p className="font-medium text-gray-900">
                                                <a 
                                                    href={(user as any).website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="hover:text-blue-600 underline"
                                                >
                                                    {(user as any).website}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Broker Upgrade Section */}
                    {!isBroker ? (
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200">
                                        <Crown className="h-6 w-6 text-yellow-700" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upgrade to Broker</h3>
                                        <p className="text-gray-700 mt-1 mb-4">
                                            Become a verified business broker and unlock professional features.
                                        </p>
                                        
                                        {/* Benefits List */}
                                        <ul className="space-y-2 text-sm text-gray-700 mb-4">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                Professional broker profile page
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                Enhanced credibility with verified status
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                Showcase your expertise and service area
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                Connect with more potential clients
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end mt-4">
                                <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                    <Link href="/broker/upgrade">
                                        Upgrade to Broker
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Manage Broker Profile</h3>
                                    <p className="text-gray-600 mt-1">
                                        Update your professional information and broker profile.
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <Link href="/broker/profile">
                                        Edit Profile
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
