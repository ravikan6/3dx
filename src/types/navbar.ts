export interface NavbarProps {
    cartItemCount: number;
    isMenuOpen: boolean;
    toggleMenu: () => void;
  }
  
  export interface NavigationLink {
    name: string;
    href: string;
  }
  export interface UserData {
    name: string;
    // Add other user properties as needed
  }