"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, loading, isAdmin, checkingAdminStatus, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !checkingAdminStatus) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/access-denied");
      }
    }
  }, [user, loading, isAdmin, checkingAdminStatus, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading || checkingAdminStatus) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="bg-background flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1">
          <header className="border-border bg-background flex h-16 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-primary text-xl font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary">
                Welcome, {user.displayName || user.email}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-primary cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-6 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
