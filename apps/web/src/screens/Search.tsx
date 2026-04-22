// Food Search — real local search + tap-to-open detail.

import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, TopBar, Chip, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { allCategories, searchFoods, type FoodItem } from '@/data/db';

const TABS = [
  { id: 'all', icon: '✨', name: 'Hammasi' },
  { id: 'recipes', icon: '🍽', name: 'Milliy' },
  { id: 'ingredients', icon: '🥗', name: 'Ingredient' },
] as const;

const MEAL_OPTIONS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export function SearchScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const composerMode = sp.get('mode') === 'composer';
  const mealParam = sp.get('meal');

  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('all');
  const [category, setCategory] = useState<string | null>(null);
  const [meal, setMeal] = useState<(typeof MEAL_OPTIONS)[number]>(
    MEAL_OPTIONS.includes(mealParam as never) ? (mealParam as (typeof MEAL_OPTIONS)[number]) : 'lunch',
  );

  const results = useMemo(() => {
    const opts = {
      lang,
      onlyRecipes: tab === 'recipes',
      onlyIngredients: tab === 'ingredients',
      category: category ?? undefined,
      limit: 50,
    };
    return searchFoods(query, opts);
  }, [query, tab, category, lang]);

  const categories = useMemo(() => allCategories(), []);

  const handleSelect = (food: FoodItem) => {
    if (composerMode) {
      navigate(`/composer?add=${food.slug}`);
    } else {
      navigate(`/food/${food.slug}?meal=${meal}`);
    }
  };

  return (
    <Phone dark={dark}>
      <TopBar
        back
        onBack={() => navigate(-1)}
        title={composerMode ? 'Ingredient tanlash' : 'Ovqat qidirish'}
        transparent
      />

      <div style={{ padding: '0 20px 12px' }}>
        <div style={{
          height: 52, borderRadius: 14, background: '#fff', boxShadow: FIT.shadowSm,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          border: `1px solid ${FIT.border}`,
        }}>
          <Icon name="search" size={20} color={FIT.textMuted} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masalan: osh, tuxum, olma..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, fontFamily: FIT.sans, background: 'transparent',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Tozalash"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}
            >
              <Icon name="close" size={16} color={FIT.textMuted} />
            </button>
          )}
        </div>

        {!composerMode && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, overflow: 'auto' }}>
            {MEAL_OPTIONS.map((m) => (
              <Chip key={m} active={m === meal} size="sm" onClick={() => setMeal(m)}>
                {t[m]}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '4px 20px 8px', display: 'flex', gap: 6, overflow: 'auto' }}>
        {TABS.map((x) => (
          <Chip
            key={x.id} active={tab === x.id} size="sm"
            onClick={() => { setTab(x.id); setCategory(null); }}
            leading={<span>{x.icon}</span>}
          >
            {x.name}
          </Chip>
        ))}
      </div>

      {tab === 'ingredients' && (
        <div style={{ padding: '4px 20px 8px', display: 'flex', gap: 6, overflow: 'auto' }}>
          <Chip active={category === null} size="sm" onClick={() => setCategory(null)}>Hammasi</Chip>
          {categories.map((c) => (
            <Chip key={c} active={category === c} size="sm" onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px' }}>
        <div style={{
          fontSize: 11, color: FIT.textMuted, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
        }}>
          {results.length} natija{query ? ` · "${query}"` : ''}
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: FIT.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Topilmadi</div>
            <div style={{ fontSize: 12 }}>Boshqa so'z bilan qidirib ko'ring yoki</div>
            <button
              type="button"
              onClick={() => navigate('/composer')}
              style={{
                marginTop: 12, padding: '8px 16px', borderRadius: 10,
                background: FIT.primarySoft, color: FIT.primaryDark,
                fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >
              Ingredientlardan yig&apos;ish →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((r) => (
              <button
                type="button"
                key={r.slug}
                onClick={() => handleSelect(r)}
                style={{
                  display: 'flex', gap: 12, padding: 12, background: '#fff',
                  borderRadius: 14, alignItems: 'center', border: `1px solid ${FIT.border}`,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <FoodThumb emoji={r.emoji} photo={r.photoUrl} tone={r.isRecipe ? 'amber' : 'green'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{r.namesAll[lang] ?? r.name}</div>
                  <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>
                    {r.isRecipe ? 'Milliy taom' : 'Ingredient'}
                    {r.category && ` · ${r.category}`}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 10, fontFamily: FIT.mono }}>
                    <MacroDot color={FIT.protein} label={`P${Math.round(r.per100g.protein ?? 0)}`} />
                    <MacroDot color={FIT.carbs} label={`C${Math.round(r.per100g.carbs ?? 0)}`} />
                    <MacroDot color={FIT.fat} label={`F${Math.round(r.per100g.fat ?? 0)}`} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 17, fontWeight: 800, fontFamily: FIT.mono,
                    color: FIT.primary, letterSpacing: -0.5,
                  }}>
                    {Math.round(r.per100g.kcal ?? 0)}
                  </div>
                  <div style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 600 }}>{t.kcal}/100g</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!composerMode && (
          <>
            <div style={{
              fontSize: 11, color: FIT.textMuted, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, margin: '20px 0 8px',
            }}>
              Boshqa yo&apos;llar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { i: '🧩', n: "Ingredientlardan yig'ish", d: 'Taom nomini bilmasangiz', c: FIT.primary, route: '/composer' },
                { i: '✏️', n: "Qo'lda qo'shish", d: 'Yangi taom yaratish', c: FIT.protein, route: '/manual' },
              ].map((o) => (
                <button
                  type="button" key={o.route}
                  onClick={() => navigate(o.route)}
                  style={{
                    display: 'flex', gap: 12, padding: 14, background: '#fff',
                    borderRadius: 14, alignItems: 'center', border: `1px solid ${FIT.border}`,
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: `${o.c}1a`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>
                    {o.i}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{o.n}</div>
                    <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>{o.d}</div>
                  </div>
                  <Icon name="chevron" size={18} color={FIT.textSubtle} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Phone>
  );
}

function MacroDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}
