import { Product } from "@/data/products";
import { Timestamp } from "firebase/firestore";

// Type for handling Firestore timestamp-like objects
type FirestoreTimestamp = Timestamp | { toDate(): Date } | Date;

/**
 * Utility to serialize products for client components
 * Converts Firestore Timestamps to plain objects that can be passed to client components
 */
export function serializeProductForClient(product: Product): Product {
  return {
    ...product,
    createdAt: product.createdAt ? convertTimestamp(product.createdAt) : undefined,
    updatedAt: product.updatedAt ? convertTimestamp(product.updatedAt) : undefined,
  } as Product;
}

/**
 * Utility to serialize multiple products for client components
 */
export function serializeProductsForClient(products: Product[]): Product[] {
  return products.map(serializeProductForClient);
}

/**
 * Type-safe way to handle Timestamp conversion
 */
export function convertTimestamp(timestamp: FirestoreTimestamp | undefined): Date | undefined {
  if (!timestamp) return undefined;

  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }

  // Handle already converted dates
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle Firestore timestamp objects with toDate method
  if ("toDate" in timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  return undefined;
}
