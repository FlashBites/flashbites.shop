import React from 'react';
import { useDispatch } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/solid';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BRAND = '#FF523B';

const MenuCard = ({ item, restaurant }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ item, restaurant }));
    toast.success('Added to cart!');
  };

  return (
    <div className="card p-4 flex flex-col sm:flex-row" style={{ borderRadius: '16px' }}>
      {/* Item Info */}
      <div className="flex-1">
        {/* Veg/Non-veg Indicator */}
        <div className="mb-2">
          {item.isVeg ? (
            <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center rounded-sm">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center rounded-sm">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
            </div>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.map((tag, index) => (
              <span key={index} className="badge badge-info text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-2">
          <span className="text-lg font-bold" style={{ color: BRAND }}>
            {formatCurrency(Number(item.price) || 0)}
          </span>

          {!restaurant.acceptingOrders ? (
            <span className="badge bg-red-100 text-red-800 border border-red-300">Closed</span>
          ) : !item.isAvailable ? (
            <span className="badge badge-danger">Not Available</span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 border-2"
              style={{ 
                borderColor: BRAND, 
                color: BRAND,
                background: '#FFF0ED'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = BRAND; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFF0ED'; e.currentTarget.style.color = BRAND; }}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Item Image */}
      {item.image && (
        <div className="mt-3 sm:mt-0 sm:ml-4 self-end sm:self-auto">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default MenuCard;