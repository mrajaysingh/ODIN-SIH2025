'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function useInView(targetRef: React.RefObject<Element>, rootMargin: string = '0px') {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
          }
        });
      },
      { root: null, rootMargin, threshold: 0.2 }
    );
    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [targetRef, rootMargin]);

  return isIntersecting;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString();
}

interface CountUpProps {
  target: number;
  durationMs?: number;
  isActive?: boolean;
}

function CountUp({ target, durationMs = 1200, isActive = false }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clampedTarget = useMemo(() => Math.max(0, target), [target]);

  useEffect(() => {
    if ((!isActive && !hasCompleted) || hasCompleted) return;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(progress);
      const nextValue = clampedTarget * eased;
      setDisplayValue(nextValue);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(clampedTarget);
        setHasCompleted(true);
        startTimeRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, durationMs, clampedTarget, hasCompleted]);

  return <>{formatNumber(displayValue)}</>;
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2 sm:mt-4">
      {/* Lives Saved */}
      <AnimatedStatCard
        label="Lives Saved"
        subtitle="Emergency Response"
        colorClasses="text-green-700 bg-green-100"
        iconSvg={<svg className="h-4 w-4 sm:h-6 sm:w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        target={1247}
      />

      {/* Active Volunteers */}
      <AnimatedStatCard
        label="Active Volunteers"
        subtitle="Community Support"
        colorClasses="text-blue-700 bg-blue-100"
        iconSvg={<svg className="h-4 w-4 sm:h-6 sm:w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        target={3456}
      />

      {/* Total Reports */}
      <AnimatedStatCard
        label="Total Reports"
        subtitle="Incident Reports"
        colorClasses="text-orange-700 bg-orange-100"
        iconSvg={<svg className="h-4 w-4 sm:h-6 sm:w-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        target={8923}
      />

      {/* Coastal Regions */}
      <AnimatedStatCard
        label="Coastal Regions"
        subtitle="Monitored Areas"
        colorClasses="text-purple-700 bg-purple-100"
        iconSvg={<svg className="h-4 w-4 sm:h-6 sm:w-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        target={127}
      />
    </div>
  );
}

interface AnimatedStatCardProps {
  label: string;
  subtitle: string;
  colorClasses: string; // expects like "text-green-700 bg-green-100"
  iconSvg: React.ReactNode;
  target: number;
}

function AnimatedStatCard({ label, subtitle, colorClasses, iconSvg, target }: AnimatedStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, '0px');
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isInView || isHovered;

  const [bgClass, textClass] = useMemo(() => {
    const parts = colorClasses.split(' ');
    const text = parts.find((c) => c.startsWith('text-')) ?? '';
    const bg = parts.find((c) => c.startsWith('bg-')) ?? '';
    return [bg, text];
  }, [colorClasses]);

  return (
    <div
      ref={cardRef}
      className="bg-white border-2 border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onTouchStart={() => setIsHovered(true)}
    >
      <div className="text-center">
        <div className="mb-2 sm:mb-3">
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${bgClass} mx-auto rounded-lg flex items-center justify-center`}>
            {iconSvg}
          </div>
        </div>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">{label}</h3>
        <p className={`text-lg sm:text-3xl font-bold ${textClass} mb-2`}>
          <CountUp target={target} isActive={isActive} />
        </p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{subtitle}</p>
      </div>
    </div>
  );
}


