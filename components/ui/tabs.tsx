"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({})
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!listRef.current) return
      const activeTab = listRef.current.querySelector('[data-state="active"]')
      if (activeTab) {
        const listRect = listRef.current.getBoundingClientRect()
        const activeRect = activeTab.getBoundingClientRect()
        setIndicatorStyle({
          left: activeRect.left - listRect.left,
          width: activeRect.width,
        })
      }
    }

    updateIndicator()
    const observer = new MutationObserver(updateIndicator)
    if (listRef.current) {
      observer.observe(listRef.current, { attributes: true, subtree: true })
    }
    window.addEventListener('resize', updateIndicator)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex w-fit items-center justify-start gap-8 border-b",
        className
      )}
      {...props}
    >
      {props.children}
      <span
        className="absolute bottom-[-1.5px] h-0.5 bg-teal-600 transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 px-1 pb-3 text-base font-medium text-muted-foreground whitespace-nowrap transition-colors",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-teal-600",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
