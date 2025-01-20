'use client'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
          ${!selectedCategory
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary hover:bg-secondary/80'}`}
        aria-selected={selectedCategory === null}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
            ${selectedCategory === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'}`}
          aria-selected={selectedCategory === category}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  )
}
