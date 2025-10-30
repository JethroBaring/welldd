"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPurchaseOrders } from "@/lib/api";
import { PurchaseOrder } from "@/types/purchasing";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export default function NewPurchaseInvoicePage() {
  const router = useRouter();
  const [poList, setPoList] = useState<PurchaseOrder[]>([]);
  const [selectedPoId, setSelectedPoId] = useState<string>("");
  const [piDate, setPiDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [piDueDate, setPiDueDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [approver, setApprover] = useState<string>("");
  const [refNo, setRefNo] = useState<string>("");
  const [applyVat, setApplyVat] = useState<boolean>(false);
  const [withholding, setWithholding] = useState<boolean>(false);
  const [debitLines, setDebitLines] = useState(
    [{ id: 1, account: "(1000) - Cash", branch: "Branch B", price: 200 }]
  );
  const [creditLines, setCreditLines] = useState(
    [{ id: 1, account: "(1000) - Cash", branch: "Branch B", price: 20 }]
  );
  const [charges, setCharges] = useState(
    [
      { id: 1, name: "Delivery Fee", price: 100 },
      { id: 2, name: "", price: 0 },
    ]
  );

  const debitTotal = debitLines.reduce((s, l) => s + (Number(l.price) || 0), 0);
  const creditTotal = creditLines.reduce((s, l) => s + (Number(l.price) || 0), 0);
  const chargesTotal = charges.reduce((s, c) => s + (Number(c.price) || 0), 0);

  useEffect(() => {
    (async () => {
      const pos = await getPurchaseOrders();
      setPoList(pos);
    })();
  }, []);

  const selectedPo = useMemo(() => poList.find((p) => p.id === selectedPoId), [poList, selectedPoId]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/purchasing/invoices")}
        className="mb-4"
      >
        {/* using lucide-react ArrowLeft in other pages; reuse text style */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Back to Invoices
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">Purchase Invoice</h1>
        <p className="text-sm text-muted-foreground">New</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">PO Reference *</label>
          <Select value={selectedPoId} onValueChange={setSelectedPoId}>
            <SelectTrigger>
              <SelectValue placeholder="Select PO Reference" />
            </SelectTrigger>
            <SelectContent>
              {poList.map((po) => (
                <SelectItem value={po.id} key={po.id}>{`${po.poNumber} — ${po.supplier.name}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">PI Date *</label>
          <Input type="date" value={piDate} onChange={(e) => setPiDate(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Approver *</label>
          <Select value={approver} onValueChange={setApprover}>
            <SelectTrigger>
              <SelectValue placeholder="Select approver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finance Admin">Finance Admin</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Admin Staff">Admin Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Ref No. *</label>
          <Input placeholder="Enter supplier invoice number" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">PI Due Date *</label>
          <Input type="date" value={piDueDate} onChange={(e) => setPiDueDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Checkbox id="vat" checked={applyVat} onCheckedChange={(v) => setApplyVat(!!v)} />
            <div>
              <label htmlFor="vat" className="text-sm font-medium">VAT (12%)</label>
              <div className="text-xs text-muted-foreground">Apply 12% VAT to this invoice</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="wht" checked={withholding} onCheckedChange={(v) => setWithholding(!!v)} />
            <div>
              <label htmlFor="wht" className="text-sm font-medium">Withholding Tax</label>
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
                {selectedPo?.items?.length ? (
                  selectedPo.items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="pl-4">{it.itemName}</TableCell>
                      <TableCell>{it.quantity}</TableCell>
                      <TableCell>{it.unit}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>{it.unitPrice?.toFixed?.(2) ?? "-"}</TableCell>
                      <TableCell>{it.discount ?? 0}</TableCell>
                      <TableCell className="text-right pr-4">0.00</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No items available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="charges" className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Charges</span>
            <span className="text-muted-foreground">Total Charges: {chargesTotal.toFixed(2)}</span>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Charge</TableHead>
                  <TableHead className="text-center pr-4">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <Select
                        value={row.name}
                        onValueChange={(v) =>
                          setCharges((prev) => prev.map((c) => (c.id === row.id ? { ...c, name: v } : c)))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select charge..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Delivery Fee">Delivery Fee</SelectItem>
                          <SelectItem value="Handling Fee">Handling Fee</SelectItem>
                          <SelectItem value="Other Charge">Other Charge</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={row.price as number}
                          onChange={(e) =>
                            setCharges((prev) => prev.map((c) => (c.id === row.id ? { ...c, price: Number(e.target.value) } : c)))
                          }
                          className="h-8 w-40 text-right"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setCharges((prev) => prev.filter((c) => c.id !== row.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <button
            className="text-sm text-orange-600"
            type="button"
            onClick={() => setCharges((prev) => [...prev, { id: Date.now(), name: "", price: 0 }])}
          >
            Add Charge
          </button>
        </TabsContent>
        <TabsContent value="journal" className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Journal Debit Value</span>
              <span className="text-muted-foreground">Debit Total: {debitTotal.toFixed(2)}</span>
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
                  {debitLines.map((row) => {
                    const invalid = !row.price || Number(row.price) <= 0;
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="pl-4">
                          <Select
                            value={row.account}
                            onValueChange={(v) =>
                              setDebitLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, account: v } : r)))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="(1000) - Cash">(1000) - Cash</SelectItem>
                              <SelectItem value="(2000) - Payable">(2000) - Payable</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={row.branch}
                            onValueChange={(v) =>
                              setDebitLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, branch: v } : r)))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Branch A">Branch A</SelectItem>
                              <SelectItem value="Branch B">Branch B</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              value={row.price as number}
                              onChange={(e) =>
                                setDebitLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, price: Number(e.target.value) } : r)))
                              }
                              className="h-8 w-40 text-right"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDebitLines((prev) => prev.filter((r) => r.id !== row.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {invalid && (
                            <div className="text-xs text-red-500 mt-1">Price must be greater than 0</div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <button
              className="text-sm text-orange-600"
              type="button"
              onClick={() =>
                setDebitLines((prev) => [
                  ...prev,
                  { id: Date.now(), account: "(1000) - Cash", branch: "Branch B", price: 0 },
                ])
              }
            >
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Journal Credit Value</span>
              <span className="text-muted-foreground">Credit Total: {creditTotal.toFixed(2)}</span>
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
                  {creditLines.map((row) => {
                    const invalid = !row.price || Number(row.price) <= 0;
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="pl-4">
                          <Select
                            value={row.account}
                            onValueChange={(v) =>
                              setCreditLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, account: v } : r)))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="(1000) - Cash">(1000) - Cash</SelectItem>
                              <SelectItem value="(2000) - Payable">(2000) - Payable</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={row.branch}
                            onValueChange={(v) =>
                              setCreditLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, branch: v } : r)))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Branch A">Branch A</SelectItem>
                              <SelectItem value="Branch B">Branch B</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              value={row.price as number}
                              onChange={(e) =>
                                setCreditLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, price: Number(e.target.value) } : r)))
                              }
                              className="h-8 w-40 text-right"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setCreditLines((prev) => prev.filter((r) => r.id !== row.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {invalid && (
                            <div className="text-xs text-red-500 mt-1">Price must be greater than 0</div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <button
              className="text-sm text-orange-600" type="button"
              onClick={() =>
                setCreditLines((prev) => [
                  ...prev,
                  { id: Date.now(), account: "(1000) - Cash", branch: "Branch B", price: 0 },
                ])
              }
            >
              Add Item
            </button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/purchasing/invoices">Cancel</Link>
        </Button>
        <Button>Save Invoice</Button>
      </div>
    </div>
  );
}


