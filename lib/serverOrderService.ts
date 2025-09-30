import { Order } from "@/lib/orderService";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccount = process.env.SERVICE_ACCOUNT;

  if (!serviceAccount) {
    console.error("Missing Firebase Admin SDK service account");
    console.error("Required: SERVICE_ACCOUNT environment variable with JSON service account key");
    throw new Error("Firebase Admin SDK configuration is incomplete");
  }

  try {
    // Parse the service account JSON
    const serviceAccountKey = JSON.parse(serviceAccount);

    const app = initializeApp({
      credential: cert(serviceAccountKey),
    });

    return app;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    console.error("Error details:", error);
    throw error;
  }
}

// Initialize Firebase Admin
initializeFirebaseAdmin();

const db = getFirestore();

export class ServerOrderService {
  /**
   * Get an order by its orderId (not the document ID)
   */
  static async getOrderByOrderId(orderId: string): Promise<(Order & { id: string }) | null> {
    try {
      console.log("Searching for order with orderId:", orderId);

      const ordersRef = db.collection("orders");
      const snapshot = await ordersRef.where("orderId", "==", orderId).limit(1).get();

      if (snapshot.empty) {
        console.log("No order found with orderId:", orderId);
        return null;
      }

      const doc = snapshot.docs[0];
      const orderData = doc.data() as Order;

      console.log("Found order:", { id: doc.id, orderId: orderData.orderId });

      return {
        id: doc.id,
        ...orderData,
      };
    } catch (error) {
      console.error("Error getting order by orderId:", error);
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Update order payment status
   */
  static async updateOrderPaymentStatus(
    documentId: string,
    paymentData: {
      status: string;
      transactionId?: string;
      billCode?: string;
      notes?: string;
    },
  ): Promise<void> {
    try {
      console.log("Updating order payment status:", { documentId, paymentData });

      const orderRef = db.collection("orders").doc(documentId);

      await orderRef.update({
        paymentStatus: paymentData.status,
        ...(paymentData.transactionId && { transactionId: paymentData.transactionId }),
        ...(paymentData.billCode && { billCode: paymentData.billCode }),
        ...(paymentData.notes && { notes: paymentData.notes }),
        updatedAt: new Date(),
      });

      // Also update main status if payment is successful
      if (paymentData.status === "success") {
        await orderRef.update({
          status: "confirmed",
        });
      }

      console.log("Order payment status updated successfully");
    } catch (error) {
      console.error("Error updating order payment status:", error);
      throw new Error(`Failed to update order: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
