import { UserService } from "@/lib/userService";

/**
 * Admin Management Utility
 *
 * This component provides functions to manage admin users.
 * Use these functions in the browser console for development/testing.
 */

export class AdminManagement {
  /**
   * Set a user as admin by their email
   * Usage: AdminManagement.setAdminByEmail("user@example.com")
   */
  static async setAdminByEmail(email: string): Promise<void> {
    try {
      // This would require a search function in UserService
      console.log(`Setting ${email} as admin...`);
      console.log("Note: You need to implement a search by email function in UserService");
      console.log("Or use setAdminByUserId with the user's UID instead");
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  }

  /**
   * Set a user as admin by their user ID (UID)
   * Usage: AdminManagement.setAdminByUserId("user-uid-here")
   */
  static async setAdminByUserId(userId: string): Promise<void> {
    try {
      await UserService.setUserAsAdmin(userId);
      console.log(`User ${userId} has been set as admin successfully!`);
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  }

  /**
   * Check if a user is admin by their user ID
   * Usage: AdminManagement.checkAdminStatus("user-uid-here")
   */
  static async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const isAdmin = await UserService.isUserAdmin(userId);
      console.log(`User ${userId} admin status: ${isAdmin}`);
      return isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  /**
   * Instructions for setting up the first admin user
   */
  static showInstructions(): void {
    console.log(`
🔧 Admin Setup Instructions:

1. First, create an account using the signup page (/signup)
2. After creating an account, note your user ID (UID) from the browser console or Firebase Auth
3. Use one of these methods to set yourself as admin:

   Method 1 - Browser Console:
   AdminManagement.setAdminByUserId("your-user-id-here")

   Method 2 - Firebase Console:
   - Go to Firebase Console → Firestore Database
   - Find your user document in the "users" collection
   - Edit the document and add/change the "role" field to "admin"

4. Refresh the page - you should now have admin access!

Note: Make sure you're signed in and your user document exists in Firestore.
    `);
  }
}

// Make it available globally for console usage
if (typeof window !== "undefined") {
  (window as typeof window & { AdminManagement: typeof AdminManagement }).AdminManagement = AdminManagement;
}
