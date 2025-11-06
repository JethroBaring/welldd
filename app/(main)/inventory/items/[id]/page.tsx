"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { getInventoryItemById, getInventoryTransactionsByItem } from "@/lib/api";
import { InventoryItem, InventoryTransaction } from "@/types/inventory";
import { format } from "date-fns";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function InventoryItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [params.id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const [itemData, transactionsData] = await Promise.all([
        getInventoryItemById(params.id as string),
        getInventoryTransactionsByItem(params.id as string),
      ]);
      setItem(itemData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Failed to load inventory item:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto py-6">
        <p>Inventory item not found</p>
      </div>
    );
  }

  const sortedBatches = [...item.batches].sort((a, b) => 
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div className="mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/inventory/items")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Inventory Items
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{item.itemName}</h1>
          <p className="text-sm text-muted-foreground">{item.itemCode} - {item.category}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Item Code:</div>
              <div className="text-sm font-medium">{item.itemCode}</div>

              <div className="text-sm text-muted-foreground">Item Name:</div>
              <div className="text-sm font-medium">{item.itemName}</div>

              <div className="text-sm text-muted-foreground">Category:</div>
              <div className="text-sm font-medium">{item.category}</div>

              <div className="text-sm text-muted-foreground">Type:</div>
              <div className="text-sm font-medium capitalize">{item.subType}</div>

              <div className="text-sm text-muted-foreground">Unit:</div>
              <div className="text-sm font-medium">{item.unit}</div>

              <div className="text-sm text-muted-foreground">Total Quantity:</div>
              <div className="text-sm font-medium">
                {item.totalQuantity} {item.unit}
              </div>

              <div className="text-sm text-muted-foreground">Available:</div>
              <div className="text-sm font-medium">
                {item.availableQuantity} {item.unit}
              </div>

              <div className="text-sm text-muted-foreground">Reorder Level:</div>
              <div className="text-sm font-medium">
                {item.reorderLevel} {item.unit}
              </div>

              <div className="text-sm text-muted-foreground">Location:</div>
              <div className="text-sm font-medium">{item.location}</div>

              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="text-sm font-medium">
                <StatusBadge status={item.status} />
              </div>

              <div className="text-sm text-muted-foreground">Last Updated:</div>
              <div className="text-sm font-medium">
                {format(new Date(item.updatedAt), "MMM dd, yyyy")}
              </div>
            </div>

            {item.availableQuantity <= item.reorderLevel && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Low Stock Alert</p>
                  <p className="text-xs text-yellow-700">
                    Available quantity is at or below reorder level
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batch Information (FIFO/FEFO)</CardTitle>
            <CardDescription>
              {item.batches.length} batch{item.batches.length !== 1 ? "es" : ""} in stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedBatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No batches in stock</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedBatches.map((batch) => {
                  const expiryDate = new Date(batch.expiryDate);
                  const today = new Date();
                  const daysUntilExpiry = Math.ceil(
                    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isExpiringSoon = daysUntilExpiry <= 180 && daysUntilExpiry > 0;
                  const isExpired = expiryDate < today;

                  return (
                    <div
                      key={batch.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{batch.batchNumber}</div>
                        {isExpired && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-600">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>{" "}
                          <span className="font-medium">{batch.quantity} {item.unit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expiry:</span>{" "}
                          <span className="font-medium">
                            {format(expiryDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Received:</span>{" "}
                          <span className="font-medium">
                            {format(new Date(batch.receivedDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Supplier:</span>{" "}
                          <span className="font-medium">{batch.supplier}</span>
                        </div>
                      </div>
                      {batch.wrrNumber && (
                        <div className="text-xs text-muted-foreground">
                          WRR: {batch.wrrNumber}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent inventory movements for this item</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions recorded</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Before</TableHead>
                  <TableHead>After</TableHead>
                  <TableHead>By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{format(new Date(txn.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-medium">{txn.transactionNumber}</TableCell>
                    <TableCell className="capitalize">{txn.type.replace("_", " ")}</TableCell>
                    <TableCell>{txn.batchNumber || "-"}</TableCell>
                    <TableCell className={txn.quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {txn.quantity > 0 ? "+" : ""}{txn.quantity}
                    </TableCell>
                    <TableCell>{txn.beginningQuantity} {item.unit}</TableCell>
                    <TableCell>{txn.endingQuantity} {item.unit}</TableCell>
                    <TableCell>{txn.performedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

