"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-border/50 bg-transparent hover:bg-laxmi-champagne/20 hover:border-laxmi-gold/30 transition-all duration-300"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 text-laxmi-gold dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 text-laxmi-gold dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card/95 backdrop-blur-md border-border/50 min-w-[120px]"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-sm font-light tracking-wide cursor-pointer hover:bg-laxmi-champagne/20 focus:bg-laxmi-champagne/20"
        >
          <Sun className="mr-2 h-4 w-4 text-laxmi-gold" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-sm font-light tracking-wide cursor-pointer hover:bg-laxmi-champagne/20 focus:bg-laxmi-champagne/20"
        >
          <Moon className="mr-2 h-4 w-4 text-laxmi-gold" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-sm font-light tracking-wide cursor-pointer hover:bg-laxmi-champagne/20 focus:bg-laxmi-champagne/20"
        >
          <svg
            className="mr-2 h-4 w-4 text-laxmi-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
