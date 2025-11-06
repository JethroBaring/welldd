"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewStockIssuancePage() {
  const router = useRouter();
  const data = {
    id: "ISS-2500014",
    type: "Customer",
    issuanceDate: "2025-10-28",
    approver: "Super Admin",
    source: "Branch B",
    destination: "Default Customer",
    deliveryDate: "2025-10-28",
    products: [
      {
        name: "Asado Loaf",
        quantity: 1,
        onHand: 0,
        unit: "Piece",
      },
    ],
  };
  return (
    <div className="mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/inventory/issuance")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Stock Issuance
      </Button>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Stock Issuance <span className="ml-3 text-base font-normal text-muted-foreground">{data.id}</span></h1>
        <p className="text-sm text-muted-foreground">View stock issuance details</p>
      </div>
      <Card>
        <CardContent className="pt-6 grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Issuance Type</Label>
              <Select value={data.type} disabled>
                <SelectTrigger disabled><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Branch">Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issuance Date</Label>
              <Input type="date" value={data.issuanceDate} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label>Approvers</Label>
              <Select value={data.approver} disabled>
                <SelectTrigger disabled><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={data.source} disabled>
                <SelectTrigger disabled><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Branch A">Branch A</SelectItem>
                  <SelectItem value="Branch B">Branch B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={data.destination} disabled>
                <SelectTrigger disabled><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default Customer">Default Customer</SelectItem>
                  <SelectItem value="Branch A">Branch A</SelectItem>
                  <SelectItem value="Branch B">Branch B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Input type="date" value={data.deliveryDate} readOnly disabled />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Products Section OUTSIDE Card */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Products</h2>
        <div className="overflow-x-auto border rounded-lg bg-muted/70">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="py-2 pl-6 text-left font-medium">Product</th>
                <th className="py-2 text-center font-medium">Quantity</th>
                <th className="py-2 text-center font-medium">On Hand Quantity</th>
                <th className="py-2 pr-6 text-center font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p.name} className="even:bg-muted/50">
                  <td className="py-2 pl-6 font-medium">{p.name}</td>
                  <td className="text-center">{p.quantity}</td>
                  <td className="text-center">{p.onHand}</td>
                  <td className="text-center pr-6">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
