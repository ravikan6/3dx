'use client'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors 
          ${!selectedCategory 
            ? 'bg-blue-500 text-white' // Replace bg-primary and text-primary-foreground with valid classes
            : 'bg-gray-200 hover:bg-gray-300'}`} // Replace bg-secondary with valid classes
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
            ${selectedCategory === category 
              ? 'bg-blue-500 text-white' // Replace bg-primary and text-primary-foreground with valid classes
              : 'bg-gray-200 hover:bg-gray-300'}`} // Replace bg-secondary with valid classes
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  )
}
