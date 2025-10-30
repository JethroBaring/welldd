"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, SlidersHorizontal, Download } from "lucide-react";
import { format } from "date-fns";

type StockIssuanceRow = {
  id: string;
  issuanceNo: string;
  issuanceDate: string; // ISO
  issuanceType: string;
  deliveryDate?: string; // ISO | undefined
  status: string;
  source: string;
  destination: string;
  numItems: number;
  deliveryStatus: string;
  receiveStatus: string;
  deliveryReceiptNo?: string;
  consignmentOrder?: string;
  approvers?: string;
  createdBy: string;
};

const mockData: StockIssuanceRow[] = Array.from({ length: 28 }).map((_, idx) => ({
  id: `SI-${idx + 1}`,
  issuanceNo: `SI-2025-${String(idx + 1).padStart(3, "0")}`,
  issuanceDate: new Date(2025, 0, 1 + idx).toISOString(),
  issuanceType: idx % 2 === 0 ? "Inter-warehouse" : "Consignment",
  deliveryDate: new Date(2025, 0, 2 + idx).toISOString(),
  status: idx % 3 === 0 ? "draft" : idx % 3 === 1 ? "approved" : "in transit",
  source: idx % 2 === 0 ? "Main Warehouse" : "Clinic A",
  destination: idx % 2 === 0 ? "Clinic A" : "Main Warehouse",
  numItems: (idx % 5) + 1,
  deliveryStatus: idx % 2 === 0 ? "scheduled" : "assigned",
  receiveStatus: idx % 3 === 0 ? "pending" : "partial",
  deliveryReceiptNo: idx % 4 === 0 ? `DR-${1000 + idx}` : undefined,
  consignmentOrder: idx % 2 === 1 ? `CO-${200 + idx}` : undefined,
  approvers: idx % 2 === 0 ? "J. Dela Cruz" : "A. Reyes",
  createdBy: idx % 2 === 0 ? "mgarcia" : "tlopez",
}));

export default function StockIssuancePage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<StockIssuanceRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCols, setVisibleCols] = useState({
    issuanceNo: true,
    issuanceDate: true,
    issuanceType: true,
    deliveryDate: true,
    status: true,
    source: true,
    destination: true,
    numItems: true,
    deliveryStatus: true,
    receiveStatus: true,
    deliveryReceiptNo: true,
    consignmentOrder: true,
    approvers: true,
    createdBy: true,
    action: true,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Replace with API once available
        await new Promise((r) => setTimeout(r, 300));
        setRows(mockData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.issuanceNo,
        r.issuanceType,
        r.status,
        r.source,
        r.destination,
        r.deliveryStatus,
        r.receiveStatus,
        r.deliveryReceiptNo ?? "",
        r.consignmentOrder ?? "",
        r.approvers ?? "",
        r.createdBy,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  useEffect(() => {
    setPage(1);
  }, [search, rowsPerPage]);

  const handleExport = () => {
    const headers: { key: keyof StockIssuanceRow | "numItems"; label: string }[] = [];
    if (visibleCols.issuanceNo) headers.push({ key: "issuanceNo", label: "Issuance No." });
    if (visibleCols.issuanceDate) headers.push({ key: "issuanceDate", label: "Issuance Date" });
    if (visibleCols.issuanceType) headers.push({ key: "issuanceType", label: "Issuance Type" });
    if (visibleCols.deliveryDate) headers.push({ key: "deliveryDate", label: "Delivery Date" });
    if (visibleCols.status) headers.push({ key: "status", label: "Status" });
    if (visibleCols.source) headers.push({ key: "source", label: "Source" });
    if (visibleCols.destination) headers.push({ key: "destination", label: "Destination" });
    if (visibleCols.numItems) headers.push({ key: "numItems", label: "# of Items" });
    if (visibleCols.deliveryStatus) headers.push({ key: "deliveryStatus", label: "Delivery Status" });
    if (visibleCols.receiveStatus) headers.push({ key: "receiveStatus", label: "Receive Status" });
    if (visibleCols.deliveryReceiptNo) headers.push({ key: "deliveryReceiptNo", label: "Delivery Receipt No." });
    if (visibleCols.consignmentOrder) headers.push({ key: "consignmentOrder", label: "Consignment Order" });
    if (visibleCols.approvers) headers.push({ key: "approvers", label: "Approvers" });
    if (visibleCols.createdBy) headers.push({ key: "createdBy", label: "Created By" });

    const rowsData = filtered.map((r) =>
      headers.map(({ key }) => {
        const v = r[key as keyof StockIssuanceRow] as any;
        if (key === "issuanceDate" || key === "deliveryDate") {
          return v ? format(new Date(v), "yyyy-MM-dd") : "";
        }
        return v == null ? "" : String(v);
      })
    );

    const csv = [
      headers.map((h) => h.label).join(","),
      ...rowsData.map((row) => row.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_issuance.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const total = filtered.length;
  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = Math.min(total, startIdx + rowsPerPage);
  const pageRows = filtered.slice(startIdx, endIdx);
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Stock Issuance</h1>
          <p className="text-sm text-muted-foreground">Create and track stock issuances</p>
        </div>
        <Link href="/inventory/issuance/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Stock Issuance
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search by issuance no., status, source, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {([
                ["issuanceNo", "Issuance No."],
                ["issuanceDate", "Issuance Date"],
                ["issuanceType", "Issuance Type"],
                ["deliveryDate", "Delivery Date"],
                ["status", "Status"],
                ["source", "Source"],
                ["destination", "Destination"],
                ["numItems", "# of Items"],
                ["deliveryStatus", "Delivery Status"],
                ["receiveStatus", "Receive Status"],
                ["deliveryReceiptNo", "Delivery Receipt No."],
                ["consignmentOrder", "Consignment Order"],
                ["approvers", "Approvers"],
                ["createdBy", "Created By"],
                ["action", "Action"],
              ] as [keyof typeof visibleCols, string][]) .map(([key, label]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={(visibleCols as any)[key]}
                  onCheckedChange={(val) => setVisibleCols((p) => ({ ...p, [key]: !!val }))}
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
              {visibleCols.issuanceNo && <TableHead className="pl-4">Issuance No.</TableHead>}
              {visibleCols.issuanceDate && <TableHead>Issuance Date</TableHead>}
              {visibleCols.issuanceType && <TableHead>Issuance Type</TableHead>}
              {visibleCols.deliveryDate && <TableHead>Delivery Date</TableHead>}
              {visibleCols.status && <TableHead>Status</TableHead>}
              {visibleCols.source && <TableHead>Source</TableHead>}
              {visibleCols.destination && <TableHead>Destination</TableHead>}
              {visibleCols.numItems && <TableHead># of Items</TableHead>}
              {visibleCols.deliveryStatus && <TableHead>Delivery Status</TableHead>}
              {visibleCols.receiveStatus && <TableHead>Receive Status</TableHead>}
              {visibleCols.deliveryReceiptNo && <TableHead>Delivery Receipt No.</TableHead>}
              {visibleCols.consignmentOrder && <TableHead>Consignment Order</TableHead>}
              {visibleCols.approvers && <TableHead>Approvers</TableHead>}
              {visibleCols.createdBy && <TableHead>Created By</TableHead>}
              {visibleCols.action && <TableHead className="text-center pr-4">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={[
                    visibleCols.issuanceNo,
                    visibleCols.issuanceDate,
                    visibleCols.issuanceType,
                    visibleCols.deliveryDate,
                    visibleCols.status,
                    visibleCols.source,
                    visibleCols.destination,
                    visibleCols.numItems,
                    visibleCols.deliveryStatus,
                    visibleCols.receiveStatus,
                    visibleCols.deliveryReceiptNo,
                    visibleCols.consignmentOrder,
                    visibleCols.approvers,
                    visibleCols.createdBy,
                    visibleCols.action,
                  ].filter(Boolean).length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No stock issuance found
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((r) => {
                // Make the row redirect to the view page except for View button
                return (
                  <TableRow
                    key={r.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => window.location.href = `/inventory/issuance/${r.id}`}
                  >
                    {visibleCols.issuanceNo && (
                      <TableCell className="pl-4 font-medium">{r.issuanceNo}</TableCell>
                    )}
                    {visibleCols.issuanceDate && (
                      <TableCell>{format(new Date(r.issuanceDate), "MMM dd, yyyy")}</TableCell>
                    )}
                    {visibleCols.issuanceType && <TableCell>{r.issuanceType}</TableCell>}
                    {visibleCols.deliveryDate && (
                      <TableCell>{r.deliveryDate ? format(new Date(r.deliveryDate), "MMM dd, yyyy") : "-"}</TableCell>
                    )}
                    {visibleCols.status && <TableCell>{r.status}</TableCell>}
                    {visibleCols.source && <TableCell>{r.source}</TableCell>}
                    {visibleCols.destination && <TableCell>{r.destination}</TableCell>}
                    {visibleCols.numItems && <TableCell>{r.numItems}</TableCell>}
                    {visibleCols.deliveryStatus && <TableCell>{r.deliveryStatus}</TableCell>}
                    {visibleCols.receiveStatus && <TableCell>{r.receiveStatus}</TableCell>}
                    {visibleCols.deliveryReceiptNo && <TableCell>{r.deliveryReceiptNo ?? "-"}</TableCell>}
                    {visibleCols.consignmentOrder && <TableCell>{r.consignmentOrder ?? "-"}</TableCell>}
                    {visibleCols.approvers && <TableCell>{r.approvers ?? "-"}</TableCell>}
                    {visibleCols.createdBy && <TableCell>{r.createdBy}</TableCell>}
                    {visibleCols.action && (
                      <TableCell
                        className="text-center pr-4"
                        // Prevent row click from triggering when clicking the button
                        onClick={e => e.stopPropagation()}
                      >
                        <Link href={`/inventory/issuance/${r.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div>{`Showing ${total === 0 ? 0 : startIdx + 1} to ${endIdx} of ${total} rows`}</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={String(rowsPerPage)}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10);
                setRowsPerPage(next);
                setPage(1);
              }}
              className="h-8 w-20 rounded-md border bg-transparent px-2 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>{`Page ${page} of ${totalPages}`}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setPage(1)}>«</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setPage(totalPages)}>»</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


