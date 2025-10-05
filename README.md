# 🛠️ Empire Sports - Admin Dashboard

The **Empire Sports Admin Dashboard** is a secure, role-based authentication system for managing products, orders, and users within the **Empire Sports E-commerce Platform**.  
It provides a modern, responsive interface for store management with real-time data and comprehensive analytics.

---

## ✨ Current Features

### 🔐 Authentication & Security

- **Role-Based Access Control**: Admin-only access with Firebase Authentication
- **Modern Login/Signup**: Clean authentication pages built with shadcn/ui
- **Access Control**: Automatic redirection for non-admin users
- **Secure Routes**: All admin pages protected with authentication middleware

### 📦 Product Management

- **Complete CRUD Operations**: Add, edit, delete, and view products
- **Advanced Filtering**: Search by name, brand, or category
- **Image Management**: Upload and manage product images with Firebase Storage
- **Stock Control**: Real-time inventory tracking and updates
- **Category Organization**: Manage product categories and classifications
- **Pagination**: Efficient data display with 10 items per page

### 🧾 Order Management

- **Comprehensive Order View**: Display all customer orders with detailed information
- **Advanced Filtering**: Filter by order status (Pending, Confirmed, Shipped, Delivered, Cancelled)
- **Search Functionality**: Search orders by Order ID or customer name
- **Order Statistics**: Real-time counts for total, pending, and completed orders
- **Revenue Tracking**: Total revenue calculation from all orders
- **Pagination**: Efficient browsing through large order datasets
- **Export Ready**: Export functionality framework in place

### 👥 User Management

- **Complete User Directory**: View all registered users with detailed profiles
- **Role Management**: Admin and user role distinction with statistics
- **Advanced Search**: Search users by name or email
- **Role-Based Filtering**: Filter users by admin or regular user status
- **User Analytics**: Track monthly registrations and user growth
- **Pagination**: Smooth navigation through user lists
- **Backward Compatibility**: Handles existing users without role data

### 📊 Analytics & Dashboard

- **Interactive Charts**: Built with Recharts for data visualization
- **Real-Time Statistics**: Live product, order, and user counts
- **Revenue Analytics**: Monthly and total revenue tracking
- **Recent Activity**: Display recent orders and user registrations
- **Performance Metrics**: Key business indicators at a glance

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first approach that works on all devices
- **shadcn/ui Components**: Modern, accessible component library
- **Consistent Theming**: Professional design system with Tailwind CSS
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Comprehensive error messages and retry functionality
- **Toast Notifications**: User feedback with Sonner toast system

### 🔧 Technical Features

- **Real-Time Data**: Firebase Firestore integration with live updates
- **Type Safety**: Full TypeScript implementation for reliability
- **Modular Architecture**: Component-based structure for maintainability
- **Firebase Integration**: Authentication, Firestore, and Storage
- **Pagination System**: Efficient data handling for large datasets
- **Search & Filter**: Advanced filtering capabilities across all data tables

---

## 🎯 Data Management

- **Paginated Tables**: All data tables support pagination (10 items per page)
- **Smart Filtering**: Auto-reset pagination when filters change
- **Search Integration**: Real-time search across products, orders, and users
- **Firestore Optimization**: Efficient queries with proper indexing
- **Data Validation**: Form validation and error handling

---

## � Tech Stack

- **Frontend**: Next.js with App Router + React
- **Database**: Firebase Firestore (real-time NoSQL database)
- **Authentication**: Firebase Auth with role-based access control
- **UI Components**: shadcn/ui + Tailwind CSS for modern, responsive design
- **Charts**: Recharts for interactive data visualization
- **Notifications**: Sonner for toast notifications
- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks and context for efficient state handling

---

## 🛡️ Access & Authentication

### Getting Started

1. **Sign Up/Login**: Use the authentication pages at `/login` or `/signup`
2. **Admin Verification**: Only users with admin role can access the dashboard
3. **Dashboard Access**: Navigate to the homepage `/` (admin dashboard)

**Default Admin Account:**

- Email: `admin@empiresports.com`
- Password: `Admin12345`

### Route Structure

- `/` - Main admin dashboard (admin-only)
- `/login` - Authentication login page
- `/signup` - User registration page
- `/access-denied` - Non-admin user redirect page
- `/products` - Product management interface
- `/orders` - Order management and tracking
- `/users` - User management and analytics
- `/analytics` - Business analytics and insights

---

## � Dashboard Overview

The admin dashboard provides:

- **Quick Stats**: Total products, orders, users, and revenue
- **Recent Activity**: Latest orders and user registrations
- **Performance Metrics**: Monthly growth and key indicators
- **Navigation Hub**: Easy access to all management features

---

## 🚀 Current Capabilities

### ✅ Implemented Features

- Complete authentication system with role management
- Product CRUD operations with image management
- Order tracking and management
- User management with role-based filtering
- Real-time analytics and statistics
- Responsive pagination across all data tables
- Search and filter functionality
- Firebase integration for all data operations

### � Framework Ready Features

- Export functionality (buttons implemented, backend ready)
- Advanced order status management
- User role editing capabilities
- Enhanced analytics with more detailed charts

---

## 📝 Notes

- **Admin Only**: This dashboard is restricted to users with admin privileges
- **Real-Time**: All data updates in real-time through Firebase Firestore
- **Responsive**: Fully mobile-responsive design for on-the-go management
- **Type Safe**: Built with TypeScript for reliable, maintainable code
- **Modular**: Component-based architecture for easy feature expansion
