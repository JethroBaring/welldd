"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ArrowLeft, Edit, Trash2, TruckIcon, Package, Calendar, User, FileText } from "lucide-react";
import { mockTransferOuts } from "@/lib/mock-data/transfer-outs";
import { TransferOut } from "@/types/inventory";
import { format } from "date-fns";

export default function ViewTransferOutPage() {
  const params = useParams();
  const router = useRouter();
  const [transfer, setTransfer] = useState<TransferOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransfer();
  }, [params.id]);

  const loadTransfer = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundTransfer = mockTransferOuts.find(t => t.id === params.id);
      setTransfer(foundTransfer || null);
    } catch (error) {
      console.error("Failed to load transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this transfer?")) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Deleting transfer ${params.id}`);
        router.push("/inventory/transfer");
      } catch (error) {
        console.error("Failed to delete transfer:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "issued":
        return "bg-purple-100 text-purple-800";
      case "received":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (!transfer) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <TruckIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Transfer Not Found</h2>
          <p className="text-muted-foreground mb-4">The transfer you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/inventory/transfer")}>
            Back to Transfers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/inventory/transfer")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Transfers
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">Transfer Details</h1>
        <p className="text-sm text-muted-foreground">
          View stock transfer information and status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5" />
                Transfer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transfer Number</label>
                    <p className="font-semibold">{transfer.transferNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transfer Date</label>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(transfer.date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={transfer.status} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receiving LGU</label>
                    <p className="font-semibold">{transfer.receivingLGU}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {transfer.receivingContact || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Value</label>
                    <p className="text-xl font-bold text-green-600">
                      ₱{transfer.totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              {transfer.remarks && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Remarks</label>
                  <p className="mt-1 flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5" />
                    {transfer.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Transfer Items
              </CardTitle>
              <CardDescription>
                Items included in this transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Shelf Life</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfer.items.map((item) => {
                    const shelfLife = Math.ceil(
                      (new Date(item.expiryDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
                    );
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.batchNumber}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {format(new Date(item.expiryDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={shelfLife <= 3 ? "destructive" : shelfLife <= 6 ? "default" : "secondary"}
                          >
                            {shelfLife} months
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ₱{(item.quantity * 50).toFixed(2)} {/* Estimated value */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transfer.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                  <p className="font-semibold">{transfer.approvedBy}</p>
                </div>
              )}
              {transfer.issuedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Issued By</label>
                  <p className="font-semibold">{transfer.issuedBy}</p>
                </div>
              )}
              {transfer.receivedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Received By</label>
                  <p className="font-semibold">{transfer.receivedBy}</p>
                </div>
              )}
              {transfer.receivedDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Received Date</label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(transfer.receivedDate), "MMMM dd, yyyy")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Transfer Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transfer.createdAt), "MMM dd, yyyy - hh:mm a")}
                  </p>
                </div>
              </div>
              {transfer.approvedBy && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Transfer Approved</p>
                    <p className="text-sm text-muted-foreground">
                      Approved by {transfer.approvedBy}
                    </p>
                  </div>
                </div>
              )}
              {transfer.issuedBy && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Items Issued</p>
                    <p className="text-sm text-muted-foreground">
                      Issued by {transfer.issuedBy}
                    </p>
                  </div>
                </div>
              )}
              {transfer.receivedBy && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Items Received</p>
                    <p className="text-sm text-muted-foreground">
                      Received by {transfer.receivedBy} on {format(new Date(transfer.receivedDate!), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Items:</span>
                <span className="font-semibold">{transfer.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quantity:</span>
                <span className="font-semibold">
                  {transfer.items.reduce((sum, item) => sum + item.quantity, 0)} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Shelf Life:</span>
                <span className="font-semibold">
                  {Math.round(
                    transfer.items.reduce((sum, item) => sum + item.shelfLife, 0) / transfer.items.length
                  )} months
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expiring Soon:</span>
                <span className="font-semibold text-red-600">
                  {transfer.items.filter(item => item.shelfLife <= 3).length} items
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}