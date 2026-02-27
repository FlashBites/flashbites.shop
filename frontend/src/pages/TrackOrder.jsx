import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById, getOrderTracking } from '../api/orderApi';
import { Loader } from '../components/common/Loader';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FiArrowLeft,
  FiHelpCircle,
  FiPhone,
  FiMessageSquare,
  FiChevronRight,
  FiMapPin,
  FiCheck,
  FiPackage,
  FiTruck,
  FiShoppingBag,
} from 'react-icons/fi';

const partnerIcon = L.divIcon({
  className: '',
  html: '<div style="width:44px;height:44px;border-radius:9999px;background:#f97316;color:#fff;display:flex;align-items:center;justify-content:center;border:4px solid rgba(255,255,255,0.85);box-shadow:0 4px 12px rgba(249,115,22,.35);font-size:18px">🛵</div>',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const destinationIcon = L.divIcon({
  className: '',
  html: '<div style="width:44px;height:44px;border-radius:9999px;background:#fff;color:#f97316;display:flex;align-items:center;justify-content:center;border:3px solid #f97316;box-shadow:0 4px 12px rgba(15,23,42,.18);font-size:17px">🏠</div>',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

const statusToStep = (status) => {
  if (status === 'delivered') return 3;
  if (status === 'out_for_delivery') return 2;
  if (status === 'ready' || status === 'preparing' || status === 'confirmed') return 1;
  return 0;
};

const TrackOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const isDemoTrack = id === 'demo';

  const fetchTrackingDetails = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const [orderRes, trackingRes] = await Promise.all([
        getOrderById(id),
        getOrderTracking(id),
      ]);
      setOrder(orderRes?.data?.order || null);
      setTracking(trackingRes?.data || null);
    } catch {
      toast.error('Failed to load tracking details');
      navigate('/orders');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isDemoTrack) {
      const demoEta = new Date(Date.now() + 14 * 60000).toISOString();
      const demoOrder = {
        _id: 'demo-track-0001',
        status: 'out_for_delivery',
        estimatedDelivery: demoEta,
        items: [
          { name: 'Spicy Zinger Burger', quantity: 2 },
          { name: 'Coke', quantity: 1 },
        ],
      };

      const demoTracking = {
        estimatedDelivery: demoEta,
        restaurant: {
          location: { coordinates: [-122.4194, 37.7749] },
        },
        deliveryAddress: {
          coordinates: { coordinates: [-122.391, 37.789] },
        },
        currentLocation: {
          latitude: 37.764,
          longitude: -122.432,
        },
        deliveryPartner: {
          name: 'Alex Johnson',
          phone: '+911234567890',
        },
      };

      setOrder(demoOrder);
      setTracking(demoTracking);
      setLoading(false);
      return;
    }

    fetchTrackingDetails();
    const interval = setInterval(() => fetchTrackingDetails({ silent: true }), 30000);
    return () => clearInterval(interval);
  }, [id, isDemoTrack]);

  const etaText = useMemo(() => {
    const eta = tracking?.estimatedDelivery || order?.estimatedDelivery;
    if (!eta) return '15-20 mins';
    const minsLeft = Math.max(Math.round((new Date(eta).getTime() - Date.now()) / 60000), 1);
    if (minsLeft <= 10) return '10 mins';
    if (minsLeft <= 20) return '10-20 mins';
    if (minsLeft <= 30) return '20-30 mins';
    return `${minsLeft} mins`;
  }, [tracking?.estimatedDelivery, order?.estimatedDelivery]);

  const currentStep = statusToStep(order?.status);
  const partnerName = tracking?.deliveryPartner?.name || 'Delivery Partner';
  const partnerPhone = tracking?.deliveryPartner?.phone || '';
  const userInitial = (partnerName || 'D').slice(0, 1).toUpperCase();
  const orderItemsText = (order?.items || [])
    .slice(0, 2)
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(', ');

  const restaurantPos = tracking?.restaurant?.location?.coordinates?.length === 2
    ? [tracking.restaurant.location.coordinates[1], tracking.restaurant.location.coordinates[0]]
    : null;
  const deliveryPos = tracking?.deliveryAddress?.coordinates?.coordinates?.length === 2
    ? [tracking.deliveryAddress.coordinates.coordinates[1], tracking.deliveryAddress.coordinates.coordinates[0]]
    : null;
  const partnerPos = tracking?.currentLocation?.latitude && tracking?.currentLocation?.longitude
    ? [tracking.currentLocation.latitude, tracking.currentLocation.longitude]
    : null;
  const mapCenter = partnerPos || (restaurantPos && deliveryPos
    ? [(restaurantPos[0] + deliveryPos[0]) / 2, (restaurantPos[1] + deliveryPos[1]) / 2]
    : restaurantPos || deliveryPos || [28.6139, 77.2090]);

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="max-w-md mx-auto min-h-screen">
        <div className="px-4 pt-5 pb-4 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800">
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] font-semibold text-slate-900">Track Order</h1>
            <button onClick={() => navigate('/help')} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800">
              <FiHelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative h-[560px] bg-[#9ed3ea] overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {deliveryPos && <Marker position={deliveryPos} icon={destinationIcon} />}
            {partnerPos && <Marker position={partnerPos} icon={partnerIcon} />}
            {!partnerPos && restaurantPos && <Marker position={restaurantPos} icon={partnerIcon} />}
            <MapRecenter center={partnerPos || mapCenter} />
          </MapContainer>

          <div className="absolute top-3 left-4 right-4 z-[600] rounded-[34px] border border-[#f1d2c5] bg-[#f7f8fa] px-5 py-4 flex items-start justify-between shadow-sm">
            <div>
              <p className="text-[17px] font-semibold text-orange-500">Your food is on the way!</p>
              <p className="text-[16px] text-slate-500 mt-1">Delivery partner is 2 mins away</p>
            </div>
            <button
              onClick={() => (isDemoTrack ? navigate('/orders') : navigate(`/orders/${id}`))}
              className="h-12 px-6 rounded-full bg-orange-500 text-white text-[16px] font-semibold shrink-0"
            >
              View Detail
            </button>
          </div>

          <div className="absolute left-[22%] top-[47%] w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-[0_0_0_8px_rgba(249,115,22,0.28)]">
            <FiTruck className="w-6 h-6" />
          </div>
          <div className="absolute right-[19%] top-[35%] w-14 h-14 rounded-full bg-white text-orange-500 border-[3px] border-orange-500 flex items-center justify-center shadow">
            <FiMapPin className="w-5 h-5" />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-7 rounded-[34px] bg-[#f5f7fa] px-10 py-5 text-center shadow-md z-[450]">
            <p className="text-[13px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Estimated Arrival</p>
            <p className="text-[30px] leading-none font-bold text-slate-900 mt-1">{etaText}</p>
          </div>
        </div>

        <div className="relative -mt-3 rounded-t-[34px] bg-[#f3f4f6] px-4 pb-5 pt-3 border-t border-slate-200">
          <div className="w-14 h-1 rounded-full bg-slate-300 mx-auto mb-4" />

          <div className="relative">
            <div className="absolute left-7 right-7 top-[22px] h-[3px] bg-orange-500/70" />
            <div className="absolute left-[76%] right-0 top-[22px] h-[3px] bg-slate-300" />
            <div className="flex items-start justify-between">
              {[0, 1, 2, 3].map((step) => {
                const active = step <= currentStep;
                const Icon = step === 0 ? FiCheck : step === 1 ? FiPackage : step === 2 ? FiTruck : FiShoppingBag;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2 w-1/4">
                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center ${active ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#e8ebf0] border-[#d2d8e1] text-[#93a0b5]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`text-[13px] uppercase tracking-[0.04em] font-semibold ${active ? (step === 2 ? 'text-orange-500' : 'text-slate-900') : 'text-[#93a0b5]'}`}>
                      {step === 0 ? 'Placed' : step === 1 ? 'Preparing' : step === 2 ? 'On Way' : 'Arrived'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-[#eceff3] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-16 h-16 rounded-full bg-[#e7d1ae] border-2 border-white flex items-center justify-center">
                <span className="text-[22px] font-semibold text-slate-700">{userInitial}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[20px] leading-tight font-semibold text-slate-900 truncate">{partnerName}</p>
                <p className="text-[14px] text-slate-500">⭐ 4.9 • Delivery Partner</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-3">
              <a
                href={partnerPhone ? `tel:${partnerPhone}` : 'tel:18001234567'}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-sm"
              >
                <FiPhone className="w-5 h-5" />
              </a>
              <button
                onClick={() => navigate('/help')}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-sm"
              >
                <FiMessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => (isDemoTrack ? navigate('/orders') : navigate(`/orders/${id}`))}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#f7ede8] text-orange-500 flex items-center justify-center">
                <FiShoppingBag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-slate-400">Order #{(order?._id || '').slice(-8).toUpperCase()}</p>
                <p className="text-[16px] font-semibold text-slate-900 truncate">{orderItemsText || 'Order items'}</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
