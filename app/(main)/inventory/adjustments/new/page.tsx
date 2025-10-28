"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Package, AlertTriangle } from "lucide-react";
import { mockInventoryItems } from "@/lib/mock-data/inventory";

interface FormData {
  itemId: string;
  adjustmentType: string;
  quantityBefore: number;
  quantityAfter: number;
  batchNumber: string;
  reason: string;
  remarks: string;
}

export default function NewInventoryAdjustmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    itemId: "",
    adjustmentType: "",
    quantityBefore: 0,
    quantityAfter: 0,
    batchNumber: "",
    reason: "",
    remarks: "",
  });

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const adjustmentTypes = [
    { value: "physical_count", label: "Physical Count", description: "Regular inventory counting" },
    { value: "damage", label: "Damage", description: "Items damaged during storage or handling" },
    { value: "expired", label: "Expired Items", description: "Items past their expiration date" },
    { value: "correction", label: "Correction", description: "Data entry or system corrections" },
    { value: "other", label: "Other", description: "Other types of adjustments" },
  ];

  const calculateDifference = () => {
    return formData.quantityAfter - formData.quantityBefore;
  };

  const handleItemChange = (itemId: string) => {
    const item = mockInventoryItems.find(i => i.id === itemId);
    setSelectedItem(item);

    if (item) {
      setFormData({
        ...formData,
        itemId,
        quantityBefore: item.availableQuantity,
        quantityAfter: item.availableQuantity,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating adjustment:", {
        formData,
        difference: calculateDifference(),
        itemName: selectedItem?.itemName,
        itemCode: selectedItem?.itemCode
      });
      router.push("/inventory/adjustments");
    } catch (error) {
      console.error("Failed to create adjustment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const difference = calculateDifference();
  const isFormValid =
    formData.itemId &&
    formData.adjustmentType &&
    formData.reason.trim() &&
    formData.batchNumber.trim();

  const getAlertMessage = () => {
    if (difference === 0) return null;

    if (difference > 0) {
      return {
        type: "default" as const,
        message: `This adjustment will add ${difference} units to inventory.`
      };
    } else {
      return {
        type: "destructive" as const,
        message: `This adjustment will remove ${Math.abs(difference)} units from inventory.`
      };
    }
  };

  const alert = getAlertMessage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/inventory/adjustments")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Adjustments
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">New Inventory Adjustment</h1>
        <p className="text-sm text-muted-foreground">
          Record inventory adjustments for physical counts, damages, or corrections
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Adjustment Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the inventory adjustment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemId">Item Name *</Label>
                <Select
                  value={formData.itemId}
                  onValueChange={handleItemChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{item.itemName}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {item.availableQuantity} {item.unit}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustmentType">Adjustment Type *</Label>
                <Select
                  value={formData.adjustmentType}
                  onValueChange={(value) => setFormData({ ...formData, adjustmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select adjustment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {adjustmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantityBefore">Current Quantity *</Label>
                <Input
                  id="quantityBefore"
                  type="number"
                  value={formData.quantityBefore}
                  onChange={(e) => setFormData({ ...formData, quantityBefore: Number(e.target.value) })}
                  disabled={!selectedItem}
                  className={selectedItem ? "" : "bg-muted"}
                />
                {selectedItem && (
                  <p className="text-sm text-muted-foreground">
                    Based on current inventory count
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityAfter">Adjusted Quantity *</Label>
                <Input
                  id="quantityAfter"
                  type="number"
                  value={formData.quantityAfter}
                  onChange={(e) => setFormData({ ...formData, quantityAfter: Number(e.target.value) })}
                  disabled={!selectedItem}
                  className={selectedItem ? "" : "bg-muted"}
                />
                {selectedItem && (
                  <p className="text-sm text-muted-foreground">
                    New quantity after adjustment
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Difference</Label>
                <Input
                  value={difference === 0 ? "0" : `${difference > 0 ? '+' : ''}${difference}`}
                  disabled
                  className={`bg-muted font-medium ${
                    difference > 0 ? 'text-green-600' :
                    difference < 0 ? 'text-red-600' : ''
                  }`}
                />
                <p className="text-sm text-muted-foreground">
                  {difference > 0 ? "Added to inventory" :
                   difference < 0 ? "Removed from inventory" : "No change"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input
                id="batchNumber"
                placeholder="e.g., PARA2024-A01"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
              {selectedItem && selectedItem.batches.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Available batches:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.batches.map((batch: any) => (
                      <Button
                        key={batch.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, batchNumber: batch.batchNumber })}
                      >
                        {batch.batchNumber} ({batch.quantity})
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Adjustment *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this adjustment is necessary..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Additional Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Any additional notes or observations..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {alert && (
          <Alert variant={alert.type}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Adjustment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Item:</span>
                <span className="font-medium">
                  {selectedItem ? `${selectedItem.itemName} (${selectedItem.itemCode})` : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">
                  {formData.adjustmentType
                    ? adjustmentTypes.find(t => t.value === formData.adjustmentType)?.label
                    : "Not selected"
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Quantity:</span>
                <span>{formData.quantityBefore}</span>
              </div>
              <div className="flex justify-between">
                <span>Adjusted Quantity:</span>
                <span>{formData.quantityAfter}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Net Change:</span>
                <span className={difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : ''}>
                  {difference === 0 ? "No change" : `${difference > 0 ? '+' : ''}${difference} units`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inventory/adjustments")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Creating Adjustment..." : "Create Adjustment"}
          </Button>
        </div>
      </form>
    </div>
  );
}