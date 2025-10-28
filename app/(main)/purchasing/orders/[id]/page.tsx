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
import { getPurchaseOrderById } from "@/lib/api";
import { PurchaseOrder } from "@/types/purchasing";
import { format } from "date-fns";
import { ArrowLeft, Check, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { getPermissions, user } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseOrderById(params.id as string);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load purchase order:", error);
      toast.error("Failed to load purchase order");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!order || !user) return;
    
    try {
      setActionLoading(true);
      // Mock approval
      toast.success("Purchase order approved successfully");
      loadOrder();
    } catch (error) {
      console.error("Failed to approve order:", error);
      toast.error("Failed to approve order");
    } finally {
      setActionLoading(false);
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

  if (!order) {
    return (
      <div className="container mx-auto py-6">
        <p>Purchase order not found</p>
      </div>
    );
  }

  const canApprove = permissions.canApprovePO && (order.status === "pending" || order.status === "draft");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/orders")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Purchase Orders
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{order.poNumber}</h1>
          <p className="text-sm text-muted-foreground">Purchase Order Details</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">PO Number:</div>
              <div className="text-sm font-medium">{order.poNumber}</div>

              {order.prNumber && (
                <>
                  <div className="text-sm text-muted-foreground">PR Number:</div>
                  <div className="text-sm font-medium">{order.prNumber}</div>
                </>
              )}

              <div className="text-sm text-muted-foreground">Date:</div>
              <div className="text-sm font-medium">
                {format(new Date(order.date), "MMMM dd, yyyy")}
              </div>

              <div className="text-sm text-muted-foreground">Expected Delivery:</div>
              <div className="text-sm font-medium">
                {order.expectedDelivery
                  ? format(new Date(order.expectedDelivery), "MMMM dd, yyyy")
                  : "-"}
              </div>

              <div className="text-sm text-muted-foreground">Created By:</div>
              <div className="text-sm font-medium">{order.createdBy}</div>

              {order.approvedBy && (
                <>
                  <div className="text-sm text-muted-foreground">Approved By:</div>
                  <div className="text-sm font-medium">{order.approvedBy}</div>

                  <div className="text-sm text-muted-foreground">Approved Date:</div>
                  <div className="text-sm font-medium">
                    {order.approvedDate &&
                      format(new Date(order.approvedDate), "MMMM dd, yyyy")}
                  </div>
                </>
              )}

              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="text-sm font-medium">
                <StatusBadge status={order.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Supplier Name:</div>
              <div className="text-sm font-medium">{order.supplier.name}</div>

              <div className="text-sm text-muted-foreground">Supplier Code:</div>
              <div className="text-sm font-medium">{order.supplier.code}</div>

              {order.supplier.contactPerson && (
                <>
                  <div className="text-sm text-muted-foreground">Contact Person:</div>
                  <div className="text-sm font-medium">{order.supplier.contactPerson}</div>
                </>
              )}

              {order.supplier.phone && (
                <>
                  <div className="text-sm text-muted-foreground">Phone:</div>
                  <div className="text-sm font-medium">{order.supplier.phone}</div>
                </>
              )}

              {order.supplier.email && (
                <>
                  <div className="text-sm text-muted-foreground">Email:</div>
                  <div className="text-sm font-medium">{order.supplier.email}</div>
                </>
              )}

              <div className="text-sm text-muted-foreground">Tax Type:</div>
              <div className="text-sm font-medium">{order.supplier.taxType}</div>

              {order.supplier.paymentTerms && (
                <>
                  <div className="text-sm text-muted-foreground">Payment Terms:</div>
                  <div className="text-sm font-medium">{order.supplier.paymentTerms}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Items included in this purchase order</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>₱{item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {item.discount ? `${item.discount}%` : "-"}
                  </TableCell>
                  <TableCell>₱{item.subtotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₱{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium">-₱{order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-medium">₱{order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                <span>Total:</span>
                <span>₱{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.remarks}</p>
          </CardContent>
        </Card>
      )}

      {canApprove && (
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleApprove}
            disabled={actionLoading}
          >
            <FileText className="mr-2 h-4 w-4" />
            Send to Supplier
          </Button>
          <Button onClick={handleApprove} disabled={actionLoading}>
            <Check className="mr-2 h-4 w-4" />
            Approve Order
          </Button>
        </div>
      )}
    </div>
  );
}

