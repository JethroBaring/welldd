"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package } from "lucide-react";

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    category: "",
    subType: "supplied" as "supplied" | "donated",
    unit: "",
    reorderLevel: "",
    location: "",
    description: "",
  });

  const [batchInfo, setBatchInfo] = useState({
    batchNumber: "",
    quantity: "",
    expiryDate: "",
    supplier: "",
    wrrNumber: "",
  });

  const categories = [
    "Pain Relief",
    "Antibiotics",
    "Vitamins & Supplements",
    "Cardiovascular",
    "Diabetes Care",
    "Respiratory",
    "Gastrointestinal",
    "Dermatological",
    "Medical Supplies",
    "First Aid",
    "Vaccines",
    "Others"
  ];

  const units = [
    "tablets",
    "capsules",
    "ml",
    "vials",
    "bottles",
    "boxes",
    "pieces",
    "kits",
    "packs",
    "tubes",
    "injections",
    "sachets"
  ];

  const locations = [
    "Main Pharmacy Storage",
    "Emergency Room",
    "Ward Station",
    "Operating Room",
    "Laboratory",
    "Dental Clinic",
    "Maternity Ward",
    "Pediatric Ward",
    "Outpatient Department"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating inventory item:", { formData, batchInfo });
      router.push("/inventory/items");
    } catch (error) {
      console.error("Failed to create inventory item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.itemCode.trim() &&
    formData.itemName.trim() &&
    formData.category.trim() &&
    formData.unit.trim() &&
    formData.reorderLevel.trim() &&
    formData.location.trim() &&
    batchInfo.batchNumber.trim() &&
    batchInfo.quantity.trim() &&
    batchInfo.expiryDate.trim() &&
    batchInfo.supplier.trim();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/inventory/items")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Items
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">Add New Inventory Item</h1>
        <p className="text-sm text-muted-foreground">
          Add a new medicine or supply to the inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the inventory item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Code *</Label>
                <Input
                  id="itemCode"
                  placeholder="e.g., MED-001"
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  placeholder="e.g., Paracetamol 500mg Tablets"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subType">Item Type *</Label>
                <Select
                  value={formData.subType}
                  onValueChange={(value: "supplied" | "donated") => setFormData({ ...formData, subType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplied">Supplied</SelectItem>
                    <SelectItem value="donated">Donated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level *</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Storage Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter item description, usage instructions, or additional notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Initial Batch Information</CardTitle>
            <CardDescription>
              Enter details for the initial batch of this item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <Input
                  id="batchNumber"
                  placeholder="e.g., PARA2025-A01"
                  value={batchInfo.batchNumber}
                  onChange={(e) => setBatchInfo({ ...batchInfo, batchNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  placeholder="e.g., MediPharm Solutions Inc."
                  value={batchInfo.supplier}
                  onChange={(e) => setBatchInfo({ ...batchInfo, supplier: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 1000"
                  value={batchInfo.quantity}
                  onChange={(e) => setBatchInfo({ ...batchInfo, quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={batchInfo.expiryDate}
                  onChange={(e) => setBatchInfo({ ...batchInfo, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wrrNumber">WRR Number</Label>
              <Input
                id="wrrNumber"
                placeholder="e.g., WRR-2025-001"
                value={batchInfo.wrrNumber}
                onChange={(e) => setBatchInfo({ ...batchInfo, wrrNumber: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inventory/items")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Adding Item..." : "Add Item"}
          </Button>
        </div>
      </form>
    </div>
  );
}