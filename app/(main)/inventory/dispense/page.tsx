"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Scan, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { mockInventoryItems, mockBatches } from "@/lib/mock-data";

export default function DispenseMedicinePage() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const { user } = useAuthStore();

  const handleBarcodeScn = () => {
    if (!barcodeInput.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    // Mock barcode scanning - find matching batch
    const batch = mockBatches.find(b => b.batchNumber === barcodeInput);
    
    if (batch) {
      setSelectedItem(batch.itemId);
      setSelectedBatch(batch.id);
      toast.success(`Item found: ${batch.itemName}`);
    } else {
      toast.error("Item not found. Please check the barcode.");
    }
  };

  const handleDispense = () => {
    if (!selectedItem || !selectedBatch || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const batch = mockBatches.find(b => b.id === selectedBatch);
    const qty = parseInt(quantity);

    if (batch && qty > batch.quantity) {
      toast.error(`Insufficient quantity. Available: ${batch.quantity}`);
      return;
    }

    toast.success("Medicine dispensed successfully");
    
    // Reset form
    setBarcodeInput("");
    setSelectedItem("");
    setSelectedBatch("");
    setQuantity("");
    setRemarks("");
  };

  const item = mockInventoryItems.find(i => i.id === selectedItem);
  const batch = mockBatches.find(b => b.id === selectedBatch);
  const availableBatches = mockBatches.filter(b => b.itemId === selectedItem && b.quantity > 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dispense Medicine</h1>
        <p className="text-sm text-muted-foreground">
          Scan or select medicine to dispense following FIFO/FEFO principles
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Barcode Scanner</CardTitle>
            <CardDescription>Scan medicine barcode to auto-select item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="barcode">Barcode / Batch Number</Label>
                <Input
                  id="barcode"
                  placeholder="Enter or scan barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleBarcodeScn()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleBarcodeScn}>
                  <Scan className="mr-2 h-4 w-4" />
                  Scan
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Or Select Manually:</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="item">Medicine Item</Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger id="item">
                      <SelectValue placeholder="Select medicine..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.itemName} ({item.availableQuantity} {item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedItem && availableBatches.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch (FIFO/FEFO Recommended)</Label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger id="batch">
                        <SelectValue placeholder="Select batch..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBatches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.batchNumber} - Exp: {new Date(batch.expiryDate).toLocaleDateString()} ({batch.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity to Dispense</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity..."
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add notes about this dispensing..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Item Details</CardTitle>
            <CardDescription>Review item information before dispensing</CardDescription>
          </CardHeader>
          <CardContent>
            {!item ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No item selected</p>
                <p className="text-sm">Scan barcode or select manually</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Item Name</Label>
                  <p className="font-medium">{item.itemName}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Item Code</Label>
                  <p className="font-medium">{item.itemCode}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <p className="font-medium">{item.category}</p>
                </div>


                <div>
                  <Label className="text-sm text-muted-foreground">Available Quantity</Label>
                  <p className="font-medium">
                    {item.availableQuantity} {item.unit}
                  </p>
                </div>

                {batch && (
                  <>
                    <div className="border-t pt-4">
                      <Label className="text-sm text-muted-foreground">Selected Batch</Label>
                      <p className="font-medium">{batch.batchNumber}</p>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Batch Quantity</Label>
                      <p className="font-medium">{batch.quantity} {item.unit}</p>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                      <p className="font-medium">
                        {new Date(batch.expiryDate).toLocaleDateString()}
                        {batch.status === "expiring_soon" && (
                          <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expiring Soon
                          </Badge>
                        )}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Location</Label>
                      <p className="font-medium">{batch.location}</p>
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <Label className="text-sm text-muted-foreground">Dispensed By</Label>
                  <p className="font-medium">{user?.name || "Current User"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => {
          setBarcodeInput("");
          setSelectedItem("");
          setSelectedBatch("");
          setQuantity("");
          setRemarks("");
        }}>
          Clear Form
        </Button>
        <Button onClick={handleDispense} disabled={!selectedItem || !selectedBatch || !quantity}>
          <Package className="mr-2 h-4 w-4" />
          Dispense Medicine
        </Button>
      </div>
    </div>
  );
}

