"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type IssuanceForDelivery = {
  id: string;
  issuanceNo: string;
  issuanceDate: string; // ISO
  issuanceType: string;
  source: string;
  destination: string;
};

type DeliveryRow = {
  id: string;
  deliveryNo: string;
  deliveryDate: string; // ISO
  status: string;
  numIssuances: number;
  assignedPersonnel?: string;
  createdBy: string;
};

const mockIssuances: IssuanceForDelivery[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `IFD-${i + 1}`,
  issuanceNo: `SI-2025-${String(i + 21).padStart(3, "0")}`,
  issuanceDate: new Date(2025, 1, 1 + i).toISOString(),
  issuanceType: i % 2 === 0 ? "Inter-warehouse" : "Consignment",
  source: i % 2 === 0 ? "Main Warehouse" : "Clinic B",
  destination: i % 2 === 0 ? "Clinic B" : "Main Warehouse",
}));

const mockDeliveries: DeliveryRow[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `DLV-${i + 1}`,
  deliveryNo: `DLV-2025-${String(i + 1).padStart(3, "0")}`,
  deliveryDate: new Date(2025, 1, 5 + i).toISOString(),
  status: i % 3 === 0 ? "scheduled" : i % 3 === 1 ? "in transit" : "delivered",
  numIssuances: (i % 4) + 1,
  assignedPersonnel: i % 2 === 0 ? "R. Santos" : "M. Dizon",
  createdBy: i % 2 === 0 ? "mgarcia" : "tlopez",
}));

export default function DeliveriesPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("issuances");
  // Issuances for delivery state
  const [ifdRows, setIfdRows] = useState<IssuanceForDelivery[]>([]);
  const [ifdSearch, setIfdSearch] = useState("");
  const [ifdPage, setIfdPage] = useState(1);
  const [ifdRowsPerPage, setIfdRowsPerPage] = useState(10);
  const [ifdVisible, setIfdVisible] = useState({
    issuanceNo: true,
    issuanceDate: true,
    issuanceType: true,
    source: true,
    destination: true,
    action: true,
  });
  // Deliveries state
  const [dlvRows, setDlvRows] = useState<DeliveryRow[]>([]);
  const [dlvSearch, setDlvSearch] = useState("");
  const [dlvPage, setDlvPage] = useState(1);
  const [dlvRowsPerPage, setDlvRowsPerPage] = useState(10);
  const [dlvVisible, setDlvVisible] = useState({
    deliveryNo: true,
    deliveryDate: true,
    status: true,
    numIssuances: true,
    assignedPersonnel: true,
    createdBy: true,
    action: true,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 300));
        setIfdRows(mockIssuances);
        setDlvRows(mockDeliveries);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ifdFiltered = useMemo(() => {
    const q = ifdSearch.trim().toLowerCase();
    if (!q) return ifdRows;
    return ifdRows.filter((r) =>
      [r.issuanceNo, r.issuanceType, r.source, r.destination]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [ifdRows, ifdSearch]);

  const dlvFiltered = useMemo(() => {
    const q = dlvSearch.trim().toLowerCase();
    if (!q) return dlvRows;
    return dlvRows.filter((r) =>
      [r.deliveryNo, r.status, r.assignedPersonnel ?? "", r.createdBy]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [dlvRows, dlvSearch]);

  useEffect(() => setIfdPage(1), [ifdSearch, ifdRowsPerPage]);
  useEffect(() => setDlvPage(1), [dlvSearch, dlvRowsPerPage]);

  const exportIfd = () => {
    const headers: { key: keyof IssuanceForDelivery; label: string }[] = [];
    if (ifdVisible.issuanceNo) headers.push({ key: "issuanceNo", label: "Issuance No." });
    if (ifdVisible.issuanceDate) headers.push({ key: "issuanceDate", label: "Issuance Date" });
    if (ifdVisible.issuanceType) headers.push({ key: "issuanceType", label: "Issuance Type" });
    if (ifdVisible.source) headers.push({ key: "source", label: "Source" });
    if (ifdVisible.destination) headers.push({ key: "destination", label: "Destination" });

    const rows = ifdFiltered.map((r) =>
      headers.map(({ key }) => {
        const v = r[key];
        if (key === "issuanceDate") return format(new Date(r.issuanceDate), "yyyy-MM-dd");
        return v == null ? "" : String(v);
      })
    );
    const csv = [
      headers.map((h) => h.label).join(","),
      ...rows.map((row) => row.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "issuances_for_delivery.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportDlv = () => {
    const headers: { key: keyof DeliveryRow; label: string }[] = [];
    if (dlvVisible.deliveryNo) headers.push({ key: "deliveryNo", label: "Delivery No." });
    if (dlvVisible.deliveryDate) headers.push({ key: "deliveryDate", label: "Delivery Date" });
    if (dlvVisible.status) headers.push({ key: "status", label: "Status" });
    if (dlvVisible.numIssuances) headers.push({ key: "numIssuances", label: "Number of Issuances" });
    if (dlvVisible.assignedPersonnel) headers.push({ key: "assignedPersonnel", label: "Assigned Delivery Personnel" });
    if (dlvVisible.createdBy) headers.push({ key: "createdBy", label: "Created By" });

    const rows = dlvFiltered.map((r) =>
      headers.map(({ key }) => {
        const v = r[key];
        if (key === "deliveryDate") return format(new Date(r.deliveryDate), "yyyy-MM-dd");
        return v == null ? "" : String(v);
      })
    );
    const csv = [
      headers.map((h) => h.label).join(","),
      ...rows.map((row) => row.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deliveries.csv";
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

  // Pagination calcs
  const ifdTotal = ifdFiltered.length;
  const ifdStart = (ifdPage - 1) * ifdRowsPerPage;
  const ifdEnd = Math.min(ifdTotal, ifdStart + ifdRowsPerPage);
  const ifdPageRows = ifdFiltered.slice(ifdStart, ifdEnd);
  const ifdTotalPages = Math.max(1, Math.ceil(ifdTotal / ifdRowsPerPage));

  const dlvTotal = dlvFiltered.length;
  const dlvStart = (dlvPage - 1) * dlvRowsPerPage;
  const dlvEnd = Math.min(dlvTotal, dlvStart + dlvRowsPerPage);
  const dlvPageRows = dlvFiltered.slice(dlvStart, dlvEnd);
  const dlvTotalPages = Math.max(1, Math.ceil(dlvTotal / dlvRowsPerPage));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Deliveries</h1>
          <p className="text-sm text-muted-foreground">Assign and track deliveries of stock issuances</p>
        </div>
        <Link href="/inventory/issuance/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Stock Issuance
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="issuances">Stock Issuance for Delivery</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="issuances" className="mt-4 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search by issuance no., type, source, destination..."
                value={ifdSearch}
                onChange={(e) => setIfdSearch(e.target.value)}
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
                    ["issuanceNo", "Issuance No."],
                    ["issuanceDate", "Issuance Date"],
                    ["issuanceType", "Issuance Type"],
                    ["source", "Source"],
                    ["destination", "Destination"],
                    ["action", "Action"],
                  ] as [keyof typeof ifdVisible, string][]).map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={(ifdVisible as any)[key]}
                      onCheckedChange={(val) => setIfdVisible((p) => ({ ...p, [key]: !!val }))}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={exportIfd}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {ifdVisible.issuanceNo && <TableHead className="pl-4">Issuance No.</TableHead>}
                  {ifdVisible.issuanceDate && <TableHead>Issuance Date</TableHead>}
                  {ifdVisible.issuanceType && <TableHead>Issuance Type</TableHead>}
                  {ifdVisible.source && <TableHead>Source</TableHead>}
                  {ifdVisible.destination && <TableHead>Destination</TableHead>}
                  {ifdVisible.action && <TableHead className="text-center pr-4">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ifdPageRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={[
                        ifdVisible.issuanceNo,
                        ifdVisible.issuanceDate,
                        ifdVisible.issuanceType,
                        ifdVisible.source,
                        ifdVisible.destination,
                        ifdVisible.action,
                      ].filter(Boolean).length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No issuances found
                    </TableCell>
                  </TableRow>
                ) : (
                  ifdPageRows.map((r) => (
                    <TableRow key={r.id}>
                      {ifdVisible.issuanceNo && (
                        <TableCell className="pl-4 font-medium">{r.issuanceNo}</TableCell>
                      )}
                      {ifdVisible.issuanceDate && (
                        <TableCell>{format(new Date(r.issuanceDate), "MMM dd, yyyy")}</TableCell>
                      )}
                      {ifdVisible.issuanceType && <TableCell>{r.issuanceType}</TableCell>}
                      {ifdVisible.source && <TableCell>{r.source}</TableCell>}
                      {ifdVisible.destination && <TableCell>{r.destination}</TableCell>}
                      {ifdVisible.action && (
                        <TableCell className="text-center pr-4">
                          <Link href={`/inventory/issuance/${r.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
            <div>{`Showing ${ifdTotal === 0 ? 0 : ifdStart + 1} to ${ifdEnd} of ${ifdTotal} rows`}</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={String(ifdRowsPerPage)}
                  onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    setIfdRowsPerPage(next);
                    setIfdPage(1);
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
                <span>{`Page ${ifdPage} of ${Math.max(1, Math.ceil(ifdTotal / ifdRowsPerPage))}`}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={ifdPage <= 1} onClick={() => setIfdPage(1)}>«</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={ifdPage <= 1} onClick={() => setIfdPage((p) => Math.max(1, p - 1))}>‹</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={ifdPage >= ifdTotalPages} onClick={() => setIfdPage((p) => p + 1)}>›</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={ifdPage >= ifdTotalPages} onClick={() => setIfdPage(ifdTotalPages)}>»</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="mt-4 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search by delivery no., status, personnel..."
                value={dlvSearch}
                onChange={(e) => setDlvSearch(e.target.value)}
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
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {([
                    ["deliveryNo", "Delivery No."],
                    ["deliveryDate", "Delivery Date"],
                    ["status", "Status"],
                    ["numIssuances", "Number of Issuances"],
                    ["assignedPersonnel", "Assigned Delivery Personnel"],
                    ["createdBy", "Created By"],
                    ["action", "Action"],
                  ] as [keyof typeof dlvVisible, string][]).map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={(dlvVisible as any)[key]}
                      onCheckedChange={(val) => setDlvVisible((p) => ({ ...p, [key]: !!val }))}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={exportDlv}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {dlvVisible.deliveryNo && <TableHead className="pl-4">Delivery No</TableHead>}
                  {dlvVisible.deliveryDate && <TableHead>Delivery Date</TableHead>}
                  {dlvVisible.status && <TableHead>Status</TableHead>}
                  {dlvVisible.numIssuances && <TableHead>Number of Issuances</TableHead>}
                  {dlvVisible.assignedPersonnel && <TableHead>Assigned Delivery Personnel</TableHead>}
                  {dlvVisible.createdBy && <TableHead>Created By</TableHead>}
                  {dlvVisible.action && <TableHead className="text-center pr-4">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dlvPageRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={[
                        dlvVisible.deliveryNo,
                        dlvVisible.deliveryDate,
                        dlvVisible.status,
                        dlvVisible.numIssuances,
                        dlvVisible.assignedPersonnel,
                        dlvVisible.createdBy,
                        dlvVisible.action,
                      ].filter(Boolean).length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No deliveries found
                    </TableCell>
                  </TableRow>
                ) : (
                  dlvPageRows.map((r) => (
                    <TableRow key={r.id}>
                      {dlvVisible.deliveryNo && (
                        <TableCell className="pl-4 font-medium">{r.deliveryNo}</TableCell>
                      )}
                      {dlvVisible.deliveryDate && (
                        <TableCell>{format(new Date(r.deliveryDate), "MMM dd, yyyy")}</TableCell>
                      )}
                      {dlvVisible.status && <TableCell>{r.status}</TableCell>}
                      {dlvVisible.numIssuances && <TableCell>{r.numIssuances}</TableCell>}
                      {dlvVisible.assignedPersonnel && <TableCell>{r.assignedPersonnel ?? "-"}</TableCell>}
                      {dlvVisible.createdBy && <TableCell>{r.createdBy}</TableCell>}
                      {dlvVisible.action && (
                        <TableCell className="text-center pr-4">
                          <Link href={`/inventory/deliveries/${r.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
            <div>{`Showing ${dlvTotal === 0 ? 0 : dlvStart + 1} to ${dlvEnd} of ${dlvTotal} rows`}</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={String(dlvRowsPerPage)}
                  onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    setDlvRowsPerPage(next);
                    setDlvPage(1);
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
                <span>{`Page ${dlvPage} of ${Math.max(1, Math.ceil(dlvTotal / dlvRowsPerPage))}`}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={dlvPage <= 1} onClick={() => setDlvPage(1)}>«</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={dlvPage <= 1} onClick={() => setDlvPage((p) => Math.max(1, p - 1))}>‹</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={dlvPage >= dlvTotalPages} onClick={() => setDlvPage((p) => p + 1)}>›</Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={dlvPage >= dlvTotalPages} onClick={() => setDlvPage(dlvTotalPages)}>»</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


