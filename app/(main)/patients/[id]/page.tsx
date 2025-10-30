"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPatientById, getMedicalRecordsByPatient } from "@/lib/api";
import { Patient, MedicalRecord } from "@/types/patient";
import { format } from "date-fns";
import { ArrowLeft, Plus, FileText, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [params.id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const [patientData, recordsData] = await Promise.all([
        getPatientById(params.id as string),
        getMedicalRecordsByPatient(params.id as string),
      ]);
      setPatient(patientData);
      setRecords(recordsData);
    } catch (error) {
      console.error("Failed to load patient:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <p>Patient not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/patients")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Patients
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {patient.firstName} {patient.middleName} {patient.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">Patient ID: {patient.patientId}</p>
        </div>
        <StatusBadge status={patient.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Patient ID:</div>
              <div className="text-sm font-medium">{patient.patientId}</div>

              <div className="text-sm text-muted-foreground">Full Name:</div>
              <div className="text-sm font-medium">
                {patient.firstName} {patient.middleName} {patient.lastName}
              </div>

              <div className="text-sm text-muted-foreground">Date of Birth:</div>
              <div className="text-sm font-medium">
                {format(new Date(patient.dateOfBirth), "MMMM dd, yyyy")}
              </div>

              <div className="text-sm text-muted-foreground">Age:</div>
              <div className="text-sm font-medium">{patient.age} years old</div>

              <div className="text-sm text-muted-foreground">Gender:</div>
              <div className="text-sm font-medium capitalize">{patient.gender}</div>

              <div className="text-sm text-muted-foreground">Blood Type:</div>
              <div className="text-sm font-medium">{patient.bloodType || "-"}</div>

              <div className="text-sm text-muted-foreground">Registration Date:</div>
              <div className="text-sm font-medium">
                {format(new Date(patient.registrationDate), "MMMM dd, yyyy")}
              </div>
              <div className="text-sm text-muted-foreground">Height:</div>
              <div className="text-sm font-medium">{patient.height ? `${patient.height} cm` : "-"}</div>
              <div className="text-sm text-muted-foreground">Weight:</div>
              <div className="text-sm font-medium">{patient.weight ? `${patient.weight} kg` : "-"}</div>
              <div className="text-sm text-muted-foreground">BMI:</div>
              <div className="text-sm font-medium">{patient.bmi || "-"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Address:</div>
              <div className="text-sm font-medium">
                {patient.address.barangay}, {patient.address.municipality}, {patient.address.province}
              </div>

              <div className="text-sm text-muted-foreground">Contact Number:</div>
              <div className="text-sm font-medium">{patient.contactNumber || "-"}</div>

              <div className="text-sm text-muted-foreground">Email:</div>
              <div className="text-sm font-medium">{patient.email || "-"}</div>

              {patient.emergencyContact && (
                <>
                  <div className="text-sm text-muted-foreground col-span-2 mt-2 font-semibold">
                    Emergency Contact:
                  </div>
                  <div className="text-sm text-muted-foreground">Name:</div>
                  <div className="text-sm font-medium">{patient.emergencyContact.name}</div>

                  <div className="text-sm text-muted-foreground">Relationship:</div>
                  <div className="text-sm font-medium">{patient.emergencyContact.relationship}</div>

                  <div className="text-sm text-muted-foreground">Phone:</div>
                  <div className="text-sm font-medium">{patient.emergencyContact.phone}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {patient.allergies && patient.allergies.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Known Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {patient.immunizationRecords && patient.immunizationRecords.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Immunization Records</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-6 mt-1">
                {patient.immunizationRecords.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {patient.labTestResults && patient.labTestResults.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Lab & Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-6 mt-1">
                {patient.labTestResults.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>Patient's medical history and visits</CardDescription>
            </div>
            <Link href={`/patients/${patient.id}/records/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medical records yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Record Number</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Physician</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-medium">{record.recordNumber}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.attendingPhysician}</TableCell>
                    <TableCell>
                      {record.followUpDate
                        ? format(new Date(record.followUpDate), "MMM dd, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/patients/${patient.id}/records/${record.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View medical record</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

