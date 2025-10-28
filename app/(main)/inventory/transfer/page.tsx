"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransferOutPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Stock Transfer Out</h1>
          <p className="text-sm text-muted-foreground">
            Transfer expiring stock to other LGUs
          </p>
        </div>
        <Button onClick={() => router.push("/inventory/transfer/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Record of stock transfers to other LGUs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TruckIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transfers recorded yet</p>
            <p className="text-sm mt-2">
              Transfers help prevent waste by sharing expiring stock with other facilities
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

