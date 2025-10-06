import { auth, db } from "@/lib/firebase";
import { Order } from "@/lib/orderService";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export type ChartPeriod = "day" | "month";

export class AdminService {
  /**
   * Internal helper to safely obtain the currently authenticated user.
   * Firebase sets auth state asynchronously on page refresh; relying solely on auth.currentUser
   * can cause transient "User not authenticated" errors. This waits (once) for the auth state
   * restoration. A short timeout guards against hanging forever.
   */
  private static async requireUser(timeoutMs: number = 4000): Promise<User> {
    // Fast path
    if (auth.currentUser) return auth.currentUser;

    return await new Promise<User>((resolve, reject) => {
      const timer = setTimeout(() => {
        unsubscribe();
        reject(new Error("Authentication timeout – user not resolved in time"));
      }, timeoutMs);

      const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          clearTimeout(timer);
          unsubscribe();
          resolve(u);
        }
      });
    });
  }
  /**
   * Get admin dashboard statistics - prioritizing real Firestore data
   */
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      // Ensure we have an authenticated user (waits for Firebase to hydrate on refresh)
      await this.requireUser();

      console.log("Fetching real dashboard data from Firestore...");

      // Get current month data
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch real data from Firestore
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);

      let totalRevenue = 0;
      let currentMonthRevenue = 0;
      let lastMonthRevenue = 0;
      let currentMonthOrders = 0;
      let lastMonthOrders = 0;
      const totalOrders = ordersSnapshot.size;

      // Calculate revenue from successful orders
      ordersSnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        if (order.paymentStatus === "success") {
          const orderDate = order.createdAt.toDate();
          const orderAmount = order.totalAmount || 0;

          totalRevenue += orderAmount;

          // Check if order is in current month
          if (orderDate >= startOfCurrentMonth) {
            currentMonthRevenue += orderAmount;
            currentMonthOrders++;
          }
          // Check if order is in last month
          else if (orderDate >= startOfLastMonth && orderDate <= endOfLastMonth) {
            lastMonthRevenue += orderAmount;
            lastMonthOrders++;
          }
        }
      });

      // Calculate growth percentages
      const revenueGrowth =
        lastMonthRevenue > 0
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : currentMonthRevenue > 0
            ? 100
            : 0;

      const ordersGrowth =
        lastMonthOrders > 0
          ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
          : currentMonthOrders > 0
            ? 100
            : 0;

      // Get product count
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const totalProducts = productsSnapshot.size;

      // Get user count
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const totalUsers = usersSnapshot.size;

      console.log("Successfully fetched real data:", {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        currentMonthRevenue,
        lastMonthRevenue,
        currentMonthOrders,
        lastMonthOrders,
        revenueGrowth: revenueGrowth.toFixed(1),
        ordersGrowth: ordersGrowth.toFixed(1),
      });

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10, // Round to 1 decimal place
        ordersGrowth: Math.round(ordersGrowth * 10) / 10, // Round to 1 decimal place
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Provide more specific error messages
      if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
        throw new Error(
          "Firestore permissions denied. Please update your Firebase security rules to allow admin access to users and orders collections.",
        );
      }
      throw error;
    }
  }

  /**
   * Get recent orders - prioritizing real Firestore data
   */
  static async getRecentOrders(limitCount: number = 10): Promise<Order[]> {
    try {
      await this.requireUser();

      console.log("Fetching real orders data from Firestore...");

      const ordersCollection = collection(db, "orders");
      const ordersQuery = query(ordersCollection, orderBy("createdAt", "desc"), limit(limitCount));
      const querySnapshot = await getDocs(ordersQuery);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data() as Order;
        orders.push({
          ...orderData,
          id: doc.id,
        });
      });

      console.log(`Successfully fetched ${orders.length} real orders`);
      return orders;
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
        throw new Error(
          "Firestore permissions denied. Please update your Firebase security rules to allow admin access to orders collection.",
        );
      }
      throw error;
    }
  }

  /**
   * Get top products by sales with fallback data
   */
  static async getTopProducts(limitCount: number = 5): Promise<TopProduct[]> {
    try {
      // We don't strictly need the user object here beyond ensuring auth context is ready.
      await this.requireUser().catch(() => {
        console.warn("User not authenticated (continuing: top products will rely on security rules)");
      });

      try {
        console.log("Fetching real top products data from Firestore...");

        // Get all successful orders (matching the status used in dashboard stats)
        const ordersCollection = collection(db, "orders");
        const ordersQuery = query(ordersCollection, where("paymentStatus", "==", "success"));
        const ordersSnapshot = await getDocs(ordersQuery);

        // Count sales by product
        const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};

        ordersSnapshot.forEach((doc) => {
          const order = doc.data() as Order;
          order.items.forEach((item) => {
            if (!productSales[item.id]) {
              productSales[item.id] = {
                name: item.name,
                sales: 0,
                revenue: 0,
              };
            }
            productSales[item.id].sales += item.quantity;
            productSales[item.id].revenue += item.price * item.quantity;
          });
        });

        // Convert to array and sort by sales (highest first)
        const topProducts = Object.entries(productSales)
          .map(([id, data]) => ({
            id,
            name: data.name,
            sales: data.sales,
            revenue: new Intl.NumberFormat("en-MY", {
              style: "currency",
              currency: "MYR",
            }).format(data.revenue),
          }))
          .sort((a, b) => b.sales - a.sales) // Sort by sales descending (highest first)
          .slice(0, limitCount);


        return topProducts;
      } catch (firestoreError) {
        console.error("Products/Orders data access failed:", firestoreError);
        if (firestoreError instanceof Error && firestoreError.message.includes("Missing or insufficient permissions")) {
          throw new Error(
            "Firestore permissions denied. Please update your Firebase security rules to allow admin access to orders collection.",
          );
        }
        throw firestoreError;
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw error;
    }
  }

  /**
   * Get chart data for revenue and orders over time
   */
  static async getChartData(period: ChartPeriod = "month"): Promise<ChartDataPoint[]> {
    try {
      await this.requireUser();

      console.log(`Fetching chart data for ${period} view...`);

      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);

      // Create data structure to store aggregated data
      const chartData: { [key: string]: { revenue: number; orders: number } } = {};

      ordersSnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        if (order.paymentStatus === "success") {
          const orderDate = order.createdAt.toDate();
          let dateKey: string;

          if (period === "day") {
            // Format: "2025-09-30"
            dateKey = orderDate.toISOString().split("T")[0];
          } else {
            // Format: "2025-09" for months
            dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
          }

          if (!chartData[dateKey]) {
            chartData[dateKey] = { revenue: 0, orders: 0 };
          }

          chartData[dateKey].revenue += order.totalAmount || 0;
          chartData[dateKey].orders += 1;
        }
      });

      // Convert to array and sort by date
      const chartDataPoints: ChartDataPoint[] = Object.entries(chartData)
        .map(([date, data]) => ({
          date,
          revenue: Math.round(data.revenue * 100) / 100, // Round to 2 decimal places
          orders: data.orders,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Get last 12 months or 30 days based on period
      const limitedData =
        period === "day"
          ? chartDataPoints.slice(-30) // Last 30 days
          : chartDataPoints.slice(-12); // Last 12 months

      console.log(`Successfully fetched ${limitedData.length} ${period} data points`);
      return limitedData;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
        throw new Error(
          "Firestore permissions denied. Please update your Firebase security rules to allow admin access to orders collection.",
        );
      }
      throw error;
    }
  }
}
