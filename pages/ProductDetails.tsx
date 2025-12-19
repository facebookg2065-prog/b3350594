
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc, updateDoc, increment } from '../firebase';
import { Product } from '../types';
import { Share2, Heart, MapPin, Phone, ShieldCheck, ShoppingCart, User, Eye, Loader2 } from 'lucide-react';
import { ContactModal } from '../components/ContactModal';

export const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const docRef = doc(db, 'ads', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Product;
        setProduct(data);
        // زيادة عدد المشاهدات
        await updateDoc(docRef, { views: increment(1) });
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  if (!product) return <div className="text-center py-20">المنتج غير موجود</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        sellerName={product.sellerName || 'بائع سوق الجمعة'}
        sellerPhone={product.sellerPhone}
        productTitle={product.title}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 aspect-[4/3] relative">
                     <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h1 className="text-2xl font-black text-gray-900 mb-4">{product.title}</h1>
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-3xl font-black text-blue-600">{product.price}</span>
                        <span className="text-gray-500 font-medium">{product.currency}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600 text-sm border-b pb-3">
                            <MapPin size={18} className="text-gray-400" />
                            <span>الموقع: {product.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm border-b pb-3">
                            <User size={18} className="text-gray-400" />
                            <span>البائع: {product.sellerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <Eye size={18} className="text-blue-500" />
                            <span>{product.views} مشاهدة</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsContactModalOpen(true)}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <Phone size={18} /> تواصل مع البائع
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg mb-4">وصف المنتج</h3>
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
