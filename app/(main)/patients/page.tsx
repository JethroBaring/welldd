"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPatients } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Patient } from "@/types/patient";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (patient) =>
        patient.patientId.toLowerCase().includes(query) ||
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
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
          <h1 className="text-2xl font-semibold">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Manage patient profiles and medical records
          </p>
        </div>
        {permissions.canManagePatients && (
          <Link href="/patients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          </Link>
        )}
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by patient ID, name..."
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
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/patients/${patient.id}`}
                >
                  <TableCell className="font-medium">{patient.patientId}</TableCell>
                  <TableCell>
                    {patient.firstName} {patient.middleName} {patient.lastName}
                  </TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell className="capitalize">{patient.gender}</TableCell>
                  <TableCell>{patient.address.barangay}</TableCell>
                  <TableCell>{patient.contactNumber || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={patient.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/patients/${patient.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit patient</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                          console.log(`Delete patient ${patient.id}`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete patient</span>
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

