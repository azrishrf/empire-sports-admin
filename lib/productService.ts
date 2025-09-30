import { Product, Review } from "@/data/products";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { serializeProductForClient, serializeProductsForClient } from "./productUtils";

export class ProductService {
  private static readonly COLLECTION_NAME = "products";

  /**
   * Get all products from Firestore
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const productsCollection = collection(db, this.COLLECTION_NAME);
      const querySnapshot = await getDocs(productsCollection);

      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
        } as Product);
      });

      return serializeProductsForClient(products);
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  /**
   * Get products by category from Firestore
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const productsCollection = collection(db, this.COLLECTION_NAME);
      const q = query(productsCollection, where("category", "==", category), orderBy("name"));

      const querySnapshot = await getDocs(q);

      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
        } as Product);
      });

      return serializeProductsForClient(products);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get a single product by ID from Firestore
   */
  static async getProductById(productId: string): Promise<Product | null> {
    try {
      const productDoc = doc(db, this.COLLECTION_NAME, productId);
      const docSnapshot = await getDoc(productDoc);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const product = {
          id: docSnapshot.id,
          ...data,
        } as Product;
        return serializeProductForClient(product);
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Search products by name or brand
   */
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const productsCollection = collection(db, this.COLLECTION_NAME);
      const querySnapshot = await getDocs(productsCollection);

      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const product = {
          id: doc.id,
          ...data,
        } as Product;

        // Simple client-side search (you might want to implement server-side search for better performance)
        if (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          products.push(product);
        }
      });

      return serializeProductsForClient(products);
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  /**
   * Get featured/top picks products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      // For now, just return random products. You might want to add a "featured" field later
      return allProducts.slice(0, limit);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  }
}

// Function to get reviews for a specific product from Firestore
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const product = await ProductService.getProductById(productId);
    if (product && product.reviews) {
      return product.reviews;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}

// Function to calculate average rating for a product from Firestore
export async function getAverageRating(productId: string): Promise<number> {
  try {
    const reviews = await getProductReviews(productId);
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10;
  } catch (error) {
    console.error(`Error calculating average rating for product ${productId}:`, error);
    return 0;
  }
}

// Function to get review count for a product
export async function getReviewCount(productId: string): Promise<number> {
  try {
    const reviews = await getProductReviews(productId);
    return reviews.length;
  } catch (error) {
    console.error(`Error getting review count for product ${productId}:`, error);
    return 0;
  }
}

// Function to get reviews with pagination
export async function getProductReviewsPaginated(
  productId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ reviews: Review[]; totalCount: number; hasMore: boolean }> {
  try {
    const allReviews = await getProductReviews(productId);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedReviews = allReviews.slice(startIndex, endIndex);
    const hasMore = endIndex < allReviews.length;

    return {
      reviews: paginatedReviews,
      totalCount: allReviews.length,
      hasMore,
    };
  } catch (error) {
    console.error(`Error getting paginated reviews for product ${productId}:`, error);
    return {
      reviews: [],
      totalCount: 0,
      hasMore: false,
    };
  }
}
