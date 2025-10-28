"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockPurchaseRequests, mockInventoryItems, mockPatients } from "@/lib/mock-data";

export function Dashboard() {
  // Calculate stats from mock data
  const stats = {
    purchaseRequests: {
      total: mockPurchaseRequests.length,
      pending: mockPurchaseRequests.filter((pr) => pr.status === "pending").length,
      approved: mockPurchaseRequests.filter((pr) => pr.status === "approved").length,
    },
    inventory: {
      total: mockInventoryItems.length,
      lowStock: mockInventoryItems.filter((item) => item.status === "low_stock").length,
      expiringSoon: mockInventoryItems.filter((item) => item.status === "expiring_soon").length,
    },
    patients: {
      total: mockPatients.length,
      active: mockPatients.filter((p) => p.status === "active").length,
    },
    notifications: {
      total: 4, // From the notification data
    },
  };

  return (
    <div className="flex flex-1 flex-col space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to WellSync - Overview of operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Purchase Requests</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.purchaseRequests.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.purchaseRequests.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventory.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inventory.lowStock} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.patients.total} total registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notifications.total}</div>
            <p className="text-xs text-muted-foreground">Unread notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Requests</CardTitle>
          <CardDescription>Latest purchase requests requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPurchaseRequests.slice(0, 5).map((pr) => (
              <div
                key={pr.id}
                className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{pr.prNumber}</p>
                    <StatusBadge status={pr.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pr.requestingDepartment} - {pr.requestedBy}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{pr.items.length} items</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(pr.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Warnings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Expiring Items
            </CardTitle>
            <CardDescription>Items expiring soon that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.inventory.expiringSoon > 0 ? (
              <p className="text-sm text-orange-800">
                {stats.inventory.expiringSoon} items expiring within 180 days
              </p>
            ) : (
              <p className="text-sm text-orange-800">No items expiring soon</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Items below reorder level</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.inventory.lowStock > 0 ? (
              <p className="text-sm text-yellow-800">
                {stats.inventory.lowStock} items need reordering
              </p>
            ) : (
              <p className="text-sm text-yellow-800">All items well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
