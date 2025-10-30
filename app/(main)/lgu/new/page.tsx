"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const lguFormSchema = z.object({
  name: z.string().min(1, "LGU name is required"),
  code: z.string().min(1, "LGU code is required"),
  region: z.string().min(1, "Region is required"),
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(1, "Address is required"),
  isActive: z.boolean().default(true),
});

type LGUFormValues = z.infer<typeof lguFormSchema>;

const REGIONS = [
  "Region I - Ilocos Region",
  "Region II - Cagayan Valley",
  "Region III - Central Luzon",
  "Region IV-A - CALABARZON",
  "Region IV-B - MIMAROPA",
  "Region V - Bicol Region",
  "Region VI - Western Visayas",
  "Region VII - Central Visayas",
  "Region VIII - Eastern Visayas",
  "Region IX - Zamboanga Peninsula",
  "Region X - Northern Mindanao",
  "Region XI - Davao Region",
  "Region XII - SOCCSKSARGEN",
  "Region XIII - Caraga",
  "NCR - National Capital Region",
  "CAR - Cordillera Administrative Region",
  "BARMM - Bangsamoro Autonomous Region",
];

const PROVINCES_REGION_VII = ["Bohol", "Cebu", "Negros Oriental", "Siquijor"];

export default function NewLGUPage() {
  const router = useRouter();
  const [barangays, setBarangays] = useState<string[]>([]);
  const [newBarangay, setNewBarangay] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LGUFormValues>({
    resolver: zodResolver(lguFormSchema),
    defaultValues: {
      region: "Region VII - Central Visayas",
      province: "Cebu",
      isActive: true,
    },
  });

  const selectedRegion = watch("region");

  const addBarangay = () => {
    if (newBarangay.trim() && !barangays.includes(newBarangay.trim())) {
      setBarangays([...barangays, newBarangay.trim()]);
      setNewBarangay("");
    } else if (barangays.includes(newBarangay.trim())) {
      toast.error("Barangay already added");
    }
  };

  const removeBarangay = (barangay: string) => {
    setBarangays(barangays.filter((b) => b !== barangay));
  };

  const onSubmit = async (data: LGUFormValues) => {
    try {
      setLoading(true);

      if (barangays.length === 0) {
        toast.error("Please add at least one barangay");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newLGU = {
        ...data,
        barangays: barangays.map((name, index) => ({
          id: `brgy-${Date.now()}-${index}`,
          name,
          population: 0,
        })),
        contactInformation: {
          phone: data.phone,
          email: data.email,
          address: data.address,
        },
      };

      console.log("New LGU:", newLGU);

      toast.success("LGU created successfully!");
      router.push("/lgu");
    } catch (error) {
      console.error("Failed to create LGU:", error);
      toast.error("Failed to create LGU");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Add New LGU</h1>
        <p className="text-sm text-muted-foreground">
          Create a new Local Government Unit profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of the LGU
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  LGU Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Dalaguete Rural Health Unit"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">
                  LGU Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="e.g., RHU-DAL-001"
                  {...register("code")}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("region", value)}
                  defaultValue="Region VII - Central Visayas"
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-red-500">
                    {errors.region.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">
                  Province <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("province", value)}
                  defaultValue="Cebu"
                >
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES_REGION_VII.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && (
                  <p className="text-sm text-red-500">
                    {errors.province.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">
                  Municipality <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="municipality"
                  placeholder="e.g., Dalaguete"
                  {...register("municipality")}
                />
                {errors.municipality && (
                  <p className="text-sm text-red-500">
                    {errors.municipality.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Primary contact details for this LGU
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">
                Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPerson"
                placeholder="e.g., Dr. Juan dela Cruz"
                {...register("contactPerson")}
              />
              {errors.contactPerson && (
                <p className="text-sm text-red-500">
                  {errors.contactPerson.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +63 912 345 6789"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., rhu@dalaguete.gov.ph"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Physical Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="e.g., Poblacion, Dalaguete, Cebu"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Barangays */}
        <Card>
          <CardHeader>
            <CardTitle>Barangays</CardTitle>
            <CardDescription>Add all barangays under this LGU</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter barangay name"
                value={newBarangay}
                onChange={(e) => setNewBarangay(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBarangay();
                  }
                }}
              />
              <Button type="button" onClick={addBarangay}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {barangays.length > 0 ? (
              <div className="border rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {barangays.map((barangay) => (
                    <Badge
                      key={barangay}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {barangay}
                      <button
                        type="button"
                        onClick={() => removeBarangay(barangay)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {barangays.length} barangay{barangays.length !== 1 ? "s" : ""}{" "}
                  added
                </p>
              </div>
            ) : (
              <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <p>No barangays added yet</p>
                <p className="text-sm">Add at least one barangay to continue</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create LGU"}
          </Button>
        </div>
      </form>
    </div>
  );
}
