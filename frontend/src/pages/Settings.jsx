import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiEdit2,
  FiChevronRight,
  FiUser,
  FiBell,
  FiGlobe,
  FiShield,
  FiFileText,
  FiAlertTriangle,
  FiHome,
  FiSearch,
  FiShoppingBag,
  FiSettings,
} from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const initials = (user?.name || 'U').slice(0, 1).toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out');
    navigate('/');
  };

  const Row = ({ icon, title, subtitle, danger = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 ${danger ? 'bg-red-50' : 'bg-[#eceff3]'} active:opacity-80 transition-opacity`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${danger ? 'bg-red-100 text-red-500' : 'bg-[#f3ece8] text-orange-500'} shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0 text-left">
          <p className={`text-[16px] font-semibold ${danger ? 'text-red-600' : 'text-slate-900'} truncate`}>{title}</p>
          {subtitle && (
            <p className={`text-[14px] ${danger ? 'text-red-400' : 'text-slate-500'} truncate`}>{subtitle}</p>
          )}
        </div>
      </div>
      <FiChevronRight className={`${danger ? 'text-red-400' : 'text-slate-400'} w-5 h-5`} />
    </button>
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <div className="max-w-md mx-auto px-5 pt-5 pb-32">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[22px] font-normal text-slate-900">Settings</h1>
          <div className="w-9 h-9" />
        </div>

        <div className="mt-7 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#f6d9cf] flex items-center justify-center">
              <div className="w-[88px] h-[88px] rounded-full border-[3px] border-white bg-[#e7d1ae] flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">{initials}</span>
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-2 rounded-full shadow-md">
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="mt-3 text-[28px] leading-tight font-semibold text-slate-900 text-center">{user?.name || 'User Name'}</h2>
          <p className="mt-1 text-slate-500 text-[15px] text-center">{user?.email || 'user@example.com'}</p>

          <button
            onClick={() => navigate('/profile')}
            className="mt-4 h-11 px-8 rounded-full bg-[#f3ece8] text-orange-500 text-[16px] font-semibold"
          >
            Edit Profile
          </button>
        </div>

        <section className="mt-7">
          <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">Account</h3>
          <div className="rounded-3xl overflow-hidden">
            <Row icon={<FiUser className="w-5 h-5" />} title="Account Information" subtitle="Name, Email, Phone Number" onClick={() => navigate('/profile')} />
            <Row icon={<FiBell className="w-5 h-5" />} title="Notifications" subtitle="Push, Email & SMS preferences" onClick={() => navigate('/notifications')} />
            <Row icon={<FiGlobe className="w-5 h-5" />} title="Language" subtitle="English (US)" onClick={() => toast('Language options coming soon')} />
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">Legal & Info</h3>
          <div className="rounded-3xl overflow-hidden">
            <Row icon={<FiShield className="w-5 h-5" />} title="Privacy Policy" onClick={() => navigate('/privacy')} />
            <Row icon={<FiFileText className="w-5 h-5" />} title="Terms of Service" onClick={() => navigate('/terms')} />
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">Danger Zone</h3>
          <div className="rounded-3xl overflow-hidden">
            <Row icon={<FiAlertTriangle className="w-5 h-5" />} title="Delete Account" subtitle="This action cannot be undone" danger onClick={() => toast.error('Delete account flow coming soon')} />
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="mt-8 w-full text-center text-[22px] font-medium text-slate-500 py-3"
        >
          Log Out
        </button>

        <p className="mt-2 text-center text-[10px] text-slate-300">FLASHBITES V4.2.0</p>
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-4 px-2 py-2">
          <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiHome className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] leading-none font-medium text-slate-400">Home</span>
          </button>
          <button onClick={() => navigate('/orders')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiShoppingBag className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] leading-none font-medium text-slate-400">Orders</span>
          </button>
          <button onClick={() => navigate('/restaurants')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiSearch className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] leading-none font-medium text-slate-400">Search</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex flex-col items-center justify-center gap-1 py-1">
            <FiSettings className="w-5 h-5 text-orange-500" />
            <span className="text-[10px] leading-none font-normal text-orange-500">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
