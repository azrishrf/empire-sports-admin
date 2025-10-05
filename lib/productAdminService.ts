import { Product } from "@/data/products";
import { db } from "@/lib/firebase";
import { uploadFile } from "@uploadcare/upload-client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  brand: string;
  colorway: string;
  material: string;
  gender: string;
  sizes: string[];
  availability: string;
  stock?: number;
}

export class ProductAdminService {
  // Get all products with filtering and sorting
  static async getProducts(category?: string, sortBy: string = "name"): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      let q = query(productsRef);

      if (category && category !== "all") {
        q = query(productsRef, where("category", "==", category));
      }

      // Add ordering
      q = query(q, orderBy(sortBy));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  // Add new product
  static async addProduct(productData: ProductFormData, imageFiles: File[]): Promise<string> {
    try {
      console.log("test: ", imageFiles);
      // Upload images first
      const imageUrls = await this.uploadProductImages(imageFiles);

      const newProduct = {
        ...productData,
        image: imageUrls[0] || "",
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "products"), newProduct);
      return docRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Failed to add product");
    }
  }

  // Update existing product
  static async updateProduct(
    productId: string,
    productData: Partial<ProductFormData>,
    newImageFiles?: File[],
  ): Promise<void> {
    try {
      const updateData: Partial<ProductFormData> & {
        images?: string[];
        image?: string;
        updatedAt: ReturnType<typeof serverTimestamp>;
      } = {
        ...productData,
        updatedAt: serverTimestamp(),
      };

      // Upload new images if provided
      if (newImageFiles && newImageFiles.length > 0) {
        const imageUrls = await this.uploadProductImages(newImageFiles);
        updateData.images = imageUrls;
        updateData.image = imageUrls[0];
      }

      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, updateData);
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  // Delete product
  static async deleteProduct(productId: string, imageUrls?: string[]): Promise<void> {
    try {
      // Delete images from storage first
      if (imageUrls && imageUrls.length > 0) {
        await this.deleteProductImages(imageUrls);
      }

      // Delete product document
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }

  // Upload product images to Uploadcare
  static async uploadProductImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadFile(file, {
          publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
          store: "auto",
          metadata: {
            filename: file.name,
            contentType: file.type,
          },
        });

        return result.cdnUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  }

  // Delete product images from Uploadcare
  static async deleteProductImages(imageUrls: string[]): Promise<void> {
    try {
      // Extract file UUIDs from Uploadcare CDN URLs
      const fileUuids = imageUrls
        .map((url) => {
          const match = url.match(/\/([a-f0-9-]{36})\//);
          return match ? match[1] : null;
        })
        .filter((uuid) => uuid !== null);

      if (fileUuids.length > 0) {
        // Note: File deletion requires a secret key and should be done server-side
        // For client-side operations, files will remain until manual cleanup
        console.log("File UUIDs for deletion:", fileUuids);
      }
    } catch (error) {
      console.error("Error deleting images:", error);
      // Don't throw error for image deletion failures
    }
  }

  // Get product categories
  static async getCategories(): Promise<string[]> {
    try {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);

      const categories = new Set<string>();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          categories.add(data.category);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error("Error getting categories:", error);
      return ["Basketball", "Running", "Sneakers", "Sandals", "Clothing"];
    }
  }

  // Update product stock
  static async updateStock(productId: string, newStock: number): Promise<void> {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        stock: newStock,
        availability: newStock > 0 ? "IN STOCK" : "OUT OF STOCK",
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      throw new Error("Failed to update stock");
    }
  }
}
