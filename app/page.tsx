'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { PieChart } from '@mui/x-charts';
import HomeMain from './components/HomeMain';
import HomeSidebar from './components/HomeSidebar';
import ImpactSection from './components/ImpactSection';
import MapSection from './components/MapSection';

export default function Home() {
  const reportsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Handle mouse down for drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!reportsContainerRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - reportsContainerRef.current.offsetTop);
    setScrollTop(reportsContainerRef.current.scrollTop);
    
    // Pause auto-scroll animation
    const trackElement = reportsContainerRef.current.querySelector('.reports-track') as HTMLElement;
    if (trackElement) {
      trackElement.style.animationPlayState = 'paused';
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !reportsContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - reportsContainerRef.current.offsetTop;
    const walk = (y - startY) * 2; // Scroll speed multiplier
    reportsContainerRef.current.scrollTop = scrollTop - walk;
  };

  // Handle mouse up for drag end
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Resume auto-scroll animation
    if (reportsContainerRef.current) {
      const trackElement = reportsContainerRef.current.querySelector('.reports-track') as HTMLElement;
      if (trackElement) {
        trackElement.style.animationPlayState = 'running';
      }
    }
  };

  // Handle mouse leave for drag end
  const handleMouseLeave = () => {
    setIsDragging(false);
    
    // Resume auto-scroll animation
    if (reportsContainerRef.current) {
      const trackElement = reportsContainerRef.current.querySelector('.reports-track') as HTMLElement;
      if (trackElement) {
        trackElement.style.animationPlayState = 'running';
      }
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!reportsContainerRef.current) return;
    setIsDragging(true);
    setStartY(e.touches[0].pageY - reportsContainerRef.current.offsetTop);
    setScrollTop(reportsContainerRef.current.scrollTop);
    
    // Pause auto-scroll animation
    const trackElement = reportsContainerRef.current.querySelector('.reports-track') as HTMLElement;
    if (trackElement) {
      trackElement.style.animationPlayState = 'paused';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !reportsContainerRef.current) return;
    e.preventDefault();
    const y = e.touches[0].pageY - reportsContainerRef.current.offsetTop;
    const walk = (y - startY) * 1.5; // Reduced scroll speed for better mobile experience
    reportsContainerRef.current.scrollTop = scrollTop - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Resume auto-scroll animation with delay for better UX
    setTimeout(() => {
      if (reportsContainerRef.current) {
        const trackElement = reportsContainerRef.current.querySelector('.reports-track') as HTMLElement;
        if (trackElement) {
          trackElement.style.animationPlayState = 'running';
        }
      }
    }, 100);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 pt-2 sm:pt-4 pb-20 sm:pb-32 flex flex-col lg:flex-row gap-2 sm:gap-4">
        {/* Left: Map + Cards + Impact */}
        <HomeMain className="flex-1 w-full lg:w-auto" />

        {/* Right: Separate containers */}
        <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-2 sm:gap-4">
          {/* Recent Reports Container */}
          <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4 h-[200px] sm:h-[250px] overflow-hidden flex flex-col">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Recent Reports</h3>
            {/* Recent Reports container - Draggable */}
            <div 
              ref={reportsContainerRef}
              className={`reports-scroll bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex-1 overflow-y-auto cursor-grab select-none touch-pan-y ${
                isDragging ? 'cursor-grabbing' : ''
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
            <div className="reports-track space-y-3 text-sm text-gray-700">
              {/* Copy A */}
              <div className="space-y-3">
                {/* Card 1 */}
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-semibold">Critical</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      3 hours ago
                    </div>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900">Tsunami Warning</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    Visakhapatnam Coast, Andhra Pradesh
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>23 reports</div>
                    <div>ID: ALT-001</div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-semibold">High</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      2 mins ago
                    </div>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900">High Tide</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    Mumbai Marina, Maharashtra
                  </div>
                  <p className="mt-2 text-sm text-gray-700">Abnormal high tide levels causing coastal flooding in low-lying areas.</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>45 reports</div>
                    <div>ID: ALT-002</div>
                  </div>
                </div>
              </div>

              {/* Additional Reports for Scrolling */}
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 font-semibold">Medium</span>
                      <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-semibold">Resolved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      1 hour ago
                    </div>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900">Storm Surge Alert</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    Chennai Coast, Tamil Nadu
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>12 reports</div>
                    <div>ID: ALT-003</div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">Low</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      30 mins ago
                    </div>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900">Rip Current Warning</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    Goa Beaches, Goa
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>8 reports</div>
                    <div>ID: ALT-004</div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-semibold">Critical</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      5 hours ago
                    </div>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900">Cyclone Alert</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    Andaman & Nicobar Islands
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>67 reports</div>
                    <div>ID: ALT-005</div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-semibold">High</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                      15 mins ago
                    </div>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900">Flash Flood Warning</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    Kerala Backwaters, Kerala
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>34 reports</div>
                    <div>ID: ALT-006</div>
                  </div>
                </div>

                {/* Duplicate content for seamless infinite scroll */}
                <div className="space-y-3 -mt-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-semibold">High</span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                        2 mins ago
                      </div>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-gray-900">Tsunami Warning</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      Visakhapatnam Coast, Andhra Pradesh
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>23 reports</div>
                      <div>ID: ALT-001</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 font-semibold">Medium</span>
                        <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-semibold">Resolved</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                        1 hour ago
                      </div>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-gray-900">Storm Surge Alert</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      Chennai Coast, Tamil Nadu
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>12 reports</div>
                      <div>ID: ALT-003</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">Low</span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                        30 mins ago
                      </div>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-gray-900">Rip Current Warning</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      Goa Beaches, Goa
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>8 reports</div>
                      <div>ID: ALT-004</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-semibold">Medium</span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                        5 hours ago
                      </div>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-gray-900">Cyclone Alert</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      Andaman & Nicobar Islands
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>67 reports</div>
                      <div>ID: ALT-005</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 font-semibold">Medium</span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                        15 mins ago
                      </div>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-gray-900">Flash Flood Warning</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      Kerala Backwaters, Kerala
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>34 reports</div>
                      <div>ID: ALT-006</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Proximity Data Container */}
          <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-4 sm:p-6 mt-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Proximity Data</h3>
            <div className="flex justify-center">
              <PieChart
                width={280}
                height={220}
                sx={{ '& .MuiChartsLegend-root': { display: 'none' } }}
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'Within 5 km', color: '#ef4444' },
                      { id: 1, value: 20, label: 'Within 10 km', color: '#f97316' },
                      { id: 2, value: 30, label: 'Within 15 km', color: '#f59e0b' },
                      { id: 3, value: 40, label: '15+ km', color: '#10b981' },
                    ],
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -45,
                    endAngle: 225,
                    cx: 150,
                    cy: 110,
                  },
                ]}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                <span>Within 5 km</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#f97316' }} />
                <span>Within 10 km</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                <span>Within 15 km</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
                <span>15+ km</span>
              </div>
            </div>
          </div>

          {/* Contact Information Container - Government Style */}
          <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-4 sm:p-6 h-[470px] sm:h-[470px] overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            
            {/* Emergency Contacts Section */}
            <div className="mb-6">
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <h4 className="text-base font-semibold text-red-700 mb-3">Emergency Contacts</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Coast Guard Emergency:</span>
                    <span className="text-sm font-semibold text-red-700">1554</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Disaster Helpline:</span>
                    <span className="text-sm font-semibold text-red-700">1077</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">NDRF Emergency:</span>
                    <span className="text-sm font-semibold text-red-700">1070</span>
                  </div>
                </div>
              </div>
            </div>

            {/* General Inquiries Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-700">General Inquiries</h4>
              </div>
              <p className="text-sm text-gray-600 ml-6">info@odin.gov.in</p>
            </div>

            {/* Support Helpline Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-700">Support Helpline</h4>
              </div>
              <p className="text-sm text-gray-600 ml-6">1800-XXX-ODIN (6346)</p>
            </div>

            {/* Headquarters Section */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-700">Headquarters</h4>
              </div>
              <div className="ml-6">
                <p className="text-sm text-gray-600">Ministry of Earth Sciences</p>
                <p className="text-sm text-gray-600">Prithvi Bhavan, New Delhi</p>
              </div>
            </div>

          </div>

          {/* Safety Tips Container */}
          <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4 h-[850px] sm:h-[365px] overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-sm font-semibold text-blue-600">Safety Tips</h3>
            </div>
            
            <div className="space-y-2">
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-gray-700">Stay away from the coastline during high tide warnings</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-gray-700">Do not venture into water during storm conditions</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-gray-700">Follow evacuation orders immediately when issued</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-gray-700">Keep emergency kit ready with water, food, and first aid</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-gray-700">Monitor official weather updates regularly</p>
              </div>
            </div>
          </div>
        </div>
        </div>





        {/* Floating Report Hazard Button */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 floating-report-button">
          <Link
            href="/report-hazard"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-full shadow-lg flex items-center gap-2 sm:gap-3 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-semibold text-sm sm:text-lg hidden sm:inline">Report Hazard Now</span>
            <span className="font-semibold text-sm sm:hidden">Report</span>
          </Link>
        </div>
      </main>
  );
}
