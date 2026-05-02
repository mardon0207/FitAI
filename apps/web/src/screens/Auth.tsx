import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, TopBar, Input, Button } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useT } from '@/stores/prefs';

export function LoginScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);
  
  const t = useT();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert(t.email + ' & ' + t.password);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        setAuth(data.session.access_token, data.user?.id || '');
        navigate('/');
      }
    } catch (err: any) {
      alert(err.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{
        flex: 1, padding: '8px 24px 20px',
        display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{t.welcomeBack}</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6 }}>{t.loginSub}</div>
        </div>
        <Input
          label={t.email.toUpperCase()}
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="email@example.com"
          leading={<Icon name="chat" size={18} color={FIT.textMuted} />}
        />
        <div>
          <Input
            label={t.password.toUpperCase()}
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="••••••••"
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
            {t.forgot}
          </button>
        </div>
        <Button 
          variant="primary" size="lg" full 
          onClick={handleLogin}
          loading={loading}
        >
          {t.loginAction}
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: FIT.border }} />
          <span style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600 }}>{t.or}</span>
          <div style={{ flex: 1, height: 1, background: FIT.border }} />
        </div>
        <Button variant="dark" size="lg" full leading={<span style={{ fontSize: 18 }}>􀣺</span>}>
          {t.appleLogin}
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
          {t.googleLogin}
        </Button>
        <div style={{
          textAlign: 'center', fontSize: 14, color: FIT.textMuted, marginTop: 'auto',
        }}>
          {t.noAccount}{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              color: FIT.primary, fontWeight: 700, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, font: 'inherit',
            }}
          >
            {t.registerAction}
          </button>
        </div>
      </div>
    </Phone>
  );
}

export function RegisterScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const navigate = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);

  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) return alert(t.all);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
      if (error) throw error;
      if (data.session) {
        setAuth(data.session.access_token, data.user?.id || '');
        navigate('/quiz/1');
      } else {
        alert(t.checkEmail);
        navigate('/login');
      }
    } catch (err: any) {
      alert(err.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate(-1)} transparent />
      <div style={{
        flex: 1, padding: '8px 24px 20px',
        display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{t.hello} 👋</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6 }}>{t.createAccount}</div>
        </div>
        <Input label={t.name.toUpperCase()} value={name} onChange={setName} placeholder={t.name} />
        <Input label={t.email.toUpperCase()} value={email} onChange={setEmail} type="email" placeholder="email@example.com" />
        <div>
          <Input
            label={t.password.toUpperCase()}
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="••••••••"
            right={<Icon name="eye" size={18} color={FIT.textMuted} />}
          />
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {[FIT.primary, FIT.primary, FIT.primary, FIT.border].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: c }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: FIT.primary, marginTop: 4, fontWeight: 600 }}>
            {t.strongPassword}
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
            {t.termsAgreement}
          </div>
        </div>
        <Button 
          variant="primary" size="lg" full 
          onClick={handleRegister}
          loading={loading}
        >
          {t.registerAction}
        </Button>
        <div style={{ textAlign: 'center', fontSize: 14, color: FIT.textMuted, marginTop: 'auto' }}>
          {t.haveAccount}{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              color: FIT.primary, fontWeight: 700, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, font: 'inherit',
            }}
          >
            {t.loginAction}
          </button>
        </div>
      </div>
    </Phone>
  );
}


export function ForgotScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const t = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return alert(t.email);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      alert(t.checkEmail);
    } catch (err: any) {
      alert(err.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{t.resetPassword}</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            {t.forgotSub.replace('{email}', t.email.toLowerCase())}
          </div>
        </div>
        <Input
          label={t.email.toUpperCase()} value={email} onChange={setEmail} type="email"
          leading={<Icon name="chat" size={18} color={FIT.textMuted} />}
        />
        <Button 
          variant="primary" size="lg" full 
          onClick={handleReset}
          loading={loading}
        >
          {t.sendLink}
        </Button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            textAlign: 'center', fontSize: 14, color: FIT.primary, fontWeight: 700,
            marginTop: 'auto', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          ← {t.signin}
        </button>
      </div>
    </Phone>
  );
}

export function ResetPasswordScreen() {
  const dark = usePrefs((s) => s.theme === 'dark');
  const t = useT();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password) return alert(t.password);
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert(t.passwordUpdated);
      navigate('/login');
    } catch (err: any) {
      alert(err.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Phone dark={dark}>
      <TopBar back onBack={() => navigate('/login')} transparent />
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
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{t.newPassword}</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            {t.enterNewPasswordSub}
          </div>
        </div>
        <Input
          label={t.password.toUpperCase()}
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="••••••••"
          leading={<Icon name="lock" size={18} color={FIT.textMuted} />}
        />
        <Button 
          variant="primary" size="lg" full 
          onClick={handleUpdatePassword}
          loading={loading}
        >
          {t.save}
        </Button>
      </div>
    </Phone>
  );
}

