
import React, { useState } from 'react';
import { X, Upload, MapPin, DollarSign, LayoutGrid, Type, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, serverTimestamp } from '../firebase';

interface AddAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAdModal: React.FC<AddAdModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    currency: 'ر.س',
    location: '',
    description: '',
    condition: 'new'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('يجب تسجيل الدخول أولاً');

    setIsLoading(true);
    try {
      // حفظ الإعلان في Firestore
      await addDoc(collection(db, 'ads'), {
        ...formData,
        price: Number(formData.price),
        sellerId: user.id,
        sellerName: user.name,
        sellerAvatar: user.avatar,
        createdAt: serverTimestamp(),
        views: 0,
        isAd: true,
        image: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}` // صورة عشوائية مؤقتة
      });
      
      onClose();
      alert('تم نشر إعلانك بنجاح!');
    } catch (error) {
      console.error("Error adding ad:", error);
      alert('حدث خطأ أثناء النشر، حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid size={20} className="text-blue-400" />
                إضافة إعلان جديد
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" required>
                                <option value="">اختر القسم</option>
                                {Object.entries(CATEGORIES).map(([key, cat]) => (
                                    <option key={key} value={key}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" required />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none mb-4" required />
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none resize-none" required></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">إلغاء</button>
                    <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'نشر الإعلان'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
