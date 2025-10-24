import PublicLayout from '@/layouts/public-layout';

export default function SellABusiness() {
  return (
    <PublicLayout auth={{ user: null }}>
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-[#010079] mb-4">Sell Your Business</h1>
        <p className="text-gray-700 text-lg">
          Let our experts help you list and sell your business efficiently.
        </p>
      </div>
    </PublicLayout>
  );
}
