import { Link } from 'react-router-dom'
import { Plus, Users, Scroll, Ghost, ChevronRight, Sparkles } from 'lucide-react'
import { MOCK_CHARACTERS, MOCK_GROUPS } from '@/lib/mocks'

export default function Dashboard() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 flex items-center gap-4">
            O Arquivo das Eras
            <Sparkles className="h-6 w-6 text-gurps-400" />
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">
            Guarde suas lendas, organize suas campanhas e forje seu destino no multiverso.
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/characters/new" className="btn-primary">
            <Plus className="h-5 w-5" />
            Nova Lenda
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Characters Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
              <Scroll className="h-6 w-6 text-gurps-500" />
              Suas Fichas
            </h2>
            <Link to="/characters" className="text-sm font-semibold text-gurps-400 hover:text-gurps-300 transition-colors">Ver todas</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_CHARACTERS.map(char => (
              <Link 
                key={char.id} 
                to={`/characters/${char.id}`} 
                className="group card glass-card hover:bg-slate-900/60 transition-all p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Scroll className="h-20 w-20" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="badge-crimson">{char.gcs_data.total_points} CP</span>
                    <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-gurps-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gurps-400 transition-colors">{char.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{char.gcs_data.profile?.player_name || 'Aventureiro'}</p>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {char.gcs_data.attributes?.slice(0, 4).map((attr: any) => (
                      <div key={attr.attr_id} className="bg-slate-950/50 p-2 rounded-lg border border-white/5 text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-500">{attr.attr_id}</p>
                        <p className="text-sm font-mono text-gurps-200">{10 + attr.adj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}

            <Link 
              to="/characters/new" 
              className="group border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-gurps-600/50 hover:bg-gurps-900/10 transition-all text-slate-500 hover:text-gurps-400"
            >
              <div className="p-4 rounded-full bg-slate-900 border border-slate-800 group-hover:border-gurps-500/30 group-hover:bg-gurps-950/50 transition-all">
                <Plus className="h-8 w-8" />
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Criar Novo Personagem</span>
            </Link>
          </div>
        </div>

        {/* Groups Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
              <Users className="h-6 w-6 text-gurps-500" />
              As Guildas
            </h2>
            <button className="p-1 text-slate-500 hover:text-white transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_GROUPS.map(group => (
              <Link 
                key={group.id} 
                to={`/groups/${group.id}`}
                className="block card glass-card p-5 group hover:bg-slate-900/60 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white group-hover:text-gurps-400 transition-colors uppercase tracking-tight text-sm">
                    {group.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {group.member_count}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                  "{group.description}"
                </p>
              </Link>
            ))}
            
            {MOCK_GROUPS.length === 0 && (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                <Ghost className="h-12 w-12 text-slate-800 mx-auto mb-4" />
                <p className="text-sm text-slate-500">Nenhum grupo encontrado.</p>
              </div>
            )}
            
            <button className="w-full py-4 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-slate-900 transition-all">
              Procurar Guildas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
