import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Landing from '@/pages/Landing'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import CharacterEdit from '@/pages/CharacterEdit'
import GroupList from '@/pages/GroupList'
import GroupDetail from '@/pages/GroupDetail'
import GmView from '@/pages/GmView'
import InviteAccept from '@/pages/InviteAccept'
import AppShell from '@/components/layout/AppShell'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gurps-600" /></div>
  if (!session) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gurps-600" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/register" element={session ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/invite/:token" element={<InviteAccept />} />
      <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/characters/new" element={<CharacterEdit />} />
        <Route path="/characters/:id" element={<CharacterEdit />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/new" element={<GroupDetail />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
        <Route path="/groups/:id/gm" element={<GmView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
