import React from 'react';
import { Link } from 'react-router-dom';
import { Shoe } from '../types';

interface ShoeCardProps {
  shoe: Shoe;
}

export default function ShoeCard({ shoe }: ShoeCardProps) {
  return (
    <Link to={`/shoe/${shoe.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <img
          src={shoe.image}
          alt={shoe.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{shoe.name}</h3>
          <p className="text-gray-600 mt-1">${shoe.price.toFixed(2)}</p>
          <div className="mt-2">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {shoe.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}