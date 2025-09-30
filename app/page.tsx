"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminService, AdminStats, TopProduct } from "@/lib/adminService";
import { Order } from "@/lib/orderService";
import { Bell, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "success":
    case "delivered":
      return "default" as const; // Green
    case "pending":
    case "processing":
      return "secondary" as const; // Yellow/amber
    case "failed":
    case "cancelled":
      return "destructive" as const; // Red
    case "shipped":
      return "outline" as const; // Gray/neutral
    default:
      return "outline" as const;
  }
};

export default function Home() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoadingData(true);
      const [dashboardStats, orders, products] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getRecentOrders(5),
        AdminService.getTopProducts(4),
      ]);

      setStats(dashboardStats);
      setRecentOrders(orders);
      setTopProducts(products);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch dashboard data";
      setError(errorMessage);

      // Don't set fallback data - let user know they need to fix Firebase rules
      if (errorMessage.includes("Firestore permissions denied")) {
        setError("❌ Firebase Security Rules Issue: " + errorMessage);
      } else if (errorMessage.includes("not authenticated")) {
        setError("🔒 Please sign in to access the admin dashboard");
      } else {
        setError("⚠️ " + errorMessage);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const renderDashboard = () => {
    if (error) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-2xl space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Dashboard Access Issue</h3>
              <p className="mb-4 whitespace-pre-wrap text-gray-600">{error}</p>
              {error.includes("Firebase Security Rules") && (
                <div className="mb-4 rounded-md bg-gray-50 p-4 text-left text-sm">
                  <p className="mb-2 font-semibold">To fix this, update your Firebase Security Rules:</p>
                  <code className="block rounded bg-gray-100 p-2 text-xs">
                    {`// Add admin read access to orders and users collections
match /users/{userId} {
  allow read: if request.auth != null;
}
match /orders/{orderId} {
  allow read: if request.auth != null;
}`}
                  </code>
                </div>
              )}
              <button
                onClick={fetchDashboardData}
                className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (isLoadingData) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground">Loading dashboard data...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-muted-foreground mb-3 text-xs">
                {stats?.revenueGrowth
                  ? `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}% from last month`
                  : "No previous data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-muted-foreground mb-3 text-xs">
                {stats?.ordersGrowth
                  ? `${stats.ordersGrowth > 0 ? "+" : ""}${stats.ordersGrowth.toFixed(1)}% from last month`
                  : "No previous data"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-muted-foreground text-xs">Active products in catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-muted-foreground text-xs">Registered customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="text-primary">Recent Orders</CardTitle>
              <CardDescription>Latest customer orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-primary font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground py-4 text-center">No recent orders found</p>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-primary">Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-muted-foreground text-xs">{product.sales} sales</p>
                    </div>
                    <div className="text-primary text-sm font-semibold">{product.revenue}</div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground py-4 text-center">No sales data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button className="bg-primary hover:bg-primary/90">Add New Product</Button>
            <Button variant="outline">Process Orders</Button>
            <Button variant="outline">Update Inventory</Button>
            <Button variant="outline">Export Reports</Button>
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              <Bell className="mr-2 h-4 w-4" />
              View Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return <AdminLayout title="Dashboard">{renderDashboard()}</AdminLayout>;
}
