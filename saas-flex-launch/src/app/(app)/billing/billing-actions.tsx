"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { Plan } from "@/lib/db/schema";

type Props = {
  plan: Plan;
  hasCustomer: boolean;
  upgradeTo?: "pro" | "agency";
};

export function BillingActions({ plan, hasCustomer, upgradeTo }: Props) {
  const [loading, setLoading] = useState(false);

  const startCheckout = async (targetPlan: "pro" | "agency") => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const body = await res.json();
      if (!res.ok || !body.url) {
        toast.error("Checkout échoué", { description: body.error });
        return;
      }
      window.location.href = body.url;
    } finally {
      setLoading(false);
    }
  };

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await res.json();
      if (!res.ok || !body.url) {
        toast.error("Erreur", { description: body.error });
        return;
      }
      window.location.href = body.url;
    } finally {
      setLoading(false);
    }
  };

  if (upgradeTo) {
    return (
      <Button variant="gold" className="w-full" onClick={() => startCheckout(upgradeTo)} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Passer au plan ${upgradeTo}`}
      </Button>
    );
  }

  if (plan === "free") {
    return (
      <div className="mt-6 flex gap-3">
        <Button variant="gold" onClick={() => startCheckout("pro")} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Passer Pro"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex gap-3">
      <Button variant="outline" onClick={openPortal} disabled={loading || !hasCustomer}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gérer l'abonnement"}
      </Button>
    </div>
  );
}
