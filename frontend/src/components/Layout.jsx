import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  PhotoIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import useUserStore from '../store/userStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Content', href: '/content', icon: PhotoIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Campaigns', href: '/campaigns', icon: CalendarIcon },
  { name: 'Instagram Accounts', href: '/instagram-accounts', icon: UserGroupIcon },
  { name: 'Automation', href: '/automation', icon: ChatBubbleLeftRightIcon },
  { name: 'Account Settings', href: '/account-settings', icon: CogIcon },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <h2 className="text-white text-lg font-semibold">SocioHiro</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 px-4 bg-gray-900">
              <h2 className="text-white text-lg font-semibold">SocioHiro</h2>
            </div>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 lg:hidden">
                SocioHiro
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <BellIcon className="h-6 w-6" />
              </button>
              
              {/* User menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.username || 'User'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 