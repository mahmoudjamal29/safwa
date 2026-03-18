'use client'

import { createContext, useCallback, useContext, useState } from 'react'

interface CommandPaletteContextType {
  close: () => void
  isOpen: boolean
  open: () => void
  toggle: () => void
}

const CommandPaletteContext = createContext<
  CommandPaletteContextType | undefined
>(undefined)

export function CommandPaletteProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])
  const open = useCallback(() => setIsOpen(true), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <CommandPaletteContext.Provider value={{ close, isOpen, open, toggle }}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (context === undefined) {
    throw new Error(
      'useCommandPalette must be used within a CommandPaletteProvider'
    )
  }
  return context
}
