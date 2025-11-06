"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  FileText,
  Save,
  Edit
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ExtractedPatientData {
  // Personal Information
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  address?: string;
  barangay?: string;
  contactNumber?: string;
  email?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  
  // Medical Information
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
  };
  
  // Visit Information
  chiefComplaint?: string;
  diagnosis?: string;
  treatment?: string;
  followUpDate?: string;
  doctorName?: string;
  visitDate?: string;
}

export default function ReviewPatientScanPage() {
  const router = useRouter();
  const [extractedData, setExtractedData] = useState<ExtractedPatientData>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Retrieve scanned data from session storage
    const scannedData = sessionStorage.getItem('scannedPatientData');
    if (scannedData) {
      setExtractedData(JSON.parse(scannedData));
    }
  }, []);

  const handleRegisterPatient = async () => {
    setIsSaving(true);
    // Here you would typically send the data to your API
    console.log("Registering patient with data:", extractedData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push("/patients");
  };

  return (
    <div className="mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Review Patient Data</h1>
        <p className="text-sm text-muted-foreground">
          Review and edit the extracted information before registering the patient
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Scan Document</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center space-x-2 text-primary">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
            2
          </div>
          <span className="text-sm font-medium">Review & Register</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Review and edit the extracted data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Personal Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={extractedData.firstName || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={extractedData.lastName || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={extractedData.middleName || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, middleName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={extractedData.dateOfBirth || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={extractedData.gender || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, gender: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input
                    id="bloodType"
                    value={extractedData.bloodType || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, bloodType: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={extractedData.contactNumber || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={extractedData.email || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={extractedData.address || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  value={extractedData.barangay || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, barangay: e.target.value }))}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Emergency Contact</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={extractedData.emergencyContactName || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Input
                    id="emergencyContactRelationship"
                    value={extractedData.emergencyContactRelationship || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={extractedData.emergencyContactPhone || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Medical Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={extractedData.medicalHistory?.join(", ") || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, medicalHistory: e.target.value.split(", ") }))}
                  rows={2}
                  placeholder="Enter medical conditions separated by commas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={extractedData.allergies?.join(", ") || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, allergies: e.target.value.split(", ") }))}
                  rows={2}
                  placeholder="Enter allergies separated by commas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={extractedData.currentMedications?.join(", ") || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, currentMedications: e.target.value.split(", ") }))}
                  rows={2}
                  placeholder="Enter medications separated by commas"
                />
              </div>

              {/* Vital Signs */}
              <div className="space-y-3">
                <Label>Vital Signs</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      value={extractedData.vitalSigns?.bloodPressure || ""}
                      onChange={(e) => setExtractedData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate</Label>
                    <Input
                      id="heartRate"
                      value={extractedData.vitalSigns?.heartRate || ""}
                      onChange={(e) => setExtractedData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      value={extractedData.vitalSigns?.temperature || ""}
                      onChange={(e) => setExtractedData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={extractedData.vitalSigns?.weight || ""}
                      onChange={(e) => setExtractedData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={extractedData.vitalSigns?.height || ""}
                      onChange={(e) => setExtractedData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, height: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Visit Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Textarea
                  id="chiefComplaint"
                  value={extractedData.chiefComplaint || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={extractedData.diagnosis || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea
                  id="treatment"
                  value={extractedData.treatment || ""}
                  onChange={(e) => setExtractedData(prev => ({ ...prev, treatment: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    value={extractedData.doctorName || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, doctorName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={extractedData.visitDate || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, visitDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={extractedData.followUpDate || ""}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleRegisterPatient}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Register Patient
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scanned Document
            </CardTitle>
            <CardDescription>
              Original document preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-2/3 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Document Preview</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

