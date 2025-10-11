"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminService, AdminStats, CategoryData, ChartDataPoint } from "@/lib/adminService";
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

interface TopProductChartData {
  name: string;
  sales: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topProductsData, setTopProductsData] = useState<TopProductChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel
      const [dashboardStats, chartData, categoryDistribution, topProducts] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getChartData("month"),
        AdminService.getCategoryDistribution(),
        AdminService.getTopProducts(5),
      ]);

      setStats(dashboardStats);

      // Transform chart data to include month names
      const transformedData = chartData.map((item) => {
        const date = new Date(item.date + "-01"); // Add day to make it a valid date
        const monthName = date.toLocaleDateString("en-US", { month: "short" });
        return {
          month: monthName,
          revenue: item.revenue,
          orders: item.orders,
          date: item.date,
        };
      });

      setRevenueData(transformedData);

      // Set real category data or fallback
      setCategoryData(categoryDistribution);

      // Transform top products data for the chart
      const transformedTopProducts = topProducts.map((product) => ({
        name: product.name,
        sales: product.sales,
        revenue: parseFloat(product.revenue.replace(/[^0-9.-]+/g, "")), // Remove currency formatting
      }));

      setTopProductsData(transformedTopProducts);

      setError(null);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to fetch analytics data");
      // Set fallback data on error to prevent chart crashes
      setRevenueData([]);
      setCategoryData([]);
      setTopProductsData([]);
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
                  <LineChart data={revenueData.length > 0 ? revenueData : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {revenueData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">No revenue data available</p>
                </div>
              )}
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
                  <BarChart data={revenueData.length > 0 ? revenueData : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {revenueData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">No orders data available</p>
                </div>
              )}
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
              {categoryData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">No category data available</p>
                </div>
              )}
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
                  <BarChart data={topProductsData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name === "sales" ? "Units Sold" : name]}
                      labelFormatter={(label) => `Product: ${label}`}
                    />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {topProductsData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">No top products data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        {/* <div className="grid gap-4 md:grid-cols-3">
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
        </div> */}

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-amber-600">
                <BarChart3 className="mx-auto mb-4 h-12 w-12" />
                <p className="mb-2">{error}</p>
                <p className="text-muted-foreground text-sm">
                  Revenue, orders, category distribution, and top products data: Real Firebase data.
                  {revenueData.length === 0
                    ? " No real order data found in Firebase - showing fallback data for charts."
                    : ` Showing real data from ${revenueData.length} months of orders.`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
