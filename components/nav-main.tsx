"use client";

import { IconChevronRight, type Icon } from "@tabler/icons-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
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
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const observedActiveElRef = useRef<HTMLElement | null>(null);
  const lastRectRef = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
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

  const updateActiveRect = useCallback(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;

    const subActive = menuEl.querySelector('[data-sidebar="menu-sub-button"][data-active="true"]') as HTMLElement | null;
    const mainActive = menuEl.querySelector('[data-sidebar="menu-button"][data-active="true"]') as HTMLElement | null;
    const activeEl = subActive ?? mainActive;
    activeElRef.current = activeEl;

    if (!activeEl) {
      if (lastRectRef.current !== null) {
        lastRectRef.current = null;
      }
      setActiveItemRect(null);
      return;
    }

    const menuRect = menuEl.getBoundingClientRect();
    const buttonRect = activeEl.getBoundingClientRect();
    const nextRect = {
      top: buttonRect.top - menuRect.top,
      left: buttonRect.left - menuRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
    };

    const prev = lastRectRef.current;
    if (
      !prev ||
      prev.top !== nextRect.top ||
      prev.left !== nextRect.left ||
      prev.width !== nextRect.width ||
      prev.height !== nextRect.height
    ) {
      lastRectRef.current = nextRect;
      setActiveItemRect(nextRect);
    }
  }, []);

  useEffect(() => {
    // Initial measurement on dependency change.
    updateActiveRect();

    const menuEl = menuRef.current;
    const activeEl = activeElRef.current;

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateActiveRect();
      });
    }

    if (menuEl) {
      resizeObserverRef.current.observe(menuEl);
    }

    if (activeEl) {
      if (observedActiveElRef.current && observedActiveElRef.current !== activeEl) {
        try {
          resizeObserverRef.current.unobserve(observedActiveElRef.current);
        } catch {}
      }
      resizeObserverRef.current.observe(activeEl);
      observedActiveElRef.current = activeEl;

      const onTransitionEnd = () => updateActiveRect();
      activeEl.addEventListener('transitionend', onTransitionEnd);

      return () => {
        activeEl.removeEventListener('transitionend', onTransitionEnd);
      };
    }

    return () => {
      // Cleanup on effect re-run or unmount
      if (resizeObserverRef.current) {
        if (menuEl) {
          try {
            resizeObserverRef.current.unobserve(menuEl);
          } catch {}
        }
        if (observedActiveElRef.current) {
          try {
            resizeObserverRef.current.unobserve(observedActiveElRef.current);
          } catch {}
          observedActiveElRef.current = null;
        }
      }
    };
  }, [pathname, openItems, state, updateActiveRect]);

  // Smoothly track width/left during collapsed/expanded transitions to avoid lag.
  useEffect(() => {
    let rafId: number | null = null;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      updateActiveRect();
      if (ts - start < 240) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [state, updateActiveRect]);

  const isCollapsed = state === 'collapsed';
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className=" gap-3" ref={menuRef}>
          {/* Floating highlight indicator */}
          {activeItemRect && (
            <div
              className="absolute bg-sidebar-accent rounded-md pointer-events-none transition-[transform,height] duration-200 ease-out z-0"
              style={{
                transform: `translate(${activeItemRect.left}px, ${activeItemRect.top}px)`,
                height: `${activeItemRect.height}px`,
                width: `${activeItemRect.width}px`,
                willChange: 'transform, height',
              }}
            />
          )}
          {items.map((item) => {
            const hasSubItems = item.items && item.items.length > 0;
            const isOpen = openItems.includes(item.title);
            const isActive = isPathActive(item.url) || hasActiveSubItem(item.items);
            

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
                    isActive={isActive}
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
