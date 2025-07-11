import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    phone: string
    role: string
  }
  interface Session {
    user: {
      id: string
      name: string
      phone: string
      role: string
    }
  }
}
