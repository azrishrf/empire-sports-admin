"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { ProductManagement } from "@/components/ProductManagement";

export default function ProductsPage() {
  return (
    <AdminLayout title="Products">
      <ProductManagement />
    </AdminLayout>
  );
}
