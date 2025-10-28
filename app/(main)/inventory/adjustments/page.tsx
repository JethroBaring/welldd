"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default function InventoryAdjustmentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory Adjustments</h1>
        <p className="text-sm text-muted-foreground">
          Record manual inventory adjustments and physical counts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adjustment Types</CardTitle>
          <CardDescription>Select the type of adjustment to record</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Package className="h-6 w-6" />
            Physical Count
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Package className="h-6 w-6" />
            Damage
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Package className="h-6 w-6" />
            Expired Items
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Package className="h-6 w-6" />
            Correction
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Package className="h-6 w-6" />
            Other
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Adjustments</CardTitle>
          <CardDescription>History of inventory adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No adjustments recorded yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

