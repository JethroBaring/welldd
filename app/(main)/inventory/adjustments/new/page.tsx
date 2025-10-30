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
    { value: "quantity_adjustment", label: "Quantity Adjustment" },
    { value: "location_transfer", label: "Location Transfer" },
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
                <Label htmlFor="itemId">Item *</Label>
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
                <Label htmlFor="dateReceived">Date Received *</Label>
                <Input type="date" id="dateReceived" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvers">Approvers *</Label>
                <Select id="approvers">
                  <SelectTrigger>
                    <SelectValue placeholder="Select approvers..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-1">Dr. Reyes</SelectItem>
                    <SelectItem value="user-2">Manager Ana</SelectItem>
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
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select id="branch">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Branch</SelectItem>
                    <SelectItem value="branch2">Branch 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {formData.adjustmentType === "quantity_adjustment" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select id="location">
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        <SelectItem value="storage">Storage Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>New Quantity on Hand (Unit) *</Label>
                    <Input type="number" min="0" value={formData.quantityAfter} onChange={e => setFormData({ ...formData, quantityAfter: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity on Hand (Unit)</Label>
                    <Input type="number" disabled value={formData.quantityBefore} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>New Converted Quantity(Inventory Unit)</Label>
                    <Input type="number" disabled value={formData.quantityAfter} />
                  </div>
                  <div className="space-y-2">
                    <Label>On hand Converted Quantity(Inventory Unit)</Label>
                    <Input type="number" disabled value={formData.quantityBefore} />
                  </div>
                </div>
              </>
            )}

            {formData.adjustmentType === "location_transfer" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceLocation">Source Location*</Label>
                    <Select id="sourceLocation">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Source Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loc-a">Pharmacy Storage</SelectItem>
                        <SelectItem value="loc-b">Clinic Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destLocation">Destination Location*</Label>
                    <Select id="destLocation">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Destination Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loc-b">Clinic Room</SelectItem>
                        <SelectItem value="loc-a">Pharmacy Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Quantity summary */}
                <div className="mt-6">
                  <span className="font-semibold text-orange-500 border-b block mb-4">Quantity</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-2">
                      <CardContent>
                        <div className="font-bold mb-1">Source</div>
                        <div className="text-muted-foreground text-sm mb-2">No source selected</div>
                        <div className="text-3xl font-extrabold text-center">0</div>
                        <div className="text-xs mt-1 text-center">Converted Quantity(Inventory Unit) 0</div>
                      </CardContent>
                    </Card>
                    <Card className="p-2">
                      <CardContent>
                        <div className="font-bold mb-1">Destination</div>
                        <div className="text-muted-foreground text-sm mb-2">No destination selected</div>
                        <div className="text-3xl font-extrabold text-center">0</div>
                        <div className="text-xs mt-1 text-center">Converted Quantity(Inventory Unit) 0</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  <Label>Quantity to Transfer *</Label>
                  <Input id="quantityToTransfer" type="number" min="0" defaultValue={0} />
                </div>
              </>
            )}
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