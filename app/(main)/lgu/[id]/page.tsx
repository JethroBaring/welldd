"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  ArrowLeft,
  Pencil,
  Plus,
  Users,
  Activity
} from "lucide-react";
import { getLGUById, getFacilities, getLGUUsers } from "@/lib/api/lgu";
import { LGU, Facility, LGUUser } from "@/types/lgu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LGUDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentRole, assignedLGUId } = useAuthStore();
  const [lgu, setLgu] = useState<LGU | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [users, setUsers] = useState<LGUUser[]>([]);
  const [loading, setLoading] = useState(true);

  const canEdit = currentRole === "super_admin";

  const effectiveRole = currentRole;

  useEffect(() => {
    // Admin staff can only access their assigned LGU
    if (effectiveRole === "admin_staff" && assignedLGUId && assignedLGUId !== (params.id as string)) {
      router.replace(`/lgu/${assignedLGUId}`);
      return;
    }
    loadData();
  }, [params.id, effectiveRole, assignedLGUId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lguData, facilitiesData, usersData] = await Promise.all([
        getLGUById(params.id as string),
        getFacilities(params.id as string),
        getLGUUsers(params.id as string),
      ]);
      setLgu(lguData);
      setFacilities(facilitiesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!lgu) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">LGU Not Found</p>
            <p className="text-sm text-muted-foreground mb-4">
              The LGU you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/lgu")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to LGUs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 space-y-6">
      <div>
        {currentRole === "super_admin" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/lgu")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          {lgu.name}
          {canEdit && (
            <Button variant="noHover" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lgu.region}, {lgu.province}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  LGU Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={lgu.isActive ? "default" : "secondary"}>
                      {lgu.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Code: {lgu.code}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Municipality</p>
                    <p className="text-sm text-muted-foreground">{lgu.municipality}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Province</p>
                    <p className="text-sm text-muted-foreground">{lgu.province}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Region</p>
                    <p className="text-sm text-muted-foreground">{lgu.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Barangays</p>
                    <p className="text-sm text-muted-foreground">{lgu.barangays.length} barangays</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{lgu.contactInformation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{lgu.contactInformation.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{lgu.contactInformation.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Facilities</span>
                  <span className="text-2xl font-bold">{facilities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Users</span>
                  <span className="text-2xl font-bold">{users.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Barangays</span>
                  <span className="text-2xl font-bold">{lgu.barangays.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Barangays</CardTitle>
                <CardDescription>
                  {lgu.barangays.length > 0
                    ? `List of barangays under this LGU (${lgu.barangays.length} total)`
                    : "No barangays added yet"}
                </CardDescription>
              </div>
              {canEdit && (
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Barangay
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {lgu.barangays.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Barangay Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lgu.barangays.map((barangay, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">{barangay}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          {canEdit && (
                            <Button variant="noHover" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No barangays added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Facilities</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>

          {facilities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Facilities</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first facility to get started
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Facilities</CardTitle>
                <CardDescription>
                  List of facilities under {lgu.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Barangay</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilities.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell className="capitalize">{facility.type.replace("_", " ")}</TableCell>
                        <TableCell>{facility.address}</TableCell>
                        <TableCell>{facility.barangay}</TableCell>
                        <TableCell>{facility.contactInformation.phone}</TableCell>
                        <TableCell>
                          {facility.capacity ? (
                            <div className="text-sm">
                              {facility.capacity.beds && (
                                <div className="flex items-center gap-2">
                                  <Activity className="h-3 w-3" />
                                  <span>{facility.capacity.beds} beds</span>
                                </div>
                              )}
                              {facility.capacity.staff && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3" />
                                  <span>{facility.capacity.staff} staff</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={facility.isActive ? "default" : "secondary"}>
                            {facility.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Users</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {users.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Users</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first user to get started
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>LGU Users</CardTitle>
                <CardDescription>
                  Manage users for {lgu.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.position || "-"}</TableCell>
                        <TableCell>{user.department || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

