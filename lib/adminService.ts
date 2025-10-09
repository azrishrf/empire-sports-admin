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

export interface CategoryData {
  name: string;
  value: number;
  color: string;
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
   * Get category distribution from real order data
   */
  static async getCategoryDistribution(): Promise<CategoryData[]> {
    try {
      await this.requireUser();

      const ordersCollection = collection(db, "orders");
      const ordersQuery = query(ordersCollection, where("paymentStatus", "==", "success"));
      const ordersSnapshot = await getDocs(ordersQuery);

      // Fetch all products to get their categories
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);

      // Create a map of product names to their categories
      const productCategoryMap: { [key: string]: string } = {};
      productsSnapshot.forEach((doc) => {
        const product = doc.data();
        const productName = product.name?.toLowerCase();
        const category = product.category || this.categorizeByName(product.name);
        if (productName) {
          productCategoryMap[productName] = category;
        }
      });

      // Count sales by category (based on product collection data)
      const categoryCount: { [key: string]: number } = {};
      let totalItems = 0;

      ordersSnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        order.items.forEach((item) => {
          const itemName = item.name.toLowerCase();

          // Look up category from products collection first
          let category = productCategoryMap[itemName];

          // If not found in products collection, use keyword matching as fallback
          if (!category) {
            category = this.categorizeByName(item.name);
          }

          categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
          totalItems += item.quantity;
        });
      });

      // Define colors for categories
      const categoryColors: { [key: string]: string } = {
        Basketball: "#0088FE",
        Running: "#00C49F",
        Clothing: "#FFBB28",
        Sneakers: "#FF8042",
        Other: "#8884D8",
      };

      // Convert to percentage and create array
      const categoryData: CategoryData[] = Object.entries(categoryCount)
        .map(([name, count]) => ({
          name,
          value: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
          color: categoryColors[name] || "#8884D8",
        }))
        .sort((a, b) => b.value - a.value); // Sort by value descending

      return categoryData;
    } catch (error) {
      console.error("Error fetching category distribution:", error);
      if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
        throw new Error(
          "Firestore permissions denied. Please update your Firebase security rules to allow admin access to orders collection.",
        );
      }
      throw error;
    }
  }

  /**
   * Helper method to categorize products by name keywords (fallback)
   */
  private static categorizeByName(productName: string): string {
    const itemName = productName.toLowerCase();

    // Categorize based on product name keywords
    if (itemName.includes("basketball") || itemName.includes("ball")) {
      return "Basketball";
    } else if (itemName.includes("running") || itemName.includes("run")) {
      return "Running";
    } else if (
      itemName.includes("shirt") ||
      itemName.includes("clothing") ||
      itemName.includes("shorts") ||
      itemName.includes("apparel")
    ) {
      return "Clothing";
    } else if (
      itemName.includes("sneaker") ||
      itemName.includes("shoe") ||
      itemName.includes("nike") ||
      itemName.includes("adidas")
    ) {
      return "Sneakers";
    }

    return "Other";
  }

  /**
   * Get chart data for revenue and orders over time
   */
  static async getChartData(period: ChartPeriod = "month"): Promise<ChartDataPoint[]> {
    try {
      await this.requireUser();

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
