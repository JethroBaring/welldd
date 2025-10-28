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
import { getWarehouseReceivingReports, getPurchaseOrders } from "@/lib/api";
import { WarehouseReceivingReport, PurchaseOrder } from "@/types/purchasing";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WarehouseReceivingPage() {
  const [reports, setReports] = useState<WarehouseReceivingReport[]>([]);
  const [pendingPOs, setPendingPOs] = useState<PurchaseOrder[]>([]);
  const [filteredReports, setFilteredReports] = useState<WarehouseReceivingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchQuery, reports]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wrrData, poData] = await Promise.all([
        getWarehouseReceivingReports(),
        getPurchaseOrders(),
      ]);
      setReports(wrrData);
      setFilteredReports(wrrData);
      
      // Filter for approved POs that haven't been fully received
      const pending = poData.filter(po => 
        (po.status === "approved" || po.status === "sent") && 
        !wrrData.some(wrr => wrr.poId === po.id && wrr.status === "completed")
      );
      setPendingPOs(pending);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    if (!searchQuery.trim()) {
      setFilteredReports(reports);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = reports.filter(
      (report) =>
        report.wrrNumber.toLowerCase().includes(query) ||
        report.poNumber.toLowerCase().includes(query) ||
        report.supplier.name.toLowerCase().includes(query)
    );
    setFilteredReports(filtered);
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
      <div>
        <h1 className="text-2xl font-semibold">Warehouse Receiving</h1>
        <p className="text-sm text-muted-foreground">
          Receive and verify delivered purchase orders
        </p>
      </div>

      {pendingPOs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Pending Purchase Orders for Receiving
          </h3>
          <div className="space-y-2">
            {pendingPOs.map((po) => (
              <div key={po.id} className="flex items-center justify-between bg-white p-3 rounded">
                <div>
                  <p className="font-medium">{po.poNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {po.supplier.name} - {po.items.length} items - ₱{po.total.toFixed(2)}
                  </p>
                </div>
                <Link href={`/purchasing/receiving/new?po=${po.id}`}>
                  <Button size="sm">Start Receiving</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by WRR number, PO number, or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>WRR Number</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Received By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No receiving reports found
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.wrrNumber}</TableCell>
                  <TableCell>{report.poNumber}</TableCell>
                  <TableCell>{format(new Date(report.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{report.supplier.name}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{report.receivedBy}</TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                    {report.hasDiscrepancy && (
                      <span className="ml-2 text-xs text-orange-600">Has Discrepancy</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/purchasing/receiving/${report.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
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

