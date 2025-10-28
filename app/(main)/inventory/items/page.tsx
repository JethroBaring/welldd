"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { getInventoryItems } from "@/lib/api";
import { InventoryItem } from "@/types/inventory";
import { Search, AlertTriangle, Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function InventoryItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, items]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getInventoryItems();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Failed to load inventory items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(query) ||
        item.itemCode.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

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
          <h1 className="text-2xl font-semibold">Inventory Items</h1>
          <p className="text-sm text-muted-foreground">
            View and manage medicine and supply inventory
          </p>
        </div>
        <Link href="/inventory/items/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by item name, code, or category..."
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
              <TableHead>Item Code</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Available Qty</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/inventory/items/${item.id}`}
                >
                  <TableCell className="font-medium">{item.itemCode}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.subType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.availableQuantity} {item.unit}
                    {item.availableQuantity <= item.reorderLevel && (
                      <AlertTriangle className="inline ml-2 h-4 w-4 text-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.reorderLevel} {item.unit}
                  </TableCell>
                  <TableCell>{item.batches.length} batches</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/inventory/items/${item.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit item</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete inventory item ${item.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete item</span>
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

