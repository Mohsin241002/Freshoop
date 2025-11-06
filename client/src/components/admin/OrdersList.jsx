import { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  Search
} from 'lucide-react';

export default function OrdersList({ orders = [], onUpdateStatus, loading = false }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(null);

  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
    },
    processing: {
      label: 'Processing',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-300',
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-300',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-300',
    },
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await onUpdateStatus(orderId, newStatus);
    } finally {
      setUpdating(null);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border-2 border-gray-200 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Orders will appear here when customers make purchases.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number or email..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'processing', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`
                  px-4 py-2 rounded-xl font-semibold text-sm transition-all
                  ${statusFilter === status
                    ? 'bg-brand text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {status === 'all' ? 'All' : statusConfig[status].label}
                {status !== 'all' && (
                  <span className="ml-1">
                    ({orders.filter(o => o.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
            <p className="text-gray-600">No orders found matching your filters.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${status.border}`}
              >
                {/* Order Header */}
                <div
                  onClick={() => toggleOrder(order.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          #{order.order_number || order.id.slice(0, 8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {order.user_email || 'Unknown'}
                        </div>
                        <div className="font-bold text-brand">
                          Total: ₹{order.total_amount}
                        </div>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Customer Info */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Customer Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {order.delivery_address?.full_name || 'N/A'}
                              </p>
                              <p className="text-gray-600">
                                {order.delivery_address?.address_line1 || 'No address'}
                              </p>
                              {order.delivery_address?.address_line2 && (
                                <p className="text-gray-600">{order.delivery_address.address_line2}</p>
                              )}
                              <p className="text-gray-600">
                                {order.delivery_address?.city}, {order.delivery_address?.state} {order.delivery_address?.postal_code}
                              </p>
                            </div>
                          </div>
                          {order.delivery_address?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{order.delivery_address.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Order Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-semibold text-gray-900">{order.id.slice(0, 13)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items:</span>
                            <span className="font-semibold text-gray-900">
                              {order.items?.length || 0} items
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment:</span>
                            <span className="font-semibold text-gray-900">
                              {order.payment_method || 'COD'}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="font-bold text-gray-900">Total Amount:</span>
                            <span className="font-bold text-brand text-lg">₹{order.total_amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{item.item_name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × ₹{item.price_at_purchase}
                              </p>
                            </div>
                            <div className="font-bold text-gray-900">
                              ₹{(item.quantity * item.price_at_purchase).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update Actions */}
                    <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
                      <span className="font-semibold text-gray-700">Update Order Status:</span>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'processing')}
                              disabled={updating === order.id}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold text-sm"
                            >
                              <Package className="w-4 h-4" />
                              Mark Processing
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              disabled={updating === order.id}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold text-sm"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            disabled={updating === order.id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold text-sm"
                          >
                            <Truck className="w-4 h-4" />
                            Mark Delivered
                          </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'cancelled') && (
                          <span className="text-sm text-gray-600 italic">
                            Order {order.status}. No further actions available.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

