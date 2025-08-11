// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, CheckCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify your email" description="We've sent a verification link to your email address. Please check your inbox and click the link to complete your registration.">
            <Head title="Email verification" />

            <div className="space-y-6">
                {/* Email Icon */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                        <Mail className="h-8 w-8 text-[#010079]" />
                    </div>
                </div>

                {/* Success Message */}
                {status === 'verification-link-sent' && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <div className="text-green-800">
                                <p className="text-sm font-medium">
                                    Verification email sent!
                                </p>
                                <p className="text-sm mt-1">
                                    A new verification link has been sent to your email address.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                        Can't find the email? Check your spam folder or request a new verification link.
                    </p>
                </div>

                {/* Action Buttons */}
                <form onSubmit={submit} className="space-y-4">
                    <Button 
                        disabled={processing} 
                        className="w-full text-white py-3 rounded-lg text-sm font-medium flex justify-center items-center hover:opacity-90"
                        style={{ backgroundColor: '#010079' }}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Resend verification email
                    </Button>

                    <div className="text-center">
                        <TextLink 
                            href={route('logout')} 
                            method="post" 
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Log out
                        </TextLink>
                    </div>
                </form>

                {/* Help Text */}
                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Need help? Contact our support team if you're having trouble receiving the verification email.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
