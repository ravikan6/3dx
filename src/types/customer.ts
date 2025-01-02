export interface User {
    id: number
    name: string
    email: string
    userId: string
    accountStatus: 'open' | 'suspended' | 'blocked'
    phone: string
    createdAt: string
    updatedAt: string
  }
  
  export interface UsersResponse {
    success: boolean
    users: User[]
  }
  