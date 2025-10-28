"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Scan,
  Download,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ScannedDocument {
  id: string;
  type: "medical_record_form" | "prescription" | "lab_result" | "other";
  fileName: string;
  preview: string;
  extractedData?: ExtractedPatientData;
  confidence: number;
  scannedAt: Date;
}

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

export default function ScanPatientPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<ScannedDocument | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedPatientData>({});

  const handleScanDocument = async () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const mockDocument: ScannedDocument = {
        id: Date.now().toString(),
        type: "medical_record_form",
        fileName: `medical_record_${Date.now()}.pdf`,
        preview: "/api/placeholder/200/300",
        extractedData: generateMockExtractedData(),
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        scannedAt: new Date(),
      };

      setCurrentDocument(mockDocument);
      
      // Update extracted data
      if (mockDocument.extractedData) {
        setExtractedData(mockDocument.extractedData);
      }
      
      setIsScanning(false);
    }, 2000);
  };

  const generateMockExtractedData = (): ExtractedPatientData => {
    return {
      firstName: "Maria",
      lastName: "Santos",
      middleName: "Cruz",
      dateOfBirth: "1985-03-15",
      gender: "female",
      bloodType: "A+",
      address: "123 Main Street, Barangay Poblacion",
      barangay: "Poblacion",
      contactNumber: "0917-123-4567",
      email: "maria.santos@email.com",
      emergencyContactName: "Juan Santos",
      emergencyContactRelationship: "Husband",
      emergencyContactPhone: "0918-987-6543",
      medicalHistory: ["Hypertension", "Diabetes Type 2"],
      allergies: ["Penicillin", "Shellfish"],
      currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
      vitalSigns: {
        bloodPressure: "140/90",
        heartRate: "85 bpm",
        temperature: "36.5°C",
        weight: "65 kg",
        height: "160 cm"
      },
      chiefComplaint: "Chest pain and shortness of breath",
      diagnosis: "Hypertensive crisis",
      treatment: "Blood pressure monitoring, medication adjustment",
      followUpDate: "2024-02-15",
      doctorName: "Dr. Ana Reyes",
      visitDate: "2024-01-15"
    };
  };

  const handleReviewData = () => {
    if (currentDocument) {
      sessionStorage.setItem('scannedPatientData', JSON.stringify(extractedData));
      sessionStorage.setItem('scannedDocument', JSON.stringify(currentDocument));
      router.push("/patients/scan/review");
    }
  };

  const handleScanAgain = () => {
    setCurrentDocument(null);
    setExtractedData({});
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge className="bg-green-100 text-green-800">High</Badge>;
    if (confidence >= 0.7) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Document Digitization</h1>
        <p className="text-sm text-muted-foreground">
          Scan patient documents to automatically extract information and create patient records
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
            1
          </div>
          <span className="text-sm font-medium">Scan Document</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
            2
          </div>
          <span className="text-sm font-medium">Review & Register</span>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Document Scanner
          </CardTitle>
          <CardDescription>
            Scan medical record form to extract patient information automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentDocument ? (
            <>
              {/* Scan Instructions */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Scan Medical Record</h3>
                  <p className="text-sm text-muted-foreground">
                    Place the medical record form on the scanner and click the button below to begin scanning
                  </p>
                </div>
              </div>

              {/* Scan Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleScanDocument}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Scanning Document...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Scan Medical Record
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Scanned Document Result */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Document Scanned Successfully</p>
                    <p className="text-sm text-green-700">{currentDocument.fileName}</p>
                  </div>
                  {getConfidenceBadge(currentDocument.confidence)}
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{currentDocument.fileName}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${
                          currentDocument.confidence >= 0.9 ? "text-green-600" :
                          currentDocument.confidence >= 0.7 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {(currentDocument.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleScanAgain}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Extracted Data Summary */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Extracted Information</h4>
                  <div className="grid gap-2 text-sm">
                    {extractedData.firstName && (
                      <div>
                        <span className="text-muted-foreground">Patient: </span>
                        <span className="font-medium">{extractedData.firstName} {extractedData.lastName}</span>
                      </div>
                    )}
                    {extractedData.doctorName && (
                      <div>
                        <span className="text-muted-foreground">Doctor: </span>
                        <span className="font-medium">{extractedData.doctorName}</span>
                      </div>
                    )}
                    {extractedData.diagnosis && (
                      <div>
                        <span className="text-muted-foreground">Diagnosis: </span>
                        <span className="font-medium">{extractedData.diagnosis}</span>
                      </div>
                    )}
                    {extractedData.medicalHistory && extractedData.medicalHistory.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Conditions: </span>
                        <span className="font-medium">{extractedData.medicalHistory.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleReviewData}>
                  Review Extracted Data
                </Button>
                <Button variant="outline" onClick={handleScanAgain}>
                  Scan Another
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
