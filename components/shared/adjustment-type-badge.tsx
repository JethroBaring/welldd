"use client";

import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export type InventoryAdjustmentType =
  | "physical_count"
  | "damage"
  | "expired"
  | "correction"
  | "other"
  | (string & {});

function getAdjustmentTypeBadge(type: string): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    physical_count: "default",
    damage: "destructive",
    expired: "destructive",
    correction: "secondary",
    other: "outline",
  };
  return variants[type] || "outline";
}

function formatAdjustmentType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AdjustmentTypeBadge({ type }: { type: InventoryAdjustmentType }) {
  return (
    <Badge variant={getAdjustmentTypeBadge(type)}>{formatAdjustmentType(type)}</Badge>
  );
}


