// Screens A: Splash, Onboarding, Auth, Quiz

// ─── SPLASH ─────────────────────────────────────────────
function ScreenSplash({ dark }) {
  return (
    <Phone dark={dark} height={720} statusColor="#fff">
      <div style={{
        flex: 1, background: `linear-gradient(160deg, ${FIT.primary} 0%, ${FIT.primaryDark} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        <div style={{ width: 104, height: 104, borderRadius: 32, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="leaf" size={56} color="#fff" strokeWidth={2} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: -1.5 }}>FitAI</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: 500 }}>Sog'lom ovqat — yaxshi hayot</div>
        </div>
        <div style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: `rgba(255,255,255,${0.3 + i*0.2})` }} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ─── ONBOARDING SLIDES ──────────────────────────────────
function ScreenOnboard1({ dark }) {
  const t = I18N.uz;
  return (
    <Phone dark={dark} height={720}>
      <TopBar right={<span style={{ fontSize: 14, color: FIT.textMuted, fontWeight: 600, paddingRight: 8 }}>{t.skip}</span>} transparent/>
      <div style={{ flex: 1, padding: '12px 24px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 240, height: 300, background: FIT.primarySoft, borderRadius: 32, padding: 18, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: FIT.primary, opacity: 0.15 }} />
            {[
              { e: '🍚', n: 'Osh', k: 420, tone: 'amber' },
              { e: '🥟', n: 'Manti', k: 380, tone: 'pink' },
              { e: '🥪', n: 'Somsa', k: 320, tone: 'amber' },
              { e: '🍎', n: 'Olma', k: 52, tone: 'red' },
              { e: '🥛', n: 'Sut', k: 120, tone: 'blue' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: 8, borderRadius: 14, boxShadow: FIT.shadowSm, position: 'relative', zIndex: 1 }}>
                <FoodThumb emoji={f.e} tone={f.tone} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{f.n}</div>
                  <div style={{ fontSize: 10, color: FIT.textMuted }}>1 porsiya</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: FIT.mono, color: FIT.primary }}>{f.k}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>Minglab ovqatlar bazasidan tanlang</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 10, lineHeight: 1.5 }}>O'zbek milliy taomlari, xalqaro mahsulotlar va shtrix-kod orqali qidiring.</div>
        </div>
        <div style={{ display: 'flex', gap: 6, margin: '24px 0 16px' }}>
          <div style={{ width: 24, height: 6, borderRadius: 3, background: FIT.primary }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.border }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.border }} />
        </div>
        <Button variant="primary" size="lg" full>{t.next}</Button>
      </div>
    </Phone>
  );
}

function ScreenOnboard2({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar right={<span style={{ fontSize: 14, color: FIT.textMuted, fontWeight: 600, paddingRight: 8 }}>O'tkazib yuborish</span>} transparent/>
      <div style={{ flex: 1, padding: '12px 24px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 260, height: 280 }}>
            <div style={{ position: 'absolute', top: 20, left: 10 }}><FoodThumb emoji="🥚" tone="amber" size={68} /></div>
            <div style={{ position: 'absolute', top: 0, right: 30 }}><FoodThumb emoji="🍅" tone="red" size={64} /></div>
            <div style={{ position: 'absolute', top: 70, right: 0 }}><FoodThumb emoji="🌭" tone="pink" size={60} /></div>
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 160, height: 160, borderRadius: 80, background: `linear-gradient(135deg, ${FIT.primary}, ${FIT.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', boxShadow: `0 16px 40px ${FIT.primary}44` }}>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: FIT.mono, letterSpacing: -1 }}>446</div>
              <div style={{ fontSize: 11, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1.5 }}>kkal</div>
            </div>
            <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="260" height="280">
              <path d="M50 70 Q90 130 130 180" stroke={FIT.primary} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.4"/>
              <path d="M210 40 Q170 110 130 180" stroke={FIT.primary} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.4"/>
              <path d="M220 110 Q180 140 130 180" stroke={FIT.primary} strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.4"/>
            </svg>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>Ingredientlardan yig'ing</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 10, lineHeight: 1.5 }}>Taom nomini bilmasangiz — nimalardan tayyorlaganingizni qo'shing, biz hisoblaymiz.</div>
        </div>
        <div style={{ display: 'flex', gap: 6, margin: '24px 0 16px' }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.border }} />
          <div style={{ width: 24, height: 6, borderRadius: 3, background: FIT.primary }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.border }} />
        </div>
        <Button variant="primary" size="lg" full>Keyingi</Button>
      </div>
    </Phone>
  );
}

function ScreenOnboard3({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar transparent/>
      <div style={{ flex: 1, padding: '12px 24px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ width: 110, height: 180, borderRadius: 20, background: `linear-gradient(180deg, ${FIT.primarySoft}, ${FIT.primary}33)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: FIT.primaryDark, padding: 12 }}>
            <div style={{ fontSize: 44 }}>😊</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6 }}>SALOMAT</div>
            <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4, opacity: 0.7 }}>Vitamin yetarli</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: FIT.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="alert" size={20} color="#fff" strokeWidth={2.5}/>
          </div>
          <div style={{ width: 110, height: 180, borderRadius: 20, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: FIT.textMuted, padding: 12, filter: 'grayscale(0.4)' }}>
            <div style={{ fontSize: 44, opacity: 0.6 }}>😔</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6 }}>YETISHMOVCHILIK</div>
            <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4, opacity: 0.7 }}>Charchoq, holsizlik</div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>Vitamin yetishmovchiligidan himoyalaning</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 10, lineHeight: 1.5 }}>Ilova sizni oldindan ogohlantiradi va tavsiyalar beradi.</div>
        </div>
        <div style={{ display: 'flex', gap: 6, margin: '24px 0 16px' }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.border }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: FIT.border }} />
          <div style={{ width: 24, height: 6, borderRadius: 3, background: FIT.primary }} />
        </div>
        <Button variant="primary" size="lg" full>Boshlash</Button>
      </div>
    </Phone>
  );
}

// ─── AUTH ──────────────────────────────────────────────
function ScreenLogin({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar back transparent/>
      <div style={{ flex: 1, padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Qaytib keldingizmi?</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6 }}>Hisobingizga kiring</div>
        </div>
        <Input label="EMAIL" value="aziz@fit.uz" leading={<Icon name="chat" size={18} color={FIT.textMuted}/>}/>
        <div>
          <Input label="PAROL" value="••••••••" type="password" leading={<Icon name="lock" size={18} color={FIT.textMuted}/>} right={<Icon name="eye" size={18} color={FIT.textMuted}/>}/>
          <div style={{ textAlign: 'right', fontSize: 13, color: FIT.primary, fontWeight: 600, marginTop: 8 }}>Parolni unutdingizmi?</div>
        </div>
        <Button variant="primary" size="lg" full>Kirish</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: FIT.border }}/>
          <span style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 600 }}>YOKI</span>
          <div style={{ flex: 1, height: 1, background: FIT.border }}/>
        </div>
        <Button variant="dark" size="lg" full leading={<span style={{ fontSize: 18 }}>􀣺</span>}> Apple bilan kirish</Button>
        <Button variant="white" size="lg" full leading={<div style={{ width: 20, height: 20, borderRadius: 10, background: 'conic-gradient(from 0deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4)' }}/>}>Google bilan kirish</Button>
        <div style={{ textAlign: 'center', fontSize: 14, color: FIT.textMuted, marginTop: 'auto' }}>
          Hisobingiz yo'qmi? <span style={{ color: FIT.primary, fontWeight: 700 }}>Ro'yxatdan o'ting</span>
        </div>
      </div>
    </Phone>
  );
}

function ScreenRegister({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar back transparent/>
      <div style={{ flex: 1, padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Salom! 👋</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6 }}>Yangi hisob yarating</div>
        </div>
        <Input label="ISM" value="Aziz Karimov"/>
        <Input label="EMAIL" value="aziz@fit.uz"/>
        <div>
          <Input label="PAROL" value="••••••••••" type="password" right={<Icon name="eye" size={18} color={FIT.textMuted}/>}/>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {[FIT.primary, FIT.primary, FIT.primary, FIT.border].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: c }}/>
            ))}
          </div>
          <div style={{ fontSize: 12, color: FIT.primary, marginTop: 4, fontWeight: 600 }}>Kuchli parol</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 4 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="check" size={14} color="#fff" strokeWidth={3}/>
          </div>
          <div style={{ fontSize: 13, color: FIT.text, lineHeight: 1.5 }}>Foydalanish shartlariga va maxfiylik siyosatiga roziman</div>
        </div>
        <Button variant="primary" size="lg" full>Ro'yxatdan o'tish</Button>
        <div style={{ textAlign: 'center', fontSize: 14, color: FIT.textMuted, marginTop: 'auto' }}>
          Hisobingiz bormi? <span style={{ color: FIT.primary, fontWeight: 700 }}>Kiring</span>
        </div>
      </div>
    </Phone>
  );
}

function ScreenForgot({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <TopBar back transparent/>
      <div style={{ flex: 1, padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: FIT.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={32} color={FIT.primary} strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Parolni tiklash</div>
          <div style={{ fontSize: 15, color: FIT.textMuted, marginTop: 6, lineHeight: 1.5 }}>Email kiriting, biz sizga parol tiklash havolasini yuboramiz.</div>
        </div>
        <Input label="EMAIL" value="aziz@fit.uz" leading={<Icon name="chat" size={18} color={FIT.textMuted}/>}/>
        <Button variant="primary" size="lg" full>Link yuborish</Button>
        <div style={{ textAlign: 'center', fontSize: 14, color: FIT.primary, fontWeight: 700, marginTop: 'auto' }}>← Kirishga qaytish</div>
      </div>
    </Phone>
  );
}

// ─── QUIZ (Profile setup) ─────────────────────────────
function QuizHeader({ step, total = 6, title }) {
  return (
    <div style={{ padding: '8px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: '#fff', boxShadow: FIT.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" size={18} color={FIT.text} strokeWidth={2}/>
        </div>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: FIT.border, overflow: 'hidden' }}>
          <div style={{ width: `${step/total*100}%`, height: '100%', background: FIT.primary, borderRadius: 3 }}/>
        </div>
        <span style={{ fontSize: 12, color: FIT.textMuted, fontWeight: 700, fontFamily: FIT.mono }}>{step}/{total}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2 }}>{title}</div>
    </div>
  );
}

function ScreenQuiz1({ dark }) {
  const opts = [
    { icon: '🏃', title: 'Vazn kamaytirish', desc: 'Sog\'lom ozish', active: true },
    { icon: '⚖️', title: 'Vaznni tutib turish', desc: 'Hozirgi vaznda qolish' },
    { icon: '💪', title: 'Mushaklarni oshirish', desc: 'Massa va kuch ortishi' },
  ];
  return (
    <Phone dark={dark} height={720}>
      <div style={{ paddingTop: 8 }}><QuizHeader step={1} title="Sizning maqsadingiz nima?"/></div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opts.map((o, i) => (
          <div key={i} style={{
            padding: 18, borderRadius: 18, background: '#fff',
            border: `2px solid ${o.active ? FIT.primary : FIT.border}`,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: o.active ? `0 4px 20px ${FIT.primary}22` : FIT.shadowSm,
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: o.active ? FIT.primarySoft : FIT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{o.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{o.title}</div>
              <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 2 }}>{o.desc}</div>
            </div>
            {o.active && (
              <div style={{ width: 24, height: 24, borderRadius: 12, background: FIT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={14} color="#fff" strokeWidth={3}/>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full>Keyingi</Button>
        </div>
      </div>
    </Phone>
  );
}

function ScreenQuiz2({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <div style={{ paddingTop: 8 }}><QuizHeader step={2} title="Bo'y va vazningiz"/></div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', background: FIT.surfaceAlt, borderRadius: 10, padding: 3, fontSize: 12, fontWeight: 700 }}>
            <div style={{ padding: '6px 14px', borderRadius: 8, background: '#fff', boxShadow: FIT.shadowSm }}>Metric</div>
            <div style={{ padding: '6px 14px', color: FIT.textMuted }}>Imperial</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Card pad={20} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Bo'y</div>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primary, letterSpacing: -1.5, marginTop: 8 }}>178</div>
            <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600 }}>sm</div>
          </Card>
          <Card pad={20} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Vazn</div>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FIT.mono, color: FIT.accent, letterSpacing: -1.5, marginTop: 8 }}>72.3</div>
            <div style={{ fontSize: 13, color: FIT.textMuted, fontWeight: 600 }}>kg</div>
          </Card>
        </div>
        <Card pad={16}>
          <div style={{ height: 6, background: FIT.border, borderRadius: 3, position: 'relative', margin: '20px 12px' }}>
            <div style={{ position: 'absolute', left: 0, width: '56%', height: '100%', background: FIT.primary, borderRadius: 3 }}/>
            <div style={{ position: 'absolute', left: '56%', top: -6, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: FIT.shadowMd, border: `3px solid ${FIT.primary}`, transform: 'translateX(-9px)' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: FIT.textMuted, fontFamily: FIT.mono, padding: '0 12px' }}>
            <span>140 sm</span><span>178</span><span>210 sm</span>
          </div>
        </Card>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full>Keyingi</Button>
        </div>
      </div>
    </Phone>
  );
}

function ScreenQuiz3({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <div style={{ paddingTop: 8 }}><QuizHeader step={3} title="Yosh va jinsingiz"/></div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card pad={16}>
          <div style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Tug'ilgan yil</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            {[1996, 1997, 1998, 1999, 2000].map((y, i) => (
              <div key={y} style={{ fontSize: i===2?32:16, fontWeight: i===2?800:500, fontFamily: FIT.mono, color: i===2?FIT.primary:FIT.textSubtle, padding: '8px 12px', opacity: i===2?1:0.5 }}>{y}</div>
            ))}
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { icon: '👨', label: 'Erkak', active: true },
            { icon: '👩', label: 'Ayol' },
          ].map(g => (
            <div key={g.label} style={{
              flex: 1, padding: '24px 12px', borderRadius: 18, background: '#fff',
              border: `2px solid ${g.active ? FIT.primary : FIT.border}`,
              textAlign: 'center', boxShadow: g.active ? `0 4px 20px ${FIT.primary}22` : FIT.shadowSm,
            }}>
              <div style={{ fontSize: 44 }}>{g.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{g.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: FIT.textMuted, textAlign: 'center', lineHeight: 1.5, padding: '0 20px' }}>Bu ma'lumot aniq kaloriya hisobi uchun kerak.</div>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full>Keyingi</Button>
        </div>
      </div>
    </Phone>
  );
}

function ScreenQuiz4({ dark }) {
  const opts = [
    { icon: '🪑', title: 'Kam harakat', desc: 'Sedentary', active: false },
    { icon: '🚶', title: 'Yengil faol', desc: 'Light · 1-2 kun/hafta', active: true },
    { icon: '🏃', title: 'O\'rtacha', desc: 'Moderate · 3-5 kun/hafta' },
    { icon: '💪', title: 'Faol', desc: 'Active · 6-7 kun/hafta' },
    { icon: '🔥', title: 'Juda faol', desc: 'Very active · kuniga 2 marta' },
  ];
  return (
    <Phone dark={dark} height={720}>
      <div style={{ paddingTop: 8 }}><QuizHeader step={4} title="Qancha faolsiz?"/></div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
        {opts.map((o, i) => (
          <div key={i} style={{
            padding: 14, borderRadius: 14, background: '#fff',
            border: `2px solid ${o.active ? FIT.primary : FIT.border}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: o.active ? FIT.primarySoft : FIT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{o.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{o.title}</div>
              <div style={{ fontSize: 12, color: FIT.textMuted }}>{o.desc}</div>
            </div>
            {o.active && <Icon name="check" size={20} color={FIT.primary} strokeWidth={3}/>}
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 12, paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full>Keyingi</Button>
        </div>
      </div>
    </Phone>
  );
}

function ScreenQuiz5({ dark }) {
  const tags = [
    { n: 'Halal', a: true },
    { n: 'Vegetarian' },
    { n: 'Vegan' },
    { n: 'Lactose-free', a: true },
    { n: 'Gluten-free' },
    { n: 'Keto' },
    { n: 'Low-carb' },
    { n: 'Diabetic' },
    { n: 'Hech narsa' },
  ];
  return (
    <Phone dark={dark} height={720}>
      <div style={{ paddingTop: 8 }}><QuizHeader step={5} title="Ovqatlanish cheklovlari?"/></div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 13, color: FIT.textMuted, marginBottom: 16 }}>Bir nechtasini tanlashingiz mumkin</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tags.map(tag => (
            <Chip key={tag.n} active={tag.a} size="md">{tag.n}</Chip>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full>Keyingi</Button>
        </div>
      </div>
    </Phone>
  );
}

function ScreenQuiz6({ dark }) {
  return (
    <Phone dark={dark} height={720}>
      <div style={{ paddingTop: 8 }}><QuizHeader step={6} title="Tayyor! 🎉"/></div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 15, color: FIT.textMuted, lineHeight: 1.5 }}>Sizning profilingiz asosida kunlik maqsadingiz:</div>
        <Card pad={24} style={{ background: `linear-gradient(135deg, ${FIT.primarySoft}, #fff)`, border: `1px solid ${FIT.primary}22` }}>
          <div style={{ fontSize: 12, color: FIT.primaryDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Kunlik maqsad</div>
          <div style={{ fontSize: 56, fontWeight: 800, fontFamily: FIT.mono, color: FIT.primaryDark, letterSpacing: -2, marginTop: 4 }}>2,150</div>
          <div style={{ fontSize: 14, color: FIT.textMuted, fontWeight: 600, marginTop: -4 }}>kkal / kun</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {[
              { n: 'Oqsil', v: '145g', c: FIT.protein },
              { n: 'Uglevod', v: '240g', c: FIT.carbs },
              { n: 'Yog\'', v: '65g', c: FIT.fat },
            ].map(m => (
              <div key={m.n} style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: m.c }}/>
                  <span style={{ fontSize: 11, color: FIT.textMuted, fontWeight: 600 }}>{m.n}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: FIT.mono, marginTop: 4 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card pad={16} style={{ background: FIT.accentSoft, border: 'none' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 20 }}>💡</div>
            <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>Vazn kamaytirish uchun kunlik 500 kkal kam iste'mol qilishni tavsiya qildik.</div>
          </div>
        </Card>
        <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
          <Button variant="primary" size="lg" full>Ilovaga kirish →</Button>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ScreenSplash, ScreenOnboard1, ScreenOnboard2, ScreenOnboard3,
  ScreenLogin, ScreenRegister, ScreenForgot,
  ScreenQuiz1, ScreenQuiz2, ScreenQuiz3, ScreenQuiz4, ScreenQuiz5, ScreenQuiz6,
});
