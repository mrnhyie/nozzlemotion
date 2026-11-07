import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroVideo } from "@/components/hero-video";
import { MaterialWheel } from "@/components/material-wheel";

const FEATURES = [
  {
    title: "Accurate Prototyping",
    body: "Tight-tolerance parts for fit checks and design validation, layer lines and all — reviewed by a human before they ship.",
    icon: "M4 16l8-12 8 12H4z",
  },
  {
    title: "Custom Manufacturing",
    body: "Short-run production batches, jigs, and fixtures. We dial in process settings per material, not per marketing page.",
    icon: "M12 4v4m0 8v4m-8-8h4m8 0h4M6.3 6.3l2.9 2.9m5.6 5.6l2.9 2.9m0-11.4l-2.9 2.9m-5.6 5.6l-2.9 2.9",
  },
  {
    title: "Complex Geometries",
    body: "Interlocking assemblies, lattices, and parts injection molding would quote at five figures — printable in PLA, PETG, or ASA.",
    icon: "M4 4h16v16H4V4zm4 4h8v8H8V8z",
  },
];

const OFFERS = [
  { title: "Upload & instant intake", body: "Drop STL, 3MF, OBJ or STEP files into your account. We confirm printability within one business day.", active: true },
  { title: "Materials that mean it", body: "PLA+, PETG, ASA, TPU and carbon-fiber blends, each with documented bed temps and real-world behavior.", active: false },
  { title: "Talk to the operator", body: "A live chat on every job — no ticket queues. Ask about wall thickness, cost, or lead time and get an answer.", active: false },
  { title: "Track to your doorstep", body: "Status moves from intake to print to QA to shipped, visible on your dashboard the moment it happens.", active: false },
];

const GALLERY = [
  { src: "/images/g-printing.jpg", alt: "FDM printer laying a fresh object", credit: "HRostamani / Wikimedia Commons" },
  { src: "/images/g-parts.jpg", alt: "Orange 3D printed motor parts", credit: "Oak Ridge National Laboratory / Wikimedia Commons" },
  { src: "/images/g-shields.jpg", alt: "White printed face-shield brackets in a row", credit: "ESA / Wikimedia Commons" },
  { src: "/images/g-prusa.jpg", alt: "Large frame part printing on a Prusa i3", credit: "hdaniel / Wikimedia Commons" },
  { src: "/images/b-spool.jpg", alt: "Filament feeding a fully printable spool holder", credit: "Creative Tools / Wikimedia Commons" },
  { src: "/images/g-jewelry.jpg", alt: "3D printed heart bracelet after smoothing", credit: "syvwlch / Wikimedia Commons" },
  { src: "/images/p-klien-bottle.jpg", alt: "Green printed Klein bottle on a cutting mat", credit: "Sumanbargavr · CC BY-SA 4.0" },
  { src: "/images/p-cups-one.jpg", alt: "Glazed ceramic cups printed in impossible shapes", credit: "Bernat Cuni / Sam.Donvil · CC BY-SA 4.0" },
  { src: "/images/p-printed-car.jpg", alt: "Printed Strati car body with red seats", credit: "Oak Ridge National Laboratory · CC BY 2.0" },
  { src: "/images/p-gaminiai.jpg", alt: "Green printed spanner keyrings and a frog", credit: "Kryganas · CC BY-SA 4.0" },
];

const MARQUEE = ["PLA+", "PETG", "ASA", "TPU 95A", "CARBON-PLA", "SILK GOLD", "MATTE BLACK", "NANO RESIN", "PC", "WOOD-FILL"];

const WORKFLOW = [
  { n: "01", title: "Upload", body: "Drop STL, 3MF, OBJ or STEP into the wizard. Add as many revisions as you like later.", icon: "M12 16V4m0 0 5 5m-5-5-5 5M4 20h16" },
  { n: "02", title: "We review", body: "A human checks wall thickness, overhangs and print orientation before anyone quotes.", icon: "M4 5h16v11H4zM9 20h6M12 16v4" },
  { n: "03", title: "Quote + chat", body: "Price and lead time land in your job thread. Ask anything, attach a fixed file, we answer.", icon: "M4 6h16v10H8l-4 4z" },
  { n: "04", title: "You approve", body: "One button on the quote puts the job in the print queue. Nothing runs before that.", icon: "M5 13l4 4L19 7" },
  { n: "05", title: "Print, QA, ship", body: "Watch the stepper move. Caliper checks on functional parts, then it is on a truck.", icon: "M3 7h11v7H3zM14 10h4l3 3v1h-7zM6 17a1.6 1.6 0 100 3.2A1.6 1.6 0 006 17zm11 0a1.6 1.6 0 100 3.2A1.6 1.6 0 0017 17z" },
];

const TESTIMONIALS = [
  { quote: "I sent a broken bracket with a hand sketch of what it should have been. Two days later the replacement printed stronger than the original and fit first try.", name: "Kwame Asante", role: "Fleet maintenance, Accra" },
  { quote: "We needed 40 housing units without paying for tooling. Nozzle Motion quoted in an hour and delivered in a week, all within tolerance.", name: "Efua Boateng", role: "IoT founder, Kumasi" },
  { quote: "The chat is the product for me. I ask ‘can this wall survive 60°C?’ and get a straight answer with a material suggestion.", name: "Ama Serwaa", role: "Industrial designer, Tema" },
];

const INSIGHTS = [
  { title: "PLA+ vs PETG for functional parts", body: "Heat deflection, layer adhesion, and UV behavior — the numbers that actually decide the material pick.", tag: "Materials", src: "/images/b-spool.jpg", alt: "Filament spool mounted on a printable holder" },
  { title: "Designing for the nozzle, not the CAD", body: "Four geometry habits that cut print failures and quote prices at the same time.", tag: "Design", src: "/images/b-gantry.jpg", alt: "Printer gantry mid-print on a large bed" },
  { title: "Why we QA every job by hand", body: "A photo of the first layer beats a promise of quality. Here is what we look for before a box gets sealed.", tag: "Process", src: "/images/b-sugar.jpg", alt: "A single 3D printed cube showing surface quality" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const PROJECTS = [
  {
    src: "/images/e-astro-pi-case.jpg",
    alt: "Raspberry Pi with Sense HAT sitting in a 3D printed case",
    title: "Pi cases that keep the hat on",
    body: "Snap lids, Sense HAT clearances, vent slots for a fan — modelled around the board instead of a generic box.",
    fits: "Raspberry Pi 4 / 5 · Sense HAT · Pico",
    credit: "Jgilz · CC BY-SA 4.0",
  },
  {
    src: "/images/e-scaduino.jpg",
    alt: "The first working 3D printed SCADuino board",
    title: "Boards, not just boxes",
    body: "Printed bodies for Arduino-style circuits, front panels and keypad shells where the plastic carries the components.",
    fits: "Arduino Uno / Nano · SCADBoard · perfboard",
    credit: "J. Pagliaccio · CC BY-SA 4.0",
  },
  {
    src: "/images/e-onyx-instrument.jpg",
    alt: "Onyx Ashanti holding his 3D printed, Arduino-powered instrument",
    title: "Instruments and props",
    body: "Hollow bodies with internal ribs for sensors, LEDs and wires — light enough to hold, tough enough to tour.",
    fits: "LED strips · IMUs · contact mics",
    credit: "Campus Party Europa · CC BY 2.0",
  },
  {
    src: "/images/e-astropix-housing.jpg",
    alt: "A 3D printed housing model used to fit-test AstroPix detector electronics",
    title: "Fit checks before the real shell",
    body: "Printed housings used to prove board stackups, connector reach and screw positions before anyone cuts metal.",
    fits: "Sensor heads · detector boards · harness routing",
    credit: "NASA SVS · public domain",
  },
];

const BOARD_SIZES = ["Raspberry Pi 4 / 5", "Pi Pico 2", "ESP32 dev kits", "Arduino Uno / Mega", "Sense HAT", "18650 packs", "Generic perfboard"];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-20" />}>
        <SiteHeader />
      </Suspense>

      {/* Maker projects with electronics */}
      <section id="projects" className="bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Maker projects · electronics</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display max-w-2xl text-3xl font-bold sm:text-4xl">We help you build a body for your ideas</h2>
            <Link href="/signup" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-black">
              Start an enclosure job
            </Link>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-soft">
            A bare board is a prototype. The case, the bracket, the panel with the right cutouts — that is the part people actually
            use. Send the board dimensions, connector positions and where it has to live, and we model around them.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <article key={p.src} className="group overflow-hidden rounded-xl border border-line bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{p.body}</p>
                  <p className="mt-4 border-t border-line pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    Sized for · {p.fits}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
                    {p.credit}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-white px-6 py-7">
            <p className="text-sm font-semibold">Boards we size enclosures for</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {BOARD_SIZES.map((b) => (
                <li key={b} className="rounded-full border border-line bg-mist px-3 py-1.5 text-xs font-semibold text-ink-soft">
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-ink-soft">
              Thermal, mounting and cable-relief questions get answered in the job chat before the first layer, not after.
              Reference photos above are community and agency prints, shown as build ideas rather than our own jobs.
            </p>
          </div>
        </div>
      </section>

      {/* Hero — bento tiles over live print footage */}
      <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-cream px-4 py-24 sm:px-6">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -right-12 top-16 h-40 w-40 text-brand/15 sm:h-64 sm:w-64 sm:-right-16 sm:top-20 sm:text-brand/20">
          <path d="M50 6v88M6 50h88M20 20l60 60M80 20l-60 60" stroke="currentColor" strokeWidth="13" strokeLinecap="round" fill="none" />
        </svg>
        <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-12">
          <div className="relative isolate flex min-h-[440px] flex-col justify-end overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-9 lg:col-span-7">
            <HeroVideo src="/video/hero-printing.mp4" poster="/video/hero-poster.jpg" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/15" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">Live from the bed</p>
            <h1 className="font-display mt-4 max-w-md text-4xl font-bold leading-[1.05] sm:text-5xl">
              A body for every idea you build
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Upload the model, talk to the operator in chat, get parts that fit — enclosures, brackets, jigs and
              prototypes in PLA+, PETG, ASA and TPU.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
                Start a job
              </Link>
              <Link href="/#workflow" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white">
                See how it works
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] bg-brand-soft p-7 sm:p-9 lg:col-span-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-dark sm:text-3xl">At Nozzle Motion,</h2>
              <p className="mt-4 text-base leading-7 text-ink">
                the person who answers your chat is the person standing at the printer. Nothing gets quoted by a bot,
                nothing ships without a caliper check, and every revision you attach stays in the same thread as the
                quote that covered it.
              </p>
            </div>
            <a href="/#workflow" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold hover:bg-paper">
              How a job runs
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          {FEATURES.map((f, i) => (
            <div key={f.title} className="rounded-[28px] border border-line bg-white p-7 lg:col-span-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-brand"><Icon d={f.icon} /></span>
                <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
              </div>
              <h3 className="font-display mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{f.body}</p>
            </div>
          ))}

          <div className="flex flex-col justify-between gap-6 rounded-[28px] bg-ink p-7 text-white sm:p-9 lg:col-span-7">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">Talk to a human first</p>
              <p className="mt-4 max-w-md text-lg font-semibold leading-7">
                Send the board dimensions, the tolerance and where the part has to live — we will tell you whether it
                prints before you pay for it.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <a href="tel:+233545554890" className="flex items-center gap-2 text-white/75 hover:text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
                <span className="font-mono">+233 54 555 4890</span>
              </a>
              <a href="mailto:Projectbasegh@gmail.com" className="flex items-center gap-2 text-white/75 hover:text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
                </svg>
                <span className="font-mono">Projectbasegh@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-[28px] lg:col-span-5">
            <Image src="/images/g-parts.jpg" alt="Orange printed parts fresh off the bed" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        </div>
      </section>

      {/* Material wheel */}
      <div className="border-b border-line bg-white py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-md text-center lg:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-soft">Materials</p>
            <h2 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
              {MARQUEE.length} materials on the shelf
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-soft">
              Change the spool, not the supplier — PETG for heat, ASA for sun, TPU for hinges, carbon-PLA when the part
              has to stay straight under load.
            </p>
          </div>
          <MaterialWheel materials={MARQUEE} />
        </div>
      </div>

      {/* Workflow */}
      <section id="workflow" className="bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">How a job runs</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display max-w-xl text-3xl font-bold sm:text-4xl">From upload to doorstep, in one thread</h2>
          <Link href="/signup" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-brand hover:text-brand">
            Start job #0043
          </Link>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {WORKFLOW.map((w, i) => (
            <li
              key={w.n}
              className="group relative overflow-hidden rounded-xl border border-line bg-white p-5 transition hover:border-brand hover:shadow-md hover:shadow-black/5"
            >
              <span className="absolute right-4 top-3 font-display text-3xl font-bold text-mist transition group-hover:text-brand/15">{w.n}</span>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon d={w.icon} />
              </span>
              <h3 className="font-display relative mt-4 text-base font-bold">{w.title}</h3>
              <p className="relative mt-2 text-sm leading-6 text-ink-soft">{w.body}</p>
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden="true"
              />
              {i < WORKFLOW.length - 1 && (
                <span className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-line lg:block" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-white px-5 py-4 text-sm text-ink-soft">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16v10H8l-4 4z" />
          </svg>
          <p>
            Chat runs through all five steps. Revised file? Attach it to the thread with the paperclip and the whole history —
            questions, quotes, decisions — stays with the job.
          </p>
        </div>
        </div>
      </section>

      {/* What we offer */}
      <section id="materials" className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">What we offer</p>
        <h2 className="font-display mx-auto mt-3 max-w-xl text-center text-3xl font-bold sm:text-4xl">
          Shaping the future of manufacturing
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o, i) => (
            <div
              key={o.title}
              className={
                o.active
                  ? "rounded-xl bg-brand p-6 text-white shadow-md shadow-orange-500/30"
                  : "rounded-xl border border-line bg-white p-6"
              }
            >
              <span className={o.active ? "text-white/90" : "text-brand"}>
                <Icon d={["M4 6h16v12H4z M4 10h16", "M9 3l3 4 3-4 M6 21V9h12v12", "M12 3a9 9 0 100 18 9 9 0 000-18z M12 8v4l3 2", "M5 12l5 5 9-11"][i]} />
              </span>
              <h3 className={`font-display mt-4 text-base font-bold ${o.active ? "text-white" : "text-ink"}`}>{o.title}</h3>
              <p className={`mt-2 text-sm leading-6 ${o.active ? "text-white/85" : "text-ink-soft"}`}>{o.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Photo band */}
      <section id="printers" className="relative isolate bg-ink py-20 text-white">
        <Image src="/images/band.png" alt="" fill className="absolute inset-0 -z-10 object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 -z-10 bg-ink/70" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">3D printing made simple</h2>
          <p className="mt-4 text-white/75">Seamless operation and precision results — delivered at an unbeatable value.</p>
          <Link href="/signup" className="mt-7 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold hover:bg-brand-dark">
            Learn more
          </Link>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {GALLERY.map((g) => (
            <div key={g.src} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
              <p className="absolute bottom-8 left-4 right-4 translate-y-2 text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                {g.alt}
              </p>
              <p className="absolute bottom-3 left-4 right-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                {g.credit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-brand/5">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Testimonials</p>
        <h2 className="font-display mx-auto mt-3 max-w-lg text-3xl font-bold sm:text-4xl">Proven results backed by real feedback</h2>
        <div className="mt-12 space-y-10">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="mx-auto max-w-2xl">
              <div className="font-display text-4xl leading-none text-brand">&ldquo;</div>
              <blockquote className="mt-2 text-base italic leading-7 text-ink-soft">{t.quote}</blockquote>
              <figcaption className="mt-4 flex items-center justify-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="block text-ink-soft">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        </div>
      </section>

      {/* Why we stand out */}
      <section id="about" className="grid items-stretch lg:grid-cols-2">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:pl-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Why we stand out</p>
          <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">Leading the way in 3D printing</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-ink-soft">
            Every job is printed, inspected, and packed by the same small team you talk to in chat. No offshore queue, no mystery
            tolerances — just documented process and parts that arrive as promised.
          </p>
          <ul className="mt-7 space-y-3 text-sm">
            {[
              "Printability review on every upload, before you pay",
              "Dimensional QA with calipers on functional parts",
              "Direct chat with the operator printing your job",
            ].map((li) => (
              <li key={li} className="flex items-start gap-3">
                <span className="mt-0.5 text-brand"><Icon d="M5 13l4 4L19 7" /></span>
                {li}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Read more
          </Link>
        </div>
        <div className="relative min-h-[320px]">
          <Image src="/images/band.png" alt="Freshly printed orange parts on a print bed" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* Insights */}
      <section className="bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Blog & news</p>
        <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">Latest from our insights</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {INSIGHTS.map((a) => (
            <article key={a.title} className="group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image src={a.src} alt={a.alt} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{a.tag}</span>
              </div>
              <h3 className="font-display mt-4 text-base font-bold group-hover:text-brand">{a.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{a.body}</p>
            </article>
          ))}
        </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
