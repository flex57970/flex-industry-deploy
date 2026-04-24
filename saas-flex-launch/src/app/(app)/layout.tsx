import { requireUser } from "@/lib/auth/session";
import { isAdminEmail } from "@/env";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isAdminEmail(user.email)} />
      <div className="flex flex-1 flex-col">
        <Topbar email={user.email} plan={user.profile.plan} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
