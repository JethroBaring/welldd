"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Users,
  Activity,
  Search
} from "lucide-react";
import { getLGUs } from "@/lib/api/lgu";
import { LGU } from "@/types/lgu";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function LGUPage() {
  const router = useRouter();
  const { currentRole, assignedLGUId } = useAuthStore();
  const [lgus, setLgus] = useState<LGU[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const effectiveRole = currentRole;
  const isAdminStaff = effectiveRole === "admin_staff";

  useEffect(() => {
    // Admin staff should only manage their assigned LGU – redirect directly when available
    if (isAdminStaff) {
      const handleAdminRedirect = async () => {
        if (assignedLGUId) {
          router.replace(`/lgu/${assignedLGUId}`);
          return;
        }
        // No assigned LGU: redirect to the first LGU (UI purposes)
        try {
          setLoading(true);
          const data = await getLGUs();
          if (data && data.length > 0) {
            router.replace(`/lgu/${data[0].id}`);
            return;
          }
        } finally {
          setLoading(false);
        }
      };
      handleAdminRedirect();
      return;
    }
    loadLGUs();
  }, [isAdminStaff, assignedLGUId]);

  const loadLGUs = async () => {
    try {
      setLoading(true);
      const data = await getLGUs();
      
      // Filter LGUs based on user role
      let filteredData = data;
      if (currentRole === "admin_staff" && assignedLGUId) {
        // Admin staff only see their assigned LGU
        filteredData = data.filter(lgu => lgu.id === assignedLGUId);
      }
      // Super admin sees all LGUs
      
      setLgus(filteredData);
    } catch (error) {
      console.error("Failed to load LGUs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLGUs = lgus.filter(
    (lgu) =>
      lgu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lgu.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lgu.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Admin staff UX: show redirecting state
  if (isAdminStaff) {
    return (
      <div className="mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  // Super admin continues below

  return (
    <div className="mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">LGU Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage Local Government Units and their facilities
          </p>
        </div>
        {currentRole === "super_admin" && (
          <Button onClick={() => router.push("/lgu/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add LGU
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <Input
            placeholder="Search LGUs by name, municipality, or province..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-9"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredLGUs.length} LGU{filteredLGUs.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {filteredLGUs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No LGUs found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm ? "Try a different search term" : "Get started by adding your first LGU"}
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push("/lgu/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Add LGU
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLGUs.map((lgu) => (
            <Card key={lgu.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/lgu/${lgu.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{lgu.name}</CardTitle>
                      <Badge variant={lgu.isActive ? "default" : "secondary"} className="mt-1">
                        {lgu.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{lgu.region}, {lgu.province}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{lgu.contactInformation.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{lgu.contactInformation.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">{lgu.barangays.length} Barangays</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

