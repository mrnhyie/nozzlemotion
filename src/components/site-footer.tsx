"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "./logo";

function CurrentYear() {
  const [year, setYear] = useState<string | null>(null);
  useEffect(() => setYear(String(new Date().getFullYear())), []);
  return <>{year ?? "2026"}</>;
}

const COLS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Careers", href: "/#contact" },
      { label: "Sustainability", href: "/#materials" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { label: "Start a job", href: "/signup" },
      { label: "Track an order", href: "/dashboard" },
      { label: "Material guide", href: "/#materials" },
      { label: "Shipping & returns", href: "/#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <LogoMark className="h-8 w-8 text-brand" />
            NOZZLE MOTION
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            An on-demand FDM 3D printing service. Upload a model, talk to a human, get parts that actually fit.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.heading}>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">{col.heading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-brand">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Connect</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/60">
            <li>
              <a href="tel:+233545554890" className="hover:text-brand">+233 54 555 4890</a>
            </li>
            <li>
              <a href="mailto:Projectbasegh@gmail.com" className="hover:text-brand">Projectbasegh@gmail.com</a>
            </li>
            <li>Fastest reply: chat inside your job thread</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:px-6">
          <span>© <CurrentYear /> Nozzle Motion. All rights reserved.</span>
          <span className="flex gap-6">
            <Link href="/#about" className="hover:text-white">Privacy</Link>
            <Link href="/#about" className="hover:text-white">Terms</Link>
          </span>
          <span>
            Hero video and photos courtesy of{" "}
            <a href="https://commons.wikimedia.org/wiki/File:3D_printing_time-lapse_2026.webm" className="underline decoration-white/30 hover:text-white" rel="noopener noreferrer" target="_blank">
              Wikimedia Commons
            </a>{" "}
            contributors (CC0 / CC BY / CC BY-SA / public domain).
          </span>
        </div>
      </div>
    </footer>
  );
}
