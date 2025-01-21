export interface User {
  id: number;
  name: string;
  email: string;
  userId: string;
  accountStatus: 'open' | 'suspended' | 'blocked'; // Ensures restricted status values
  phone: string;
  createdAt: string; // Alternatively, you can use Date if it's a Date object in your system
  updatedAt: string; // Same as above, Date can be used for real Date objects
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}
