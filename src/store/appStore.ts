import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  darkMode: boolean
  activeTab: string
  sidebarOpen: boolean
  toggleDarkMode: () => void
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      darkMode: false,
      activeTab: 'identity',
      sidebarOpen: false,
      toggleDarkMode: () => set(s => {
        const next = !s.darkMode
        if (next) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
        return { darkMode: next }
      }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'gurps4e-app',
      partialize: (s) => ({ darkMode: s.darkMode }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) document.documentElement.classList.add('dark')
      },
    }
  )
)
