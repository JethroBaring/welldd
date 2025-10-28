"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createPurchaseRequest } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { PRItem } from "@/types/purchasing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const costCenters = [
  "Outpatient Department",
  "Emergency Department",
  "Pharmacy",
  "Laboratory",
  "X-Ray Department",
  "Maternal Health",
  "Child Health",
  "TB Program",
  "Administration",
];

const departments = [
  "Medical Services",
  "Nursing Services",
  "Pharmacy",
  "Laboratory",
  "TB Program",
  "Maternal Health",
  "Child Health",
];

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    requestingDepartment: "",
    costCenter: "",
    remarks: "",
  });
  const [items, setItems] = useState<PRItem[]>([]);
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemCode: "",
    quantity: "",
    unit: "tablets",
    estimatedPrice: "",
    notes: "",
  });

  const handleAddItem = () => {
    if (!newItem.itemName || !newItem.quantity) {
      toast.error("Please fill in item name and quantity");
      return;
    }

    setItems([
      ...items,
      {
        id: `PRI-${Date.now()}`,
        itemName: newItem.itemName,
        itemCode: newItem.itemCode || `ITEM-${items.length + 1}`,
        quantity: parseInt(newItem.quantity),
        unit: newItem.unit,
        estimatedPrice: newItem.estimatedPrice ? parseFloat(newItem.estimatedPrice) : undefined,
        notes: newItem.notes || undefined,
      },
    ]);

    // Reset new item form
    setNewItem({
      itemName: "",
      itemCode: "",
      quantity: "",
      unit: "tablets",
      estimatedPrice: "",
      notes: "",
    });

    toast.success("Item added");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.requestingDepartment || !formData.costCenter) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      await createPurchaseRequest({
        requestingDepartment: formData.requestingDepartment,
        costCenter: formData.costCenter,
        items,
        requestedBy: user?.name || "Current User",
        remarks: formData.remarks || undefined,
      });

      toast.success("Purchase request created successfully");
      router.push("/purchasing/requests");
    } catch (error) {
      console.error("Failed to create PR:", error);
      toast.error("Failed to create purchase request");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/requests")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Purchase Requests
      </Button>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">New Purchase Request</h1>
        <p className="text-sm text-muted-foreground">Create a new purchase request</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
            <CardDescription>Enter request details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">
                  Requesting Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.requestingDepartment}
                  onValueChange={(value) =>
                    setFormData({ ...formData, requestingDepartment: value })
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCenter">
                  Cost Center <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.costCenter}
                  onValueChange={(value) => setFormData({ ...formData, costCenter: value })}
                >
                  <SelectTrigger id="costCenter">
                    <SelectValue placeholder="Select cost center..." />
                  </SelectTrigger>
                  <SelectContent>
                    {costCenters.map((center) => (
                      <SelectItem key={center} value={center}>
                        {center}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add any additional information..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Add items to the purchase request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="itemName">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemName"
                  placeholder="e.g., Paracetamol 500mg"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Code</Label>
                <Input
                  id="itemCode"
                  placeholder="e.g., MED-001"
                  value={newItem.itemCode}
                  onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 1000"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={newItem.unit} onValueChange={(unit) => setNewItem({ ...newItem, unit })}>
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="pairs">Pairs</SelectItem>
                    <SelectItem value="vials">Vials</SelectItem>
                    <SelectItem value="ampules">Ampules</SelectItem>
                    <SelectItem value="strips">Strips</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedPrice">Est. Price (₱)</Label>
                <Input
                  id="estimatedPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.estimatedPrice}
                  onChange={(e) => setNewItem({ ...newItem, estimatedPrice: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Optional notes..."
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                />
              </div>
            </div>

            <Button type="button" onClick={handleAddItem} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>

            {items.length > 0 && (
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Qty</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Unit</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Est. Price</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2 text-sm font-medium">{item.itemName}</td>
                          <td className="px-4 py-2 text-right text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">{item.unit}</td>
                          <td className="px-4 py-2 text-right text-sm">
                            {item.estimatedPrice ? `₱${item.estimatedPrice.toFixed(2)}` : "-"}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Purchase Request</Button>
        </div>
      </form>
    </div>
  );
}

