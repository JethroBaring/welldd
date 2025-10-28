"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Package, 
  Users, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function ReportsPage() {
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  const reportTypes = [
    {
      title: "Inventory Reports",
      description: "View reports on received, dispensed, and expired medicines",
      icon: Package,
      href: "/reports/inventory",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      visible: permissions.canViewReports,
    },
    {
      title: "Medical Reports",
      description: "Patient demographics and medical record activity reports",
      icon: Users,
      href: "/reports/medical",
      color: "text-green-500",
      bgColor: "bg-green-50",
      visible: permissions.canViewReports && permissions.canManagePatients,
    },
    {
      title: "Custom Reports",
      description: "Build custom reports with flexible data selection",
      icon: TrendingUp,
      href: "/reports/custom",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      visible: permissions.canExportReports,
    },
  ];

  const visibleReports = reportTypes.filter(report => report.visible);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate and export reports for inventory, patients, and operations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleReports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={report.href}>
                  <Button variant="outline" className="w-full">
                    View Reports
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {visibleReports.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            You don't have permission to view any reports.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Available export formats for reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">PDF Export</h4>
                <p className="text-sm text-muted-foreground">
                  Printable reports for physical documentation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">CSV Export</h4>
                <p className="text-sm text-muted-foreground">
                  Data export for Excel and external systems
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

