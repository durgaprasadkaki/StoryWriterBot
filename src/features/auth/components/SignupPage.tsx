import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Field } from '@/shared/components/ui/Field'

interface SignupPageProps {
  isAuthenticating: boolean
  errorMessage: string
  onSignup: (name: string, email: string, password: string) => Promise<boolean>
}

export function SignupPage({ isAuthenticating, errorMessage, onSignup }: SignupPageProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLocalError('')

    if (password !== confirmPassword) {
      setLocalError('Password and confirm password must match.')
      return
    }

    const didSignup = await onSignup(name, email, password)
    if (didSignup) {
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
        <Card title="Create your account" subtitle="Sign up to save your stories and continue from your personal history.">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field
              label="Full Name"
              icon={<User className="size-4" />}
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Field
              label="Confirm Password"
              type="password"
              icon={<Lock className="size-4" />}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {(localError || errorMessage) && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-0 rounded-xl border border-red-500/20 bg-red-500/15 px-3 py-2 text-sm text-red-200"
              >
                {localError || errorMessage}
              </motion.p>
            )}
            <Button type="submit" disabled={isAuthenticating} className="w-full">
              <span>{isAuthenticating ? 'Creating account...' : 'Sign Up'}</span>
              {!isAuthenticating && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-300 transition hover:text-indigo-200">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </main>
  )
}
