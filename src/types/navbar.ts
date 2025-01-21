// Interface for Navbar properties
export interface NavbarProps {
  cartItemCount: number;
  isMenuOpen: boolean;
  toggleMenu: () => void; // Function type is already correct
}

// Interface for a navigation link
export interface NavigationLink {
  name: string;
  href: string;
}

// Interface for User data
export interface UserData {
  name: string;
  // Add other user properties as needed, using optional properties
  email?: string;
  phone?: string;
  // You can add more properties with the `?` operator to make them optional
}
