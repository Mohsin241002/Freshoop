import { useState } from 'react';
import { Edit2, Trash2, Plus, Minus, AlertTriangle, Check, X, Eye, EyeOff } from 'lucide-react';

export default function AdminItemCard({ item, onEdit, onDelete, onUpdateStock, onToggleAvailability }) {
  const [stockInput, setStockInput] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isLowStock = item.stock_quantity < 10;
  const isOutOfStock = item.stock_quantity === 0;

  const handleQuickStockUpdate = async (delta) => {
    if (updating) return;
    
    const newStock = Math.max(0, item.stock_quantity + delta);
    setUpdating(true);
    
    try {
      await onUpdateStock(item.id, newStock);
    } finally {
      setUpdating(false);
    }
  };

  const handleStockInputUpdate = async () => {
    const value = parseInt(stockInput);
    if (isNaN(value) || value < 0) return;

    setUpdating(true);
    try {
      await onUpdateStock(item.id, value);
      setStockInput('');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await onDelete(item.id);
    } finally {
      setUpdating(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (toggling) return;
    
    setToggling(true);
    try {
      await onToggleAvailability(item.id, !item.is_available);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className={`
      bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl
      ${!item.is_available ? 'opacity-60 border-gray-300' : 'border-gray-200'}
      ${isLowStock && item.is_available ? 'border-orange-300' : ''}
      ${isOutOfStock && item.is_available ? 'border-red-300' : ''}
    `}>
      {/* Image Section */}
      <div className="relative">
        <img
          src={item.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Stock Badge */}
        <div className={`
          absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg
          ${isOutOfStock 
            ? 'bg-red-500 text-white' 
            : isLowStock 
            ? 'bg-orange-500 text-white' 
            : 'bg-green-500 text-white'
          }
        `}>
          {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
        </div>

        {/* Availability Toggle */}
        <button
          onClick={handleToggleAvailability}
          disabled={toggling}
          className={`
            absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all
            ${item.is_available 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-500 hover:bg-gray-600 text-white'
            }
          `}
          title={item.is_available ? 'Available' : 'Unavailable'}
        >
          {item.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Item Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-brand">
              ₹{item.price}
              <span className="text-sm text-gray-500 font-normal">/{item.unit}</span>
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              ID: {item.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Stock Management */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Stock:</span>
            <span className={`
              text-lg font-bold
              ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}
            `}>
              {item.stock_quantity} {item.unit}
            </span>
          </div>

          {/* Quick Stock Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => handleQuickStockUpdate(-10)}
              disabled={updating || item.stock_quantity === 0}
              className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-semibold text-sm"
            >
              <Minus className="w-4 h-4" /> 10
            </button>
            <button
              onClick={() => handleQuickStockUpdate(-1)}
              disabled={updating || item.stock_quantity === 0}
              className="flex-1 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-semibold text-sm"
            >
              <Minus className="w-4 h-4" /> 1
            </button>
            <button
              onClick={() => handleQuickStockUpdate(1)}
              disabled={updating}
              className="flex-1 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> 1
            </button>
            <button
              onClick={() => handleQuickStockUpdate(10)}
              disabled={updating}
              className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> 10
            </button>
          </div>

          {/* Custom Stock Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="Set stock"
              min="0"
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
              disabled={updating}
            />
            <button
              onClick={handleStockInputUpdate}
              disabled={updating || !stockInput}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
            >
              Set
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {!showDeleteConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              disabled={updating}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={updating}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-xs text-red-700 font-semibold">
                Delete this item?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={updating}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                <Check className="w-4 h-4" />
                <span>Yes, Delete</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={updating}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {isLowStock && item.is_available && (
          <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span className="text-xs text-orange-700 font-semibold">
              {isOutOfStock ? 'Out of stock! Restock urgently.' : 'Low stock! Consider restocking.'}
            </span>
          </div>
        )}

        {/* Unavailable Notice */}
        {!item.is_available && (
          <div className="mt-3 p-2 bg-gray-100 rounded-lg border border-gray-300 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-xs text-gray-700 font-semibold">
              This item is hidden from customers
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

