"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPatientById } from "@/lib/api";
import { Patient, MedicalRecord } from "@/types/patient";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewMedicalRecordPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    date: new Date().toISOString().split("T")[0],
    chiefComplaint: "",
    diagnosis: "",
    treatmentPlan: "",
    attendingPhysician: "",
    vitalSigns: {},
    prescriptions: [],
    remarks: "",
  });

  const [prescriptions, setPrescriptions] = useState([
    { medicationName: "", dosage: "", frequency: "", duration: "" },
  ]);

  useEffect(() => {
    loadPatient();
  }, [params.id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const patientData = await getPatientById(params.id as string);
      setPatient(patientData);
    } catch (error) {
      console.error("Failed to load patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVitalSignChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value,
      },
    }));
  };

  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicationName: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Filter out empty prescriptions
      const validPrescriptions = prescriptions.filter(
        (p) => p.medicationName && p.dosage && p.frequency && p.duration
      );

      const medicalRecord: Partial<MedicalRecord> = {
        ...formData,
        patientId: params.id as string,
        prescriptions: validPrescriptions.length > 0 ? validPrescriptions : undefined,
      };

      console.log("Creating medical record:", medicalRecord);
      
      // Here you would typically send this to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push(`/patients/${params.id}`);
    } catch (error) {
      console.error("Failed to create medical record:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/patients/${params.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Patient Profile
      </Button>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">New Medical Record</h1>
        <p className="text-sm text-muted-foreground">
          {patient ? `Patient: ${patient.firstName} ${patient.lastName} (${patient.patientId})` : ""}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
            <CardDescription>Enter details of the medical visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Visit Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendingPhysician">
                  Attending Physician <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="attendingPhysician"
                  value={formData.attendingPhysician}
                  onChange={(e) => handleInputChange("attendingPhysician", e.target.value)}
                  placeholder="Dr. Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Textarea
                id="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                placeholder="Patient's main concern"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">
                Diagnosis <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                placeholder="Medical diagnosis"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentPlan">Treatment Plan</Label>
              <Textarea
                id="treatmentPlan"
                value={formData.treatmentPlan}
                onChange={(e) => handleInputChange("treatmentPlan", e.target.value)}
                placeholder="Treatment plan and recommendations"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
            <CardDescription>Record patient vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  value={formData.vitalSigns?.bloodPressure || ""}
                  onChange={(e) => handleVitalSignChange("bloodPressure", e.target.value)}
                  placeholder="e.g., 120/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={formData.vitalSigns?.temperature || ""}
                  onChange={(e) => handleVitalSignChange("temperature", e.target.value)}
                  placeholder="36.5"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulseRate">Pulse Rate (bpm)</Label>
                <Input
                  id="pulseRate"
                  type="number"
                  value={formData.vitalSigns?.pulseRate || ""}
                  onChange={(e) => handleVitalSignChange("pulseRate", e.target.value)}
                  placeholder="72"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={formData.vitalSigns?.respiratoryRate || ""}
                  onChange={(e) => handleVitalSignChange("respiratoryRate", e.target.value)}
                  placeholder="16"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.vitalSigns?.weight || ""}
                  onChange={(e) => handleVitalSignChange("weight", e.target.value)}
                  placeholder="70"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.vitalSigns?.height || ""}
                  onChange={(e) => handleVitalSignChange("height", e.target.value)}
                  placeholder="170"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Add prescribed medications</CardDescription>
              </div>
              <Button type="button" onClick={addPrescription} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Medication {index + 1}</h4>
                    {prescriptions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePrescription(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`medication-${index}`}>Medication Name</Label>
                      <Input
                        id={`medication-${index}`}
                        value={prescription.medicationName}
                        onChange={(e) =>
                          handlePrescriptionChange(index, "medicationName", e.target.value)
                        }
                        placeholder="e.g., Paracetamol"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`dosage-${index}`}
                        value={prescription.dosage}
                        onChange={(e) => handlePrescriptionChange(index, "dosage", e.target.value)}
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                      <Input
                        id={`frequency-${index}`}
                        value={prescription.frequency}
                        onChange={(e) => handlePrescriptionChange(index, "frequency", e.target.value)}
                        placeholder="e.g., Once daily"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`duration-${index}`}>Duration</Label>
                      <Input
                        id={`duration-${index}`}
                        value={prescription.duration}
                        onChange={(e) => handlePrescriptionChange(index, "duration", e.target.value)}
                        placeholder="e.g., 7 days"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-up</CardTitle>
            <CardDescription>Schedule patient follow-up</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate ? new Date(formData.followUpDate).toISOString().split("T")[0] : ""}
                onChange={(e) => handleInputChange("followUpDate", e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Medical Record
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

