'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A3D62] text-white py-8 mt-0 rounded-t-[15px] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-medium mb-4">ODIN</h3>
            <p className="text-sm text-gray-300">
              Ocean Disaster Information Network - Safeguarding Oceans, Securing Lives
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/report-hazard" className="block text-sm text-gray-300 hover:text-white">
                Report Hazard
              </Link>
              <Link href="/#alerts" className="block text-sm text-gray-300 hover:text-white">
                Live Alerts
              </Link>
              <Link href="/#about" className="block text-sm text-gray-300 hover:text-white">
                About ODIN
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Emergency Numbers</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>
                Coast Guard: <a href="tel:1554" className="text-[#FF6B35]">1554</a>
              </div>
              <div>
                Disaster Helpline: <a href="tel:1077" className="text-[#FF6B35]">1077</a>
              </div>
              <div>
                NDRF: <a href="tel:1070" className="text-[#FF6B35]">1070</a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Government Partners</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Ministry of Earth Sciences</div>
              <div>INCOIS</div>
              <div>Indian Coast Guard</div>
              <div>NDMA</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2024 Government of India - Ocean Disaster Information Network (ODIN). All rights reserved. This is an official government platform for disaster management.
          </p>
        </div>
      </div>
    </footer>
  );
}


