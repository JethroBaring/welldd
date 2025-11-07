"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/types/user";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  assignedLGU?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  gso_staff: "GSO Staff",
  medical_staff: "Medical Staff",
  admin_staff: "Admin Staff",
};

const roleDescriptions: Record<UserRole, string> = {
  super_admin: "Full system access, configuration, and user management",
  gso_staff: "Inventory management, procurement, and warehouse operations",
  medical_staff:
    "Patient records, clinical functions, and disease surveillance",
  admin_staff: "Records management, reporting, and administrative tasks",
};

const roleColors: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-800 border-purple-200",
  gso_staff: "bg-blue-100 text-blue-800 border-blue-200",
  medical_staff: "bg-green-100 text-green-800 border-green-200",
  admin_staff: "bg-orange-100 text-orange-800 border-orange-200",
};

export default function UsersPage() {
  const { currentRole } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "admin_staff" as UserRole,
    assignedLGU: "",
    generatePassword: true,
    password: "",
  });

  const canManageUsers = currentRole === "super_admin";

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, statusFilter, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock users data
      const mockUsers: User[] = [
        {
          id: "1",
          firstName: "Maria",
          lastName: "Santos",
          email: "maria.santos@dalaguete.gov.ph",
          role: "super_admin",
          isActive: true,
          createdAt: new Date("2024-01-15"),
          lastLogin: new Date(),
        },
        {
          id: "2",
          firstName: "Juan",
          lastName: "Dela Cruz",
          email: "juan.delacruz@dalaguete.gov.ph",
          role: "admin_staff",
          assignedLGU: "Dalaguete RHU",
          isActive: true,
          createdAt: new Date("2024-02-01"),
          lastLogin: new Date("2025-01-10"),
        },
        {
          id: "3",
          firstName: "Pedro",
          lastName: "Reyes",
          email: "pedro.reyes@dalaguete.gov.ph",
          role: "gso_staff",
          isActive: true,
          createdAt: new Date("2024-03-10"),
          lastLogin: new Date("2025-01-12"),
        },
        {
          id: "4",
          firstName: "Anna",
          lastName: "Garcia",
          email: "anna.garcia@dalaguete.gov.ph",
          role: "medical_staff",
          isActive: true,
          createdAt: new Date("2024-04-05"),
          lastLogin: new Date("2025-01-11"),
        },
        {
          id: "5",
          firstName: "Jose",
          lastName: "Ramos",
          email: "jose.ramos@dalaguete.gov.ph",
          role: "gso_staff",
          isActive: false,
          createdAt: new Date("2024-05-20"),
          lastLogin: new Date("2024-12-15"),
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          roleLabels[user.role].toLowerCase().includes(query),
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((user) => user.isActive);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((user) => !user.isActive);
    }

    setFilteredUsers(filtered);
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleAddUser = async () => {
    try {
      // Validate form
      if (!userForm.firstName || !userForm.lastName || !userForm.email) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userForm.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Check if email already exists
      if (users.some((u) => u.email === userForm.email)) {
        toast.error("Email already exists");
        return;
      }

      // Generate or validate password
      let finalPassword = userForm.password;
      if (userForm.generatePassword) {
        finalPassword = generateRandomPassword();
      } else if (!finalPassword || finalPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        role: userForm.role,
        assignedLGU: userForm.assignedLGU || undefined,
        isActive: true,
        createdAt: new Date(),
      };

      setUsers([...users, newUser]);

      // Simulate email sending
      if (sendEmailNotification) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(
          `User created successfully! Login credentials sent to ${userForm.email}`,
        );
      } else {
        toast.success("User created successfully!");
        toast.info(`Password: ${finalPassword}`, { duration: 10000 });
      }

      setIsAddUserOpen(false);
      resetUserForm();
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
    }
  };

  const handleEditUser = async () => {
    try {
      if (!selectedUser) return;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              firstName: userForm.firstName,
              lastName: userForm.lastName,
              email: userForm.email,
              role: userForm.role,
              assignedLGU: userForm.assignedLGU || undefined,
            }
          : u,
      );

      setUsers(updatedUsers);
      setIsEditUserOpen(false);
      setSelectedUser(null);
      resetUserForm();
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, isActive } : u,
      );

      setUsers(updatedUsers);
      toast.success(
        `User ${isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (
        !confirm(
          "Are you sure you want to delete this user? This action cannot be undone.",
        )
      ) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      const newPassword = generateRandomPassword();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Password reset email sent to ${user.email}`);
      toast.info(`New password: ${newPassword}`, { duration: 10000 });
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error("Failed to reset password");
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      assignedLGU: user.assignedLGU || "",
      generatePassword: false,
      password: "",
    });
    setIsEditUserOpen(true);
  };

  const resetUserForm = () => {
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "admin_staff",
      assignedLGU: "",
      generatePassword: true,
      password: "",
    });
    setSendEmailNotification(true);
    setShowPassword(false);
  };

  if (!canManageUsers) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Access Denied</p>
            <p className="text-sm text-muted-foreground">
              You don't have permission to access user management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => !u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.role === "super_admin").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
            found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="gso_staff">GSO Staff</SelectItem>
                <SelectItem value="medical_staff">Medical Staff</SelectItem>
                <SelectItem value="admin_staff">Admin Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned LGU</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {user.firstName} {user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={roleColors[user.role]}
                        >
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.assignedLGU || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="noHover"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={(checked: boolean) =>
                              handleToggleUserStatus(user.id, checked)
                            }
                          />
                          <Button
                            variant="noHover"
                            size="sm"
                            onClick={() => handleResetPassword(user)}
                          >
                            Reset Password
                          </Button>
                          <Button
                            variant="noHover"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Login credentials will be sent via
              email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={userForm.firstName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, firstName: e.target.value })
                  }
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={userForm.lastName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, lastName: e.target.value })
                  }
                  placeholder="Dela Cruz"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="user@dalaguete.gov.ph"
              />
              <p className="text-xs text-muted-foreground">
                This will be used as the username for login
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={userForm.role}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, role: value as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="gso_staff">GSO Staff</SelectItem>
                  <SelectItem value="medical_staff">Medical Staff</SelectItem>
                  <SelectItem value="admin_staff">Admin Staff</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {roleDescriptions[userForm.role]}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedLGU">Assigned LGU (Optional)</Label>
              <Input
                id="assignedLGU"
                value={userForm.assignedLGU}
                onChange={(e) =>
                  setUserForm({ ...userForm, assignedLGU: e.target.value })
                }
                placeholder="e.g., Dalaguete RHU"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for system-wide access
              </p>
            </div>

            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password Generation</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically generate a secure password
                  </p>
                </div>
                <Switch
                  checked={userForm.generatePassword}
                  onCheckedChange={(checked: boolean) =>
                    setUserForm({ ...userForm, generatePassword: checked })
                  }
                />
              </div>

              {!userForm.generatePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Custom Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      placeholder="Minimum 8 characters"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Email Notification</Label>
                  <p className="text-xs text-muted-foreground">
                    Email login credentials to the user
                  </p>
                </div>
                <Switch
                  checked={sendEmailNotification}
                  onCheckedChange={setSendEmailNotification}
                />
              </div>

              {!sendEmailNotification && (
                <div className="text-xs text-yellow-600 flex items-start gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Password will be displayed after creation. Make sure to save
                    it securely.
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={userForm.firstName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={userForm.lastName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail">Email Address</Label>
              <Input
                id="editEmail"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, role: value as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="gso_staff">GSO Staff</SelectItem>
                  <SelectItem value="medical_staff">Medical Staff</SelectItem>
                  <SelectItem value="admin_staff">Admin Staff</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {roleDescriptions[userForm.role]}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAssignedLGU">Assigned LGU</Label>
              <Input
                id="editAssignedLGU"
                value={userForm.assignedLGU}
                onChange={(e) =>
                  setUserForm({ ...userForm, assignedLGU: e.target.value })
                }
                placeholder="e.g., Dalaguete RHU"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditUserOpen(false);
                setSelectedUser(null);
                resetUserForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
