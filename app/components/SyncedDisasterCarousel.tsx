'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Slide = {
  id: string;
  year: string;
  title: string;
  summary: string;
  livesLost: number;
  livesSaved: number;
  image: string; // path in /public
};

const SLIDE_INTERVAL_MS = 4500;

export default function SyncedDisasterCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        id: 'high-tide',
        year: '2024',
        title: 'High Tide Near Oceanfront',
        summary:
          'Large swells impacted coastal infrastructure. Timely barricades and route diversions limited risk to residents.',
        livesLost: 0,
        livesSaved: 180,
        image: '/incident/high-tide-near-ocean.png',
      },
      {
        id: 'kerala-flood',
        year: '2023',
        title: 'Kerala Flood Response',
        summary:
          'Swift-boat teams evacuated stranded families while shelters provided essentials across affected districts.',
        livesLost: 11,
        livesSaved: 1250,
        image: '/incident/kerala-flood.jpg',
      },
      {
        id: 'urban-flood',
        year: '2022',
        title: 'Urban Flooding & Relief',
        summary:
          'Continuous rain triggered waterlogging; community volunteers assisted children and the elderly to safety.',
        livesLost: 4,
        livesSaved: 640,
        image: '/incident/ocean-flood.png',
      },
      {
        id: 'ship-fire',
        year: '2021',
        title: 'Oil Ship On Fire — Offshore',
        summary:
          'Marine rescue coordinated with firefighting tugs to control blaze and secure crew.',
        livesLost: 2,
        livesSaved: 36,
        image: '/incident/oil-ship-on-fire.jpg',
      },
      {
        id: 'oil-spill',
        year: '2021',
        title: 'Oil Spill Near Reef',
        summary:
          'Booms deployed quickly to contain slick; shoreline cleanup teams minimized ecological damage.',
        livesLost: 0,
        livesSaved: 0,
        image: '/incident/oil-spill-in-ocean.png',
      },
      {
        id: 'plane-ditching',
        year: '2020',
        title: 'Aircraft Ditching — Coastal Waters',
        summary:
          'Rapid response boats assisted passengers; coordinated triage ensured speedy medical care.',
        livesLost: 1,
        livesSaved: 147,
        image: '/incident/place-crash-in-ocean.jpg',
      },
      {
        id: 'punjab-flood',
        year: '2019',
        title: 'Inland Flood Rope Rescue',
        summary:
          'Teams executed rope-based evacuations amid strong currents to reach isolated residents.',
        livesLost: 3,
        livesSaved: 220,
        image: '/incident/punjab-flood.jpg',
      },
      {
        id: 'tsunami-urban',
        year: '2004',
        title: 'Tsunami — Coastal Communities',
        summary:
          'Catastrophic waves devastated shoreline settlements, reinforcing the need for early-warning systems.',
        livesLost: 230000,
        livesSaved: 0,
        image: '/incident/tsunami-coastal-area.jpg',
      },
      {
        id: 'tsunami-current',
        year: '2004',
        title: 'Ocean Currents After Tsunami',
        summary:
          'Post-event currents carried debris inland; recovery crews worked for months to restore access.',
        livesLost: 0,
        livesSaved: 0,
        image: '/incident/tsunami-ocean-current-century.jpg',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const start = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (!isHoveringRef.current) {
          setIndex((i) => (i + 1) % slides.length);
        }
      }, SLIDE_INTERVAL_MS);
    };
    start();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section
      className="mt-3 sm:mt-6 bg-white rounded-[12px] sm:rounded-[16px] shadow-lg overflow-hidden"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: image */}
        <div
          className="relative aspect-video lg:aspect-auto lg:h-[320px] bg-gray-900 select-none cursor-pointer"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 40) {
              setIndex((i) => (dx > 0 ? (i - 1 + slides.length) % slides.length : (i + 1) % slides.length));
            }
            touchStartX.current = null;
          }}
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
        >
          {/* Cross-fade */}
          <div
            key={slide.id}
            className="absolute inset-0 animate-fade"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/40" />
          {/* Manual controls */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
            <button
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="pointer-events-auto h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center shadow-md"
              aria-label="Previous slide"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="pointer-events-auto h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center shadow-md"
              aria-label="Next slide"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* Pager dots */}
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/90'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: details */}
        <div className="p-4 sm:p-6 flex flex-col justify-center cursor-pointer" onClick={() => setIndex((i) => (i + 1) % slides.length)}>
          <div key={slide.id} className="animate-slide-up">
            <div className="text-xs uppercase tracking-wide text-gray-500">Year {slide.year}</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-1">{slide.title}</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">{slide.summary}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="text-xs text-red-700">Lives Lost</div>
                <div className="text-xl font-bold text-red-700">{slide.livesLost.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="text-xs text-green-700">Lives Saved</div>
                <div className="text-xl font-bold text-green-700">{slide.livesSaved.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade {
          animation: fadeIn 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0.2; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}


