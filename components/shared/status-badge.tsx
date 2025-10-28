import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  // Purchase Request statuses
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Pending", variant: "default", className: "bg-yellow-500 hover:bg-yellow-600" },
  approved: { label: "Approved", variant: "default", className: "bg-green-500 hover:bg-green-600" },
  denied: { label: "Denied", variant: "destructive" },
  completed: { label: "Completed", variant: "outline" },
  
  // Purchase Order statuses
  sent: { label: "Sent", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
  
  // Warehouse Receiving statuses
  receiving: { label: "Receiving", variant: "default", className: "bg-orange-500 hover:bg-orange-600" },
  discrepancy: { label: "Discrepancy", variant: "destructive" },
  
  // Inventory statuses
  active: { label: "Active", variant: "default", className: "bg-green-500 hover:bg-green-600" },
  low_stock: { label: "Low Stock", variant: "default", className: "bg-yellow-500 hover:bg-yellow-600" },
  expiring_soon: { label: "Expiring Soon", variant: "default", className: "bg-orange-500 hover:bg-orange-600" },
  expired: { label: "Expired", variant: "destructive" },
  out_of_stock: { label: "Out of Stock", variant: "destructive" },
  
  // Patient statuses
  inactive: { label: "Inactive", variant: "secondary" },
  deceased: { label: "Deceased", variant: "outline" },
  
  // Appointment statuses
  scheduled: { label: "Scheduled", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  no_show: { label: "No Show", variant: "outline" },
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: variant || "default" };
  
  return (
    <Badge 
      variant={variant || config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

