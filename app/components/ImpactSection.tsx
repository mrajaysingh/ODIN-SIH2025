'use client';

import { useState } from 'react';
import SyncedDisasterCarousel from './SyncedDisasterCarousel';

const YOUTUBE_ID = 'z4Peym_WWak';

export default function ImpactSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mt-3 sm:mt-6 bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
      {/* Custom Video Player */}
      <div className="aspect-video w-full overflow-hidden rounded-[10px] sm:rounded-[12px] border border-gray-200 relative bg-black">
        {!playing ? (
          <button
            className="group absolute inset-0 w-full h-full"
            onClick={() => setPlaying(true)}
            aria-label="Play ODIN video"
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 group-hover:bg-white transition grid place-items-center shadow-lg">
                <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="mt-3 text-sm sm:text-base font-medium opacity-90">ODIN — Saving Lives from Ocean Disasters</p>
            </div>
          </button>
        ) : (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&modestbranding=1&rel=0`}
            title="ODIN - Saving Lives from Ocean Disasters"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
        {/* Simple footer controls */}
        {!playing && (
          <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between text-white/90">
            <span className="text-xs sm:text-sm">Click to play</span>
            <a
              href={`https://youtu.be/${YOUTUBE_ID}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline decoration-white/50 hover:decoration-white"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Saving Lives. Building Resilience.</h3>
        <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4">
          Every minute matters when ocean hazards strike.{' '}
          <span className="px-1 rounded bg-yellow-50 font-semibold text-yellow-900">O.D.I.N.</span>{' '}
          helps governments, responders and coastal communities act fast with verified alerts, live reports and
          clear guidance. From tsunami warnings and storm surges to rip-current risks, our mission is to reduce
          loss of life through timely information and community awareness.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="text-2xl sm:text-3xl font-bold text-green-700">1,247+</div>
            <div className="text-xs sm:text-sm text-green-800">Lives supported by timely alerts</div>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700">3,456+</div>
            <div className="text-xs sm:text-sm text-blue-800">Volunteers and responders onboard</div>
          </div>
        </div>
      </div>

      {/* Full-width synced carousel */}
      <div className="lg:col-span-2">
        <SyncedDisasterCarousel />
      </div>

      {/* Support O.D.I.N. Section */}
      <div className="lg:col-span-2 mt-2 sm:mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-[12px] sm:rounded-[16px] border border-gray-200 overflow-hidden shadow-md min-h-[360px] sm:min-h-[420px] lg:min-h-[520px]">
          {/* Left: Image */}
          <div className="relative h-full">
            <img
              src="/incident/support/support-odin.jpg"
              alt="Support O.D.I.N."
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right: Content */}
          <div className="p-4 sm:p-6 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Support O.D.I.N.</h3>
            <p className="mt-2 text-gray-700 leading-relaxed">
              Help us build resilient coastal communities with faster alerts, better reporting tools, and
              community training. Your support keeps this platform free and accessible for everyone.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="#" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                Donate Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </a>
              <a href="#" className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-900 font-medium px-4 py-2 rounded-lg bg-white transition-colors">
                Become a Volunteer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


