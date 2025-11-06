import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../lib/api';
import { Package, Clock, CheckCircle, Loader2, Truck, ShoppingBag, Calendar, ChevronRight } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const refreshedOrders = useRef(new Set());

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await ordersApi.getUserOrders();
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (orders.length === 0) return;
    
    // Update countdown timers every minute
    const updateTimers = () => {
      const newTimers = {};
      
      orders.forEach(order => {
        if (order.status !== 'delivered') {
          const createdAt = new Date(order.created_at);
          const deliveryTime = new Date(createdAt.getTime() + 5 * 60 * 1000);
          const remaining = Math.max(0, deliveryTime - Date.now());
          newTimers[order.id] = remaining;
          
          // Refresh once when timer expires (only if not already refreshed)
          if (remaining === 0 && !refreshedOrders.current.has(order.id)) {
            refreshedOrders.current.add(order.id);
            setTimeout(() => fetchOrders(), 2000);
          }
        }
      });
      
      setTimers(newTimers);
    };
    
    // Update immediately
    updateTimers();
    
    // Then update every minute
    const interval = setInterval(updateTimers, 60 * 1000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  const formatTimer = (ms) => {
    const totalMinutes = Math.ceil(ms / (60 * 1000));
    if (totalMinutes <= 0) return '0 min';
    return `${totalMinutes} min`;
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-cream-200">
          <div className="w-24 h-24 bg-gradient-to-br from-brand to-brand-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sign in to view your orders</h2>
          <p className="text-gray-600 text-lg mb-8">Track your grocery deliveries and order history</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-brand to-brand-600 text-white px-10 py-4 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand inline-flex items-center gap-2 hover:scale-105"
          >
            <span>Sign In</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-brand mb-4" />
        <p className="text-gray-600 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-cream-200">
          <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-600 text-lg mb-8">Start shopping for fresh groceries and create your first order!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-brand to-brand-600 text-white px-10 py-4 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand inline-flex items-center gap-2 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          text: 'Delivered',
          bgClass: 'bg-green-100',
          textClass: 'text-green-700',
          borderClass: 'border-green-200',
        };
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6" />,
          text: 'Pending',
          bgClass: 'bg-orange-100',
          textClass: 'text-orange-700',
          borderClass: 'border-orange-200',
        };
      default:
        return {
          icon: <Package className="w-6 h-6" />,
          text: 'Processing',
          bgClass: 'bg-gray-100',
          textClass: 'text-gray-700',
          borderClass: 'border-gray-200',
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand via-brand-600 to-brand-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">My Orders</h1>
          <p className="text-green-100 text-lg">Track and manage your grocery orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-cream-200 hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2 font-semibold">Total Orders</p>
              <p className="text-4xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-700 rounded-2xl flex items-center justify-center shadow-brand">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-cream-200 hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2 font-semibold">Pending</p>
              <p className="text-4xl font-bold text-orange-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-orange-200">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-cream-200 hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2 font-semibold">Delivered</p>
              <p className="text-4xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center border-2 border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          
          return (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border-2 border-cream-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-brand/10 via-brand/5 to-cream-100 px-8 py-6 border-b-2 border-cream-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-gray-800">{order.order_number}</h3>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgClass} border ${statusConfig.borderClass}`}>
                        {statusConfig.icon}
                        <span className={`text-sm font-bold ${statusConfig.textClass}`}>
                          {statusConfig.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-brand">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="px-6 py-4">
                {/* Delivery Status */}
                {order.delivered_at && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-700 font-semibold">
                        Delivered on {new Date(order.delivered_at).toLocaleDateString()} at {new Date(order.delivered_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {order.status !== 'delivered' && timers[order.id] !== undefined && (
                  <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-orange-600 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-orange-800">
                          {timers[order.id] > 0 
                            ? `Your order will arrive in ${formatTimer(timers[order.id])}`
                            : 'Delivered! Refreshing...'}
                        </p>
                        <p className="text-sm text-orange-600">Our delivery partner is on the way</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand" />
                    Order Items ({order.order_items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                            <span className="font-bold text-[#77BF54]">{item.quantity}x</span>
                          </div>
                          <span className="font-medium text-gray-800">{item.item_name}</span>
                        </div>
                        <span className="font-bold text-gray-800">
                          ${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reorder CTA */}
      <div className="mt-10 text-center">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-brand to-brand-600 text-white px-10 py-5 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand hover:shadow-xl text-lg hover:scale-105"
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Shop Again</span>
        </button>
      </div>
    </div>
  );
}
