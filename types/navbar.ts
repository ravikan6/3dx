export interface NavbarProps {
  cartItemCount: number;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export interface NavigationLink {
  name: string;
  href: string;
}

