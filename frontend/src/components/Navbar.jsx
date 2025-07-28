import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import LogoutModal from './LogoutModal';

const Navbar = ({ user, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              SocioHiro
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <BellIcon className="h-6 w-6" />
            </button>
            
            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <UserCircleIcon className="h-6 w-6" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || 'User'}
                </span>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        onClick={() => {/* Navigate to profile */}}
                      >
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        onClick={() => {/* Navigate to settings */}}
                      >
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2 text-red-600" />
                          Logout
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </nav>
  );
};

export default Navbar; 