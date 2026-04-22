// Language / Theme / Permissions micro-screens.
// Ported from design/screens-c.jsx (ScreenLang / ScreenTheme / ScreenPerms).

import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Card, Button } from '@/design/primitives';
import { Icon, type IconName } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';
import type { Lang, Theme } from '@/stores/prefs';

export function LangScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const lang = usePrefs((s) => s.lang);
  const setLang = usePrefs((s) => s.setLang);
  const navigate = useNavigate();

  const langs: Array<{ id: Lang; flag: string; native: string; english: string }> = [
    { id: 'uz', flag: '🇺🇿', native: "O'zbekcha", english: 'Uzbek' },
    { id: 'ru', flag: '🇷🇺', native: 'Русский', english: 'Russian' },
    { id: 'en', flag: '🇬🇧', native: 'English', english: 'English' },
  ];

  return (
    <Phone dark={dark}>
      <div style={{
        flex: 1, padding: '40px 24px 24px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <Icon name="globe" size={32} color="#fff" />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>
          Tilni tanlang
        </div>
        <div style={{ fontSize: 14, color: FIT.textMuted, marginTop: 4 }}>
          Choose language · Выберите язык
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24,
        }}>
          {langs.map((l) => {
            const active = lang === l.id;
            return (
              <button
                type="button"
                key={l.id}
                onClick={() => setLang(l.id)}
                style={{
                  padding: 16, borderRadius: 16, background: '#fff',
                  border: `2px solid ${active ? FIT.primary : FIT.border}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: FIT.surfaceAlt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>
                  {l.flag}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{l.native}</div>
                  <div style={{ fontSize: 12, color: FIT.textMuted }}>{l.english}</div>
                </div>
                {active && (
                  <div style={{
                    width: 24, height: 24, borderRadius: 12, background: FIT.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="check" size={14} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <Button variant="primary" size="lg" full onClick={() => navigate('/theme')}>
          Davom etish
        </Button>
      </div>
    </Phone>
  );
}

export function ThemeScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const theme = usePrefs((s) => s.theme);
  const setTheme = usePrefs((s) => s.setTheme);
  const navigate = useNavigate();

  const themes: Array<{ id: Theme; name: string; icon: string; bg: string; fg: string }> = [
    { id: 'light', name: 'Svetlый', icon: '☀️', bg: '#FAFAF9', fg: '#0F172A' },
    { id: 'dark', name: 'Qorongu', icon: '🌙', bg: '#0F172A', fg: '#F8FAFC' },
    { id: 'auto', name: 'Avto', icon: '⚙️', bg: 'linear-gradient(135deg,#FAFAF9 50%,#0F172A 50%)', fg: '#64748B' },
  ];

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} title="Tema" transparent />
      <div style={{ flex: 1, padding: '0 20px 20px' }}>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginBottom: 16 }}>
          Ilova tashqi ko&apos;rinishi
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {themes.map((th) => {
            const active = theme === th.id;
            return (
              <button
                type="button"
                key={th.id}
                onClick={() => setTheme(th.id)}
                style={{
                  padding: 10, borderRadius: 16, background: '#fff',
                  border: `2px solid ${active ? FIT.primary : FIT.border}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  height: 140, borderRadius: 10, background: th.bg,
                  display: 'flex', flexDirection: 'column', padding: 10, gap: 6, position: 'relative',
                }}>
                  <div style={{ width: 30, height: 6, borderRadius: 3, background: th.fg, opacity: 0.8 }} />
                  <div style={{ width: '100%', height: 28, borderRadius: 6, background: th.fg, opacity: 0.1 }} />
                  <div style={{ width: '80%', height: 10, borderRadius: 3, background: th.fg, opacity: 0.4 }} />
                  <div style={{ width: '60%', height: 10, borderRadius: 3, background: th.fg, opacity: 0.3 }} />
                  <div style={{
                    marginTop: 'auto', width: 24, height: 24,
                    borderRadius: 12, background: FIT.primary,
                  }} />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'center',
                }}>
                  <span>{th.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{th.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Phone>
  );
}

export function PermsScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();

  const perms: Array<{ icon: IconName; name: string; desc: string; on: boolean }> = [
    { icon: 'barcode', name: 'Shtrix-kod kamerasi', desc: "Faqat shtrix-kod o'qish uchun. AI skaner YO'Q.", on: true },
    { icon: 'stats', name: "Sog'liq / HealthKit", desc: "Qadam sanash va faollik ma'lumotlari", on: true },
    { icon: 'bell', name: 'Bildirishnomalar', desc: 'Ovqat va suv eslatmalari', on: true },
  ];

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{ flex: 1, padding: '0 20px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, marginBottom: 16,
        }}>
          🔐
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Ruxsatlar</div>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 4, lineHeight: 1.5 }}>
          Eng yaxshi tajriba uchun quyidagilarni yoqing
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {perms.map((p) => (
            <Card key={p.name} pad={14} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: FIT.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={p.icon} size={20} color={FIT.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2, lineHeight: 1.4 }}>
                  {p.desc}
                </div>
              </div>
              <div style={{
                width: 40, height: 22, borderRadius: 11,
                background: p.on ? FIT.primary : FIT.border,
                position: 'relative', flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute', top: 2, left: p.on ? 20 : 2,
                  width: 18, height: 18, borderRadius: 9, background: '#fff',
                }} />
              </div>
            </Card>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="lg" full style={{ marginTop: 20 }} onClick={() => navigate('/')}>
          Davom etish
        </Button>
      </div>
    </Phone>
  );
}
