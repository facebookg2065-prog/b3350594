
import React from 'react';
import { Search, ShoppingCart, Menu, User as UserIcon, Bell, LogIn, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogin = async () => {
    await loginWithGoogle();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-md text-white">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo & Menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 hover:bg-blue-700 rounded transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-1">
             سوق <span className="text-yellow-400">الجمعة</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div className="flex w-full bg-white rounded-lg overflow-hidden shadow-inner">
                <input 
                    type="text" 
                    placeholder="ابحث عن سيارات، موبايلات، أثاث..." 
                    className="flex-1 px-4 py-2 text-gray-800 focus:outline-none placeholder:text-gray-400"
                />
                <button className="bg-blue-800 hover:bg-blue-900 px-6 flex items-center justify-center text-white transition-colors">
                    <Search size={20} />
                </button>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
            <button className="hidden lg:flex flex-col items-center gap-0.5 hover:bg-blue-700 p-2 rounded transition-colors text-xs font-bold">
                AR
            </button>
            
            <div className="h-6 w-px bg-blue-400/50 hidden lg:block mx-1"></div>

            <button className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded-full transition-colors relative">
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-blue-600"></span>
            </button>

            {user ? (
              <Link to="/dashboard" className="flex items-center gap-2 hover:bg-blue-700 p-1.5 pr-3 rounded-full transition-colors bg-blue-700/30 border border-blue-400/30">
                <div className="hidden lg:flex flex-col items-end leading-none mr-1">
                    <span className="text-[10px] opacity-80">حسابي</span>
                    <span className="text-xs font-bold">{user.name.split(' ')[0]}</span>
                </div>
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
              </Link>
            ) : (
              <button 
                onClick={handleLogin}
                disabled={isLoading}
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-all shadow-md disabled:opacity-70 active:scale-95"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="G" className="w-4 h-4" />}
                <span>دخول</span>
              </button>
            )}
        </div>
      </div>

      {/* Mobile Search - Visible only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex w-full bg-white rounded-lg overflow-hidden h-10 shadow-inner">
            <input 
                type="text" 
                placeholder="ابحث في سوق الجمعة..." 
                className="flex-1 px-4 text-gray-800 focus:outline-none text-sm"
            />
            <button className="bg-blue-800 px-4 text-white">
                <Search size={18} />
            </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="bg-white text-gray-700 border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="container mx-auto px-4 flex items-center gap-6 whitespace-nowrap text-sm font-bold h-11">
              <Link to="/" className="text-blue-600 border-b-2 border-blue-600 h-full flex items-center px-1">الرئيسية</Link>
              <Link to="/category/electronics" className="hover:text-blue-600 transition-colors py-2">إلكترونيات</Link>
              <Link to="/category/cars" className="hover:text-blue-600 transition-colors py-2">سيارات</Link>
              <Link to="/category/real_estate" className="hover:text-blue-600 transition-colors py-2">عقارات</Link>
              <Link to="/category/home" className="hover:text-blue-600 transition-colors py-2">منزل</Link>
              <Link to="/category/fashion" className="hover:text-blue-600 transition-colors py-2">أزياء</Link>
              <Link to="/category/gaming" className="hover:text-blue-600 transition-colors py-2">ألعاب</Link>
              <Link to="/category/deals" className="hover:text-red-600 transition-colors py-2 text-red-500 flex items-center gap-1">
                تخفيضات ⚡
              </Link>
          </div>
      </nav>

      {/* Mobile Sidebar Menu (Simple) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full shadow-2xl p-6 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-black text-xl">القائمة</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400"><X size={24} /></button>
                </div>
                <div className="flex flex-col gap-4 text-gray-800 font-bold">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>لوحة التحكم</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>عن سوق الجمعة</Link>
                    <Link to="/terms" onClick={() => setIsMobileMenuOpen(false)}>الشروط والأحكام</Link>
                    <div className="h-px bg-gray-100 my-2"></div>
                    {!user && (
                        <button onClick={handleLogin} className="bg-blue-600 text-white py-3 rounded-xl">تسجيل الدخول</button>
                    )}
                </div>
            </div>
        </div>
      )}
    </header>
  );
};
