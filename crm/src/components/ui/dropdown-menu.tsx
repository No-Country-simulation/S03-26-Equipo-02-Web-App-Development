import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
})

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        setOpen(!open)
        ;(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.onClick?.(e as React.MouseEvent<HTMLElement>)
      },
      ref: triggerRef,
      "aria-expanded": open,
      "aria-haspopup": "menu",
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
      aria-expanded={open}
      aria-haspopup="menu"
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: "start" | "end" | "center"
  className?: string
  sideOffset?: number
}

function DropdownMenuContent({ children, align = "start", className, sideOffset = 4 }: DropdownMenuContentProps) {
  const { open } = React.useContext(DropdownMenuContext)

  if (!open) return null

  const alignStyle: React.CSSProperties =
    align === "end" ? { right: 0, left: "auto" } :
    align === "center" ? { left: "50%", transform: "translateX(-50%)" } :
    { left: 0 }

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-white/80 bg-white/95 backdrop-blur-md p-1 shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)`, ...alignStyle }}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  inset?: boolean
}

function DropdownMenuItem({ children, className, onClick, inset }: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  return (
    <div
      role="menuitem"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
        "transition-colors hover:bg-emerald-50 hover:text-emerald-700",
        "focus:bg-emerald-50 focus:text-emerald-700",
        inset && "pl-8",
        className
      )}
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSubTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuCheckboxItem = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuRadioItem = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuShortcut = ({ children }: { children: React.ReactNode }) => <span className="ml-auto text-xs tracking-widest opacity-60">{children}</span>

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
}
