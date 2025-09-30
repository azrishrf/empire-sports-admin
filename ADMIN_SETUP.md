# Admin Setup Instructions

## Setting Up the First Admin User

Since this is an admin-only application, you'll need to manually grant admin privileges to at least one user. Here's how to set up the first admin user:

### Method 1: Using Browser Console (Recommended)

1. **Create an account**: Go to `/signup` and create a new user account
2. **Sign in**: After creating the account, sign in at `/login`
3. **Open browser console**: Press F12 and go to the Console tab
4. **Run the admin setup command**:

   ```javascript
   // First, check the available functions
   AdminManagement.showInstructions();

   // Set yourself as admin (replace with your actual user ID)
   AdminManagement.setAdminByUserId("your-user-id-here");
   ```

5. **Find your User ID**: You can find your user ID in the Firebase Auth console or by checking the browser console after logging in

### Method 2: Using Firebase Console

1. **Create an account**: Go to `/signup` and create a new user account
2. **Open Firebase Console**: Go to your Firebase project console
3. **Navigate to Firestore**: Go to Firestore Database
4. **Find your user**: Look for your user document in the `users` collection
5. **Edit the document**: Add or change the `role` field to `"admin"`
6. **Save changes**: The change will take effect immediately

### Method 3: Direct Database Update

If you have direct access to your Firestore database, you can update the user document directly:

```javascript
// Example Firestore update
{
  uid: "user-id-here",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",  // <- This is the key field
  // ... other fields
}
```

## User Roles

The system supports two roles:

- `"user"`: Regular user (default for new signups)
- `"admin"`: Admin user with dashboard access

## Security Notes

- Only users with `role: "admin"` can access the admin dashboard
- All new users are created with `role: "user"` by default
- Admin privileges must be granted manually for security
- Non-admin users will be redirected to an "Access Denied" page

## Development Tips

- The `AdminManagement` utility is available globally in the browser console
- Use `AdminManagement.showInstructions()` to see all available commands
- Check admin status with `AdminManagement.checkAdminStatus("user-id")`
- The system uses Firebase Authentication + Firestore for user management
