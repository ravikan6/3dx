const BASE_URL = 'https://backend3dx.onrender.com';

// Interface for user address response (based on expected structure)
interface Address {
  // Define the structure of address fields based on the API response
  street: string;
  city: string;
  zipCode: string;
  // Add other address fields as needed
}

// Interface for user details response (based on expected structure)
interface UserDetails {
  id: string;
  name: string;
  email: string;
  // Add other user details fields as needed
}

// Fetch user address
export async function fetchUserAddress(userId: string): Promise<Address> {
  try {
    const response = await fetch(`${BASE_URL}/address/fetch-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      // Handle different response statuses if necessary
      throw new Error('Failed to fetch user address');
    }

    return response.json();
  } catch (error: any) {
    // Catch network or other errors
    console.error('Error fetching user address:', error);
    throw new Error(error.message || 'Unknown error occurred while fetching user address');
  }
}

// Fetch user details
export async function fetchUserDetails(userId: string): Promise<UserDetails> {
  try {
    const response = await fetch(`${BASE_URL}/auth/user/${userId}`);

    if (!response.ok) {
      // Handle different response statuses if necessary
      throw new Error('Failed to fetch user details');
    }

    return response.json();
  } catch (error: any) {
    // Catch network or other errors
    console.error('Error fetching user details:', error);
    throw new Error(error.message || 'Unknown error occurred while fetching user details');
  }
}
