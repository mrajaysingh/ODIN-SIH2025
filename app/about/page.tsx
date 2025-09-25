"use client";

import Image from "next/image";
import React from "react";

export default function AboutPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover opacity-80"
            src="/assets/blue-ocean.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-3 shadow-md">
              <Image src="/assets/ODIN-tp.svg" alt="ODIN" width={72} height={72} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">O.D.I.N.</h1>
              <p className="text-blue-100 text-sm sm:text-base">Ocean Disaster Information Network</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-blue-100/95 text-base sm:text-lg">
            ODIN empowers coastal communities with real-time alerts, community reporting, and data-driven insights to
            prepare for and respond to ocean-related disasters.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
        <p className="mt-4 text-gray-600 max-w-3xl">
          Provide timely, accurate, and accessible information about oceanic hazards such as tsunamis, cyclones, storm
          surges, and oil spills—so people can act faster and safer.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{
            title: 'Live Alerts', desc: 'Real-time warnings and status updates for coastal regions.'
          }, {
            title: 'Community Reports', desc: 'Crowdsourced hazard reporting to improve situational awareness.'
          }, {
            title: 'Impact Insights', desc: 'Stats and maps that quantify impact and aid coordination.'
          }].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">In Pictures</h2>
          <p className="mt-4 text-gray-600 max-w-3xl">Snapshots of the challenges ODIN is built to address.</p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '/incident/kerala-flood.jpg',
              '/incident/ocean-flood.jpg',
              '/incident/tsunami-coastal-area.jpg',
              '/incident/urban-flood-and-relief.jpg',
              '/incident/oil-spill-in-ocean.jpg',
              '/incident/oil-ship-on-fire.jpg',
              '/incident/place-crash-in-ocean.jpg',
              '/incident/punjab-flood.jpg'
            ].map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-slate-200">
                <Image src={src} alt="ODIN gallery" fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-gradient-to-r from-[#FF6900] to-orange-600 text-white rounded-2xl p-8 sm:p-10 shadow-lg flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold">Join the Network</h3>
            <p className="mt-2 text-blue-100 max-w-2xl text-sm sm:text-base">Report hazards, get alerts, and help your community stay safe.</p>
          </div>
          <a href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Get Started
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L12.586 12H4a1 1 0 110-2h8.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
          </a>
        </div>
      </section>
    </main>
  );
}


