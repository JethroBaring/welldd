"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Plus, TruckIcon, Search, Edit, Trash2 } from "lucide-react";
import { mockTransferOuts } from "@/lib/mock-data/transfer-outs";
import { TransferOut } from "@/types/inventory";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransferOutPage() {
  const [transfers, setTransfers] = useState<TransferOut[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<TransferOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTransfers();
  }, []);

  useEffect(() => {
    filterTransfers();
  }, [searchQuery, transfers]);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTransfers(mockTransferOuts);
      setFilteredTransfers(mockTransferOuts);
    } catch (error) {
      console.error("Failed to load transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransfers = () => {
    if (!searchQuery.trim()) {
      setFilteredTransfers(transfers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = transfers.filter(
      (transfer) =>
        transfer.transferNumber.toLowerCase().includes(query) ||
        transfer.receivingLGU.toLowerCase().includes(query) ||
        transfer.items.some(item =>
          item.itemName.toLowerCase().includes(query) ||
          item.itemCode.toLowerCase().includes(query)
        )
    );
    setFilteredTransfers(filtered);
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
    <div className="mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Stock Transfer Out</h1>
          <p className="text-sm text-muted-foreground">
            Transfer expiring stock to other LGUs
          </p>
        </div>
        <Link href="/inventory/transfer/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by transfer number, LGU, or item..."
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
              <TableHead>Transfer Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Receiving LGU</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No transfers found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransfers.map((transfer) => (
                <TableRow
                  key={transfer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/inventory/transfer/${transfer.id}`}
                >
                  <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                  <TableCell>{format(new Date(transfer.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{transfer.receivingLGU}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {transfer.receivingContact || "-"}
                  </TableCell>
                  <TableCell>{transfer.items.length} items</TableCell>
                  <TableCell>₱{transfer.totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={transfer.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/inventory/transfer/${transfer.id}/edit`}>
                        <Button variant="noHover" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit transfer</span>
                        </Button>
                      </Link>
                      <Button
                        variant="noHover"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete transfer ${transfer.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete transfer</span>
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

