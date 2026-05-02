import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Card, Button, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useDiary } from '@/stores/diary';
import { useProfile } from '@/stores/profile';
import { ymd as formatDate } from '@/data/date';

export function ReportScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  
  const entries = useDiary(s => s.entries);
  const weightRecords = useDiary(s => s.weight);
  const stepsRecords = useDiary(s => s.steps);
  const targetKcal = useProfile(s => s.targetKcal) || 2000;
  const userName = useProfile(s => s.name) || 'User';

  const stats = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return formatDate(d);
    });

    const weekEntries = entries.filter(e => last7Days.includes(e.date));
    const totalKcal = weekEntries.reduce((sum, e) => sum + e.kcal, 0);
    const avgKcal = Math.round(totalKcal / 7);
    
    const weekSteps = stepsRecords.filter(r => last7Days.includes(r.date));
    const avgSteps = Math.round(weekSteps.reduce((sum, r) => sum + r.steps, 0) / 7);

    // Weight diff
    const sortedWeight = [...weightRecords].sort((a, b) => b.addedAt - a.addedAt);
    const latestWeight = sortedWeight[0]?.kg ?? null;
    const oldestDate = last7Days[6];
    const oldWeight = (oldestDate ? sortedWeight.find(r => r.date <= oldestDate)?.kg : null) ?? latestWeight;
    const weightDiff = (latestWeight !== null && oldWeight !== null) ? latestWeight - oldWeight : 0;

    // Compliance
    const loggedDays = new Set(weekEntries.map(e => e.date)).size;
    const compliance = Math.round((loggedDays / 7) * 100);

    // Top Foods
    const foodCounts: Record<string, { count: number, kcal: number, emoji?: string, name?: string }> = {};
    weekEntries.forEach(e => {
      const key = e.foodSlug;
      if (!foodCounts[key]) {
        foodCounts[key] = { 
          count: 0, 
          kcal: 0, 
          emoji: e.foodEmoji || (e.foodSlug === '__composed__' ? '🧩' : '🍽'),
          name: e.foodName || e.foodSlug
        };
      }
      foodCounts[key].count += 1;
      foodCounts[key].kcal += e.kcal;
    });
    const topFoods = Object.values(foodCounts)
      .sort((a, b) => b.kcal - a.kcal)
      .slice(0, 4);

    return { 
      avgKcal, 
      avgSteps, 
      weightDiff, 
      compliance, 
      topFoods, 
      dateRange: `${last7Days[6]} – ${last7Days[0]}`,
      loggedDays
    };
  }, [entries, weightRecords, stepsRecords, lang]);

  const summaryText = useMemo(() => {
    if (stats.loggedDays === 0) return t.noReportData;
    
    let text = t.complianceNote.replace('{pct}', stats.compliance.toString()) + ' ';
    if (stats.avgKcal > targetKcal) {
      text += t.highKcalNote.replace('{avg}', stats.avgKcal.toString()) + ' ';
    } else {
      text += t.goodBalanceNote + ' ';
    }
    
    if (stats.weightDiff < 0) {
      text += t.weightLossNote.replace('{val}', Math.abs(stats.weightDiff).toFixed(1));
    } else if (stats.weightDiff > 0) {
      text += t.weightGainNote.replace('{val}', stats.weightDiff.toFixed(1));
    }
    
    return text;
  }, [stats, targetKcal, t]);

  return (
    <Phone dark={dark}>
      <TopBar
        back onBack={() => navigate(-1)}
        title={t.weeklyReport}
        transparent
        right={<Icon name="settings" size={20} color={dark ? '#fff' : FIT.text} />}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card
          pad={20}
          style={{
            background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
            border: 'none', color: '#fff',
          }}
        >
          <div style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.85, fontWeight: 600,
          }}>
            {t.report}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 }}>
            {stats.dateRange}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
            {userName} · {stats.loggedDays} {t.logged}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          <ReportStat l={t.avgKcalLabel} v={stats.avgKcal.toLocaleString()} u={t.kcal} c={FIT.primary} />
          <ReportStat l={t.avgStepsLabel} v={stats.avgSteps.toLocaleString()} u={t.perDay} c={FIT.accent} />
          <ReportStat 
            l={t.weightChange} 
            v={(stats.weightDiff > 0 ? '+' : '') + stats.weightDiff.toFixed(1)} 
            u="kg" 
            c={FIT.protein} 
          />
          <ReportStat l={t.compliance} v={stats.compliance.toString()} u="%" c={FIT.primary} />
        </div>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
            {t.mostConsumed}
          </div>
          {stats.topFoods.length === 0 ? (
            <div style={{ fontSize: 12, color: FIT.textMuted, textAlign: 'center', padding: '10px 0' }}>{t.noData}</div>
          ) : stats.topFoods.map((it, i, arr) => (
            <div
              key={it.name}
              style={{
                display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${FIT.borderSoft}` : 'none',
              }}
            >
              <span style={{ fontSize: 20 }}>{it.emoji}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{it.name}</span>
              <span style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>{it.count} {t.repsShort}</span>
              <span style={{
                fontSize: 12, fontWeight: 700, fontFamily: FIT.mono,
                color: FIT.primary, minWidth: 50, textAlign: 'right',
              }}>
                {Math.round(it.kcal)}
              </span>
            </div>
          ))}
        </Card>

        <Card pad={16} style={{ marginTop: 12, background: FIT.primarySoft, border: 'none' }}>
          <div style={{
            fontSize: 11, color: FIT.primaryDark, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {t.weeklySummary}
          </div>
          <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.6, color: FIT.text }}>
            {summaryText}
          </div>
        </Card>

        <Button variant="secondary" full style={{ marginTop: 16 }}>
          {t.exportPdf}
        </Button>
      </div>
    </Phone>
  );
}

function ReportStat({ l, v, u, c }: { l: string; v: string; u: string; c: string }) {
  return (
    <Card pad={14}>
      <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{l}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
        <span style={{
          fontSize: 22, fontWeight: 800, fontFamily: FIT.mono,
          color: c, letterSpacing: -0.5,
        }}>
          {v}
        </span>
        <span style={{ fontSize: 11, color: FIT.textMuted }}>{u}</span>
      </div>
    </Card>
  );
}
