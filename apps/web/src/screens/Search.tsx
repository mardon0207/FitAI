import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Phone, TopBar, Chip, FoodThumb, Card } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT, type I18NStrings } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useSearchFoods } from '@/api/hooks';
import { ErrorState } from '@/components/ErrorState';

const TABS = (t: I18NStrings) => [
  { id: 'all', icon: '✨', name: t.all },
  { id: 'recipes', icon: '🍽', name: t.national },
  { id: 'ingredients', icon: '🥗', name: t.ingredient },
];

const MEAL_OPTIONS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const POPULAR_QUERIES = ['osh', 'guruch', 'tovuq', 'tuxum', 'non', 'go\'sht', 'sabzi', 'pomidor'];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
    if (tab === 'recipes') return allResults.filter((r) => r.isRecipe);
    if (tab === 'ingredients') return allResults.filter((r) => !r.isRecipe);
    return allResults;
  }, [allResults, tab]);

  const fmt = (n: number | undefined, decimals = 0) =>
    n === undefined || isNaN(n) ? '0' : decimals === 0 ? Math.round(n).toString() : n.toFixed(decimals);

  const handleSelect = (food: any) => {
    if (composerMode) {
      navigate(`/composer?add=${food.id}`);
    } else {
      navigate(`/food/${food.id}?meal=${meal}`);
    }
  };

  return (
    <Phone dark={dark} showStatus mesh stagger>
      <TopBar
        back
        onBack={() => navigate(-1)}
        title={composerMode ? t.selectIngredient : t.searchFood}
        transparent
      />

      {/* Search Header Section */}
      <div style={{ padding: '0 20px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="glass-premium" style={{
          height: 60, borderRadius: 22,
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
          border: query ? `1px solid ${FIT.cyan}` : '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: query ? `0 0 20px ${FIT.cyan}33` : 'none',
        }}>
          <Icon name="search" size={22} color={query ? FIT.cyan : '#64748B'} strokeWidth={2.5} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 16, fontFamily: FIT.sans, background: 'transparent',
              fontWeight: 700, color: '#fff'
            }}
          />
          {isFetching && (
            <div style={{
              width: 20, height: 20, borderRadius: 10,
              border: `2px solid rgba(255,255,255,0.1)`,
              borderTopColor: FIT.cyan,
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0,
            }} />
          )}
          {query && !isFetching && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6 }}
            >
              <Icon name="close" size={20} color="#64748B" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {!composerMode && (
          <div style={{ display: 'flex', gap: 10, marginTop: 18, overflow: 'auto', paddingBottom: 4 }}>
            {MEAL_OPTIONS.map((m) => (
              <Chip key={m} active={m === meal} size="md" onClick={() => setMeal(m)} dark={dark}>
                {t[m]}
              </Chip>
            ))}
          </div>
        )}
        
        <div style={{ padding: '16px 0 4px', display: 'flex', gap: 10, overflow: 'auto' }}>
          {tabs.map((x) => (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              className={tab === x.id ? "neon-glow-cyan" : ""}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                borderRadius: 16, fontSize: 14, fontWeight: 800,
                background: tab === x.id ? FIT.cyan : 'rgba(255,255,255,0.05)',
                color: tab === x.id ? '#000' : '#94A3B8',
                cursor: 'pointer', transition: 'all 0.25s', whiteSpace: 'nowrap',
                boxShadow: tab === x.id ? `0 0 20px ${FIT.cyan}44` : 'none',
                border: tab === x.id ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{ fontSize: 16 }}>{x.icon}</span>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 120px', position: 'relative' }}>
        <div data-fit-stagger>
        {!query && (
          <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 12, color: '#64748B', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16,
            }}>
              {t.popularSearches}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {POPULAR_QUERIES.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className="glass-premium"
                  style={{
                    padding: '12px 22px', borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.06)', 
                    background: 'rgba(255,255,255,0.03)',
                    fontSize: 14, fontWeight: 800, cursor: 'pointer', color: '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {isError ? (
          <ErrorState message={t.loadError} onRetry={refetch} dark={dark} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
             {isLoading ? (
               [1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="shimmer" style={{
                   height: 90, borderRadius: 24, background: 'rgba(255,255,255,0.02)',
                   opacity: 1 - i * 0.1,
                 }} />
               ))
             ) : results.length === 0 && query ? (
               <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                 <div style={{ fontSize: 72, marginBottom: 20 }}>🔍</div>
                 <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12 }}>{t.noResults}</div>
                 <div style={{ fontSize: 16, color: '#64748B', marginBottom: 32, lineHeight: 1.6, fontWeight: 600 }}>
                    {t.noResultsMsg.replace('{query}', query)}
                 </div>
                 <button
                   type="button"
                   onClick={() => navigate('/manual')}
                   className="neon-glow-cyan"
                   style={{
                     padding: '18px 36px', borderRadius: 20,
                     background: FIT.cyan, color: '#000',
                     fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer',
                     boxShadow: `0 0 30px ${FIT.cyan}44`,
                     textTransform: 'uppercase', letterSpacing: 1
                   }}
                 >
                   {t.addManual}
                 </button>
               </div>
             ) : (
               results.map((r: any) => (
                 <motion.button
                   variants={itemVariants}
                   type="button"
                   key={r.id}
                   onClick={() => handleSelect(r)}
                   whileTap={{ scale: 0.98 }}
                   style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                 >
                   <Card variant="glass" pad={16} style={{ 
                     display: 'flex', gap: 18, alignItems: 'center', 
                     background: 'rgba(255,255,255,0.02)',
                     border: '1px solid rgba(255,255,255,0.05)'
                   }}>
                     <FoodThumb emoji={r.emoji} photo={r.photoUrl ?? undefined} tone={r.isRecipe ? 'amber' : 'green'} size={56} />
                     <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: -0.5 }}>
                         {r.name}
                       </div>
                       <div style={{ fontSize: 12, color: '#64748B', fontWeight: 800, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                         <span style={{ 
                           padding: '2px 10px', background: r.isRecipe ? `${FIT.neonPink}22` : `${FIT.cyan}22`,
                           color: r.isRecipe ? FIT.neonPink : FIT.cyan,
                           borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5
                         }}>
                           {r.isRecipe ? t.national : t.ingredient}
                         </span>
                         {r.category && <span style={{ opacity: 0.8 }}>{r.category}</span>}
                       </div>
                        <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12, fontWeight: 900, fontFamily: FIT.mono }}>
                           <span style={{ color: FIT.lime }}>P {fmt(r.proteinG)}</span>
                           <span style={{ color: FIT.cyan }}>C {fmt(r.carbsG)}</span>
                           <span style={{ color: FIT.neonPink }}>F {fmt(r.fatG)}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 4 }}>
                        <div style={{ fontSize: 26, fontWeight: 950, fontFamily: FIT.mono, color: FIT.cyan, letterSpacing: -2 }}>
                          {fmt(r.kcalPer100g)}
                        </div>
                       <div style={{ fontSize: 10, color: '#64748B', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>{t.kcal}</div>
                    </div>
                   </Card>
                 </motion.button>
               ))
             )}
          </div>
        )}

        {!isLoading && !composerMode && (
          <motion.div variants={itemVariants} style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              fontSize: 12, color: '#64748B', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20,
            }}>
              {t.extraOptions}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { i: '🧩', n: t.compose, route: '/composer', c: FIT.cyan },
                { i: '✏️', n: t.manual, route: '/manual', c: FIT.lime },
                { i: '📷', n: t.barcode, route: '/barcode', c: FIT.neonPink },
              ].map((o) => (
                <button
                  key={o.route}
                  onClick={() => navigate(o.route)}
                  className="glass-premium"
                  style={{
                    display: 'flex', gap: 14, padding: '20px 18px', 
                    borderRadius: 24, alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.06)', 
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: 28 }}>{o.i}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{o.n}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </Phone>
  );
}
