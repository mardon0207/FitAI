import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, TopBar, Card, Chip, Button, Input } from '@/design/primitives';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useDiary } from '@/stores/diary';
import type { MealType } from '@fit/shared-types';

const MEALS: { type: MealType; labelKey: 'breakfast' | 'lunch' | 'dinner' | 'snack' }[] = [
  { type: 'breakfast', labelKey: 'breakfast' },
  { type: 'lunch', labelKey: 'lunch' },
  { type: 'dinner', labelKey: 'dinner' },
  { type: 'snack', labelKey: 'snack' },
];

export function ManualScreen() {
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const addEntry = useDiary((s) => s.addEntry);
  
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [meal, setMeal] = useState<MealType>('lunch');
  
  const [grams, setGrams] = useState('100');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    
    addEntry({
      mealType: meal,
      foodSlug: '__manual__',
      foodName: name.trim(),
      foodEmoji: '📝',
      quantity: 1,
      unit: 'serving',
      grams: Number(grams) || 100,
      kcal: Number(kcal) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      micros: {},
      note: brand.trim() || undefined,
    });
    
    navigate('/diary');
  };

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} title="Qo'lda qo'shish" transparent />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          flex: 1, padding: '0 20px 40px', overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
      >
        <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600, lineHeight: 1.5 }}>
          Agar qidiruv natijalarida ovqat topilmasa, uning ma'lumotlarini o'zingiz kiritishingiz mumkin.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="OVQAT NOMI" value={name} onChange={setName} placeholder="Masalan: Uy sharoitida tayyorlangan salat" />
          <Input label="BRAND YOKI TAVSIF" value={brand} onChange={setBrand} placeholder="Masalan: Uyda pishirilgan" />
        </div>

        <Card pad={20} style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}` }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            PORSIYA HAJMI
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
               <input
                 type="number" value={grams} onChange={(e) => setGrams(e.target.value)}
                 style={{
                   width: '100%', height: 54, borderRadius: 16, border: `1.5px solid ${dark ? '#334155' : '#E2E8F0'}`,
                   padding: '0 16px', fontFamily: FIT.mono, fontWeight: 800, fontSize: 18,
                   background: dark ? 'rgba(255,255,255,0.02)' : '#fff', color: FIT.text, outline: 'none'
                 }}
                 placeholder="100"
               />
            </div>
            <div style={{
              width: 100, height: 54, borderRadius: 16, background: dark ? '#334155' : '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: FIT.textMuted
            }}>
              gramm
            </div>
          </div>
        </Card>

        <Card pad={20} style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}` }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>
            OZIQLIK QIYMATI (porsiya uchun)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { l: 'Kaloriya', v: kcal, set: setKcal, u: 'kkal', c: FIT.primary },
              { l: 'Oqsil', v: protein, set: setProtein, u: 'g', c: FIT.protein },
              { l: 'Uglevod', v: carbs, set: setCarbs, u: 'g', c: FIT.carbs },
              { l: "Yog'", v: fat, set: setFat, u: 'g', c: FIT.fat },
            ].map((f) => (
              <div key={f.l} style={{ 
                padding: 16, background: dark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', 
                borderRadius: 16, border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
              }}>
                <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, marginBottom: 6 }}>{f.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <input
                    type="number" value={f.v} onChange={(e) => f.set(e.target.value)}
                    style={{
                      width: '100%', border: 'none', background: 'transparent',
                      fontSize: 24, fontWeight: 900, fontFamily: FIT.mono,
                      color: f.c, outline: 'none'
                    }}
                    placeholder="0"
                  />
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700 }}>{f.u}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
             QAYSI VAQTDA YEDINGIZ?
          </div>
          <div style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 4 }}>
            {MEALS.map((m) => (
              <Chip key={m.type} active={m.type === meal} size="sm" onClick={() => setMeal(m.type)} style={{ padding: '10px 20px', borderRadius: 14 }}>
                {t[m.labelKey]}
              </Chip>
            ))}
          </div>
        </div>

        <Button 
          variant="primary" size="lg" full onClick={handleSave} 
          style={{ height: 56, borderRadius: 18, fontSize: 16, fontWeight: 800, marginTop: 12, boxShadow: `0 8px 20px ${FIT.primary}44` }}
        >
          Ovqatni qo'shish
        </Button>
      </motion.div>
    </Phone>
  );
}
