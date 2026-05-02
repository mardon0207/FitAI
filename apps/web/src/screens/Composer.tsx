// Ingredient Composer — FLAGSHIP. Real add/remove/edit, live totals, saves to diary.

import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, TopBar, Card, Chip, Button, MacroBar, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT, type I18NStrings } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useComposer, type Cooking, type DraftIngredient } from '@/stores/composer';
import { useDiary } from '@/stores/diary';
import { useFoods } from '@/api/hooks';
import type { MealType, Unit } from '@fit/shared-types';
import { resolveGrams } from '@/lib/nutrition';

const COOKING_METHODS = ['raw', 'boiled', 'fried', 'baked', 'grilled'] as const;

const ALL_UNITS: Unit[] = ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp'];

export function ComposerScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  const draft = useComposer();
  const addComposed = useDiary((s) => s.addComposedMeal);

  const slugs = useMemo(() => Array.from(new Set(draft.ingredients.map(i => i.slug))), [draft.ingredients]);
  const { data: foodDetails = [] } = useFoods(slugs);
  const foodIndex = useMemo(() => new Map(foodDetails.map(f => [String(f.id), f])), [foodDetails]);

  // Handle ?add=slug from Search navigation
  useEffect(() => {
    const addSlug = sp.get('add');
    if (addSlug) {
      // We don't have the food details yet, so we default to 'g'
      // useFoods will pick up the new slug and fetch its details
      draft.addIngredient(addSlug, 'g');
      
      const next = new URLSearchParams(sp);
      next.delete('add');
      setSp(next, { replace: true });
    }
  }, [sp, draft, setSp]);

  // Live totals — reactive to every ingredient change
  const totals = useMemo(() => {
    let kcal = 0, protein = 0, carbs = 0, fat = 0, totalGrams = 0;
    const micros: Record<string, number> = {};

    for (const ing of draft.ingredients) {
      const food = foodIndex.get(ing.slug);
      if (!food) continue;
      let grams = resolveGrams(ing.quantity, ing.unit, food.gramsPerUnit);
      totalGrams += grams;
      for (const [k, v] of Object.entries(food.nutrients)) {
        const val = (v * grams) / 100;
        if (k === 'kcal') kcal += val;
        else if (k === 'protein') protein += val;
        else if (k === 'carbs') carbs += val;
        else if (k === 'fat') fat += val;
        else micros[k] = (micros[k] ?? 0) + val;
      }
      // Oil added when fried
      if (ing.cooking === 'fried' && ing.addedOilMl) {
        const oilG = ing.addedOilMl * 0.92;
        totalGrams += oilG;
        kcal += 8.84 * oilG;
        fat += oilG;
      }
    }

    return { kcal: Math.round(kcal), protein: round1(protein), carbs: round1(carbs), fat: round1(fat), totalGrams: round1(totalGrams), micros };
  }, [draft.ingredients, foodIndex]);

  const handleSave = () => {
    if (draft.ingredients.length === 0) return;
    const ingredientsForStore = draft.ingredients
      .map((ing) => {
        const food = foodIndex.get(ing.slug);
        if (!food) return null;
        let grams = resolveGrams(ing.quantity, ing.unit, food.gramsPerUnit);
        if (ing.cooking === 'fried' && ing.addedOilMl) {
          grams += ing.addedOilMl * 0.92;
        }
        return { slug: ing.slug, quantity: ing.quantity, unit: ing.unit, grams, per100g: food.nutrients };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    addComposed({
      name: draft.name,
      mealType: draft.mealType,
      ingredients: ingredientsForStore,
    });
    draft.reset();
    navigate('/diary');
  };

  const mealPicker: Array<{ id: MealType; label: string }> = [
    { id: 'breakfast', label: t.breakfast },
    { id: 'lunch', label: t.lunch },
    { id: 'dinner', label: t.dinner },
    { id: 'snack', label: t.snack },
  ];

  return (
    <Phone dark={dark}>
      <TopBar
        back onBack={() => navigate(-1)}
        title={t.assemble}
        subtitle={`${draft.ingredients.length} ta · ${totals.kcal} ${t.kcal}`}
        transparent
        right={
          draft.ingredients.length > 0 ? (
            <button
              type="button"
              onClick={() => { if (confirm(t.clearAll)) draft.reset(); }}
              style={{
                fontSize: 12, color: FIT.danger, fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {t.clear}
            </button>
          ) : undefined
        }
      />

      <div style={{ padding: '0 20px 12px' }}>
        <div style={{
          height: 44, borderRadius: 12, background: '#fff', border: `1px solid ${FIT.border}`,
          display: 'flex', alignItems: 'center', padding: '0 14px',
        }}>
          <input
            value={draft.name}
            onChange={(e) => draft.setName(e.target.value)}
            placeholder={t.mealName}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              fontFamily: FIT.sans, fontWeight: 600, background: 'transparent',
            }}
          />
          <span style={{ fontSize: 12, color: FIT.textMuted, fontFamily: FIT.mono }}>
            {new Date().toLocaleTimeString(lang === 'uz' ? 'uz-UZ' : (lang === 'ru' ? 'ru-RU' : 'en-US'), { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {mealPicker.map((m) => (
            <Chip key={m.id} active={draft.mealType === m.id} size="sm" onClick={() => draft.setMealType(m.id)}>
              {m.label}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 240px' }}>
        {draft.ingredients.length === 0 ? (
          <div style={{
            padding: '40px 20px', textAlign: 'center', color: FIT.textMuted,
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🧩</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
              {t.addIngredients}
            </div>
            <div style={{ fontSize: 12, marginBottom: 20, lineHeight: 1.5 }}>
              {t.composerExample}
            </div>
          </div>
        ) : (
          draft.ingredients.map((ing) => (
            <IngredientCard
              key={ing.id}
              ing={ing}
              lang={lang}
              foodIndex={foodIndex}
              onUpdate={(patch) => draft.updateIngredient(ing.id, patch)}
              onRemove={() => draft.removeIngredient(ing.id)}
              t={t}
            />
          ))
        )}

        <button
          type="button"
          onClick={() => navigate('/search?mode=composer')}
          style={{
            padding: 16, border: `1.5px dashed ${FIT.primary}66`,
            background: `${FIT.primarySoft}66`, borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: FIT.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="plus" size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: FIT.primaryDark }}>
              {t.addIngredient}
            </div>
            <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>
              {t.composerSearchSub}
            </div>
          </div>
        </button>
      </div>

      {draft.ingredients.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${FIT.border}`, padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
            <div>
              <div style={{
                fontSize: 10, color: FIT.textMuted, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1,
              }}>
                {t.total} · {totals.totalGrams}g
              </div>
              <div style={{
                fontSize: 30, fontWeight: 800, fontFamily: FIT.mono,
                color: FIT.primary, letterSpacing: -1,
              }}>
                {totals.kcal}{' '}
                <span style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 500 }}>{t.kcal}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <MacroBar p={totals.protein} c={totals.carbs} f={totals.fat} />
              <div style={{
                display: 'flex', gap: 10, marginTop: 6, fontSize: 11,
                fontFamily: FIT.mono, fontWeight: 600,
              }}>
                <span style={{ color: FIT.protein }}>P {totals.protein}g</span>
                <span style={{ color: FIT.carbs }}>C {totals.carbs}g</span>
                <span style={{ color: FIT.fat }}>F {totals.fat}g</span>
              </div>
            </div>
          </div>
          {Object.keys(totals.micros).length > 0 && (
            <div style={{
              fontSize: 10, color: FIT.textMuted, marginBottom: 10, fontFamily: FIT.mono,
            }}>
              {Object.entries(totals.micros)
                .slice(0, 5)
                .map(([k, v]) => `${displayKey(k)} ${v.toFixed(1)}`)
                .join(' · ')}
            </div>
          )}
          <Button variant="primary" size="md" full onClick={handleSave}>
            {t.addToDiary} ({t[draft.mealType]})
          </Button>
        </div>
      )}
    </Phone>
  );
}

interface IngredientCardProps {
  ing: DraftIngredient;
  lang: 'uz' | 'ru' | 'en';
  foodIndex: Map<string, any>;
  onUpdate: (patch: Partial<DraftIngredient>) => void;
  onRemove: () => void;
  t: ReturnType<typeof useT>;
}

function IngredientCard({ ing, lang, foodIndex, onUpdate, onRemove, t }: IngredientCardProps) {
  const food = foodIndex.get(ing.slug);
  if (!food) {
    return (
      <Card pad={14} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" style={{ width: 20, height: 20, border: `2px solid ${FIT.primarySoft}`, borderTopColor: FIT.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </Card>
    );
  }

  const grams = resolveGrams(ing.quantity, ing.unit, food.grams_per_unit);
  const kcal = Math.round(((food.nutrients.kcal ?? 0) * grams) / 100);

  return (
    <Card pad={14} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <FoodThumb emoji={food.emoji} photo={food.photoUrl} tone={food.is_recipe ? 'amber' : 'green'} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{food.name}</div>
              <div style={{ fontSize: 11, color: FIT.textMuted }}>
                {food.category ?? '·'} · ~{Math.round(grams)}g
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary }}>
                  {kcal}
                </div>
                <div style={{ fontSize: 9, color: FIT.textMuted }}>{t.kcal}</div>
              </div>
              <button
                type="button" onClick={onRemove} aria-label={t.clear}
                style={{
                  width: 20, height: 20, borderRadius: 10, border: 'none',
                  background: FIT.dangerSoft, color: FIT.danger, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="close" size={12} color={FIT.danger} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: FIT.surfaceAlt, borderRadius: 10, padding: 3,
            }}>
              <button
                type="button"
                onClick={() => onUpdate({ quantity: Math.max(0.25, round2(ing.quantity - 0.5)) })}
                style={stepperBtn(FIT.text)} aria-label="−"
              >−</button>
              <div style={{ width: 44, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: FIT.mono }}>
                {ing.quantity}
              </div>
              <button
                type="button"
                onClick={() => onUpdate({ quantity: round2(ing.quantity + 0.5) })}
                style={stepperBtn(FIT.primary)} aria-label="+"
              >+</button>
            </div>
            <select
              value={ing.unit}
              onChange={(e) => onUpdate({ unit: e.target.value as Unit })}
              style={{
                height: 32, padding: '0 10px', borderRadius: 10,
                background: FIT.surfaceAlt, border: 'none',
                fontSize: 12, fontWeight: 600, fontFamily: FIT.sans, cursor: 'pointer',
              }}
            >
              {ALL_UNITS.map((u) => <option key={u} value={u}>{t[`unit_${u}` as keyof I18NStrings] as string}</option>)}
              {food.is_recipe && <option value="serving">{t.unit_serving}</option>}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
            {COOKING_METHODS.map((c) => (
              <button
                type="button" key={c}
                onClick={() => onUpdate({ cooking: c })}
                style={{
                  padding: '4px 10px', borderRadius: 12,
                  fontSize: 11, fontWeight: 600, border: 'none',
                  background: ing.cooking === c ? FIT.primary : FIT.surfaceAlt,
                  color: ing.cooking === c ? '#fff' : FIT.textMuted,
                  cursor: 'pointer',
                }}
              >
                {t[`cooking_${c}`]}
              </button>
            ))}
          </div>

          {ing.cooking === 'fried' && (
            <div style={{
              marginTop: 10, padding: '8px 10px', background: FIT.accentSoft,
              borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>🛢️</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>{t.oil}</span>
              <input
                type="range" min={0} max={30}
                value={ing.addedOilMl ?? 10}
                onChange={(e) => onUpdate({ addedOilMl: Number(e.target.value) })}
                style={{ flex: 1, margin: '0 6px', accentColor: FIT.accent }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: FIT.mono, color: '#92400E' }}>
                {ing.addedOilMl ?? 10} ml
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function stepperBtn(color: string): React.CSSProperties {
  return {
    width: 26, height: 26, borderRadius: 8, background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: FIT.shadowSm, fontSize: 14, fontWeight: 700, color,
    border: 'none', cursor: 'pointer',
  };
}


function displayKey(k: string): string {
  const map: Record<string, string> = {
    vit_c: 'VitC', vit_a: 'VitA', vit_d: 'VitD', vit_b12: 'B12', vit_b6: 'B6',
    vit_e: 'VitE', iron: 'Fe', calcium: 'Ca', zinc: 'Zn', fiber: 'Fiber',
  };
  return map[k] ?? k;
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round2(n: number): number { return Math.round(n * 100) / 100; }
