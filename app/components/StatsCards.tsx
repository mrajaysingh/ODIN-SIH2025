'use client';

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2 sm:mt-4">
      {/* Lives Saved */}
      <div className="bg-white border-2 border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 mx-auto rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">Lives Saved</h3>
          <p className="text-lg sm:text-3xl font-bold text-green-700 mb-2">1,247</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Emergency Response</p>
        </div>
      </div>

      {/* Active Volunteers */}
      <div className="bg-white border-2 border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="mb-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 mx-auto rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">Active Volunteers</h3>
          <p className="text-lg sm:text-3xl font-bold text-blue-700 mb-2">3,456</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Community Support</p>
        </div>
      </div>

      {/* Total Reports */}
      <div className="bg-white border-2 border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="mb-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 mx-auto rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">Total Reports</h3>
          <p className="text-lg sm:text-3xl font-bold text-orange-700 mb-2">8,923</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Incident Reports</p>
        </div>
      </div>

      {/* Coastal Regions */}
      <div className="bg-white border-2 border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="mb-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 mx-auto rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">Coastal Regions</h3>
          <p className="text-lg sm:text-3xl font-bold text-purple-700 mb-2">127</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Monitored Areas</p>
        </div>
      </div>
    </div>
  );
}


