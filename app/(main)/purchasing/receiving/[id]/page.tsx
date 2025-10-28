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
import { getWarehouseReceivingReportById } from "@/lib/api";
import { WarehouseReceivingReport } from "@/types/purchasing";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WarehouseReceivingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<WarehouseReceivingReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [params.id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getWarehouseReceivingReportById(params.id as string);
      setReport(data);
    } catch (error) {
      console.error("Failed to load receiving report:", error);
    } finally {
      setLoading(false);
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

  if (!report) {
    return (
      <div className="container mx-auto py-6">
        <p>Receiving report not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/receiving")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Receiving
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{report.wrrNumber}</h1>
          <p className="text-sm text-muted-foreground">Warehouse Receiving Report</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={report.status} />
          {report.hasDiscrepancy && (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              Has Discrepancy
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receiving Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">WRR Number:</div>
              <div className="text-sm font-medium">{report.wrrNumber}</div>

              <div className="text-sm text-muted-foreground">PO Number:</div>
              <div className="text-sm font-medium">{report.poNumber}</div>

              <div className="text-sm text-muted-foreground">Date:</div>
              <div className="text-sm font-medium">
                {format(new Date(report.date), "MMMM dd, yyyy")}
              </div>

              <div className="text-sm text-muted-foreground">Location:</div>
              <div className="text-sm font-medium">{report.location}</div>

              <div className="text-sm text-muted-foreground">Received By:</div>
              <div className="text-sm font-medium">{report.receivedBy}</div>

              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="text-sm font-medium">
                <StatusBadge status={report.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Supplier:</div>
              <div className="text-sm font-medium">{report.supplier.name}</div>

              <div className="text-sm text-muted-foreground">Code:</div>
              <div className="text-sm font-medium">{report.supplier.code}</div>

              {report.supplier.contactPerson && (
                <>
                  <div className="text-sm text-muted-foreground">Contact:</div>
                  <div className="text-sm font-medium">{report.supplier.contactPerson}</div>
                </>
              )}

              {report.supplier.phone && (
                <>
                  <div className="text-sm text-muted-foreground">Phone:</div>
                  <div className="text-sm font-medium">{report.supplier.phone}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Items</CardTitle>
          <CardDescription>
            Items received from the purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Ordered</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell className="text-right">{item.orderedQuantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.receivedQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.remainingQuantity}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.batchNumber || "-"}</TableCell>
                  <TableCell>
                    {item.expiryDate
                      ? format(new Date(item.expiryDate), "MMM dd, yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between border-t pt-4">
                <span className="font-medium">Total Value:</span>
                <span className="font-semibold">₱{report.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {report.hasDiscrepancy && report.discrepancyNotes && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Discrepancy Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">{report.discrepancyNotes}</p>
          </CardContent>
        </Card>
      )}

      {report.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>General Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{report.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

