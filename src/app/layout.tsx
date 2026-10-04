import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, VT323, Pacifico } from "next/font/google";
import "./globals.css";
import RetroCursor from "@/components/RetroCursor";
import { Analytics } from "@vercel/analytics/next";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-cursive",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sivasakthi.dev'),
  title: "SIVASAKTHI VENGATESAN | BACKEND / BIG DATA ENGINEER",
  description: "I build backend systems and data infrastructure around distributed processing, streaming data, and reliable software systems.",
  keywords: [
    "Sivasakthi Vengatesan",
    "Sivasakthi V",
    "Backend Engineer",
    "Big Data Engineer",
    "Distributed Systems",
    "Data Infrastructure",
    "Apache Spark",
    "Apache Kafka",
    "FastAPI",
    "Spring Boot",
    "Z3 SMT",
    "pgvector",
    "PostgreSQL",
    "Hadoop",
    "LangChain4j",
    "Chennai Institute of Technology"
  ],
  authors: [{ name: "Sivasakthi Vengatesan" }],
  creator: "Sivasakthi Vengatesan",
  publisher: "Sivasakthi Vengatesan",
  robots: "index, follow",
  alternates: {
    canonical: "https://sivasakthi-vengatesan.vercel.app/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sivasakthi-vengatesan.vercel.app/",
    siteName: "SIVASAKTHI VENGATESAN | BACKEND / BIG DATA ENGINEER",
    title: "SIVASAKTHI VENGATESAN | BACKEND / BIG DATA ENGINEER",
    description: "Explore distributed data pipelines, SMT-based AI formal verification engines, real-time streaming architectures, and performant backend systems built by Sivasakthi Vengatesan.",
    images: [
      {
        url: "/profile_pixel.png",
        width: 1200,
        height: 630,
        alt: "Sivasakthi Vengatesan Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIVASAKTHI VENGATESAN | BACKEND / BIG DATA ENGINEER",
    description: "I build backend systems and data infrastructure around distributed processing, streaming data, and reliable software systems.",
    images: ["/profile_pixel.png"],
    creator: "@Sivasakthi_V",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sivasakthi Vengatesan",
  url: "https://sivasakthi-vengatesan.vercel.app/",
  image: "https://sivasakthi-vengatesan.vercel.app/profile_pixel.png",
  jobTitle: "Backend / Big Data Engineer",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Chennai Institute of Technology"
  },
  knowsAbout: [
    "Backend Systems",
    "Big Data",
    "Distributed Systems",
    "Apache Spark",
    "Apache Kafka",
    "Apache Hadoop",
    "FastAPI",
    "Spring Boot",
    "PostgreSQL",
    "pgvector",
    "Z3 SMT Formal Verification",
    "Data Infrastructure",
    "Streaming Pipelines"
  ],
  sameAs: [
    "https://github.com/Sivasakthi-Vengatesan",
    "https://linkedin.com/in/sivasakthi-vengatesan-8a1209410"
  ],
  description: "Backend / Big Data Engineer building backend systems and data infrastructure around distributed processing, streaming data, and reliable software systems."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />
      </head>
      <body
        className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${vt323.variable} ${pacifico.variable} bg-retro-charcoal font-body text-zinc-900 overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-10`}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {/* Retro Custom Cursor */}
        <RetroCursor />
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
