import PublicLayout from '@/layouts/public-layout';

export default function Contact() {
  return (
    <PublicLayout auth={{ user: null }}>
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-[#010079] mb-4">Contact Us</h1>
        <p className="text-gray-700 text-lg">You can reach us through this form or at contact@example.com.</p>
      </div>
    </PublicLayout>
  );
}
