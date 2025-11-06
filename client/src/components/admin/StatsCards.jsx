import { Package, AlertTriangle, ShoppingBag, Truck, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCards({ stats, loading = false }) {
  const cards = [
    {
      id: 'items',
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      id: 'lowStock',
      title: 'Low Stock Alerts',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: stats?.lowStockItems > 5 ? 'Critical' : 'Normal',
      trendUp: false,
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      id: 'pending',
      title: 'Pending Deliveries',
      value: stats?.pendingDeliveries || 0,
      icon: Truck,
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: stats?.pendingDeliveries > 10 ? 'High' : 'Low',
      trendUp: false,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isAlert = card.id === 'lowStock' && card.value > 5;
        
        return (
          <div
            key={card.id}
            className={`
              bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl hover:scale-105
              ${isAlert ? 'border-orange-300 animate-pulse' : 'border-gray-200'}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  {card.title}
                </p>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {card.value}
                </h3>
                <div className="flex items-center gap-1">
                  {card.trendUp ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      card.trendUp ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {card.trend}
                  </span>
                </div>
              </div>

              {/* Icon */}
              <div
                className={`
                  w-14 h-14 ${card.lightBg} rounded-xl flex items-center justify-center
                  ${isAlert ? 'animate-bounce' : ''}
                `}
              >
                <Icon className={`w-7 h-7 ${card.textColor}`} />
              </div>
            </div>

            {/* Progress Bar (for low stock) */}
            {card.id === 'lowStock' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-600">Stock Health</span>
                  <span className={card.value > 5 ? 'text-orange-600 font-bold' : 'text-green-600 font-bold'}>
                    {card.value > 5 ? 'Needs Attention' : 'Good'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${
                      card.value > 10 ? 'bg-red-500' : card.value > 5 ? 'bg-orange-500' : 'bg-green-500'
                    } h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min((card.value / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quick Action Button */}
            {card.id === 'pending' && card.value > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full py-2 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
                  View Pending Orders →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

