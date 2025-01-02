const BASE_URL = 'https://backend3dx.onrender.com';

export async function fetchUserAddress(userId: string) {
  const response = await fetch(`${BASE_URL}/address/fetch-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user address');
  }
  return response.json();
}

export async function fetchUserDetails(userId: string) {
  const response = await fetch(`${BASE_URL}/auth/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user details');
  }
  return response.json();
}

