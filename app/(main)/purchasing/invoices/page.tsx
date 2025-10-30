"use client";

import { useEffect, useState } from "react";
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
import { getPurchaseInvoices } from "@/lib/api";
import { PurchaseInvoice } from "@/types/purchasing";
import { format } from "date-fns";
import { Download, Search, SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function PurchaseInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCols, setVisibleCols] = useState({
    piNo: true,
    piDate: true,
    piDueDate: true,
    status: true,
    cvStatus: true,
    supplier: true,
    refNo: true,
    poNo: true,
    amountDue: true,
    createdBy: true,
    approver: true,
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchQuery, invoices]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    if (!searchQuery.trim()) {
      setFilteredInvoices(invoices);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredInvoices(
      invoices.filter((pi) =>
        [
          pi.piNumber,
          pi.poNumber ?? "",
          pi.refNumber ?? "",
          pi.supplier.name,
          pi.createdBy,
          pi.approver ?? "",
          pi.status,
          pi.cvStatus,
        ]
          .join("|")
          .toLowerCase()
          .includes(q)
      )
    );
  };

  const handleExport = () => {
    const headers: { key: string; label: string }[] = [];
    if (visibleCols.piNo) headers.push({ key: "piNumber", label: "PI No." });
    if (visibleCols.piDate) headers.push({ key: "piDate", label: "PI Date" });
    if (visibleCols.piDueDate) headers.push({ key: "piDueDate", label: "PI Due Date" });
    if (visibleCols.status) headers.push({ key: "status", label: "Status" });
    if (visibleCols.cvStatus) headers.push({ key: "cvStatus", label: "CV Status" });
    if (visibleCols.supplier) headers.push({ key: "supplier", label: "Supplier" });
    if (visibleCols.refNo) headers.push({ key: "refNumber", label: "Ref No." });
    if (visibleCols.poNo) headers.push({ key: "poNumber", label: "PO No." });
    if (visibleCols.amountDue) headers.push({ key: "amountDue", label: "Amount Due" });
    if (visibleCols.createdBy) headers.push({ key: "createdBy", label: "Created By" });
    if (visibleCols.approver) headers.push({ key: "approver", label: "Approver" });

    const rows = filteredInvoices.map((pi) =>
      headers.map(({ key }) => {
        switch (key) {
          case "supplier":
            return pi.supplier?.name ?? "";
          case "piDate":
            return format(new Date(pi.date), "yyyy-MM-dd");
          case "piDueDate":
            return format(new Date(pi.dueDate), "yyyy-MM-dd");
          default:
            // @ts-ignore
            return pi[key] == null ? "" : String(pi[key]);
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
    a.download = "purchase_invoices.csv";
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage purchase invoices</p>
        </div>
        <Link href="/purchasing/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search by PI/PO/Ref/Supplier..."
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
                ["piNo", "PI No."],
                ["piDate", "PI Date"],
                ["piDueDate", "PI Due Date"],
                ["status", "Status"],
                ["cvStatus", "CV Status"],
                ["supplier", "Supplier"],
                ["refNo", "Ref No."],
                ["poNo", "PO No."],
                ["amountDue", "Amount Due"],
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
              {visibleCols.piNo && <TableHead className="pl-4">PI No.</TableHead>}
              {visibleCols.piDate && <TableHead>PI Date</TableHead>}
              {visibleCols.piDueDate && <TableHead>PI Due Date</TableHead>}
              {visibleCols.status && <TableHead>Status</TableHead>}
              {visibleCols.cvStatus && <TableHead>CV Status</TableHead>}
              {visibleCols.supplier && <TableHead>Supplier</TableHead>}
              {visibleCols.refNo && <TableHead>Ref No.</TableHead>}
              {visibleCols.poNo && <TableHead>PO No.</TableHead>}
              {visibleCols.amountDue && <TableHead>Amount Due</TableHead>}
              {visibleCols.createdBy && <TableHead>Created By</TableHead>}
              {visibleCols.approver && <TableHead>Approver</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    [
                      visibleCols.piNo,
                      visibleCols.piDate,
                      visibleCols.piDueDate,
                      visibleCols.status,
                      visibleCols.cvStatus,
                      visibleCols.supplier,
                      visibleCols.refNo,
                      visibleCols.poNo,
                      visibleCols.amountDue,
                      visibleCols.createdBy,
                      visibleCols.approver,
                    ].filter(Boolean).length
                  }
                  className="text-center py-8 text-muted-foreground"
                >
                  No purchase invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices
                .slice(
                  (page - 1) * rowsPerPage,
                  Math.min(filteredInvoices.length, (page - 1) * rowsPerPage + rowsPerPage)
                )
                .map((pi) => (
                  <TableRow
                    key={pi.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/purchasing/invoices/${pi.id}`)}
                  >
                    {visibleCols.piNo && (
                      <TableCell className="font-medium pl-4">{pi.piNumber}</TableCell>
                    )}
                    {visibleCols.piDate && (
                      <TableCell>{format(new Date(pi.date), "MMM dd, yyyy")}</TableCell>
                    )}
                    {visibleCols.piDueDate && (
                      <TableCell>{format(new Date(pi.dueDate), "MMM dd, yyyy")}</TableCell>
                    )}
                    {visibleCols.status && <TableCell>{pi.status}</TableCell>}
                    {visibleCols.cvStatus && <TableCell>{pi.cvStatus}</TableCell>}
                    {visibleCols.supplier && <TableCell>{pi.supplier.name}</TableCell>}
                    {visibleCols.refNo && <TableCell>{pi.refNumber ?? "-"}</TableCell>}
                    {visibleCols.poNo && <TableCell>{pi.poNumber ?? "-"}</TableCell>}
                    {visibleCols.amountDue && (
                      <TableCell>₱{pi.amountDue.toFixed(2)}</TableCell>
                    )}
                    {visibleCols.createdBy && <TableCell>{pi.createdBy}</TableCell>}
                    {visibleCols.approver && <TableCell>{pi.approver ?? "-"}</TableCell>}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        {(() => {
          const total = filteredInvoices.length;
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
            const total = filteredInvoices.length;
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


