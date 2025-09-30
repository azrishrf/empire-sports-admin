import AOSProvider from "@/components/AOSProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/lib/adminManagement"; // Make AdminManagement available globally
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "toastify-js/src/toastify.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Empire Sports - Admin Dashboard",
  description: "Admin dashboard for Empire Sports e-commerce platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${poppins.variable}`}>
        <AuthProvider>
          <AOSProvider>{children}</AOSProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
