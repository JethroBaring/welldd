"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getPurchaseInvoices } from "@/lib/api";
import { PurchaseInvoice } from "@/types/purchasing";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PurchaseInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await getPurchaseInvoices();
      const found = list.find((i) => i.id === params.id) || null;
      setInvoice(found);
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return <div className="container mx-auto py-6">Invoice not found.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/invoices")}
        className="mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Back to Invoices
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">Purchase Invoice</h1>
        <p className="text-sm text-muted-foreground">{invoice.piNumber}</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-medium">PI Date</div>
          <div>{format(new Date(invoice.date), "MMM dd, yyyy")}</div>
        </div>
        <div>
          <div className="text-sm font-medium">PI Due Date</div>
          <div>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Status</div>
          <div>{invoice.status}</div>
        </div>
        <div>
          <div className="text-sm font-medium">CV Status</div>
          <div>{invoice.cvStatus}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Supplier</div>
          <div>{invoice.supplier.name}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Ref No.</div>
          <div>{invoice.refNumber ?? "-"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">PO No.</div>
          <div>{invoice.poNumber ?? "-"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Amount Due</div>
          <div>₱{invoice.amountDue.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Created By</div>
          <div>{invoice.createdBy}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Approver</div>
          <div>{invoice.approver ?? "-"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 rounded-sm border border-input" />
            <div>
              <div className="text-sm font-medium">VAT (12%)</div>
              <div className="text-xs text-muted-foreground">Apply 12% VAT to this invoice</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 rounded-sm border border-input" />
            <div>
              <div className="text-sm font-medium">Withholding Tax</div>
              <div className="text-xs text-muted-foreground">No withholding tax rate set for this supplier</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="journal">Journal Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Quantity Received</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Disc. %</TableHead>
                  <TableHead className="text-center pr-4">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No items available.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="charges">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Charge</TableHead>
                  <TableHead className="text-center pr-4">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No charges configured.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="journal" className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Journal Debit Value</span>
              <span className="text-muted-foreground">Debit Total: 0.00</span>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Account</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-center pr-4">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No debit lines.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Journal Credit Value</span>
              <span className="text-muted-foreground">Credit Total: 0.00</span>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Account</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-center pr-4">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No credit lines.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


