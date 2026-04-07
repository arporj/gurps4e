import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { Swords } from 'lucide-react'

export default function Landing() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gurps-900/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-900/10 blur-[140px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gurps-600 rounded-2xl shadow-2xl shadow-gurps-900/50 border border-gurps-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Swords className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tighter mb-3">
            O Portal de <span className="text-gurps-500 italic">Gurps</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Forje suas lendas na 4ª Edição</p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/5">
          <div className="flex p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-gurps-600 text-white shadow-lg shadow-gurps-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-gurps-600 text-white shadow-lg shadow-gurps-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Cadastrar
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {mode === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setMode('login')} />}
          </div>
        </div>

        <p className="text-center mt-8 text-slate-600 text-xs font-mono uppercase tracking-[0.2em]">
          Versão Protótipo 0.1.0 • O Arquivo das Eras
        </p>
      </div>
    </div>
  )
}
