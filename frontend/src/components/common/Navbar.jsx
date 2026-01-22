import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { logout } from '../../redux/slices/authSlice';
import { toggleCart } from '../../redux/slices/uiSlice';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img 
                src={logo} 
                alt="FlashBites Logo" 
                className="relative h-10 w-10 md:h-12 md:w-12 object-contain rounded-full ring-2 ring-primary-400 group-hover:ring-primary-500 transition-all transform group-hover:scale-105"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              FlashBites
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link 
              to="/restaurants" 
              className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium group px-2"
            >
              <span>Restaurants</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/orders" 
                  className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium group px-2"
                >
                  <span>Orders</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                {user?.role === 'restaurant_owner' && (
                  <Link 
                    to="/dashboard" 
                    className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium group px-2"
                  >
                    <span>Dashboard</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {user?.role === 'delivery_partner' && (
                  <Link 
                    to="/delivery-dashboard" 
                    className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium group px-2"
                  >
                    <span>Dashboard</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium group px-2"
                  >
                    <span>Admin Panel</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}

                {/* Notification Bell */}
                {isAuthenticated && <NotificationBell />}

                {/* Cart */}
                <button
                  onClick={() => dispatch(toggleCart())}
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-all duration-300 group"
                >
                  <ShoppingCartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown - Fixed click issue */}
                <div 
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-all duration-300 bg-gray-50 hover:bg-primary-50 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-primary-400"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span className="hidden xl:block font-medium">{user?.name}</span>
                  </button>
                  
                  {showDropdown && isAuthenticated && (
                    <div className="absolute right-0 mt-2 w-48 z-50 animate-slide-down"
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      <div className="bg-white rounded-xl shadow-2xl py-2 border-2 border-gray-200 overflow-hidden">
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 transition-all font-medium"
                          onClick={() => setShowDropdown(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-accent-50 hover:text-accent-600 transition-all font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2 md:space-x-3">
            {/* Notification Bell for Mobile */}
            {isAuthenticated && <NotificationBell />}
            
            {/* Cart Icon for Mobile */}
            {isAuthenticated && (
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-all"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Hamburger Menu */}
            <button 
              className="p-2 text-gray-700 hover:text-primary-600 transition-all hover:bg-primary-50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-gray-100 animate-slide-down bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/restaurants"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Restaurants
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  
                  {user?.role === 'restaurant_owner' && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'delivery_partner' && (
                    <Link
                      to="/delivery-dashboard"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-accent-50 hover:text-accent-600 rounded-lg transition-all font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-xl hover:shadow-primary-500/30 rounded-lg text-center font-semibold transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;