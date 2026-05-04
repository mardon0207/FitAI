import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Phone, TopBar, Chip, Button, FoodThumb } from '@/design/primitives';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useFood } from '@/api/hooks';
import { useDiary } from '@/stores/diary';
import type { MealType, Unit } from '@fit/shared-types';
import { resolveGrams, scaleNutrients } from '@/lib/nutrition';


export function FoodDetailScreen() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const addEntry = useDiary((s) => s.addEntry);

  const { data: food, isLoading } = useFood(id);
  const defaultMeal = (sp.get('meal') as MealType) || 'lunch';

  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>('g');
  const [meal, setMeal] = useState<MealType>(defaultMeal);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [unitInitialized, setUnitInitialized] = useState(false);
  useMemo(() => {
    if (food && !unitInitialized) {
      const u = (food.defaultUnit as Unit) ?? 'g';
      setUnit(u);
      setQty(food.defaultQty ?? (u === 'g' || u === 'ml' ? 100 : 1));
      setUnitInitialized(true);
    }
  }, [food, unitInitialized]);

  const grams = useMemo(() => {
    return resolveGrams(qty, unit, food?.gramsPerUnit);
  }, [qty, unit, food]);

  const nutrients = useMemo(() => {
    if (!food?.nutrients) return {} as Record<string, number>;
    return scaleNutrients(food.nutrients, grams);
  }, [food, grams]);

  if (isLoading) {
    return (
      <Phone dark={dark}>
        <TopBar back onBack={() => navigate(-1)} transparent />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
           <div className="loader" style={{ width: 40, height: 40, border: `4px solid ${FIT.primarySoft}`, borderTopColor: FIT.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
           <div style={{ fontSize: 14, fontWeight: 700, color: FIT.textMuted }}>{t.preparing}</div>
        </div>
      </Phone>
    );
  }

  if (!food) return null;

  const handleSave = () => {
    if (saving || saved) return;
    setSaving(true);
    addEntry({
      foodSlug: String(food.id),
      foodName: food.name,
      foodEmoji: food.emoji ?? undefined,
      foodPhotoUrl: food.photoUrl,
      mealType: meal,
      quantity: qty,
      unit,
      grams,
      kcal: nutrients.kcal ?? 0,
      protein: nutrients.protein ?? 0,
      carbs: nutrients.carbs ?? 0,
      fat: nutrients.fat ?? 0,
      micros: Object.fromEntries(
        Object.entries(nutrients).filter(([k]) => !['kcal', 'protein', 'carbs', 'fat'].includes(k))
      ),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => navigate('/diary'), 800);
  };

  const handleUnitChange = (u: Unit) => {
    setUnit(u);
    if (u === 'g' || u === 'ml') {
      if (qty < 10) setQty(100);
    } else {
      if (qty >= 10) setQty(1);
    }
  };

  const step = (unit === 'g' || unit === 'ml') ? 10 : 1;
  const fmt = (n: number | undefined, decimals = 0) =>
    n === undefined || isNaN(n) ? '—' : decimals === 0 ? Math.round(n).toString() : n.toFixed(decimals);

  return (
    <Phone dark={dark}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <TopBar back onBack={() => navigate(-1)} transparent />
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 120 }}>
        <div style={{
          height: 240, position: 'relative',
          background: `linear-gradient(135deg, ${food.isRecipe ? '#F59E0B' : '#10B981'}, ${food.isRecipe ? '#F87171' : '#3B82F6'})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: -40, overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FoodThumb 
              emoji={food.emoji ?? '🍽'} 
              photo={food.photoUrl} 
              tone={food.isRecipe ? 'amber' : 'green'} 
              size={140} 
            />
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 3, padding: '0 20px' }}>
          {/* Header Card */}
          <div style={{
            background: dark ? '#1E293B' : '#fff', borderRadius: 28, padding: '24px 20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: FIT.text, lineHeight: 1.1 }}>{food.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                   <span style={{ padding: '2px 8px', background: `${FIT.primary}15`, color: FIT.primary, borderRadius: 8, fontSize: 10, fontWeight: 800 }}>{food.isRecipe ? t.nationalDish : t.ingredient}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: FIT.mono, color: FIT.primary }}>{fmt(nutrients.kcal)}</div>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 800 }}>{t.kcal.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <div style={{
              flex: 1.2, background: dark ? '#1E293B' : '#fff', borderRadius: 20, padding: 16,
              boxShadow: FIT.shadowSm, border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
            }}>
              <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>{t.amount}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setQty(q => Math.max(0.1, round2(q - step)))} style={stepperBtn()}>−</button>
                  <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={inputStyle(dark)} />
                  <button onClick={() => setQty(q => round2(q + step))} style={stepperBtn()}>+</button>
                </div>
              </div>
            </div>
            <div style={{
              flex: 1, background: dark ? '#1E293B' : '#fff', borderRadius: 20, padding: 16,
              boxShadow: FIT.shadowSm, border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
            }}>
              <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>{t.unit}</div>
              <select value={unit} onChange={(e) => handleUnitChange(e.target.value as Unit)} style={selectStyle(dark)}>
                {['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp', 'serving'].map(u => <option key={u} value={u as Unit}>{t[`unit_${u as Unit}` as keyof typeof t] as string}</option>)}
              </select>
            </div>
          </div>

          {/* Meal Selection - MOVED HERE to avoid overlapping with bottom button */}
          <div style={{ marginTop: 20, padding: '16px', background: dark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderRadius: 20, border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}` }}>
             <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>{t.atWhatTime}</div>
             <div style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 4 }}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map(m => (
                  <Chip key={m} active={m === meal} size="sm" onClick={() => setMeal(m as any)}>
                    {t[m as keyof typeof t]}
                  </Chip>
                ))}
             </div>
          </div>

          {/* Tarkibi */}
          <div style={{ marginTop: 24, paddingBottom: 20 }}>
             <div style={{ fontSize: 16, fontWeight: 800, color: FIT.text, marginBottom: 12 }}>{t.composition}</div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['protein', 'carbs', 'fat'].map(k => (
                  <div key={k} style={{ padding: 14, background: `${(FIT as any)[k]}10`, borderRadius: 16, border: `1px solid ${(FIT as any)[k]}30` }}>
                     <div style={{ fontSize: 11, color: (FIT as any)[k], fontWeight: 800, textTransform: 'uppercase' }}>{t[k as keyof typeof t]}</div>
                     <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: (FIT as any)[k] }}>{fmt(nutrients[k], 1)}g</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Micro-nutrients */}
          {Object.keys(nutrients).some(k => !['kcal', 'protein', 'carbs', 'fat'].includes(k)) && (
            <div style={{ marginTop: 24, paddingBottom: 40 }}>
               <div style={{ fontSize: 16, fontWeight: 800, color: FIT.text, marginBottom: 12 }}>{t.microNutrients || 'Mikroelementlar'}</div>
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: '1fr 1fr 1fr', 
                 gap: 8,
                 background: dark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                 padding: 16,
                 borderRadius: 20,
                 border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
               }}>
                  {Object.entries(nutrients)
                    .filter(([k]) => !['kcal', 'protein', 'carbs', 'fat'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} style={{ textAlign: 'center' }}>
                         <div style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>{k}</div>
                         <div style={{ fontSize: 13, fontWeight: 800, color: FIT.text }}>{fmt(v, 1)}<span style={{ fontSize: 9, marginLeft: 1 }}>mg</span></div>
                      </div>
                    ))
                  }
               </div>
            </div>
          )}
        </div>
      </div>

      {/* FIXED BOTTOM ACTION - Solid, high contrast */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 32px',
        background: dark ? 'linear-gradient(to top, #0F172A, transparent)' : 'linear-gradient(to top, #fff 80%, transparent)',
        zIndex: 100,
      }}>
        <Button
          variant="primary" size="lg" full
          onClick={handleSave}
          disabled={saved || saving}
          style={{
            height: 56, borderRadius: 18, fontSize: 16, fontWeight: 900,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            background: saved ? '#10B981' : FIT.primary,
            color: '#fff',
            opacity: 1, // Ensure no transparency
          }}
        >
          {saved ? `✓ ${t.added}` : saving ? t.saving : t.addToDiary}
        </Button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select { -webkit-appearance: none; cursor: pointer; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </Phone>
  );
}

function stepperBtn(): React.CSSProperties {
  return {
    width: 36, height: 36, borderRadius: 10, background: FIT.primarySoft,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, fontWeight: 800, color: FIT.primary, border: 'none', cursor: 'pointer',
  };
}

function inputStyle(dark: boolean): React.CSSProperties {
  return { 
    width: 60, border: 'none', background: 'transparent',
    fontSize: 22, fontWeight: 900, fontFamily: FIT.mono,
    color: FIT.text, textAlign: 'center', outline: 'none'
  };
}

function selectStyle(dark: boolean): React.CSSProperties {
  return {
    width: '100%', border: 'none', background: 'transparent',
    fontSize: 16, fontWeight: 700, color: FIT.text, outline: 'none'
  };
}


function round2(n: number): number { return Math.round(n * 100) / 100; }
