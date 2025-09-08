'use client';

import Map from './Map';

export default function MapSection() {
  return (
    <div className="bg-white rounded-[15px] sm:rounded-[25px] p-0.5 shadow-lg h-[300px] sm:h-[400px] lg:h-[500px] relative overflow-hidden">
      <Map className="w-full h-full" />
    </div>
  );
}


