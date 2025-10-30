"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { mockStockAdjustments } from "@/lib/mock-data/adjustments";
import { StockAdjustment } from "@/types/inventory";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { AdjustmentTypeBadge } from "@/components/shared/adjustment-type-badge";

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [filteredAdjustments, setFilteredAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAdjustments();
  }, []);

  useEffect(() => {
    filterAdjustments();
  }, [searchQuery, adjustments]);

  const loadAdjustments = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAdjustments(mockStockAdjustments);
      setFilteredAdjustments(mockStockAdjustments);
    } catch (error) {
      console.error("Failed to load adjustments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAdjustments = () => {
    if (!searchQuery.trim()) {
      setFilteredAdjustments(adjustments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = adjustments.filter(
      (adjustment) =>
        adjustment.adjustmentNumber.toLowerCase().includes(query) ||
        adjustment.itemName.toLowerCase().includes(query) ||
        adjustment.itemCode.toLowerCase().includes(query) ||
        adjustment.type.toLowerCase().includes(query) ||
        adjustment.performedBy.toLowerCase().includes(query)
    );
    setFilteredAdjustments(filtered);
  };

  // Badge rendering moved to reusable component

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Adjustments</h1>
          <p className="text-sm text-muted-foreground">
            Record manual inventory adjustments and physical counts
          </p>
        </div>
        <Link href="/inventory/adjustments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Adjustment
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by adjustment number, item, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-9"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Adjustment #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Before</TableHead>
              <TableHead>After</TableHead>
              <TableHead>Difference</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No adjustments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAdjustments.map((adjustment) => (
                <TableRow
                  key={adjustment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/inventory/adjustments/${adjustment.id}`}
                >
                  <TableCell className="font-medium">{adjustment.adjustmentNumber}</TableCell>
                  <TableCell>{format(new Date(adjustment.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <AdjustmentTypeBadge type={adjustment.type} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{adjustment.itemName}</p>
                      <p className="text-sm text-muted-foreground">{adjustment.itemCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{adjustment.quantityBefore}</TableCell>
                  <TableCell>{adjustment.quantityAfter}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      adjustment.difference > 0 ? 'text-green-600' :
                      adjustment.difference < 0 ? 'text-red-600' : ''
                    }`}>
                      {adjustment.difference > 0 ? '+' : ''}{adjustment.difference}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{adjustment.performedBy}</p>
                      {adjustment.approvedBy && (
                        <p className="text-sm text-muted-foreground">
                          Approved: {adjustment.approvedBy}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/inventory/adjustments/${adjustment.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit adjustment</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete adjustment ${adjustment.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete adjustment</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

