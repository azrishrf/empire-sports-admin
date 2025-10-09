import { UserService } from "@/lib/userService";

/**
 * Admin Management Utility
 *
 * This component provides functions to manage admin users.
 * Use these functions in the browser console for development/testing.
 */

export class AdminManagement {
  /**
   * Set a user as admin by their user ID (UID)
   * Usage: AdminManagement.setAdminByUserId("user-uid-here")
   */
  static async setAdminByUserId(userId: string): Promise<void> {
    try {
      await UserService.setUserAsAdmin(userId);
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
      return isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

// Make it available globally for console usage
if (typeof window !== "undefined") {
  (window as typeof window & { AdminManagement: typeof AdminManagement }).AdminManagement = AdminManagement;
}
