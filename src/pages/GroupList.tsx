import { Link } from 'react-router-dom'
import { Plus, Users, Search, ChevronRight, Shield, Swords, Map } from 'lucide-react'
import { MOCK_GROUPS } from '@/lib/mocks'

export default function GroupList() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">Círculos e Guildas</h1>
          <p className="text-slate-400 max-w-xl">
            Junte-se a uma companhia existente ou funde o seu próprio reino para novas aventuras.
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-5 w-5" />
          Fudar Círculo
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
        <input 
          placeholder="Procurar por nome da guilda ou mestre..." 
          className="input pl-12 bg-slate-900/40 border-white/5 py-3 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_GROUPS.map(group => (
          <Link 
            key={group.id} 
            to={`/groups/${group.id}`}
            className="group block card glass-card p-6 hover:bg-slate-900/60 transition-all border-white/5"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-800 rounded-xl border border-white/5 group-hover:border-gurps-500/30 transition-colors">
                  {group.id === 'group-1' ? <Map className="h-6 w-6 text-gurps-400" /> : <Shield className="h-6 w-6 text-gurps-400" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gurps-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Liderança de ArpoRJ</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-gurps-500 transition-all group-hover:translate-x-1" />
            </div>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2 italic">
              "{group.description}"
            </p>

            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-bold text-slate-300">{group.member_count} <span className="text-slate-500 font-normal">Membros</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Swords className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-bold text-slate-300">GURPS <span className="text-slate-500 font-normal">4e</span></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
