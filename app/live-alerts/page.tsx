'use client';

import Map from '../components/Map';
import proximityAlerts from '../../data/proximityAlerts.json';

export default function LiveAlertsPage() {
  const alerts = (proximityAlerts as any).alerts ?? [];

  return (
    <main className="min-h-[calc(100vh-70px)] bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 pt-2 sm:pt-4 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-h-[75vh]">
          {/* Full-height Map */}
          <div className="lg:col-span-2 h-[70vh] lg:h-[78vh]">
            <Map className="h-full" />
          </div>

          {/* Alerts Sidebar */}
          <aside className="bg-white rounded-[12px] sm:rounded-[16px] shadow-lg border border-gray-100 p-3 sm:p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L14.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">Live Alerts</h2>
              </div>
              <span className="text-xs text-gray-500">{alerts.length} active</span>
            </div>

            <div className="space-y-2 overflow-auto">
              {alerts.map((a: any) => (
                <div key={a.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold" style={{background:a['marker-color']}}>{(a.alertName || 'ALERT')[0]}</span>
                      <h3 className="text-sm font-semibold text-gray-900">{a.title}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">{a.alertName}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                    <div className="bg-gray-50 rounded px-2 py-1 flex items-center justify-between"><span>Time to Coast</span><strong>{a.timeToCoast}</strong></div>
                    <div className="bg-gray-50 rounded px-2 py-1 flex items-center justify-between"><span>Evacuation</span><strong>{a.evacuationTime}</strong></div>
                    <div className="bg-gray-50 rounded px-2 py-1 flex items-center justify-between"><span>Wind</span><strong>{a.windSpeed}</strong></div>
                    <div className="bg-gray-50 rounded px-2 py-1 flex items-center justify-between"><span>Observer</span><strong>{a.observer}</strong></div>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center text-sm text-gray-600 py-6">No active alerts.</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


