"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserProfile, UserService } from "@/lib/userService";
import { ChevronLeft, ChevronRight, Download, Edit, Search, Shield, User, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Make sure Firebase Security Rules allow admin access to the users collection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

    const userRole = user.role || "user"; // Default to "user" if role is missing
    const matchesRole = roleFilter === "all" || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportUsers = () => {
    // TODO: Implement export functionality
    console.log("Exporting users...");
  };

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground">Loading users...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        {/* Users Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">{users.length}</div>
              <p className="text-muted-foreground text-xs">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">
                {users.filter((u) => (u.role || "user") === "admin").length}
              </div>
              <p className="text-muted-foreground text-xs">With admin privileges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
              <User className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">
                {users.filter((u) => (u.role || "user") !== "admin").length}
              </div>
              <p className="text-muted-foreground text-xs">Standard accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UsersIcon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">
                {
                  users.filter((u) => {
                    // Convert Firestore Timestamp to Date
                    const userDate = u.createdAt.toDate();
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                  }).length
                }
              </div>
              <p className="text-muted-foreground text-xs">Recent registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-primary">User Management</CardTitle>
                <CardDescription>Manage customer accounts and user permissions</CardDescription>
              </div>
              <Button onClick={handleExportUsers} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Users
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <UsersIcon className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>To enable user management:</p>
                  <ol className="list-inside list-decimal space-y-1">
                    <li>Implement getAllUsers() method in UserService</li>
                    <li>Update Firebase Security Rules to allow admin user queries</li>
                    <li>Consider pagination for large user lists</li>
                  </ol>
                </div>
                <Button onClick={fetchUsers} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Search and Filter */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                {paginatedUsers.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          {/* <TableHead>Role</TableHead> */}
                          <TableHead>Phone</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.uid}>
                            <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            {/* <TableCell>
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role === "admin" && <Crown className="mr-1 h-3 w-3" />}
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </TableCell> */}
                            <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                            <TableCell className="capitalize">{user.gender || "N/A"}</TableCell>
                            <TableCell>{user.createdAt.toDate().toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  //   onClick={() => handleToggleAdminRole(user.uid, user.role)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      {searchTerm || roleFilter !== "all" ? "No users match your filters" : "No users found"}
                    </p>
                  </div>
                )}

                {/* Pagination Controls */}
                {filteredUsers.length > itemsPerPage && (
                  <div className="flex items-center justify-between px-2 py-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-muted-foreground text-sm">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
                        users
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="h-8 w-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
