import React, { useState } from 'react';
import { shoes } from '../data/shoes';
import ShoeCard from '../components/ShoeCard';

interface CategoriesProps {
  searchTerm: string;
}

export default function Categories({ searchTerm }: CategoriesProps) {
  const categories = [...new Set(shoes.map(shoe => shoe.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredShoes = shoes
    .filter(shoe => 
      (selectedCategory ? shoe.category === selectedCategory : true) &&
      (shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       shoe.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredShoes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No shoes found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShoes.map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} />
          ))}
        </div>
      )}
    </div>
  );
}