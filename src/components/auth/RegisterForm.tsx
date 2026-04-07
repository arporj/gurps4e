import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp, checkUsernameAvailable, USERNAME_REGEX } from '@/lib/auth'
import { Mail, Lock, User, AtSign, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface Props { onSuccess?: () => void }

export default function RegisterForm({ onSuccess }: Props) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!form.username) { setUsernameStatus('idle'); return }
    if (!USERNAME_REGEX.test(form.username)) { setUsernameStatus('invalid'); return }
    setUsernameStatus('checking')
    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailable(form.username)
      setUsernameStatus(available ? 'available' : 'taken')
    }, 500)
    return () => clearTimeout(timer)
  }, [form.username])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (usernameStatus !== 'available') return
    setLoading(true)
    setError(null)
    try {
      await signUp(form.email, form.password, form.username, form.displayName || form.username)
      onSuccess?.()
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  const usernameIcon = {
    idle: null,
    checking: <Loader2 className="h-4 w-4 animate-spin text-slate-400" />,
    available: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    taken: <XCircle className="h-4 w-4 text-red-500" />,
    invalid: <XCircle className="h-4 w-4 text-red-500" />,
  }[usernameStatus]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-950/30 border border-red-500/20 p-4 text-xs text-red-400 font-mono animate-in shake-in-1 duration-300">
          <p className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Nome Único</label>
          <div className="relative">
            <AtSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="input pl-9 pr-9" placeholder="ArpoRJ" required />
            {usernameIcon && <span className="absolute right-3 top-3">{usernameIcon}</span>}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 uppercase font-bold tracking-tighter">
            {usernameStatus === 'invalid' && '3-24 carac: a-z, 0-9, _, -'}
            {usernameStatus === 'taken' && <span className="text-red-500">Já em uso</span>}
            {usernameStatus === 'available' && <span className="text-green-500">Livre para uso</span>}
            {usernameStatus === 'idle' && 'Como outros te verão'}
          </p>
        </div>

        <div>
          <label className="label">Título/Exibição</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} className="input pl-9" placeholder="André Ric" />
          </div>
        </div>
      </div>

      <div>
        <label className="label">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input pl-9" placeholder="mestre@reino.com" required />
        </div>
      </div>

      <div>
        <label className="label">Chave de Acesso</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input pl-9" placeholder="••••••••" minLength={6} required />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || (usernameStatus !== 'available' && usernameStatus !== 'idle')} 
        className="btn-primary w-full mt-4 py-3.5"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Invocar Identidade'}
      </button>
    </form>
  )
}
