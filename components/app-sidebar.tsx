"use client";

import {
  IconActivity,
  IconBox,
  IconBuilding,
  IconClipboardList,
  IconDashboard,
  IconFileText,
  IconPackage,
  IconSettings,
  IconShoppingCart,
  IconTransfer,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
      title: "Procurement",
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
          title: "Purchase Invoice",
          url: "/purchasing/invoices",
          roles: ["super_admin", "gso_staff", "admin_staff"],
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
          title: "Dispense",
          url: "/inventory/dispense",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Warehouse Receiving",
          url: "/inventory/receiving",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Stock Issuance Receiving",
          url: "/inventory/issuance-receiving",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Stock Issuance",
          url: "/inventory/issuance",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Deliveries",
          url: "/inventory/deliveries",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Items",
          url: "/inventory/items",
          roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
        },
        {
          title: "Adjustments",
          url: "/inventory/adjustments",
          roles: ["super_admin", "gso_staff"],
        },
        {
          title: "Inventory Movement",
          url: "/inventory/movement",
          roles: ["super_admin", "gso_staff"],
        },
      ],
    },
    {
      title: "Patients",
      url: "/patients",
      icon: IconUsers,
      roles: ["super_admin", "medical_staff", "admin_staff"],
      // items: [
      //   {
      //     title: "Patient List",
      //     url: "/patients",
      //     roles: ["super_admin", "medical_staff", "admin_staff"],
      //   },
      //   {
      //     title: "Scan Documents",
      //     url: "/patients/scan",
      //     roles: ["super_admin", "medical_staff", "admin_staff"],
      //   },
      // ],
    },
    // {
    //   title: "Disease Surveillance",
    //   url: "/surveillance",
    //   icon: IconActivity,
    //   roles: ["super_admin", "medical_staff", "admin_staff"],
    // },
    // {
    //   title: "Suppliers",
    //   url: "/suppliers",
    //   icon: IconBuilding,
    //   roles: ["super_admin", "gso_staff", "admin_staff"],
    // },
    // {
    //   title: "User Management",
    //   url: "/users",
    //   icon: IconUserCog,
    //   roles: ["super_admin"],
    // },
    // {
    //   title: "LGU Management",
    //   url: "/lgu",
    //   icon: IconUsers,
    //   roles: ["super_admin", "admin_staff"],
    // },
    {
      title: "Reports",
      url: "/reports",
      icon: IconFileText,
      roles: ["super_admin", "gso_staff", "medical_staff", "admin_staff"],
      items: [
        {
          title: "Inventory Reports",
          url: "/reports/inventory",
          roles: ["super_admin", "gso_staff", "admin_staff"],
        },
        {
          title: "Patient Reports",
          url: "/reports/medical",
          roles: ["super_admin", "medical_staff", "admin_staff"],
        },
        {
          title: "Integrated Reports",
          url: "/reports/integrated",
          roles: ["super_admin", "admin_staff"],
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
  const { currentRole } = useAuthStore();
  const validRoles = [
    "super_admin",
    "gso_staff",
    "medical_staff",
    "admin_staff",
  ] as const;

  // Effective role from localStorage with fallback to store
  const [effectiveRole, setEffectiveRole] =
    React.useState<UserRole>(currentRole);

  React.useEffect(() => {
    try {
      const storedRole = (
        typeof window !== "undefined"
          ? window.localStorage.getItem("role")
          : null
      ) as UserRole | null;
      if (
        storedRole &&
        (validRoles as readonly string[]).includes(storedRole)
      ) {
        setEffectiveRole(storedRole);
      } else {
        setEffectiveRole(currentRole);
      }
    } catch {
      setEffectiveRole(currentRole);
    }
  }, [currentRole]);

  // Update when localStorage role is changed in another tab or code
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "role") {
        const val = e.newValue as UserRole | null;
        if (val && (validRoles as readonly string[]).includes(val)) {
          setEffectiveRole(val);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <a
          href="/dashboard"
          className="flex justify-center items-center px-2 group-data-[collapsible=icon]:mb-6"
        >
          <Image
            src="/fullname-white-logo.png"
            alt="WellSync Logo"
            width={120}
            height={120}
            className="group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/white-logo.png"
            alt="WellSync Icon"
            width={40}
            height={40}
            className="hidden group-data-[collapsible=icon]:block"
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
