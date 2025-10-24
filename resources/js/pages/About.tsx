import PublicLayout from '@/layouts/public-layout';

export default function About() {
  return (
    <PublicLayout auth={{ user: null }}>
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-[#010079] mb-4">About Us</h1>
        <p className="text-gray-700 text-lg">Learn more about our mission and values.</p>
      </div>
    </PublicLayout>
  );
}
