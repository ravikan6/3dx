export interface Complaint {
  complaintNumber: string;
  name: string;
  email: string;
  message: string;
  userType: string; // You can improve this with specific user types if needed
  status: string;   // Same for status, could be an enum if limited
  createdAt: string;
}

export interface SortConfig {
  key: keyof Complaint | null; // Ensure null is explicitly allowed
  direction: 'ascending' | 'descending';
}
