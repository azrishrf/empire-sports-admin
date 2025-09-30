"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <span className="text-muted-foreground">Redirecting...</span>
      </div>
    </div>
  );
}
