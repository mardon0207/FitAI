// Health-consequence cards — what happens if you don't fix the issue.
// Triggered cards (based on today's intake) appear first.
// Photo slot per card pulls from /consequences/<slug>.png — user uploads.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, TabBar, Card, Chip } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/App';
import { useDiary } from '@/stores/diary';
import { todayYmd } from '@/data/date';
import {
  CONSEQUENCES, triggeredConsequences, type Consequence, type Severity,
} from '@/data/consequences';

export function ConsequencesScreen() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const onTab = useTabNav();

  const entries = useDiary((s) => s.entries);
  const water = useDiary((s) => s.water);
  const stepsRecords = useDiary((s) => s.steps);

  const [filter, setFilter] = useState<'all' | 'active' | 'macro' | 'micro' | 'activity'>('all');

  const intake = useMemo(() => {
    const ymd = todayYmd();
    const todays = entries.filter((e) => e.date === ymd);
    const waterMl = water.filter((w) => w.date === ymd).reduce((s, w) => s + w.ml, 0);
    const steps = stepsRecords.find((x) => x.date === ymd)?.steps ?? 0;
    const micros: Record<string, number> = {};
    let kcal = 0, protein = 0, carbs = 0, fat = 0;
    for (const e of todays) {
      kcal += e.kcal; protein += e.protein; carbs += e.carbs; fat += e.fat;
      for (const [k, v] of Object.entries(e.micros)) micros[k] = (micros[k] ?? 0) + v;
    }
    return { kcal, protein, carbs, fat, micros, steps, waterMl };
  }, [entries, water, stepsRecords]);

  const active = useMemo(() => triggeredConsequences(intake), [intake]);
  const activeIds = new Set(active.map((c) => c.id));

  const visible = useMemo(() => {
    if (filter === 'active') return active;
    if (filter === 'all') {
      // Active first, then the rest
      const rest = CONSEQUENCES.filter((c) => !activeIds.has(c.id));
      return [...active, ...rest];
    }
    return CONSEQUENCES.filter((c) => c.category === filter);
  }, [filter, active, activeIds]);

  return (
    <Phone dark={dark}>
      <TopBar
        back
        onBack={() => navigate(-1)}
        title="Oqibatlar"
        subtitle={active.length > 0 ? `${active.length} ta faol ogohlantirish` : 'Hammasi yaxshi 👍'}
        transparent
      />

      <div style={{ padding: '4px 20px 10px', display: 'flex', gap: 6, overflow: 'auto' }}>
        <Chip size="sm" active={filter === 'all'} onClick={() => setFilter('all')}>Hammasi</Chip>
        <Chip
          size="sm" active={filter === 'active'} onClick={() => setFilter('active')}
          color={FIT.danger}
          leading={active.length > 0 ? <span>⚠️</span> : undefined}
        >
          Faol ({active.length})
        </Chip>
        <Chip size="sm" active={filter === 'macro'} onClick={() => setFilter('macro')}>BJU</Chip>
        <Chip size="sm" active={filter === 'micro'} onClick={() => setFilter('micro')}>Vitamin</Chip>
        <Chip size="sm" active={filter === 'activity'} onClick={() => setFilter('activity')}>Harakat</Chip>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: FIT.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Hech qanday ogohlantirish yo&apos;q</div>
          </div>
        ) : (
          visible.map((c) => (
            <ConsequenceCard
              key={c.id}
              consequence={c}
              lang={lang}
              isActive={activeIds.has(c.id)}
            />
          ))
        )}

        <div style={{
          marginTop: 14, padding: 12, background: FIT.accentSoft, borderRadius: 12,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <div style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
            Bu tibbiy tashxis <b>EMAS</b>. Jiddiy shikoyatlar bo&apos;lsa — shifokor bilan maslahatlashing.
          </div>
        </div>
      </div>

      <TabBar
        active="home" onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}

interface CardProps {
  consequence: Consequence;
  lang: 'uz' | 'ru' | 'en';
  isActive: boolean;
}

function ConsequenceCard({ consequence: c, lang, isActive }: CardProps) {
  const [expanded, setExpanded] = useState(isActive);
  const severityColor = c.severity === 'danger' ? FIT.danger : c.severity === 'warn' ? FIT.accent : FIT.primary;
  const photoUrl = `/consequences/${c.photoSlug}.png`;
  const [photoError, setPhotoError] = useState(false);

  return (
    <Card
      pad={0}
      style={{
        marginBottom: 12, overflow: 'hidden',
        border: `1px solid ${isActive ? severityColor : FIT.border}`,
        boxShadow: isActive ? `0 4px 20px ${severityColor}33` : FIT.shadowSm,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex', gap: 14, padding: 14, width: '100%',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
          alignItems: 'center',
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: 14, flexShrink: 0,
          background: photoError
            ? `linear-gradient(135deg, ${severityColor}22, ${severityColor}44)`
            : `${severityColor}18 url(${photoUrl}) center/cover no-repeat`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
        }}>
          {/* Fallback emoji if photo not uploaded yet */}
          {photoError && c.emoji}
          {!photoError && (
            <img
              src={photoUrl}
              alt=""
              style={{ display: 'none' }}
              onError={() => setPhotoError(true)}
              onLoad={() => setPhotoError(false)}
            />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            {isActive && (
              <div style={{
                padding: '2px 6px', fontSize: 9, fontWeight: 800,
                background: severityColor, color: '#fff', borderRadius: 4,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                FAOL
              </div>
            )}
            <SeverityDot severity={c.severity} />
            <div style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{c.title[lang]}</div>
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, lineHeight: 1.4 }}>
            {c.tagline[lang]}
          </div>
        </div>

        <Icon
          name={expanded ? 'chevronDown' : 'chevron'}
          size={18}
          color={FIT.textSubtle}
        />
      </button>

      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${FIT.borderSoft}` }}>
          <div style={{
            fontSize: 11, color: FIT.textMuted, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, marginTop: 12, marginBottom: 8,
          }}>
            Oqibatlari
          </div>
          {c.consequences.map((cons, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0',
              borderBottom: i < c.consequences.length - 1 ? `1px solid ${FIT.borderSoft}` : 'none',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10, background: `${severityColor}22`,
                color: severityColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13 }}>{cons[lang]}</span>
            </div>
          ))}

          <div style={{
            fontSize: 11, color: FIT.primaryDark, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, marginTop: 14, marginBottom: 8,
          }}>
            Nima qilish kerak
          </div>
          {c.fixes.map((fix, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10, background: FIT.primarySoft,
                color: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name="check" size={12} color={FIT.primary} strokeWidth={3} />
              </div>
              <span style={{ fontSize: 13 }}>{fix[lang]}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function SeverityDot({ severity }: { severity: Severity }) {
  const color = severity === 'danger' ? FIT.danger : severity === 'warn' ? FIT.accent : FIT.primary;
  return <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />;
}
