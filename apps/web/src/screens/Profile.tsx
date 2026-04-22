// Profile / Settings. Ported from design/screens-c.jsx::ScreenProfile.

import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, TabBar, Card, Button } from '@/design/primitives';
import { Icon, type IconName } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/App';

interface SettingItem {
  icon: IconName;
  name: string;
  value?: string;
  toggle?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

interface Section {
  title: string;
  items: SettingItem[];
}

export function ProfileScreen() {
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const onTab = useTabNav();
  const setLang = usePrefs((s) => s.setLang);
  const setTheme = usePrefs((s) => s.setTheme);
  const lang = usePrefs((s) => s.lang);
  const theme = usePrefs((s) => s.theme);

  const langLabel = { uz: "O'zbekcha", ru: 'Русский', en: 'English' }[lang];
  const themeLabel = { light: 'Svetlый', dark: 'Qorongu', auto: 'Avto' }[theme];

  const sections: Section[] = [
    {
      title: "Sog'liq ma'lumotlari",
      items: [
        { icon: 'scale', name: "Bo'y/vazn", value: '178cm, 72.3kg' },
        { icon: 'calendar', name: 'Yosh', value: '28 yosh' },
        { icon: 'flame', name: 'Faollik', value: "O'rtacha" },
        { icon: 'leaf', name: 'Ovqat cheklovlari', value: 'Halal' },
      ],
    },
    {
      title: 'Mening taomlarim',
      items: [
        { icon: 'heart', name: "Saqlangan meal'lar", value: '12' },
        { icon: 'diary', name: 'Mening retseptlarim', value: '4' },
      ],
    },
    {
      title: 'Birikmalar',
      items: [
        { icon: 'sparkle', name: 'Apple Health', value: 'Ulangan', highlight: true },
        { icon: 'stats', name: 'Apple Watch', value: 'Ulanmagan' },
      ],
    },
    {
      title: 'Bildirishnomalar',
      items: [
        { icon: 'bell', name: 'Ovqat eslatmasi', toggle: true },
        { icon: 'droplet', name: 'Suv eslatmasi', toggle: true },
        { icon: 'alert', name: 'Yetishmovchilik', toggle: true },
      ],
    },
    {
      title: 'Ilova',
      items: [
        {
          icon: 'globe', name: 'Til', value: langLabel,
          onClick: () => setLang(lang === 'uz' ? 'ru' : lang === 'ru' ? 'en' : 'uz'),
        },
        {
          icon: 'moon', name: 'Tema', value: themeLabel,
          onClick: () => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'),
        },
        { icon: 'settings', name: "O'lchov", value: 'Metric' },
      ],
    },
  ];

  return (
    <Phone dark={dark}>
      <TopBar
        title={t.profile}
        transparent
        right={<Icon name="settings" size={22} color={FIT.text} />}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card pad={16} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 800,
          }}>
            AK
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Aziz Karimov</div>
            <div style={{ fontSize: 12, color: FIT.textMuted }}>aziz@fitai.uz</div>
            <div style={{
              display: 'flex', gap: 8, marginTop: 6, fontSize: 11,
              color: FIT.textMuted, fontFamily: FIT.mono,
            }}>
              <span>🔥 28 kun</span>
              <span>·</span>
              <span>2,340 ovqat</span>
            </div>
          </div>
          <Icon name="edit" size={18} color={FIT.textMuted} />
        </Card>

        <Card
          pad={14}
          style={{
            background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`,
            border: 'none', marginBottom: 16,
          }}
        >
          <div style={{
            fontSize: 11, color: FIT.primaryDark, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Sizning maqsadingiz
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>Vazn kamaytirish</div>
          <div style={{ fontSize: 12, color: FIT.text, marginTop: 4 }}>
            72.3kg → 68kg · 2,150 {t.kcal}/kun
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 3, marginTop: 10 }}>
            <div style={{ height: '100%', width: '40%', background: FIT.primary, borderRadius: 3 }} />
          </div>
        </Card>

        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, color: FIT.textMuted, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingLeft: 4,
            }}>
              {s.title}
            </div>
            <Card pad={0}>
              {s.items.map((it, i) => (
                <button
                  type="button"
                  key={it.name}
                  onClick={it.onClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', width: '100%', background: 'transparent',
                    border: 'none', cursor: it.onClick ? 'pointer' : 'default', textAlign: 'left',
                    borderBottom: i < s.items.length - 1 ? `1px solid ${FIT.borderSoft}` : 'none',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: FIT.primarySoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={it.icon} size={16} color={FIT.primary} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1, color: FIT.text }}>
                    {it.name}
                  </span>
                  {it.toggle ? (
                    <Toggle on />
                  ) : (
                    <>
                      <span style={{
                        fontSize: 12,
                        color: it.highlight ? FIT.primary : FIT.textMuted,
                        fontWeight: it.highlight ? 700 : 500,
                      }}>
                        {it.value}
                      </span>
                      <Icon name="chevron" size={14} color={FIT.textSubtle} />
                    </>
                  )}
                </button>
              ))}
            </Card>
          </div>
        ))}

        <Button variant="secondary" full onClick={() => navigate('/login')}>
          Chiqish
        </Button>
      </div>

      <TabBar
        active="profile"
        onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
    </Phone>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{
      width: 40, height: 22, borderRadius: 11,
      background: on ? FIT.primary : FIT.border,
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 18, height: 18, borderRadius: 9, background: '#fff',
        transition: 'left 150ms',
      }} />
    </div>
  );
}
