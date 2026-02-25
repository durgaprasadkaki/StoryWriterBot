import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Field } from '@/shared/components/ui/Field'

interface LoginPageProps {
  isAuthenticating: boolean
  errorMessage: string
  onLogin: (email: string, password: string) => Promise<boolean>
}

export function LoginPage({ isAuthenticating, errorMessage, onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const didLogin = await onLogin(email, password)
    if (didLogin) {
      navigate('/')
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-6">
      <div className="absolute -left-48 top-20 size-96 rounded-full bg-fuchsia-500/30 blur-3xl opacity-25" />
      <div className="absolute -right-32 bottom-10 size-80 rounded-full bg-indigo-500/25 blur-3xl opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card title="Welcome to StoryWriterBot" subtitle="Sign in to continue writing and manage your story workspace.">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field
              label="Email"
              type="email"
              icon={<Mail className="size-4" />}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Field
              label="Password"
              type="password"
              icon={<Lock className="size-4" />}
              placeholder="Enter at least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-0 rounded-xl border border-red-500/20 bg-red-500/15 px-3 py-2 text-sm text-red-200"
              >
                {errorMessage}
              </motion.p>
            )}
            <Button type="submit" disabled={isAuthenticating} className="w-full">
              <span>{isAuthenticating ? 'Signing in...' : 'Login'}</span>
              {!isAuthenticating && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-300">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-indigo-300 transition hover:text-indigo-200">
              Create an account
            </Link>
          </p>
        </Card>
      </motion.div>
    </main>
  )
}
