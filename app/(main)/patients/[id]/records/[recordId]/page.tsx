"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPatientById, getMedicalRecordById } from "@/lib/api";
import { Patient, MedicalRecord } from "@/types/patient";
import { format } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id, params.recordId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [patientData, recordData] = await Promise.all([
        getPatientById(params.id as string),
        getMedicalRecordById(params.recordId as string),
      ]);
      setPatient(patientData);
      setRecord(recordData);
    } catch (error) {
      console.error("Failed to load data:", error);
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

  if (!patient || !record) {
    return (
      <div className="container mx-auto py-6">
        <p>Record not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/patients/${params.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Patient Profile
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Medical Record</h1>
          <p className="text-sm text-muted-foreground">
            {record.recordNumber} - {patient.firstName} {patient.lastName}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Patient ID:</div>
              <div className="text-sm font-medium">{patient.patientId}</div>

              <div className="text-sm text-muted-foreground">Name:</div>
              <div className="text-sm font-medium">
                {patient.firstName} {patient.middleName} {patient.lastName}
              </div>

              <div className="text-sm text-muted-foreground">Age:</div>
              <div className="text-sm font-medium">{patient.age} years old</div>

              <div className="text-sm text-muted-foreground">Gender:</div>
              <div className="text-sm font-medium capitalize">{patient.gender}</div>

              <div className="text-sm text-muted-foreground">Blood Type:</div>
              <div className="text-sm font-medium">{patient.bloodType || "-"}</div>
            </div>

            {patient.allergies && patient.allergies.length > 0 && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">Allergies:</div>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Date:</div>
              <div className="text-sm font-medium">
                {format(new Date(record.date), "MMMM dd, yyyy")}
              </div>

              <div className="text-sm text-muted-foreground">Record #:</div>
              <div className="text-sm font-medium">{record.recordNumber}</div>

              <div className="text-sm text-muted-foreground">Physician:</div>
              <div className="text-sm font-medium">{record.attendingPhysician}</div>

              {record.followUpDate && (
                <>
                  <div className="text-sm text-muted-foreground">Follow-up:</div>
                  <div className="text-sm font-medium">
                    {format(new Date(record.followUpDate), "MMMM dd, yyyy")}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {record.chiefComplaint && (
        <Card>
          <CardHeader>
            <CardTitle>Chief Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{record.chiefComplaint}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{record.diagnosis}</p>
        </CardContent>
      </Card>

      {record.vitalSigns && (
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {record.vitalSigns.bloodPressure && (
                <div>
                  <div className="text-sm text-muted-foreground">Blood Pressure</div>
                  <div className="font-medium">{record.vitalSigns.bloodPressure} mmHg</div>
                </div>
              )}
              {record.vitalSigns.temperature && (
                <div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                  <div className="font-medium">{record.vitalSigns.temperature}°C</div>
                </div>
              )}
              {record.vitalSigns.pulseRate && (
                <div>
                  <div className="text-sm text-muted-foreground">Pulse Rate</div>
                  <div className="font-medium">{record.vitalSigns.pulseRate} bpm</div>
                </div>
              )}
              {record.vitalSigns.respiratoryRate && (
                <div>
                  <div className="text-sm text-muted-foreground">Respiratory Rate</div>
                  <div className="font-medium">{record.vitalSigns.respiratoryRate} /min</div>
                </div>
              )}
              {record.vitalSigns.weight && (
                <div>
                  <div className="text-sm text-muted-foreground">Weight</div>
                  <div className="font-medium">{record.vitalSigns.weight} kg</div>
                </div>
              )}
              {record.vitalSigns.height && (
                <div>
                  <div className="text-sm text-muted-foreground">Height</div>
                  <div className="font-medium">{record.vitalSigns.height} cm</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {record.prescriptions && record.prescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {record.prescriptions.map((prescription, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">{prescription.medicationName}</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dosage:</span>{" "}
                      <span className="font-medium">{prescription.dosage}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>{" "}
                      <span className="font-medium">{prescription.frequency}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>{" "}
                      <span className="font-medium">{prescription.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {record.treatmentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Treatment Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{record.treatmentPlan}</p>
          </CardContent>
        </Card>
      )}

      {record.labResults && (
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{record.labResults}</p>
          </CardContent>
        </Card>
      )}

      {record.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{record.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

