import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Card, Button, Input, Chip } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useDiary } from '@/stores/diary';
import { useProfile } from '@/stores/profile';
import { todayYmd } from '@/data/date';
import { ACTIVITIES, calculateKcal, type ActivityType } from '@/data/activities';

export function SportScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const addActivity = useDiary((s) => s.addActivity);
  const weight = useProfile((s) => s.weight) || 70;

  const [selected, setSelected] = useState<ActivityType>(ACTIVITIES[0]!);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);

  console.log('SportScreen Render:', { selected, weight, ymd: todayYmd() });
  const kcal = (selected && value) ? calculateKcal(selected, parseFloat(value) || 0, weight) : 0;

  const handleSave = async () => {
    const val = parseFloat(value);
    if (!val || isNaN(val)) return;

    setLoading(true);
    try {
      addActivity({
        type: selected.id,
        label: selected.label[lang],
        date: todayYmd(),
        value: val,
        unit: selected.unit,
        kcalBurned: kcal,
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Phone dark={dark}>
      <TopBar
        back onBack={() => navigate(-1)}
        title={t.sport || 'Sport'}
        subtitle={t.addActivity}
      />
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 20, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }}>
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              onClick={() => {
                setSelected(act);
                setValue('');
              }}
              style={{
                minWidth: 100, padding: '16px 12px', borderRadius: 16,
                background: selected.id === act.id ? FIT.primary : (dark ? '#1E293B' : '#fff'),
                color: selected.id === act.id ? '#fff' : (dark ? '#F8FAFC' : FIT.text),
                border: `1px solid ${selected.id === act.id ? FIT.primary : (dark ? '#334155' : FIT.border)}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: selected.id === act.id ? `0 8px 16px ${FIT.primary}44` : 'none',
              }}
            >
              <div style={{ fontSize: 24 }}>{act.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{act.label[lang]}</div>
            </div>
          ))}
        </div>

        <Card pad={24} style={{ marginTop: 10 }}>
          <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase' }}>
            {(selected?.label?.[lang] || t.other)} {t.amount}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{
                  width: '100%', fontSize: 32, fontWeight: 800, border: 'none',
                  outline: 'none', background: 'transparent', color: FIT.text,
                  fontFamily: FIT.mono,
                }}
              />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: FIT.textMuted }}>
              {selected.unit === 'min' ? t.minutes : selected.unit === 'reps' ? t.reps : t.steps}
            </div>
          </div>

          <div style={{ 
            padding: '16px', background: dark ? '#1E293B' : '#F8FAFC', borderRadius: 12,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ fontSize: 14, color: FIT.textMuted, fontWeight: 600 }}>{t.estBurn}:</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: FIT.primary, fontFamily: FIT.mono }}>{kcal}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: FIT.textMuted }}>{t.kcal}</span>
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 24 }}>
          <Button full size="lg" loading={loading} onClick={handleSave} disabled={!value}>
            {t.save}
          </Button>
        </div>

        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>{t.todaysMeals.replace(t.meals.toLowerCase(), t.activities.toLowerCase())}</div>
          <ActivityList date={todayYmd()} />
        </div>
      </div>
    </Phone>
  );
}

function ActivityList({ date }: { date: string }) {
  const t = useT();
  const allActivities = useDiary((s) => s.activities || []);
  const activities = useMemo(() => 
    allActivities.filter(x => x.date === date),
    [allActivities, date]
  );
  const removeActivity = useDiary((s) => s.removeActivity);
  const dark = usePrefs((s) => s.theme === 'dark');

  if (activities.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: FIT.textMuted }}>
        <Icon name="stats" size={48} color={dark ? '#334155' : FIT.border} />
        <div style={{ fontSize: 14, fontWeight: 600 }}>{t.noActivities}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {activities.map((a) => {
        const type = ACTIVITIES.find(x => x.id === a.type);
        return (
          <Card key={a.id} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>{type?.emoji || '🏃'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: FIT.textMuted }}>
                {a.value} {a.unit === 'min' ? t.minShort : a.unit === 'reps' ? t.repsShort : t.steps} • {a.kcalBurned} {t.kcal}
              </div>
            </div>
            <button
              onClick={() => removeActivity(a.id)}
              style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer' }}
            >
              <Icon name="close" size={16} color={FIT.danger} />
            </button>
          </Card>
        );
      })}
    </div>
  );
}
