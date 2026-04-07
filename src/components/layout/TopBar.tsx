import { Link, useNavigate } from 'react-router-dom'
import { Swords, LayoutDashboard, Users, LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { useAppStore } from '@/store/appStore'
import UserBadge from '@/components/auth/UserBadge'

export default function TopBar() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/5 mx-4 mt-4 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="bg-gurps-600 p-1.5 rounded-lg shadow-lg shadow-gurps-900/40 border border-gurps-500/30">
            <Swords className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-xl tracking-tighter text-white font-bold hidden sm:block">GURPS <span className="text-gurps-500">4e</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1 rounded-xl border border-white/5">
          <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> 
            <span>O Arquivo</span>
          </Link>
          <Link to="/groups" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-2">
            <Users className="h-4 w-4" /> 
            <span>As Guildas</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {profile && (
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-white uppercase tracking-widest">{profile.display_name}</p>
                <p className="text-[10px] text-slate-400 font-mono">@{profile.username}</p>
              </div>
              <UserBadge profile={profile} size="sm" />
            </div>
          )}
          <button 
            onClick={handleSignOut} 
            className="p-2 text-slate-400 hover:text-gurps-500 transition-colors"
            title="Sair do Reino"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
