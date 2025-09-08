'use client';

import MapSection from './MapSection';
import StatsCards from './StatsCards';
import ImpactSection from './ImpactSection';

interface HomeMainProps {
  className?: string;
}

export default function HomeMain({ className }: HomeMainProps) {
  return (
    <div className={className ?? ''}>
      <MapSection />
      <StatsCards />

      <ImpactSection />
    </div>
  );
}


