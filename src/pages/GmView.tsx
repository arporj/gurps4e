import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Users, Swords, Shield, Heart, Zap, Book, MessageSquare, Plus, MoreVertical } from 'lucide-react'
import { MOCK_GROUPS, MOCK_CHARACTERS } from '@/lib/mocks'

export default function GmView() {
  const { id } = useParams()
  const group = MOCK_GROUPS.find(g => g.id === id) || MOCK_GROUPS[0]
  const players = MOCK_CHARACTERS

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to={`/groups/${id}`} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft className="h-6 w-6 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Painel do Mestre</h1>
            <p className="text-gurps-500 font-mono text-[10px] uppercase tracking-widest">{group.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Players Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-3">
            <Users className="h-5 w-5 text-gurps-500" />
            Status dos Aventureiros
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {players.map(player => (
              <div key={player.id} className="card glass-card p-6 border-white/5 flex flex-col md:flex-row md:items-center gap-6 group hover:border-gurps-500/20 transition-all">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="h-12 w-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-gurps-400 font-bold overflow-hidden">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{player.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">GURPS 4e • {player.points} pts</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                      <span>HP</span>
                      <span className="text-red-400">12 / 12</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                      <span>FP</span>
                      <span className="text-orange-400">10 / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Dodge</span>
                    <span className="text-white font-serif font-bold">8</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">DR</span>
                    <span className="text-white font-serif font-bold">2</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-600 hover:text-white transition-colors">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-slate-600 hover:text-gurps-400 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GM Tools Sidebar */}
        <div className="space-y-6">
          <div className="card glass-card p-6 border-white/5">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em] text-slate-400">Dados da Sessão</h3>
            <div className="space-y-4">
               <div className="p-4 bg-slate-900/40 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Rolar 3d6</p>
                  <button className="text-3xl font-serif font-bold text-gurps-400 hover:scale-110 transition-transform">10</button>
               </div>
               <div className="space-y-2">
                 <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all border border-white/5 flex items-center gap-3">
                   <Shield className="h-4 w-4 text-gurps-500" />
                   Tabela de Danos
                 </button>
                 <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all border border-white/5 flex items-center gap-3">
                   <Zap className="h-4 w-4 text-gurps-500" />
                   Efeitos de Status
                 </button>
               </div>
            </div>
          </div>

          <div className="card bg-slate-900/40 p-6 border-white/5">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em] text-slate-400 flex items-center justify-between">
              Notas Rápidas
              <Plus className="h-4 w-4 hover:text-white cursor-pointer transition-colors" />
            </h3>
            <div className="space-y-3">
              <div className="text-xs text-slate-400 italic bg-slate-800/30 p-3 rounded-lg border-l-2 border-gurps-600">
                Lembrar de cobrar teste de Per contra a emboscada no desfiladeiro.
              </div>
              <div className="text-xs text-slate-400 italic bg-slate-800/30 p-3 rounded-lg border-l-2 border-slate-700">
                O mercador tem uma cicatriz na mão esquerda.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
