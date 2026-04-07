import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Users, MessageSquare, Book, Shield, Swords, Calendar, Settings } from 'lucide-react'
import { MOCK_GROUPS, MOCK_CHARACTERS } from '@/lib/mocks'

export default function GroupDetail() {
  const { id } = useParams()
  const group = MOCK_GROUPS.find(g => g.id === id) || MOCK_GROUPS[0]
  
  // Mock members based on character data
  const members = MOCK_CHARACTERS.map(c => ({
    ...c,
    role: c.id === 'char-1' ? 'Mestre' : 'Jogador'
  }))

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Link 
        to="/groups" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-gurps-400 transition-colors font-mono text-xs uppercase tracking-widest"
      >
        <ChevronLeft className="h-4 w-4" />
        Retornar aos Reinos
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="card glass-card p-8 border-white/5 relative overflow-hidden">
             {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="h-48 w-48 text-white rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-gurps-900/50 text-gurps-400 border border-gurps-500/30 rounded-full text-[10px] font-mono uppercase tracking-tighter">
                  Campanha Ativa
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
                   <Calendar className="h-3 w-3" />
                   Desde Eras Atrás
                </span>
              </div>
              
              <h1 className="text-5xl font-serif font-bold text-white mb-6 leading-tight">
                {group.name}
              </h1>
              
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-gurps-800 pl-6 mb-8">
                "{group.description}"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Sistema', value: 'GURPS 4e', icon: Book },
                  { label: 'Mestre', value: 'ArpoRJ', icon: Shield },
                  { label: 'Membros', value: group.member_count, icon: Users },
                  { label: 'Sessões', value: '12', icon: Swords },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-slate-900/40 rounded-2xl border border-white/5">
                    <stat.icon className="h-4 w-4 text-gurps-500 mb-2" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                    <p className="text-white font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
              <Users className="h-6 w-6 text-gurps-500" />
              Membros do Círculo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(member => (
                <div key={member.id} className="card bg-slate-900/30 p-4 border-white/5 flex items-center justify-between group hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-gurps-400 font-bold overflow-hidden">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-gurps-400 transition-colors">{member.name}</h4>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-600 hover:text-white transition-colors">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="card glass-card p-6 border-white/5">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em] text-slate-400">Ações</h3>
            <div className="space-y-3">
              <button className="btn-primary w-full justify-center">
                <Swords className="h-4 w-4 mr-2" />
                Iniciar Sessão
              </button>
              <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/5">
                <Book className="h-4 w-4" />
                Diário de Jogo
              </button>
              <button className="w-full py-3 px-4 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/10">
                <Settings className="h-4 w-4" />
                Configurações
              </button>
            </div>
          </div>

          <div className="card bg-gurps-900/10 p-6 border-gurps-500/10">
            <p className="text-xs text-gurps-400 font-mono uppercase tracking-widest mb-2">Nota do Mestre</p>
            <p className="text-slate-400 text-sm italic leading-relaxed">
              "A próxima sessão será decisiva. Preparem seus testes de HT e tragam seus suprimentos."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
