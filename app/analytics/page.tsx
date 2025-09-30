"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminService, AdminStats } from "@/lib/adminService";
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data for charts (replace with real data from your analytics service)
const revenueData = [
  { month: "Jan", revenue: 12000, orders: 45 },
  { month: "Feb", revenue: 15000, orders: 52 },
  { month: "Mar", revenue: 18000, orders: 61 },
  { month: "Apr", revenue: 16000, orders: 48 },
  { month: "May", revenue: 22000, orders: 73 },
  { month: "Jun", revenue: 25000, orders: 81 },
];

const categoryData = [
  { name: "Basketball", value: 35, color: "#0088FE" },
  { name: "Running", value: 25, color: "#00C49F" },
  { name: "Clothing", value: 20, color: "#FFBB28" },
  { name: "Sneakers", value: 15, color: "#FF8042" },
  { name: "Other", value: 5, color: "#8884D8" },
];

const topProductsData = [
  { name: "Nike Air Force 1", sales: 145, revenue: 14500 },
  { name: "Basketball Pro", sales: 120, revenue: 12000 },
  { name: "Running Shoes", sales: 98, revenue: 9800 },
  { name: "Sports T-Shirt", sales: 87, revenue: 4350 },
  { name: "Training Shorts", sales: 76, revenue: 3800 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await AdminService.getDashboardStats();
      setStats(dashboardStats);
      setError(null);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground">Loading analytics...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-2xl font-bold">Business Analytics</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-muted-foreground flex items-center text-xs">
                {stats?.revenueGrowth && stats.revenueGrowth > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                {stats?.revenueGrowth ? `${stats.revenueGrowth.toFixed(1)}%` : "0%"} from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-muted-foreground flex items-center text-xs">
                {stats?.ordersGrowth && stats.ordersGrowth > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                {stats?.ordersGrowth ? `${stats.ordersGrowth.toFixed(1)}%` : "0%"} from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-muted-foreground text-xs">Products in catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-muted-foreground text-xs">Registered customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Orders Overview</CardTitle>
              <CardDescription>Monthly order count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Sales by Category</CardTitle>
              <CardDescription>Product category distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Top Selling Products</CardTitle>
              <CardDescription>Best performing products by sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [value, "Sales"]} />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3.2%</div>
              <p className="text-muted-foreground text-sm">Visitors to customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(285)}</div>
              <p className="text-muted-foreground text-sm">Per order average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Customer Lifetime Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(1250)}</div>
              <p className="text-muted-foreground text-sm">Average customer value</p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-amber-600">
                <BarChart3 className="mx-auto mb-4 h-12 w-12" />
                <p className="mb-2">{error}</p>
                <p className="text-muted-foreground text-sm">
                  The charts above show sample data. Implement real analytics data integration for accurate insights.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
