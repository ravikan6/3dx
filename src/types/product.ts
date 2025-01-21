export interface Product {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  img: string[]; // Array of image URLs (strings)
  categories: string[]; // Array of category names
  inStock: number; // Number of items in stock
  soldStockValue: number; // Number of items sold
  visibility: 'visible' | 'hidden'; // Restricting visibility to two possible values
  createdAt: string; // Use string if it's a date string in ISO format
  updatedAt: string; // Same as above, Date string format (ISO)
}

export interface ProductsResponse {
  success: boolean;
  products: Product[]; // Array of Product objects
}
