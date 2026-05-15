'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Mode = 'test' | 'live'

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  isTestMode: boolean
  isLiveMode: boolean
  apiKeyPrefix: string
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('test')

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('hedge-dashboard-mode') as Mode
    if (savedMode === 'test' || savedMode === 'live') {
      setModeState(savedMode)
    }
  }, [])

  const setMode = (newMode: Mode) => {
    setModeState(newMode)
    localStorage.setItem('hedge-dashboard-mode', newMode)
  }

  const value: ModeContextType = {
    mode,
    setMode,
    isTestMode: mode === 'test',
    isLiveMode: mode === 'live',
    apiKeyPrefix: mode === 'test' ? 'pk_test_' : 'pk_live_',
  }

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
