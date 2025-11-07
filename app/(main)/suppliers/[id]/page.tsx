"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Pencil,
  Receipt,
  TrendingUp
} from "lucide-react";
import { mockSuppliers } from "@/lib/mock-data/suppliers";
import { mockPurchaseOrders } from "@/lib/mock-data/purchase-orders";
import { Supplier } from "@/types/purchasing";
import { format } from "date-fns";
import { StatusBadge } from "@/components/shared/status-badge";

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplier();
  }, [supplierId]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundSupplier = mockSuppliers.find(s => s.id === supplierId);
      setSupplier(foundSupplier || null);
    } catch (error) {
      console.error("Failed to load supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center text-muted-foreground">Loading supplier details...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto py-6 text-center space-y-4">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-semibold">Supplier Not Found</h2>
        <p className="text-muted-foreground">
          The supplier you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/suppliers")}>
          Back to Suppliers
        </Button>
      </div>
    );
  }

  // Get purchase orders for this supplier
  const supplierOrders = mockPurchaseOrders.filter(po => po.supplierId === supplier.id);
  const totalOrders = supplierOrders.length;
  const totalValue = supplierOrders.reduce((sum, po) => sum + po.total, 0);

  return (
    <div className="mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/suppliers")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Suppliers
      </Button>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{supplier.name}</h1>
            <Button variant="noHover" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Supplier Code: {supplier.code}
          </p>
        </div>
        <Badge variant={supplier.taxType === "VAT" ? "default" : "secondary"}>
          {supplier.taxType}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Purchase orders placed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative order value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Terms</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplier.paymentTerms || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              Standard payment terms
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Supplier contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplier.contactPerson && (
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                </div>
              </div>
            )}

            {supplier.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                </div>
              </div>
            )}

            {supplier.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{supplier.email}</p>
                </div>
              </div>
            )}

            {supplier.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{supplier.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
            <CardDescription>Tax and payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">TIN</span>
              <span className="text-sm text-muted-foreground">{supplier.tin || "N/A"}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Tax Type</span>
              <Badge variant={supplier.taxType === "VAT" ? "default" : "secondary"}>
                {supplier.taxType}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Withholding Tax</span>
              <span className="text-sm text-muted-foreground">
                {supplier.withholdingTax ? `${supplier.withholdingTax}%` : "0%"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Payment Terms</span>
              <span className="text-sm text-muted-foreground">
                {supplier.paymentTerms || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Orders</CardTitle>
          <CardDescription>
            Purchase orders placed with this supplier
          </CardDescription>
        </CardHeader>
        <CardContent>
          {supplierOrders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No purchase orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierOrders.slice(0, 10).map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/purchasing/orders/${order.id}`)}
                  >
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">{order.items.length}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₱{order.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

