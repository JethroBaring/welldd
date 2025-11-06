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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const { state } = useSidebar();

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
    );
  };

  const isPathActive = (url: string) => {
    if (url === "#") return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const hasActiveSubItem = (subitems?: NavItem[]) => {
    if (!subitems) return false;
    return subitems.some(subItem => isPathActive(subItem.url));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className=" gap-3">
          {items.map((item) => {
            const hasSubItems = item.items && item.items.length > 0;
            const isOpen = openItems.includes(item.title);
            const isActive = isPathActive(item.url) || hasActiveSubItem(item.items);
            const isCollapsed = state === 'collapsed';

            if (hasSubItems && isCollapsed) {
              return (
                <SidebarMenuItem key={item.title}>
                  <Popover
                    open={popoverOpen === item.title}
                    onOpenChange={(open) => setPopoverOpen(open ? item.title : null)}
                  >
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className="group-data-[collapsible=icon]:overflow-visible"
                      >
                        <div className="relative flex size-full items-center justify-start">
                          {item.icon && <item.icon className="size-6!" />}
                          <IconChevronRight
                            className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-sidebar-foreground/70"
                          />
                        </div>
                      </SidebarMenuButton>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" sideOffset={16} className="w-56 p-2">
                      <div className="text-sm font-medium mb-2">{item.title}</div>
                      <div className="flex flex-col gap-1">
                        {item.items!.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={cn(
                              "px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-white transition-colors",
                              isPathActive(subItem.url) && "bg-accent text-white font-medium"
                            )}
                            onClick={() => setPopoverOpen(null)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </SidebarMenuItem>
              );
            }

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
                        {item.icon && (
                          <item.icon
                            className="size-6! shrink-0"
                          />
                        )}
                        <span className="flex-1">{item.title}</span>
                        <IconChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform shrink-0",
                            isOpen && "rotate-90"
                          )}
                        />
                      </div>
                    ) : (
                      <Link href={item.url} className={cn("flex items-center w-full gap-2")}>
                        {item.icon && <item.icon className="size-6! shrink-0" />}
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {hasSubItems && isOpen && !isCollapsed && (
                  <SidebarMenuSub>
                    {item.items!.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild size="sm" isActive={isPathActive(subItem.url)}>
                          <Link href={subItem.url}>
                            <span className="pl-2">{subItem.title}</span>
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
