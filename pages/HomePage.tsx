
import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { LayoutGrid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot } from '../firebase';
import { Product } from '../types';
import { CATEGORIES } from '../data/mockData';

export const HomePage: React.FC = () => {
  const [recentAds, setRecentAds] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setRecentAds(ads);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="flex-grow">
      <section className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">سوق الجمعة <br/><span className="text-yellow-400">كل ما تحتاجه في مكان واحد</span></h1>
              <p className="text-blue-100 text-lg mb-8">اكتشف آلاف المنتجات والإعلانات بأفضل الأسعار</p>
              <Link to="/dashboard" className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-all inline-block">ابدأ بالبيع الآن</Link>
          </div>
      </section>

      <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><LayoutGrid className="text-blue-600" /> تصفح الأقسام</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <Link key={key} to={`/category/${key}`} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                      <div className={`p-4 rounded-full mb-3 ${cat.color} group-hover:scale-110 transition-transform`}><cat.icon size={28} /></div>
                      <span className="font-medium text-gray-700">{cat.name}</span>
                  </Link>
              ))}
          </div>
      </section>

      <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">آخر الإعلانات</h2>
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentAds.map(ad => <ProductCard key={ad.id} product={ad} />)}
                </div>
              )}
            </div>
      </section>
    </main>
  );
};
