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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, Download } from "lucide-react";
import { getPatients } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Patient } from "@/types/patient";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCols, setVisibleCols] = useState({
    patientId: true,
    name: true,
    age: true,
    gender: true,
    barangay: true,
    contact: true,
    status: true,
    actions: true
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
    setPage(1); // reset to first page after search
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

  const handleExport = () => {
    const headers = [
      visibleCols.patientId ? "Patient ID" : null,
      visibleCols.name ? "Name" : null,
      visibleCols.age ? "Age" : null,
      visibleCols.gender ? "Gender" : null,
      visibleCols.barangay ? "Barangay" : null,
      visibleCols.contact ? "Contact" : null,
      visibleCols.status ? "Status" : null
    ].filter(Boolean);
    const rows = filteredPatients.slice((page-1)*rowsPerPage, page*rowsPerPage).map((p) => [
      visibleCols.patientId ? p.patientId : null,
      visibleCols.name ? `${p.firstName} ${p.middleName ?? ''} ${p.lastName}`.trim() : null,
      visibleCols.age ? p.age : null,
      visibleCols.gender ? p.gender : null,
      visibleCols.barangay ? p.address.barangay : null,
      visibleCols.contact ? (p.contactNumber || "-") : null,
      visibleCols.status ? p.status : null
    ].filter((v)=>(v !== null)));
    const csv = [headers.join(","), ...rows.map(r => r.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv],{type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Pagination logic
  const total = filteredPatients.length;
  const startIdx = (page-1)*rowsPerPage;
  const endIdx = Math.min(total, startIdx+rowsPerPage);
  const pageRows = filteredPatients.slice(startIdx, endIdx);
  const totalPages = Math.max(1, Math.ceil(total/rowsPerPage));
  
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
              <Plus className="mr-2 h-4 w-4" /> New Patient
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="relative max-w-md w-full">
          <Input
            placeholder="Search by patient ID, name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pr-9"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                ["patientId", "Patient ID"],
                ["name", "Name"],
                ["age", "Age"],
                ["gender", "Gender"],
                ["barangay", "Barangay"],
                ["contact", "Contact"],
                ["status", "Status"],
                ["actions", "Actions"],
              ].map(([k, label]) => (
                <DropdownMenuCheckboxItem
                  key={k}
                  checked={visibleCols[k]}
                  onCheckedChange={val => setVisibleCols(p => ({...p, [k]: !!val}))}
                >{label}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleCols.patientId && <TableHead>Patient ID</TableHead>}
              {visibleCols.name && <TableHead>Name</TableHead>}
              {visibleCols.age && <TableHead>Age</TableHead>}
              {visibleCols.gender && <TableHead>Gender</TableHead>}
              {visibleCols.barangay && <TableHead>Barangay</TableHead>}
              {visibleCols.contact && <TableHead>Contact</TableHead>}
              {visibleCols.status && <TableHead>Status</TableHead>}
              {visibleCols.actions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Object.keys(visibleCols).filter(k=>visibleCols[k]).length} className="text-center py-8 text-muted-foreground">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/patients/${patient.id}`}
                >
                  {visibleCols.patientId && (
                    <TableCell className="font-medium">{patient.patientId}</TableCell>
                  )}
                  {visibleCols.name && (
                    <TableCell>{patient.firstName} {patient.middleName} {patient.lastName}</TableCell>
                  )}
                  {visibleCols.age && (
                    <TableCell>{patient.age}</TableCell>
                  )}
                  {visibleCols.gender && (
                    <TableCell className="capitalize">{patient.gender}</TableCell>
                  )}
                  {visibleCols.barangay && (
                    <TableCell>{patient.address.barangay}</TableCell>
                  )}
                  {visibleCols.contact && (
                    <TableCell>{patient.contactNumber || "-"}</TableCell>
                  )}
                  {visibleCols.status && (
                    <TableCell><StatusBadge status={patient.status} /></TableCell>
                  )}
                  {visibleCols.actions && (
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
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
                          onClick={e => {
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
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div>{`Showing ${total === 0 ? 0 : startIdx + 1} to ${endIdx} of ${total} rows`}</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={String(rowsPerPage)}
              onChange={e => {
                const next = parseInt(e.target.value, 10);
                setRowsPerPage(next);
                setPage(1);
              }}
              className="h-8 w-20 rounded-md border bg-transparent px-2 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>{`Page ${page} of ${totalPages}`}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(1)}>«</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>‹</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>›</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

