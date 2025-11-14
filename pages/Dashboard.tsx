import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Eye, Package, TrendingUp, LogOut, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_PRODUCTS } from '../data/mockData';

// Filter ads that "belong" to the logged in user for simulation
const MY_ADS = ALL_PRODUCTS.filter(p => p.isAd); 

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-4">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</h2>
            <Link to="/" className="text-blue-600 hover:underline">العودة للرئيسية</Link>
        </div>
    );
  }

  const totalViews = MY_ADS.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-4 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">مرحباً، {user.name}</h1>
                <p className="text-sm text-gray-500">لوحة تحكم البائع • {user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <PlusCircle size={18} />
                <span>إضافة إعلان جديد</span>
            </button>
            <button onClick={logout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition border border-red-100">
                <LogOut size={18} />
                <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">إجمالي المشاهدات</p>
                    <h3 className="text-3xl font-black text-gray-900">{totalViews.toLocaleString()}</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        <TrendingUp size={12} />
                        <span>+12% هذا الأسبوع</span>
                    </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Eye size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">إعلاناتي النشطة</p>
                    <h3 className="text-3xl font-black text-gray-900">{MY_ADS.length}</h3>
                    <p className="text-xs text-gray-400 mt-2">
                        من أصل 10 إعلانات مسموحة
                    </p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <Package size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">معدل التفاعل</p>
                    <h3 className="text-3xl font-black text-gray-900">4.2%</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        <TrendingUp size={12} />
                        <span>أداء ممتاز</span>
                    </p>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                    <BarChart3 size={24} />
                </div>
            </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">أداء الإعلانات</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">تحديث تلقائي</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">الإعلان</th>
                            <th className="px-6 py-4">الفئة</th>
                            <th className="px-6 py-4">المشاهدات</th>
                            <th className="px-6 py-4">تاريخ النشر</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MY_ADS.map((ad) => (
                            <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <Link to={`/product/${ad.id}`} className="flex items-center gap-3 group">
                                        <img src={ad.image} alt={ad.title} className="w-10 h-10 rounded object-cover bg-gray-200" />
                                        <span className="font-medium text-gray-900 text-sm max-w-[200px] truncate group-hover:text-blue-600 transition-colors">{ad.title}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {ad.category}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 font-bold text-gray-800">
                                        <Eye size={16} className="text-blue-500" />
                                        {ad.views?.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {ad.createdAt || '2024-03-01'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        نشط
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">تعديل</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
             <p>يتم معالجة هذه البيانات وتحليلها باستخدام خوارزميات Python لضمان دقة الإحصائيات.</p>
        </div>

      </div>
    </div>
  );
};