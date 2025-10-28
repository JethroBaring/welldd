"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function CustomReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Custom Reports</h1>
        <p className="text-sm text-muted-foreground">
          Build custom reports with flexible data selection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>
            Advanced reporting tool for custom data analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Custom Report Builder</p>
            <p className="text-sm max-w-md mx-auto">
              Create custom reports by selecting specific data fields, applying filters,
              and choosing your preferred visualization format.
            </p>
            <Button className="mt-6">
              Start Building Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

