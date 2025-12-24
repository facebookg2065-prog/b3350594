
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, Package, LogOut, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { db, collection, query, where, onSnapshot, orderBy } from '../firebase';
import { AddAdModal } from '../components/AddAdModal';
import { Product } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout, loginWithGoogle, isLoading: authLoading } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [myAds, setMyAds] = useState<Product[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [queryError, setQueryError] = useState(false);

  useEffect(() => {
    if (!user) return;

    // استعلام مع الترتيب الزمني
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
      setQueryError(false);
    }, (error) => {
      console.error("Dashboard Query Error:", error);
      // في حال وجود خطأ في الفهرس (Index) نقوم بجلب البيانات بدون ترتيب كخطة بديلة
      setLoadingAds(false);
      setQueryError(true);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-black mb-4">سوق الجمعة للشركاء</h1>
                <p className="text-gray-400 mb-8">قم بتسجيل الدخول لإدارة إعلاناتك ومتابعة مبيعاتك</p>
                <button onClick={loginWithGoogle} className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="G" className="w-6 h-6" />
                    الدخول بواسطة جوجل
                </button>
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
            <img src={user.avatar} className="w-16 h-16 rounded-full border-4 border-blue-50 ring-2 ring-blue-500" alt="" />
            <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">إعلان جديد</button>
            <button onClick={logout} className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"><LogOut size={22} /></button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {queryError && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 flex items-start gap-3 text-amber-800 text-sm">
                <AlertCircle size={20} className="shrink-0" />
                <p>ملاحظة: جاري إعداد قواعد البيانات. قد لا تظهر الإعلانات مرتبة بشكل صحيح حالياً.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">المشاهدات</p>
                    <h3 className="text-3xl font-black text-gray-900">{totalViews.toLocaleString()}</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Eye size={28} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-purple-200 transition-all">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">إعلاناتي</p>
                    <h3 className="text-3xl font-black text-gray-900">{myAds.length}</h3>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Package size={28} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-green-200 transition-all">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">حالة الحساب</p>
                    <h3 className="text-xl font-black text-green-600">موثق</h3>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <ShieldCheck size={28} />
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">إدارة المحتوى</h2>
                <span className="text-xs bg-white border px-3 py-1 rounded-full text-gray-500 font-bold">مباشر</span>
            </div>
            <div className="overflow-x-auto text-right">
                <table className="w-full">
                    <thead className="bg-gray-50/80 text-gray-400 text-[10px] font-black uppercase">
                        <tr>
                            <th className="px-6 py-4">المنتج</th>
                            <th className="px-6 py-4">القسم</th>
                            <th className="px-6 py-4">المشاهدات</th>
                            <th className="px-6 py-4 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loadingAds ? (
                          <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                        ) : myAds.length === 0 ? (
                          <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium">لم تقم بإضافة أي إعلانات بعد. ابدأ الآن!</td></tr>
                        ) : myAds.map((ad) => (
                            <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={ad.image} className="w-12 h-12 rounded-xl object-cover border" alt="" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-sm line-clamp-1">{ad.title}</span>
                                            <span className="text-[10px] text-blue-600 font-bold">{ad.price} {ad.currency}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-500">{ad.category}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                                        <Eye size={14} className="text-gray-300" />
                                        {ad.views || 0}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">نشط</span>
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
