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
        { icon: 'calendar', name: t.today, value: profile.birthDate || t.notConnected, onClick: () => {
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
    <Phone dark={dark}>
      <TopBar 
        title={t.profile} transparent 
        right={
          <button 
            onClick={() => setShowTweaks(true)}
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Icon name="settings" size={22} color={FIT.text} />
          </button>
        } 
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 100px' }}>
        <Card pad={20} style={{ margin: '16px 0 24px', background: 'transparent', border: 'none' }}>
           <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
             <div style={{ position: 'relative' }}>
               <div style={{
                 width: 84, height: 84, borderRadius: 32,
                 background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 color: '#fff', fontSize: 28, fontWeight: 900,
                 boxShadow: `0 10px 25px ${FIT.primary}44`,
               }}>
                 {(profile.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
               </div>
               <button onClick={handleEditProfile} style={{
                 position: 'absolute', bottom: -4, right: -4,
                 width: 28, height: 28, borderRadius: 10, background: '#fff',
                 border: `1px solid ${FIT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                 cursor: 'pointer', boxShadow: FIT.shadowSm
               }}>
                  <Icon name="edit" size={14} color={FIT.primary} />
               </button>
             </div>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: 22, fontWeight: 900, color: FIT.text, letterSpacing: -0.5 }}>
                 {profile.name || 'Admin'}
               </div>
               <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600, marginTop: 2 }}>
                 {profile.email || 'Email...'}
               </div>
               <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                   <span style={{ fontSize: 14 }}>🔥</span>
                   <span style={{ fontSize: 13, fontWeight: 800, color: FIT.text }}>{streak} {t.days}</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                   <span style={{ fontSize: 14 }}>🍽️</span>
                   <span style={{ fontSize: 13, fontWeight: 800, color: FIT.text }}>{totalMeals.toLocaleString()} {t.meals}</span>
                 </div>
               </div>
             </div>
           </div>
        </Card>

        <Card pad={20} style={{ 
          background: dark ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', 
          border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#E2E8F0'}`,
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
             <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{t.goalWeight}</div>
             <Icon name="trophy" size={16} color={FIT.primary} />
           </div>
           <div style={{ fontSize: 18, fontWeight: 900, color: FIT.text }}>
             {profile.goal === 'lose' ? t.goal_lose : profile.goal === 'gain' ? t.goal_gain : t.goal_maintain}
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
              <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600 }}>
                {profile.weight}kg → {profile.goal === 'lose' ? profile.weight - 5 : profile.goal === 'gain' ? profile.weight + 5 : profile.weight}kg
              </div>
              <div style={{ fontSize: 13, color: FIT.primary, fontWeight: 800 }}>
                {profile.targetKcal.toLocaleString()} {t.targetKcal}
              </div>
           </div>

           <div style={{ height: 8, background: dark ? 'rgba(255,255,255,0.05)' : '#E2E8F0', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', background: `linear-gradient(90deg, ${FIT.primary}, ${FIT.accent})`, borderRadius: 4 }} />
           </div>
        </Card>

        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
              {s.title}
            </div>
            <div style={{ 
              background: dark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: 24, overflow: 'hidden',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`,
              boxShadow: FIT.shadowSm
            }}>
              {s.items.map((it, i) => (
                <div
                  key={it.name}
                  onClick={it.onClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', width: '100%', background: 'transparent',
                    border: 'none', cursor: it.onClick ? 'pointer' : 'default', textAlign: 'left',
                    borderBottom: i < s.items.length - 1 ? `1px solid ${dark ? 'rgba(255,255,255,0.03)' : '#F1F5F9'}` : 'none',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 12,
                    background: dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={it.icon} size={18} color={it.highlight ? FIT.primary : FIT.textMuted} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, flex: 1, color: FIT.text }}>
                    {it.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {it.toggle ? (
                      <div 
                        onClick={(e) => { e.stopPropagation(); it.onClick?.(); }}
                        style={{ 
                          width: 44, height: 24, borderRadius: 12, 
                          background: it.active ? FIT.primary : (dark ? '#334155' : '#E2E8F0'), 
                          position: 'relative', cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ 
                          width: 18, height: 18, borderRadius: 9, background: '#fff', 
                          position: 'absolute', 
                          left: it.active ? 24 : 3, top: 3,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} />
                      </div>
                    ) : (
                      <span style={{
                        fontSize: 13,
                        color: it.highlight ? FIT.primary : FIT.textMuted,
                        fontWeight: 700,
                      }}>
                        {it.value}
                      </span>
                    )}
                    {it.onClick && <Icon name="chevron" size={14} color={FIT.textSubtle} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={handleLogout}
          style={{ 
            width: '100%', height: 54, borderRadius: 18, fontSize: 15, fontWeight: 800, marginTop: 12, 
            color: FIT.danger, border: 'none', background: dark ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
            cursor: 'pointer'
          }}
        >
          {t.logout}
        </button>
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
