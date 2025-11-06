import { useEffect } from 'react';
import { CheckCircle, Package, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessAnimation({ isOpen, onClose, orderNumber, estimatedDelivery }) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform animate-[scale-in_0.3s_ease-out]">
        {/* Success Icon with Animation */}
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-[bounce-in_0.6s_ease-out]">
            <CheckCircle className="w-20 h-20 text-white animate-[check-draw_0.5s_ease-in_0.3s_both]" strokeWidth={3} />
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-green-400 rounded-full animate-[ping_1s_ease-out_infinite]"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3 animate-[fade-in_0.5s_ease-in_0.4s_both]">
            Order Placed Successfully! 🎉
          </h2>
          <p className="text-gray-600 text-lg animate-[fade-in_0.5s_ease-in_0.5s_both]">
            Your order has been confirmed and is being processed
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gradient-to-br from-cream-50 to-green-50 rounded-2xl p-6 mb-6 space-y-4 animate-[slide-up_0.5s_ease-out_0.6s_both]">
          <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
            <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-brand" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-bold text-gray-800 text-lg">{orderNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-bold text-green-600">Within 5 minutes</p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 animate-[fade-in_0.5s_ease-in_0.7s_both]">
          <p className="text-sm text-blue-800 text-center">
            📱 You can track your order status in the <span className="font-bold">Orders</span> section
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-brand to-brand-600 text-white py-4 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold text-lg shadow-brand hover:shadow-xl hover:scale-105 animate-[fade-in_0.5s_ease-in_0.8s_both]"
        >
          View My Orders
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
