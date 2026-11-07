import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { listClients } from "@/lib/queries";

export const metadata: Metadata = { title: "Clients" };

export const instant = false;

export default async function AdminClientsPage() {
  await requireAdmin();
  const clients = await listClients();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Clients</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">Accounts created through signup. Passwords are never visible or stored in plain text.</p>
      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-soft">No client accounts yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <td className="px-5 py-3 font-semibold">{c.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{c.email}</td>
                  <td className="px-5 py-3 text-ink-soft">{c.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
