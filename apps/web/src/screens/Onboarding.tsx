// Splash + 3 onboarding slides. Ported from design/screens-a.jsx.

import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Button, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

export function SplashScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();

  // Auto-navigate on tap (real app would use a timer)
  return (
    <Phone dark={dark} statusColor="#fff">
      <button
        type="button"
        onClick={() => navigate('/onboarding/1')}
        style={{
          flex: 1,
          background: `linear-gradient(160deg, ${FIT.primary} 0%, ${FIT.primaryDark} 100%)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
          border: 'none', cursor: 'pointer', width: '100%',
        }}
      >
        <div style={{
          width: 104, height: 104, borderRadius: 32,
          background: 'rgba(255,255,255,0.16)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="leaf" size={56} color="#fff" strokeWidth={2} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: -1.5 }}>
            FitAI
          </div>
          <div style={{
            fontSize: 14, color: 'rgba(255,255,255,0.85)',
            marginTop: 6, fontWeight: 500,
          }}>
            Sog&apos;lom ovqat — yaxshi hayot
          </div>
        </div>
      </button>
    </Phone>
  );
}

interface SlideProps {
  step: 1 | 2 | 3;
}

export function OnboardingScreen({ step }: SlideProps) {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();

  return (
    <Phone dark={dark}>
      <TopBar
        transparent
        right={
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              fontSize: 14, color: FIT.textMuted, fontWeight: 600,
              paddingRight: 8, background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            O&apos;tkazib yuborish
          </button>
        }
      />
      <div style={{
        flex: 1, padding: '12px 24px 20px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {step === 1 && <Slide1Art />}
          {step === 2 && <Slide2Art />}
          {step === 3 && <Slide3Art />}
        </div>

        <div style={{ marginTop: 24 }}>
          {step === 1 && (
            <>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>
                Minglab ovqatlar bazasidan tanlang
              </div>
              <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 10, lineHeight: 1.5 }}>
                O&apos;zbek milliy taomlari, xalqaro mahsulotlar va shtrix-kod orqali qidiring.
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>
                Ingredientlardan yig&apos;ing
              </div>
              <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 10, lineHeight: 1.5 }}>
                Taom nomini bilmasangiz — nimalardan tayyorlaganingizni qo&apos;shing, biz hisoblaymiz.
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>
                Vitamin yetishmovchiligidan himoyalaning
              </div>
              <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 10, lineHeight: 1.5 }}>
                Ilova sizni oldindan ogohlantiradi va tavsiyalar beradi.
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, margin: '24px 0 16px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 6,
                height: 6, borderRadius: 3,
                background: i === step ? FIT.primary : FIT.border,
              }}
            />
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          full
          onClick={() => {
            if (step === 3) navigate('/register');
            else navigate(`/onboarding/${step + 1}`);
          }}
        >
          {step === 3 ? 'Boshlash' : 'Keyingi'}
        </Button>
      </div>
    </Phone>
  );
}

function Slide1Art() {
  return (
    <div style={{
      width: 240, height: 300, background: FIT.primarySoft, borderRadius: 32,
      padding: 18, display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: FIT.primary, opacity: 0.15,
      }} />
      {[
        { e: '🍚', n: 'Osh', k: 420, tone: 'amber' as const },
        { e: '🥟', n: 'Manti', k: 380, tone: 'pink' as const },
        { e: '🥪', n: 'Somsa', k: 320, tone: 'amber' as const },
        { e: '🍎', n: 'Olma', k: 52, tone: 'red' as const },
        { e: '🥛', n: 'Sut', k: 120, tone: 'blue' as const },
      ].map((f) => (
        <div key={f.n} style={{
          display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
          padding: 8, borderRadius: 14, boxShadow: FIT.shadowSm,
          position: 'relative', zIndex: 1,
        }}>
          <FoodThumb emoji={f.e} tone={f.tone} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{f.n}</div>
            <div style={{ fontSize: 10, color: FIT.textMuted }}>1 porsiya</div>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, fontFamily: FIT.mono, color: FIT.primary,
          }}>
            {f.k}
          </div>
        </div>
      ))}
    </div>
  );
}

function Slide2Art() {
  return (
    <div style={{ position: 'relative', width: 260, height: 280 }}>
      <div style={{ position: 'absolute', top: 20, left: 10 }}>
        <FoodThumb emoji="🥚" tone="amber" size={68} />
      </div>
      <div style={{ position: 'absolute', top: 0, right: 30 }}>
        <FoodThumb emoji="🍅" tone="red" size={64} />
      </div>
      <div style={{ position: 'absolute', top: 70, right: 0 }}>
        <FoodThumb emoji="🌭" tone="pink" size={60} />
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 160, height: 160, borderRadius: 80,
        background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', color: '#fff', boxShadow: `0 16px 40px ${FIT.primary}44`,
      }}>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -1 }}>
          446
        </div>
        <div style={{ fontSize: 11, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          kkal
        </div>
      </div>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="260" height="280">
        <path d="M50 70 Q90 130 130 180" stroke={FIT.primary} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.4" />
        <path d="M210 40 Q170 110 130 180" stroke={FIT.primary} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.4" />
        <path d="M220 110 Q180 140 130 180" stroke={FIT.primary} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.4" />
      </svg>
    </div>
  );
}

function Slide3Art() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 110, height: 180, borderRadius: 20,
        background: `linear-gradient(180deg, ${FIT.primarySoft}, ${FIT.primary}33)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', color: FIT.primaryDark, padding: 12,
      }}>
        <div style={{ fontSize: 44 }}>😊</div>
        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6 }}>SALOMAT</div>
        <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4, opacity: 0.7 }}>
          Vitamin yetarli
        </div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 18, background: FIT.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="alert" size={20} color="#fff" strokeWidth={2.5} />
      </div>
      <div style={{
        width: 110, height: 180, borderRadius: 20, background: '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', color: FIT.textMuted, padding: 12,
        filter: 'grayscale(0.4)',
      }}>
        <div style={{ fontSize: 44, opacity: 0.6 }}>😔</div>
        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6 }}>YETISHMOVCHILIK</div>
        <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4, opacity: 0.7 }}>
          Charchoq, holsizlik
        </div>
      </div>
    </div>
  );
}
