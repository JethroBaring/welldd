"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPurchaseOrders } from "@/lib/api";
import { PurchaseOrder } from "@/types/purchasing";
import { format } from "date-fns";
import { Eye, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to load purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.poNumber.toLowerCase().includes(query) ||
        order.supplier.name.toLowerCase().includes(query) ||
        (order.prNumber && order.prNumber.toLowerCase().includes(query))
    );
    setFilteredOrders(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage purchase orders to suppliers
          </p>
        </div>
        {permissions.canCreatePO && (
          <Link href="/purchasing/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        )}
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by PO number, PR number, or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-9"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>PR Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No purchase orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/purchasing/orders/${order.id}`}
                >
                  <TableCell className="font-medium">{order.poNumber}</TableCell>
                  <TableCell>{order.prNumber || "-"}</TableCell>
                  <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{order.supplier.name}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>₱{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/purchasing/orders/${order.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit purchase order</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete purchase order ${order.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete purchase order</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

