// Design System screen — shows all tokens & components
function DesignSystemBoard({ t, dark }) {
  return (
    <div style={{ width: 1040, padding: 40, background: dark ? '#0F172A' : '#FAFAF9', fontFamily: FIT.sans, color: dark ? '#F8FAFC' : FIT.text }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="leaf" size={26} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8 }}>FitAI Design System</div>
            <div style={{ fontSize: 14, color: FIT.textMuted }}>Calorie & nutrition tracker · v1.0 · Light</div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <SectionTitle>Colors</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 40 }}>
        {[
          ['Primary', FIT.primary, '#10B981'],
          ['Primary Dk', FIT.primaryDark, '#059669'],
          ['Accent', FIT.accent, '#F59E0B'],
          ['Danger', FIT.danger, '#EF4444'],
          ['Protein', FIT.protein, '#8B5CF6'],
          ['Carbs', FIT.carbs, '#F59E0B'],
          ['Fat', FIT.fat, '#EC4899'],
          ['BG', FIT.bg, '#FAFAF9'],
          ['Surface', FIT.surface, '#FFFFFF'],
          ['Text', FIT.text, '#0F172A'],
          ['Muted', FIT.textMuted, '#64748B'],
          ['Border', FIT.border, '#E5E7EB'],
        ].map(([name, c, hex]) => (
          <div key={name}>
            <div style={{ height: 72, borderRadius: 12, background: c, border: `1px solid ${FIT.border}`, marginBottom: 6 }} />
            <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>{hex}</div>
          </div>
        ))}
      </div>

      {/* Type */}
      <SectionTitle>Typography</SectionTitle>
      <Card style={{ marginBottom: 40 }} pad={28}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, marginBottom: 4 }}>Sog'lom hayot</div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginBottom: 18 }}>Display · 32/40 · 800 · -0.02em</div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 }}>Bugungi taomlar</div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginBottom: 18 }}>H2 · 24/32 · 700</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Ingredient qo'shish</div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginBottom: 18 }}>H3 · 20/28 · 600</div>
        <div style={{ fontSize: 16, marginBottom: 4 }}>Ingredientlardan yig'ing — taom nomini bilmasangiz, nimalardan tayyorlaganingizni qo'shing.</div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginBottom: 18 }}>Body · 16/24 · 400</div>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: FIT.mono, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>2,150 <span style={{ fontSize: 14, color: FIT.textMuted }}>kkal</span></div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 4 }}>Mono · tabular numbers for stats</div>
      </Card>

      {/* Buttons */}
      <SectionTitle>Buttons</SectionTitle>
      <Card style={{ marginBottom: 24 }} pad={24}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <Button variant="primary">Kundaliga qo'shish</Button>
          <Button variant="secondary">Bekor qilish</Button>
          <Button variant="ghost">Ko'proq</Button>
          <Button variant="danger">O'chirish</Button>
          <Button variant="dark">Apple bilan kirish</Button>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      {/* Chips */}
      <SectionTitle>Chips & Pills</SectionTitle>
      <Card style={{ marginBottom: 24 }} pad={24}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Chip active>Nonushta</Chip>
          <Chip>Tushlik</Chip>
          <Chip>Kechki ovqat</Chip>
          <Chip>Gazak</Chip>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip active color={FIT.protein}>P · 32g</Chip>
          <Chip active color={FIT.carbs}>C · 45g</Chip>
          <Chip active color={FIT.fat}>F · 18g</Chip>
          <Chip>Halal</Chip>
          <Chip>Vegetarian</Chip>
          <Chip>Keto</Chip>
        </div>
      </Card>

      {/* Rings */}
      <SectionTitle>Progress</SectionTitle>
      <Card style={{ marginBottom: 24, display: 'flex', gap: 32, alignItems: 'center' }} pad={24}>
        <MultiRing size={140} rings={[
          { progress: 0.58, color: FIT.primary },
          { progress: 0.72, color: FIT.protein },
          { progress: 0.45, color: FIT.carbs },
          { progress: 0.68, color: FIT.fat },
        ]}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>1,240</div>
          <div style={{ fontSize: 10, color: FIT.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>kkal</div>
        </MultiRing>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Macro bar</div>
          <MacroBar p={42} c={60} f={28} h={10} />
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: 4, background: FIT.protein }}/>P 42g</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: 4, background: FIT.carbs }}/>C 60g</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: 4, background: FIT.fat }}/>F 28g</div>
          </div>
        </div>
      </Card>

      {/* Inputs + Cards */}
      <SectionTitle>Inputs & Cards</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card pad={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="EMAIL" value="aziz@fit.uz" />
            <Input label="PAROL" value="••••••••" type="password" right={<Icon name="eye" size={18} color={FIT.textMuted}/>} />
          </div>
        </Card>
        <Card pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <FoodThumb emoji="🍚" tone="amber" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Osh</div>
              <div style={{ fontSize: 12, color: FIT.textMuted }}>Milliy taom · 1 kosa</div>
            </div>
            <Stat value="420" unit="kkal" size="sm" />
          </div>
          <MacroBar p={22} c={60} f={28} />
        </Card>
      </div>

      {/* Icons */}
      <SectionTitle>Icons (24px · 1.5 stroke)</SectionTitle>
      <Card pad={20}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          {['home','diary','plus','stats','profile','search','bell','heart','flame','droplet','scale','leaf','edit','trash','settings','trophy','calendar','sparkle','alert','filter','globe','moon','sun','barcode'].map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon name={n} size={22} color={FIT.text}/>
              <span style={{ fontSize: 9, color: FIT.textMuted, fontFamily: FIT.mono }}>{n}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: FIT.textMuted, textTransform: 'uppercase',
      letterSpacing: 1.2, marginBottom: 12, fontFamily: FIT.mono,
    }}>{children}</div>
  );
}

Object.assign(window, { DesignSystemBoard });
