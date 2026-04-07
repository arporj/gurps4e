import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '@/lib/auth'
import { Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
      <div>
        <label className="label block mb-1">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input pl-9" placeholder="seu@email.com" required />
        </div>
      </div>
      <div>
        <label className="label block mb-1">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input pl-9" placeholder="••••••••" required />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg shadow-gurps-900/20">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Entrar'}
      </button>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-medium tracking-wider">Ou Protótipo</span></div>
      </div>

      <button 
        type="button" 
        onClick={() => {
          localStorage.setItem('mock_session', 'true')
          window.location.reload()
        }}
        className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
      >
        Entrar como ArpoRJ (Mock)
      </button>
    </form>
  )
}
