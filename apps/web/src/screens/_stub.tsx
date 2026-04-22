// Stub screen — shared placeholder for not-yet-ported designs.
// The cheap model replaces these by porting from design/screens-a/b/c.jsx.

import { Phone, TopBar, Button, Card } from '@/design/primitives';
import { useNavigate } from 'react-router-dom';
import { FIT } from '@/design/tokens';
import { usePrefs } from '@/stores/prefs';

export function StubScreen({ title, sourceFile, sourceFn }: { title: string; sourceFile: string; sourceFn: string }) {
  const navigate = useNavigate();
  const dark = usePrefs((s) => s.theme === 'dark');
  return (
    <Phone dark={dark}>
      <TopBar title={title} back onBack={() => navigate(-1)} transparent />
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card pad={20}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            Bu ekran hali portlanmagan
          </div>
          <div style={{ fontSize: 13, color: FIT.textMuted, lineHeight: 1.6, marginBottom: 12 }}>
            Dizayn manba: <code style={{ background: FIT.surfaceAlt, padding: '2px 6px', borderRadius: 4 }}>design/{sourceFile}</code>
            {' → '}
            <code style={{ background: FIT.surfaceAlt, padding: '2px 6px', borderRadius: 4 }}>{sourceFn}</code>
          </div>
          <div style={{ fontSize: 12, color: FIT.textSubtle, lineHeight: 1.6 }}>
            Keyingi qadam: <code>design/{sourceFile}</code> dagi <code>{sourceFn}</code> funksiyasini oching va
            uning inline stilini o&apos;zgartirmasdan <code>src/screens/</code> papkasiga TSX sifatida ko&apos;chiring.
            {' '}<code>Phone</code>, <code>TopBar</code>, <code>Card</code>, <code>Button</code>, <code>Chip</code>,
            {' '}<code>Icon</code>, <code>FoodThumb</code>, <code>MultiRing</code> komponentlari allaqachon mavjud.
          </div>
        </Card>
        <Button variant="primary" full onClick={() => navigate('/')}>Bosh sahifaga qaytish</Button>
      </div>
    </Phone>
  );
}
