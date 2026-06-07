// pico-screens-4.jsx — Profile screen (tabbed layout)

const { useState } = React;

// ── Module-level data ─────────────────────────────────────────────────────────

const PROFILE_SUBJECTS = [
  { name:'Algebra',          pct:72, status:'Improving'  },
  { name:'Functions',        pct:45, status:'Practicing' },
  { name:'Calculus',         pct:18, status:'Next focus' },
  { name:'Kinematics',       pct:65, status:'Improving'  },
  { name:'Forces',           pct:38, status:'Practicing' },
  { name:'Electromagnetism', pct:12, status:'Next focus' },
  { name:'Graph reading',    pct:80, status:'Strong'     },
  { name:'Units',            pct:55, status:'Improving'  },
];

const PROFILE_STATUS = {
  'Strong':     { bg:'#EAF7EF', color:'#2A7850', bc:'#C0E8D0', bar:'#5FBF8F' },
  'Improving':  { bg:'#EAF4FF', color:'#2770C2', bc:'#B8D8F4', bar:'#4A90E2' },
  'Practicing': { bg:'#FFF6DC', color:'#886018', bc:'#FDEEBA', bar:'#F6C85F' },
  'Next focus': { bg:'#F1F3ED', color:'#5F6468', bc:'#E1E6DB', bar:'#C5CEC0' },
};

const PROFILE_UNLOCKED = [
  { name:'First Mission',  icon:'target', color:'#4A90E2', bg:'#EAF4FF', cat:'Growth'      },
  { name:'5-Day Streak',   icon:'zap',    color:'#F47C7C', bg:'#FFF1F1', cat:'Consistency' },
  { name:'Unit Detective', icon:'scan',   color:'#8B6FD4', bg:'#F3EEFF', cat:'Mastery'     },
  { name:'Visual Thinker', icon:'flask',  color:'#5FBF8F', bg:'#EAF7EF', cat:'Exploration' },
  { name:'Growth Builder', icon:'arrow',  color:'#E8943A', bg:'#FFF3E0', cat:'Growth'      },
];

const PROFILE_UPCOMING = [
  { name:'10-Day Streak',       icon:'zap',     cat:'Consistency' },
  { name:'Kinematics Explorer', icon:'route',   cat:'Mastery'     },
  { name:'Algebra Builder',     icon:'edit',    cat:'Mastery'     },
  { name:'Graph Reader',        icon:'zoomin',  cat:'Exploration' },
  { name:'Calculus Starter',    icon:'sparkle', cat:'Mastery'     },
];

const PROFILE_ACTIVITY = [
  { label:'Completed Practice Mission', detail:'Units in motion',        icon:'target',  color:'#5FBF8F' },
  { label:'Improved learning signal',   detail:'Unit mismatch',          icon:'signal',  color:'#4A90E2' },
  { label:'Opened Visual Lab',          detail:'Final velocity',         icon:'flask',   color:'#8B6FD4' },
  { label:'Started Growth Path',        detail:'Kinematics foundations', icon:'route',   color:'#F47C7C' },
  { label:'Completed Daily Challenge',  detail:'Kinematics · Medium',    icon:'sparkle', color:'#E8943A' },
];

const PICO_QUOTES = [
  { text:'"The important thing is not to stop questioning."',                             author:'Albert Einstein',   note:"A small question today can become tomorrow's breakthrough." },
  { text:'"Mathematics is the language in which the universe has been written."',         author:'Galileo Galilei',   note:'Each formula you learn is a sentence in the language of nature.' },
  { text:'"An investment in knowledge pays the best interest."',                          author:'Benjamin Franklin', note:'Every mission you complete is interest compounding.' },
  { text:'"Somewhere, something incredible is waiting to be known."',                     author:'Carl Sagan',        note:'Curiosity is the engine. Practice is the fuel.' },
];

// ── Tab: Subject Focus ────────────────────────────────────────────────────────
const ProfileSubjectsTab = () => (
  <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
    {PROFILE_SUBJECTS.map(sub => {
      const sc = PROFILE_STATUS[sub.status];
      return (
        <div key={sub.name} className="p-card" style={{ padding:'12px 14px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:8, lineHeight:1.3 }}>{sub.name}</div>
          <div className="p-pbar-track" style={{ marginBottom:8 }}>
            <div className="p-pbar-fill" style={{ width:`${sub.pct}%`, background:sc.bar }}/>
          </div>
          <span style={{
            fontSize:10.5, fontWeight:700, padding:'2px 8px', borderRadius:20,
            background:sc.bg, color:sc.color, border:`1px solid ${sc.bc}`, display:'inline-block',
          }}>{sub.status}</span>
        </div>
      );
    })}
  </div>
);

// ── Tab: Progress ─────────────────────────────────────────────────────────────
const ProfileProgressTab = ({ setPage }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
      {[
        { label:'Current path',    val:'Units in motion', sub:'65% complete',              bg:'#EAF4FF', bc:'#B8D8F4', ic:'route',  c:'#2770C2' },
        { label:'Strongest skill', val:'Formula setup',   sub:'Consistent across sessions', bg:'#EAF7EF', bc:'#C0E8D0', ic:'check',  c:'#2A7850' },
        { label:'Focus area',      val:'Unit reasoning',  sub:'Improving across missions',  bg:'#FFF6DC', bc:'#FDEEBA', ic:'signal', c:'#886018' },
      ].map(card => (
        <div key={card.label} style={{ background:card.bg, border:`1.5px solid ${card.bc}`, borderRadius:14, padding:'13px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:7 }}>
            <Icon n={card.ic} size={12} color={card.c}/>
            <span className="p-section-lbl" style={{ color:card.c }}>{card.label}</span>
          </div>
          <div style={{ fontSize:14, fontWeight:800, color:C.text, letterSpacing:'-0.02em', marginBottom:2 }}>{card.val}</div>
          <div style={{ fontSize:11.5, color:C.sec }}>{card.sub}</div>
        </div>
      ))}
    </div>

    <div style={{ display:'flex', gap:10 }}>
      {[
        { label:'Daily streak',       val:'5 days', c:'#F47C7C', bg:'#FFF1F1' },
        { label:'Signals improved',   val:'8',      c:'#5FBF8F', bg:'#EAF7EF' },
      ].map(st => (
        <div key={st.label} style={{ padding:'9px 16px', background:st.bg, borderRadius:11, display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:17, fontWeight:800, color:st.c }}>{st.val}</span>
          <span style={{ fontSize:12.5, color:st.c, opacity:0.8 }}>{st.label}</span>
        </div>
      ))}
    </div>

    <div style={{ padding:'14px 18px', background:C.soft, borderRadius:14, display:'flex', gap:14, alignItems:'flex-start' }}>
      <PicoAvatar size={36}/>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:13.5, color:C.text, lineHeight:1.7, fontStyle:'italic', marginBottom:10 }}>
          "You usually choose the right formula. Your next growth step is making the units match the physical quantity."
        </p>
        <div style={{ display:'flex', gap:8 }}>
          <Btn size="sm" onClick={() => setPage('growthpath')}><Icon n="route" size={13}/> Growth Path</Btn>
          <Btn variant="secondary" size="sm" onClick={() => setPage('missions')}>Start next mission</Btn>
        </div>
      </div>
    </div>
  </div>
);

// ── Tab: Achievements ─────────────────────────────────────────────────────────
const ProfileAchievementsTab = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
    <div>
      <div style={{ fontSize:12.5, fontWeight:700, color:C.text, marginBottom:11 }}>
        Unlocked <span style={{ fontWeight:500, color:C.mute, marginLeft:4 }}>5 badges</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:10 }}>
        {PROFILE_UNLOCKED.map(b => (
          <div key={b.name} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:7,
            padding:'13px 8px', background:b.bg, borderRadius:13, textAlign:'center',
          }}>
            <div style={{
              width:36, height:36, borderRadius:'50%', background:'white',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 2px 8px ${b.color}24`,
            }}>
              <Icon n={b.icon} size={16} color={b.color}/>
            </div>
            <div style={{ fontSize:11, fontWeight:600, color:C.text, lineHeight:1.3 }}>{b.name}</div>
            <span style={{ fontSize:9.5, fontWeight:700, color:b.color, letterSpacing:'0.05em', textTransform:'uppercase' }}>{b.cat}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ paddingTop:16, borderTop:`1px solid ${C.border}` }}>
      <div style={{ fontSize:12.5, fontWeight:700, color:C.text, marginBottom:11 }}>
        Upcoming <span style={{ fontWeight:500, color:C.mute, marginLeft:4 }}>keep going</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:10 }}>
        {PROFILE_UPCOMING.map(b => (
          <div key={b.name} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:7,
            padding:'13px 8px', background:C.soft, borderRadius:13, textAlign:'center', opacity:0.6,
          }}>
            <div style={{
              width:36, height:36, borderRadius:'50%', background:C.border,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon n={b.icon} size={16} color={C.mute}/>
            </div>
            <div style={{ fontSize:11, fontWeight:600, color:C.sec, lineHeight:1.3 }}>{b.name}</div>
            <span style={{ fontSize:9.5, fontWeight:700, color:C.mute, letterSpacing:'0.05em', textTransform:'uppercase' }}>{b.cat}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Tab: History ──────────────────────────────────────────────────────────────
const ProfileHistoryTab = () => (
  <div>
    {PROFILE_ACTIVITY.map((a, i) => (
      <div key={a.detail} style={{
        display:'flex', alignItems:'center', gap:14, padding:'11px 4px',
        borderBottom: i < PROFILE_ACTIVITY.length - 1 ? `1px solid ${C.border}` : 'none',
      }}>
        <div style={{
          width:32, height:32, borderRadius:9, flexShrink:0,
          background:`${a.color}18`, display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon n={a.icon} size={14} color={a.color}/>
        </div>
        <div>
          <div style={{ fontSize:12, color:C.mute, lineHeight:1.3 }}>{a.label}</div>
          <div style={{ fontSize:13.5, fontWeight:600, color:C.text, marginTop:1 }}>{a.detail}</div>
        </div>
      </div>
    ))}
  </div>
);

// ── Tab: Pico Quote ───────────────────────────────────────────────────────────
const ProfileQuoteTab = () => {
  const [qi, setQi] = useState(0);
  const q = PICO_QUOTES[qi];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{
        padding:'28px 32px', textAlign:'center',
        background:'linear-gradient(135deg, #F7F8F4 0%, #EAF4FF 100%)',
        borderRadius:16, border:`1.5px solid ${C.border}`,
      }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.mute, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:16 }}>
          Pico's quote of the day
        </div>
        <p style={{
          fontSize:17, fontWeight:600, color:C.text, lineHeight:1.7,
          letterSpacing:'-0.01em', fontStyle:'italic',
          maxWidth:420, margin:'0 auto 14px',
        }}>
          {q.text}
        </p>
        <div style={{ fontSize:13, color:C.sec, fontWeight:500 }}>— {q.author}</div>
      </div>

      <div style={{ display:'flex', gap:16, alignItems:'center', padding:'0 4px' }}>
        <PicoAvatar size={42}/>
        <p style={{ flex:1, fontSize:13.5, color:C.sec, lineHeight:1.65, fontStyle:'italic' }}>
          "{q.note}"
        </p>
        <Btn variant="secondary" size="sm"
          onClick={() => setQi(i => (i + 1) % PICO_QUOTES.length)}>
          <Icon n="refresh" size={13}/> New quote
        </Btn>
      </div>
    </div>
  );
};

// ── Profile screen ────────────────────────────────────────────────────────────
const ProfileScreen = ({ setPage }) => {
  const [tab, setTab] = useState('subjects');

  const TABS = [
    { id:'subjects',     label:'Subject Focus' },
    { id:'progress',     label:'Progress'      },
    { id:'achievements', label:'Achievements'  },
    { id:'history',      label:'History'       },
    { id:'quote',        label:'Pico Quote'    },
  ];

  const renderTab = () => {
    switch (tab) {
      case 'subjects':     return <ProfileSubjectsTab/>;
      case 'progress':     return <ProfileProgressTab setPage={setPage}/>;
      case 'achievements': return <ProfileAchievementsTab/>;
      case 'history':      return <ProfileHistoryTab/>;
      case 'quote':        return <ProfileQuoteTab/>;
      default:             return null;
    }
  };

  return (
    <div className="p-scroll" style={{ background:C.bg, padding:'28px 36px' }}>
      <ScreenHeader
        title="Profile"
        subtitle="Your learning identity, goals, progress, and achievements with Pico."
        actions={
          <Btn size="sm" onClick={() => setPage('missions')}>
            <Icon n="sparkle" size={14}/> Daily challenge
          </Btn>
        }
      />

      <div style={{ maxWidth:700, display:'flex', flexDirection:'column', gap:14 }}>

        {/* ── Profile summary ───────────────────────────────────── */}
        <div className="p-card" style={{ padding:'18px 22px' }}>
          <div style={{ display:'flex', gap:18, alignItems:'center' }}>
            <div style={{
              width:60, height:60, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg, #4A90E2 0%, #5FBF8F 100%)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:22, fontWeight:800, color:'white',
              boxShadow:'0 3px 12px rgba(74,144,226,0.24)',
            }}>A</div>

            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:4 }}>
                <span style={{ fontSize:18, fontWeight:800, color:C.text, letterSpacing:'-0.02em' }}>Alex</span>
                <Badge variant="blue">STEM Explorer</Badge>
              </div>
              <div style={{ fontSize:12.5, color:C.sec, marginBottom:11 }}>
                Focused on math and physics foundations · Track: Engineering foundations
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {[
                  { val:'5',   unit:'day streak',      icon:'zap',     c:'#F47C7C', bg:'#FFF1F1' },
                  { val:'12',  unit:'missions',         icon:'target',  c:'#4A90E2', bg:'#EAF4FF' },
                  { val:'320', unit:'PicoPoints',       icon:'sparkle', c:'#E8943A', bg:'#FFF3E0' },
                  { val:'5',   unit:'badges',           icon:'award',   c:'#8B6FD4', bg:'#F3EEFF' },
                  { val:'8',   unit:'signals improved', icon:'signal',  c:'#5FBF8F', bg:'#EAF7EF' },
                ].map(st => (
                  <div key={st.unit} style={{
                    display:'flex', alignItems:'center', gap:5,
                    padding:'4px 10px', background:st.bg, borderRadius:8,
                  }}>
                    <Icon n={st.icon} size={12} color={st.c}/>
                    <span style={{ fontSize:12, fontWeight:700, color:st.c }}>{st.val}</span>
                    <span style={{ fontSize:11.5, color:st.c, opacity:0.72 }}>{st.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <PicoAvatar size={50} style={{ flexShrink:0 }}/>
          </div>
        </div>

        {/* ── League + Goals ────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

          <div className="p-card" style={{ padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <Icon n="sparkle" size={13} color="#E8943A"/>
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>League progress</span>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:'-0.02em', marginBottom:2 }}>Feather League</div>
            <div style={{ fontSize:12, color:C.sec, marginBottom:9 }}>180 pts away from Wing League</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:11.5, fontWeight:700, color:'#E8943A' }}>320 pts</span>
              <span style={{ fontSize:11.5, color:C.mute }}>500 pts</span>
            </div>
            <div className="p-pbar-track">
              <div className="p-pbar-fill" style={{ width:'64%', background:'#E8943A' }}/>
            </div>
            <p style={{ fontSize:11.5, color:C.mute, lineHeight:1.55, marginTop:10 }}>
              Earn PicoPoints by completing missions, improving signals, and keeping your streak.
            </p>
          </div>

          <div className="p-card" style={{ padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <Icon n="target" size={13} color={C.blue}/>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Learning goals</span>
              </div>
              <Btn variant="ghost" size="xs"><Icon n="edit" size={11}/> Edit</Btn>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:12 }}>
              {['Improve kinematics', 'Strengthen algebra steps', 'Prepare for calculus'].map(g => (
                <div key={g} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{
                    width:16, height:16, borderRadius:'50%', flexShrink:0,
                    background:C.softBlue, display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon n="check" size={9} color={C.blue}/>
                  </div>
                  <span style={{ fontSize:13, color:C.text }}>{g}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:'8px 11px', background:C.softBlue, borderRadius:9 }}>
              <p style={{ fontSize:11.5, color:'#2A60A8', lineHeight:1.55 }}>
                Pico uses your goals to personalize your Growth Path.
              </p>
            </div>
          </div>

        </div>

        {/* ── Tabbed section ────────────────────────────────────── */}
        <div className="p-card" style={{ overflow:'hidden' }}>

          {/* Tab nav */}
          <div style={{ display:'flex', padding:'0 20px', borderBottom:`1.5px solid ${C.border}` }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'11px 13px', border:'none', background:'transparent',
                cursor:'pointer', fontSize:13,
                fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? C.blue : C.sec,
                borderBottom: tab === t.id ? `2.5px solid ${C.blue}` : '2.5px solid transparent',
                marginBottom:'-1.5px', transition:'all 0.12s',
                fontFamily:"'Plus Jakarta Sans', sans-serif", whiteSpace:'nowrap',
              }}>{t.label}</button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-fade" key={tab} style={{ padding:'20px 22px' }}>
            {renderTab()}
          </div>

        </div>

        <div style={{ height:8 }}/>
      </div>
    </div>
  );
};

Object.assign(window, { ProfileScreen });
