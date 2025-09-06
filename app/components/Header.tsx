'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Home');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show header at the top
      if (currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [lastScrollY, isMounted, isMobileMenuOpen]);

  const menuItems = [
    'Home',
    'Report Hazard', 
    'Live Alerts',
    'Community',
    'About O.D.I.N.'
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'EN', name: 'Hindi' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' }
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Alert Bar - Always Visible Red Strip */}
      <div className="bg-red-600 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm relative z-50">
        <div className="flex items-center justify-center gap-1 sm:gap-2 px-2">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="truncate">LIVE: High tide warning for Mumbai coastal areas - Updated 2 mins ago</span>
        </div>
      </div>

      {/* Main Navigation - Animated */}
      <nav 
        className={`bg-[#1e3a8a] shadow-lg px-2 sm:px-4 lg:px-8 py-3 sm:py-4 transition-all duration-300 ease-in-out ${
          !isMounted || isHeaderVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center">
              <Image
                src="/ODIN-tp svg.svg"
                alt="ODIN Logo"
                width={100}
                height={100}
                className="w-50 h-50 sm:w-30 sm:h-30"
              />
            </div>
            <div className="text-white">
              <h1 className="text-lg sm:text-2xl font-bold">O.D.I.N.</h1>
              <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Ocean Disaster Information Network</p>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => {
              const getHref = (item: string) => {
                switch (item) {
                  case 'Home':
                    return '/';
                  case 'Report Hazard':
                    return '/report-hazard';
                  case 'Live Alerts':
                    return '/#alerts';
                  case 'Community':
                    return '/#community';
                case 'About O.D.I.N.':
                  return '/#about';
                  default:
                    return '/';
                }
              };

              return (
                <a
                  key={item}
                  href={getHref(item)}
                  onClick={() => setActiveMenu(item)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeMenu === item
                      ? 'bg-blue-600 text-white'
                      : 'text-white hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-sm sm:text-base">EN</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setIsLanguageOpen(false);
                        // Handle language change
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
              Login
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white p-1 hover:bg-blue-700 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}>
          <div className="bg-blue-800 rounded-lg p-2 space-y-1 mobile-menu-backdrop">
            {menuItems.map((item) => {
              const getHref = (item: string) => {
                switch (item) {
                  case 'Home':
                    return '/';
                  case 'Report Hazard':
                    return '/report-hazard';
                  case 'Live Alerts':
                    return '/#alerts';
                  case 'Community':
                    return '/#community';
                case 'About O.D.I.N.':
                  return '/#about';
                  default:
                    return '/';
                }
              };

              return (
                <a
                  key={item}
                  href={getHref(item)}
                  onClick={() => {
                    setActiveMenu(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-item flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    activeMenu === item
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-200 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {/* Menu Icons */}
                  {item === 'Home' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                  {item === 'Report Hazard' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  {item === 'Live Alerts' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17h8l-2.586-2.586a2 2 0 00-2.828 0L4.828 17z" />
                    </svg>
                  )}
                  {item === 'Community' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {item === 'About ODIN' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{item}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
