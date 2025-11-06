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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { getWarehouseReceivingReports, getPurchaseOrders } from "@/lib/api";
import { WarehouseReceivingReport, PurchaseOrder } from "@/types/purchasing";
import { format } from "date-fns";
import { Search, Edit, Trash2, SlidersHorizontal, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WarehouseReceivingPage() {
  const [reports, setReports] = useState<WarehouseReceivingReport[]>([]);
  const [pendingPOs, setPendingPOs] = useState<PurchaseOrder[]>([]);
  const [filteredReports, setFilteredReports] = useState<WarehouseReceivingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCols, setVisibleCols] = useState({
    wrrNumber: true,
    date: true,
    status: true,
    poNumber: true,
    location: true,
    supplier: true,
    receivedBy: true,
    createdBy: true,
    approver: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchQuery, reports]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleExport = () => {
    const headers: { key: string; label: string }[] = [];
    if (visibleCols.wrrNumber) headers.push({ key: "wrrNumber", label: "Receiving no" });
    if (visibleCols.date) headers.push({ key: "date", label: "Date Received" });
    if (visibleCols.status) headers.push({ key: "status", label: "Status" });
    if (visibleCols.poNumber) headers.push({ key: "poNumber", label: "PO No." });
    if (visibleCols.location) headers.push({ key: "location", label: "Location" });
    if (visibleCols.supplier) headers.push({ key: "supplier", label: "Supplier" });
    if (visibleCols.receivedBy) headers.push({ key: "receivedBy", label: "Received By" });
    if (visibleCols.createdBy) headers.push({ key: "createdBy", label: "Created By" });
    if (visibleCols.approver) headers.push({ key: "approver", label: "Approver" });

    const rows = filteredReports.map((r) =>
      headers.map(({ key }) => {
        switch (key) {
          case "supplier":
            return r.supplier?.name ?? "";
          case "date":
            return format(new Date(r.date), "yyyy-MM-dd");
          case "createdBy":
            return r.createdBy ?? "";
          case "approver":
            return r.approver ?? "";
          default:
            // @ts-ignore
            return r[key] == null ? "" : String(r[key]);
        }
      })
    );

    const csv = [
      headers.map((h) => h.label).join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receiving_reports.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    <div className="mx-auto py-6 space-y-6">

      {/* {pendingPOs.length > 0 && (
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
      )} */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search by WRR number, PO number, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {([
                ["wrrNumber", "Receiving no"],
                ["date", "Date Received"],
                ["status", "Status"],
                ["poNumber", "PO No."],
                ["location", "Location"],
                ["supplier", "Supplier"],
                ["receivedBy", "Received By"],
                ["createdBy", "Created By"],
                ["approver", "Approver"],
              ] as [keyof typeof visibleCols, string][]).map(([key, label]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visibleCols[key]}
                  onCheckedChange={(val) =>
                    setVisibleCols((prev) => ({ ...prev, [key]: !!val }))
                  }
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleCols.wrrNumber && <TableHead className="pl-4">Receiving no</TableHead>}
              {visibleCols.date && <TableHead>Date Received</TableHead>}
              {visibleCols.status && <TableHead>Status</TableHead>}
              {visibleCols.poNumber && <TableHead>PO No.</TableHead>}
              {visibleCols.location && <TableHead>Location</TableHead>}
              {visibleCols.supplier && <TableHead>Supplier</TableHead>}
              {visibleCols.receivedBy && <TableHead>Received By</TableHead>}
              {visibleCols.createdBy && <TableHead>Created By</TableHead>}
              {visibleCols.approver && <TableHead>Approver</TableHead>}
              <TableHead className="text-center pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={
                  1 + [
                    visibleCols.wrrNumber,
                    visibleCols.poNumber,
                    visibleCols.date,
                    visibleCols.supplier,
                    visibleCols.location,
                    visibleCols.receivedBy,
                    visibleCols.status,
                  ].filter(Boolean).length
                } className="text-center py-8 text-muted-foreground">
                  No receiving reports found
                </TableCell>
              </TableRow>
            ) : (
              filteredReports
                .slice((page - 1) * rowsPerPage, Math.min(filteredReports.length, (page - 1) * rowsPerPage + rowsPerPage))
                .map((report) => (
                <TableRow
                  key={report.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/purchasing/receiving/${report.id}`}
                >
                  {visibleCols.wrrNumber && (
                    <TableCell className="font-medium pl-4">{report.wrrNumber}</TableCell>
                  )}
                  {visibleCols.date && (
                    <TableCell>{format(new Date(report.date), "MMM dd, yyyy")}</TableCell>
                  )}
                  {visibleCols.status && (
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                  )}
                  {visibleCols.poNumber && <TableCell>{report.poNumber}</TableCell>}
                  {visibleCols.location && <TableCell>{report.location}</TableCell>}
                  {visibleCols.supplier && <TableCell>{report.supplier.name}</TableCell>}
                  {visibleCols.receivedBy && <TableCell>{report.receivedBy}</TableCell>}
                  {visibleCols.createdBy && <TableCell>{report.createdBy ?? ""}</TableCell>}
                  {visibleCols.approver && <TableCell>{report.approver ?? ""}</TableCell>}
                  <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/purchasing/receiving/${report.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit receiving report</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete receiving report ${report.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete receiving report</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        {(() => {
          const total = filteredReports.length;
          const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
          const end = Math.min(total, page * rowsPerPage);
          return <div>{`Showing ${start} to ${end} of ${total} rows`}</div>;
        })()}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(val) => {
                const next = parseInt(val, 10);
                setRowsPerPage(next);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(() => {
            const total = filteredReports.length;
            const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
            const canPrev = page > 1;
            const canNext = page < totalPages;
            return (
              <div className="flex items-center gap-2">
                <span>{`Page ${page} of ${totalPages}`}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canPrev}
                  onClick={() => setPage(1)}
                >
                  «
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canNext}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canNext}
                  onClick={() => setPage(totalPages)}
                >
                  »
                </Button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

