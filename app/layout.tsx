import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://odin.skyber.dev'),
  title: "O.D.I.N. - Ocean Disaster Information Network | Real-time Coastal Alerts & Emergency Response",
  description: "O.D.I.N. (Ocean Disaster Information Network) is your trusted source for real-time ocean disaster alerts, tsunami warnings, storm surge notifications, and emergency response information. Protect coastal communities with our advanced monitoring system, live hazard reports, and instant safety updates. Stay informed, stay safe with ODIN.",
  keywords: [
    "ocean disaster alerts", "tsunami warning system", "coastal safety monitoring", 
    "emergency response information", "ocean hazard detection", "disaster preparedness", 
    "coastal community safety", "marine weather alerts", "storm surge warnings", 
    "real-time ocean monitoring", "emergency notification system", "coastal disaster management",
    "tsunami detection", "ocean safety network", "hazard reporting system", "coastal emergency alerts"
  ],
  authors: [{ name: "O.D.I.N. Team", url: "https://odin.skyber.dev" }],
  creator: "Ocean Disaster Information Network",
  publisher: "O.D.I.N. - Skyber Development",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    title: "O.D.I.N. - Ocean Disaster Information Network | Real-time Coastal Safety",
    description: "Advanced ocean disaster monitoring system providing real-time alerts, tsunami warnings, and emergency response information for coastal communities worldwide. Stay safe with ODIN's cutting-edge hazard detection technology.",
    url: "https://odin.skyber.dev",
    siteName: "O.D.I.N. - Ocean Disaster Information Network",
    images: [
      {
        url: "https://odin.skyber.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "O.D.I.N. - Ocean Disaster Information Network - Real-time Coastal Safety Monitoring",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "O.D.I.N. - Ocean Disaster Information Network",
    description: "Real-time ocean disaster alerts & emergency response for coastal communities. Advanced monitoring system protecting lives worldwide. #OceanSafety #DisasterPreparedness",
    images: ["https://odin.skyber.dev/og-image.jpg"],
    creator: "@ODIN_Network",
    site: "@SkyberDev",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ODIN",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "msapplication-TileColor": "#1e3a8a",
    "theme-color": "#1e3a8a",
    "application-name": "O.D.I.N.",
    "apple-mobile-web-app-title": "ODIN",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
    "msapplication-tooltip": "Ocean Disaster Information Network - Real-time Coastal Alerts",
    "msapplication-starturl": "/",
    "msapplication-navbutton-color": "#1e3a8a",
    "msapplication-TileImage": "/ODIN-tp svg.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a8a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/ODIN-tp svg.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/ODIN-tp svg.svg" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        <meta name="DC.title" content="O.D.I.N. - Ocean Disaster Information Network" />
        <meta name="DC.creator" content="O.D.I.N. Team" />
        <meta name="DC.subject" content="Ocean Disaster Information, Coastal Safety, Emergency Response" />
        <meta name="DC.description" content="Real-time ocean disaster alerts and emergency response information for coastal communities worldwide." />
        <meta name="DC.publisher" content="Skyber Development" />
        <meta name="DC.contributor" content="O.D.I.N. Team" />
        <meta name="DC.date" content="2024-01-01" />
        <meta name="DC.type" content="WebApplication" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://odin.skyber.dev" />
        <meta name="DC.language" content="en" />
        <meta name="DC.rights" content="Copyright 2024 O.D.I.N. Team" />
        <meta name="DC.coverage" content="Worldwide" />
        <meta name="DC.audience" content="Coastal Communities, Emergency Responders, Government Agencies" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "O.D.I.N. - Ocean Disaster Information Network",
              "alternateName": "ODIN",
              "description": "Real-time ocean disaster alerts, tsunami warnings, and emergency response information for coastal communities worldwide.",
              "url": "https://odin.skyber.dev",
              "applicationCategory": "SafetyApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "O.D.I.N. Team",
                "url": "https://odin.skyber.dev"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Skyber Development",
                "url": "https://skyber.dev"
              },
              "keywords": "ocean disaster alerts, tsunami warning system, coastal safety monitoring, emergency response information",
              "featureList": [
                "Real-time tsunami alerts",
                "Storm surge warnings", 
                "Coastal hazard monitoring",
                "Emergency response information",
                "Live hazard reporting",
                "Safety notifications"
              ],
              "screenshot": "https://odin.skyber.dev/og-image.jpg",
              "softwareVersion": "1.0.0",
              "datePublished": "2024-01-01",
              "dateModified": "2024-01-01",
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareHelp": "https://odin.skyber.dev/help"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientLayout>
          <Header />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
