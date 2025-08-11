import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Crown, Edit, Phone, Globe, MapPin, Building, User, Award, Calendar, CheckCircle } from 'lucide-react';

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
title: 'Broker Profile',
href: '/broker/profile',
},
];

type BrokerUpdateForm = {
company_name: string;
broker_phone: string;
serving_area: string;
website: string;
bio: string;
license_number: string;
license_state: string;
profile_photo: File | null;
};

export default function BrokerProfile({ flash }: { flash?: { success?: string } }) {
const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<BrokerUpdateForm>({
        company_name: (user as any).company_name || '',
        broker_phone: (user as any).broker_phone || '',
        serving_area: (user as any).serving_area || '',
        website: (user as any).website || '',
        bio: (user as any).bio || '',
        license_number: (user as any).license_number || '',
        license_state: (user as any).license_state || '',
        profile_photo: null,
        });

        const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('broker.update'), {
        onSuccess: () => setIsEditing(false),
        });
        };

        const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
        };

        return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Broker Profile" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* Success Message */}
                    {(flash?.success || recentlySuccessful) && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <p className="text-green-800 text-sm font-medium">
                                {flash?.success || 'Profile updated successfully!'}
                            </p>
                        </div>
                    </div>
                    )}

                    {/* Profile Header */}
                    <div
                        className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-6">
                                {/* Profile Photo */}
                                <div className="flex-shrink-0">
                                    {(user as any).profile_photo ? (
                                    <img src={`/storage/${(user as any).profile_photo}`} alt={user.name}
                                        className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg" />
                                    ) : (
                                    <div
                                        className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                                        <User className="h-12 w-12 text-gray-400" />
                                    </div>
                                    )}
                                </div>

                                {/* Broker Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                        <div
                                            className="flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            <Crown className="h-4 w-4" />
                                            Verified Broker
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            <span className="font-medium">{(user as any).company_name}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>Serving: {(user as any).serving_area}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Broker since: {formatDate((user as any).broker_upgraded_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={()=> setIsEditing(!isEditing)}
                            variant="outline"
                            className="flex items-center gap-2 mt-4"
                            >
                            <Edit className="h-4 w-4" />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium text-gray-900">
                                        <a href={`tel:${(user as any).broker_phone}`} className="hover:text-blue-600">
                                            {(user as any).broker_phone}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                                    <Globe className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Website</p>
                                    <p className="font-medium text-gray-900">
                                        {(user as any).website ? (
                                        <a href={(user as any).website} target="_blank" rel="noopener noreferrer"
                                            className="hover:text-blue-600 underline">
                                            {(user as any).website}
                                        </a>
                                        ) : (
                                        <span className="text-gray-400">Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {(user as any).bio}
                            </p>
                        </div>
                    </div>

                    {/* License Information */}
                    {((user as any).license_number || (user as any).license_state) && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">License Information</h2>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                                <Award className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Professional License</p>
                                <p className="font-medium text-gray-900">
                                    {(user as any).license_number && `#${(user as any).license_number}`}
                                    {(user as any).license_number && (user as any).license_state && ' - '}
                                    {(user as any).license_state}
                                </p>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Edit Form */}
                    {isEditing && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <HeadingSmall title="Edit Profile" description="Update your broker information" />

                            {/* Profile Photo */}
                            <div className="grid gap-2">
                                <Label htmlFor="profile_photo">Update Profile Photo</Label>
                                <Input id="profile_photo" type="file" accept="image/*" onChange={(e)=>
                                setData('profile_photo', e.target.files?.[0] || null)}
                                className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.profile_photo} />
                            </div>

                            {/* Company Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_name">Company/Brokerage Name</Label>
                                <Input id="company_name" value={data.company_name} onChange={(e)=>
                                setData('company_name', e.target.value)}
                                required
                                className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.company_name} />
                            </div>

                            {/* Phone */}
                            <div className="grid gap-2">
                                <Label htmlFor="broker_phone">Business Phone</Label>
                                <Input id="broker_phone" type="tel" value={data.broker_phone} onChange={(e)=>
                                setData('broker_phone', e.target.value)}
                                required
                                className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.broker_phone} />
                            </div>

                            {/* Serving Area */}
                            <div className="grid gap-2">
                                <Label htmlFor="serving_area">Serving Area</Label>
                                <Input id="serving_area" value={data.serving_area} onChange={(e)=>
                                setData('serving_area', e.target.value)}
                                required
                                className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.serving_area} />
                            </div>

                            {/* Website */}
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" type="url" value={data.website} onChange={(e)=>
                                setData('website', e.target.value)}
                                className="block w-full"
                                />
                                <InputError className="mt-2" message={errors.website} />
                            </div>

                            {/* Bio */}
                            <div className="grid gap-2">
                                <Label htmlFor="bio">Professional Bio</Label>
                                <Textarea id="bio" value={data.bio} onChange={(e)=> setData('bio', e.target.value)}
                                        required
                                        rows={4}
                                        className="block w-full"
                                    />
                                    <InputError className="mt-2" message={errors.bio} />
                                </div>

                                {/* License Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="license_number">License Number</Label>
                                        <Input
                                            id="license_number"
                                            value={data.license_number}
                                            onChange={(e) => setData('license_number', e.target.value)}
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
                                            className="block w-full"
                                        />
                                        <div>
                                        <p className="text-sm text-gray-500">Serving: {(user as any).serving_area}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-500">Broker since: {formatDate((user as any).broker_upgraded_at)}</p>
                                    </div>
                                        <InputError className="mt-2" message={errors.license_state} />
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-3 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
