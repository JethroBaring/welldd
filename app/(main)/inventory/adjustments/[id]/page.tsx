"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Package, Calendar, User, FileText, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { mockStockAdjustments } from "@/lib/mock-data/adjustments";
import { StockAdjustment } from "@/types/inventory";
import { format } from "date-fns";

export default function ViewAdjustmentPage() {
  const params = useParams();
  const router = useRouter();
  const [adjustment, setAdjustment] = useState<StockAdjustment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdjustment();
  }, [params.id]);

  const loadAdjustment = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundAdjustment = mockStockAdjustments.find(a => a.id === params.id);
      setAdjustment(foundAdjustment || null);
    } catch (error) {
      console.error("Failed to load adjustment:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const getAdjustmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      physical_count: "bg-blue-100 text-blue-800",
      damage: "bg-red-100 text-red-800",
      expired: "bg-red-100 text-red-800",
      correction: "bg-gray-100 text-gray-800",
      other: "bg-yellow-100 text-yellow-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatAdjustmentType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getUnifiedAdjustmentType = (type: string) =>
    ["physical_count", "damage", "expired", "correction", "other"].includes(type)
      ? "Quantity Adjustment"
      : "Location Transfer";

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Adjustment Not Found</h2>
          <p className="text-muted-foreground mb-4">The adjustment you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/inventory/adjustments")}>
            Back to Adjustments
          </Button>
        </div>
      </div>
    );
  }

  const isPositiveAdjustment = adjustment.difference > 0;
  const isNegativeAdjustment = adjustment.difference < 0;

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
        <h1 className="text-2xl font-semibold">Adjustment Details</h1>
        <p className="text-sm text-muted-foreground">
          View inventory adjustment information and change history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Adjustment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getUnifiedAdjustmentType(adjustment.type) === "quantity_adjustment" || getUnifiedAdjustmentType(adjustment.type) === "Quantity Adjustment" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Item Name</label>
                    <p className="font-semibold">{adjustment.itemName}</p>
                    <p className="text-sm text-muted-foreground">{adjustment.itemCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adjustment Date</label>
                    <p>{format(new Date(adjustment.date), "MMMM dd, yyyy")}</p>
                  </div>
                  {adjustment.approvedBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Approver</label>
                      <p className="font-semibold">{adjustment.approvedBy}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adjustment Type</label>
                    <Badge>{getUnifiedAdjustmentType(adjustment.type)}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Branch</label>
                    <p>Main Branch</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p>Unassigned</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">New Quantity on Hand (Unit)</label>
                    <p>{adjustment.quantityAfter}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Quantity on Hand (Unit)</label>
                    <p>{adjustment.quantityBefore}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">New Converted Quantity (Inventory Unit)</label>
                    <p>{adjustment.quantityAfter}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">On hand Converted Quantity (Inventory Unit)</label>
                    <p>{adjustment.quantityBefore}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Item Name</label>
                    <p className="font-semibold">{adjustment.itemName}</p>
                    <p className="text-sm text-muted-foreground">{adjustment.itemCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adjustment Date</label>
                    <p>{format(new Date(adjustment.date), "MMMM dd, yyyy")}</p>
                  </div>
                  {adjustment.approvedBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Approver</label>
                      <p className="font-semibold">{adjustment.approvedBy}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adjustment Type</label>
                    <Badge>{getUnifiedAdjustmentType(adjustment.type)}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Branch</label>
                    <p>Main Branch</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Source Location</label>
                      <p>Pharmacy Storage</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Destination Location</label>
                      <p>Clinic Room</p>
                    </div>
                  </div>
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
                    <label className="text-sm font-medium text-muted-foreground">Quantity to Transfer *</label>
                    <p>{adjustment.difference}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <label className="text-sm font-medium text-muted-foreground">Reason for Adjustment</label>
                <p className="mt-1 flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5" />
                  {adjustment.reason}
                </p>
              </div>

              {adjustment.remarks && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Additional Remarks</label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded">
                    {adjustment.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {(isNegativeAdjustment || adjustment.type === 'damage' || adjustment.type === 'expired') && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {adjustment.type === 'damage' && "This adjustment represents damaged inventory that was removed from stock."}
                {adjustment.type === 'expired' && "This adjustment represents expired inventory that was properly disposed of."}
                {adjustment.type === 'physical_count' && isNegativeAdjustment && "This adjustment represents a shortage discovered during physical count."}
                {adjustment.type === 'correction' && isNegativeAdjustment && "This adjustment corrects a previous inventory overstatement."}
                {adjustment.type === 'other' && isNegativeAdjustment && "This adjustment represents inventory removed for other documented reasons."}
              </AlertDescription>
            </Alert>
          )}

          {isPositiveAdjustment && (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                {adjustment.type === 'correction' && "This adjustment corrects a previous inventory understatement."}
                {adjustment.type === 'physical_count' && "This adjustment represents excess inventory discovered during physical count."}
                {adjustment.type === 'other' && "This adjustment represents inventory added for other documented reasons."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Performed By</label>
                <p className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {adjustment.performedBy}
                </p>
              </div>
              {adjustment.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                  <p className="font-semibold">{adjustment.approvedBy}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(adjustment.createdAt), "MMM dd, yyyy - hh:mm a")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adjustment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge className={getAdjustmentTypeColor(adjustment.type)}>
                  {getUnifiedAdjustmentType(adjustment.type)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={adjustment.approvedBy ? "default" : "secondary"}>
                  {adjustment.approvedBy ? "Approved" : "Pending Approval"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impact:</span>
                <span className={`font-medium ${
                  isPositiveAdjustment ? 'text-green-600' :
                  isNegativeAdjustment ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {isPositiveAdjustment ? "Stock Increased" :
                   isNegativeAdjustment ? "Stock Decreased" : "No Change"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Percentage Change:</span>
                <span className="font-medium">
                  {adjustment.quantityBefore > 0
                    ? `${((adjustment.difference / adjustment.quantityBefore) * 100).toFixed(1)}%`
                    : "N/A"
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          </div>
      </div>
    </div>
  );
}