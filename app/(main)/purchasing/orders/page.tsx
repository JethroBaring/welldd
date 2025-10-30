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
import { getPurchaseOrders, getWarehouseReceivingReports, getPurchaseInvoices } from "@/lib/api";
import { PurchaseOrder, WarehouseReceivingReport, PurchaseInvoice } from "@/types/purchasing";
import { format } from "date-fns";
import { Eye, Plus, Search, Edit, Trash2, SlidersHorizontal, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCols, setVisibleCols] = useState({
    poNumber: true,
    prNumber: true,
    date: true,
    supplier: true,
    items: true,
    total: true,
    status: true,
    wrrStatus: true,
    piStatus: true,
  });
  const [wrrs, setWrrs] = useState<WarehouseReceivingReport[]>([]);
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleExport = () => {
    const headers: { key: string; label: string }[] = [];
    if (visibleCols.poNumber) headers.push({ key: "poNumber", label: "PO No." });
    if (visibleCols.prNumber) headers.push({ key: "prNumber", label: "PR No." });
    if (visibleCols.date) headers.push({ key: "date", label: "PO Date" });
    if (visibleCols.supplier) headers.push({ key: "supplier", label: "Supplier" });
    if (visibleCols.items) headers.push({ key: "items", label: "Items" });
    if (visibleCols.total) headers.push({ key: "total", label: "Total Amount" });
    if (visibleCols.status) headers.push({ key: "status", label: "PO Status" });
    if (visibleCols.wrrStatus) headers.push({ key: "wrrStatus", label: "WRR status" });
    if (visibleCols.piStatus) headers.push({ key: "piStatus", label: "PI status" });

    const rows = filteredOrders.map((o) =>
      headers.map(({ key }) => {
        switch (key) {
          case "supplier":
            return o.supplier?.name ?? "";
          case "items":
            return String(o.items.length);
          case "date":
            return format(new Date(o.date), "yyyy-MM-dd");
          case "total":
            return String(o.total);
          default:
            // @ts-ignore
            return o[key] == null ? "" : String(o[key]);
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
    a.download = "purchase_orders.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const [data, wData, piData] = await Promise.all([
        getPurchaseOrders(),
        getWarehouseReceivingReports(),
        getPurchaseInvoices(),
      ]);
      setOrders(data);
      setFilteredOrders(data);
      setWrrs(wData);
      setInvoices(piData);
    } catch (error) {
      console.error("Failed to load purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.poNumber.toLowerCase().includes(query) ||
        order.supplier.name.toLowerCase().includes(query) ||
        (order.prNumber && order.prNumber.toLowerCase().includes(query))
    );
    setFilteredOrders(filtered);
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
          <h1 className="text-2xl font-semibold">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage purchase orders to suppliers
          </p>
        </div>
        {permissions.canCreatePO && (
          <Link href="/purchasing/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search by PO number, PR number, or supplier..."
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
                ["poNumber", "PO No."],
                ["prNumber", "PR No."],
                ["date", "PO Date"],
                ["supplier", "Supplier"],
                ["items", "Items"],
                ["total", "Total Amount"],
                ["status", "PO Status"],
                ["wrrStatus", "WRR status"],
                ["piStatus", "PI status"],
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
              {visibleCols.poNumber && <TableHead className="pl-4">PO Number</TableHead>}
              {visibleCols.prNumber && <TableHead>PR Number</TableHead>}
              {visibleCols.date && <TableHead>PO Date</TableHead>}
              {visibleCols.supplier && <TableHead>Supplier</TableHead>}
              {visibleCols.items && <TableHead>Items</TableHead>}
              {visibleCols.total && <TableHead>Total Amount</TableHead>}
              {visibleCols.status && <TableHead>PO Status</TableHead>}
              {visibleCols.wrrStatus && <TableHead>WRR status</TableHead>}
              {visibleCols.piStatus && <TableHead>PI status</TableHead>}
              <TableHead className="text-center pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={
                  1 +
                  [
                    visibleCols.poNumber,
                    visibleCols.prNumber,
                    visibleCols.date,
                    visibleCols.supplier,
                    visibleCols.items,
                    visibleCols.total,
                    visibleCols.status,
                    visibleCols.wrrStatus,
                    visibleCols.piStatus,
                  ].filter(Boolean).length
                } className="text-center py-8 text-muted-foreground">
                  No purchase orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders
                .slice((page - 1) * rowsPerPage, Math.min(filteredOrders.length, (page - 1) * rowsPerPage + rowsPerPage))
                .map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/purchasing/orders/${order.id}`}
                >
                  {visibleCols.poNumber && (
                    <TableCell className="font-medium pl-4">{order.poNumber}</TableCell>
                  )}
                  {visibleCols.prNumber && (
                    <TableCell>{order.prNumber || "-"}</TableCell>
                  )}
                  {visibleCols.date && (
                    <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                  )}
                  {visibleCols.supplier && (
                    <TableCell>{order.supplier.name}</TableCell>
                  )}
                  {visibleCols.items && (
                    <TableCell>{order.items.length} items</TableCell>
                  )}
                  {visibleCols.total && (
                    <TableCell>₱{order.total.toFixed(2)}</TableCell>
                  )}
                  {visibleCols.status && (
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                  )}
                  {visibleCols.wrrStatus && (
                    <TableCell>
                      {wrrs.some((w) => w.poId === order.id && w.status === "completed") ? "Received" : "Unreceived"}
                    </TableCell>
                  )}
                  {visibleCols.piStatus && (
                    <TableCell>
                      {invoices.some((pi) => pi.poNumber === order.poNumber) ? "Invoiced" : "Not invoiced"}
                    </TableCell>
                  )}
                  <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/purchasing/orders/${order.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit purchase order</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete purchase order ${order.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete purchase order</span>
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
          const total = filteredOrders.length;
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
            const total = filteredOrders.length;
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

