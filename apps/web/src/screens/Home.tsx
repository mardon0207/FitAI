import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Phone, TabBar, Card, MultiRing } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { AnimatedNumber } from '@/design/AnimatedNumber';
import { FIT } from '@/design/tokens';
import { useT, usePrefs } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useDiary } from '@/stores/diary';
import { todayYmd } from '@/data/date';
import { useProfile } from '@/stores/profile';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function HomeScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const onTab = useTabNav();
  const navigate = useNavigate();
  
  const targetKcal = useProfile((s) => s.targetKcal);
  const targetProtein = useProfile((s) => s.targetProtein);
  const targetCarbs = useProfile((s) => s.targetCarbs);
  const targetFat = useProfile((s) => s.targetFat);
  const profileName = useProfile((s) => s.name) || 'Aziz';
  const photoUrl = useProfile((s) => s.photoUrl);
  
  const entries = useDiary((s) => s?.entries) || [];
  const water = useDiary((s) => s?.water) || [];
  const stepsRecords = useDiary((s) => s?.steps) || [];
  const weightRecords = useDiary((s) => s?.weight) || [];
  const allActivities = useDiary((s) => s.activities || []);

  const ymd = todayYmd();
  
  const waterMl = useMemo(
    () => water.filter((w) => w && w.date === ymd).reduce((sum, w) => sum + (w.ml || 0), 0),
    [water, ymd],
  );
  const steps = useMemo(
    () => stepsRecords.find((x) => x && x.date === ymd)?.steps ?? 0,
    [stepsRecords, ymd],
  );
  const weightLatest = useMemo(() => {
    if (!Array.isArray(weightRecords)) return 75.2;
    const sorted = [...weightRecords].filter(Boolean).sort((a, b) => b.addedAt - a.addedAt);
    return sorted[0]?.kg ?? 75.2;
  }, [weightRecords]);

  const burnedKcalTotal = useMemo(() => 
    allActivities.filter(x => x.date === ymd).reduce((sum, x) => sum + (x.kcalBurned || 0), 0),
    [allActivities, ymd]
  );

  const today = useMemo(() => {
    const todays = entries.filter((e) => e.date === ymd);
    const kcal = todays.reduce((s, e) => s + e.kcal, 0);
    const p = todays.reduce((s, e) => s + e.protein, 0);
    const c = todays.reduce((s, e) => s + e.carbs, 0);
    const f = todays.reduce((s, e) => s + e.fat, 0);
    return { kcal, p, c, f };
  }, [entries, ymd]);

  const pct = (x: number, y: number) => (y > 0 ? Math.min(1, x / y) : 0);
  const remainingKcal = Math.max(0, targetKcal - today.kcal);

  const hh = new Date().getHours();
  const greet = hh < 12 ? t.goodMorning : hh < 17 ? t.goodAfternoon : t.goodEvening;
  
  // Custom date formatting for the header
  const dateLabel = new Intl.DateTimeFormat(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { 
    day: 'numeric', month: 'long', weekday: 'long' 
  }).format(new Date());

  return (
    <Phone dark showStatus mesh stagger>
      {/* Header Section */}
      <div style={{ padding: '8px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: FIT.cyan, marginBottom: 4 }}>
            {dateLabel.replace(',', '').toLowerCase()}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
            {greet}, <span style={{ color: '#fff' }}>{profileName.split(' ')[0]}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <motion.button whileTap={{ scale: 0.9 }} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <Icon name="bell" size={24} />
          </motion.button>
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            style={{
              width: 48, height: 48, borderRadius: 14,
              border: `2px solid ${FIT.cyan}`,
              overflow: 'hidden', cursor: 'pointer',
              boxShadow: `0 0 15px ${FIT.cyan}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)'
            }}
          >
            {photoUrl ? (
              <img 
                src={photoUrl} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ fontSize: 16, fontWeight: 800, color: FIT.cyan }}>
                {profileName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
        <div data-fit-stagger>
          {/* Main Activity Card */}
          <motion.div variants={itemVariants} style={{ marginBottom: 20 }}>
            <Card variant="glass" pad={24}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <MultiRing
                  size={160}
                  rings={[
                    { progress: pct(today.kcal, targetKcal), color: FIT.cyan },
                    { progress: pct(today.p, targetProtein), color: FIT.neonPink },
                    { progress: pct(today.c, targetCarbs), color: FIT.lime },
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: FIT.mono }}>
                      <AnimatedNumber value={today.kcal} />
                    </div>
                    <div style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600 }}>
                      {t.kcal}
                    </div>
                  </div>
                </MultiRing>
                
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: FIT.textMuted, marginBottom: 4 }}>
                    {lang === 'uz' ? 'Qolgan' : t.remaining}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: FIT.cyan }}>
                    <AnimatedNumber value={remainingKcal} /> {t.kcal}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
                <MacroItem label={t.protein} value={today.p} target={targetProtein} color={FIT.neonPink} />
                <MacroItem label={t.carbs} value={today.c} target={targetCarbs} color={FIT.lime} />
                <MacroItem label={t.fat} value={today.f} target={targetFat} color={FIT.purple} />
              </div>
            </Card>
          </motion.div>

          {/* Tracker Grid */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <TrackerCard 
              icon="fire" label={t.sport.toUpperCase()} value={`${burnedKcalTotal} Kkal`} 
              progress={pct(burnedKcalTotal, 500)} color="#ff4d00" 
              onClick={() => navigate('/sport')} 
            />
            <TrackerCard 
              icon="droplet" label={t.water.toUpperCase()} value={`${Math.round(waterMl / 250)} / 8 stakan`} 
              progress={pct(waterMl, 2000)} color={FIT.blue} 
              onClick={() => navigate('/water')} 
            />
            <TrackerCard 
              icon="steps" label={t.steps.toUpperCase()} value={steps.toLocaleString()} 
              subValue={`Maqsad: 10k ${Math.round(pct(steps, 10000) * 100)}%`}
              progress={pct(steps, 10000)} color={FIT.lime} 
              onClick={() => navigate('/sport')} 
            />
            <TrackerCard 
              icon="scale" label={t.weight.toUpperCase()} value={`${weightLatest} kg`} 
              subBadge="-0.5 kg"
              color={FIT.neonPink} 
              onClick={() => navigate('/weight')} 
            />
          </motion.div>

          {/* AI Advisor Card */}
          <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
            <Card variant="glass" pad={20} style={{ background: 'rgba(0, 242, 255, 0.03)', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: 22, background: 'rgba(0, 242, 255, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: FIT.cyan
                }}>
                  <Icon name="robot" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: FIT.cyan, marginBottom: 6 }}>
                    {t.aiAdvisor}
                  </div>
                  <div style={{ fontSize: 14, color: '#CBD5E1', fontWeight: 500, lineHeight: 1.5 }}>
                    {t.aiTipProtein}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <TabBar active="home" onTab={onTab} labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }} dark />
    </Phone>
  );
}

function MacroItem({ label, value, color }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', background: color }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{Math.round(value)}g</div>
      </div>
    </div>
  );
}

function TrackerCard({ icon, label, value, subValue, subBadge, progress, color, onClick }: any) {
  return (
    <Card variant="glass" pad={16} onClick={onClick} style={{ minHeight: 110 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ color }}>
          <Icon name={icon} size={18} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{value}</div>
      {subValue && (
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>
          {subValue.split(' ').map((word: string, i: number) => 
            word.includes('%') ? <span key={i} style={{ color: FIT.lime, marginLeft: 4 }}>{word}</span> : <span key={i}>{word} </span>
          )}
        </div>
      )}
      {subBadge && (
        <div style={{ 
          display: 'inline-flex', padding: '4px 8px', borderRadius: 8, 
          background: 'rgba(212, 255, 0, 0.1)', color: FIT.lime,
          fontSize: 12, fontWeight: 700, gap: 4, alignItems: 'center'
        }}>
          <Icon name="chevronDown" size={12} style={{ transform: 'rotate(0deg)' }} /> {subBadge}
        </div>
      )}
      {progress !== undefined && (
        <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginTop: 10 }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: color }} />
        </div>
      )}
    </Card>
  );
}

