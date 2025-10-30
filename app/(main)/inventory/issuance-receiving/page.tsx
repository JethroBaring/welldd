"use client";

import { useEffect, useMemo, useState } from "react";
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
import { format } from "date-fns";
import { Download, Search, SlidersHorizontal, PackageOpen } from "lucide-react";

type Issuance = {
  id: string;
  issuanceNo: string;
  issuanceDate: Date;
  issuanceType: string;
  source: string;
  destination: string;
  createdBy: string;
};

type IssuanceReceiving = {
  id: string;
  isrNo: string;
  issNo: string;
  dateReceived: Date;
  status: string;
  source: string;
  destination: string;
  approver?: string;
  numItems: number;
  createdBy: string;
};

export default function StockIssuanceReceivingPage() {
  const [loading, setLoading] = useState(true);

  // Mock data for now; replace with API hooks when available
  const [issuancesToReceive, setIssuancesToReceive] = useState<Issuance[]>([]);
  const [issuanceReceivings, setIssuanceReceivings] = useState<IssuanceReceiving[]>([]);

  // Shared search/filters for Issuances to Receive
  const [issSearch, setIssSearch] = useState("");
  const [issPage, setIssPage] = useState(1);
  const [issRowsPerPage, setIssRowsPerPage] = useState(10);
  const [issVisibleCols, setIssVisibleCols] = useState({
    issuanceNo: true,
    issuanceDate: true,
    issuanceType: true,
    source: true,
    destination: true,
    action: true,
  });

  // Search/filters for Stock Issuance Receivings
  const [sirSearch, setSirSearch] = useState("");
  const [sirPage, setSirPage] = useState(1);
  const [sirRowsPerPage, setSirRowsPerPage] = useState(10);
  const [sirVisibleCols, setSirVisibleCols] = useState({
    isrNo: true,
    issNo: true,
    dateReceived: true,
    status: true,
    source: true,
    destination: true,
    approver: true,
    numItems: true,
    createdBy: true,
  });

  useEffect(() => {
    // Simulate async load
    const load = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      // seed some placeholder rows
      setIssuancesToReceive([
        {
          id: "ISS-1",
          issuanceNo: "ISS-2025-001",
          issuanceDate: new Date(),
          issuanceType: "Transfer",
          source: "Main Warehouse",
          destination: "LGU Clinic A",
          createdBy: "alice",
        },
      ]);
      setIssuanceReceivings([
        {
          id: "ISR-1",
          isrNo: "ISR-2025-001",
          issNo: "ISS-2025-001",
          dateReceived: new Date(),
          status: "pending",
          source: "Main Warehouse",
          destination: "LGU Clinic A",
          approver: "john",
          numItems: 4,
          createdBy: "alice",
        },
      ]);
      setLoading(false);
    };
    load();
  }, []);

  const filteredIssuances = useMemo(() => {
    const q = issSearch.trim().toLowerCase();
    if (!q) return issuancesToReceive;
    return issuancesToReceive.filter((row) =>
      row.issuanceNo.toLowerCase().includes(q) ||
      row.issuanceType.toLowerCase().includes(q) ||
      row.source.toLowerCase().includes(q) ||
      row.destination.toLowerCase().includes(q) ||
      row.createdBy.toLowerCase().includes(q)
    );
  }, [issSearch, issuancesToReceive]);

  const filteredReceivings = useMemo(() => {
    const q = sirSearch.trim().toLowerCase();
    if (!q) return issuanceReceivings;
    return issuanceReceivings.filter((row) =>
      row.isrNo.toLowerCase().includes(q) ||
      row.issNo.toLowerCase().includes(q) ||
      row.source.toLowerCase().includes(q) ||
      row.destination.toLowerCase().includes(q) ||
      row.createdBy.toLowerCase().includes(q)
    );
  }, [sirSearch, issuanceReceivings]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Stock Issuance Receiving</h1>
        <p className="text-sm text-muted-foreground">Receive approved stock issuances and review receiving logs.</p>
      </div>

      <Tabs defaultValue="iss" className="w-full">
        <TabsList>
          <TabsTrigger value="iss">Stock Issuances to Receive</TabsTrigger>
          <TabsTrigger value="sir">Stock Issuance Receivings</TabsTrigger>
        </TabsList>

        {/* Issuances to Receive */}
        <TabsContent value="iss" className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search by issuance no., type, source, destination, or creator..."
                value={issSearch}
                onChange={(e) => {
                  setIssSearch(e.target.value);
                  setIssPage(1);
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
                    ["issuanceNo", "Issuance No."],
                    ["issuanceDate", "Issuance Date"],
                    ["issuanceType", "Issuance Type"],
                    ["source", "Source"],
                    ["destination", "Destination"],
                    ["action", "Action"],
                  ] as [keyof typeof issVisibleCols, string][]) .map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={issVisibleCols[key]}
                      onCheckedChange={(val) =>
                        setIssVisibleCols((prev) => ({ ...prev, [key]: !!val }))
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
                  const headers: { key: keyof typeof issVisibleCols; label: string }[] = [];
                  if (issVisibleCols.issuanceNo) headers.push({ key: "issuanceNo", label: "Issuance No." });
                  if (issVisibleCols.issuanceDate) headers.push({ key: "issuanceDate", label: "Issuance Date" });
                  if (issVisibleCols.issuanceType) headers.push({ key: "issuanceType", label: "Issuance Type" });
                  if (issVisibleCols.source) headers.push({ key: "source", label: "Source" });
                  if (issVisibleCols.destination) headers.push({ key: "destination", label: "Destination" });

                  const rows = filteredIssuances.map((r) =>
                    headers.map(({ key }) => {
                      switch (key) {
                        case "issuanceDate":
                          return format(new Date(r.issuanceDate), "yyyy-MM-dd");
                        default:
                          // @ts-ignore
                          return r[key] ?? "";
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
                  a.download = "issuances_to_receive.csv";
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
            const total = filteredIssuances.length;
            const startIdx = (issPage - 1) * issRowsPerPage;
            const endIdx = Math.min(total, startIdx + issRowsPerPage);
            const pageRows = filteredIssuances.slice(startIdx, endIdx);
            return (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {issVisibleCols.issuanceNo && <TableHead className="pl-4">Issuance No.</TableHead>}
                        {issVisibleCols.issuanceDate && <TableHead>Issuance Date</TableHead>}
                        {issVisibleCols.issuanceType && <TableHead>Issuance Type</TableHead>}
                        {issVisibleCols.source && <TableHead>Source</TableHead>}
                        {issVisibleCols.destination && <TableHead>Destination</TableHead>}
                        {issVisibleCols.action && <TableHead className="text-center pr-4">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={
                            1 + [
                              issVisibleCols.issuanceNo,
                              issVisibleCols.issuanceDate,
                              issVisibleCols.issuanceType,
                              issVisibleCols.source,
                              issVisibleCols.destination,
                              issVisibleCols.action,
                            ].filter(Boolean).length
                          } className="text-center py-8 text-muted-foreground">
                            No issuances found
                          </TableCell>
                        </TableRow>
                      ) : (
                        pageRows.map((r) => (
                          <TableRow key={r.id}>
                            {issVisibleCols.issuanceNo && (
                              <TableCell className="pl-4 font-medium">{r.issuanceNo}</TableCell>
                            )}
                            {issVisibleCols.issuanceDate && (
                              <TableCell>{format(new Date(r.issuanceDate), "MMM dd, yyyy")}</TableCell>
                            )}
                            {issVisibleCols.issuanceType && <TableCell>{r.issuanceType}</TableCell>}
                            {issVisibleCols.source && <TableCell>{r.source}</TableCell>}
                            {issVisibleCols.destination && <TableCell>{r.destination}</TableCell>}
                            {issVisibleCols.action && (
                              <TableCell className="text-center pr-4">
                                <Link href={`/inventory/issuance-receiving/new?iss=${r.id}`}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Receive Issuance">
                                    <PackageOpen className="h-4 w-4" />
                                    <span className="sr-only">Receive Issuance</span>
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

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                  {(() => {
                    const start = total === 0 ? 0 : startIdx + 1;
                    const end = endIdx;
                    return <div>{`Showing ${start} to ${end} of ${total} rows`}</div>;
                  })()}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span>Rows per page</span>
                      <select
                        value={String(issRowsPerPage)}
                        onChange={(e) => {
                          const next = parseInt(e.target.value, 10);
                          setIssRowsPerPage(next);
                          setIssPage(1);
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
                      const totalPages = Math.max(1, Math.ceil(total / issRowsPerPage));
                      const canPrev = issPage > 1;
                      const canNext = issPage < totalPages;
                      return (
                        <div className="flex items-center gap-2">
                          <span>{`Page ${issPage} of ${totalPages}`}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setIssPage(1)}>«</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setIssPage((p) => Math.max(1, p - 1))}>‹</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setIssPage((p) => p + 1)}>›</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setIssPage(Math.ceil(total / issRowsPerPage))}>»</Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            );
          })()}
        </TabsContent>

        {/* Stock Issuance Receivings */}
        <TabsContent value="sir" className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search by ISR no., ISS no., source, destination, or creator..."
                value={sirSearch}
                onChange={(e) => {
                  setSirSearch(e.target.value);
                  setSirPage(1);
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
                    ["isrNo", "ISR No"],
                    ["issNo", "ISS No"],
                    ["dateReceived", "Date Received"],
                    ["status", "Status"],
                    ["source", "Source"],
                    ["destination", "Destination"],
                    ["approver", "Approver"],
                    ["numItems", "# of Items"],
                    ["createdBy", "Created By"],
                  ] as [keyof typeof sirVisibleCols, string][]) .map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={sirVisibleCols[key]}
                      onCheckedChange={(val) =>
                        setSirVisibleCols((prev) => ({ ...prev, [key]: !!val }))
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
                  const headers: { key: keyof typeof sirVisibleCols; label: string }[] = [];
                  if (sirVisibleCols.isrNo) headers.push({ key: "isrNo", label: "ISR No" });
                  if (sirVisibleCols.issNo) headers.push({ key: "issNo", label: "ISS No" });
                  if (sirVisibleCols.dateReceived) headers.push({ key: "dateReceived", label: "Date Received" });
                  if (sirVisibleCols.status) headers.push({ key: "status", label: "Status" });
                  if (sirVisibleCols.source) headers.push({ key: "source", label: "Source" });
                  if (sirVisibleCols.destination) headers.push({ key: "destination", label: "Destination" });
                  if (sirVisibleCols.approver) headers.push({ key: "approver", label: "Approver" });
                  if (sirVisibleCols.numItems) headers.push({ key: "numItems", label: "# of Items" });
                  if (sirVisibleCols.createdBy) headers.push({ key: "createdBy", label: "Created By" });

                  const rows = filteredReceivings.map((r) =>
                    headers.map(({ key }) => {
                      switch (key) {
                        case "dateReceived":
                          return format(new Date(r.dateReceived), "yyyy-MM-dd");
                        default:
                          // @ts-ignore
                          return r[key] ?? "";
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
                  a.download = "stock_issuance_receivings.csv";
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
            const total = filteredReceivings.length;
            const startIdx = (sirPage - 1) * sirRowsPerPage;
            const endIdx = Math.min(total, startIdx + sirRowsPerPage);
            const pageRows = filteredReceivings.slice(startIdx, endIdx);
            return (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {sirVisibleCols.isrNo && <TableHead className="pl-4">ISR No</TableHead>}
                        {sirVisibleCols.issNo && <TableHead>ISS No</TableHead>}
                        {sirVisibleCols.dateReceived && <TableHead>Date Received</TableHead>}
                        {sirVisibleCols.status && <TableHead>Status</TableHead>}
                        {sirVisibleCols.source && <TableHead>Source</TableHead>}
                        {sirVisibleCols.destination && <TableHead>Destination</TableHead>}
                        {sirVisibleCols.approver && <TableHead>Approver</TableHead>}
                        {sirVisibleCols.numItems && <TableHead># of Items</TableHead>}
                        {sirVisibleCols.createdBy && <TableHead className="pr-4">Created By</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={
                            1 + [
                              sirVisibleCols.isrNo,
                              sirVisibleCols.issNo,
                              sirVisibleCols.dateReceived,
                              sirVisibleCols.status,
                              sirVisibleCols.source,
                              sirVisibleCols.destination,
                              sirVisibleCols.approver,
                              sirVisibleCols.numItems,
                              sirVisibleCols.createdBy,
                            ].filter(Boolean).length
                          } className="text-center py-8 text-muted-foreground">
                            No receivings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        pageRows.map((r) => (
                          <TableRow key={r.id}>
                            {sirVisibleCols.isrNo && (
                              <TableCell className="pl-4 font-medium">{r.isrNo}</TableCell>
                            )}
                            {sirVisibleCols.issNo && <TableCell>{r.issNo}</TableCell>}
                            {sirVisibleCols.dateReceived && (
                              <TableCell>{format(new Date(r.dateReceived), "MMM dd, yyyy")}</TableCell>
                            )}
                            {sirVisibleCols.status && <TableCell>{r.status}</TableCell>}
                            {sirVisibleCols.source && <TableCell>{r.source}</TableCell>}
                            {sirVisibleCols.destination && <TableCell>{r.destination}</TableCell>}
                            {sirVisibleCols.approver && <TableCell>{r.approver ?? "-"}</TableCell>}
                            {sirVisibleCols.numItems && <TableCell>{r.numItems}</TableCell>}
                            {sirVisibleCols.createdBy && <TableCell className="pr-4">{r.createdBy}</TableCell>}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                  {(() => {
                    const start = total === 0 ? 0 : startIdx + 1;
                    const end = endIdx;
                    return <div>{`Showing ${start} to ${end} of ${total} rows`}</div>;
                  })()}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span>Rows per page</span>
                      <select
                        value={String(sirRowsPerPage)}
                        onChange={(e) => {
                          const next = parseInt(e.target.value, 10);
                          setSirRowsPerPage(next);
                          setSirPage(1);
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
                      const totalPages = Math.max(1, Math.ceil(total / sirRowsPerPage));
                      const canPrev = sirPage > 1;
                      const canNext = sirPage < totalPages;
                      return (
                        <div className="flex items-center gap-2">
                          <span>{`Page ${sirPage} of ${totalPages}`}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setSirPage(1)}>«</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => setSirPage((p) => Math.max(1, p - 1))}>‹</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setSirPage((p) => p + 1)}>›</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => setSirPage(Math.ceil(total / sirRowsPerPage))}>»</Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}


