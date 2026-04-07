import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <TopBar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          <Outlet />
        </div>
      </main>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gurps-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
