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
    <nav className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 shadow-xl sticky top-0 z-50 border-b border-primary-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img 
                src={logo} 
                alt="FlashBites Logo" 
                className="relative h-10 w-10 md:h-12 md:w-12 object-contain rounded-full ring-2 ring-primary-500 group-hover:ring-primary-400 transition-all"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              FlashBites
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link 
              to="/restaurants" 
              className="relative text-gray-100 hover:text-primary-400 transition-all duration-300 font-medium group px-2"
            >
              <span>Restaurants</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/orders" 
                  className="relative text-gray-100 hover:text-primary-400 transition-all duration-300 font-medium group px-2"
                >
                  <span>Orders</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                {user?.role === 'restaurant_owner' && (
                  <Link 
                    to="/dashboard" 
                    className="relative text-gray-100 hover:text-primary-400 transition-all duration-300 font-medium group px-2"
                  >
                    <span>Dashboard</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {user?.role === 'delivery_partner' && (
                  <Link 
                    to="/delivery-dashboard" 
                    className="relative text-gray-100 hover:text-primary-400 transition-all duration-300 font-medium group px-2"
                  >
                    <span>Dashboard</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="relative text-gray-100 hover:text-primary-400 transition-all duration-300 font-medium group px-2"
                  >
                    <span>Admin Panel</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}

                {/* Notification Bell */}
                {isAuthenticated && <NotificationBell />}

                {/* Cart */}
                <button
                  onClick={() => dispatch(toggleCart())}
                  className="relative p-2 text-gray-100 hover:text-primary-400 transition-all duration-300 group"
                >
                  <ShoppingCartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-glow-red">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button className="flex items-center space-x-2 text-gray-100 hover:text-primary-400 transition-all duration-300 bg-dark-800 hover:bg-dark-700 px-4 py-2 rounded-lg border border-dark-700 hover:border-primary-600">
                    <UserCircleIcon className="h-5 w-5" />
                    <span className="hidden xl:block font-medium">{user?.name}</span>
                  </button>
                  
                  {showDropdown && isAuthenticated && (
                    <div className="absolute right-0 mt-2 pt-2 w-48 z-50 animate-slide-down">
                      <div className="bg-dark-800 rounded-xl shadow-2xl py-2 border border-dark-700 overflow-hidden">
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 hover:text-primary-400 transition-all"
                          onClick={() => setShowDropdown(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 hover:text-accent-400 transition-all"
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
                  className="text-gray-100 hover:text-primary-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-dark-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-glow-orange transform hover:scale-105 transition-all duration-300"
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
                className="relative p-2 text-gray-100 hover:text-primary-400 transition-all"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-glow-red">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Hamburger Menu */}
            <button 
              className="p-2 text-gray-100 hover:text-primary-400 transition-all hover:bg-dark-700 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-dark-700 animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/restaurants"
                className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Restaurants
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  
                  {user?.role === 'restaurant_owner' && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'delivery_partner' && (
                    <Link
                      to="/delivery-dashboard"
                      className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-accent-600/20 hover:to-accent-700/20 rounded-lg transition-all font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-100 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 rounded-lg transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-primary text-white hover:shadow-glow-orange rounded-lg text-center font-semibold transition-all"
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