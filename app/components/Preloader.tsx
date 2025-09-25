'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PreloaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function Preloader({ onComplete, duration = 3000 }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/assets/blue-ocean.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main preloader content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Rotating logo container */}
        <div className="relative preloader-fade-in">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 border-4 border-white/30 rounded-full animate-spin">
            <div className="w-full h-full border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          
          {/* Inner rotating ring */}
          <div className="absolute inset-4 w-24 h-24 border-4 border-cyan-300/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            <div className="w-full h-full border-4 border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          </div>
          
          {/* ODIN Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 relative preloader-logo">
              <Image
                src="/assets/ODIN-tp.svg"
                alt="ODIN Logo"
                fill
                className="object-contain filter drop-shadow-2xl brightness-110"
                priority
              />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2 preloader-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold text-white preloader-wave drop-shadow-lg">
            O.D.I.N.
          </h2>
          <p className="text-cyan-100 text-sm font-medium preloader-shimmer drop-shadow-md">
            Ocean Disaster Information Network
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-2 preloader-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-white rounded-full transition-all duration-300 ease-out preloader-progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-cyan-100 text-xs font-medium drop-shadow-md">
              {progress}%
            </span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 preloader-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce drop-shadow-lg"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100 drop-shadow-lg"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200 drop-shadow-lg"></div>
        </div>
      </div>

      {/* Fade out overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity duration-1000"
        style={{ opacity: isVisible ? 1 : 0 }}
      ></div>
    </div>
  );
}
