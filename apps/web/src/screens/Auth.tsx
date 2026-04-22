// Auth screens: Login, Register, Forgot password.
// Ported from design/screens-a.jsx (ScreenLogin / ScreenRegister / ScreenForgot).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Input, Button } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

export function LoginScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [email, setEmail] = useState('aziz@fit.uz');
  const [password, setPassword] = useState('••••••••');

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{
        flex: 1, padding: '8px 24px 20px',
        display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Qaytib keldingizmi?</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6 }}>Hisobingizga kiring</div>
        </div>
        <Input
          label="EMAIL"
          value={email}
          onChange={setEmail}
          type="email"
          leading={<Icon name="chat" size={18} color={FIT.textMuted} />}
        />
        <div>
          <Input
            label="PAROL"
            value={password}
            onChange={setPassword}
            type="password"
            leading={<Icon name="lock" size={18} color={FIT.textMuted} />}
            right={<Icon name="eye" size={18} color={FIT.textMuted} />}
          />
          <button
            type="button"
            onClick={() => navigate('/forgot')}
            style={{
              display: 'block', marginLeft: 'auto', marginTop: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: FIT.primary, fontWeight: 600,
            }}
          >
            Parolni unutdingizmi?
          </button>
        </div>
        <Button variant="primary" size="lg" full onClick={() => navigate('/')}>Kirish</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: FIT.border }} />
          <span style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600 }}>YOKI</span>
          <div style={{ flex: 1, height: 1, background: FIT.border }} />
        </div>
        <Button variant="dark" size="lg" full leading={<span style={{ fontSize: 18 }}>􀣺</span>}>
          Apple bilan kirish
        </Button>
        <Button
          variant="white" size="lg" full
          leading={
            <div style={{
              width: 20, height: 20, borderRadius: 10,
              background: 'conic-gradient(from 0deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4)',
            }} />
          }
        >
          Google bilan kirish
        </Button>
        <div style={{
          textAlign: 'center', fontSize: 14, color: FIT.textMuted, marginTop: 'auto',
        }}>
          Hisobingiz yo&apos;qmi?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              color: FIT.primary, fontWeight: 700, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, font: 'inherit',
            }}
          >
            Ro&apos;yxatdan o&apos;ting
          </button>
        </div>
      </div>
    </Phone>
  );
}

export function RegisterScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [name, setName] = useState('Aziz Karimov');
  const [email, setEmail] = useState('aziz@fit.uz');
  const [password, setPassword] = useState('••••••••••');

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{
        flex: 1, padding: '8px 24px 20px',
        display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Salom! 👋</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6 }}>Yangi hisob yarating</div>
        </div>
        <Input label="ISM" value={name} onChange={setName} />
        <Input label="EMAIL" value={email} onChange={setEmail} type="email" />
        <div>
          <Input
            label="PAROL"
            value={password}
            onChange={setPassword}
            type="password"
            right={<Icon name="eye" size={18} color={FIT.textMuted} />}
          />
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {[FIT.primary, FIT.primary, FIT.primary, FIT.border].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: c }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: FIT.primary, marginTop: 4, fontWeight: 600 }}>
            Kuchli parol
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 4 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, background: FIT.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="check" size={14} color="#fff" strokeWidth={3} />
          </div>
          <div style={{ fontSize: 13, color: FIT.text, lineHeight: 1.5 }}>
            Foydalanish shartlariga va maxfiylik siyosatiga roziman
          </div>
        </div>
        <Button variant="primary" size="lg" full onClick={() => navigate('/quiz/1')}>
          Ro&apos;yxatdan o&apos;tish
        </Button>
        <div style={{ textAlign: 'center', fontSize: 14, color: FIT.textMuted, marginTop: 'auto' }}>
          Hisobingiz bormi?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              color: FIT.primary, fontWeight: 700, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, font: 'inherit',
            }}
          >
            Kiring
          </button>
        </div>
      </div>
    </Phone>
  );
}

export function ForgotScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const [email, setEmail] = useState('aziz@fit.uz');

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{
        flex: 1, padding: '8px 24px 20px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, background: FIT.primarySoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="lock" size={32} color={FIT.primary} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Parolni tiklash</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            Email kiriting, biz sizga parol tiklash havolasini yuboramiz.
          </div>
        </div>
        <Input
          label="EMAIL" value={email} onChange={setEmail} type="email"
          leading={<Icon name="chat" size={18} color={FIT.textMuted} />}
        />
        <Button variant="primary" size="lg" full>Link yuborish</Button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            textAlign: 'center', fontSize: 14, color: FIT.primary, fontWeight: 700,
            marginTop: 'auto', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          ← Kirishga qaytish
        </button>
      </div>
    </Phone>
  );
}
