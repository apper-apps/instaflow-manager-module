import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { AuthContext } from '@/App';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/users', label: 'Users', icon: 'Users' },
    { path: '/blacklist', label: 'Blacklist', icon: 'UserX' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="bg-gradient-to-r from-primary via-accent to-secondary h-1"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Instagram" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">InstaFlow Manager</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
</nav>

          {/* User section */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.emailAddress}</p>
                </div>
                <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="LogOut" className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
</NavLink>
              ))}
              
              {/* Mobile user section */}
              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.emailAddress}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-600 hover:text-gray-900 mt-2"
                  >
                    <ApperIcon name="LogOut" className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;