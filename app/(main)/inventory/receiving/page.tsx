"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getPurchaseOrders, getWarehouseReceivingReports } from "@/lib/api";
import type { PurchaseOrder, WarehouseReceivingReport } from "@/types/purchasing";
import { format } from "date-fns";
import { Search, SlidersHorizontal, Download, PackageOpen } from "lucide-react";
import WarehouseReceivingIndex from "../../purchasing/receiving/page";

export default function InventoryWarehouseReceivingPage() {
  const [loading, setLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [wrrs, setWrrs] = useState<WarehouseReceivingReport[]>([]);
  const [pendingPOs, setPendingPOs] = useState<PurchaseOrder[]>([]);
  const [poSearch, setPoSearch] = useState("");
  const [poPage, setPoPage] = useState(1);
  const [poRowsPerPage, setPoRowsPerPage] = useState(10);
  const [poVisibleCols, setPoVisibleCols] = useState({
    poNumber: true,
    poDate: true,
    supplier: true,
    branch: true,
    createdBy: true,
    action: true,
  });

  const filteredPOs = useMemo(() => {
    const query = poSearch.trim().toLowerCase();
    if (!query) return pendingPOs;
    return pendingPOs.filter((po) =>
      po.poNumber.toLowerCase().includes(query) ||
      po.supplier.name.toLowerCase().includes(query) ||
      po.createdBy.toLowerCase().includes(query)
    );
  }, [poSearch, pendingPOs]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [poData, wrrData] = await Promise.all([
          getPurchaseOrders(),
          getWarehouseReceivingReports(),
        ]);
        setPurchaseOrders(poData);
        setWrrs(wrrData);
        const pending = poData.filter(
          (po) =>
            (po.status === "approved" || po.status === "sent") &&
            !wrrData.some((wrr) => wrr.poId === po.id && wrr.status === "completed")
        );
        setPendingPOs(pending);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <h1 className="text-2xl font-semibold">Warehouse Receiving</h1>
        <p className="text-sm text-muted-foreground">Receive and verify delivered purchase orders, and review past receivings.</p>
      </div>

      <Tabs defaultValue="po" className="w-full">
        <TabsList>
          <TabsTrigger value="po">Purchase Orders to Receive</TabsTrigger>
          <TabsTrigger value="wrr">Warehouse Receivings</TabsTrigger>
        </TabsList>

        <TabsContent value="po" className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search by PO number, supplier, or created by..."
                value={poSearch}
                onChange={(e) => {
                  setPoSearch(e.target.value);
                  setPoPage(1);
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
                  {([
                    ["poNumber", "PO Number"],
                    ["poDate", "PO Date"],
                    ["supplier", "Supplier"],
                    ["branch", "Branch"],
                    ["createdBy", "Created By"],
                    ["action", "Action"],
                  ] as [keyof typeof poVisibleCols, string][]) .map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={poVisibleCols[key]}
                      onCheckedChange={(val) =>
                        setPoVisibleCols((prev) => ({ ...prev, [key]: !!val }))
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
                  const headers: { key: keyof typeof poVisibleCols; label: string }[] = [];
                  if (poVisibleCols.poNumber) headers.push({ key: "poNumber", label: "PO Number" });
                  if (poVisibleCols.poDate) headers.push({ key: "poDate", label: "PO Date" });
                  if (poVisibleCols.supplier) headers.push({ key: "supplier", label: "Supplier" });
                  if (poVisibleCols.branch) headers.push({ key: "branch", label: "Branch" });
                  if (poVisibleCols.createdBy) headers.push({ key: "createdBy", label: "Created By" });

                  const rows = filteredPOs.map((po) =>
                    headers.map(({ key }) => {
                      switch (key) {
                        case "poDate":
                          return format(new Date(po.date), "yyyy-MM-dd");
                        case "supplier":
                          return po.supplier?.name ?? "";
                        case "branch":
                          return "—";
                        case "poNumber":
                          return po.poNumber;
                        case "createdBy":
                          return po.createdBy;
                        default:
                          return "";
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
                  a.download = "purchase_orders_to_receive.csv";
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

          {(() => {
            const total = filteredPOs.length;
            const startIdx = (poPage - 1) * poRowsPerPage;
            const endIdx = Math.min(total, startIdx + poRowsPerPage);
            const pageRows = filteredPOs.slice(startIdx, endIdx);

            return (
              <>
                <div className="mt-6 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {poVisibleCols.poNumber && <TableHead className="pl-4">PO Number</TableHead>}
                        {poVisibleCols.poDate && <TableHead>PO Date</TableHead>}
                        {poVisibleCols.supplier && <TableHead>Supplier</TableHead>}
                        {poVisibleCols.branch && <TableHead>Branch</TableHead>}
                        {poVisibleCols.createdBy && <TableHead>Created By</TableHead>}
                        {poVisibleCols.action && <TableHead className="text-center pr-4">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={
                            1 + [
                              poVisibleCols.poNumber,
                              poVisibleCols.poDate,
                              poVisibleCols.supplier,
                              poVisibleCols.branch,
                              poVisibleCols.createdBy,
                              poVisibleCols.action,
                            ].filter(Boolean).length
                          } className="text-center py-8 text-muted-foreground">
                            No purchase orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        pageRows.map((po) => (
                          <TableRow key={po.id}>
                            {poVisibleCols.poNumber && (
                              <TableCell className="pl-4 font-medium">{po.poNumber}</TableCell>
                            )}
                            {poVisibleCols.poDate && (
                              <TableCell>{format(new Date(po.date), "MMM dd, yyyy")}</TableCell>
                            )}
                            {poVisibleCols.supplier && <TableCell>{po.supplier.name}</TableCell>}
                            {poVisibleCols.branch && <TableCell>—</TableCell>}
                            {poVisibleCols.createdBy && <TableCell>{po.createdBy}</TableCell>}
                            {poVisibleCols.action && (
                              <TableCell className="text-center pr-4">
                                <Link href={`/purchasing/receiving/new?po=${po.id}`}>
                                  <Button variant="noHover" size="icon" className="h-8 w-8" aria-label="Start Receiving">
                                    <PackageOpen className="h-4 w-4" />
                                    <span className="sr-only">Start Receiving</span>
                                  </Button>
                                </Link>
                              </TableCell>
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
                        value={String(poRowsPerPage)}
                        onChange={(e) => {
                          const next = parseInt(e.target.value, 10);
                          setPoRowsPerPage(next);
                          setPoPage(1);
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
                      const totalPages = Math.max(1, Math.ceil(total / poRowsPerPage));
                      const canPrev = poPage > 1;
                      const canNext = poPage < totalPages;
                      return (
                        <div className="flex items-center gap-2">
                          <span>{`Page ${poPage} of ${totalPages}`}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setPoPage(1)}>«</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setPoPage((p) => Math.max(1, p - 1))}>‹</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setPoPage((p) => p + 1)}>›</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setPoPage(Math.ceil(total / poRowsPerPage))}>»</Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            );
          })()}
        </TabsContent>

        <TabsContent value="wrr" className="mt-4">
          <div className="-mt-6">
            <WarehouseReceivingIndex />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

