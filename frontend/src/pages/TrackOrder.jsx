import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/orderApi';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { Loader } from '../components/common/Loader';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderById(id);
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      setLoading(false);
    }
  };

  const getOrderStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: CheckCircleIcon },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircleIcon },
      { key: 'preparing', label: 'Preparing', icon: ClockIcon },
      { key: 'ready', label: 'Ready', icon: CheckCircleIcon },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: TruckIcon },
      { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon }
    ];

    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) return <Loader />;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find an order with this ID.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const steps = getOrderStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
              <p className="text-gray-600">Order #{order._id.slice(-8)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Placed on</p>
              <p className="font-semibold">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        } ${step.current ? 'ring-4 ring-green-200' : ''}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-xs mt-2 text-center ${
                          step.completed ? 'text-gray-900 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Current Status:</strong>{' '}
              <span className="text-orange-600 font-semibold">
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
            </p>
            {order.estimatedDeliveryTime && (
              <p className="text-sm text-gray-700 mt-1">
                <strong>Estimated Delivery:</strong> {formatDateTime(order.estimatedDeliveryTime)}
              </p>
            )}
          </div>
        </div>

        {/* Restaurant & Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Restaurant */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🏪</span> Restaurant
            </h2>
            <p className="font-semibold text-gray-900">{order.restaurantId?.name}</p>
            <p className="text-sm text-gray-600 mt-1">{order.restaurantId?.address?.street}</p>
            {order.restaurantId?.phone && (
              <a
                href={`tel:${order.restaurantId.phone}`}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mt-3 text-sm font-medium"
              >
                <PhoneIcon className="h-4 w-4" />
                {order.restaurantId.phone}
              </a>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📍</span> Delivery Address
            </h2>
            <p className="text-sm text-gray-700">{order.addressId?.street}</p>
            {order.addressId?.landmark && (
              <p className="text-sm text-gray-600 mt-1">Near {order.addressId.landmark}</p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              {order.addressId?.city}, {order.addressId?.state} - {order.addressId?.zipCode}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.selectedVariant && (
                    <p className="text-sm text-gray-600">Size: {item.selectedVariant}</p>
                  )}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery OTP (if out for delivery or ready) */}
        {order.deliveryOtp && (order.status === 'ready' || order.status === 'out_for_delivery') && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white mb-6">
            <h2 className="text-lg font-semibold mb-2">🔐 Delivery OTP</h2>
            <p className="text-sm mb-3">Share this OTP with the delivery partner upon delivery</p>
            <div className="bg-white text-orange-600 text-center py-4 rounded-lg">
              <p className="text-4xl font-bold tracking-wider">{order.deliveryOtp}</p>
            </div>
            <p className="text-xs mt-3 text-orange-100">
              ⚠️ Keep this OTP confidential. Only share it when you receive your order.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Order Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
