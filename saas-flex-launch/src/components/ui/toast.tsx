"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-card border-border text-foreground",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

export { toast } from "sonner";
