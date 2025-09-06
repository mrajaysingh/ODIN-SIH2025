'use client';

import { useState } from "react";

export default function ReportHazardPage() {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [formData, setFormData] = useState({
    hazardType: "",
    location: "",
    description: "",
    severity: "",
    contactInfo: "",
    files: null as FileList | null,
  });

  const hazardTypes = [
    "Tsunami Warning",
    "High Tide",
    "Storm/Cyclone",
    "Coastal Flooding",
    "Oil Spill",
    "Marine Pollution",
    "Rip Current",
    "Unusual Wave Activity",
    "Other",
  ];

  const emergencyNumbers = [
    {
      service: "Coast Guard",
      number: "1554",
      available: "24/7",
    },
    { service: "NDRF", number: "1070", available: "24/7" },
    {
      service: "Disaster Helpline",
      number: "1077",
      available: "24/7",
    },
    {
      service: "Police Emergency",
      number: "112",
      available: "24/7",
    },
  ];

  const safetyTips = [
    "Stay away from the coastline during high tide warnings",
    "Do not venture into water during storm conditions",
    "Follow evacuation orders immediately when issued",
    "Keep emergency kit ready with water, food, and first aid",
    "Monitor official weather updates regularly",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission
    const referenceId =
      "ODN-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
    alert(
      `Report submitted successfully! Reference ID: ${referenceId}`,
    );

    // Reset form
    setFormData({
      hazardType: "",
      location: "",
      description: "",
      severity: "",
      contactInfo: "",
      files: null,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prev) => ({
          ...prev,
          location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        }));
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl mb-2 font-bold text-gray-900">
              Report Ocean Hazard
            </h1>
            <p className="text-sm sm:text-base text-gray-800">
              Help keep our coastal communities safe by
              reporting hazards immediately
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Hazard Report Form
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-800">
                      Provide detailed information about the hazard
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div
                      className={`flex items-center gap-2 ${isOfflineMode ? "text-red-600" : "text-green-600"}`}
                    >
                      {isOfflineMode ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                      )}
                      <span className="text-sm">
                        {isOfflineMode ? "Offline" : "Online"}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isOfflineMode}
                        onChange={(e) => setIsOfflineMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                </div>

                {isOfflineMode && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-semibold text-orange-800">Offline Mode Enabled</h3>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Your report will be saved locally and submitted automatically when connection is restored.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Hazard Type */}
                  <div className="space-y-3">
                    <label htmlFor="hazardType" className="block text-sm font-semibold text-gray-800 tracking-wide">
                      Type of Hazard *
                    </label>
                    <select
                      id="hazardType"
                      value={formData.hazardType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hazardType: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer modern-dropdown"
                      required
                    >
                      <option value="">Select hazard type</option>
                      {hazardTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="location"
                        type="text"
                        placeholder="Enter location or coordinates"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        required
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1 bg-white text-gray-900"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Click the pin icon to auto-capture your current location
                    </p>
                  </div>

                  {/* Severity */}
                  <div className="space-y-3">
                    <label htmlFor="severity" className="block text-sm font-semibold text-gray-800 tracking-wide">
                      Severity Level *
                    </label>
                    <select
                      id="severity"
                      value={formData.severity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          severity: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer modern-dropdown"
                      required
                    >
                      <option value="">Select severity</option>
                      <option value="low">Low - Minor concern</option>
                      <option value="medium">Medium - Requires attention</option>
                      <option value="high">High - Immediate action needed</option>
                      <option value="critical">Critical - Emergency response required</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Detailed Description *
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe the hazard in detail - what you observed, when it started, current conditions..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 bg-white text-gray-900"
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                      Photos/Videos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
                      <div className="space-y-2">
                        <svg className="h-8 w-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div>
                          <label
                            htmlFor="files"
                            className="cursor-pointer text-blue-600 hover:underline font-medium"
                          >
                            Click to upload files
                          </label>
                          <input
                            id="files"
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                files: e.target.files,
                              }))
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          Support: JPG, PNG, MP4 (Max 10MB each)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                      Contact Information (Optional)
                    </label>
                    <input
                      id="contactInfo"
                      type="text"
                      placeholder="Phone number or email for follow-up"
                      value={formData.contactInfo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactInfo: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    />
                    <p className="text-xs text-gray-600">
                      Only used by authorities for verification if needed
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Hazard Report
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Emergency Numbers */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-red-600 flex items-center gap-2 mb-3 sm:mb-4">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Emergency Contacts
                </h3>
                <p className="text-xs sm:text-sm text-gray-800 mb-3 sm:mb-4">
                  Call immediately for life-threatening situations
                </p>
                <div className="space-y-3">
                  {emergencyNumbers.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <div>
                        <p className="font-medium text-red-800 text-sm sm:text-base">
                          {contact.service}
                        </p>
                        <p className="text-xs sm:text-sm text-red-600">
                          {contact.available}
                        </p>
                      </div>
                      <a
                        href={`tel:${contact.number}`}
                        className="bg-red-600 text-white px-2 py-1 sm:px-3 rounded text-xs sm:text-sm hover:bg-red-700 transition-colors"
                      >
                        {contact.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-600 flex items-center gap-2 mb-3 sm:mb-4">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Safety Tips
                </h3>
                <div className="space-y-3">
                  {safetyTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs sm:text-sm text-gray-900">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/"
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-700 text-sm sm:text-base">View Current Alerts</p>
                      <p className="text-xs text-gray-600">Check active warnings and advisories</p>
                    </div>
                  </a>
                  <a
                    href="/"
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-700 text-sm sm:text-base">Emergency Procedures</p>
                      <p className="text-xs text-gray-600">Learn safety protocols and guidelines</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
