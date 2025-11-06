import { useState, useEffect } from 'react';
import { X, MapPin, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { addressesApi } from '../lib/api';
import AddressModal from './AddressModal';

export default function CheckoutModal({ isOpen, onClose, onConfirm, cartTotal }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressesApi.getAll();
      const addressList = response.data.data || [];
      setAddresses(addressList);
      
      // Auto-select default address
      const defaultAddress = addressList.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressList.length > 0) {
        setSelectedAddressId(addressList[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (editingAddress) {
        await addressesApi.update(editingAddress.id, formData);
      } else {
        const response = await addressesApi.create(formData);
        // Auto-select newly created address
        if (response.data.data?.id) {
          setSelectedAddressId(response.data.data.id);
        }
      }
      await fetchAddresses();
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setDeleting(addressId);
      await addressesApi.delete(addressId);
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
      await fetchAddresses();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete address');
    } finally {
      setDeleting(null);
    }
  };

  const handleConfirm = () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }
    onConfirm(selectedAddressId);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-brand-600 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Select Delivery Address</h2>
                <p className="text-green-100 text-sm">Choose where you want your order delivered</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-6">Add your first delivery address to continue</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-gradient-to-r from-brand to-brand-600 text-white px-6 py-3 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all inline-flex items-center gap-2 font-semibold shadow-brand"
                >
                  <Plus className="w-5 h-5" />
                  Add Address
                </button>
              </div>
            ) : (
              <>
                {/* Add New Address Button */}
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                  className="w-full mb-4 p-4 border-2 border-dashed border-brand rounded-2xl hover:bg-brand/5 transition-colors flex items-center justify-center gap-2 text-brand font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Add New Address
                </button>

                {/* Address List */}
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? 'border-brand bg-brand/5 shadow-lg'
                          : 'border-cream-200 hover:border-brand/50 hover:bg-cream-50'
                      }`}
                    >
                      {/* Selection Indicator */}
                      {selectedAddressId === address.id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-brand text-white rounded-full p-1">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        </div>
                      )}

                      {/* Default Badge */}
                      {address.is_default && (
                        <span className="absolute top-4 right-16 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Default
                        </span>
                      )}

                      <div className="pr-24">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{address.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">{address.phone}</p>
                        <p className="text-gray-700">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                        </p>
                        <p className="text-gray-700">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(address);
                            setShowAddressModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          disabled={deleting === address.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {addresses.length > 0 && (
            <div className="border-t-2 border-cream-200 p-6 bg-cream-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-semibold">Order Total:</span>
                <span className="text-2xl font-bold text-brand">₹{Math.round(cartTotal)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedAddressId}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-brand to-brand-600 text-white font-semibold hover:from-brand-600 hover:to-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-brand"
                >
                  Confirm & Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        editAddress={editingAddress}
      />
    </>
  );
}
