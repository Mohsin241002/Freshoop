import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Save, XCircle } from 'lucide-react';

export default function ItemForm({ item = null, categories = [], onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category_id: item?.category_id || '',
    stock_quantity: item?.stock_quantity || '',
    unit: item?.unit || 'kg',
    image_url: item?.image_url || '',
    is_available: item?.is_available !== undefined ? item.is_available : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image_url || '');
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const isEditMode = !!item;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image file selection
  const handleImageChange = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }

    if (!isEditMode && !imageFile && !formData.image_url) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create FormData object
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add image file if selected
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Item' : 'Add New Item'}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Fresh Apples"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Describe the item..."
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Price and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none ${
                      errors.price ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                    disabled={loading}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                    disabled={loading}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (l)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>

              {/* Category and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none ${
                      errors.category_id ? 'border-red-500' : 'border-gray-200'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none ${
                      errors.stock_quantity ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errors.stock_quantity && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock_quantity}</p>
                  )}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="w-5 h-5 text-brand rounded focus:ring-brand"
                  disabled={loading}
                />
                <label className="text-sm font-semibold text-gray-700">
                  Item is available for sale
                </label>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Item Image {!isEditMode && '*'}
              </label>
              
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    disabled={loading}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      disabled={loading}
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                // Drag and Drop Area
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                    ${dragActive ? 'border-brand bg-brand/5' : 'border-gray-300 hover:border-brand'}
                    ${errors.image ? 'border-red-500' : ''}
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      {dragActive ? (
                        <Upload className="w-8 h-8 text-brand animate-bounce" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-1">
                        {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG or WEBP (max. 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="text-red-500 text-xs mt-2">{errors.image}</p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
                className="hidden"
                disabled={loading}
              />

              {/* Tips */}
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-800 font-semibold mb-2">💡 Image Tips:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use high-quality, clear images</li>
                  <li>• Square images work best (1:1 ratio)</li>
                  <li>• Show the product on a clean background</li>
                  <li>• Keep file size under 5MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
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
                  <span>{isEditMode ? 'Update Item' : 'Create Item'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

