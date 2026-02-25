import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface LogoutPageProps {
  onLogout: () => void
}

export function LogoutPage({ onLogout }: LogoutPageProps) {
  const navigate = useNavigate()

  useEffect(() => {
    onLogout()
    navigate('/login', { replace: true })
  }, [navigate, onLogout])

  return (
    <main className="auth-layout">
      <p className="empty-state">Signing you out...</p>
    </main>
  )
}
