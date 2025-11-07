"use client";

import { IconCirclePlusFilled, IconMail, IconChevronRight, type Icon } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
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
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);
  const [activeItemRect, setActiveItemRect] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);
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

  useEffect(() => {
    if (!menuRef.current) return;

    const activeButton = menuRef.current.querySelector(
      '[data-active="true"]'
    ) as HTMLElement;

    if (activeButton && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setActiveItemRect({
        top: buttonRect.top - menuRect.top,
        height: buttonRect.height,
      });
    }
  }, [pathname, openItems, state]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className=" gap-3" ref={menuRef}>
          {/* Floating highlight indicator */}
          {activeItemRect && (
            <div
              className="absolute left-0 right-0 bg-sidebar-accent rounded-md pointer-events-none transition-all duration-300 ease-in-out"
              style={{
                transform: `translateY(${activeItemRect.top}px)`,
                height: `${activeItemRect.height}px`,
              }}
            />
          )}
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
                    onOpenChange={(open) => {
                      setPopoverOpen(open ? item.title : null);
                      if (open) {
                        setTooltipOpen(null);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <div
                        onMouseEnter={() => {
                          if (popoverOpen !== item.title) {
                            setTooltipOpen(item.title);
                          }
                        }}
                        onMouseLeave={() => setTooltipOpen(null)}
                      >
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={popoverOpen === item.title ? undefined : (tooltipOpen === item.title ? item.title : undefined)}
                          className={cn(
                            "group-data-[collapsible=icon]:overflow-visible relative z-10",
                            isActive && "bg-transparent"
                          )}
                        >
                          <div className="relative flex size-full items-center justify-start">
                            {item.icon && <item.icon className="size-6!" />}
                            <IconChevronRight
                              className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-sidebar-foreground/70"
                            />
                          </div>
                        </SidebarMenuButton>
                      </div>
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
                    className={cn(
                      "relative z-10",
                      (isActive && !hasSubItems) && "bg-transparent"
                    )}
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
                        <SidebarMenuSubButton
                          asChild
                          size="sm"
                          isActive={isPathActive(subItem.url)}
                          className={cn(
                            "relative z-10",
                            isPathActive(subItem.url) && "bg-transparent"
                          )}
                        >
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
