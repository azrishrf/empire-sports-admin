"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AccessDeniedPage() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login page after sign out
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center space-x-4">
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/empire-sports-logo.png"
                alt="Empire Sports"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <CardTitle className="text-foreground text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don&apos;t have admin privileges to access this dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">
                Signed in as: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Role: <span className="font-medium">User</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              If you believe you should have admin access, please contact an administrator.
            </p>
            <p className="text-muted-foreground text-sm">Admin privileges must be granted manually in the system.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Sign Out
            </Button>
            <Link href="/login">
              <Button variant="default" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
