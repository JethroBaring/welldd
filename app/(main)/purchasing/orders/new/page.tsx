"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { mockSuppliers } from "@/lib/mock-data/suppliers";
import { Supplier, POItem } from "@/types/purchasing";

interface FormData {
  supplierId: string;
  prNumber: string;
  expectedDelivery: string;
  remarks: string;
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    supplierId: "",
    prNumber: "",
    expectedDelivery: "",
    remarks: "",
  });

  const [items, setItems] = useState<POItem[]>([
    {
      id: "1",
      itemName: "",
      itemCode: "",
      quantity: 0,
      unit: "",
      unitPrice: 0,
      discount: 0,
      subtotal: 0,
    }
  ]);

  const selectedSupplier = mockSuppliers.find(s => s.id === formData.supplierId);

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
    const tax = selectedSupplier?.taxType === "VAT" ? subtotal * 0.12 : 0;
    const total = subtotal - totalDiscount + tax;

    return { subtotal, totalDiscount, tax, total };
  };

  const addItem = () => {
    const newItem: POItem = {
      id: Date.now().toString(),
      itemName: "",
      itemCode: "",
      quantity: 0,
      unit: "",
      unitPrice: 0,
      discount: 0,
      subtotal: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof POItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Calculate subtotal when quantity, unitPrice, or discount changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const quantity = Number(updatedItem.quantity) || 0;
          const unitPrice = Number(updatedItem.unitPrice) || 0;
          const discount = Number(updatedItem.discount) || 0;
          updatedItem.subtotal = (quantity * unitPrice) - discount;
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating purchase order:", { formData, items });
      router.push("/purchasing/orders");
    } catch (error) {
      console.error("Failed to create purchase order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/orders")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">New Purchase Order</h1>
        <p className="text-sm text-muted-foreground">
          Create a new purchase order for supplier
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>
              Basic information about the purchase order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{supplier.name}</span>
                          <Badge variant={supplier.taxType === "VAT" ? "default" : "secondary"}>
                            {supplier.taxType}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prNumber">PR Number</Label>
                <Input
                  id="prNumber"
                  placeholder="e.g., PR-2025-001"
                  value={formData.prNumber}
                  onChange={(e) => setFormData({ ...formData, prNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Additional notes or delivery instructions..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Add items to be ordered
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Item Name *</Label>
                      <Input
                        placeholder="Enter item name"
                        value={item.itemName}
                        onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Item Code</Label>
                      <Input
                        placeholder="Enter item code"
                        value={item.itemCode}
                        onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input
                        placeholder="e.g., tablets, bottles"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Unit Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice || ""}
                        onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Discount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.discount || ""}
                        onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subtotal</Label>
                      <Input
                        value={`₱${item.subtotal.toFixed(2)}`}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount:</span>
                <span>₱{totals.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({selectedSupplier?.taxType === "VAT" ? "12%" : "0%"}):</span>
                <span>₱{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>₱{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/purchasing/orders")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.supplierId || items.some(item => !item.itemName || !item.quantity || !item.unitPrice)}
          >
            {isSubmitting ? "Creating..." : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}