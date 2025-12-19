
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Eye, Package, TrendingUp, LogOut, PlusCircle, ShoppingBag, ShieldCheck, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, where, onSnapshot, orderBy } from '../firebase';
import { AddAdModal } from '../components/AddAdModal';
import { Product } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout, loginWithGoogle, isLoading: authLoading } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [myAds, setMyAds] = useState<Product[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'ads'),
      where('sellerId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setMyAds(adsData);
      setLoadingAds(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-gray-900 text-white flex-grow flex items-center relative overflow-hidden">
                <div className="container mx-auto px-4 py-20 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">ابدأ تجارتك مع سوق الجمعة</h1>
                    <p className="text-xl text-gray-400 mb-10">منصة متكاملة لإدارة إعلاناتك والوصول لآلاف المشترين</p>
                    <button onClick={loginWithGoogle} className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 mx-auto">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="G" className="w-6 h-6 bg-white rounded-full p-0.5" />
                        تسجيل الدخول بحساب جوجل
                    </button>
                </div>
            </div>
        </div>
    );
  }

  const totalViews = myAds.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <AddAdModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <div className="bg-white border-b border-gray-200 pt-8 pb-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img src={user.avatar} className="w-16 h-16 rounded-full border-2 border-blue-500" alt="" />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">مرحباً، {user.name}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">إعلان جديد</button>
            <button onClick={logout} className="bg-white text-red-600 px-4 py-3 rounded-xl border border-gray-200"><LogOut size={20} /></button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">إجمالي المشاهدات</p>
                    <h3 className="text-3xl font-black">{totalViews.toLocaleString()}</h3>
                </div>
                <Eye className="text-blue-500" size={32} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">إعلاناتي</p>
                    <h3 className="text-3xl font-black">{myAds.length}</h3>
                </div>
                <Package className="text-purple-500" size={32} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">الحالة</p>
                    <h3 className="text-xl font-black text-green-600">نشط</h3>
                </div>
                <ShieldCheck className="text-green-500" size={32} />
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 font-bold">إدارة الإعلانات</div>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 text-xs">
                        <tr>
                            <th className="px-6 py-4">الإعلان</th>
                            <th className="px-6 py-4">الفئة</th>
                            <th className="px-6 py-4">المشاهدات</th>
                            <th className="px-6 py-4">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loadingAds ? (
                          <tr><td colSpan={4} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                        ) : myAds.length === 0 ? (
                          <tr><td colSpan={4} className="p-10 text-center text-gray-400">لا توجد إعلانات بعد</td></tr>
                        ) : myAds.map((ad) => (
                            <tr key={ad.id} className="hover:bg-blue-50/30">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={ad.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                        <span className="font-bold text-sm">{ad.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs">{ad.category}</td>
                                <td className="px-6 py-4 text-sm">{ad.views}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">نشط</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};
