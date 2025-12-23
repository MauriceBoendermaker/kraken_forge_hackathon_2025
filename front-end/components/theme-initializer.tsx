"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load theme from localStorage (default to dark)
      const savedTheme = localStorage.getItem("settings-theme") || "dark"
      const savedHighContrast = localStorage.getItem("settings-high-contrast")

      // Apply theme
      const root = document.documentElement
      if (savedTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }

      // Apply high contrast only if dark mode is enabled
      if (savedHighContrast === "true" && savedTheme === "dark") {
        root.classList.add("high-contrast")
      } else {
        root.classList.remove("high-contrast")
      }
    }
  }, [])

  return null
}
