export interface AuthSession {
  userId: string
  name: string
  email: string
  loggedInAt: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
}
