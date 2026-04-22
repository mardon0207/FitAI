// Screens B: Home, Food Search, Ingredient Composer, Barcode, Manual, Diary, Food Detail

// ─── HOME DASHBOARD ────────────────────────────────────
function ScreenHome({ dark }) {
  return (
    <Phone dark={dark} height={812}>
      <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 500 }}>Seshanba, 20 Aprel</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>Xayrli tong, Aziz 👋</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#fff', boxShadow: FIT.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Icon name="bell" size={20} color={FIT.text}/>
          <div style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, background: FIT.danger, border: '2px solid #fff' }}/>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 16px' }}>
        {/* Calorie hero */}
        <Card pad={24} style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 12 }}>
          <MultiRing size={150} rings={[
            { progress: 0.58, color: FIT.primary },
            { progress: 0.72, color: FIT.protein },
            { progress: 0.45, color: FIT.carbs },
            { progress: 0.68, color: FIT.fat },
          ]}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>1,240</div>
            <div style={{ fontSize: 10, color: FIT.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>/ 2,150</div>
          </MultiRing>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>QOLGAN</div>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -0.5 }}>910 <span style={{ fontSize: 12, color: FIT.textMuted }}>kkal</span></div>
            </div>
            {[
              { n: 'Oqsil', v: '82/145g', c: FIT.protein, p: 0.56 },
              { n: 'Uglevod', v: '108/240g', c: FIT.carbs, p: 0.45 },
              { n: 'Yog\'', v: '44/65g', c: FIT.fat, p: 0.67 },
            ].map(m => (
              <div key={m.n}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: FIT.textMuted, fontWeight: 600 }}>{m.n}</span>
                  <span style={{ fontFamily: FIT.mono, fontWeight: 600 }}>{m.v}</span>
                </div>
                <div style={{ height: 4, background: m.c + '22', borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${m.p*100}%`, background: m.c, borderRadius: 2 }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick stats 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { icon: '🚶', label: 'Qadamlar', v: '6,842', u: '/ 10,000', p: 0.68, c: FIT.primary },
            { icon: '💧', label: 'Suv', v: '5', u: '/ 8 stakan', p: 0.625, c: '#3B82F6' },
            { icon: '🔥', label: 'Sarflangan', v: '2,103', u: 'kkal', c: FIT.accent },
            { icon: '⚖️', label: 'Vazn', v: '72.3', u: 'kg ↓ 0.2', c: FIT.protein },
          ].map((s, i) => (
            <Card key={i} pad={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{s.label}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>{s.v}</span>
                <span style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600 }}>{s.u}</span>
              </div>
              {s.p && <div style={{ height: 4, background: s.c + '22', borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: 4, width: `${s.p*100}%`, background: s.c, borderRadius: 2 }}/>
              </div>}
            </Card>
          ))}
        </div>

        {/* Meals */}
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Bugungi taomlar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {[
            { n: 'Nonushta', t: '08:00', k: 420, tar: 538, items: [{e:'🍳',n:'Tuxum omlet'},{e:'🍞',n:'Non'}] },
            { n: 'Tushlik', t: '13:30', k: 680, tar: 860, items: [{e:'🍚',n:'Osh'},{e:'🥗',n:'Sabzi salati'}] },
            { n: 'Kechki ovqat', t: '~19:00', k: 0, tar: 538, empty: true },
          ].map((m, i) => (
            <Card key={i} pad={14}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: m.empty ? 0 : 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{m.n} <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 500 }}>{m.t}</span></div>
                  <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 2 }}>{m.k} / {m.tar} kkal</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: FIT.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="plus" size={18} color={FIT.primary} strokeWidth={2.5}/>
                </div>
              </div>
              {m.empty ? (
                <div style={{ border: `1.5px dashed ${FIT.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: FIT.textMuted, textAlign: 'center', marginTop: 8 }}>+ Ovqat qo'shing</div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  {m.items.map((it, j) => (
                    <div key={j} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: FIT.surfaceAlt, padding: 6, borderRadius: 8 }}>
                      <span style={{ fontSize: 16 }}>{it.e}</span>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{it.n}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Micronutrients */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Mikroelementlar</div>
          <div style={{ fontSize: 12, color: FIT.primary, fontWeight: 700 }}>Hammasini →</div>
        </div>
        <div style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 4, marginBottom: 16 }}>
          {[
            { n: 'Vit C', v: '84%', c: FIT.primary },
            { n: 'Temir', v: '32%', c: FIT.danger, warn: true },
            { n: 'B12', v: '45%', c: FIT.danger, warn: true },
            { n: 'Kalsiy', v: '72%', c: FIT.primary },
            { n: 'Vit D', v: '58%', c: FIT.accent },
          ].map(m => (
            <div key={m.n} style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 10, background: m.warn ? FIT.dangerSoft : FIT.surface, border: `1px solid ${m.warn ? FIT.danger+'33' : FIT.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{m.n}</span>
              <span style={{ fontSize: 12, fontFamily: FIT.mono, fontWeight: 700, color: m.c }}>{m.v}</span>
              {m.warn && <Icon name="alert" size={12} color={FIT.danger}/>}
            </div>
          ))}
        </div>

        {/* AI tip */}
        <Card pad={16} style={{ background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`, border: 'none' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24 }}>💡</div>
            <div>
              <div style={{ fontSize: 12, color: FIT.primaryDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>TAVSIYA</div>
              <div style={{ fontSize: 13, color: FIT.text, fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>Bugun oqsil yetmayapti. Tovuq yoki no'xat qo'shing.</div>
            </div>
          </div>
        </Card>
      </div>
      <TabBar active="home" t={I18N.uz}/>
    </Phone>
  );
}

// ─── FOOD SEARCH ────────────────────────────────────────
function ScreenSearch({ dark }) {
  const results = [
    { e:'🥚', n:'Tuxum (qaynatilgan)', d:'1 dona · 50g', k:78, p:6, c:0, f:5, tone:'amber' },
    { e:'🍳', n:'Tuxum omlet', d:'Milliy · 2 tuxum', k:220, p:14, c:2, f:17, tone:'amber' },
    { e:'🥮', n:'Tuxumli chuchvara', d:'Milliy taom · 1 porsiya', k:340, p:15, c:42, f:12, tone:'amber' },
    { e:'🌮', n:'Tuxum butterbrod', d:'Xalqaro · 1 dona', k:285, p:12, c:28, f:14, tone:'amber' },
    { e:'🥚', n:'Tovuq tuxumi (xom)', d:'1 dona · 55g', k:72, p:6, c:0, f:5, tone:'amber' },
  ];
  return (
    <Phone dark={dark} height={812}>
      <TopBar back title="Ovqat qidirish" transparent/>
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ height: 52, borderRadius: 14, background: '#fff', boxShadow: FIT.shadowSm, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, border: `1px solid ${FIT.border}` }}>
          <Icon name="search" size={20} color={FIT.textMuted}/>
          <input readOnly value="tuxum" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: FIT.sans, background: 'transparent' }}/>
          <Icon name="mic" size={18} color={FIT.primary}/>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, overflow: 'auto' }}>
          {['Nonushta', 'Tushlik', 'Kechki ovqat', 'Gazak'].map((m, i) => (
            <Chip key={m} active={i===0} size="sm">{m}</Chip>
          ))}
        </div>
      </div>
      <div style={{ padding: '4px 20px 8px', display: 'flex', gap: 6, overflow: 'auto' }}>
        {[
          {i:'🔥',n:'Yaqinlar',a:true},
          {i:'⭐',n:'Sevimli'},
          {i:'🍽',n:'Milliy'},
          {i:'🌍',n:'Xalqaro'},
          {i:'📦',n:'Brendlar'},
          {i:'🧾',n:'Mening'},
        ].map((t, i) => (
          <Chip key={i} active={t.a} size="sm" leading={<span>{t.i}</span>}>{t.n}</Chip>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px' }}>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>5 natija · "tuxum"</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 12, background: '#fff', borderRadius: 14, alignItems: 'center', border: `1px solid ${FIT.border}` }}>
              <FoodThumb emoji={r.e} tone={r.tone}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{r.n}</div>
                <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>{r.d}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 10, fontFamily: FIT.mono }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 5, height: 5, borderRadius: 3, background: FIT.protein }}/>P{r.p}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 5, height: 5, borderRadius: 3, background: FIT.carbs }}/>C{r.c}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 5, height: 5, borderRadius: 3, background: FIT.fat }}/>F{r.f}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 17, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -0.5 }}>{r.k}</div>
                <div style={{ fontSize: 9, color: FIT.textMuted, fontWeight: 600 }}>kkal</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '20px 0 8px' }}>Boshqa yo'llar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { i: '🧩', n: 'Ingredientlardan yig\'ish', d: 'Taom nomini bilmasangiz', c: FIT.primary },
            { i: '📊', n: 'Shtrix-kod skaneri', d: 'Mahsulot qadog\'idan o\'qish', c: FIT.accent },
            { i: '✏️', n: 'Qo\'lda qo\'shish', d: 'Yangi taom yaratish', c: FIT.protein },
          ].map((o, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: '#fff', borderRadius: 14, alignItems: 'center', border: `1px solid ${FIT.border}` }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: o.c + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{o.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{o.n}</div>
                <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>{o.d}</div>
              </div>
              <Icon name="chevron" size={18} color={FIT.textSubtle}/>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ─── INGREDIENT COMPOSER (HERO FEATURE) ──────────────────
function ScreenComposer({ dark }) {
  const ings = [
    { e:'🌭', n:'Mol kolbasa', d:'Mol go\'shtidan', q:2, u:'dona', g:'~120g', method:'Qovurilgan', k:280, oil:true, tone:'pink' },
    { e:'🥚', n:'Tuxum', d:'Tovuq tuxumi', q:2, u:'dona', g:'~100g', method:'Qaynatilgan', k:155, tone:'amber' },
    { e:'🍅', n:'Pomidor', d:'Pishgan', q:0.5, u:'dona', g:'~60g', method:'Xom', k:11, tone:'red' },
  ];
  return (
    <Phone dark={dark} height={812}>
      <TopBar back title="Ingredientlardan yig'ish" subtitle="3 ta ingredient · 446 kkal" transparent right={<Icon name="settings" size={20} color={FIT.textMuted}/>}/>
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ height: 44, borderRadius: 12, background: '#fff', border: `1px solid ${FIT.border}`, display: 'flex', alignItems: 'center', padding: '0 14px' }}>
          <input readOnly value="Nonushta · meniki #1" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: FIT.sans, fontWeight: 600, background: 'transparent' }}/>
          <span style={{ fontSize: 12, color: FIT.textMuted, fontFamily: FIT.mono }}>08:42</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {['Nonushta', 'Tushlik', 'Kechki', 'Gazak'].map((m, i) => (
            <Chip key={m} active={i===0} size="sm">{m}</Chip>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 200px' }}>
        {ings.map((ing, i) => (
          <Card key={i} pad={14} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <FoodThumb emoji={ing.e} tone={ing.tone} size={44}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{ing.n}</div>
                    <div style={{ fontSize: 11, color: FIT.textMuted }}>{ing.d} · {ing.g}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary }}>{ing.k}</div>
                    <div style={{ fontSize: 9, color: FIT.textMuted }}>kkal</div>
                  </div>
                </div>
                {/* stepper */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: FIT.surfaceAlt, borderRadius: 10, padding: 3 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: FIT.shadowSm, fontSize: 14, fontWeight: 700, color: FIT.text }}>−</div>
                    <div style={{ width: 34, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: FIT.mono }}>{ing.q}</div>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: FIT.shadowSm, fontSize: 14, fontWeight: 700, color: FIT.primary }}>+</div>
                  </div>
                  <div style={{ height: 32, padding: '0 10px', borderRadius: 10, background: FIT.surfaceAlt, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                    {ing.u} <Icon name="chevronDown" size={12} color={FIT.textMuted}/>
                  </div>
                </div>
                {/* method chips */}
                <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
                  {['Xom','Qaynatilgan','Qovurilgan','Pishirilgan'].map(mm => (
                    <div key={mm} style={{ padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: ing.method===mm?FIT.primary:FIT.surfaceAlt, color: ing.method===mm?'#fff':FIT.textMuted }}>{mm}</div>
                  ))}
                </div>
                {ing.oil && (
                  <div style={{ marginTop: 10, padding: '8px 10px', background: FIT.accentSoft, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🛢️</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>Qo'shilgan yog'</span>
                    <div style={{ flex: 1, height: 4, background: '#F59E0B33', borderRadius: 2, margin: '0 6px' }}>
                      <div style={{ width: '40%', height: '100%', background: FIT.accent, borderRadius: 2 }}/>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: FIT.mono, color: '#92400E' }}>10 ml</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {/* add ingredient card */}
        <div style={{ padding: 16, border: `1.5px dashed ${FIT.primary}66`, background: FIT.primarySoft + '66', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={20} color="#fff" strokeWidth={2.5}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: FIT.primaryDark }}>Ingredient qo'shish</div>
            <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>Osh qoshiq, dona, gram — istalgan birlik</div>
          </div>
        </div>
      </div>

      {/* Sticky total */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${FIT.border}`, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>JAMI</div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -1 }}>446 <span style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 500 }}>kkal</span></div>
          </div>
          <div style={{ flex: 1 }}>
            <MacroBar p={32} c={5} f={34}/>
            <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, fontFamily: FIT.mono, fontWeight: 600 }}>
              <span style={{ color: FIT.protein }}>P 32g</span>
              <span style={{ color: FIT.carbs }}>C 5g</span>
              <span style={{ color: FIT.fat }}>F 34g</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: FIT.textMuted, marginBottom: 10, fontFamily: FIT.mono }}>Fe 18% · VitC 12% · B12 45% · Ca 8% · ▾</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="md" full>Shablon saqlash</Button>
          <Button variant="primary" size="md" full>Kundaliga qo'shish</Button>
        </div>
      </div>
    </Phone>
  );
}

// ─── BARCODE + MANUAL ──────────────────────────────────
function ScreenBarcode({ dark }) {
  return (
    <Phone dark={true} height={720}>
      <div style={{ flex: 1, background: '#000', position: 'relative', overflow: 'hidden' }}>
        {/* Faux camera bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #334155 0%, #0F172A 100%)' }}/>
        {/* top bar */}
        <div style={{ position: 'absolute', top: 50, left: 0, right: 0, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={20} color="#fff" strokeWidth={2.5}/>
          </div>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Shtrix-kod</div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="flash" size={20} color="#F59E0B" strokeWidth={2}/>
          </div>
        </div>
        {/* scan frame */}
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translateX(-50%)', width: 240, height: 160 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTop: '3px solid #10B981', borderLeft: '3px solid #10B981', borderTopLeftRadius: 12 }}/>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTop: '3px solid #10B981', borderRight: '3px solid #10B981', borderTopRightRadius: 12 }}/>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottom: '3px solid #10B981', borderLeft: '3px solid #10B981', borderBottomLeftRadius: 12 }}/>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottom: '3px solid #10B981', borderRight: '3px solid #10B981', borderBottomRightRadius: 12 }}/>
          <div style={{ position: 'absolute', top: '50%', left: 10, right: 10, height: 2, background: FIT.danger, boxShadow: `0 0 12px ${FIT.danger}` }}/>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 2 }}>
            {[2,1,3,1,2,4,1,2,1,3,2,1,3,1,2,3,1,2].map((w,i) => (
              <div key={i} style={{ width: w, height: 80, background: '#fff', opacity: 0.3 }}/>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 180, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 13 }}>
          <div style={{ fontWeight: 600 }}>Shtrix-kodni ramka ichiga joylashtiring</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>OpenFoodFacts bazasidan</div>
        </div>
        {/* Preview sheet peeking */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '16px 20px 24px' }}>
          <div style={{ width: 36, height: 4, background: FIT.border, borderRadius: 2, margin: '0 auto 12px' }}/>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <FoodThumb emoji="🥛" tone="blue" size={52}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Sut 2.5% · Nestle</div>
              <div style={{ fontSize: 11, color: FIT.textMuted }}>1 stakan (200ml) · 120 kkal</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 10, fontFamily: FIT.mono, marginTop: 4, fontWeight: 600 }}>
                <span style={{ color: FIT.protein }}>P 7g</span>
                <span style={{ color: FIT.carbs }}>C 9g</span>
                <span style={{ color: FIT.fat }}>F 5g</span>
              </div>
            </div>
            <Button size="sm" variant="primary">Qo'shish</Button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function ScreenManual({ dark }) {
  return (
    <Phone dark={dark} height={812}>
      <TopBar back title="Qo'lda qo'shish" transparent/>
      <div style={{ flex: 1, padding: '0 20px 20px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginBottom: 4 }}>Bu ovqat bazada yo'q bo'lsa, o'zingiz qo'shing</div>
        <Input label="NOMI" value="Buvimning palovi"/>
        <Input label="BRAND / MANBA (ixtiyoriy)" value="Uy ovqati"/>
        <Card pad={14}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>PORSIYA</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, height: 48, borderRadius: 10, border: `1px solid ${FIT.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: FIT.mono, fontWeight: 700, fontSize: 15 }}>250</div>
            <div style={{ width: 100, height: 48, borderRadius: 10, border: `1px solid ${FIT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 14, fontWeight: 600 }}>
              kosa <Icon name="chevronDown" size={14} color={FIT.textMuted}/>
            </div>
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 8 }}>1 kosa = 250g</div>
        </Card>
        <Card pad={14}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>OZIQLIK (porsiya uchun)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { l: 'Kaloriya', v: '420', u: 'kkal', c: FIT.primary },
              { l: 'Oqsil', v: '22', u: 'g', c: FIT.protein },
              { l: 'Uglevod', v: '60', u: 'g', c: FIT.carbs },
              { l: 'Yog\'', v: '12', u: 'g', c: FIT.fat },
            ].map(f => (
              <div key={f.l} style={{ padding: 12, background: FIT.surfaceAlt, borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600 }}>{f.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, color: f.c, letterSpacing: -0.5 }}>{f.v}</span>
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{f.u}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${FIT.border}` }}>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>Batafsil kiritish (vitaminlar)</div>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: FIT.border, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: 9, background: '#fff' }}/>
            </div>
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Nonushta', 'Tushlik', 'Kechki', 'Gazak'].map((m, i) => (
            <Chip key={m} active={i===1} size="sm">{m}</Chip>
          ))}
        </div>
        <Button variant="primary" size="lg" full>Saqlash va qo'shish</Button>
      </div>
    </Phone>
  );
}

// ─── DIARY ──────────────────────────────────────────────
function ScreenDiary({ dark }) {
  const days = ['D','S','C','P','J','Sh','Y'];
  return (
    <Phone dark={dark} height={812}>
      <TopBar title="Kundalik" transparent right={<Icon name="calendar" size={22} color={FIT.text}/>}/>
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: '1', borderRadius: 12, background: i===1?FIT.primary:'#fff',
              border: `1px solid ${i===1?FIT.primary:FIT.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              color: i===1?'#fff':FIT.text,
            }}>
              <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{d}</span>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: FIT.mono }}>{14+i}</span>
            </div>
          ))}
        </div>
      </div>
      <Card style={{ margin: '12px 20px' }} pad={14}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Bugun jami</div>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>58%</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5 }}>1,240 <span style={{ fontSize: 13, color: FIT.textMuted }}>/ 2,150 kkal</span></div>
        <div style={{ height: 6, background: FIT.primarySoft, borderRadius: 3, marginTop: 8 }}>
          <div style={{ width: '58%', height: '100%', background: FIT.primary, borderRadius: 3 }}/>
        </div>
      </Card>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { n:'Nonushta', t:'08:00', k:420, tar:538, items:[
            {e:'🍳',n:'Tuxum omlet',d:'2 dona · 180 kkal',tone:'amber'},
            {e:'🍞',n:'Non',d:'50g · 135 kkal',tone:'amber'},
            {e:'🍯',n:'Choy asal bilan',d:'200ml · 105 kkal',tone:'amber'},
          ]},
          { n:'Tushlik', t:'13:30', k:680, tar:860, items:[
            {e:'🍚',n:'Osh',d:'1 kosa · 420 kkal',tone:'amber'},
            {e:'🥗',n:'Sabzi salati',d:'150g · 180 kkal',tone:'green'},
            {e:'🍵',n:'Achchiq choy',d:'200ml · 2 kkal',tone:'neutral'},
          ]},
          { n:'Kechki ovqat', t:'~19:00', empty:true, tar:538 },
          { n:'Gazak', t:'', empty:true, tar:215 },
        ].map((m, i) => (
          <Card key={i} pad={14}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: m.empty?0:12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{m.n} <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 500 }}>{m.t}</span></div>
                <div style={{ fontSize: 12, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 2 }}>{m.empty?'0':m.k} / {m.tar} kkal</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: FIT.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="plus" size={18} color={FIT.primary} strokeWidth={2.5}/>
              </div>
            </div>
            {m.empty ? (
              <div style={{ border: `1.5px dashed ${FIT.border}`, borderRadius: 10, padding: 12, fontSize: 12, color: FIT.textMuted, textAlign: 'center', marginTop: 8 }}>+ Ovqat qo'shing</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {m.items.map((it, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <FoodThumb emoji={it.e} tone={it.tone} size={36}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{it.n}</div>
                      <div style={{ fontSize: 11, color: FIT.textMuted }}>{it.d}</div>
                    </div>
                    <Icon name="edit" size={16} color={FIT.textSubtle}/>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      <TabBar active="diary" t={I18N.uz}/>
    </Phone>
  );
}

// ─── FOOD DETAIL ───────────────────────────────────────
function ScreenFoodDetail({ dark }) {
  return (
    <Phone dark={dark} height={812}>
      <TopBar back transparent right={
        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#fff', boxShadow: FIT.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="heart" size={18} color={FIT.danger}/>
        </div>
      }/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 120px' }}>
        <div style={{ height: 180, borderRadius: 24, background: `linear-gradient(135deg, ${FIT.accentSoft}, #FDE68A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96, marginBottom: 16 }}>🍚</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Osh</div>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 2 }}>O'zbek milliy taomi · Retsept</div>

        <Card pad={16} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>PORSIYA</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: FIT.surfaceAlt, borderRadius: 12, padding: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: FIT.shadowSm, fontSize: 16, fontWeight: 700 }}>−</div>
              <div style={{ width: 44, textAlign: 'center', fontSize: 17, fontWeight: 800, fontFamily: FIT.mono }}>1</div>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: FIT.shadowSm, fontSize: 16, fontWeight: 700, color: FIT.primary }}>+</div>
            </div>
            <div style={{ height: 40, padding: '0 14px', borderRadius: 12, background: FIT.surfaceAlt, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
              kosa (250g) <Icon name="chevronDown" size={14} color={FIT.textMuted}/>
            </div>
          </div>
        </Card>

        <Card pad={20} style={{ marginTop: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -2 }}>420</div>
          <div style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600, marginTop: -4 }}>kkal</div>
          <MacroBar p={18} c={60} f={22} h={10}/>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center', fontSize: 12 }}>
            {[
              { n: 'P', v: '22g', pct: '18%', c: FIT.protein },
              { n: 'C', v: '60g', pct: '60%', c: FIT.carbs },
              { n: 'F', v: '12g', pct: '22%', c: FIT.fat },
            ].map(m => (
              <div key={m.n}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: m.c }}/>
                  <span style={{ fontWeight: 600 }}>{m.v}</span>
                </div>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 2 }}>{m.pct}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card pad={16} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff' }}>B</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>SALOMATLIK REYTINGI</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>Yaxshi oqsil, lekin yog' ko'p</div>
          </div>
        </Card>

        <div style={{ fontSize: 15, fontWeight: 700, margin: '20px 0 10px' }}>Ingredientlar</div>
        <Card pad={14}>
          {['Guruch · 80g', 'Qo\'y go\'shti · 50g', 'Sabzi · 30g', 'Piyoz · 20g', 'O\'simlik yog\'i · 15ml'].map((ing, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i<4?`1px solid ${FIT.borderSoft}`:'none' }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.primary }}/>
              <span style={{ fontSize: 13 }}>{ing}</span>
            </div>
          ))}
          <Button variant="ghost" size="sm" full>Ingredientlarni o'zgartirish →</Button>
        </Card>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${FIT.border}`, padding: 16 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['Nonushta', 'Tushlik', 'Kechki', 'Gazak'].map((m, i) => (
            <Chip key={m} active={i===1} size="sm">{m}</Chip>
          ))}
        </div>
        <Button variant="primary" size="lg" full>Kundaliga qo'shish</Button>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ScreenHome, ScreenSearch, ScreenComposer, ScreenBarcode, ScreenManual, ScreenDiary, ScreenFoodDetail,
});
