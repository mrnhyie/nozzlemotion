import Link from "next/link";
import { Wordmark } from "./logo";
import { getSessionUser } from "@/lib/auth";

const NAV = [
  { href: "/#printers", label: "3D Printers" },
  { href: "/#materials", label: "Materials" },
  { href: "/#projects", label: "Projects" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export async function SiteHeader() {
  const user = await getSessionUser();
  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-line bg-white/95 pl-4 pr-2 shadow-lg shadow-black/5 backdrop-blur sm:gap-6 sm:pl-6 sm:pr-3">
        <Link href="/" aria-label="Nozzle Motion home" className="shrink-0">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold tracking-wide text-ink-soft lg:flex">
          <Link href="/" className="text-ink">Home</Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/dashboard"}
              className="whitespace-nowrap rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark sm:px-5"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden whitespace-nowrap text-sm font-semibold text-ink-soft hover:text-brand sm:block">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-black sm:px-5"
              >
                Get a quote
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
