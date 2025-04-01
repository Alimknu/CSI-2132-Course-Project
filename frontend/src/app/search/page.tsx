'use client';

import Layout from '@/components/Layout';
import RoomSearch from '@/components/RoomSearch';

export default function SearchPage() {
  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Search Rooms
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <RoomSearch />
          </div>
        </main>
      </div>
    </Layout>
  );
} 