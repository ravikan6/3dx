export interface Complaint {
    complaintNumber: string
    name: string
    email: string
    message: string
    userType: string
    status: string
    createdAt: string
  }
  
  export interface SortConfig {
    key: keyof Complaint | null
    direction: 'ascending' | 'descending'
  }
  
  