import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  Wallet,
  CircleDollarSign,
  UserCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">LoanManager</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/"
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="/loans"
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive('/loans') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Loans</span>
                </a>
              </li>
              <li>
                <a 
                  href="/payments"
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive('/payments') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <CircleDollarSign className="h-5 w-5" />
                  <span>Payments</span>
                </a>
              </li>
              <li>
                <a 
                  href="/profile"
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive('/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;