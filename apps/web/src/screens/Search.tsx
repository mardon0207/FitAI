import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, TopBar, Chip, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useSearchFoods } from '@/api/hooks';
import { ErrorState } from '@/components/ErrorState';

const TABS = (t: any) => [
  { id: 'all', icon: '✨', name: t.all },
  { id: 'recipes', icon: '🍽', name: t.national },
  { id: 'ingredients', icon: '🥗', name: t.ingredient },
];

const MEAL_OPTIONS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const POPULAR_QUERIES = ['osh', 'guruch', 'tovuq', 'tuxum', 'non', 'go\'sht', 'sabzi', 'pomidor'];

export function SearchScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const composerMode = sp.get('mode') === 'composer';
  const mealParam = sp.get('meal');

  const [query, setQuery] = useState('');
  const tabs = TABS(t);
  const [tab, setTab] = useState(tabs[0]!.id);
  const [meal, setMeal] = useState<(typeof MEAL_OPTIONS)[number]>(
    MEAL_OPTIONS.includes(mealParam as never) ? (mealParam as (typeof MEAL_OPTIONS)[number]) : 'lunch',
  );

  const searchQuery = query.trim() || 'a';
  const { data: allResults = [], isLoading, isFetching, isError, refetch } = useSearchFoods(searchQuery, lang, true);

  const results = useMemo(() => {
    let list = allResults;
    if (tab === 'recipes') list = allResults.filter((r: any) => r.is_recipe);
    if (tab === 'ingredients') list = allResults.filter((r: any) => !r.is_recipe);
    return list;
  }, [allResults, tab]);

  const handleSelect = (food: any) => {
    if (composerMode) {
      navigate(`/composer?add=${food.id}`);
    } else {
      navigate(`/food/${food.id}?meal=${meal}`);
    }
  };

  return (
    <Phone dark={dark}>
      <TopBar
        back
        onBack={() => navigate(-1)}
        title={composerMode ? t.selectIngredient : t.searchFood}
        transparent
      />

      {/* Search Header Section */}
      <div style={{ padding: '0 16px 12px', position: 'sticky', top: 0, zIndex: 10 }} className="glass">
        <div style={{
          height: 52, borderRadius: 16,
          background: dark ? 'rgba(255,255,255,0.05)' : '#fff', 
          boxShadow: FIT.shadowSm,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          border: `1.5px solid ${query ? FIT.primary : (dark ? 'rgba(255,255,255,0.1)' : FIT.border)}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <Icon name="search" size={20} color={query ? FIT.primary : FIT.textMuted} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, fontFamily: FIT.sans, background: 'transparent',
              fontWeight: 600, color: FIT.text
            }}
          />
          {isFetching && (
            <div style={{
              width: 18, height: 18, borderRadius: 9,
              border: `2px solid ${FIT.primarySoft}`,
              borderTopColor: FIT.primary,
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0,
            }} />
          )}
          {query && !isFetching && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}
            >
              <Icon name="close" size={16} color={FIT.textMuted} />
            </button>
          )}
        </div>

        {!composerMode && (
          <div style={{ display: 'flex', gap: 6, marginTop: 12, overflow: 'auto', paddingBottom: 2 }}>
            {MEAL_OPTIONS.map((m) => (
              <Chip key={m} active={m === meal} size="sm" onClick={() => setMeal(m)}>
                {t[m]}
              </Chip>
            ))}
          </div>
        )}
        
        <div style={{ padding: '12px 0 4px', display: 'flex', gap: 8, overflow: 'auto' }}>
          {tabs.map((x) => (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 700,
                background: tab === x.id ? FIT.primary : (dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                color: tab === x.id ? '#fff' : FIT.text,
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              <span>{x.icon}</span>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {!query && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 10, color: FIT.textMuted, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12,
            }}>
              {t.popularSearches}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {POPULAR_QUERIES.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  style={{
                    padding: '8px 16px', borderRadius: 14,
                    background: dark ? 'rgba(255,255,255,0.03)' : '#fff', 
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : FIT.border}`,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', color: FIT.text,
                    boxShadow: FIT.shadowSm
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {isError ? (
          <ErrorState 
            message={t.loadError} 
            onRetry={refetch}
            dark={dark}
          />
        ) : (
          <div data-fit-stagger style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
             {isLoading ? (
               [1, 2, 3, 4, 5].map(i => (
                 <div key={i} style={{
                   height: 72, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.03)' : FIT.surfaceAlt,
                   animation: 'pulse 1.4s ease-in-out infinite',
                   opacity: 1 - i * 0.15,
                 }} />
               ))
             ) : results.length === 0 && query ? (
               <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                 <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                 <div style={{ fontSize: 18, fontWeight: 800, color: FIT.text, marginBottom: 8 }}>{t.noResults}</div>
                 <div style={{ fontSize: 14, color: FIT.textMuted, marginBottom: 24, lineHeight: 1.5 }}>
                    {t.noResultsMsg.replace('{query}', query)}
                 </div>
                 <button
                   type="button"
                   onClick={() => navigate('/manual')}
                   style={{
                     padding: '12px 24px', borderRadius: 14,
                     background: FIT.primary, color: '#fff',
                     fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                   }}
                 >
                   {t.addManual}
                 </button>
               </div>
             ) : (
               results.map((r: any) => (
                 <button
                   type="button"
                   key={r.id}
                   onClick={() => handleSelect(r)}
                   style={{
                     display: 'flex', gap: 16, padding: 14, 
                     background: dark ? 'rgba(30, 41, 59, 0.4)' : '#fff',
                     borderRadius: 18, alignItems: 'center',
                     border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`,
                     cursor: 'pointer', textAlign: 'left', width: '100%',
                     boxShadow: FIT.shadowSm,
                   }}
                 >
                   <FoodThumb emoji={r.emoji} photo={r.photoUrl} tone={r.isRecipe ? 'amber' : 'green'} size={48} />
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <div style={{ fontSize: 15, fontWeight: 800, color: FIT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {r.name}
                     </div>
                     <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                       <span style={{ 
                         padding: '2px 6px', background: r.isRecipe ? `${FIT.accent}15` : `${FIT.primary}15`,
                         color: r.isRecipe ? FIT.accent : FIT.primary,
                         borderRadius: 6, fontSize: 9, fontWeight: 800, textTransform: 'uppercase'
                       }}>
                         {r.isRecipe ? t.national : t.ingredient}
                       </span>
                       {r.category && ` · ${r.category}`}
                     </div>
                     <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 10, fontWeight: 700, fontFamily: FIT.mono }}>
                        <span style={{ color: FIT.protein }}>P {r.proteinG?.toFixed(0)}</span>
                        <span style={{ color: FIT.carbs }}>C {r.carbsG?.toFixed(0)}</span>
                        <span style={{ color: FIT.fat }}>F {r.fatG?.toFixed(0)}</span>
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: 22, fontWeight: 900, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -1 }}>
                       {Math.round(r.kcalPer100g ?? 0)}
                     </div>
                     <div style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>{t.kcal}</div>
                   </div>
                 </button>
               ))
             )}
          </div>
        )}

        {!isLoading && !composerMode && (
          <div style={{ marginTop: 32, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`, paddingTop: 24 }}>
            <div style={{
              fontSize: 10, color: FIT.textMuted, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16,
            }}>
              {t.extraOptions}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { i: '🧩', n: t.compose, route: '/composer', c: FIT.primary },
                { i: '✏️', n: t.manual, route: '/manual', c: FIT.protein },
                { i: '📷', n: t.barcode, route: '/barcode', c: FIT.accent },
              ].map((o) => (
                <button
                  key={o.route}
                  onClick={() => navigate(o.route)}
                  style={{
                    display: 'flex', gap: 12, padding: 14, 
                    background: dark ? 'rgba(255,255,255,0.02)' : '#fff',
                    borderRadius: 16, alignItems: 'center',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`,
                    cursor: 'pointer', textAlign: 'left',
                    boxShadow: FIT.shadowSm,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{o.i}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: FIT.text }}>{o.n}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </Phone>
  );
}
