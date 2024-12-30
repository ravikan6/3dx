"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 10, rating: 4, category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 20, rating: 3, category: 'Fashion' },
  { id: 3, name: 'Product 3', price: 30, rating: 5, category: 'Electronics' },
  { id: 4, name: 'Product 4', price: 40, rating: 2, category: 'Fashion' },
  { id: 5, name: 'Product 5', price: 50, rating: 4, category: 'Electronics' },
];

const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];

const ShoppingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceFilter, setPriceFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [view, setView] = useState('grid');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = products.filter((product) => product.category === category);
    setFilteredProducts(filtered);
  };

  const handlePriceFilterChange = (price: string) => {
    setPriceFilter(price);
    const filtered = products.filter((product) => product.price >= parseInt(price));
    setFilteredProducts(filtered);
  };

  const handleRatingFilterChange = (rating: string) => {
    setRatingFilter(rating);
    const filtered = products.filter((product) => product.rating >= parseInt(rating));
    setFilteredProducts(filtered);
  };

  const handleViewChange = (view: string) => {
    setView(view);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        {categories.map((category) => (
          <Button key={category} variant="secondary" onClick={() => handleCategoryChange(category)}>
            {category}
          </Button>
        ))}
      </div>
      <div className="flex justify-between mb-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10" onClick={() => handlePriceFilterChange('10')}>$10+</SelectItem>
            <SelectItem value="20" onClick={() => handlePriceFilterChange('20')}>$20+</SelectItem>
            <SelectItem value="30" onClick={() => handlePriceFilterChange('30')}>$30+</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2" onClick={() => handleRatingFilterChange('2')}>2+</SelectItem>
            <SelectItem value="3" onClick={() => handleRatingFilterChange('3')}>3+</SelectItem>
            <SelectItem value="4" onClick={() => handleRatingFilterChange('4')}>4+</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={() => handleViewChange('grid')}>Grid View</Button>
        <Button variant="secondary" onClick={() => handleViewChange('list')}>List View</Button>
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>Price: ${product.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Rating: {product.rating}/5</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary">Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>Price: ${product.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Rating: {product.rating}/5</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary">Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;