import React from 'react';
import { shoes } from '../data/shoes';
import ShoeCard from '../components/ShoeCard';

interface HomeProps {
  searchTerm: string;
}

export default function Home({ searchTerm }: HomeProps) {
  const filteredShoes = shoes.filter(shoe =>
    shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shoe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredShoes = filteredShoes.slice(0, 4);
  const allProducts = filteredShoes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Section */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">BEST SELLERS</h1>
        {featuredShoes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No shoes found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredShoes.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Banner */}
      <section className="my-16 bg-gray-900 rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Explore Our Collections</h2>
          <p className="text-gray-300 text-lg mb-8">
            Discover our complete range of shoes, sandals, and accessories
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            {['Formal', 'Casual', 'Sandals', 'Accessories'].map((category) => (
              <div key={category} className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{category}</h3>
                <p className="text-gray-400 text-sm">Premium Collection</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
          <div className="flex space-x-4">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>
        
        {allProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.map((product) => (
              <ShoeCard key={product.id} shoe={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}