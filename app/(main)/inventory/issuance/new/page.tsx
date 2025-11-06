"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewStockIssuancePage() {
  const [source, setSource] = useState("");
  const router = useRouter();
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
        <h1 className="text-2xl font-semibold">New Stock Issuance</h1>
        <p className="text-sm text-muted-foreground">Create a new stock issuance</p>
      </div>
      <form className="space-y-6">
        <Card>
          <CardContent className="pt-6 grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Issuance Type <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Issuance Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Branch">Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issuance Date <span className="text-red-500">*</span></Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Approvers <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select approvers..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source <span className="text-red-500">*</span></Label>
                <Select onValueChange={setSource} value={source}>
                  <SelectTrigger><SelectValue placeholder="Select Source Branch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Branch A">Branch A</SelectItem>
                    <SelectItem value="Branch B">Branch B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Default Customer">Default Customer</SelectItem>
                    <SelectItem value="Branch A">Branch A</SelectItem>
                    <SelectItem value="Branch B">Branch B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Date <span className="text-red-500">*</span></Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <h2 className="font-semibold">Products</h2>
              {source ? (
                <div className="border rounded-lg p-6 text-center text-muted-foreground bg-muted/70">Product selection coming soon</div>
              ) : (
                <div className="flex items-center justify-center min-h-[48px] text-muted-foreground border rounded-lg bg-muted/50 p-6">To add products, please select a source branch first.</div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/inventory/issuance")}>Cancel</Button>
          <Button type="submit">Save Stock Issuance</Button>
        </div>
      </form>
    </div>
  );
}
