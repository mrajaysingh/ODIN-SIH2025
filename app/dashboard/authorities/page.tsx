"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import StatsCards from "../../components/StatsCards";
import MapSection from "../../components/MapSection";

export default function AuthoritiesDashboard(): React.ReactElement {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [showEmergencyDropdown, setShowEmergencyDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEmergencyDropdown(false);
      }
    };

    if (showEmergencyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmergencyDropdown]);

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

  const pendingReports = [
    {
      id: 1,
      type: "Flood Alert",
      location: "Kerala Coast",
      time: "2 hours ago",
      status: "Pending Review",
      severity: "High",
      reporter: "John Doe",
      description: "Heavy flooding reported in coastal areas with water levels rising rapidly.",
      coordinates: { lat: 10.8505, lng: 76.2711 }
    },
    {
      id: 2,
      type: "Oil Spill",
      location: "Mumbai Port",
      time: "4 hours ago",
      status: "Under Investigation",
      severity: "Critical",
      reporter: "Marine Patrol",
      description: "Large oil spill detected near port area, potential environmental hazard.",
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: 3,
      type: "Tsunami Warning",
      location: "Tamil Nadu",
      time: "6 hours ago",
      status: "Verified",
      severity: "Critical",
      reporter: "NDMA",
      description: "Seismic activity detected, tsunami warning issued for coastal regions.",
      coordinates: { lat: 11.1271, lng: 78.6569 }
    }
  ];

  const systemStats = [
    { label: "Active Alerts", value: 23, icon: "🚨", color: "red", change: "+5" },
    { label: "Reports Today", value: 47, icon: "📝", color: "blue", change: "+12" },
    { label: "Response Teams", value: 8, icon: "👥", color: "green", change: "2 active" },
    { label: "Evacuations", value: 156, icon: "🚁", color: "orange", change: "+23" }
  ];

  const recentActivities = [
    { action: "New flood report received", time: "2 min ago", type: "report" },
    { action: "Emergency team dispatched", time: "15 min ago", type: "action" },
    { action: "Tsunami warning issued", time: "1 hour ago", type: "alert" },
    { action: "Evacuation completed", time: "2 hours ago", type: "success" },
    { action: "Oil spill containment", time: "3 hours ago", type: "action" }
  ];

  const handleReportAction = (reportId: number, action: string) => {
    console.log(`Action ${action} for report ${reportId}`);
    // Here you would implement the actual action logic
  };

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
    setShowEmergencyDropdown(false); // Close dropdown when toggling mode
    if (!isEmergencyMode) {
      // When activating emergency mode, set to high level
      setEmergencyLevel('high');
    } else {
      // When deactivating, reset to low
      setEmergencyLevel('low');
    }
  };

  const setEmergencyLevelHandler = (level: 'low' | 'medium' | 'high' | 'critical') => {
    setEmergencyLevel(level);
    setIsEmergencyMode(level !== 'low');
    setShowEmergencyDropdown(false); // Close dropdown after selection
  };

  const getEmergencyModeStyles = () => {
    switch (emergencyLevel) {
      case 'critical':
        return {
          bg: 'bg-red-600',
          text: 'text-red-100',
          border: 'border-red-500',
          pulse: 'animate-pulse',
          glow: 'shadow-red-500/50'
        };
      case 'high':
        return {
          bg: 'bg-orange-600',
          text: 'text-orange-100',
          border: 'border-orange-500',
          pulse: 'animate-pulse',
          glow: 'shadow-orange-500/50'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-600',
          text: 'text-yellow-100',
          border: 'border-yellow-500',
          pulse: '',
          glow: 'shadow-yellow-500/50'
        };
      default:
        return {
          bg: 'bg-gray-600',
          text: 'text-gray-100',
          border: 'border-gray-500',
          pulse: '',
          glow: 'shadow-gray-500/50'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Authorities Dashboard</h1>
                <p className="text-sm text-gray-500">Emergency Response Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
               {/* Enhanced Emergency Mode Toggle */}
               <div className="relative" ref={dropdownRef}>
                 <button
                   onClick={isEmergencyMode ? () => setShowEmergencyDropdown(!showEmergencyDropdown) : toggleEmergencyMode}
                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${getEmergencyModeStyles().bg} ${getEmergencyModeStyles().text} ${getEmergencyModeStyles().border} ${getEmergencyModeStyles().pulse} shadow-lg ${getEmergencyModeStyles().glow}`}
                 >
                   <div className={`w-3 h-3 rounded-full ${isEmergencyMode ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></div>
                   <span className="text-sm font-bold">
                     {isEmergencyMode ? `EMERGENCY MODE - ${emergencyLevel.toUpperCase()}` : 'NORMAL MODE'}
                   </span>
                   <svg className={`w-4 h-4 transition-transform duration-200 ${showEmergencyDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                
                 {/* Emergency Level Dropdown */}
                 {isEmergencyMode && showEmergencyDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 mb-2 px-2">EMERGENCY LEVEL</div>
                      {[
                        { level: 'low', label: 'Low Alert', color: 'text-gray-600', bg: 'bg-gray-100' },
                        { level: 'medium', label: 'Medium Alert', color: 'text-yellow-700', bg: 'bg-yellow-100' },
                        { level: 'high', label: 'High Alert', color: 'text-orange-700', bg: 'bg-orange-100' },
                        { level: 'critical', label: 'Critical Alert', color: 'text-red-700', bg: 'bg-red-100' }
                      ].map(({ level, label, color, bg }) => (
                        <button
                          key={level}
                          onClick={() => setEmergencyLevelHandler(level as any)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${color} ${bg} hover:opacity-80 ${
                            emergencyLevel === level ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              level === 'critical' ? 'bg-red-500' :
                              level === 'high' ? 'bg-orange-500' :
                              level === 'medium' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span>{label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavigation("/live-alerts")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
                </svg>
                <span>Live Alerts</span>
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

      {/* Emergency Mode Banner */}
      {isEmergencyMode && (
        <div className={`${getEmergencyModeStyles().bg} ${getEmergencyModeStyles().text} py-3 ${getEmergencyModeStyles().pulse}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h2 className="text-lg font-bold">EMERGENCY MODE ACTIVE</h2>
                  <p className="text-sm opacity-90">
                    {emergencyLevel === 'critical' && 'CRITICAL ALERT - Immediate action required!'}
                    {emergencyLevel === 'high' && 'HIGH ALERT - Emergency response protocols activated'}
                    {emergencyLevel === 'medium' && 'MEDIUM ALERT - Enhanced monitoring active'}
                    {emergencyLevel === 'low' && 'LOW ALERT - Standard emergency procedures'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Response Time</div>
                  <div className="text-lg font-bold">2.3s</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Active Teams</div>
                  <div className="text-lg font-bold">8</div>
                </div>
                <button
                  onClick={toggleEmergencyMode}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "emergency", label: "Emergency", icon: "🚨" },
            { id: "reports", label: "Reports", icon: "📝" },
            { id: "alerts", label: "Alerts", icon: "⚠️" },
            { id: "teams", label: "Response Teams", icon: "👥" },
            { id: "analytics", label: "Analytics", icon: "📈" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-red-600 shadow-sm"
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
            {/* Emergency Mode Status Card */}
            {isEmergencyMode && (
              <div className={`${getEmergencyModeStyles().bg} ${getEmergencyModeStyles().text} rounded-xl p-6 shadow-lg ${getEmergencyModeStyles().pulse}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Emergency Response Active</h3>
                      <p className="text-sm opacity-90">
                        Level: {emergencyLevel.toUpperCase()} | 
                        Status: {emergencyLevel === 'critical' ? 'IMMEDIATE ACTION REQUIRED' : 
                                emergencyLevel === 'high' ? 'HIGH PRIORITY RESPONSE' :
                                emergencyLevel === 'medium' ? 'ENHANCED MONITORING' : 'STANDARD PROTOCOL'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">LIVE</div>
                    <div className="text-sm opacity-90">Emergency Mode</div>
                  </div>
                </div>
              </div>
            )}

            {/* System Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {systemStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-xs font-medium ${
                        stat.color === 'red' ? 'text-red-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        'text-orange-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      stat.color === 'red' ? 'bg-red-100' :
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      'bg-orange-100'
                    }`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                  <p className="text-sm text-gray-500">Latest system activities and actions</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'report' ? 'bg-blue-500' :
                          activity.type === 'action' ? 'bg-orange-500' :
                          activity.type === 'alert' ? 'bg-red-500' :
                          'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Global Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Global Impact</h2>
                  <p className="text-sm text-gray-500">System-wide statistics</p>
                </div>
                <div className="p-6">
                  <StatsCards />
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Emergency Map</h2>
              <MapSection />
            </div>
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="space-y-6">
            {/* Emergency Control Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Control Panel</h2>
                <p className="text-sm text-gray-500">Manage emergency response protocols and alerts</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Emergency Level Controls */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Emergency Level</h3>
                    {[
                      { level: 'low', label: 'Low Alert', color: 'bg-gray-500', text: 'text-gray-700' },
                      { level: 'medium', label: 'Medium Alert', color: 'bg-yellow-500', text: 'text-yellow-700' },
                      { level: 'high', label: 'High Alert', color: 'bg-orange-500', text: 'text-orange-700' },
                      { level: 'critical', label: 'Critical Alert', color: 'bg-red-500', text: 'text-red-700' }
                    ].map(({ level, label, color, text }) => (
                      <button
                        key={level}
                        onClick={() => setEmergencyLevelHandler(level as any)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                          emergencyLevel === level 
                            ? `${color} text-white border-transparent shadow-lg` 
                            : `bg-gray-50 ${text} border-gray-200 hover:border-gray-300`
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${color}`}></div>
                          <span className="font-medium">{label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                    <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      🚨 Issue Emergency Alert
                    </button>
                    <button className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                      📢 Broadcast Message
                    </button>
                    <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      🚁 Dispatch Teams
                    </button>
                    <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      ✅ All Clear
                    </button>
                  </div>

                  {/* Emergency Stats */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Emergency Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="font-bold text-green-600">2.3s</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Active Teams</span>
                        <span className="font-bold text-blue-600">8</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Evacuated</span>
                        <span className="font-bold text-orange-600">156</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Safe Zones</span>
                        <span className="font-bold text-green-600">12</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
                    <div className="space-y-2">
                      <button className="w-full p-2 text-left bg-red-50 hover:bg-red-100 rounded transition-colors">
                        <div className="font-medium text-red-800">Police</div>
                        <div className="text-sm text-red-600">100</div>
                      </button>
                      <button className="w-full p-2 text-left bg-orange-50 hover:bg-orange-100 rounded transition-colors">
                        <div className="font-medium text-orange-800">Fire</div>
                        <div className="text-sm text-orange-600">101</div>
                      </button>
                      <button className="w-full p-2 text-left bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                        <div className="font-medium text-blue-800">Ambulance</div>
                        <div className="text-sm text-blue-600">102</div>
                      </button>
                      <button className="w-full p-2 text-left bg-green-50 hover:bg-green-100 rounded transition-colors">
                        <div className="font-medium text-green-800">Coast Guard</div>
                        <div className="text-sm text-green-600">1554</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Timeline</h2>
                <p className="text-sm text-gray-500">Recent emergency events and actions</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { time: "14:32", event: "Emergency mode activated", level: "high", status: "active" },
                    { time: "14:28", event: "Tsunami warning issued", level: "critical", status: "resolved" },
                    { time: "14:15", event: "Response teams dispatched", level: "medium", status: "completed" },
                    { time: "14:10", event: "Flood alert received", level: "high", status: "monitoring" },
                    { time: "13:45", event: "Oil spill reported", level: "medium", status: "investigating" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-mono text-gray-500 w-12">{item.time}</div>
                      <div className={`w-3 h-3 rounded-full ${
                        item.level === 'critical' ? 'bg-red-500' :
                        item.level === 'high' ? 'bg-orange-500' :
                        item.level === 'medium' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.event}</div>
                        <div className="text-sm text-gray-500">Level: {item.level} | Status: {item.status}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-red-100 text-red-800' :
                        item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'monitoring' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Incident Reports</h2>
                <p className="text-sm text-gray-500">Review and manage reported incidents</p>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            report.severity === 'Critical' ? 'bg-red-500' :
                            report.severity === 'High' ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <h3 className="font-semibold text-gray-900">{report.type}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'Under Investigation' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📍 {report.location}</span>
                          <span>👤 {report.reporter}</span>
                          <span>🕒 {report.time}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleReportAction(report.id, 'verify')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'dispatch')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Dispatch
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Alert Management</h2>
                <p className="text-sm text-gray-500">Create and manage emergency alerts</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="bg-red-50 border-2 border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌊</div>
                      <h3 className="font-semibold text-red-800">Tsunami Alert</h3>
                      <p className="text-sm text-red-600">Issue tsunami warning</p>
                    </div>
                  </button>
                  <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌧️</div>
                      <h3 className="font-semibold text-orange-800">Flood Alert</h3>
                      <p className="text-sm text-orange-600">Issue flood warning</p>
                    </div>
                  </button>
                  <button className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚠️</div>
                      <h3 className="font-semibold text-yellow-800">General Alert</h3>
                      <p className="text-sm text-yellow-600">Issue general warning</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Response Teams</h2>
                <p className="text-sm text-gray-500">Manage emergency response teams</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-800">Coastal Rescue Team</h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                    </div>
                    <p className="text-sm text-green-600 mb-2">12 members • 3 vehicles</p>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Dispatch</button>
                      <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Details</button>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-800">Marine Patrol</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">On Duty</span>
                    </div>
                    <p className="text-sm text-blue-600 mb-2">8 members • 2 boats</p>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Dispatch</button>
                      <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Analytics & Reports</h2>
                <p className="text-sm text-gray-500">System performance and incident analytics</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">12.5 min</p>
                    <p className="text-sm text-gray-600">Average response time</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Success Rate</h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">94.2%</p>
                    <p className="text-sm text-gray-600">Successful interventions</p>
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
