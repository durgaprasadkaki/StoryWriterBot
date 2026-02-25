import { useState } from 'react'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { loadFromStorage, saveToStorage } from '@/shared/lib/storage'
import { loginWithCredentials, signupWithCredentials } from '../services/authService'
import type { AuthSession } from '../model/types'

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() =>
    loadFromStorage<AuthSession | null>(STORAGE_KEYS.authSession, null),
  )
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function login(email: string, password: string) {
    setIsAuthenticating(true)
    setErrorMessage('')
    try {
      const nextSession = await loginWithCredentials({ email, password })
      setSession(nextSession)
      saveToStorage(STORAGE_KEYS.authSession, nextSession)
      return true
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to log in.')
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function signup(name: string, email: string, password: string) {
    setIsAuthenticating(true)
    setErrorMessage('')
    try {
      const nextSession = await signupWithCredentials({ name, email, password })
      setSession(nextSession)
      saveToStorage(STORAGE_KEYS.authSession, nextSession)
      return true
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign up.')
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  function logout() {
    setSession(null)
    saveToStorage(STORAGE_KEYS.authSession, null)
  }

  return {
    session,
    isAuthenticated: Boolean(session),
    isAuthenticating,
    errorMessage,
    login,
    signup,
    logout,
  }
}
