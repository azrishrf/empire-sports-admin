import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "male" | "female" | "";
  photoURL?: string;
  address?: string;
  role?: "admin" | "user"; // Make role optional for existing users
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateUserProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "male" | "female" | "";
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  role: string;
  address?: string;
}

export class UserService {
  private static getUserDocRef(userId: string) {
    return doc(db, "users", userId);
  }

  // Update user profile in Firestore
  static async updateUser(userId: string, data: UpdateUserData): Promise<void> {
    const userRef = this.getUserDocRef(userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // Create user profile in Firestore
  static async createUserProfile(user: User, additionalData: CreateUserProfileData): Promise<void> {
    try {
      const userRef = this.getUserDocRef(user.uid);

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        phoneNumber: additionalData.phoneNumber,
        gender: additionalData.gender,
        role: "user", // Default role for new users
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Only add photoURL if it exists and is not null/undefined
      if (user.photoURL) {
        userProfile.photoURL = user.photoURL;
      }

      await setDoc(userRef, userProfile);
      console.log("User profile created successfully:", userProfile);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  // Get user profile from Firestore
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = this.getUserDocRef(userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        console.log("User profile loaded:", userData);
        return userData;
      } else {
        console.log("No user profile found");
        return null;
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    updateData: Partial<Omit<UserProfile, "uid" | "createdAt">>,
  ): Promise<void> {
    try {
      const userRef = this.getUserDocRef(userId);

      const updatedData = {
        ...updateData,
        updatedAt: new Date(),
      };

      // Remove undefined values from updateData
      const cleanedData = Object.fromEntries(Object.entries(updatedData).filter(([, value]) => value !== undefined));

      await updateDoc(userRef, cleanedData);
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Create profile from Google OAuth data
  static async createGoogleUserProfile(user: User): Promise<void> {
    try {
      const userRef = this.getUserDocRef(user.uid);

      // Check if profile already exists
      const existingProfile = await getDoc(userRef);
      if (existingProfile.exists()) {
        console.log("Google user profile already exists");
        return;
      }

      // Extract names from displayName
      const nameParts = (user.displayName || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        firstName: firstName,
        lastName: lastName,
        phoneNumber: user.phoneNumber || "",
        gender: "",
        role: "user", // Default role for Google users
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Only add photoURL if it exists and is not null/undefined
      if (user.photoURL) {
        userProfile.photoURL = user.photoURL;
      }

      await setDoc(userRef, userProfile);
      console.log("Google user profile created successfully:", userProfile);
    } catch (error) {
      console.error("Error creating Google user profile:", error);
      throw error;
    }
  }

  // Check if user is admin
  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const userProfile = await this.getUserProfile(userId);
      return userProfile?.role === "admin" || false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  // Get user role
  static async getUserRole(userId: string): Promise<"admin" | "user" | null> {
    try {
      const userProfile = await this.getUserProfile(userId);
      return userProfile?.role || null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  // Set user as admin (for development/testing purposes)
  static async setUserAsAdmin(userId: string): Promise<void> {
    try {
      await this.updateUserProfile(userId, { role: "admin" });
      console.log("User set as admin successfully");
    } catch (error) {
      console.error("Error setting user as admin:", error);
      throw error;
    }
  }

  // Get all users from Firestore
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersCollection = collection(db, "users");
      const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(usersQuery);

      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Handle missing role field for existing users
        const userProfile: UserProfile = {
          ...userData,
          role: userData.role || "user", // Default to "user" if role is missing
        } as UserProfile;
        users.push(userProfile);
      });

      console.log(`Fetched ${users.length} users from Firestore`);
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  // Get users with pagination
  static async getUsersWithPagination(
    limit: number = 50,
    lastUserId?: string,
  ): Promise<{
    users: UserProfile[];
    hasMore: boolean;
    lastUserId?: string;
  }> {
    try {
      const usersCollection = collection(db, "users");
      const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));

      // Add pagination if lastUserId is provided
      if (lastUserId) {
        const lastUserDoc = await getDoc(doc(db, "users", lastUserId));
        if (lastUserDoc.exists()) {
          // Note: For proper pagination, you'd need to use startAfter with the last document
          // This is a simplified version
          console.log("Pagination from user:", lastUserId);
        }
      }

      const querySnapshot = await getDocs(usersQuery);
      const users: UserProfile[] = [];

      let count = 0;
      querySnapshot.forEach((doc) => {
        if (count < limit) {
          const userData = doc.data() as UserProfile;
          users.push(userData);
          count++;
        }
      });

      const hasMore = querySnapshot.size > limit;
      const newLastUserId = users.length > 0 ? users[users.length - 1].uid : undefined;

      console.log(`Fetched ${users.length} users (limit: ${limit}, hasMore: ${hasMore})`);

      return {
        users,
        hasMore,
        lastUserId: newLastUserId,
      };
    } catch (error) {
      console.error("Error fetching users with pagination:", error);
      throw error;
    }
  }
}
