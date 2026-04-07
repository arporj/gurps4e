import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Save, Plus, Trash2, Swords, Shield, Zap, Sparkles, BookOpen } from 'lucide-react'
import { MOCK_CHARACTERS } from '@/lib/mocks'

export default function CharacterEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const initialChar = MOCK_CHARACTERS.find(c => c.id === id) || MOCK_CHARACTERS[0]
  const [char, setChar] = useState({
    ...initialChar,
    st: 10,
    dx: 10,
    iq: 10,
    ht: 10,
    hp: 10,
    will: 10,
    per: 10,
    fp: 10
  })

  const [activeTab, setActiveTab] = useState<'stats' | 'traits' | 'skills'>('stats')

  function handleSave() {
    alert('Ficha salva nas crônicas (Local)!')
    navigate('/dashboard')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft className="h-6 w-6 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">{char.name}</h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{char.points} Pontos Totais</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-white/5">
            Descartar
          </button>
          <button onClick={handleSave} className="btn-primary px-8 py-2.5">
            <Save className="h-4 w-4 mr-2" />
            Registrar nos Arquivos
          </button>
        </div>
      </div>

      {/* Character Core Info Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Força (ST)', value: char.st, icon: Swords, color: 'text-red-400' },
          { label: 'Destreza (DX)', value: char.dx, icon: Zap, color: 'text-orange-400' },
          { label: 'Inteligência (IQ)', value: char.iq, icon: BookOpen, color: 'text-blue-400' },
          { label: 'Vigor (HT)', value: char.ht, icon: Shield, color: 'text-green-400' },
        ].map((attr, i) => (
          <div key={i} className="card glass-card p-4 border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{attr.label}</p>
              <div className="flex items-center gap-3">
                <button className="h-6 w-6 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-gurps-600">-</button>
                <span className={`text-2xl font-serif font-bold ${attr.color}`}>{attr.value}</span>
                <button className="h-6 w-6 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-gurps-600">+</button>
              </div>
            </div>
            <attr.icon className={`h-8 w-8 ${attr.color} opacity-20`} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {[
          { id: 'stats', label: 'Atributos & Derivados', icon: Swords },
          { id: 'traits', label: 'Vantagens & Desvantagens', icon: Sparkles },
          { id: 'skills', label: 'Perícias', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${
              activeTab === tab.id ? 'border-gurps-500 text-white bg-gurps-900/10' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="card glass-card p-8 border-white/5 min-h-[400px]">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-white font-bold uppercase text-xs tracking-widest text-slate-400 border-b border-white/5 pb-2">Atributos Secundários</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'HP', value: char.hp },
                  { label: 'Will', value: char.will },
                  { label: 'Per', value: char.per },
                  { label: 'FP', value: char.fp },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{s.label}</span>
                    <span className="text-white font-serif font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-white font-bold uppercase text-xs tracking-widest text-slate-400 border-b border-white/5 pb-2">Reação e Movimento</h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-slate-900/20 rounded-xl">
                  <span className="text-sm text-slate-400">Basic Swift (Move)</span>
                  <span className="text-white font-bold">5</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-900/20 rounded-xl">
                  <span className="text-sm text-slate-400">Dodge</span>
                  <span className="text-white font-bold">8</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'traits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold uppercase text-xs tracking-widest text-slate-400">Lista de Características</h3>
              <button className="flex items-center gap-2 text-[10px] text-gurps-400 hover:text-white uppercase font-bold tracking-widest transition-colors">
                <Plus className="h-4 w-4" />
                Injetar Nova
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Ambidestria', pts: 5, type: 'Adv' },
                { name: 'Sentido de Direção', pts: 5, type: 'Adv' },
                { name: 'Código de Honra (Pirata)', pts: -10, type: 'Disadv' },
              ].map((t, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-white/5 group hover:border-gurps-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.pts > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {t.type}
                    </span>
                    <span className="text-white font-medium">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm ${t.pts > 0 ? 'text-green-400' : 'text-red-400'}`}>{t.pts} CP</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
           <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
             <div className="p-6 bg-slate-900/40 rounded-full">
                <BookOpen className="h-12 w-12 text-slate-700" />
             </div>
             <div>
               <h4 className="text-white font-bold">Livraria de Habilidades</h4>
               <p className="text-slate-500 text-sm max-w-xs">Muitas artes e ofícios estão por vir neste protótipo.</p>
             </div>
             <button className="btn-primary">Aprender Perícia</button>
           </div>
        )}
      </div>
    </div>
  )
}
