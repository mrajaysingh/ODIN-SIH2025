'use client';

import { useRef, useState } from 'react';

interface HomeSidebarProps {
  reportsContainerRef: React.RefObject<HTMLDivElement>;
  handlers: {
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleMouseLeave: () => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
  };
  isDragging: boolean;
}

export default function HomeSidebar({ reportsContainerRef, handlers, isDragging }: HomeSidebarProps) {
  return (
    <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-2 sm:gap-4">
      {/* Recent Reports */}
      <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4 h-[200px] sm:h-[250px] overflow-hidden flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Recent Reports</h3>
        <div
          ref={reportsContainerRef}
          className={`reports-scroll bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex-1 overflow-y-auto cursor-grab select-none touch-pan-y ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          onMouseDown={handlers.handleMouseDown}
          onMouseMove={handlers.handleMouseMove}
          onMouseUp={handlers.handleMouseUp}
          onMouseLeave={handlers.handleMouseLeave}
          onTouchStart={handlers.handleTouchStart}
          onTouchMove={handlers.handleTouchMove}
          onTouchEnd={handlers.handleTouchEnd}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="reports-track space-y-3 text-sm text-gray-700">
            {/* Example entry */}
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
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-4 sm:p-6 h-[450px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        </div>
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <h4 className="text-base font-semibold text-red-700 mb-3">Emergency Contacts</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-sm text-red-700">Coast Guard Emergency:</span><span className="text-sm font-semibold text-red-700">1554</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-red-700">Disaster Helpline:</span><span className="text-sm font-semibold text-red-700">1077</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-red-700">NDRF Emergency:</span><span className="text-sm font-semibold text-red-700">1070</span></div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2"><svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><h4 className="text-sm font-semibold text-gray-700">General Inquiries</h4></div>
          <p className="text-sm text-gray-600 ml-6">info@odin.gov.in</p>
        </div>
        <div className="mb-4"><div className="flex items-center gap-2 mb-2"><svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><h4 className="text-sm font-semibold text-gray-700">Support Helpline</h4></div><p className="text-sm text-gray-600 ml-6">1800-XXX-ODIN (6346)</p></div>
        <div><div className="flex items-center gap-2 mb-2"><svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><h4 className="text-sm font-semibold text-gray-700">Headquarters</h4></div><div className="ml-6 text-sm text-gray-600"><p>Ministry of Earth Sciences</p><p>Prithvi Bhavan, New Delhi</p></div></div>
      </div>

      {/* Safety Tips */}
      <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3"><svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><h3 className="text-sm font-semibold text-blue-600">Safety Tips</h3></div>
        <div className="space-y-2">
          {[
            'Stay away from the coastline during high tide warnings',
            'Do not venture into water during storm conditions',
            'Follow evacuation orders immediately when issued',
            'Keep emergency kit ready with water, food, and first aid',
            'Monitor official weather updates regularly',
          ].map((tip) => (
            <div key={tip} className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-xs text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Ratio */}
      <div className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3a8 8 0 100 16 8 8 0 000-16zm0 0v8l5 3"/></svg>
          <h3 className="text-sm font-semibold text-emerald-700">Safety Ratio</h3>
        </div>
        {/* Example ratio - replace with live values when available */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Lives Saved</span>
            <span className="font-semibold text-emerald-700">86%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '86%' }} />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Lives Lost</span>
            <span className="font-semibold text-red-700">14%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-red-100 overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: '14%' }} />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center">
              <div className="text-lg font-bold text-emerald-700">1,247</div>
              <div className="text-[10px] uppercase tracking-wide text-emerald-800">Saved</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-center">
              <div className="text-lg font-bold text-red-700">203</div>
              <div className="text-[10px] uppercase tracking-wide text-red-800">Lost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


