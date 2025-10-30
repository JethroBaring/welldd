"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  MapPin,
  TrendingUp,
  Users,
  Activity,
  Bell,
  Search,
  Filter,
  Download,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DiseaseCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: "male" | "female";
  disease: string;
  diagnosisDate: Date;
  barangay: string;
  status: "active" | "recovered" | "deceased";
  severity: "mild" | "moderate" | "severe";
}

interface OutbreakAlert {
  id: string;
  disease: string;
  barangay: string;
  caseCount: number;
  threshold: number;
  severity: "high" | "medium" | "low";
  status: "pending" | "acknowledged" | "contained";
  dateTriggered: Date;
  recommendedAction: string;
}

interface BarangayHotspot {
  barangay: string;
  caseCount: number;
  diseases: { [key: string]: number };
  riskLevel: "high" | "medium" | "low";
}

const COMMON_DISEASES = [
  "All Diseases",
  "Dengue",
  "Tuberculosis",
  "Hypertension",
  "Diabetes",
  "COVID-19",
  "Pneumonia",
  "Diarrhea",
  "Influenza",
  "Measles",
  "Other",
];

const BARANGAYS = [
  "All Barangays",
  "Ablayan",
  "Babayongan",
  "Balud",
  "Banhigan",
  "Caceres",
  "Caleriohan",
  "Caliongan",
  "Cawayan",
  "Consolacion",
  "Coro",
  "Dugyan",
  "Dumalan",
  "Jolomaynon",
  "Langosig",
  "Lumbog",
  "Malones",
  "Manlapay",
  "Manugas",
  "Nalhub",
  "Obo",
  "Panas",
  "Poblacion",
  "Sacsac",
  "Tabon",
  "Tapun",
];

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

export default function DiseaseSurveillancePage() {
  const [cases, setCases] = useState<DiseaseCase[]>([]);
  const [alerts, setAlerts] = useState<OutbreakAlert[]>([]);
  const [hotspots, setHotspots] = useState<BarangayHotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState("All Diseases");
  const [selectedBarangay, setSelectedBarangay] = useState("All Barangays");
  const [selectedGender, setSelectedGender] = useState("all");
  const [ageRange, setAgeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30days");

  useEffect(() => {
    loadSurveillanceData();
  }, []);

  const loadSurveillanceData = async () => {
    try {
      setLoading(true);
      // Simulate API call - In production, this would fetch from backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data generation
      const mockCases: DiseaseCase[] = generateMockCases();
      const mockAlerts: OutbreakAlert[] = generateMockAlerts(mockCases);
      const mockHotspots: BarangayHotspot[] = generateHotspots(mockCases);

      setCases(mockCases);
      setAlerts(mockAlerts);
      setHotspots(mockHotspots);
    } catch (error) {
      console.error("Failed to load surveillance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockCases = (): DiseaseCase[] => {
    const diseases = ["Dengue", "Tuberculosis", "Hypertension", "Diabetes", "COVID-19", "Pneumonia"];
    const barangays = BARANGAYS.slice(1); // Remove "All Barangays"
    const mockData: DiseaseCase[] = [];

    for (let i = 0; i < 150; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      mockData.push({
        id: `case-${i}`,
        patientId: `P-2025-${String(i + 1).padStart(4, "0")}`,
        patientName: `Patient ${i + 1}`,
        age: Math.floor(Math.random() * 80) + 1,
        gender: Math.random() > 0.5 ? "male" : "female",
        disease: diseases[Math.floor(Math.random() * diseases.length)],
        diagnosisDate: subDays(new Date(), daysAgo),
        barangay: barangays[Math.floor(Math.random() * barangays.length)],
        status: Math.random() > 0.2 ? "recovered" : Math.random() > 0.5 ? "active" : "deceased",
        severity: Math.random() > 0.6 ? "mild" : Math.random() > 0.5 ? "moderate" : "severe",
      });
    }

    return mockData;
  };

  const generateMockAlerts = (cases: DiseaseCase[]): OutbreakAlert[] => {
    const alerts: OutbreakAlert[] = [];
    const diseaseThresholds: { [key: string]: number } = {
      Dengue: 10,
      Tuberculosis: 5,
      "COVID-19": 15,
      Pneumonia: 8,
    };

    // Check for outbreaks per barangay and disease
    const barangayDiseaseCount: { [key: string]: { [key: string]: number } } = {};

    cases.forEach((c) => {
      const key = `${c.barangay}-${c.disease}`;
      if (!barangayDiseaseCount[c.barangay]) {
        barangayDiseaseCount[c.barangay] = {};
      }
      barangayDiseaseCount[c.barangay][c.disease] =
        (barangayDiseaseCount[c.barangay][c.disease] || 0) + 1;
    });

    Object.keys(barangayDiseaseCount).forEach((barangay) => {
      Object.keys(barangayDiseaseCount[barangay]).forEach((disease) => {
        const count = barangayDiseaseCount[barangay][disease];
        const threshold = diseaseThresholds[disease] || 10;

        if (count >= threshold) {
          alerts.push({
            id: `alert-${barangay}-${disease}`,
            disease,
            barangay,
            caseCount: count,
            threshold,
            severity: count >= threshold * 2 ? "high" : count >= threshold * 1.5 ? "medium" : "low",
            status: Math.random() > 0.5 ? "acknowledged" : "pending",
            dateTriggered: subDays(new Date(), Math.floor(Math.random() * 7)),
            recommendedAction:
              count >= threshold * 2
                ? "Immediate intervention required - Deploy rapid response team"
                : "Increase surveillance and community health education",
          });
        }
      });
    });

    return alerts;
  };

  const generateHotspots = (cases: DiseaseCase[]): BarangayHotspot[] => {
    const barangayMap: { [key: string]: BarangayHotspot } = {};

    cases.forEach((c) => {
      if (!barangayMap[c.barangay]) {
        barangayMap[c.barangay] = {
          barangay: c.barangay,
          caseCount: 0,
          diseases: {},
          riskLevel: "low",
        };
      }

      barangayMap[c.barangay].caseCount++;
      barangayMap[c.barangay].diseases[c.disease] =
        (barangayMap[c.barangay].diseases[c.disease] || 0) + 1;
    });

    const hotspots = Object.values(barangayMap);

    // Determine risk levels
    hotspots.forEach((h) => {
      if (h.caseCount >= 15) h.riskLevel = "high";
      else if (h.caseCount >= 8) h.riskLevel = "medium";
      else h.riskLevel = "low";
    });

    return hotspots.sort((a, b) => b.caseCount - a.caseCount);
  };

  const getFilteredCases = () => {
    return cases.filter((c) => {
      const matchesDisease =
        selectedDisease === "All Diseases" || c.disease === selectedDisease;
      const matchesBarangay =
        selectedBarangay === "All Barangays" || c.barangay === selectedBarangay;
      const matchesGender = selectedGender === "all" || c.gender === selectedGender;
      const matchesAge =
        ageRange === "all" ||
        (ageRange === "0-17" && c.age < 18) ||
        (ageRange === "18-59" && c.age >= 18 && c.age < 60) ||
        (ageRange === "60+" && c.age >= 60);
      const matchesSearch =
        searchQuery === "" ||
        c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.disease.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDisease && matchesBarangay && matchesGender && matchesAge && matchesSearch;
    });
  };

  const getTrendData = () => {
    const filteredCases = getFilteredCases();
    const days = dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90;
    const data: { date: string; cases: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const casesOnDate = filteredCases.filter(
        (c) => format(c.diagnosisDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ).length;

      data.push({
        date: format(date, "MMM dd"),
        cases: casesOnDate,
      });
    }

    return data;
  };

  const getDiseaseDistribution = () => {
    const filteredCases = getFilteredCases();
    const diseaseMap: { [key: string]: number } = {};

    filteredCases.forEach((c) => {
      diseaseMap[c.disease] = (diseaseMap[c.disease] || 0) + 1;
    });

    return Object.keys(diseaseMap)
      .map((disease) => ({
        name: disease,
        value: diseaseMap[disease],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const getAgeGenderDistribution = () => {
    const filteredCases = getFilteredCases();
    const ageGroups = [
      { name: "0-17", male: 0, female: 0 },
      { name: "18-39", male: 0, female: 0 },
      { name: "40-59", male: 0, female: 0 },
      { name: "60+", male: 0, female: 0 },
    ];

    filteredCases.forEach((c) => {
      let groupIndex = 0;
      if (c.age >= 60) groupIndex = 3;
      else if (c.age >= 40) groupIndex = 2;
      else if (c.age >= 18) groupIndex = 1;

      if (c.gender === "male") ageGroups[groupIndex].male++;
      else ageGroups[groupIndex].female++;
    });

    return ageGroups;
  };

  const filteredCases = getFilteredCases();
  const trendData = getTrendData();
  const diseaseDistribution = getDiseaseDistribution();
  const ageGenderData = getAgeGenderDistribution();

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Disease Surveillance Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time disease mapping and trend monitoring for public health intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadSurveillanceData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCases.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredCases.filter((c) => c.status === "active").length} active cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Outbreaks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter((a) => a.severity === "high").length} require immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotspot Barangays</CardTitle>
            <MapPin className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {hotspots.filter((h) => h.riskLevel === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">High-risk areas identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affected Population</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCases.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(filteredCases.map((c) => c.barangay)).size} barangays
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outbreak Alerts */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <CardTitle>Active Outbreak Alerts</CardTitle>
              </div>
              <Badge variant="destructive">
                {alerts.filter((a) => a.status === "pending").length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{alert.disease}</span>
                      <span className="text-muted-foreground">in {alert.barangay}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.caseCount} cases detected (threshold: {alert.threshold})
                    </p>
                    <p className="text-sm mt-1">{alert.recommendedAction}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={alert.status === "acknowledged" ? "outline" : "default"}
                  >
                    {alert.status === "acknowledged" ? "Acknowledged" : "Acknowledge"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Disease</label>
              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_DISEASES.map((disease) => (
                    <SelectItem key={disease} value={disease}>
                      {disease}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Barangay</label>
              <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BARANGAYS.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age Range</label>
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="0-17">0-17 years</SelectItem>
                  <SelectItem value="18-59">18-59 years</SelectItem>
                  <SelectItem value="60+">60+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Monitoring & Disease Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Disease Trend Over Time</CardTitle>
            <CardDescription>Case counts for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cases" stroke="#3b82f6" fill="#3b82f680" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disease Distribution</CardTitle>
            <CardDescription>Top diseases by case count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Age-Gender Distribution & Barangay Hotspots */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age & Gender Distribution</CardTitle>
            <CardDescription>Demographic breakdown of cases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageGenderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" fill="#3b82f6" name="Male" />
                <Bar dataKey="female" fill="#ec4899" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barangay Hotspots</CardTitle>
            <CardDescription>High-risk areas requiring intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {hotspots.slice(0, 10).map((hotspot) => (
                <div
                  key={hotspot.barangay}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        hotspot.riskLevel === "high"
                          ? "bg-red-500"
                          : hotspot.riskLevel === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{hotspot.barangay}</div>
                      <div className="text-sm text-muted-foreground">
                        {hotspot.caseCount} cases -{" "}
                        {Object.keys(hotspot.diseases).length} diseases
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      hotspot.riskLevel === "high"
                        ? "destructive"
                        : hotspot.riskLevel === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {hotspot.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Case List</CardTitle>
              <CardDescription>
                {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Input
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Barangay</TableHead>
                  <TableHead>Diagnosis Date</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.slice(0, 20).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.patientId}</TableCell>
                    <TableCell>{c.disease}</TableCell>
                    <TableCell>
                      {c.age} / {c.gender === "male" ? "M" : "F"}
                    </TableCell>
                    <TableCell>{c.barangay}</TableCell>
                    <TableCell>{format(c.diagnosisDate, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.severity === "severe"
                            ? "destructive"
                            : c.severity === "moderate"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {c.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "active"
                            ? "default"
                            : c.status === "recovered"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
