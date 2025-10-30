"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInventoryTransactions } from "@/lib/api";
import type { InventoryTransaction } from "@/types/inventory";
import { format } from "date-fns";
import { Download, Search, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InventoryMovementPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<InventoryTransaction[]>([]);
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCols, setVisibleCols] = useState({
    datetime: true,
    item: true,
    source: true,
    destination: true,
    transaction: true,
    begQty: true,
    qty: true,
    endQty: true,
    refNo: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getInventoryTransactions();
        setRows(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const t = r.type.replace(/_/g, " ");
      return (
        r.itemName.toLowerCase().includes(q) ||
        (r.referenceNumber || "").toLowerCase().includes(q) ||
        t.includes(q)
      );
    });
  }, [rows, query]);

  const total = filtered.length;
  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = Math.min(total, startIdx + rowsPerPage);
  const pageRows = filtered.slice(startIdx, endIdx);

  const txLabel = (type: InventoryTransaction["type"]) =>
    type
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const deriveSource = (txn: InventoryTransaction) => {
    switch (txn.type) {
      case "warehouse_receiving":
        return "Supplier";
      case "dispense":
        return "Pharmacy";
      case "transfer_in":
        return "External Location";
      case "transfer_out":
        return txn.location;
      case "adjustment":
      case "disposal":
      default:
        return txn.location;
    }
  };

  const deriveDestination = (txn: InventoryTransaction) => {
    switch (txn.type) {
      case "warehouse_receiving":
        return txn.location;
      case "dispense":
        return "Patient/Department";
      case "transfer_in":
        return txn.location;
      case "transfer_out":
        return "External Location";
      case "adjustment":
      case "disposal":
      default:
        return txn.location;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Inventory Movement</h1>
        <p className="text-sm text-muted-foreground">
          Track stock movements across all transactions.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search item, transaction, or ref no..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
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
              {(
                [
                  ["datetime", "Datetime"],
                  ["item", "Item"],
                  ["source", "Source"],
                  ["destination", "Destination"],
                  ["transaction", "Transaction"],
                  ["begQty", "Beg Qty"],
                  ["qty", "Qty"],
                  ["endQty", "End Qty"],
                  ["refNo", "Ref No."],
                ] as [keyof typeof visibleCols, string][]
              ).map(([key, label]) => (
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
          <Button
            variant="outline"
            onClick={() => {
              const headers: { key: keyof typeof visibleCols; label: string }[] = [];
              if (visibleCols.datetime) headers.push({ key: "datetime", label: "Datetime" });
              if (visibleCols.item) headers.push({ key: "item", label: "Item" });
              if (visibleCols.source) headers.push({ key: "source", label: "Source" });
              if (visibleCols.destination) headers.push({ key: "destination", label: "Destination" });
              if (visibleCols.transaction) headers.push({ key: "transaction", label: "Transaction" });
              if (visibleCols.begQty) headers.push({ key: "begQty", label: "Beg Qty" });
              if (visibleCols.qty) headers.push({ key: "qty", label: "Qty" });
              if (visibleCols.endQty) headers.push({ key: "endQty", label: "End Qty" });
              if (visibleCols.refNo) headers.push({ key: "refNo", label: "Ref No." });

              const rowsToExport = filtered.map((r) =>
                headers.map(({ key }) => {
                  switch (key) {
                    case "datetime":
                      return format(new Date(r.date), "yyyy-MM-dd HH:mm");
                    case "item":
                      return r.itemName;
                    case "source":
                      return deriveSource(r);
                    case "destination":
                      return deriveDestination(r);
                    case "transaction":
                      return txLabel(r.type);
                    case "begQty":
                      return String(r.beginningQuantity);
                    case "qty":
                      return String(r.quantity);
                    case "endQty":
                      return String(r.endingQuantity);
                    case "refNo":
                      return r.referenceNumber || "";
                    default:
                      return "";
                  }
                })
              );

              const csv = [
                headers.map((h) => h.label).join(","),
                ...rowsToExport.map((row) =>
                  row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
                ),
              ].join("\n");

              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "inventory_movement.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleCols.datetime && <TableHead className="pl-4">Datetime</TableHead>}
              {visibleCols.item && <TableHead>Item</TableHead>}
              {visibleCols.source && <TableHead>Source</TableHead>}
              {visibleCols.destination && <TableHead>Destination</TableHead>}
              {visibleCols.transaction && <TableHead>Transaction</TableHead>}
              {visibleCols.begQty && <TableHead className="text-right">Beg Qty</TableHead>}
              {visibleCols.qty && <TableHead className="text-right">Qty</TableHead>}
              {visibleCols.endQty && <TableHead className="text-right">End Qty</TableHead>}
              {visibleCols.refNo && <TableHead>Ref No.</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={[
                    visibleCols.datetime,
                    visibleCols.item,
                    visibleCols.source,
                    visibleCols.destination,
                    visibleCols.transaction,
                    visibleCols.begQty,
                    visibleCols.qty,
                    visibleCols.endQty,
                    visibleCols.refNo,
                  ].filter(Boolean).length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((r) => (
                <TableRow
                  key={r.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => window.location.href = `/inventory/movement/${r.id}`}
                >
                  {visibleCols.datetime && (
                    <TableCell className="pl-4 whitespace-nowrap">{format(new Date(r.date), "MMM dd, yyyy HH:mm")}</TableCell>
                  )}
                  {visibleCols.item && (
                    <TableCell className="whitespace-nowrap">{r.itemName}</TableCell>
                  )}
                  {visibleCols.source && (
                    <TableCell className="whitespace-nowrap">{deriveSource(r)}</TableCell>
                  )}
                  {visibleCols.destination && (
                    <TableCell className="whitespace-nowrap">{deriveDestination(r)}</TableCell>
                  )}
                  {visibleCols.transaction && (
                    <TableCell className="whitespace-nowrap">{txLabel(r.type)}</TableCell>
                  )}
                  {visibleCols.begQty && (
                    <TableCell className="text-right tabular-nums">{r.beginningQuantity}</TableCell>
                  )}
                  {visibleCols.qty && (
                    <TableCell className="text-right tabular-nums">{r.quantity}</TableCell>
                  )}
                  {visibleCols.endQty && (
                    <TableCell className="text-right tabular-nums">{r.endingQuantity}</TableCell>
                  )}
                  {visibleCols.refNo && (
                    <TableCell className="whitespace-nowrap">{r.referenceNumber ?? "—"}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        {(() => {
          const start = total === 0 ? 0 : startIdx + 1;
          const end = endIdx;
          return <div>{`Showing ${start} to ${end} of ${total} rows`}</div>;
        })()}
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
          {(() => {
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
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canNext}
                  onClick={() => setPage(Math.ceil(total / rowsPerPage))}
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


