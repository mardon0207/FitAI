// Ingredient Composer — FLAGSHIP. Real add/remove/edit, live totals, saves to diary.

import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Phone, TopBar, Card, Chip, Button, MacroBar, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT, type I18NStrings, type Lang } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useComposer, type Cooking, type DraftIngredient } from '@/stores/composer';
import { useDiary } from '@/stores/diary';
import { useFoods } from '@/api/hooks';
import type { MealType, Unit } from '@fit/shared-types';
import { resolveGrams } from '@/lib/nutrition';

const COOKING_METHODS = ['raw', 'boiled', 'fried', 'baked', 'grilled'] as const;
const ALL_UNITS: Unit[] = ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp'];

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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

  useEffect(() => {
    const addSlug = sp.get('add');
    if (addSlug) {
      draft.addIngredient(addSlug, 'g');
      const next = new URLSearchParams(sp);
      next.delete('add');
      setSp(next, { replace: true });
    }
  }, [sp, draft, setSp]);

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
    <Phone dark={dark} showStatus mesh stagger>
      <TopBar
        back onBack={() => navigate(-1)}
        title={t.assemble}
        subtitle={`${draft.ingredients.length} ${t.items} · ${totals.kcal} ${t.kcal}`}
        transparent
        right={
          draft.ingredients.length > 0 ? (
            <button
              type="button"
              onClick={() => { if (confirm(t.clearAll)) draft.reset(); }}
              style={{
                fontSize: 12, color: FIT.danger, fontWeight: 800,
                background: 'rgba(244,63,94,0.1)', border: 'none', 
                cursor: 'pointer', padding: '6px 12px', borderRadius: 10
              }}
            >
              {t.clear}
            </button>
          ) : undefined
        }
      />

      <div style={{ padding: '0 20px 16px' }}>
        <div className="glass-premium" style={{
          height: 52, borderRadius: 18, border: 'none',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12
        }}>
          <Icon name="edit" size={18} color={FIT.primary} />
          <input
            value={draft.name}
            onChange={(e) => draft.setName(e.target.value)}
            placeholder={t.mealName}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 16,
              fontFamily: FIT.sans, fontWeight: 800, background: 'transparent',
              color: dark ? '#fff' : FIT.text
            }}
          />
          <div style={{ 
            padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: 8,
            fontSize: 11, color: FIT.textMuted, fontWeight: 800, fontFamily: FIT.mono
          }}>
            {new Date().toLocaleTimeString(lang === 'uz' ? 'uz-UZ' : (lang === 'ru' ? 'ru-RU' : 'en-US'), { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, overflow: 'auto', paddingBottom: 4 }}>
          {mealPicker.map((m) => (
            <Chip key={m.id} active={draft.mealType === m.id} size="md" onClick={() => draft.setMealType(m.id)} dark={dark}>
              {m.label}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '4px 20px 120px' }}>
        <div data-fit-stagger>
        <AnimatePresence mode="popLayout">
          {draft.ingredients.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '60px 20px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 72, marginBottom: 16 }}>🧩</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: dark ? '#fff' : FIT.text, marginBottom: 12 }}>
                {t.addIngredients}
              </div>
              <div style={{ fontSize: 14, color: FIT.textMuted, marginBottom: 28, lineHeight: 1.6, fontWeight: 600 }}>
                {t.composerExample}
              </div>
            </motion.div>
          ) : (
            draft.ingredients.map((ing) => (
              <motion.div
                key={ing.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                layout
              >
                <IngredientCard
                  ing={ing}
                  lang={lang}
                  foodIndex={foodIndex}
                  onUpdate={(patch) => draft.updateIngredient(ing.id, patch)}
                  onRemove={() => draft.removeIngredient(ing.id)}
                  t={t}
                  dark={dark}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => navigate('/search?mode=composer')}
          style={{
            padding: 20, border: `2px dashed ${FIT.primary}44`,
            background: 'transparent', borderRadius: 22,
            display: 'flex', alignItems: 'center', gap: 16, width: '100%',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div className="neon-glow-primary" style={{
            width: 44, height: 44, borderRadius: 14, background: FIT.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="plus" size={24} color="#fff" strokeWidth={3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: FIT.primary }}>
              {t.addIngredient}
            </div>
            <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: 4, fontWeight: 600 }}>
              {t.composerSearchSub}
            </div>
          </div>
          </motion.button>
        </div>
      </div>

      {draft.ingredients.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(30px)',
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, 
          padding: '20px 20px 32px',
          zIndex: 200
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{
                fontSize: 11, color: FIT.textMuted, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4
              }}>
                {t.total} · {totals.totalGrams}g
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="neon-glow-primary" style={{
                  fontSize: 38, fontWeight: 900, fontFamily: FIT.mono,
                  color: FIT.primary, letterSpacing: -2,
                }}>
                  {totals.kcal}
                </span>
                <span style={{ fontSize: 15, color: FIT.textMuted, fontWeight: 800 }}>{t.kcal}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <MacroBar p={totals.protein} c={totals.carbs} f={totals.fat} />
              <div style={{
                display: 'flex', gap: 12, marginTop: 10, fontSize: 12,
                fontFamily: FIT.mono, fontWeight: 900,
              }}>
                <span style={{ color: FIT.protein }}>P {totals.protein}g</span>
                <span style={{ color: FIT.carbs }}>C {totals.carbs}g</span>
                <span style={{ color: FIT.fat }}>F {totals.fat}g</span>
              </div>
            </div>
          </div>
          
          <Button variant="premium" size="lg" full onClick={handleSave} style={{ height: 60, fontSize: 17 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <Icon name="check" size={20} strokeWidth={3} />
               {t.addToDiary} ({t[draft.mealType]})
            </div>
          </Button>
        </div>
      )}
    </Phone>
  );
}

interface IngredientCardProps {
  ing: DraftIngredient;
  foodIndex: Map<string, any>;
  onUpdate: (patch: Partial<DraftIngredient>) => void;
  onRemove: () => void;
  t: I18NStrings;
  lang: Lang;
  dark: boolean;
}

function IngredientCard({ ing, foodIndex, onUpdate, onRemove, t, lang, dark }: IngredientCardProps) {
  const food = foodIndex.get(ing.slug);
  if (!food) {
    return (
      <Card variant="glass" pad={16} style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
        <div className="shimmer" style={{ width: '100%', height: 40, borderRadius: 10 }} />
      </Card>
    );
  }

  const grams = resolveGrams(ing.quantity, ing.unit, food.gramsPerUnit);
  const kcal = Math.round(((food.nutrients.kcal ?? 0) * grams) / 100);

  return (
    <Card variant="glass" pad={16} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 14 }}>
        <FoodThumb emoji={food.emoji} photo={food.photoUrl ?? undefined} tone={food.isRecipe ? 'amber' : 'green'} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: dark ? '#fff' : FIT.text }}>{food.name}</div>
              <div style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 700, marginTop: 2 }}>
                {food.category ?? t.other} · ~{Math.round(grams)}g
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -1 }}>
                  {kcal}
                </div>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>{t.kcal}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button" onClick={onRemove}
                style={{
                  width: 24, height: 24, borderRadius: 8, border: 'none',
                  background: 'rgba(244,63,94,0.1)', color: FIT.danger, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="close" size={14} color={FIT.danger} strokeWidth={3} />
              </motion.button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 4,
            }}>
              <button
                type="button"
                onClick={() => onUpdate({ quantity: Math.max(0.25, round2(ing.quantity - 0.5)) })}
                style={stepperBtn(dark)}
              >−</button>
              <div style={{ width: 48, textAlign: 'center', fontSize: 15, fontWeight: 800, fontFamily: FIT.mono, color: dark ? '#fff' : FIT.text }}>
                {ing.quantity}
              </div>
              <button
                type="button"
                onClick={() => onUpdate({ quantity: round2(ing.quantity + 0.5) })}
                style={stepperBtn(dark)}
              >+</button>
            </div>
            <select
              value={ing.unit}
              onChange={(e) => onUpdate({ unit: e.target.value as Unit })}
              style={{
                height: 38, padding: '0 12px', borderRadius: 12,
                background: 'rgba(0,0,0,0.05)', border: 'none',
                fontSize: 13, fontWeight: 800, fontFamily: FIT.sans, cursor: 'pointer',
                color: dark ? '#fff' : FIT.text
              }}
            >
              {ALL_UNITS.map((u) => <option key={u} value={u}>{t[`unit_${u}` as keyof I18NStrings] as string}</option>)}
              {food.isRecipe && <option value="serving">{t.unit_serving}</option>}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {COOKING_METHODS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onUpdate({ cooking: c })}
                style={{
                  padding: '6px 12px', borderRadius: 12,
                  fontSize: 12, fontWeight: 800, border: 'none',
                  background: ing.cooking === c ? FIT.primary : 'rgba(0,0,0,0.05)',
                  color: ing.cooking === c ? '#fff' : FIT.textMuted,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: ing.cooking === c ? `0 4px 10px ${FIT.primary}44` : 'none'
                }}
              >
                {t[`cooking_${c}`]}
              </button>
            ))}
          </div>

          {ing.cooking === 'fried' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.1)',
                borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ fontSize: 18 }}>🛢️</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#D97706' }}>{t.oil}</span>
              <input
                type="range" min={0} max={30}
                value={ing.addedOilMl ?? 10}
                onChange={(e) => onUpdate({ addedOilMl: Number(e.target.value) })}
                style={{ flex: 1, margin: '0 6px', accentColor: '#F59E0B' }}
              />
              <span style={{ fontSize: 12, fontWeight: 900, fontFamily: FIT.mono, color: '#D97706' }}>
                {ing.addedOilMl ?? 10} ml
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}

function stepperBtn(dark: boolean): React.CSSProperties {
  return {
    width: 30, height: 30, borderRadius: 10, background: dark ? '#1E293B' : '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: 16, fontWeight: 900, color: FIT.primary,
    border: 'none', cursor: 'pointer',
  };
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round2(n: number): number { return Math.round(n * 100) / 100; }
