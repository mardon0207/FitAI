// Food Detail — real food from DB, live-scaled nutrients, saves to diary.

import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Phone, TopBar, Card, Chip, Button, MacroBar } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { getFood, nutrientsForGrams, resolveGrams } from '@/data/db';
import { useDiary } from '@/stores/diary';
import type { MealType, Unit } from '@fit/shared-types';

const ALL_UNITS: Unit[] = ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp', 'serving'];

export function FoodDetailScreen() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const addEntry = useDiary((s) => s.addEntry);

  const food = id ? getFood(id) : undefined;
  const defaultMeal = (sp.get('meal') as MealType) || 'lunch';

  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>(food?.defaultUnit ?? 'g');
  const [meal, setMeal] = useState<MealType>(defaultMeal);
  const [saved, setSaved] = useState(false);

  const grams = useMemo(() => (food ? resolveGrams(food, qty, unit) : 0), [food, qty, unit]);
  const nutrients = useMemo(() => (food ? nutrientsForGrams(food, grams) : {}), [food, grams]);

  if (!food) {
    return (
      <Phone dark={dark}>
        <TopBar back onBack={() => navigate(-1)} transparent />
        <div style={{ padding: 20, textAlign: 'center', color: FIT.textMuted }}>
          Ovqat topilmadi
        </div>
      </Phone>
    );
  }

  const handleSave = () => {
    const entry = addEntry({ foodSlug: food.slug, mealType: meal, quantity: qty, unit });
    if (entry) {
      setSaved(true);
      setTimeout(() => navigate('/diary'), 700);
    }
  };

  const fmt = (n: number | undefined, decimals = 0) =>
    n === undefined ? '—' : decimals === 0 ? Math.round(n).toString() : n.toFixed(decimals);

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 150px' }}>
        <div style={{
          height: 180, borderRadius: 24,
          background: `linear-gradient(135deg, ${FIT.accentSoft}, #FDE68A)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 96, marginBottom: 16,
        }}>
          {food.emoji ?? '🍽'}
        </div>

        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>
          {food.namesAll[lang] ?? food.name}
        </div>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 2 }}>
          {food.isRecipe ? "O'zbek milliy taomi · Retsept" : `Ingredient${food.category ? ` · ${food.category}` : ''}`}
        </div>

        <Card pad={16} style={{ marginTop: 16 }}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            PORSIYA · ~{Math.round(grams)}g
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: FIT.surfaceAlt, borderRadius: 12, padding: 4,
            }}>
              <button type="button" onClick={() => setQty(Math.max(0.25, round2(qty - 0.25)))}
                style={stepperBtn()} aria-label="−">−</button>
              <div style={{ width: 56, textAlign: 'center', fontSize: 17, fontWeight: 800, fontFamily: FIT.mono }}>
                {qty}
              </div>
              <button type="button" onClick={() => setQty(round2(qty + 0.25))}
                style={{ ...stepperBtn(), color: FIT.primary }} aria-label="+">+</button>
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              style={{
                height: 40, padding: '0 14px', borderRadius: 12,
                background: FIT.surfaceAlt, border: 'none',
                fontSize: 13, fontWeight: 600, fontFamily: FIT.sans,
                cursor: 'pointer',
              }}
            >
              {ALL_UNITS.map((u) => (
                <option key={u} value={u}>{unitLabel(u)}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card pad={20} style={{ marginTop: 10, textAlign: 'center' }}>
          <div style={{
            fontSize: 48, fontWeight: 800, fontFamily: FIT.mono,
            color: FIT.primary, letterSpacing: -2,
          }}>
            {fmt(nutrients.kcal)}
          </div>
          <div style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600, marginTop: -4 }}>
            {t.kcal}
          </div>
          <div style={{ marginTop: 10 }}>
            <MacroBar
              p={(nutrients.protein ?? 0) * 4}
              c={(nutrients.carbs ?? 0) * 4}
              f={(nutrients.fat ?? 0) * 9}
              h={10}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center', fontSize: 12 }}>
            {[
              { n: 'P', v: fmt(nutrients.protein, 1), c: FIT.protein },
              { n: 'C', v: fmt(nutrients.carbs, 1), c: FIT.carbs },
              { n: 'F', v: fmt(nutrients.fat, 1), c: FIT.fat },
            ].map((m) => (
              <div key={m.n}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: m.c }} />
                  <span style={{ fontWeight: 600 }}>{m.v}g</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {Object.keys(nutrients).filter(
          (k) => !['kcal', 'protein', 'carbs', 'fat'].includes(k),
        ).length > 0 && (
          <Card pad={16} style={{ marginTop: 10 }}>
            <div style={{
              fontSize: 11, color: FIT.textMuted, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
            }}>
              Mikronutrientlar (bu porsiya uchun)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(nutrients)
                .filter(([k]) => !['kcal', 'protein', 'carbs', 'fat'].includes(k))
                .map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 10px', background: FIT.surfaceAlt, borderRadius: 8,
                    fontSize: 12,
                  }}>
                    <span style={{ color: FIT.textMuted, fontWeight: 600 }}>{displayKey(k)}</span>
                    <span style={{ fontFamily: FIT.mono, fontWeight: 700 }}>{v.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {food.isRecipe && food.ingredients && (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, margin: '20px 0 10px' }}>Ingredientlar</div>
            <Card pad={14}>
              {food.ingredients.map((ing, i, arr) => {
                const src = getFood(ing.slug);
                return (
                  <div key={ing.slug} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                    borderBottom: i < arr.length - 1 ? `1px solid ${FIT.borderSoft}` : 'none',
                  }}>
                    <span style={{ fontSize: 18 }}>{src?.emoji ?? '•'}</span>
                    <span style={{ fontSize: 13, flex: 1 }}>
                      {src?.namesAll[lang] ?? ing.slug}
                    </span>
                    <span style={{
                      fontSize: 12, fontFamily: FIT.mono, color: FIT.textMuted,
                    }}>
                      {ing.grams}g
                    </span>
                  </div>
                );
              })}
              <Button
                variant="ghost" size="sm" full
                onClick={() => navigate('/composer')}
                style={{ marginTop: 4 }}
              >
                Ingredientlarni o&apos;zgartirish →
              </Button>
            </Card>
          </>
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${FIT.border}`, padding: 16,
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((m) => (
            <Chip key={m} active={m === meal} size="sm" onClick={() => setMeal(m)}>
              {t[m]}
            </Chip>
          ))}
        </div>
        <Button
          variant="primary" size="lg" full
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? '✓ Qo\'shildi' : 'Kundaliga qo\'shish'}
        </Button>
      </div>
    </Phone>
  );
}

function stepperBtn(): React.CSSProperties {
  return {
    width: 32, height: 32, borderRadius: 10, background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: FIT.shadowSm, fontSize: 16, fontWeight: 700,
    border: 'none', cursor: 'pointer',
  };
}

function unitLabel(u: Unit): string {
  return {
    g: 'gram', ml: 'ml', piece: 'dona', cup: 'piyola',
    tbsp: 'osh qoshiq', tsp: 'chay qoshiq', serving: 'porsiya',
  }[u];
}

function displayKey(k: string): string {
  const map: Record<string, string> = {
    vit_c: 'Vit C (mg)', vit_a: 'Vit A (mcg)', vit_d: 'Vit D (mcg)',
    vit_b12: 'B12 (mcg)', vit_b6: 'B6 (mg)', vit_e: 'Vit E (mg)',
    vit_k: 'Vit K (mcg)', iron: 'Temir (mg)', calcium: 'Ca (mg)',
    zinc: 'Zn (mg)', magnesium: 'Mg (mg)', potassium: 'K (mg)',
    sodium: 'Na (mg)', fiber: 'Tolali (g)', folate: 'Folat (mcg)',
    vit_b1: 'B1 (mg)', vit_b2: 'B2 (mg)', vit_b3: 'B3 (mg)',
  };
  return map[k] ?? k;
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
