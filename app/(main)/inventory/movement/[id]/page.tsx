"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getInventoryTransactions } from "@/lib/api";
import type { InventoryTransaction } from "@/types/inventory";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function ViewInventoryMovementPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [movement, setMovement] = useState<InventoryTransaction | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const txns = await getInventoryTransactions();
        setMovement(txns.find((t) => t.id === id) ?? null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-6"><Skeleton className="h-10 w-72 mb-4" /><Skeleton className="h-24 w-full" /><Skeleton className="h-96 w-full mt-6" /></div>
    );
  }
  if (!movement) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-xl mb-4 font-bold">Inventory Movement</h1>
        <p className="text-destructive">Movement not found.</p>
        <button className="mt-6 btn btn-outline" onClick={() => router.push("/inventory/movement")}>Back to Movement List</button>
      </div>
    );
  }

  const formatDate = (dt: Date | string | undefined) => dt ? format(new Date(dt), "MMM dd, yyyy HH:mm") : "—";
  const formatLabel = (str: string) => str?.replace(/_/g, " ").replace(/^./, (s) => s.toUpperCase());

  return (
    <div className="mx-auto py-6 space-y-6">
      <button
        type="button"
        className="mb-4 inline-flex items-center text-sm px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
        onClick={() => router.push("/inventory/movement")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Inventory Movement
      </button>
      <div>
        <h1 className="text-2xl font-semibold">Inventory Movement</h1>
        <p className="text-sm text-muted-foreground">{movement.id}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-medium">Transaction Type</div>
          <div>{formatLabel(movement.type) ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Movement Date</div>
          <div>{formatDate(movement.date)}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Reference No.</div>
          <div>{movement.referenceNumber ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Item</div>
          <div>{movement.itemName ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Item Type</div>
          <div>{movement.itemSubType ? formatLabel(movement.itemSubType) : "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Location</div>
          <div>{movement.location ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Beginning Qty</div>
          <div>{movement.beginningQuantity ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Qty</div>
          <div>{movement.quantity ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Ending Qty</div>
          <div>{movement.endingQuantity ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Remarks</div>
          <div>{movement.remarks ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
