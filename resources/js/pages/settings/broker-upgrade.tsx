import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Crown, Upload, User, Building, Phone, Globe, MapPin, FileText, Award } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Broker Upgrade',
        href: '/broker/upgrade',
    },
];

type BrokerUpgradeForm = {
    company_name: string;
    broker_phone: string;
    serving_area: string;
    website: string;
    bio: string;
    license_number: string;
    license_state: string;
    profile_photo: File | null;
};

export default function BrokerUpgrade() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, errors, processing } = useForm<BrokerUpgradeForm>({
        company_name: '',
        broker_phone: auth.user.phone || '',
        serving_area: '',
        website: '',
        bio: '',
        license_number: '',
        license_state: '',
        profile_photo: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('broker.upgrade'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upgrade to Broker" />

            <div className="p-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
                            <Crown className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Upgrade to Broker</h1>
                        <p className="text-gray-600 mt-2">
                            Become a verified business broker and showcase your professional profile to potential clients.
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Broker Benefits</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            Professional broker profile page
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            Enhanced credibility with verified status
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            Showcase your expertise and service area
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            Connect with more potential clients
                        </li>
                    </ul>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall title="Professional Information" description="Tell us about your business and expertise" />

                    {/* Profile Photo */}
                    <div className="grid gap-2">
                        <Label htmlFor="profile_photo" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile Photo
                        </Label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-300">
                                <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="profile_photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('profile_photo', e.target.files?.[0] || null)}
                                    className="block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload a professional headshot (JPG, PNG, GIF - Max 2MB)
                                </p>
                            </div>
                        </div>
                        <InputError className="mt-2" message={errors.profile_photo} />
                    </div>

                    {/* Company Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="company_name" className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Company/Brokerage Name *
                        </Label>
                        <Input
                            id="company_name"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            required
                            placeholder="e.g., ABC Business Brokers"
                            className="block w-full"
                        />
                        <InputError className="mt-2" message={errors.company_name} />
                    </div>

                    {/* Phone */}
                    <div className="grid gap-2">
                        <Label htmlFor="broker_phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Business Phone *
                        </Label>
                        <Input
                            id="broker_phone"
                            type="tel"
                            value={data.broker_phone}
                            onChange={(e) => setData('broker_phone', e.target.value)}
                            required
                            placeholder="(555) 123-4567"
                            className="block w-full"
                        />
                        <InputError className="mt-2" message={errors.broker_phone} />
                    </div>

                    {/* Serving Area */}
                    <div className="grid gap-2">
                        <Label htmlFor="serving_area" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Serving Area *
                        </Label>
                        <Input
                            id="serving_area"
                            value={data.serving_area}
                            onChange={(e) => setData('serving_area', e.target.value)}
                            required
                            placeholder="e.g., Southern California, Los Angeles County"
                            className="block w-full"
                        />
                        <InputError className="mt-2" message={errors.serving_area} />
                    </div>

                    {/* Website */}
                    <div className="grid gap-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Website
                        </Label>
                        <Input
                            id="website"
                            type="url"
                            value={data.website}
                            onChange={(e) => setData('website', e.target.value)}
                            placeholder="https://www.yourcompany.com"
                            className="block w-full"
                        />
                        <InputError className="mt-2" message={errors.website} />
                    </div>

                    {/* Bio */}
                    <div className="grid gap-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Professional Bio *
                        </Label>
                        <Textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            required
                            rows={4}
                            placeholder="Tell potential clients about your experience, expertise, and what makes you a great business broker..."
                            className="block w-full"
                        />
                        <p className="text-xs text-gray-500">
                            {data.bio.length}/1000 characters
                        </p>
                        <InputError className="mt-2" message={errors.bio} />
                    </div>

                    {/* License Information */}
                    <div className="space-y-4">
                        <HeadingSmall title="License Information (Optional)" description="Add your professional license details" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="license_number" className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    License Number
                                </Label>
                                <Input
                                    id="license_number"
                                    value={data.license_number}
                                    onChange={(e) => setData('license_number', e.target.value)}
                                    placeholder="e.g., 12345678"
                                    className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.license_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="license_state">License State</Label>
                                <Input
                                    id="license_state"
                                    value={data.license_state}
                                    onChange={(e) => setData('license_state', e.target.value)}
                                    placeholder="e.g., California"
                                    className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.license_state} />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-2"
                        >
                            {processing ? 'Upgrading...' : 'Upgrade to Broker'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
