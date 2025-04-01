'use client';

import Layout from '@/components/Layout';
import RoomSearch from '@/components/RoomSearch';

export default function Home() {
  return (
    <Layout>
      <div className="bg-white">
        <div className="relative isolate px-4 pt-8 lg:px-8">
          <div className="mx-auto max-w-2xl py-8 sm:py-16 lg:py-20">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Find Your Perfect Hotel Room
              </h1>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Search through our extensive collection of hotels and find the perfect room for your stay.
                Use our advanced search features to filter by location, price, amenities, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
      <RoomSearch />
    </Layout>
  );
} 