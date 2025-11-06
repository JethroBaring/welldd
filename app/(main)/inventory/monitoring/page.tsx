"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Clock,
  Package,
  TrendingDown,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInventoryItems } from "@/lib/api";
import { InventoryItem, Batch } from "@/types/inventory";
import { format, differenceInDays, isBefore, addDays } from "date-fns";
import Link from "next/link";

interface StockAlert {
  id: string;
  type: "expiring_soon" | "low_stock" | "expired" | "critical_low";
  severity: "high" | "medium" | "low";
  itemCode: string;
  itemName: string;
  message: string;
  batch?: Batch;
  currentQuantity?: number;
  reorderLevel?: number;
  daysUntilExpiry?: number;
  recommendedAction: string;
}

export default function StockMonitoringPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Configurable thresholds (in Phase 2, these would be editable by Super Admin)
  const expiryThresholds = {
    critical: 90, // 90 days
    warning: 180, // 6 months
    notice: 360, // 12 months
  };

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const data = await getInventoryItems();
      setItems(data);
      generateAlerts(data);
    } catch (error) {
      console.error("Failed to load stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = (inventoryItems: InventoryItem[]) => {
    const newAlerts: StockAlert[] = [];
    const today = new Date();

    inventoryItems.forEach((item) => {
      // Low stock alerts
      if (item.availableQuantity <= item.reorderLevel) {
        const severity =
          item.availableQuantity === 0
            ? "high"
            : item.availableQuantity <= item.reorderLevel * 0.5
            ? "high"
            : "medium";

        newAlerts.push({
          id: `low-stock-${item.id}`,
          type: item.availableQuantity === 0 ? "critical_low" : "low_stock",
          severity,
          itemCode: item.itemCode,
          itemName: item.itemName,
          message:
            item.availableQuantity === 0
              ? "Out of stock"
              : `Low stock: ${item.availableQuantity} ${item.unit} remaining`,
          currentQuantity: item.availableQuantity,
          reorderLevel: item.reorderLevel,
          recommendedAction:
            item.availableQuantity === 0
              ? "Urgent reorder required"
              : "Consider reordering soon",
        });
      }

      // Expiry alerts for each batch
      item.batches.forEach((batch) => {
        const daysUntilExpiry = differenceInDays(new Date(batch.expiryDate), today);

        // Expired
        if (daysUntilExpiry < 0) {
          newAlerts.push({
            id: `expired-${batch.id}`,
            type: "expired",
            severity: "high",
            itemCode: item.itemCode,
            itemName: item.itemName,
            message: `Batch ${batch.batchNumber} expired ${Math.abs(daysUntilExpiry)} days ago`,
            batch,
            daysUntilExpiry,
            recommendedAction: "Remove and dispose immediately",
          });
        }
        // Critical - Expiring within 90 days
        else if (daysUntilExpiry <= expiryThresholds.critical) {
          newAlerts.push({
            id: `expiring-critical-${batch.id}`,
            type: "expiring_soon",
            severity: "high",
            itemCode: item.itemCode,
            itemName: item.itemName,
            message: `Batch ${batch.batchNumber} expires in ${daysUntilExpiry} days`,
            batch,
            daysUntilExpiry,
            recommendedAction: "Prioritize dispensing or consider transfer to other LGU",
          });
        }
        // Warning - Expiring within 180 days
        else if (daysUntilExpiry <= expiryThresholds.warning) {
          newAlerts.push({
            id: `expiring-warning-${batch.id}`,
            type: "expiring_soon",
            severity: "medium",
            itemCode: item.itemCode,
            itemName: item.itemName,
            message: `Batch ${batch.batchNumber} expires in ${daysUntilExpiry} days`,
            batch,
            daysUntilExpiry,
            recommendedAction: "Monitor usage rate and consider FEFO priority",
          });
        }
        // Notice - Expiring within 360 days
        else if (daysUntilExpiry <= expiryThresholds.notice) {
          newAlerts.push({
            id: `expiring-notice-${batch.id}`,
            type: "expiring_soon",
            severity: "low",
            itemCode: item.itemCode,
            itemName: item.itemName,
            message: `Batch ${batch.batchNumber} expires in ${daysUntilExpiry} days`,
            batch,
            daysUntilExpiry,
            recommendedAction: "Normal monitoring",
          });
        }
      });
    });

    // Sort by severity and days until expiry
    newAlerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      if (a.daysUntilExpiry !== undefined && b.daysUntilExpiry !== undefined) {
        return a.daysUntilExpiry - b.daysUntilExpiry;
      }
      return 0;
    });

    setAlerts(newAlerts);
  };

  const getStockHealthStats = () => {
    const total = items.length;
    const lowStock = items.filter((i) => i.availableQuantity <= i.reorderLevel).length;
    const outOfStock = items.filter((i) => i.availableQuantity === 0).length;
    const expiring = new Set(
      alerts.filter((a) => a.type === "expiring_soon").map((a) => a.itemCode)
    ).size;
    const expired = new Set(
      alerts.filter((a) => a.type === "expired").map((a) => a.itemCode)
    ).size;
    const healthy = total - lowStock - outOfStock;

    return { total, lowStock, outOfStock, expiring, expired, healthy };
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "expiring" && alert.type === "expiring_soon") ||
      (activeTab === "expired" && alert.type === "expired") ||
      (activeTab === "low_stock" &&
        (alert.type === "low_stock" || alert.type === "critical_low"));

    return matchesSearch && matchesTab;
  });

  const stats = getStockHealthStats();

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Stock Monitoring & Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Monitor stock levels and expiry dates with automated alerts
          </p>
        </div>
        <Button onClick={loadStockData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overall Stock Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.healthy} healthy, {stats.lowStock} need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              {stats.outOfStock} out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.expiring}</div>
            <p className="text-xs text-muted-foreground">
              Items requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate disposal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>
                {filteredAlerts.length} active alert{filteredAlerts.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              <Bell className="mr-1 h-3 w-3" />
              {alerts.filter((a) => a.severity === "high").length} Critical
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search alerts by item code, name, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({alerts.length})
                </TabsTrigger>
                <TabsTrigger value="expiring">
                  Expiring ({alerts.filter((a) => a.type === "expiring_soon").length})
                </TabsTrigger>
                <TabsTrigger value="expired">
                  Expired ({alerts.filter((a) => a.type === "expired").length})
                </TabsTrigger>
                <TabsTrigger value="low_stock">
                  Low Stock ({alerts.filter((a) => a.type === "low_stock" || a.type === "critical_low").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                    <p className="text-lg font-medium">No alerts found</p>
                    <p className="text-sm">All items are within acceptable levels</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Severity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Alert Message</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Recommended Action</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell>
                              <Badge
                                variant={
                                  alert.severity === "high"
                                    ? "destructive"
                                    : alert.severity === "medium"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {alert.severity === "high" && <AlertTriangle className="mr-1 h-3 w-3" />}
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {alert.type === "expiring_soon" && "Expiring Soon"}
                                {alert.type === "expired" && "Expired"}
                                {alert.type === "low_stock" && "Low Stock"}
                                {alert.type === "critical_low" && "Out of Stock"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{alert.itemCode}</TableCell>
                            <TableCell>{alert.itemName}</TableCell>
                            <TableCell>{alert.message}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {alert.batch && (
                                <div>
                                  <div>Batch: {alert.batch.batchNumber}</div>
                                  <div>Qty: {alert.batch.quantity} units</div>
                                  <div>Expires: {format(new Date(alert.batch.expiryDate), "MMM dd, yyyy")}</div>
                                </div>
                              )}
                              {alert.currentQuantity !== undefined && (
                                <div>
                                  <div>Current: {alert.currentQuantity}</div>
                                  <div>Reorder at: {alert.reorderLevel}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{alert.recommendedAction}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {alert.type === "low_stock" || alert.type === "critical_low" ? (
                                  <Link href="/purchasing/requests/new">
                                    <Button size="sm" variant="outline">
                                      Create PR
                                    </Button>
                                  </Link>
                                ) : alert.type === "expiring_soon" && alert.daysUntilExpiry && alert.daysUntilExpiry <= 90 ? (
                                  <Link href="/inventory/transfer">
                                    <Button size="sm" variant="outline">
                                      Transfer Out
                                    </Button>
                                  </Link>
                                ) : alert.type === "expired" ? (
                                  <Link href="/inventory/adjustments">
                                    <Button size="sm" variant="outline">
                                      Dispose
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button size="sm" variant="ghost" disabled>
                                    Monitor
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Threshold Configuration Info (Phase 2 - Super Admin can configure) */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>Current configured thresholds for automated alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="font-medium">Critical (90 days)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Items expiring within 90 days require immediate action
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="font-medium">Warning (180 days)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Items expiring within 6 months need monitoring
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="font-medium">Notice (360 days)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Items expiring within 12 months are tracked
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
