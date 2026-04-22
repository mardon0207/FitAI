// Screens C: Stats, Micronutrients, Deficiency, Profile, Water, Weight, FAB, Achievements, Report, Language/Theme/Permissions

// ─── STATS ──────────────────────────────────────────────
function ScreenStats({ dark }) {
  const data = [1820, 2050, 1900, 2180, 1780, 2240, 1980];
  const max = 2400;
  return (
    <Phone dark={dark} height={812}>
      <TopBar title="Statistika" transparent right={<Icon name="filter" size={20} color={FIT.text}/>}/>
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3 }}>
          {['Hafta', 'Oy', '3 oy', 'Yil'].map((p, i) => (
            <div key={p} style={{ flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8, background: i===0?'#fff':'transparent', boxShadow: i===0?FIT.shadowSm:'none', fontSize: 12, fontWeight: 600, color: i===0?FIT.text:FIT.textMuted }}>{p}</div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 6, fontFamily: FIT.mono }}>14 Apr – 20 Apr 2026</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ display: 'flex', gap: 10, overflow: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {[
            { i: '🔥', l: 'O\'rt. kaloriya', v: '1,980', u: 'kkal', t: '↑ 2%', c: FIT.primary },
            { i: '⚖️', l: 'Vazn', v: '-0.8', u: 'kg', t: 'hafta', c: FIT.protein },
            { i: '🚶', l: 'Qadamlar', v: '7,420', u: '/kun', t: '↑ 12%', c: FIT.accent },
            { i: '💧', l: 'Suv', v: '7.1', u: 'stakan', t: '88%', c: '#3B82F6' },
          ].map((s,i)=>(
            <Card key={i} pad={14} style={{ minWidth: 150, flexShrink: 0 }}>
              <div style={{ fontSize: 18 }}>{s.i}</div>
              <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 4, fontWeight: 600 }}>{s.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -0.5, color: s.c }}>{s.v}</span>
                <span style={{ fontSize: 10, color: FIT.textMuted }}>{s.u}</span>
              </div>
              <div style={{ fontSize: 10, color: FIT.textMuted, marginTop: 2, fontFamily: FIT.mono }}>{s.t}</div>
            </Card>
          ))}
        </div>

        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Kaloriya</div>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, marginBottom: 14 }}>Maqsad: 2,150 kkal/kun</div>
          <svg width="100%" height="130" viewBox="0 0 300 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gcal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={FIT.primary} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={FIT.primary} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <line x1="0" y1={130 - (2150/max)*110} x2="300" y2={130 - (2150/max)*110} stroke={FIT.textSubtle} strokeDasharray="3 4" strokeWidth="1"/>
            <path d={'M ' + data.map((v,i)=>`${i*(300/6)},${130-(v/max)*110}`).join(' L ') + ' L 300,130 L 0,130 Z'} fill="url(#gcal)"/>
            <path d={'M ' + data.map((v,i)=>`${i*(300/6)},${130-(v/max)*110}`).join(' L ')} fill="none" stroke={FIT.primary} strokeWidth="2.5" strokeLinecap="round"/>
            {data.map((v,i)=>(
              <circle key={i} cx={i*(300/6)} cy={130-(v/max)*110} r={i===5?5:3} fill={FIT.primary} stroke="#fff" strokeWidth="2"/>
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: FIT.textMuted, fontFamily: FIT.mono, marginTop: 6 }}>
            {['Du','Se','Ch','Pa','Ju','Sh','Ya'].map(d => <span key={d}>{d}</span>)}
          </div>
        </Card>

        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Makro taqsimoti</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 120, height: 120, position: 'relative' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke={FIT.protein} strokeWidth="18" strokeDasharray={`${0.22*314} ${314}`}/>
                <circle cx="60" cy="60" r="50" fill="none" stroke={FIT.carbs} strokeWidth="18" strokeDasharray={`${0.5*314} ${314}`} strokeDashoffset={-0.22*314}/>
                <circle cx="60" cy="60" r="50" fill="none" stroke={FIT.fat} strokeWidth="18" strokeDasharray={`${0.28*314} ${314}`} strokeDashoffset={-0.72*314}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 10, color: FIT.textMuted, fontWeight: 600 }}>JAMI</div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: FIT.mono }}>1,980</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { n:'Oqsil', v:'108g', p:'22%', c:FIT.protein },
                { n:'Uglevod', v:'248g', p:'50%', c:FIT.carbs },
                { n:'Yog\'', v:'62g', p:'28%', c:FIT.fat },
              ].map(m => (
                <div key={m.n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: m.c }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{m.n}</span>
                  <span style={{ fontSize: 12, fontFamily: FIT.mono, fontWeight: 700 }}>{m.v}</span>
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, width: 32 }}>{m.p}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Vazn trendi</div>
            <div style={{ fontSize: 11, color: FIT.primary, fontWeight: 700 }}>+ Yozish</div>
          </div>
          <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
            {[73.1,72.9,73.0,72.7,72.5,72.6,72.3].map((w,i) => {
              const y = ((73.2-w)/1)*60 + 10;
              return <g key={i}>
                {i>0 && <line x1={(i-1)*50} y1={((73.2-[73.1,72.9,73.0,72.7,72.5,72.6,72.3][i-1])/1)*60 + 10} x2={i*50} y2={y} stroke={FIT.protein} strokeWidth="2"/>}
                <circle cx={i*50} cy={y} r="4" fill={FIT.protein} stroke="#fff" strokeWidth="2"/>
              </g>;
            })}
          </svg>
        </Card>

        <Card pad={16} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Oziq-ovqat nominatsiyasi</div>
          {[
            { n:'Temir', p:32, c:FIT.danger },
            { n:'B12', p:45, c:FIT.danger },
            { n:'Vit D', p:58, c:FIT.accent },
            { n:'Kalsiy', p:72, c:FIT.accent },
            { n:'Vit C', p:96, c:FIT.primary },
          ].map(n => (
            <div key={n.n} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{n.n}</span>
                <span style={{ fontFamily: FIT.mono, fontWeight: 700, color: n.c }}>{n.p}%</span>
              </div>
              <div style={{ height: 5, background: n.c+'22', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${n.p}%`, background: n.c, borderRadius: 3 }}/>
              </div>
            </div>
          ))}
        </Card>

        <Card pad={16} style={{ background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`, border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>5 kunlik kombо</div>
              <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2 }}>Kuniga ovqat yozdingiz</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary }}>5</div>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
            {Array.from({length:7}).map((_,i)=>(
              <div key={i} style={{ flex: 1, height: 22, borderRadius: 4, background: i<5?FIT.primary:'#fff' }}/>
            ))}
          </div>
        </Card>
      </div>
      <TabBar active="stats" t={I18N.uz}/>
    </Phone>
  );
}

// ─── MICRONUTRIENTS ─────────────────────────────────────
function ScreenMicro({ dark }) {
  const items = [
    { n:'Vitamin C', v:96, s:'yetarli', c:FIT.primary },
    { n:'Vitamin A', v:84, s:'yetarli', c:FIT.primary },
    { n:'Vitamin D', v:58, s:'kam', c:FIT.accent },
    { n:'Vitamin E', v:72, s:'yetarli', c:FIT.primary },
    { n:'B12', v:45, s:'kam', c:FIT.danger },
    { n:'B6', v:68, s:'kam', c:FIT.accent },
    { n:'Temir', v:32, s:'kam', c:FIT.danger },
    { n:'Kalsiy', v:72, s:'yetarli', c:FIT.primary },
    { n:'Magniy', v:54, s:'kam', c:FIT.accent },
    { n:'Sink', v:88, s:'yetarli', c:FIT.primary },
  ];
  return (
    <Phone dark={dark} height={812}>
      <TopBar back title="Mikroelementlar" subtitle="Bugungi ko'rsatkichlar" transparent/>
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3 }}>
          {['Vitaminlar', 'Mineralar'].map((p, i) => (
            <div key={p} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, background: i===0?'#fff':'transparent', boxShadow: i===0?FIT.shadowSm:'none', fontSize: 13, fontWeight: 600, color: i===0?FIT.text:FIT.textMuted }}>{p}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Yetishmayotganlar ↑</span>
        <span style={{ fontSize: 11, color: FIT.primary, fontWeight: 700 }}>Saralash ⇅</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map(it => (
            <Card key={it.n} pad={14} style={{ borderLeft: `3px solid ${it.c}` }}>
              <div style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600 }}>{it.n}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 800, fontFamily: FIT.mono, color: it.c, letterSpacing: -1 }}>{it.v}</span>
                <span style={{ fontSize: 12, color: FIT.textMuted }}>%</span>
              </div>
              <div style={{ height: 4, background: it.c+'22', borderRadius: 2, marginTop: 6 }}>
                <div style={{ height: '100%', width: `${Math.min(it.v,100)}%`, background: it.c, borderRadius: 2 }}/>
              </div>
              <div style={{ fontSize: 10, color: it.c, fontWeight: 700, marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{it.s}</div>
            </Card>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ─── DEFICIENCY WARNING ─────────────────────────────────
function ScreenDeficiency({ dark }) {
  return (
    <Phone dark={dark} height={812}>
      <TopBar back right={<Icon name="close" size={20} color={FIT.textMuted}/>} transparent/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <div style={{ display: 'inline-flex', padding: '6px 12px', background: FIT.dangerSoft, borderRadius: 999, gap: 6, alignItems: 'center', marginBottom: 12 }}>
          <Icon name="alert" size={14} color={FIT.danger}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: FIT.danger, textTransform: 'uppercase', letterSpacing: 1 }}>Ogohlantirish</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>B12 vitamin yetishmovchiligi</div>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 6 }}>Sizda 3 kundan beri B12 yetishmayapti</div>

        {/* side by side illustration */}
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, aspectRatio: '1', borderRadius: 20, background: `linear-gradient(135deg, ${FIT.primarySoft}, #A7F3D0)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 64 }}>😊</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: FIT.primaryDark, marginTop: 4 }}>Salomat</div>
            <div style={{ position: 'absolute', top: 8, left: 8, right: 8, height: 3, background: FIT.primary, borderRadius: 2, opacity: 0.5 }}/>
          </div>
          <div style={{ flex: 1, aspectRatio: '1', borderRadius: 20, background: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', filter: 'grayscale(0.3)' }}>
            <div style={{ fontSize: 64, opacity: 0.7 }}>😔</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: FIT.textMuted, marginTop: 4 }}>Yetishmovchilik</div>
          </div>
        </div>

        <Card pad={14} style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>So'nggi 7 kun</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10, alignItems: 'flex-end', height: 50 }}>
            {[55,48,52,40,38,42,35].map((v,i)=>(
              <div key={i} style={{ flex: 1, background: v<50?FIT.danger:FIT.accent, borderRadius: 3, height: `${v}%`, opacity: 0.3 + v/100 }}/>
            ))}
          </div>
        </Card>

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Oqibatlari</div>
        <Card pad={14}>
          {['Charchoq va holsizlik','Xotira muammolari','Anemia','Nerv buzilishi (uzoq muddatli)'].map((s,i)=>(
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i<3?`1px solid ${FIT.borderSoft}`:'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: FIT.dangerSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: FIT.danger }}>{i+1}</div>
              <span style={{ fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </Card>

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Tavsiya etiladi</div>
        <div style={{ display: 'flex', gap: 8, overflow: 'auto' }}>
          {[{e:'🥩',n:'Mol go\'shti',k:'2.4µg'},{e:'🥚',n:'Tuxum',k:'0.6µg'},{e:'🐟',n:'Baliq',k:'3.2µg'},{e:'🥛',n:'Sut',k:'0.9µg'}].map(r=>(
            <Card key={r.n} pad={10} style={{ minWidth: 110, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{r.e}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{r.n}</div>
              <div style={{ fontSize: 10, color: FIT.primary, fontFamily: FIT.mono, fontWeight: 700, marginTop: 2 }}>B12: {r.k}</div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 12, background: FIT.accentSoft, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}><b>Bu tibbiy tashxis EMAS.</b> Davomli bo'lsa, shifokor bilan maslahatlashing.</div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" full>Yopish</Button>
          <Button variant="primary" full>Ovqat qo'shish</Button>
        </div>
      </div>
    </Phone>
  );
}

// ─── PROFILE ───────────────────────────────────────────
function ScreenProfile({ dark }) {
  const sections = [
    { t: 'Sog\'liq ma\'lumotlari', items: [
      { i: 'scale', n: 'Bo\'y/vazn', v: '178cm, 72.3kg' },
      { i: 'calendar', n: 'Yosh', v: '28 yosh' },
      { i: 'flame', n: 'Faollik', v: 'O\'rtacha' },
      { i: 'leaf', n: 'Ovqat cheklovlari', v: 'Halal' },
    ]},
    { t: 'Mening taomlarim', items: [
      { i: 'heart', n: 'Saqlangan meal\'lar', v: '12' },
      { i: 'diary', n: 'Mening retseptlarim', v: '4' },
    ]},
    { t: 'Birikmalar', items: [
      { i: 'sparkle', n: 'Apple Health', v: 'Ulangan', g: true },
      { i: 'stats', n: 'Apple Watch', v: 'Ulanmagan' },
    ]},
    { t: 'Bildirishnomalar', items: [
      { i: 'bell', n: 'Ovqat eslatmasi', toggle: true },
      { i: 'droplet', n: 'Suv eslatmasi', toggle: true },
      { i: 'alert', n: 'Yetishmovchilik', toggle: true },
    ]},
    { t: 'Ilova', items: [
      { i: 'globe', n: 'Til', v: 'O\'zbekcha' },
      { i: 'moon', n: 'Tema', v: 'Svetlый' },
      { i: 'settings', n: 'O\'lchov', v: 'Metric' },
    ]},
  ];
  return (
    <Phone dark={dark} height={812}>
      <TopBar title="Profil" transparent right={<Icon name="settings" size={22} color={FIT.text}/>}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card pad={16} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800 }}>AK</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Aziz Karimov</div>
            <div style={{ fontSize: 12, color: FIT.textMuted }}>aziz@fitai.uz</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>
              <span>🔥 28 kun</span>
              <span>·</span>
              <span>2,340 ovqat</span>
            </div>
          </div>
          <Icon name="edit" size={18} color={FIT.textMuted}/>
        </Card>

        <Card pad={14} style={{ background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`, border: 'none', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: FIT.primaryDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Sizning maqsadingiz</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>Vazn kamaytirish</div>
          <div style={{ fontSize: 12, color: FIT.text, marginTop: 4 }}>72.3kg → 68kg · 2,150 kkal/kun</div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 3, marginTop: 10 }}>
            <div style={{ height: '100%', width: '40%', background: FIT.primary, borderRadius: 3 }}/>
          </div>
        </Card>

        {sections.map(s => (
          <div key={s.t} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>{s.t}</div>
            <Card pad={0}>
              {s.items.map((it,i)=>(
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i<s.items.length-1?`1px solid ${FIT.borderSoft}`:'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: FIT.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={it.i} size={16} color={FIT.primary}/>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{it.n}</span>
                  {it.toggle ? (
                    <div style={{ width: 40, height: 22, borderRadius: 11, background: FIT.primary, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 9, background: '#fff' }}/>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: 12, color: it.g?FIT.primary:FIT.textMuted, fontWeight: it.g?700:500 }}>{it.v}</span>
                      <Icon name="chevron" size={14} color={FIT.textSubtle}/>
                    </>
                  )}
                </div>
              ))}
            </Card>
          </div>
        ))}
        <Button variant="secondary" full>Chiqish</Button>
      </div>
      <TabBar active="profile" t={I18N.uz}/>
    </Phone>
  );
}

// ─── WATER TRACKER ──────────────────────────────────────
function ScreenWater({ dark }) {
  const filled = 5, total = 8;
  return (
    <Phone dark={dark} height={720}>
      <TopBar back right={<Icon name="close" size={20} color={FIT.textMuted}/>} title="Suv iste'moli" transparent/>
      <div style={{ flex: 1, padding: '0 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 140, height: 220, position: 'relative', marginTop: 10 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '40% 40% 20px 20px', background: '#EEF2FF', border: `2px solid #C7D2FE` }}/>
          <div style={{ position: 'absolute', left: 2, right: 2, bottom: 2, height: `${filled/total*96}%`, borderRadius: '0 0 18px 18px', background: 'linear-gradient(180deg, #60A5FA, #3B82F6)', transition: 'height 0.5s' }}/>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -1 }}>{filled}/{total}</div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>STAKAN</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 24, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: '#fff', boxShadow: FIT.shadowMd, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: FIT.text }}>−</div>
          <div style={{ fontSize: 13, color: FIT.textMuted, fontFamily: FIT.mono }}>1,250 / 2,000 ml</div>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: '#3B82F6', boxShadow: `0 8px 24px #3B82F666`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={28} color="#fff" strokeWidth={2.5}/>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginTop: 24, width: '100%', justifyContent: 'center' }}>
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} style={{ width: 24, height: 32, borderRadius: '8px 8px 4px 4px', background: i<filled?'#3B82F6':'#E0E7FF', border: `1px solid ${i<filled?'#2563EB':'#C7D2FE'}` }}/>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          {['+250 ml','+500 ml','+1 L'].map(q => (
            <Chip key={q} size="md">{q}</Chip>
          ))}
        </div>

        <div style={{ width: '100%', marginTop: 24 }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Bugun</div>
          <div style={{ display: 'flex', gap: 10, overflow: 'auto' }}>
            {['08:15','10:30','12:00','14:20','16:45'].map(t => (
              <div key={t} style={{ padding: '8px 12px', background: '#fff', borderRadius: 10, border: `1px solid ${FIT.border}`, fontSize: 12, fontFamily: FIT.mono, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#3B82F6' }}>💧</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─── WEIGHT LOG (bottom sheet) ───────────────────────
function ScreenWeight({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <div style={{ flex: 1, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '16px 20px 24px' }}>
          <div style={{ width: 36, height: 4, background: FIT.border, borderRadius: 2, margin: '0 auto 14px' }}/>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Vaznni yozish</div>
          <div style={{ fontSize: 12, color: FIT.textMuted, marginBottom: 20 }}>Oxirgi yozuv: 72.5 kg (ertalab)</div>

          {/* mini chart */}
          <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 20 }}>
            {[73.1,72.9,73.0,72.7,72.5,72.6,72.3].map((w,i)=>{
              const h = (w-72) * 45 + 15;
              return <div key={i} style={{ flex: 1, height: h, background: i===6?FIT.protein:FIT.protein+'33', borderRadius: 4 }}/>;
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: FIT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>−</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 54, fontWeight: 800, fontFamily: FIT.mono, color: FIT.text, letterSpacing: -2 }}>72.3</div>
              <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: -4 }}>kg</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>+</div>
          </div>

          <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3, marginBottom: 14 }}>
            {['kg', 'lbs'].map((u,i)=>(
              <div key={u} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, background: i===0?'#fff':'transparent', boxShadow: i===0?FIT.shadowSm:'none', fontSize: 13, fontWeight: 600 }}>{u}</div>
            ))}
          </div>
          <Input label="IZOH (ixtiyoriy)" placeholder="Masalan: ertalab nonushtadan keyin"/>
          <div style={{ height: 10 }}/>
          <Button variant="primary" size="lg" full>Saqlash</Button>
        </div>
      </div>
    </Phone>
  );
}

// ─── QUICK LOG FAB ─────────────────────────────────────
function ScreenFabMenu({ dark }) {
  const items = [
    { i: '🔍', n: 'Qidirish', d: 'Ovqat nomidan izlash', c: FIT.primary },
    { i: '🧩', n: 'Ingredientlardan yig\'ish', d: 'Ingredientlardan taom', c: FIT.accent },
    { i: '📊', n: 'Shtrix-kod', d: 'Qadoqdan o\'qish', c: FIT.protein },
    { i: '✏️', n: 'Qo\'lda qo\'shish', d: 'Yangi taom yaratish', c: FIT.fat },
  ];
  return (
    <Phone dark={dark} height={812}>
      <div style={{ flex: 1, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px 20px 120px' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, textAlign: 'center' }}>QANDAY QO'SHAMIZ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it,i)=>(
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: '#fff', borderRadius: 16, boxShadow: FIT.shadowMd }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: it.c+'1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{it.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{it.n}</div>
                <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: 2 }}>{it.d}</div>
              </div>
              <Icon name="chevron" size={18} color={FIT.textSubtle}/>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: 28, background: '#fff', boxShadow: FIT.shadowLg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={24} color={FIT.text} strokeWidth={2.5}/>
        </div>
      </div>
    </Phone>
  );
}

// ─── ACHIEVEMENTS ──────────────────────────────────────
function ScreenAchieve({ dark }) {
  const badges = [
    { e: '🔥', n: 'Birinchi hafta', earned: true },
    { e: '💪', n: '30 kun kombo', earned: true },
    { e: '🥇', n: '100 ovqat', earned: true },
    { e: '💧', n: 'Suv sardori', earned: true },
    { e: '⭐', n: 'Mukammal kun', earned: false, p: 0.7 },
    { e: '🏆', n: '100 kun kombo', earned: false, p: 0.28 },
    { e: '🥗', n: 'Sabzavat chempioni', earned: false, p: 0.45 },
    { e: '📊', n: 'Tahlilchi', earned: false, p: 0.1 },
    { e: '🌟', n: 'Legenda', earned: false, p: 0.05 },
  ];
  // 3 month heatmap data (90 days)
  const heat = Array.from({length: 84}).map((_,i) => ({ v: Math.random() > 0.15 ? Math.random() : 0 }));
  return (
    <Phone dark={dark} height={812}>
      <TopBar title="Yutuqlar" transparent right={<Icon name="trophy" size={22} color={FIT.accent}/>}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card pad={20} style={{ background: `linear-gradient(135deg, ${FIT.accent}, #DC2626)`, border: 'none', textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>🔥</div>
          <div style={{ fontSize: 48, fontWeight: 800, fontFamily: FIT.mono, color: '#fff', letterSpacing: -2, marginTop: -6 }}>12</div>
          <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>Kunlik kombо</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>Eng yaxshi rekord: 34 kun</div>
        </Card>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>So'nggi 3 oy</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 3 }}>
            {heat.map((d,i)=>(
              <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: d.v === 0 ? '#F1F5F9' : `rgba(16, 185, 129, ${0.25 + d.v*0.75})` }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, alignItems: 'center', marginTop: 10, fontSize: 10, color: FIT.textMuted }}>
            <span>kam</span>
            {[0.2,0.4,0.6,0.8,1].map(o => <div key={o} style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(16,185,129,${o})` }}/>)}
            <span>ko'p</span>
          </div>
        </Card>

        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 10 }}>Nishonlar</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {badges.map((b,i)=>(
            <div key={i} style={{ background: '#fff', padding: 12, borderRadius: 14, textAlign: 'center', border: `1px solid ${FIT.border}`, opacity: b.earned ? 1 : 0.5 }}>
              <div style={{ fontSize: 36, filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.e}</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, lineHeight: 1.2 }}>{b.n}</div>
              {!b.earned && <div style={{ height: 3, background: FIT.border, borderRadius: 2, marginTop: 6 }}>
                <div style={{ height: '100%', width: `${b.p*100}%`, background: FIT.primary, borderRadius: 2 }}/>
              </div>}
            </div>
          ))}
        </div>

        <Card pad={16} style={{ marginTop: 16, background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`, border: 'none' }}>
          <div style={{ fontSize: 11, color: FIT.primaryDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Bu hafta challenge</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>5 kun × 8 stakan suv</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[1,1,1,0,0].map((d,i)=>(
              <div key={i} style={{ flex: 1, height: 28, borderRadius: 6, background: d?FIT.primary:'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: d?'#fff':FIT.textMuted, fontSize: 14 }}>
                {d ? '✓' : i+1}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 8 }}>3/5 kun · Nishon: 🥇 Suv sardori</div>
        </Card>
      </div>
    </Phone>
  );
}

// ─── WEEKLY REPORT ─────────────────────────────────────
function ScreenReport({ dark }) {
  return (
    <Phone dark={dark} height={812}>
      <TopBar back title="Haftalik hisobot" transparent right={<Icon name="settings" size={20} color={FIT.text}/>}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <Card pad={20} style={{ background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`, border: 'none', color: '#fff' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.85, fontWeight: 600 }}>HISOBOT</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 }}>14 – 20 Aprel 2026</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Aziz Karimov · 7 kun</div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            { l: 'O\'rt. kaloriya', v: '1,980', u: 'kkal', t: '↑ 2%', c: FIT.primary },
            { l: 'Qadam', v: '7,420', u: '/kun', t: '↑ 12%', c: FIT.accent },
            { l: 'Vazn', v: '-0.8', u: 'kg', t: '↓', c: FIT.protein },
            { l: 'Mos kelish', v: '86', u: '%', t: 'yaxshi', c: FIT.primary },
          ].map((s,i)=>(
            <Card key={i} pad={14}>
              <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{s.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: FIT.mono, color: s.c, letterSpacing: -0.5 }}>{s.v}</span>
                <span style={{ fontSize: 11, color: FIT.textMuted }}>{s.u}</span>
              </div>
              <div style={{ fontSize: 10, color: FIT.textMuted, marginTop: 2, fontFamily: FIT.mono }}>{s.t}</div>
            </Card>
          ))}
        </div>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Kunlik kaloriya</div>
          <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
            <line x1="0" y1="35" x2="300" y2="35" stroke={FIT.textSubtle} strokeDasharray="3 4"/>
            <path d="M0,50 L50,30 L100,42 L150,22 L200,55 L250,18 L300,38" fill="none" stroke={FIT.primary} strokeWidth="2.5"/>
          </svg>
        </Card>

        <Card pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Eng ko'p iste'mol</div>
          {[
            { e:'🍚',n:'Osh',f:'5 marta',k:'2,100'},
            { e:'🥚',n:'Tuxum',f:'8 marta',k:'620'},
            { e:'🍞',n:'Non',f:'12 marta',k:'1,620'},
            { e:'🍵',n:'Choy',f:'18 marta',k:'36'},
          ].map((it,i)=>(
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: i<3?`1px solid ${FIT.borderSoft}`:'none' }}>
              <span style={{ fontSize: 20 }}>{it.e}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{it.n}</span>
              <span style={{ fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono }}>{it.f}</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FIT.mono, color: FIT.primary, minWidth: 50, textAlign: 'right' }}>{it.k}</span>
            </div>
          ))}
        </Card>

        <Card pad={16} style={{ marginTop: 12, background: FIT.primarySoft, border: 'none' }}>
          <div style={{ fontSize: 11, color: FIT.primaryDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Haftaning xulosasi</div>
          <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
            Bu hafta siz maqsadingizdan <b>86% mos</b> keldingiz. Oqsil biroz kam bo'ldi (o'rtacha 92g, maqsad 145g). Temir va B12 darajasini ko'tarish tavsiya etiladi.
          </div>
        </Card>

        <Button variant="secondary" full style={{ marginTop: 16 }}>PDF eksport qilish</Button>
      </div>
    </Phone>
  );
}

// ─── LANGUAGE/THEME/PERMISSIONS ────────────────────────
function ScreenLang({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <div style={{ flex: 1, padding: '40px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon name="globe" size={32} color="#fff"/>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>Tilni tanlang</div>
        <div style={{ fontSize: 14, color: FIT.textMuted, marginTop: 4 }}>Choose language · Выберите язык</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          {[
            { f:'🇺🇿', n:'O\'zbekcha', en:'Uzbek', a:true },
            { f:'🇷🇺', n:'Русский', en:'Russian' },
            { f:'🇬🇧', n:'English', en:'English' },
          ].map(l => (
            <div key={l.en} style={{ padding: 16, borderRadius: 16, background: '#fff', border: `2px solid ${l.a?FIT.primary:FIT.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: FIT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{l.f}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{l.n}</div>
                <div style={{ fontSize: 12, color: FIT.textMuted }}>{l.en}</div>
              </div>
              {l.a && <div style={{ width: 24, height: 24, borderRadius: 12, background: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={14} color="#fff" strokeWidth={3}/>
              </div>}
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" full>Davom etish</Button>
      </div>
    </Phone>
  );
}

function ScreenTheme({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar back title="Tema" transparent/>
      <div style={{ flex: 1, padding: '0 20px 20px' }}>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginBottom: 16 }}>Ilova tashqi ko'rinishi</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { n:'Svetlый', i:'☀️', bg:'#FAFAF9', fg:'#0F172A', a:true },
            { n:'Qorongu', i:'🌙', bg:'#0F172A', fg:'#F8FAFC' },
            { n:'Avto', i:'⚙️', bg:'linear-gradient(135deg,#FAFAF9 50%,#0F172A 50%)', fg:'#64748B' },
          ].map(th => (
            <div key={th.n} style={{ padding: 10, borderRadius: 16, background: '#fff', border: `2px solid ${th.a?FIT.primary:FIT.border}` }}>
              <div style={{ height: 140, borderRadius: 10, background: th.bg, display: 'flex', flexDirection: 'column', padding: 10, gap: 6, position: 'relative' }}>
                <div style={{ width: 30, height: 6, borderRadius: 3, background: th.fg, opacity: 0.8 }}/>
                <div style={{ width: '100%', height: 28, borderRadius: 6, background: th.fg, opacity: 0.1 }}/>
                <div style={{ width: '80%', height: 10, borderRadius: 3, background: th.fg, opacity: 0.4 }}/>
                <div style={{ width: '60%', height: 10, borderRadius: 3, background: th.fg, opacity: 0.3 }}/>
                <div style={{ marginTop: 'auto', width: 24, height: 24, borderRadius: 12, background: FIT.primary }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'center' }}>
                <span>{th.i}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{th.n}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ScreenPerms({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar back transparent/>
      <div style={{ flex: 1, padding: '0 20px 20px' }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${FIT.primarySoft}, ${FIT.accentSoft})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 16 }}>🔐</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Ruxsatlar</div>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 4, lineHeight: 1.5 }}>Eng yaxshi tajriba uchun quyidagilarni yoqing</div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { i:'barcode', n:'Shtrix-kod kamerasi', d:'Faqat shtrix-kod o\'qish uchun. AI skaner YO\'Q.', on:true },
            { i:'stats', n:'Sog\'liq / HealthKit', d:'Qadam sanash va faollik ma\'lumotlari', on:true },
            { i:'bell', n:'Bildirishnomalar', d:'Ovqat va suv eslatmalari', on:true },
          ].map(p => (
            <Card key={p.n} pad={14} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: FIT.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={p.i} size={20} color={FIT.primary}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.n}</div>
                <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 2, lineHeight: 1.4 }}>{p.d}</div>
              </div>
              <div style={{ width: 40, height: 22, borderRadius: 11, background: p.on?FIT.primary:FIT.border, position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 2, left: p.on?20:2, width: 18, height: 18, borderRadius: 9, background: '#fff' }}/>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <Button variant="primary" size="lg" full style={{ marginTop: 20 }}>Davom etish</Button>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ScreenStats, ScreenMicro, ScreenDeficiency, ScreenProfile, ScreenWater, ScreenWeight,
  ScreenFabMenu, ScreenAchieve, ScreenReport, ScreenLang, ScreenTheme, ScreenPerms,
});
