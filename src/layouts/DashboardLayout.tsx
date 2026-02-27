import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wallet
} from 'lucide-react';
import { clsx } from 'clsx';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transações', href: '/transactions', icon: Receipt },
    { name: 'Categorias', href: '/categories', icon: PieChart },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-600">
            <Wallet className="h-8 w-8 text-white mr-2" />
            <span className="text-xl font-bold text-white">FinDash</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name}
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center mt-1"
                  >
                    <LogOut className="h-3 w-3 mr-1" /> Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-indigo-600 h-16 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center">
           <Wallet className="h-6 w-6 text-white mr-2" />
           <span className="text-lg font-bold text-white">FinDash</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="h-16 flex items-center px-4 bg-indigo-600 text-white font-bold">
                Menu
              </div>
              <div className="flex-1 px-2 py-4 space-y-1">
                 {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        location.pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600',
                        'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                      )}
                    >
                      <item.icon className="mr-4 h-6 w-6 text-gray-400" />
                      {item.name}
                    </Link>
                 ))}
                 <button
                    onClick={logout}
                    className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
                 >
                    <LogOut className="mr-4 h-6 w-6" />
                    Sair
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 pt-16 md:pt-0">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
