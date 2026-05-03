// 6-step onboarding quiz. Ported from design/screens-a.jsx (ScreenQuiz1..6).

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, Card, Chip, Button } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';
import { useProfile } from '@/stores/profile';
import type { Goal, ActivityLevel, Gender } from '@fit/shared-types';

interface QuizHeaderProps {
  step: number;
  title: string;
  onBack: () => void;
}

function QuizHeader({ step, title, onBack }: QuizHeaderProps) {
  return (
    <div style={{ padding: '16px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Orqaga"
          style={{
            width: 36, height: 36, borderRadius: 18, background: '#fff',
            boxShadow: FIT.shadowSm, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="back" size={18} color={FIT.text} strokeWidth={2} />
        </button>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: FIT.border, overflow: 'hidden' }}>
          <div style={{ width: `${(step / 6) * 100}%`, height: '100%', background: FIT.primary, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 700, fontFamily: FIT.mono }}>
          {step}/6
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>
        {title}
      </div>
    </div>
  );
}

export function QuizScreen() {
  const { step = '1' } = useParams();
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const stepNum = Math.max(1, Math.min(6, Number(step)));

  const setProfile = useProfile((s) => s.updateProfile);

  const next = () => {
    if (stepNum === 6) {
      setProfile({ hasCompletedQuiz: true });
      navigate('/');
    } else {
      navigate(`/quiz/${stepNum + 1}`);
    }
  };
  const back = () => (stepNum === 1 ? navigate('/register') : navigate(`/quiz/${stepNum - 1}`));

  return (
    <Phone dark={dark}>
      {stepNum === 1 && <Step1 onBack={back} onNext={next} />}
      {stepNum === 2 && <Step2 onBack={back} onNext={next} />}
      {stepNum === 3 && <Step3 onBack={back} onNext={next} />}
      {stepNum === 4 && <Step4 onBack={back} onNext={next} />}
      {stepNum === 5 && <Step5 onBack={back} onNext={next} />}
      {stepNum === 6 && <Step6 onBack={back} onNext={next} />}
    </Phone>
  );
}

function Step1({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const goal = useProfile((s) => s.goal);
  const updateProfile = useProfile((s) => s.updateProfile);

  const opts = [
    { id: 'lose' as Goal, icon: '🏃', title: 'Vazn kamaytirish', desc: "Sog'lom ozish" },
    { id: 'maintain' as Goal, icon: '⚖️', title: 'Vaznni tutib turish', desc: 'Hozirgi vaznda qolish' },
    { id: 'gain' as Goal, icon: '💪', title: 'Mushaklarni oshirish', desc: 'Massa va kuch ortishi' },
  ];
  return (
    <>
      <QuizHeader step={1} title="Sizning maqsadingiz nima?" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opts.map((o) => {
          const active = o.id === goal;
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => updateProfile({ goal: o.id })}
              style={{
                padding: 18, borderRadius: 18, background: '#fff',
                border: `2px solid ${active ? FIT.primary : FIT.border}`,
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: active ? `0 4px 20px ${FIT.primary}22` : FIT.shadowSm,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: active ? FIT.primarySoft : FIT.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>
                {o.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{o.title}</div>
                <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 2 }}>{o.desc}</div>
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
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full onClick={onNext}>Keyingi</Button>
        </div>
      </div>
    </>
  );
}

function Step2({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const profile = useProfile();
  const updateProfile = useProfile((s) => s.updateProfile);

  return (
    <>
      <QuizHeader step={2} title="Bo'y va vazningiz" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            display: 'flex', background: FIT.surfaceAlt, borderRadius: 10,
            padding: 3, fontSize: 12, fontWeight: 700,
          }}>
            <div style={{ padding: '6px 14px', borderRadius: 8, background: '#fff', boxShadow: FIT.shadowSm }}>
              Metric
            </div>
            <div style={{ padding: '6px 14px', color: FIT.textMuted }}>Imperial</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Card
            pad={20}
            style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              const val = window.prompt("Bo'yingizni kiriting (sm):", String(profile.height));
              if (val) updateProfile({ height: Number(val) });
            }}
          >
            <div style={{
              fontSize: 11, color: FIT.textMuted, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Bo&apos;y
            </div>
            <div style={{
              fontSize: 44, fontWeight: 800, fontFamily: FIT.mono,
              color: FIT.primary, letterSpacing: -1.5, marginTop: 8,
            }}>
              {profile.height}
            </div>
            <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600 }}>sm</div>
          </Card>
          <Card
            pad={20}
            style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              const val = window.prompt("Vazningizni kiriting (kg):", String(profile.weight));
              if (val) updateProfile({ weight: Number(val) });
            }}
          >
            <div style={{
              fontSize: 11, color: FIT.textMuted, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Vazn
            </div>
            <div style={{
              fontSize: 44, fontWeight: 800, fontFamily: FIT.mono,
              color: FIT.accent, letterSpacing: -1.5, marginTop: 8,
            }}>
              {profile.weight}
            </div>
            <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600 }}>kg</div>
          </Card>
        </div>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full onClick={onNext}>Keyingi</Button>
        </div>
      </div>
    </>
  );
}

function Step3({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const profile = useProfile();
  const updateProfile = useProfile((s) => s.updateProfile);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - 10 - i);
  const userYear = currentYear - profile.age;

  return (
    <>
      <QuizHeader step={3} title="Yosh va jinsingiz" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card pad={16}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 12,
          }}>
            <div style={{
              fontSize: 11, color: FIT.textMuted, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Tug&apos;ilgan yil
            </div>
            <button
              onClick={() => {
                const val = window.prompt("Tug'ilgan yilingizni kiriting (masalan, 1990):", String(userYear));
                if (val && !isNaN(Number(val))) updateProfile({ age: currentYear - Number(val) });
              }}
              style={{
                fontSize: 12, color: FIT.primary, fontWeight: 700,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              Yozish ✍️
            </button>
          </div>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            overflowX: 'auto', paddingBottom: 8,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {years.map((y) => {
              const isActive = y === userYear;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => updateProfile({ age: currentYear - y })}
                  style={{
                    fontSize: isActive ? 32 : 16,
                    fontWeight: isActive ? 800 : 500, fontFamily: FIT.mono,
                    color: isActive ? FIT.primary : FIT.textSubtle,
                    padding: '8px 12px', opacity: isActive ? 1 : 0.5,
                    background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: 70,
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { id: 'male' as Gender, icon: '👨', label: 'Erkak' },
            { id: 'female' as Gender, icon: '👩', label: 'Ayol' },
          ].map((g) => {
            const active = profile.gender === g.id;
            return (
              <button
                type="button"
                key={g.label}
                onClick={() => updateProfile({ gender: g.id })}
                style={{
                  flex: 1, padding: '24px 12px', borderRadius: 18, background: '#fff',
                  border: `2px solid ${active ? FIT.primary : FIT.border}`,
                  textAlign: 'center', boxShadow: active ? `0 4px 20px ${FIT.primary}22` : FIT.shadowSm,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 44 }}>{g.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{g.label}</div>
              </button>
            );
          })}
        </div>
        <div style={{
          fontSize: 12, color: FIT.textMuted, textAlign: 'center',
          lineHeight: 1.5, padding: '0 20px',
        }}>
          Bu ma&apos;lumot aniq kaloriya hisobi uchun kerak.
        </div>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full onClick={onNext}>Keyingi</Button>
        </div>
      </div>
    </>
  );
}

function Step4({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const profile = useProfile();
  const updateProfile = useProfile((s) => s.updateProfile);

  const opts = [
    { id: 'sedentary' as ActivityLevel, icon: '🚶', title: 'Yengil faol', desc: 'Light · 1-2 kun/hafta' },
    { id: 'moderate' as ActivityLevel, icon: '🏃', title: "O'rtacha", desc: 'Moderate · 3-5 kun/hafta' },
    { id: 'active' as ActivityLevel, icon: '💪', title: 'Faol', desc: 'Active · 6-7 kun/hafta' },
  ];
  return (
    <>
      <QuizHeader step={4} title="Qancha faolsiz?" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
        {opts.map((o) => {
          const active = o.id === profile.activityLevel;
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => updateProfile({ activityLevel: o.id })}
              style={{
                padding: 14, borderRadius: 14, background: '#fff',
                border: `2px solid ${active ? FIT.primary : FIT.border}`,
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: active ? FIT.primarySoft : FIT.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {o.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{o.title}</div>
                <div style={{ fontSize: 12, color: FIT.textMuted }}>{o.desc}</div>
              </div>
              {active && <Icon name="check" size={20} color={FIT.primary} strokeWidth={3} />}
            </button>
          );
        })}
        <div style={{ marginTop: 'auto', paddingTop: 12, paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full onClick={onNext}>Keyingi</Button>
        </div>
      </div>
    </>
  );
}

function Step5({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(['Halal', 'Lactose-free']));
  const tags = ['Halal', 'Vegetarian', 'Vegan', 'Lactose-free', 'Gluten-free', 'Keto', 'Low-carb', 'Diabetic', 'Hech narsa'];
  const toggle = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };
  return (
    <>
      <QuizHeader step={5} title="Ovqatlanish cheklovlari?" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginBottom: 16 }}>
          Bir nechtasini tanlashingiz mumkin
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tags.map((tag) => (
            <Chip key={tag} active={selected.has(tag)} size="md" onClick={() => toggle(tag)}>
              {tag}
            </Chip>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full onClick={onNext}>Keyingi</Button>
        </div>
      </div>
    </>
  );
}

function Step6({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const profile = useProfile();
  const updateProfile = useProfile((s) => s.updateProfile);

  // Mifflin-St Jeor Formula
  useEffect(() => {
    const { weight, height, age, gender, activityLevel, goal } = profile;
    
    // BMR calculation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    // Activity Multiplier
    const multipliers = {
      sedentary: 1.2,
      moderate: 1.55,
      active: 1.725
    };
    const tdee = bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.5);

    // Goal adjustment
    let targetKcal = Math.round(tdee);

    if (goal === 'lose') {
      targetKcal -= 500;
    } else if (goal === 'gain') {
      targetKcal += 500;
    }

    // Standard macros distribution (Protein: 30%, Carbs: 45%, Fat: 25%)
    const p = Math.round((targetKcal * 0.3) / 4);
    const c = Math.round((targetKcal * 0.45) / 4);
    const f = Math.round((targetKcal * 0.25) / 9);

    // Initial sync
    updateProfile({
      targetKcal,
      targetProtein: p,
      targetCarbs: c,
      targetFat: f
    });
  }, []);

  const targets = { 
    kcal: profile.targetKcal || 2000, 
    protein: profile.targetProtein || 150, 
    carbs: profile.targetCarbs || 200, 
    fat: profile.targetFat || 65 
  };

  const advice = profile.goal === 'lose' 
    ? "Vazn kamaytirish uchun kunlik 500 kkal kam iste'mol qilishni tavsiya qildik."
    : profile.goal === 'gain'
    ? "Mushak massasini oshirish uchun kunlik 500 kkal ko'proq iste'mol qilishni tavsiya qildik."
    : "Vazningizni me'yorda saqlash uchun ushbu miqdorni tavsiya qilamiz.";

  return (
    <>
      <QuizHeader step={6} title="Tayyor! 🎉" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 15, color: FIT.textMuted, lineHeight: 1.5 }}>
          Sizning profilingiz asosida kunlik maqsadingiz:
        </div>
        <Card
          pad={24}
          style={{
            background: `linear-gradient(135deg, ${FIT.primarySoft}, #fff)`,
            border: `1px solid ${FIT.primary}22`,
            cursor: 'pointer'
          }}
          onClick={() => {
            const val = window.prompt("Kunlik kaloriya maqsadini o'zgartirish:", String(targets.kcal));
            if (val) updateProfile({ targetKcal: Number(val) });
          }}
        >
          <div style={{
            fontSize: 12, color: FIT.primaryDark, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1,
            display: 'flex', justifyContent: 'space-between'
          }}>
            <span>Kunlik maqsad</span>
            <span style={{ fontSize: 14 }}>✍️</span>
          </div>
          <div style={{
            fontSize: 56, fontWeight: 800, fontFamily: FIT.mono,
            color: FIT.primaryDark, letterSpacing: -2, marginTop: 4,
          }}>
            {targets.kcal.toLocaleString()}
          </div>
          <div style={{ fontSize: 14, color: FIT.textMuted, fontWeight: 600, marginTop: -4 }}>
            kkal / kun
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {[
              { n: 'Oqsil', v: `${targets.protein}g`, c: FIT.protein, key: 'targetProtein' },
              { n: 'Uglevod', v: `${targets.carbs}g`, c: FIT.carbs, key: 'targetCarbs' },
              { n: "Yog'", v: `${targets.fat}g`, c: FIT.fat, key: 'targetFat' },
            ].map((m) => (
              <div 
                key={m.n} 
                style={{ flex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  const val = window.prompt(`${m.n} miqdorini o'zgartirish (g):`, m.v.replace('g', ''));
                  if (val) updateProfile({ [m.key]: Number(val) });
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: m.c }} />
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{m.n}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: FIT.mono, marginTop: 4 }}>
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card pad={16} style={{ background: FIT.accentSoft, border: 'none' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 20 }}>💡</div>
            <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
              {advice}
            </div>
          </div>
        </Card>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full onClick={onNext}>
            Ilovaga kirish →
          </Button>
        </div>
      </div>
    </>
  );
}
