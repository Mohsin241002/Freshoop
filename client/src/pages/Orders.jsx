import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../lib/api';
import { Package, Clock, CheckCircle, Loader2, Truck } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (user) {
      fetchOrders();
      
      // Refresh orders every 5 seconds to check for delivery updates
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Update countdown timers every second
    const interval = setInterval(() => {
      const newTimers = {};
      orders.forEach(order => {
        if (order.status !== 'delivered') {
          const createdAt = new Date(order.created_at);
          const deliveryTime = new Date(createdAt.getTime() + 2 * 60 * 1000);
          const remaining = Math.max(0, deliveryTime - Date.now());
          newTimers[order.id] = remaining;
        }
      });
      setTimers(newTimers);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getUserOrders();
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Sign in to view your orders</h2>
        <button
          onClick={() => navigate('/auth')}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{order.order_number}</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    <span className={`text-sm font-semibold ${
                      order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Ordered on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                </p>
                {order.delivered_at && (
                  <p className="text-green-600 text-sm font-semibold">
                    ✓ Delivered on {new Date(order.delivered_at).toLocaleDateString()} at {new Date(order.delivered_at).toLocaleTimeString()}
                  </p>
                )}
                {order.status !== 'delivered' && timers[order.id] !== undefined && (
                  <div className="mt-2 flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-600">
                      {timers[order.id] > 0 
                        ? `Delivering in ${formatTimer(timers[order.id])}`
                        : 'Delivered! (Refreshing...)'}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.item_name}
                    </span>
                    <span className="font-semibold">
                      ${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

