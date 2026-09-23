import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motormatch.my.id";
const siteName = "MotorMatch";
const siteDescription =
  "Kalkulator sizing motor servo, stepper & induksi + VFD gratis untuk engineer. Hitung torsi, inertia ratio, RMS & peak torque untuk 13 mekanisme — ball screw, conveyor, rotary table & more.";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MotorMatch - Kalkulator Sizing Motor Servo, Stepper & Induksi Gratis",
    template: "%s | MotorMatch",
  },
  description: siteDescription,
  keywords: [
    "kalkulator sizing motor",
    "motor sizing calculator",
    "servo motor selection",
    "stepper motor sizing",
    "induction motor VFD sizing",
    "ball screw motor calculation",
    "rack pinion motor sizing",
    "conveyor belt motor selection",
    "rotary table servo sizing",
    "perhitungan torsi motor",
    "rasio inersia motor",
    "RMS torque peak torque",
    "servo gain tuning",
    "Mitsubishi Yaskawa Delta motor",
    "automation engineering tool",
  ],
  authors: [{ name: "MotorMatch", url: siteUrl }],
  creator: "MotorMatch",
  publisher: "MotorMatch",
  category: "engineering",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: "MotorMatch - Kalkulator Sizing Motor Servo, Stepper & Induksi Gratis",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MotorMatch - Motor Selection & Sizing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MotorMatch - Kalkulator Sizing Motor Servo, Stepper & Induksi Gratis",
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
      },
      {
        "@type": "SoftwareApplication",
        name: siteName,
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        url: siteUrl,
        description: siteDescription,
        publisher: { "@id": `${siteUrl}#organization` },
        featureList: [
          "13 mekanisme: Ball Screw, Rack & Pinion, Roll Feed, Sprocket & Chain, Conveyor, Cart, Linear Servo, Generic Linear/Rotary, Rotary Table, Fan, Pump, Elevator/Hoist",
          "Rekomendasi tipe motor servo/stepper/induksi+VFD",
          "Katalog motor Mitsubishi, Yaskawa, Delta, Panasonic, Omron, Baumüller, Siemens, INVT",
          "Perhitungan torsi, inertia ratio, peak & RMS torque, duty cycle",
          "Gain calculator Kv, Tvi, Kp per brand",
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
        },
      },
      {
        "@type": "WebSite",
        url: siteUrl,
        name: siteName,
        publisher: { "@id": `${siteUrl}#organization` },
        inLanguage: "id-ID",
      },
      {
        "@type": "HowTo",
        name: "Cara sizing motor dengan MotorMatch",
        description: "3 langkah memilih dan sizing motor yang tepat untuk mekanisme Anda",
        totalTime: "PT2M",
        step: [
          { "@type": "HowToStep", name: "Pilih Mekanisme", text: "Pilih jenis mekanisme dari 13 opsi: Ball Screw, Conveyor, Rotary Table, dll." },
          { "@type": "HowToStep", name: "Input Parameter", text: "Masukkan parameter beban, kecepatan, cycle time, rasio gear dan efisiensi." },
          { "@type": "HowToStep", name: "Lihat Hasil Sizing", text: "Dapatkan rekomendasi tipe motor, kandidat katalog, perhitungan torsi & inertia ratio, dan starting-point gain servo." },
        ],
      },
    ],
  };

  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="9OjuxE8ZqtLCa5ews3Znbg"
          async
        />
      </head>
      <body className="min-h-screen bg-surface-50 font-sans flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="bg-surface-100 border-t border-surface-200 py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-surface-500">
            <a href="/blog" className="hover:text-primary-600 transition-colors">Blog</a>
            <span className="hidden sm:inline">&middot;</span>
            <p>&copy; {new Date().getFullYear()} MotorMatch. Kalkulator sizing motor gratis untuk engineer.</p>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}