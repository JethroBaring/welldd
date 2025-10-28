"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getPurchaseOrderById, createWarehouseReceivingReport } from "@/lib/api";
import { PurchaseOrder } from "@/types/purchasing";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewWarehouseReceivingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <ReceivingPageInner />
    </Suspense>
  );
}

function ReceivingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poId = searchParams.get("po");

  if (!poId) {
    return (
      <div className="container mx-auto py-6">
        <p>No purchase order specified</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return <ReceivingForm poId={poId} />;
}

function ReceivingForm({ poId }: { poId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [poId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseOrderById(poId);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load purchase order:", error);
      toast.error("Failed to load purchase order");
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

  if (!order) {
    return (
      <div className="container mx-auto py-6">
        <p>Purchase order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/receiving")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Receiving
      </Button>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Warehouse Receiving</h1>
        <p className="text-sm text-muted-foreground">Receive items from PO: {order.poNumber}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
          <CardDescription>Verify items against delivery receipt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Supplier</Label>
              <p className="font-medium">{order.supplier.name}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Expected Delivery</Label>
              <p className="font-medium">
                {order.expectedDelivery
                  ? new Date(order.expectedDelivery).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex-1">
                    <p className="font-medium">{item.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordered: {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={`Max ${item.quantity}`}
                      className="w-32"
                      min="0"
                      max={item.quantity}
                    />
                    <span className="text-sm text-muted-foreground">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Receiving Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
            <li>Scan or enter barcode for each batch received</li>
            <li>Enter expiration date for each batch</li>
            <li>Match received quantities against PO</li>
            <li>Note any discrepancies</li>
            <li>Verify items are in good condition</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={() => toast.info("Receiving form will be implemented with barcode scanning")}>
          <Package className="mr-2 h-4 w-4" />
          Complete Receiving
        </Button>
      </div>
    </div>
  );
}

