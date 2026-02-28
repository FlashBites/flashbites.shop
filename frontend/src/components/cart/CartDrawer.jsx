import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TagIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { toggleCart } from '../../redux/slices/uiSlice';
import { updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';
import { calculateCartTotal } from '../../utils/helpers';
import { getAddresses } from '../../api/userApi';
import { validateCoupon } from '../../api/couponApi';
import AddAddressModal from '../common/AddAddressModal';
import toast from 'react-hot-toast';

const CART_SELECTED_ADDRESS_KEY = 'cart_selected_address_id';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartOpen } = useSelector((state) => state.ui);
  const { items, restaurant } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = calculateCartTotal(items);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.05;
  const baseDiscount = subtotal > 0 ? Math.min(2, subtotal * 0.1) : 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const discount = baseDiscount + couponDiscount;
  const total = subtotal + deliveryFee + tax - discount;
  const totalItems = items.reduce((count, item) => count + (item.quantity || 0), 0);
  const selectedAddress = useMemo(
    () => addresses.find((addr) => addr._id === selectedAddressId) || null,
    [addresses, selectedAddressId],
  );

  const persistSelectedAddress = (addressId) => {
    setSelectedAddressId(addressId || null);
    if (addressId) {
      localStorage.setItem(CART_SELECTED_ADDRESS_KEY, addressId);
    } else {
      localStorage.removeItem(CART_SELECTED_ADDRESS_KEY);
    }
  };

  useEffect(() => {
    if (!cartOpen || !isAuthenticated) return;

    const loadAddresses = async () => {
      try {
        const response = await getAddresses();
        const list = response?.data?.addresses || [];
        setAddresses(list);

        if (list.length === 0) {
          persistSelectedAddress(null);
          return;
        }

        const cartSelectedId = localStorage.getItem(CART_SELECTED_ADDRESS_KEY);
        if (cartSelectedId && list.some((addr) => addr._id === cartSelectedId)) {
          persistSelectedAddress(cartSelectedId);
          return;
        }

        const defaultAddress = list.find((addr) => addr.isDefault);
        persistSelectedAddress(selectedAddressId || defaultAddress?._id || list[0]._id);
      } catch (error) {
        toast.error('Failed to load addresses');
      }
    };

    loadAddresses();
  }, [cartOpen, isAuthenticated]);

  const handleOpenAddressForm = () => {
    if (!isAuthenticated) {
      navigate('/login');
      dispatch(toggleCart());
      return;
    }
    setShowAddAddressModal(true);
  };

  const handleAddressAdded = async (newAddress) => {
    const newAddressId = newAddress?._id || newAddress?.id || null;

    try {
      const response = await getAddresses();
      const list = response?.data?.addresses || [];
      setAddresses(list);

      if (newAddressId) {
        const created = list.find((addr) => addr._id === newAddressId);
        if (created) {
          persistSelectedAddress(created._id);
        } else {
          persistSelectedAddress(list[list.length - 1]?._id || null);
        }
      } else {
        const matched = list.find(
          (addr) =>
            addr.street === newAddress?.street &&
            addr.city === newAddress?.city &&
            addr.state === newAddress?.state &&
            addr.zipCode === newAddress?.zipCode,
        );
        persistSelectedAddress(matched?._id || list[list.length - 1]?._id || null);
      }
    } catch (error) {
      toast.error('Failed to refresh addresses');
    } finally {
      setShowAddAddressModal(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      dispatch(toggleCart());
      return;
    }
    navigate('/checkout');
    dispatch(toggleCart());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await validateCoupon(couponCode.trim().toUpperCase(), subtotal);
      if (response?.success) {
        setAppliedCoupon(response.data.coupon);
        toast.success(response.message || 'Coupon applied successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  if (!cartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => dispatch(toggleCart())}
      />

      <div className="fixed inset-0 z-50 sm:left-auto sm:w-[420px] bg-[#f3f4f6] shadow-2xl flex flex-col animate-slide-up sm:animate-slide-right">
        <div className="flex-1 overflow-y-auto">
          <div className="bg-[#f3f4f6]">
            <div className="px-5 pt-6 pb-4 flex items-center justify-between">
              <button
                onClick={() => dispatch(toggleCart())}
                className="w-9 h-9 rounded-full bg-[#e8edf2] flex items-center justify-center transition-colors active:bg-slate-200"
                aria-label="Close cart"
              >
                <ArrowLeftIcon className="h-5 w-5 text-slate-700" />
              </button>
              <h1 className="text-[22px] font-semibold text-slate-900">My Cart</h1>
              <div className="w-9 h-9" />
            </div>
          </div>

          <div className="px-5 pb-[calc(16px+env(safe-area-inset-bottom,0px))] space-y-5">
          {items.length === 0 ? (
            <div className="min-h-[calc(100vh-170px)] -mt-8 flex flex-col items-center justify-center text-center py-10">
              <img
                src="/emptycart.png"
                alt="Empty cart"
                className="w-130 h-130 object-contain -mt-6 mb-7"
              />
              <h3 className="text-[28px] font-semibold text-slate-800 leading-tight">Your cart is empty</h3>
              <p className="mt-3 text-slate-500 text-[15px] leading-6 max-w-[300px]">
                Looks like you haven&apos;t added anything to your cart yet. Let&apos;s find some delicious food for you!
              </p>
              <button
                onClick={() => dispatch(toggleCart())}
                className="mt-8 w-full max-w-[320px] bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3.5 px-6 font-semibold text-[16px] shadow-[0_10px_24px_rgba(249,115,22,0.28)]"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {restaurant && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <img
                    src={items[0]?.image || 'https://via.placeholder.com/48'}
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 leading-tight truncate">{restaurant.name}</h3>
                    <p className="text-xs text-gray-500 truncate">123 Main St, Downtown Hub</p>
                    <p className="text-[11px] font-semibold text-orange-500 mt-1">● VERIFIED OUTLET</p>
                  </div>
                  <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}

              <div className="mt-1">
                <h4 className="text-[22px] font-semibold text-gray-900 leading-tight mb-3">Cart Items</h4>
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-2">
                      <img
                        src={item.image || 'https://via.placeholder.com/48'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h5>
                        <p className="text-orange-600 text-[22px] font-semibold leading-tight">
                          {formatCurrency(Number(item.price) || 0)}
                        </p>
                      </div>
                      <div className="h-10 bg-gray-100 rounded-full flex items-center px-2.5 gap-2.5">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                itemId: item._id,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          className="w-6 h-6 rounded-full bg-gray-100 text-orange-500 flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-3 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                itemId: item._id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          className="w-6 h-6 rounded-full bg-gray-100 text-orange-500 flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 bg-[#fff1eb] border border-[#ffd8ca] rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900 text-sm">Delivery in 30 mins</p>
                    <button onClick={handleOpenAddressForm} className="text-xs font-bold text-orange-500">
                      CHANGE
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current Address:{' '}
                    {selectedAddress
                      ? `${selectedAddress.type || 'Home'} - ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}`
                      : 'Add your delivery address'}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-[22px] font-semibold text-gray-900 leading-tight mb-3">Bill Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Item Total</span>
                    <span className="text-gray-700">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                      {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxes and Charges</span>
                    <span className="text-gray-700">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-orange-500">
                    <span className="inline-flex items-center gap-1.5">
                      <TagIcon className="h-3.5 w-3.5" />
                      {appliedCoupon ? `${appliedCoupon.code} Discount` : 'FlashBites Discount'}
                    </span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-xl text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-orange-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {appliedCoupon ? (
                <div className="w-full mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-green-700 truncate">{appliedCoupon.code} applied</p>
                    <p className="text-xs text-green-700">Saved {formatCurrency(appliedCoupon.discount || 0)}</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs font-semibold text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="w-full mt-2 bg-white border border-dashed border-gray-300 rounded-xl px-3 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TagIcon className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-gray-700 text-sm">Apply Coupon</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-sm text-gray-700"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="h-9 px-3 rounded-lg bg-orange-500 text-white text-xs font-semibold disabled:opacity-60"
                    >
                      {couponLoading ? 'Applying' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (window.confirm('Clear entire cart?')) {
                    dispatch(clearCart());
                  }
                }}
                className="w-full mt-1 text-xs font-semibold text-red-500"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-3.5 flex items-center justify-between"
              >
                <div className="text-left leading-tight">
                  <p className="text-[10px] uppercase tracking-wide opacity-90">Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(total)}</p>
                </div>
                <span className="font-semibold text-lg">
                  Proceed to Checkout <ChevronRightIcon className="h-4 w-4 inline-block" />
                </span>
              </button>
              <p className="text-[11px] text-gray-500 mt-2 text-center">
                {totalItems} item{totalItems > 1 ? 's' : ''} in cart
              </p>
            </>
          )}
          </div>
        </div>
      </div>

      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onAddressAdded={handleAddressAdded}
      />
    </>
  );
};

export default CartDrawer;
