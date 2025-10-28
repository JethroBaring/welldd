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
import { ArrowLeft, Plus, Trash2, TruckIcon, Package } from "lucide-react";
import { mockLGUs } from "@/lib/mock-data/lgu";
import { mockInventoryItems } from "@/lib/mock-data/inventory";

interface TransferItem {
  id: string;
  itemName: string;
  itemCode: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  shelfLife: number;
  unitPrice: number;
  remarks?: string;
}

export default function NewTransferOutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    receivingLGU: "",
    receivingContact: "",
    transferDate: new Date().toISOString().split('T')[0],
    remarks: "",
  });

  const [items, setItems] = useState<TransferItem[]>([
    {
      id: "1",
      itemName: "",
      itemCode: "",
      batchNumber: "",
      expiryDate: "",
      quantity: 0,
      shelfLife: 0,
      unitPrice: 0,
      remarks: "",
    }
  ]);

  const calculateShelfLife = (expiryDate: string): number => {
    if (!expiryDate) return 0;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const addItem = () => {
    const newItem: TransferItem = {
      id: Date.now().toString(),
      itemName: "",
      itemCode: "",
      batchNumber: "",
      expiryDate: "",
      quantity: 0,
      shelfLife: 0,
      unitPrice: 0,
      remarks: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof TransferItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Calculate shelf life when expiry date changes
        if (field === 'expiryDate' && typeof value === 'string') {
          updatedItem.shelfLife = calculateShelfLife(value);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  // Filter inventory items that have available quantity and are expiring within 6 months
  const availableInventoryItems = mockInventoryItems.filter(item => {
    const expiringBatches = item.batches.filter(batch => {
      const shelfLife = calculateShelfLife(batch.expiryDate.toISOString().split('T')[0]);
      return shelfLife <= 6 && shelfLife > 0;
    });
    return expiringBatches.length > 0;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating transfer:", { formData, items, total: calculateTotal() });
      router.push("/inventory/transfer");
    } catch (error) {
      console.error("Failed to create transfer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.receivingLGU.trim() &&
    formData.receivingContact.trim() &&
    items.every(item =>
      item.itemName.trim() &&
      item.itemCode.trim() &&
      item.batchNumber.trim() &&
      item.expiryDate.trim() &&
      item.quantity > 0 &&
      item.unitPrice > 0
    );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/inventory/transfer")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Transfers
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">New Stock Transfer Out</h1>
        <p className="text-sm text-muted-foreground">
          Transfer expiring or excess stock to other LGUs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5" />
              Transfer Information
            </CardTitle>
            <CardDescription>
              Basic information about the stock transfer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receivingLGU">Receiving LGU *</Label>
                <Select
                  value={formData.receivingLGU}
                  onValueChange={(value) => setFormData({ ...formData, receivingLGU: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select receiving LGU" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLGUs.map((lgu) => (
                      <SelectItem key={lgu.id} value={lgu.name}>
                        {lgu.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivingContact">Contact Person *</Label>
                <Input
                  id="receivingContact"
                  placeholder="e.g., Dr. Juan Santos - Pharmacy Head"
                  value={formData.receivingContact}
                  onChange={(e) => setFormData({ ...formData, receivingContact: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transferDate">Transfer Date *</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={formData.transferDate}
                  onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Additional notes or transfer reason..."
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
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Transfer Items
                </CardTitle>
                <CardDescription>
                  Add items to be transferred (preferably expiring within 6 months)
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Item Name *</Label>
                      <Select
                        value={item.itemName}
                        onValueChange={(value) => {
                          const selectedItem = availableInventoryItems.find(i => i.itemName === value);
                          if (selectedItem) {
                            updateItem(item.id, 'itemName', selectedItem.itemName);
                            updateItem(item.id, 'itemCode', selectedItem.itemCode);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableInventoryItems.map((invItem) => (
                            <SelectItem key={invItem.id} value={invItem.itemName}>
                              <div className="flex items-center justify-between w-full">
                                <span>{invItem.itemName}</span>
                                <Badge variant="outline" className="ml-2">
                                  {invItem.availableQuantity} {invItem.unit}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Item Code</Label>
                      <Input
                        value={item.itemCode}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Batch Number *</Label>
                      <Input
                        placeholder="e.g., PARA2024-Z01"
                        value={item.batchNumber}
                        onChange={(e) => updateItem(item.id, 'batchNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expiry Date *</Label>
                      <Input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unit Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice || ""}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Shelf Life (months)</Label>
                      <Input
                        value={item.shelfLife}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Textarea
                      placeholder="Transfer reason or special instructions..."
                      value={item.remarks || ""}
                      onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{items.filter(item => item.itemName).length}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total Value:</span>
                <span>₱{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inventory/transfer")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Creating Transfer..." : "Create Transfer"}
          </Button>
        </div>
      </form>
    </div>
  );
}