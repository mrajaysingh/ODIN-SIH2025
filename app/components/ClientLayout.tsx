'use client';

import { useState, useEffect } from "react";
import Preloader from "./Preloader";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add/remove body class to control scrolling
    if (isLoading) {
      document.body.classList.add('preloader-active');
    } else {
      document.body.classList.remove('preloader-active');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('preloader-active');
    };
  }, [isLoading]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {children}
    </>
  );
}
