import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { FIT } from '@/design/tokens';
import { Phone, TopBar, Card, Button, Input, Icon, FoodThumb } from '@/design/primitives';
import { useSearchFoods } from '@/api/hooks';
import { useProfile } from '@/stores/profile';
import { useT } from '@/stores/prefs';
import { useUI } from '@/stores/ui';
import { Unit } from '@fit/shared-types';

interface AdminFood {
  slug: string;
  name_uz: string;
  name_ru?: string;
  name_en?: string;
  emoji: string;
  category: string;
  per_100g: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    type: string;
  };
  grams_per_unit: number;
  default_unit: Unit;
  nutrients?: Record<string, number>;
}

export function AdminProductsScreen({ onBack }: { onBack: () => void }) {
  const t = useT();
  const toast = useUI(s => s.toast);
  const role = useProfile(s => s.role);
  const email = useProfile(s => s.email);
  const pullProfile = useProfile(s => s.pullFromSupabase);
  const [isSyncing, setIsSyncing] = useState(true);
  
  const [q, setQ] = useState('');
  const [editingFood, setEditingFood] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { data: foods, isLoading, refetch } = useSearchFoods(q, 'uz', true);

  useEffect(() => {
    pullProfile().finally(() => setIsSyncing(false));
  }, []);

  const handleSave = async (foodData: AdminFood) => {
    try {
      const { error } = await supabase
        .from('uq_products')
        .upsert(foodData);
      
      if (error) throw error;
      
      toast(foodData.slug ? 'Product updated' : 'Product created', 'success');
      setEditingFood(null);
      setIsAdding(false);
      refetch();
    } catch (err: any) {
      console.error('Save error:', err);
      toast(err.message || 'Error saving product', 'error');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase
        .from('uq_products')
        .delete()
        .eq('slug', slug);
      
      if (error) throw error;
      toast('Product deleted', 'success');
      refetch();
    } catch (err) {
      console.error('Delete error:', err);
      toast('Error deleting product', 'error');
    }
  };

  if (isSyncing) {
    return (
      <Phone showStatus dark mesh>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="shimmer" style={{ width: 40, height: 40, borderRadius: 20 }} />
          <div style={{ marginLeft: 12, fontWeight: 700, color: FIT.cyan }}>Verifying permissions...</div>
        </div>
      </Phone>
    );
  }
  
  if (role !== 'admin') {
    return (
      <Phone showStatus dark mesh>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 40, background: 'rgba(255,59,48,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 
          }}>
            <Icon name="lock" size={40} color={FIT.danger} />
          </div>
          
          <div style={{ fontSize: 24, fontWeight: 900 }}>Access Denied</div>
          <div style={{ color: FIT.textMuted, marginTop: 12, lineHeight: 1.5 }}>
            Your account does not have administrator privileges.
          </div>

          <div style={{ 
            marginTop: 32, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)', width: '100%', textAlign: 'left'
          }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: FIT.cyan, fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>Debug Session Data</div>
            <div style={{ fontSize: 13, fontFamily: FIT.mono, color: FIT.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Email: <span style={{ color: '#fff' }}>{email}</span></div>
              <div>Role: <span style={{ color: FIT.danger }}>{role || 'null'}</span></div>
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <Button variant="premium" full onClick={() => {
              setIsSyncing(true);
              pullProfile().finally(() => setIsSyncing(false));
            }}>
              Retry Sync
            </Button>
            
            <Button full onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}>
              Sign Out & Restart
            </Button>

            <Button variant="ghost" full onClick={onBack}>
              Go Back
            </Button>
          </div>
        </div>
      </Phone>
    );
  }

  return (
    <Phone showStatus dark mesh>
      <TopBar 
        title={t.manageProducts} 
        subtitle="FIT AI Catalog" 
        back 
        onBack={onBack} 
      />

      <div style={{ padding: '0 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        <Input 
          placeholder="Search products to edit..." 
          value={q} 
          onChange={setQ}
          leading={<Icon name="search" size={20} color={FIT.textMuted} />}
        />

        <Button variant="premium" full onClick={() => setIsAdding(true)} leading={<Icon name="plus" size={20} color="#000" />}>
          {t.addProduct}
        </Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: FIT.textMuted }}>Loading products...</div>
          ) : foods?.map(food => (
            <Card key={food.id} pad={16} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <FoodThumb name={food.name} emoji={food.emoji} photo={food.photoUrl || undefined} size={50} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{food.name}</div>
                <div style={{ fontSize: 12, color: FIT.textMuted }}>{food.kcalPer100g} kcal · {food.category}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => {
                    // Map back to AdminFood structure if needed, or just pass as is if compatible
                    setEditingFood(food);
                  }}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Icon name="edit" size={18} color={FIT.cyan} />
                </button>
                <button 
                  onClick={() => handleDelete(food.id as string)}
                  style={{ background: 'rgba(255,0,0,0.1)', border: 'none', width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Icon name="trash" size={18} color={FIT.danger} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(editingFood || isAdding) && (
          <ProductEditor 
            food={editingFood} 
            onClose={() => { setEditingFood(null); setIsAdding(false); }} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>
    </Phone>
  );
}

function ProductEditor({ food, onClose, onSave }: { food: any, onClose: () => void, onSave: (data: AdminFood) => void }) {
  const t = useT();
  const toast = useUI(s => s.toast);
  
  // Use VITE_SUPABASE_STORAGE_URL from env if available
  const STORAGE_URL = import.meta.env.VITE_SUPABASE_STORAGE_URL || 'https://vuxpysphjpqpnutpfbux.supabase.co/storage/v1/object/public/foods';

  const [formData, setFormData] = useState<AdminFood>({
    slug: food?.id || '',
    name_uz: food?.name || '',
    emoji: food?.emoji || '🍎',
    category: food?.category || 'Common',
    per_100g: food?.rawData?.per_100g || {
      kcal: food?.kcalPer100g || 0,
      protein: food?.proteinG || 0,
      carbs: food?.carbsG || 0,
      fat: food?.fatG || 0,
      type: 'food'
    },
    grams_per_unit: food?.gramsPerUnit || 1,
    default_unit: food?.defaultUnit || 'g',
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(food?.photoUrl || null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.slug) {
      if (!formData.slug) toast('Please enter a slug first', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${formData.slug}.jpeg`;
      const { error } = await supabase.storage
        .from('foods')
        .upload(fileName, file, { upsert: true, contentType: 'image/jpeg' });
      
      if (error) throw error;
      
      setPreview(`${STORAGE_URL}/${fileName}?t=${Date.now()}`);
      toast('Image uploaded successfully', 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast(err.message || 'Error uploading image', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 100, background: '#020617',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <TopBar 
        title={food ? t.editProduct : t.addProduct} 
        back 
        onBack={onClose} 
      />
      
      <div style={{ padding: 20, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ alignSelf: 'center', position: 'relative' }}>
          <FoodThumb name={formData.name_uz} emoji={formData.emoji} photo={preview || undefined} size={100} />
          <label style={{ 
            position: 'absolute', bottom: -10, right: -10, width: 40, height: 40, borderRadius: 20,
            background: FIT.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: `0 0 15px ${FIT.cyan}66`,
          }}>
            <Icon name="edit" size={20} color="#000" />
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
          {isUploading && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner" style={{ width: 30, height: 30, border: '3px solid transparent', borderTopColor: FIT.cyan, borderRadius: '50%', animation: 'fit-spin 0.6s linear infinite' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Slug (unique ID)" value={formData.slug} onChange={v => setFormData({...formData, slug: v})} placeholder="apple-red" readOnly={!!food} />
          <Input label="Emoji" value={formData.emoji} onChange={v => setFormData({...formData, emoji: v})} placeholder="🍎" />
        </div>

        <Input label="Name (Uzbek)" value={formData.name_uz} onChange={v => setFormData({...formData, name_uz: v})} placeholder="Qizil olma" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Kcal / 100g" type="number" value={formData.per_100g.kcal.toString()} onChange={v => setFormData({...formData, per_100g: {...formData.per_100g, kcal: Number(v)}})} />
          <Input label="Protein (g)" type="number" value={formData.per_100g.protein.toString()} onChange={v => setFormData({...formData, per_100g: {...formData.per_100g, protein: Number(v)}})} />
          <Input label="Carbs (g)" type="number" value={formData.per_100g.carbs.toString()} onChange={v => setFormData({...formData, per_100g: {...formData.per_100g, carbs: Number(v)}})} />
          <Input label="Fat (g)" type="number" value={formData.per_100g.fat.toString()} onChange={v => setFormData({...formData, per_100g: {...formData.per_100g, fat: Number(v)}})} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Category" value={formData.category} onChange={v => setFormData({...formData, category: v})} placeholder="Fruit" />
          <Input label="Default Unit" value={formData.default_unit} onChange={v => setFormData({...formData, default_unit: v as any})} placeholder="g" />
        </div>

        <Button variant="premium" full onClick={() => onSave(formData)} style={{ marginTop: 'auto' }}>
          {t.saveProduct}
        </Button>
      </div>
    </motion.div>
  );
}
