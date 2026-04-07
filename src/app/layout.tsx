import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { siteContent } from "@/content/site-content";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteContent.firm.domain}`),
  title: siteContent.seo.title,
  description: siteContent.seo.description,
  applicationName: siteContent.firm.name,
  keywords: [
    "Chartered Accountant New Delhi",
    "Tax Consultant Delhi",
    "Audit Firm India",
    "GST Compliance",
    "Financial Advisory"
  ],
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg"
  },
  openGraph: {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    url: `https://${siteContent.firm.domain}`,
    siteName: siteContent.firm.name,
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.title,
    description: siteContent.seo.description
  },
  alternates: {
    canonical: `https://${siteContent.firm.domain}`
  },
  category: "finance"
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: siteContent.firm.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteContent.firm.address,
    addressLocality: "New Delhi",
    addressCountry: "IN"
  },
  areaServed: "New Delhi",
  description: siteContent.seo.description,
  telephone: siteContent.firm.phone,
  email: siteContent.firm.email,
  url: `https://${siteContent.firm.domain}`
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div className="flex min-h-screen flex-col bg-ink text-white">
          {/* Phase 1 uses a shared public shell.
              Future portal/admin route groups can swap in protected layouts without changing the
              marketing experience. */}
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
