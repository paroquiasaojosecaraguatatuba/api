export interface IUserDAF {
  exists(params: { email: string }, c: DomainContext): Promise<boolean>
  findByEmail(email: string, c: DomainContext): Promise<{
    id: string
    email: string
    passwordHash: string
    role: string
  } | null>
  create(user: {
    email: string
    passwordHash: string
    role: 'admin' | 'user' | 'viewer'
  }, c: DomainContext): Promise<{
    id: string
    email: string
    passwordHash: string
    role: string
  }>
}