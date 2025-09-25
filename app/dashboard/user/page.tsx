"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StatsCards from "../../components/StatsCards";
import MapSection from "../../components/MapSection";

export default function UserDashboard(): React.ReactElement {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = (): void => {
    try {
      // Clear common client-side auth storages
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
        // Clear simple cookies (best-effort)
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }
    } catch {}
    router.replace("/login");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const recentReports = [
    {
      id: 1,
      type: "Flood Alert",
      location: "Kerala Coast",
      time: "2 hours ago",
      status: "Active",
      severity: "High"
    },
    {
      id: 2,
      type: "Tsunami Warning",
      location: "Tamil Nadu",
      time: "5 hours ago",
      status: "Resolved",
      severity: "Critical"
    },
    {
      id: 3,
      type: "Oil Spill",
      location: "Mumbai Port",
      time: "1 day ago",
      status: "Under Investigation",
      severity: "Medium"
    }
  ];

  const userStats = [
    { label: "Reports Submitted", value: 12, icon: "📝", color: "blue" },
    { label: "Alerts Received", value: 8, icon: "🚨", color: "orange" },
    { label: "Safety Score", value: 95, icon: "🛡️", color: "green" },
    { label: "Community Rank", value: 156, icon: "🏆", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back! Stay informed and safe.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleNavigation("/report-hazard")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Report Hazard</span>
              </button>
        <button
          onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "alerts", label: "Alerts", icon: "🚨" },
            { id: "reports", label: "My Reports", icon: "📝" },
            { id: "community", label: "Community", icon: "👥" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {userStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'orange' ? 'bg-orange-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Impact</h2>
              <StatsCards />
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Map</h2>
              <MapSection />
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
                <p className="text-sm text-gray-500">Stay updated with the latest safety alerts</p>
              </div>
              <div className="divide-y divide-gray-100">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          report.severity === 'Critical' ? 'bg-red-500' :
                          report.severity === 'High' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{report.type}</h3>
                          <p className="text-sm text-gray-500">{report.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{report.time}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'Active' ? 'bg-red-100 text-red-800' :
                          report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">My Reports</h2>
                <p className="text-sm text-gray-500">Track your submitted incident reports</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                  <p className="text-gray-500 mb-4">Start by reporting a hazard or incident in your area</p>
                  <button
                    onClick={() => handleNavigation("/report-hazard")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Community</h2>
                <p className="text-sm text-gray-500">Connect with other users and share information</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
                    <p className="text-sm text-gray-600 mb-4">Join discussions and share safety tips</p>
                    <button
                      onClick={() => handleNavigation("/community")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Visit Forum
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Safety Tips</h3>
                    <p className="text-sm text-gray-600 mb-4">Learn how to stay safe during disasters</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      View Tips
        </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


