import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/logo";
import { getSessionUser } from "@/lib/auth";
import { logout } from "@/app/actions";

const CLIENT_LINKS = [
  { href: "/dashboard", label: "Jobs" },
  { href: "/dashboard/new", label: "New job" },
  { href: "/dashboard/chat", label: "Chat" },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Order queue" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/clients", label: "Clients" },
];

export async function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const links = admin ? ADMIN_LINKS : CLIENT_LINKS;

  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="Nozzle Motion home">
              <Wordmark />
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-mist hover:text-brand">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {admin && (
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">Admin</span>
            )}
            <span className="hidden text-sm text-ink-soft md:block">{user.name}</span>
            <form action={logout}>
              <button className="text-sm font-semibold text-ink-soft hover:text-brand">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
