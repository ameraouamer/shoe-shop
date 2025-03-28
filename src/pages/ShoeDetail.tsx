import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shoes } from '../data/shoes';
import { OrderDetails } from '../types';

interface ShoeDetailProps {
  addToCart: (shoe: any, size: number | string, quantity: number, region: string) => void;
}

export default function ShoeDetail({ addToCart }: ShoeDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shoe = shoes.find(s => s.id === id);

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    fullName: '',
    email: '',
    address: '',
    size: typeof shoe?.sizes[0] === 'number' ? shoe?.sizes[0] : '',
    quantity: 1,
    region: ''
  });

  if (!shoe) {
    return <div>Shoe not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart(shoe, orderDetails.size, orderDetails.quantity, orderDetails.region);
    navigate('/cart');
  };

  const totalPrice = shoe.price * orderDetails.quantity;

  const isNumericSize = typeof shoe.sizes[0] === 'number';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={shoe.image}
            alt={shoe.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{shoe.name}</h1>
            <p className="text-xl text-gray-600 mt-2">${shoe.price.toFixed(2)}</p>
            <p className="mt-4 text-gray-700">{shoe.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                value={orderDetails.fullName}
                onChange={e => setOrderDetails({...orderDetails, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                value={orderDetails.email}
                onChange={e => setOrderDetails({...orderDetails, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                value={orderDetails.address}
                onChange={e => setOrderDetails({...orderDetails, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                value={orderDetails.size}
                onChange={e => setOrderDetails({...orderDetails, size: isNumericSize ? Number(e.target.value) : e.target.value})}
              >
                <option value="">Select size</option>
                {shoe.sizes.map(size => (
                  <option key={size} value={size}>
                    {isNumericSize ? `EU ${size}` : size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                value={orderDetails.quantity}
                onChange={e => setOrderDetails({...orderDetails, quantity: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                value={orderDetails.region}
                onChange={e => setOrderDetails({...orderDetails, region: e.target.value})}
              >
                <option value="">Select region</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="australia">Australia</option>
              </select>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}