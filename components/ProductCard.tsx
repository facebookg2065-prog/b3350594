
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Heart, Eye, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // التأكد من أن النقر ليس على زر فرعي
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
        onClick={handleCardClick}
        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative cursor-pointer"
    >
        {/* Badges */}
        {product.isAd && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-sm uppercase tracking-wider">
                إعلان مميز
            </div>
        )}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <button className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-20 active:scale-90">
            <Heart size={18} />
        </button>
        
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-md font-bold">
            <MapPin size={10} />
            <span>{product.location || 'غير محدد'}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow text-right">
        <h3 className="text-gray-800 font-bold text-sm mb-2 line-clamp-2 h-10 leading-relaxed group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
             <div className="flex flex-col">
                <span className="text-lg font-black text-blue-600">
                    {product.price.toLocaleString()} <span className="text-[10px] font-bold text-gray-500">{product.currency}</span>
                </span>
             </div>
             {product.views !== undefined && (
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                    <Eye size={12} />
                    <span>{product.views}</span>
                </div>
             )}
          </div>
          
          <button className="w-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95">
             <span>{product.isAd ? 'عرض التفاصيل' : 'اشتري الآن'}</span>
             <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
