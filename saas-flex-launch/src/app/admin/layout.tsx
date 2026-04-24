import { requireAdmin } from "@/lib/auth/session";
import { Topbar } from "@/components/app/topbar";
import { Sidebar } from "@/components/app/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin />
      <div className="flex flex-1 flex-col">
        <Topbar email={user.email} plan={user.profile.plan} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
