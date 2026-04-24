"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function Topbar({ email, plan }: { email: string; plan: "free" | "pro" | "agency" }) {
  const router = useRouter();
  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <Badge variant={plan === "free" ? "secondary" : "gold"} className="uppercase">
          {plan}
        </Badge>
        {plan === "free" && (
          <Button asChild variant="gold" size="sm">
            <a href="/billing">Passer Pro ⚡</a>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <UserIcon className="h-4 w-4" />
          {email}
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Déconnexion</span>
        </Button>
      </div>
    </header>
  );
}
