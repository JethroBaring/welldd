"use client";

import {
    IconBox,
    IconBuilding,
    IconClipboardList,
    IconDashboard,
    IconFileText,
    IconPackage,
    IconSettings,
    IconShoppingCart,
    IconTransfer,
    IconUsers
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/types/user";
import Image from "next/image";

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  gso_staff: "GSO Staff",
  medical_staff: "Medical Staff",
  admin_staff: "Admin Staff",
};

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
    },
    {
      title: "Purchasing",
      url: "#",
      icon: IconShoppingCart,
      roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
      items: [
        {
          title: "Purchase Requests",
          url: "/purchasing/requests",
          roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
        },
        {
          title: "Purchase Orders",
          url: "/purchasing/orders",
          roles: ["super_admin", "gso_staff", "admin_staff"],
        },
        {
          title: "Receiving",
          url: "/purchasing/receiving",
          roles: ["super_admin", "gso_staff"],
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: IconBox,
      roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
      items: [
        {
          title: "Items",
          url: "/inventory/items",
          roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
        },
        {
          title: "Dispense",
          url: "/inventory/dispense",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Transfer Out",
          url: "/inventory/transfer",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Adjustments",
          url: "/inventory/adjustments",
          roles: ["super_admin", "gso_staff"],
        },
      ],
    },
    {
      title: "Patients",
      url: "#",
      icon: IconUsers,
      roles: ["super_admin", "medical_staff", "admin_staff"],
      items: [
        {
          title: "Patient List",
          url: "/patients",
          roles: ["super_admin", "medical_staff", "admin_staff"],
        },
        {
          title: "Scan Documents",
          url: "/patients/scan",
          roles: ["super_admin", "medical_staff", "admin_staff"],
        },
      ],
    },
    {
      title: "Suppliers",
      url: "/suppliers",
      icon: IconBuilding,
      roles: ["super_admin", "gso_staff", "admin_staff"],
    },
    {
      title: "LGU Management",
      url: "/lgu",
      icon: IconUsers,
      roles: ["super_admin", "admin_staff"],
    },
    {
      title: "Reports",
      url: "#",
      icon: IconFileText,
      roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
      items: [
        {
          title: "Inventory Reports",
          url: "/reports/inventory",
          roles: ["super_admin", "gso_staff", "admin_staff"],
        },
        {
          title: "Medical Reports",
          url: "/reports/medical",
          roles: ["super_admin", "medical_staff", "admin_staff"],
        },
        {
          title: "Custom Reports",
          url: "/reports/custom",
          roles: ["super_admin", "admin_staff"],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentRole, setRole } = useAuthStore();
  const validRoles = ["super_admin", "gso_staff", "medical_staff", "admin_staff"] as const;

  // Effective role from localStorage with fallback to store
  const [effectiveRole, setEffectiveRole] = React.useState<UserRole>(currentRole);

  React.useEffect(() => {
    try {
      const storedRole = (typeof window !== 'undefined' ? window.localStorage.getItem('role') : null) as UserRole | null;
      if (storedRole && (validRoles as readonly string[]).includes(storedRole)) {
        setEffectiveRole(storedRole);
        if (storedRole !== currentRole) setRole(storedRole);
      } else {
        // Persist current role if nothing stored
        if (typeof window !== 'undefined') window.localStorage.setItem('role', currentRole);
        setEffectiveRole(currentRole);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep localStorage in sync when role changes elsewhere
  React.useEffect(() => {
    setEffectiveRole(currentRole);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('role', currentRole);
    } catch {}
  }, [currentRole]);

  // Filter navigation items based on current role
  const filterNavByRole = (items: any[]): any[] => {
    return items
      .filter((item) => !item.roles || item.roles.includes(effectiveRole))
      .map((item) => ({
        ...item,
        items: item.items ? filterNavByRole(item.items) : undefined,
      }));
  };

  const filteredNavMain = filterNavByRole(navData.navMain);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <a href="/dashboard" className="px-2">
          <Image
            src="/fullname-white-logo.png"
            alt="WellSync Logo"
            width={100}
            height={100}
          />
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  );
}
