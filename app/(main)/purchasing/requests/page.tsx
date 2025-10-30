"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { getPurchaseRequests } from "@/lib/api";
import { PurchaseRequest } from "@/types/purchasing";
import { format } from "date-fns";
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, SlidersHorizontal, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

export default function PurchaseRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCols, setVisibleCols] = useState({
    prNumber: true,
    prDate: true,
    department: true,
    costCenter: true,
    items: true,
    approvers: true,
    requestedBy: true,
    status: true,
  });

  const handleExport = () => {
    const headers: { key: keyof PurchaseRequest | "itemsCount"; label: string }[] = [];
    if (visibleCols.prNumber) headers.push({ key: "prNumber", label: "PR No." });
    if (visibleCols.prDate) headers.push({ key: "date", label: "PR Date" });
    if (visibleCols.department) headers.push({ key: "requestingDepartment", label: "Department" });
    if (visibleCols.costCenter) headers.push({ key: "costCenter", label: "Cost Center" });
    if (visibleCols.items) headers.push({ key: "itemsCount", label: "Total Items" });
    if (visibleCols.approvers) headers.push({ key: "approvedBy", label: "Approvers" });
    if (visibleCols.requestedBy) headers.push({ key: "requestedBy", label: "Requested By" });
    if (visibleCols.status) headers.push({ key: "status", label: "Status" });

    const rows = filteredRequests.map((r) =>
      headers.map(({ key }) => {
        if (key === "itemsCount") return String(r.items.length);
        const value = r[key as keyof PurchaseRequest];
        if (value instanceof Date) return format(value, "yyyy-MM-dd");
        if (key === "date") return format(new Date(r.date), "yyyy-MM-dd");
        return value == null ? "" : String(value);
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
    a.download = "purchase_requests.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, requests]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Failed to load purchase requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (!searchQuery.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = requests.filter(
      (req) =>
        req.prNumber.toLowerCase().includes(query) ||
        req.requestingDepartment.toLowerCase().includes(query) ||
        req.costCenter.toLowerCase().includes(query) ||
        req.requestedBy.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
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
          <h1 className="text-2xl font-semibold">Purchase Requests</h1>
          <p className="text-sm text-muted-foreground">
            Manage purchase requests for medicines and supplies
          </p>
        </div>
        {permissions.canCreatePR && (
          <Link href="/purchasing/requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search by PR number, department, or requester..."
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
                ["prNumber", "PR No."],
                ["prDate", "PR Date"],
                ["department", "Department"],
                ["costCenter", "Cost Center"],
                ["items", "Total Items"],
                ["approvers", "Approvers"],
                ["requestedBy", "Requested By"],
                ["status", "Status"],
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
              <TableHead className="w-6 pl-4" />
              {visibleCols.prNumber && <TableHead className="">PR Number</TableHead>}
              {visibleCols.prDate && <TableHead>PR date</TableHead>}
              {visibleCols.department && <TableHead>Department</TableHead>}
              {visibleCols.costCenter && <TableHead>Cost Center</TableHead>}
              {visibleCols.items && <TableHead>Items</TableHead>}
              {visibleCols.requestedBy && <TableHead>Requested By</TableHead>}
              {visibleCols.approvers && <TableHead>Approvers</TableHead>}
              {visibleCols.status && <TableHead>Status</TableHead>}
              <TableHead className="text-center pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={
                  2 +
                  [
                    visibleCols.prNumber,
                    visibleCols.prDate,
                    visibleCols.department,
                    visibleCols.costCenter,
                    visibleCols.items,
                    visibleCols.approvers,
                    visibleCols.requestedBy,
                    visibleCols.status,
                  ].filter(Boolean).length
                } className="text-center py-8 text-muted-foreground">
                  No purchase requests found
                </TableCell>
              </TableRow>
            ) : (
              // paginate
              (() => {})(),
              filteredRequests
                .slice((page - 1) * rowsPerPage, Math.min(filteredRequests.length, (page - 1) * rowsPerPage + rowsPerPage))
                .map((request) => {
                const isExpanded = !!expanded[request.id];
                return (
                  <React.Fragment key={request.id}>
                    <TableRow
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/purchasing/requests/${request.id}`)}
                    >
                      <TableCell className="p-0 align-middle w-6 pl-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 transition-colors"
                          aria-label={isExpanded ? "Collapse row" : "Expand row"}
                          aria-expanded={isExpanded}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((prev) => ({
                              ...prev,
                              [request.id]: !prev[request.id],
                            }));
                          }}
                        >
                          <span className="inline-flex items-center justify-center">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 transition-transform" />
                            ) : (
                              <ChevronRight className="h-4 w-4 transition-transform" />
                            )}
                          </span>
                        </Button>
                      </TableCell>
                      {visibleCols.prNumber && (
                        <TableCell className="font-medium">
                          <Link href={`/purchasing/requests/${request.id}`}>{request.prNumber}</Link>
                        </TableCell>
                      )}
                      {visibleCols.prDate && (
                        <TableCell>{format(new Date(request.date), "MMM dd, yyyy")}</TableCell>
                      )}
                      {visibleCols.department && (
                        <TableCell>{request.requestingDepartment}</TableCell>
                      )}
                      {visibleCols.costCenter && (
                        <TableCell>{request.costCenter}</TableCell>
                      )}
                      {visibleCols.items && (
                        <TableCell>{request.items.length} items</TableCell>
                      )}
                      {visibleCols.requestedBy && (
                        <TableCell>{request.requestedBy}</TableCell>
                      )}
                      {visibleCols.approvers && (
                        <TableCell>{request.approvedBy ?? "-"}</TableCell>
                      )}
                      {visibleCols.status && (
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                      )}
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/purchasing/requests/${request.id}/edit`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit request</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement delete functionality
                              console.log(`Delete purchase request ${request.id}`);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete request</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={
                          2 +
                          [
                            visibleCols.prNumber,
                            visibleCols.prDate,
                            visibleCols.department,
                            visibleCols.costCenter,
                            visibleCols.items,
                            visibleCols.approvers,
                            visibleCols.requestedBy,
                            visibleCols.status,
                          ].filter(Boolean).length
                        }>
                          <div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Unit</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {request.items.map((it) => (
                                  <TableRow key={it.id}>
                                    <TableCell className="font-medium">{it.itemName}</TableCell>
                                    <TableCell>{it.quantity}</TableCell>
                                    <TableCell>{it.unit}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        {(() => {
          const total = filteredRequests.length;
          const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
          const end = Math.min(total, page * rowsPerPage);
          return (
            <div>
              {`Showing ${start} to ${end} of ${total} rows`}
            </div>
          );
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
            const total = filteredRequests.length;
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

