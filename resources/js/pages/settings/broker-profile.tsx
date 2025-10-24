import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import {
  Crown,
  Edit,
  Phone,
  Globe,
  MapPin,
  Building,
  User,
  Award,
  Calendar,
  CheckCircle,
} from 'lucide-react';

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

  const { data, setData, errors, processing, recentlySuccessful } = useForm<BrokerUpdateForm>({
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

    // ✅ Build form data manually to fix “required field” issues
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });

    router.post(route('broker.update'), formData, {
      forceFormData: true,
      onSuccess: () => setIsEditing(false),
      preserveScroll: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Broker Profile" />

      <SettingsLayout>
        <div className="space-y-8">
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

          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {(user as any).profile_photo ? (
                    <img
                      src={`/storage/${(user as any).profile_photo}`}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <div className="flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="flex items-center gap-2 mt-4">
              <Edit className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <form onSubmit={submit} className="space-y-6">
                <HeadingSmall title="Edit Profile" description="Update your broker information" />

                {/* Profile Photo */}
                <div className="grid gap-2">
                  <Label htmlFor="profile_photo">Update Profile Photo</Label>
                  <Input
                    id="profile_photo"
                    name="profile_photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setData('profile_photo', e.target.files?.[0] || null)}
                  />
                  <InputError message={errors.profile_photo} />
                </div>

                {/* Company Name */}
                <div className="grid gap-2">
                  <Label htmlFor="company_name">Company/Brokerage Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    required
                  />
                  <InputError message={errors.company_name} />
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="broker_phone">Business Phone</Label>
                  <Input
                    id="broker_phone"
                    name="broker_phone"
                    type="tel"
                    value={data.broker_phone}
                    onChange={(e) => setData('broker_phone', e.target.value)}
                    required
                  />
                  <InputError message={errors.broker_phone} />
                </div>

                {/* Serving Area */}
                <div className="grid gap-2">
                  <Label htmlFor="serving_area">Serving Area</Label>
                  <Input
                    id="serving_area"
                    name="serving_area"
                    value={data.serving_area}
                    onChange={(e) => setData('serving_area', e.target.value)}
                    required
                  />
                  <InputError message={errors.serving_area} />
                </div>

                {/* Website */}
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={data.website}
                    onChange={(e) => setData('website', e.target.value)}
                  />
                  <InputError message={errors.website} />
                </div>

                {/* Bio */}
                <div className="grid gap-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    required
                    rows={4}
                  />
                  <InputError message={errors.bio} />
                </div>

                {/* License Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="license_number">License Number</Label>
                    <Input
                      id="license_number"
                      name="license_number"
                      value={data.license_number}
                      onChange={(e) => setData('license_number', e.target.value)}
                    />
                    <InputError message={errors.license_number} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="license_state">License State</Label>
                    <Input
                      id="license_state"
                      name="license_state"
                      value={data.license_state}
                      onChange={(e) => setData('license_state', e.target.value)}
                    />
                    <InputError message={errors.license_state} />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-6">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
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
