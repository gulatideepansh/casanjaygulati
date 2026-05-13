"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Building2, LockKeyhole, Mail, Menu, Phone, Users, X } from "lucide-react";
import { useState } from "react";

import { siteContent } from "@/content/site-content";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5dfd3] bg-white/95 shadow-[0_8px_28px_rgba(8,36,61,0.08)] backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-5 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 xl:shrink-0" onClick={closeMenu}>
          <div className="shrink-0 overflow-hidden border border-[#d8d2c4] bg-white shadow-[0_8px_24px_rgba(8,36,61,0.08)]">
            <Image
              src="/ca-india-logo.jpg"
              alt="Chartered Accountant India logo"
              width={48}
              height={48}
              className="h-11 w-11 object-cover sm:h-12 sm:w-12"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[1.15rem] font-semibold leading-none text-ink sm:text-[1.45rem] xl:text-[1.5rem]">
              {siteContent.firm.name}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/70 sm:text-[11px]">
              Chartered Accountants
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
          {siteContent.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink/75 transition duration-300 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Link href="/portal/sign-in" className="button-secondary px-5 py-2.5">
            Staff Login
          </Link>
          <Link href="/#contact" className="button-primary px-5 py-2.5">
            Schedule Consultation
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-brass hover:text-brass xl:hidden"
          aria-label="Open mobile navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={21} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-ink/35 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
        onClick={closeMenu}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-[23rem] flex-col bg-[linear-gradient(145deg,#08243d,#003b5c)] text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-transform duration-300 xl:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
            <div className="shrink-0 overflow-hidden bg-white">
              <Image
                src="/ca-india-logo.jpg"
                alt="Chartered Accountant India logo"
                width={44}
                height={44}
                className="h-11 w-11 object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-xl leading-none text-white">{siteContent.firm.name}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Chartered Accountants
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-brass hover:text-brass"
            aria-label="Close mobile navigation"
            onClick={closeMenu}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6 pt-4">
          <nav className="grid gap-1" aria-label="Mobile primary navigation">
            {siteContent.nav.map((item, index) => {
              const icons = [Users, BriefcaseBusiness, Building2, Users, Phone];
              const Icon = icons[index] ?? ArrowRight;

              return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-white/15 px-1 py-4 text-base font-semibold text-white transition hover:text-brass"
                onClick={closeMenu}
              >
                <span className="flex items-center gap-4">
                  <Icon size={20} />
                  {item.label}
                </span>
                {item.label === "Services" ? <ArrowRight size={18} /> : null}
              </a>
              );
            })}
          </nav>

          <div className="mt-6 grid gap-3">
            <Link
              href="/portal/sign-in"
              className="flex items-center gap-4 px-1 py-2 text-base font-semibold text-white transition hover:text-brass"
              onClick={closeMenu}
            >
              <LockKeyhole size={20} />
              <span>Staff Login</span>
            </Link>
            <Link
              href="/#contact"
              className="mt-3 flex items-center justify-between bg-brass px-4 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.2)]"
              onClick={closeMenu}
            >
              <span>Request a Consultation</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-auto border-t border-white/20 pt-6 text-sm leading-7 text-white/85">
            <a href={`tel:${siteContent.firm.phone.replace(/\s/g, "")}`} className="flex items-start gap-3 hover:text-white">
              <Phone className="mt-1 shrink-0" size={18} />
              <span>{siteContent.firm.phone}</span>
            </a>
            <a href={`mailto:${siteContent.firm.email}`} className="mt-4 flex items-start gap-3 break-words hover:text-white">
              <Mail className="mt-1 shrink-0" size={18} />
              <span>{siteContent.firm.email}</span>
            </a>
          </div>
        </div>
      </aside>
    </header>
  );
}
