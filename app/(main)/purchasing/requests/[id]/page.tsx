"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { 
  getPurchaseRequestById, 
  approvePurchaseRequest, 
  denyPurchaseRequest 
} from "@/lib/api";
import { PurchaseRequest } from "@/types/purchasing";
import { format } from "date-fns";
import { ArrowLeft, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PurchaseRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDenyDialog, setShowDenyDialog] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const { getPermissions, user } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadRequest();
  }, [params.id]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseRequestById(params.id as string);
      setRequest(data);
    } catch (error) {
      console.error("Failed to load purchase request:", error);
      toast.error("Failed to load purchase request");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request || !user) return;
    
    try {
      setActionLoading(true);
      await approvePurchaseRequest(request.id, user.name);
      toast.success("Purchase request approved successfully");
      loadRequest();
    } catch (error) {
      console.error("Failed to approve request:", error);
      toast.error("Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!request || !denyReason.trim()) {
      toast.error("Please provide a reason for denial");
      return;
    }

    try {
      setActionLoading(true);
      await denyPurchaseRequest(request.id, denyReason);
      toast.success("Purchase request denied");
      setShowDenyDialog(false);
      loadRequest();
    } catch (error) {
      console.error("Failed to deny request:", error);
      toast.error("Failed to deny request");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-6">
        <p>Purchase request not found</p>
      </div>
    );
  }

  const canApprove = permissions.canApprovePR && request.status === "pending";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/requests")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Purchase Requests
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{request.prNumber}</h1>
          <p className="text-sm text-muted-foreground">Purchase Request Details</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">PR Number:</div>
              <div className="text-sm font-medium">{request.prNumber}</div>
              
              <div className="text-sm text-muted-foreground">Date:</div>
              <div className="text-sm font-medium">
                {format(new Date(request.date), "MMMM dd, yyyy")}
              </div>
              
              <div className="text-sm text-muted-foreground">Department:</div>
              <div className="text-sm font-medium">{request.requestingDepartment}</div>
              
              <div className="text-sm text-muted-foreground">Cost Center:</div>
              <div className="text-sm font-medium">{request.costCenter}</div>
              
              <div className="text-sm text-muted-foreground">Requested By:</div>
              <div className="text-sm font-medium">{request.requestedBy}</div>
              
              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="text-sm font-medium">
                <StatusBadge status={request.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {request.approvedBy && (
                <>
                  <div className="text-sm text-muted-foreground">Approved By:</div>
                  <div className="text-sm font-medium">{request.approvedBy}</div>
                  
                  <div className="text-sm text-muted-foreground">Approved Date:</div>
                  <div className="text-sm font-medium">
                    {request.approvedDate && format(new Date(request.approvedDate), "MMMM dd, yyyy")}
                  </div>
                </>
              )}
              
              {request.deniedReason && (
                <>
                  <div className="text-sm text-muted-foreground">Denied Reason:</div>
                  <div className="text-sm font-medium">{request.deniedReason}</div>
                </>
              )}
              
              {request.remarks && (
                <>
                  <div className="text-sm text-muted-foreground">Remarks:</div>
                  <div className="text-sm font-medium">{request.remarks}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requested Items</CardTitle>
          <CardDescription>List of items in this purchase request</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Est. Price</TableHead>
                <TableHead>Est. Total</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {request.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    {item.estimatedPrice ? `₱${item.estimatedPrice.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    {item.estimatedPrice ? `₱${(item.quantity * item.estimatedPrice).toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canApprove && (
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => setShowDenyDialog(true)}
            disabled={actionLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Deny Request
          </Button>
          <Button onClick={handleApprove} disabled={actionLoading}>
            <Check className="mr-2 h-4 w-4" />
            Approve Request
          </Button>
        </div>
      )}

      <Dialog open={showDenyDialog} onOpenChange={setShowDenyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Purchase Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for denying this purchase request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for denial..."
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDenyDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeny} disabled={actionLoading}>
              Deny Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

