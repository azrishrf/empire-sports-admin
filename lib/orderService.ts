import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  subtotal: number;
}

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  status: "pending" | "success" | "failed" | "cancelled" | "processing" | "shipped" | "delivered";
  paymentStatus: "pending" | "success" | "failed";
  billCode?: string;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
}

export class OrderService {
  private static readonly COLLECTION_NAME = "orders";

  /**
   * Create a new order in Firestore
   */
  static async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

      const now = Timestamp.now();
      const order: Omit<Order, "id"> = {
        ...orderData,
        createdAt: now,
        updatedAt: now,
      };

      console.log(
        "Final order object:",
        JSON.stringify(
          {
            ...order,
            createdAt: "Timestamp",
            updatedAt: "Timestamp",
          },
          null,
          2,
        ),
      );

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), order);
      console.log("Order created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      throw new Error("Failed to create order");
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Order;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting order:", error);
      throw new Error("Failed to get order");
    }
  }

  /**
   * Get order by order ID (not document ID)
   */
  static async getOrderByOrderId(orderId: string): Promise<Order | null> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), where("orderId", "==", orderId));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as Order;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting order by orderId:", error);
      throw new Error("Failed to get order");
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    updates: Partial<Pick<Order, "status" | "paymentStatus" | "billCode" | "transactionId" | "notes">>,
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      console.log("Order updated:", orderId);
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Error("Failed to update order");
    }
  }

  /**
   * Update order payment status
   */
  static async updateOrderPaymentStatus(
    orderId: string,
    paymentData: {
      status: "success" | "failed";
      transactionId?: string;
      billCode?: string;
      notes?: string;
    },
  ): Promise<void> {
    try {
      const updates: Partial<Order> = {
        paymentStatus: paymentData.status,
        status: paymentData.status === "success" ? "processing" : "failed",
        updatedAt: Timestamp.now(),
      };

      if (paymentData.transactionId) {
        updates.transactionId = paymentData.transactionId;
      }

      if (paymentData.billCode) {
        updates.billCode = paymentData.billCode;
      }

      if (paymentData.notes) {
        updates.notes = paymentData.notes;
      }

      const docRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(docRef, updates);
      console.log("Order payment status updated:", orderId);
    } catch (error) {
      console.error("Error updating order payment status:", error);
      throw new Error("Failed to update order payment status");
    }
  }

  /**
   * Get orders by user ID
   */
  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw new Error("Failed to get user orders");
    }
  }

  /**
   * Get all orders (admin function)
   */
  static async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error("Error getting all orders:", error);
      throw new Error("Failed to get all orders");
    }
  }
}
