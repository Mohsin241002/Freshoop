import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

export default function CategoryForm({ category = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    display_order: category?.display_order || 0,
  });
  const [errors, setErrors] = useState({});

  const isEditMode = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        display_order: category.display_order || 0,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) || 0 : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="e.g., Fruits, Vegetables, Dairy"
                disabled={loading}
                autoFocus
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                placeholder="0"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first in the list
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-1">💡 Tip:</p>
              <p className="text-xs text-blue-700">
                Use display order to control how categories appear in your shop. Categories with lower numbers show up first.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-brand to-brand-600 text-white font-bold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditMode ? 'Update Category' : 'Create Category'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

