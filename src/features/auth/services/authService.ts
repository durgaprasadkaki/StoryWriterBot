import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { loadFromStorage, saveToStorage } from '@/shared/lib/storage'
import type { LoginPayload, AuthSession, AuthUser, SignupPayload } from '../model/types'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function getRegisteredUsers() {
  return loadFromStorage<AuthUser[]>(STORAGE_KEYS.authUsers, [])
}

function saveRegisteredUsers(users: AuthUser[]) {
  saveToStorage(STORAGE_KEYS.authUsers, users)
}

function toSession(user: AuthUser): AuthSession {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    loggedInAt: new Date().toISOString(),
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
}

export async function signupWithCredentials(payload: SignupPayload): Promise<AuthSession> {
  const name = payload.name.trim()
  const email = normalizeEmail(payload.email)
  const password = payload.password.trim()

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.')
  }

  validatePassword(password)

  const users = getRegisteredUsers()
  const existing = users.find((user) => user.email === email)
  if (existing) {
    throw new Error('An account with this email already exists. Please log in.')
  }

  const newUser: AuthUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  saveRegisteredUsers([newUser, ...users])

  await new Promise((resolve) => setTimeout(resolve, 450))
  return toSession(newUser)
}

export async function loginWithCredentials(payload: LoginPayload): Promise<AuthSession> {
  const email = payload.email.trim().toLowerCase()
  const password = payload.password.trim()

  if (!email || !password) {
    throw new Error('Email and password are required.')
  }

  const users = getRegisteredUsers()
  const user = users.find((item) => item.email === email)
  if (!user) {
    throw new Error('No account found for this email. Please sign up first.')
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.')
  }

  await new Promise((resolve) => setTimeout(resolve, 400))
  return toSession(user)
}
