import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/features/auth/hooks/useAuthSession'

const StoryWorkspace = lazy(() =>
  import('@/features/story-generator/components/StoryWorkspace').then((module) => ({
    default: module.StoryWorkspace,
  })),
)

const LoginPage = lazy(() =>
  import('@/features/auth/components/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
)

const LogoutPage = lazy(() =>
  import('@/features/auth/components/LogoutPage').then((module) => ({
    default: module.LogoutPage,
  })),
)

const SignupPage = lazy(() =>
  import('@/features/auth/components/SignupPage').then((module) => ({
    default: module.SignupPage,
  })),
)

function App() {
  const navigate = useNavigate()
  const { session, isAuthenticated, isAuthenticating, errorMessage, login, signup, logout } = useAuthSession()

  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && session ? (
              <StoryWorkspace
                userId={session.userId}
                userName={session.name}
                onLogout={() => {
                  navigate('/logout')
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage
                isAuthenticating={isAuthenticating}
                errorMessage={errorMessage}
                onLogin={login}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SignupPage
                isAuthenticating={isAuthenticating}
                errorMessage={errorMessage}
                onSignup={signup}
              />
            )
          }
        />
        <Route path="/logout" element={<LogoutPage onLogout={logout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
