import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactFormShell } from "@/components/site/contact-form-shell";
import { siteContent } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";

export function Contact() {
  const mapQuery = encodeURIComponent("A-44 Amar Colony Lajpat Nagar New Delhi 110024");
  const latitude = "28.5617318";
  const longitude = "77.242679";
  const mapEmbedUrl = `https://maps.google.com/maps?hl=en&q=${latitude},${longitude}&z=17&output=embed`;
  const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <section id="contact" className="section-divider border-t border-white/10 bg-[#050b15]">
      <div className="section-shell grid gap-10 py-24 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Speak with our office."
            description="For appointments, tax matters, audit enquiries, and professional consultations, please share a brief message or contact us directly by phone or email."
          />
          <div className="mt-8 space-y-5">
            <ContactFormShell />

            <div className="grid gap-4">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 text-brass" size={20} />
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Email</p>
                  <p className="mt-1 text-slate-200">{siteContent.firm.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 text-brass" size={20} />
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Phone</p>
                  <p className="mt-1 text-slate-200">{siteContent.firm.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-brass" size={20} />
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Address</p>
                  <p className="mt-1 text-slate-200">{siteContent.firm.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-card p-8">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
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
                <p className="text-xs uppercase tracking-[0.42em] text-brass">Office Desk</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-200">
                  You may contact us for appointments, consultations, document reviews, and professional advice.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {siteContent.contactCards.map((card) => {
              const Icon = card.icon;
              const isAddress = card.title === "Office Address";

              return (
                <article
                  key={card.title}
                  className={`panel-card-soft p-5 ${isAddress ? "md:col-span-2 xl:col-span-1" : ""}`}
                >
                  <Icon size={22} className="text-brass" />
                  <h3 className="mt-4 text-base font-semibold text-white">{card.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-7 text-slate-300 ${
                      isAddress ? "max-w-[18rem]" : "break-words"
                    }`}
                  >
                    {card.detail}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#091321] p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.42em] text-brass">Office Location</p>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-slate-200 transition duration-300 hover:text-white"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-brass/20">
              <iframe
                title="Google map location for A-44 Amar Colony Lajpat Nagar New Delhi 110024"
                src={mapEmbedUrl}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-dashed border-brass/40 bg-brass/10 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-brass">{siteContent.inquiry.heading}</p>
            <p className="mt-4 text-sm leading-7 text-slate-200">{siteContent.inquiry.description}</p>
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-400">{siteContent.firm.futureNote}</p>
        </div>
      </div>
    </section>
  );
}
