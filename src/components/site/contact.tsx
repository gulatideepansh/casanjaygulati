import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactFormShell } from "@/components/site/contact-form-shell";
import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

type ContactOfficePanelProps = {
  contactName: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  mapsDirectionsUrl: string;
};

function ContactOfficePanel({
  contactName,
  email,
  phone,
  address,
  mapEmbedUrl,
  mapsDirectionsUrl
}: ContactOfficePanelProps) {
  return (
    <article className="border border-[#d8d2c4] bg-white p-5 sm:p-7 lg:p-8">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title={contactName}
          description="For appointments, tax matters, audit enquiries, and professional consultations, please share a brief message or contact us directly by phone or email."
        />
        <div className="mt-8 space-y-5">
          <ContactFormShell />

          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 text-brass" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Email</p>
                <p className="mt-1 break-words text-slate-700">{email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 text-brass" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Phone</p>
                <p className="mt-1 text-slate-700">{phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 text-brass" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Address</p>
                <p className="mt-1 text-slate-700">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-10">
        <div className="overflow-hidden border border-[#d8d2c4]">
          <div className="relative">
            <Image
              src="/hero-desk-stock.jpg"
              alt="Office desk with calculator, pen, and paperwork."
              width={1024}
              height={768}
              className="h-[260px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.2),rgba(8,17,31,0.65))]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-brass">Office Desk</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-white">
                Contact us for appointments, consultations, document reviews, and ongoing professional support.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-b border-[#d8d2c4] pb-8 md:grid-cols-3">
          {[
            { title: "Email", detail: email, icon: Mail },
            { title: "Phone", detail: phone, icon: Phone },
            { title: "Office Address", detail: address, icon: MapPin }
          ].map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="border-l border-[#d8d2c4] pl-4">
                <Icon size={22} className="text-brass" />
                <h3 className="mt-4 text-base font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 break-words text-sm leading-7 text-slate-600">{card.detail}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brass">Office Location</p>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Open in Google Maps
            </a>
          </div>
          <div className="mt-4 overflow-hidden border border-[#d8d2c4]">
            <iframe
              title={`Google map location for ${contactName}`}
              src={mapEmbedUrl}
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-8 border-l border-brass pl-5">
          <p className="text-sm uppercase tracking-[0.35em] text-brass">{siteContent.inquiry.heading}</p>
          <p className="mt-4 text-sm leading-7 text-slate-700">{siteContent.inquiry.description}</p>
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-500">{siteContent.firm.futureNote}</p>
      </div>
    </article>
  );
}

function createGoogleMapsEmbedLink(query: string) {
  return `https://maps.google.com/maps?output=embed&iwloc=B&z=17&q=${encodeURIComponent(query)}`;
}

function createGoogleMapsDirectionsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function Contact() {
  const lajpatNagarMapQuery =
    "Nayyar & Nayyar, A-44, Basement, Amar Colony, Lajpat Nagar IV, New Delhi, Delhi 110024, India";
  const karolBaghMapQuery =
    "Efforts Polymers Private Limited, 82/3 Joshi Rd, Block 63, Karol Bagh, New Delhi, Delhi 110005, India";

  return (
    <section id="contact" className="bg-[#f7f5ef]">
      <div className="mx-auto max-w-[1800px] px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 xl:grid-cols-2">
          <ContactOfficePanel
            contactName="Sanjay Gulati"
            email={siteContent.firm.email}
            phone={siteContent.firm.phone}
            address={siteContent.firm.address}
            mapEmbedUrl={createGoogleMapsEmbedLink(lajpatNagarMapQuery)}
            mapsDirectionsUrl={createGoogleMapsDirectionsLink(lajpatNagarMapQuery)}
          />
          <ContactOfficePanel
            contactName="Pavan Gulati"
            email="pavangulati1968@gmail.com"
            phone="+91 011 4753 3702"
            address="Efforts Polymers Private Limited, 82/3 Joshi Rd, Block 63, Karol Bagh, New Delhi, Delhi 110005, India"
            mapEmbedUrl={createGoogleMapsEmbedLink(karolBaghMapQuery)}
            mapsDirectionsUrl={createGoogleMapsDirectionsLink(karolBaghMapQuery)}
          />
        </div>
      </div>
    </section>
  );
}
