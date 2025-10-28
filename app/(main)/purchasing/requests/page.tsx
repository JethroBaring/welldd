"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { getPurchaseRequests } from "@/lib/api";
import { PurchaseRequest } from "@/types/purchasing";
import { format } from "date-fns";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

export default function PurchaseRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, requests]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Failed to load purchase requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (!searchQuery.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = requests.filter(
      (req) =>
        req.prNumber.toLowerCase().includes(query) ||
        req.requestingDepartment.toLowerCase().includes(query) ||
        req.costCenter.toLowerCase().includes(query) ||
        req.requestedBy.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Requests</h1>
          <p className="text-sm text-muted-foreground">
            Manage purchase requests for medicines and supplies
          </p>
        </div>
        {permissions.canCreatePR && (
          <Link href="/purchasing/requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        )}
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by PR number, department, or requester..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-9"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PR Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Cost Center</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No purchase requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/purchasing/requests/${request.id}`}
                >
                  <TableCell className="font-medium">{request.prNumber}</TableCell>
                  <TableCell>{format(new Date(request.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{request.requestingDepartment}</TableCell>
                  <TableCell>{request.costCenter}</TableCell>
                  <TableCell>{request.items.length} items</TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/purchasing/requests/${request.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit request</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete purchase request ${request.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete request</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

