
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { ArrowRight, Filter, LayoutGrid, Loader2 } from 'lucide-react';
import { db, collection, query, where, orderBy, onSnapshot } from '../firebase';
import { Product } from '../types';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryInfo = categoryId && CATEGORIES[categoryId] 
    ? CATEGORIES[categoryId] 
    : { name: 'كل المنتجات', icon: null, color: 'bg-gray-100 text-gray-600' };

  useEffect(() => {
    setLoading(true);
    let q;
    
    if (categoryId) {
      // جلب منتجات قسم معين
      q = query(
        collection(db, 'ads'),
        where('category', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
    } else {
      // جلب كل المنتجات
      q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(adsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId]);

  const otherCategories = Object.entries(CATEGORIES).filter(([key]) => key !== categoryId);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">الرئيسية</Link>
            <span>/</span>
            <span className="text-gray-800 font-bold">{categoryInfo.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-right">
            <div className="w-full">
                <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                    {categoryInfo.name}
                </h1>
                <p className="text-gray-500">
                    {loading ? 'جاري التحميل...' : `تم العثور على ${products.length} إعلان في هذا القسم`}
                </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                    <Filter size={16} />
                    <span>تصفية</span>
                </button>
                <select className="flex-1 md:flex-none bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm outline-none focus:border-blue-500">
                    <option>الأحدث أولاً</option>
                    <option>السعر: من الأقل</option>
                    <option>السعر: من الأعلى</option>
                </select>
            </div>
        </div>

        {/* Grid Content */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500">جاري جلب الإعلانات...</p>
            </div>
        ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 mb-16 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد إعلانات حالياً</h3>
                <p className="text-gray-500 mb-6">كن أول من ينشر إعلاناً في هذا القسم!</p>
                <Link to="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    أضف إعلانك الآن
                </Link>
            </div>
        )}

        {/* Categories Interlinking */}
        <div className="border-t border-gray-200 pt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <LayoutGrid size={20} className="text-blue-600" />
                تصفح أقسام أخرى
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {otherCategories.slice(0, 5).map(([key, cat]) => (
                    <Link 
                        key={key} 
                        to={`/category/${key}`} 
                        className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-3 group"
                    >
                        <div className={`p-2 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                            <cat.icon size={18} />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors text-sm">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
