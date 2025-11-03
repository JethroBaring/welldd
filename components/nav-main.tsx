"use client";

import { IconCirclePlusFilled, IconMail, IconChevronRight, type Icon } from "@tabler/icons-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  items?: NavItem[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
    );
  };

  // Check if a path is active
  const isPathActive = (url: string) => {
    if (url === "#") return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  // Check if any subitem is active
  const hasActiveSubItem = (subitems?: NavItem[]) => {
    if (!subitems) return false;
    return subitems.some(subItem => isPathActive(subItem.url));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasSubItems = item.items && item.items.length > 0;
            const isOpen = openItems.includes(item.title);
            const isActive = isPathActive(item.url) || hasActiveSubItem(item.items);

            return (
              <div key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild={!hasSubItems}
                    onClick={hasSubItems ? () => toggleItem(item.title) : undefined}
                    tooltip={item.title}
                    isActive={isActive && !hasSubItems}
                  >
                    {hasSubItems ? (
                      <div className="flex items-center gap-2 w-full">
                        {item.icon && <item.icon className="h-5 w-5 shrink-0 size-5!" />}
                        <span className="flex-1">{item.title}</span>
                        <IconChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform shrink-0",
                            isOpen && "rotate-90"
                          )}
                        />
                      </div>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-2 w-full">
                        {item.icon && <item.icon className="h-5 w-5 shrink-0 size-5!" />}
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {hasSubItems && isOpen && (
                  <SidebarMenuSub>
                    {item.items!.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isPathActive(subItem.url)}>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
