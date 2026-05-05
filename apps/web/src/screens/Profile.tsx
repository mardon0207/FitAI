import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, TabBar, Card, Button } from '@/design/primitives';
import { Icon, type IconName } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs, useT } from '@/stores/prefs';
import { useTabNav } from '@/hooks/useTabNav';
import { useProfile } from '@/stores/profile';
import { useAuth } from '@/stores/auth';
import { useDiary } from '@/stores/diary';
import { TweaksPanelContent } from '@/design/TweaksPanel';

interface SettingItem {
  icon: IconName;
  name: string;
  value?: string;
  toggle?: boolean;
  active?: boolean;
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
  const [showTweaks, setShowTweaks] = useState(false);
  const [healthConnected, setHealthConnected] = useState(true);
  const [reminders, setReminders] = useState({ food: true, water: true });

  const profile = useProfile();
  const diary = useDiary();
  const auth = useAuth();
  
  // Calculate Streak
  const streak = useMemo(() => {
    const entries = diary.entries || [];
    if (entries.length === 0) return 0;

    const dates = new Set(entries.map(e => e.date));
    let count = 0;
    let d = new Date();
    
    // Safety limit to avoid infinite loops (max 365 days)
    for (let i = 0; i < 365; i++) {
      const currentYmd = d.toISOString().split('T')[0] as string;
      if (dates.has(currentYmd)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        // If we haven't logged today, check if we logged yesterday to maintain the streak
        if (count === 0 && i === 0) {
          d.setDate(d.getDate() - 1);
          const yesterdayYmd = d.toISOString().split('T')[0] as string;
          if (dates.has(yesterdayYmd)) {
            continue; // Start counting from yesterday
          }
        }
        break;
      }
    }
    return count;
  }, [diary.entries]);

  const totalMeals = (diary.entries || []).length;

  const age = profile.birthDate 
    ? Math.floor((new Date().getTime() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : profile.age || 0;

  const handleEditProfile = () => {
    const name = prompt(t.editName, profile.name || '');
    if (name) profile.updateProfile({ name });
  };

  const handleEditMetric = (field: 'height' | 'weight', label: string) => {
    const val = prompt(`${label} ${t.editMetric}`, String(profile[field] || ''));
    if (val && !isNaN(Number(val))) {
      profile.updateProfile({ [field]: Number(val) });
    }
  };

  const handleLogout = () => {
    if (confirm(t.logoutConfirm)) {
      auth.logout();
      profile.reset();
      navigate('/login');
    }
  };
  const sections: Section[] = [
    {
      title: t.healthData,
      items: [
        { icon: 'scale', name: `${t.weight}/${t.weight}`, value: `${profile.height}cm, ${profile.weight}kg`, onClick: () => handleEditMetric('weight', t.weight) },
        { icon: 'calendar', name: t.age, value: `${age}`, onClick: () => {
          const bd = prompt('YYYY-MM-DD:', profile.birthDate || '');
          if (bd) profile.updateProfile({ birthDate: bd });
        } },
        { icon: 'flame', name: t.activities, value: (t[`level_${profile.activityLevel}` as keyof typeof t] as string) || profile.activityLevel, onClick: () => {
          const levels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
          const next = prompt('sedentary/light/moderate/active/very_active:', profile.activityLevel);
          if (next && levels.includes(next)) profile.updateProfile({ activityLevel: next as any });
        } },
        { icon: 'leaf', name: t.halal, value: t.halal, onClick: () => alert(t.soon) },
      ],
    },
    {
      title: t.connections,
      items: [
        { 
          icon: 'heart', 
          name: t.appleHealth, 
          value: healthConnected ? t.connected : t.notConnected, 
          highlight: healthConnected, 
          onClick: () => setHealthConnected(!healthConnected) 
        },
        { icon: 'stats', name: t.appleWatch, value: t.notConnected, onClick: () => alert(t.soon) },
      ],
    },
    {
      title: t.reminders,
      items: [
        { 
          icon: 'bell', 
          name: t.addFood, 
          toggle: true, 
          active: reminders.food, 
          onClick: () => setReminders((r: any) => ({ ...r, food: !r.food })) 
        },
        { 
          icon: 'droplet', 
          name: t.water, 
          toggle: true, 
          active: reminders.water, 
          onClick: () => setReminders((r: any) => ({ ...r, water: !r.water })) 
        },
      ],
    },
    {
      title: t.appSettings,
      items: [
        { 
          icon: 'settings', 
          name: t.language, 
          value: usePrefs.getState().lang === 'uz' ? 'O\'zbekcha' : (usePrefs.getState().lang === 'ru' ? 'Русский' : 'English'), 
          onClick: () => {
            const current = usePrefs.getState().lang;
            const next = current === 'uz' ? 'ru' : 'uz';
            usePrefs.getState().setLang(next);
          }
        },
        { 
          icon: 'moon', 
          name: t.theme, 
          value: dark ? t.dark : t.light, 
          onClick: () => {
            const next = dark ? 'light' : 'dark';
            usePrefs.getState().setTheme(next);
          }
        },
        { icon: 'scale', name: t.unit, value: t.metric },
      ],
    },
  ];

  return (
    <Phone dark showStatus mesh>
      <TopBar 
        title={t.profile} transparent 
        right={
          <button 
            onClick={() => setShowTweaks(true)}
            style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              color: '#fff',
            }}
          >
            <Icon name="settings" size={22} />
          </button>
        } 
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 120px', position: 'relative' }}>
        <div data-fit-stagger>
          <Card variant="glass" pad={20} style={{ margin: '16px 0 24px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 84, height: 84, borderRadius: 28,
                  background: profile.photoUrl ? 'rgba(255,255,255,0.05)' : FIT.cyan,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: profile.photoUrl ? 'inherit' : '#000', fontSize: 28, fontWeight: 900,
                  boxShadow: `0 10px 30px ${FIT.cyan}33`,
                  overflow: 'hidden'
                }}>
                  {profile.photoUrl ? (
                    <img 
                      src={profile.photoUrl} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    (profile.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  )}
                </div>
                <button onClick={handleEditProfile} style={{
                  position: 'absolute', bottom: -4, right: -4,
                  width: 32, height: 32, borderRadius: 10, background: '#fff',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <Icon name="edit" size={16} color="#000" />
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
                  {profile.name || t.name}
                </div>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>
                  {profile.email || '...'}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>🔥</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{streak} {t.days}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>🍽️</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{totalMeals.toLocaleString()} {t.meals}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="glass" pad={20} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{t.goalWeight}</div>
              <Icon name="trophy" size={18} color={FIT.cyan} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
              {profile.goal === 'lose' ? t.goal_lose : profile.goal === 'gain' ? t.goal_gain : t.goal_maintain}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 }}>
              <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>
                {profile.weight}kg → {profile.goal === 'lose' ? profile.weight - 5 : profile.goal === 'gain' ? profile.weight + 5 : profile.weight}kg
              </div>
              <div style={{ fontSize: 14, color: FIT.cyan, fontWeight: 900 }}>
                {profile.targetKcal.toLocaleString()} {t.kcal}/kun
              </div>
            </div>

            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginTop: 14, overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', background: `linear-gradient(90deg, ${FIT.cyan}, ${FIT.lime})`, borderRadius: 4 }} />
            </div>
          </Card>

          {sections.map((s) => (
            <div key={s.title} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, paddingLeft: 4 }}>
                {s.title}
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', borderRadius: 24, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
              }}>
                {s.items.map((it, i) => (
                  <div
                    key={it.name}
                    onClick={it.onClick}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '18px 20px', width: '100%', background: 'transparent',
                      border: 'none', cursor: it.onClick ? 'pointer' : 'default', textAlign: 'left',
                      borderBottom: i < s.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={it.icon} size={20} color={it.highlight ? FIT.cyan : '#94A3B8'} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, flex: 1, color: '#fff' }}>
                      {it.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {it.toggle ? (
                        <div 
                          onClick={(e) => { e.stopPropagation(); it.onClick?.(); }}
                          style={{ 
                            width: 48, height: 26, borderRadius: 13, 
                            background: it.active ? FIT.cyan : 'rgba(255,255,255,0.1)', 
                            position: 'relative', cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ 
                            width: 20, height: 20, borderRadius: 10, background: '#fff', 
                            position: 'absolute', 
                            left: it.active ? 25 : 3, top: 3,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }} />
                        </div>
                      ) : (
                        <span style={{
                          fontSize: 14,
                          color: it.highlight ? FIT.cyan : '#64748B',
                          fontWeight: 700,
                        }}>
                          {it.value}
                        </span>
                      )}
                      {it.onClick && <Icon name="chevron" size={16} color="#475569" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', height: 58, borderRadius: 20, fontSize: 16, fontWeight: 800, marginTop: 12, 
              color: '#FF4D4D', border: '1px solid rgba(255,77,77,0.2)', background: 'rgba(255,77,77,0.05)',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1
            }}
          >
            {t.logout}
          </button>
        </div>
      </div>


      {/* Tweaks Modal Overlay */}
      {showTweaks && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: dark ? '#1E293B' : '#fff', 
            borderRadius: '32px 32px 0 0', padding: 24, paddingBottom: 40,
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <TweaksPanelContent onClose={() => setShowTweaks(false)} />
          </div>
        </div>
      )}

      <TabBar
        active="profile" onTab={onTab}
        labels={{ home: t.home, diary: t.diary, stats: t.stats, profile: t.profile }}
        dark={dark}
      />
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </Phone>
  );
}
