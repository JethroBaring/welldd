"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createPatient } from "@/lib/api";

export default function NewPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female" | "other",
    barangay: "",
    contactNumber: "",
    email: "",
    bloodType: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    // New fields
    height: "",
    weight: "",
    immunizationRecords: "",
    labTestResults: "",
    bmi: ""
  });

  // Add computeBMI utility for auto-calculation
  const computeBMI = (weight: string, height: string) => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return "";
    return (w / (h * h)).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const dob = new Date(formData.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();

      await createPatient({
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        dateOfBirth: dob,
        age,
        gender: formData.gender,
        address: {
          barangay: formData.barangay,
          municipality: "Dalaguete",
          province: "Cebu",
        },
        contactNumber: formData.contactNumber || undefined,
        email: formData.email || undefined,
        bloodType: formData.bloodType || undefined,
        emergencyContact: formData.emergencyContactName
          ? {
              name: formData.emergencyContactName,
              relationship: formData.emergencyContactRelationship,
              phone: formData.emergencyContactPhone,
            }
          : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bmi: formData.bmi ? parseFloat(formData.bmi) : (formData.height && formData.weight ? parseFloat(computeBMI(formData.weight, formData.height)) : undefined),
        immunizationRecords: formData.immunizationRecords ? formData.immunizationRecords.split(',').map(v => v.trim()) : undefined,
        labTestResults: formData.labTestResults ? formData.labTestResults.split(',').map(v => v.trim()) : undefined,
      });

      toast.success("Patient registered successfully");
      router.push("/patients");
    } catch (error) {
      console.error("Failed to create patient:", error);
      toast.error("Failed to register patient");
    }
  };

  return (
    <div className="mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/patients")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Patients
      </Button>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">New Patient Registration</h1>
        <p className="text-sm text-muted-foreground">Register a new patient in the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic patient demographic information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => {
                  const height = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    height,
                    bmi: computeBMI(prev.weight, height)
                  }));
                }}
                placeholder="170"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => {
                  const weight = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    weight,
                    bmi: computeBMI(weight, prev.height)
                  }));
                }}
                placeholder="70"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>BMI</Label>
              <Input value={formData.bmi} readOnly placeholder="Auto-calculated" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              <Input
                id="barangay"
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relationship</Label>
              <Input
                id="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactRelationship: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="emergencyContactPhone">Phone Number</Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactPhone: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Immunization & Labs</CardTitle>
            <CardDescription>Immunization history and lab/test results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="immunizationRecords">Immunization Records</Label>
              <Input
                id="immunizationRecords"
                value={formData.immunizationRecords}
                onChange={e => setFormData({ ...formData, immunizationRecords: e.target.value })}
                placeholder="MMR (2020), Hep B (2020), ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labTestResults">Lab & Test Results</Label>
              <Input
                id="labTestResults"
                value={formData.labTestResults}
                onChange={e => setFormData({ ...formData, labTestResults: e.target.value })}
                placeholder="CBC Normal (2024-01), ..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Register Patient</Button>
        </div>
      </form>
    </div>
  );
}

