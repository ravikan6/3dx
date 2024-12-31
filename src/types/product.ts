export interface Product {
    id: number;
    productId: number;
    productName: string;
    productPrice: number;
    img: string[];
    categories: string[];
    inStock: number;
    soldStockValue: number;
    visibility: string;
    createdAt: string;
    updatedAt: string;
    
  }
  
  export interface ProductsResponse {
    success: boolean;
    products: Product[];
  }
  
  