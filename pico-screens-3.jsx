// pico-screens-3.jsx — Growth Map, Growth Path, Practice Missions

const { useState } = React;

// ── Growth Map ────────────────────────────────────────────────────────────────
const GrowthMapScreen = ({ setPage }) => {
  const [filter, setFilter] = useState('week');

  const signals = [
    {
      title: 'Unit mismatch',
      seen: 4,
      desc: 'You often get the number right, but the unit does not match the physical quantity.',
      cta: 'Practice units',
      ctaPage: 'missions',
      variant: 'coral',
    },
    {
      title: 'Sign slips',
      seen: 2,
      desc: 'Negative signs sometimes disappear when rearranging equations.',
      cta: 'Practice algebra steps',
      ctaPage: 'missions',
      variant: 'yellow',
    },
    {
      title: 'Quantity confusion',
      seen: 3,
      desc: 'Velocity and distance are being mixed in motion problems.',
      cta: 'Open visual comparison',
      ctaPage: 'lab',
      variant: 'blue',
    },
  ];

  return (
    <div className="p-scroll" style={{ background:C.bg, padding:'32px 40px' }}>
      <ScreenHeader
        eyebrow="Learning analytics"
        title="Growth Map"
        subtitle="Pico turns repeated mistakes into learning signals you can improve."
        actions={
          <div style={{ display:'flex', gap:4, background:C.soft, padding:4, borderRadius:10 }}>
            {[['session','This session'],['week','This week'],['all','All time']].map(([id,label])=>(
              <button key={id} className={`p-tab${filter===id?' active':''}`} style={{ fontSize:12 }}
                      onClick={()=>setFilter(id)}>{label}</button>
            ))}
          </div>
        }
      />

      {/* Top summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:28 }}>
        {[
          {
            icon:'signal', label:'Main focus', title:'Units in motion',
            desc:'Your calculations are often correct, but units need more attention.',
            bg:C.softCoral, bc:'#FDDADA', ic:'#BF3A3A', tc:'#9A2A2A',
          },
          {
            icon:'check', label:'Strongest skill', title:'Formula setup',
            desc:'You are choosing the right equations consistently.',
            bg:C.softGreen, bc:'#C0E8D0', ic:'#2A7850', tc:'#1A5838',
          },
          {
            icon:'arrow', label:'Next opportunity', title:'Velocity vs. distance',
            desc:'A short visual practice can help separate these concepts.',
            bg:C.softBlue, bc:'#B8D8F4', ic:'#2770C2', tc:'#1A508A',
          },
        ].map(card => (
          <div key={card.label} style={{ background:card.bg, border:`1.5px solid ${card.bc}`, borderRadius:18, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <Icon n={card.icon} size={15} color={card.ic}/>
              <span className="p-section-lbl" style={{ color:card.ic, opacity:0.8 }}>{card.label}</span>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:card.tc, marginBottom:6, letterSpacing:'-0.02em' }}>{card.title}</div>
            <p style={{ fontSize:12.5, color:card.tc, lineHeight:1.6, opacity:0.85 }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Learning signals */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:'-0.02em', marginBottom:16 }}>
          Learning Signals
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {signals.map(sig => (
            <div key={sig.title} className="p-card" style={{ padding:'18px 22px', display:'flex', gap:20, alignItems:'center' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{sig.title}</span>
                  <Badge variant={sig.variant}>Seen {sig.seen} times</Badge>
                </div>
                <p style={{ fontSize:13.5, color:C.sec, lineHeight:1.6 }}>{sig.desc}</p>
              </div>
              {/* Mini bar */}
              <div style={{ width:80, flexShrink:0, textAlign:'center' }}>
                <div className="p-pbar-track" style={{ marginBottom:6 }}>
                  <div className="p-pbar-fill" style={{ width:`${Math.min(sig.seen*20, 100)}%`, background:sig.variant==='coral' ? C.coral : sig.variant==='yellow' ? C.yellow : C.blue }}/>
                </div>
                <span style={{ fontSize:11, color:C.mute }}>{sig.seen}/5</span>
              </div>
              <Btn variant="secondary" size="sm" onClick={() => setPage(sig.ctaPage)}>{sig.cta}</Btn>
            </div>
          ))}
        </div>
      </div>

      {/* Pico insight */}
      <div className="p-card" style={{ padding:'22px 26px', display:'flex', gap:18, alignItems:'flex-start' }}>
        <PicoAvatar size={52}/>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.mute, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>Pico's insight</div>
          <p style={{ fontSize:14, color:C.sec, lineHeight:1.7 }}>
            Your strongest pattern is not a lack of understanding. You usually choose the right formula.
            The next step is making the units match the physical quantity.
          </p>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <Btn variant="primary" size="sm" onClick={() => setPage('growthpath')}>View Growth Path</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setPage('missions')}>Start practice mission</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Growth Path ───────────────────────────────────────────────────────────────
const GrowthPathScreen = ({ setPage }) => {
  const steps = [
    {
      title: 'Units in kinematics',
      badge: 'Recommended',
      variant: 'coral',
      reason: 'Seen in 4 recent learning signals.',
      items: ['Matching formulas with units', 'Checking final answers', 'Distinguishing m, m/s, and m/s²'],
      active: true,
    },
    {
      title: 'Velocity vs. distance',
      badge: 'Up next',
      variant: 'blue',
      reason: 'Related to your unit signals.',
      items: ['Reading motion graphs', 'Comparing position and velocity', 'Identifying what a question asks for'],
      active: false,
    },
    {
      title: 'Algebra signs',
      badge: 'Later',
      variant: 'grey',
      reason: 'A smaller pattern appeared in equation rearranging.',
      items: ['Negative signs', 'Moving terms across equals', 'Checking equivalent equations'],
      active: false,
    },
  ];

  return (
    <div className="p-scroll" style={{ background:C.bg, padding:'32px 40px' }}>
      <ScreenHeader
        eyebrow="Your personalized roadmap"
        title="Growth Path"
        subtitle="A personalized path built from your learning signals."
        actions={
          <Btn variant="primary" size="sm" onClick={() => setPage('missions')}>
            <Icon n="target" size={14}/> Start next mission
          </Btn>
        }
      />

      {/* Hero recommendation */}
      <div className="p-card" style={{ padding:'26px 30px', marginBottom:28 }}>
        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
          <div style={{ flex:1 }}>
            <Badge variant="coral" style={{ marginBottom:12 }}>Recommended next</Badge>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, letterSpacing:'-0.025em', marginBottom:10 }}>
              Units in motion
            </h2>
            <p style={{ fontSize:13.5, color:C.sec, lineHeight:1.7, maxWidth:540, marginBottom:14 }}>
              Pico noticed that your calculations are usually close, but the units sometimes do not match the physical quantity.
            </p>
            <div style={{ padding:'12px 16px', background:C.softYellow, borderRadius:12, marginBottom:18 }}>
              <span style={{ fontSize:12, fontWeight:700, color:'#886018', display:'block', marginBottom:4 }}>Why this matters</span>
              <p style={{ fontSize:13, color:'#7A5010', lineHeight:1.6 }}>
                Units help you know whether an answer describes position, velocity, acceleration, force, or energy.
              </p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Btn onClick={() => setPage('missions')}>
                <Icon n="target" size={14}/> Start practice mission
              </Btn>
              <Btn variant="secondary" onClick={() => setPage('lab')}>
                <Icon n="flask" size={14}/> Open visual lesson
              </Btn>
            </div>
          </div>
          {/* Summary ring */}
          <div style={{ flexShrink:0, width:110, textAlign:'center', padding:'8px 0' }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="#E1E6DB" strokeWidth="8"/>
              <circle cx="45" cy="45" r="38" fill="none" stroke={C.coral} strokeWidth="8"
                strokeDasharray={`${2*Math.PI*38*0.65} ${2*Math.PI*38}`}
                strokeLinecap="round" transform="rotate(-90 45 45)"/>
              <text x="45" y="49" textAnchor="middle" fill={C.text} fontSize="15" fontWeight="800" fontFamily="Plus Jakarta Sans">65%</text>
            </svg>
            <p style={{ fontSize:11, color:C.mute, marginTop:6 }}>path complete</p>
          </div>
        </div>
      </div>

      {/* Vertical roadmap */}
      <h2 style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:'-0.02em', marginBottom:20 }}>
        Your roadmap
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {steps.map((step, i) => (
          <div key={step.title} className="p-road-item" style={{ marginBottom: i < steps.length-1 ? 0 : 0 }}>
            {/* Spine */}
            <div className="p-road-spine">
              <div className="p-road-dot" style={{
                background: step.active ? C.coral : i===1 ? C.blue : C.border,
                border: step.active ? `2px solid #FFB8B8` : `2px solid ${C.border}`,
              }}/>
              {i < steps.length-1 && (
                <div className="p-road-line" style={{ background: i===0 ? C.coral : C.border, minHeight:32 }}/>
              )}
            </div>

            {/* Content */}
            <div style={{ flex:1, paddingBottom:20, paddingLeft:2 }}>
              <div className="p-card" style={{
                padding:'18px 22px',
                borderColor: step.active ? '#FDDADA' : C.border,
                background: step.active ? '#FFFAFA' : 'white',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{step.title}</span>
                  <Badge variant={step.variant}>{step.badge}</Badge>
                </div>
                <p style={{ fontSize:12.5, color:C.mute, marginBottom:12 }}>{step.reason}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {step.items.map(item => (
                    <div key={item} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background: step.active ? C.coral : C.mute, flexShrink:0 }}/>
                      <span style={{ fontSize:13, color:C.sec }}>{item}</span>
                    </div>
                  ))}
                </div>
                {step.active && (
                  <div style={{ marginTop:14 }}>
                    <Btn variant="coral" size="sm" onClick={() => setPage('missions')}>
                      Start this step
                    </Btn>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Practice Missions ─────────────────────────────────────────────────────────
const PracticeMissionsScreen = ({ setPage }) => {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [question, setQuestion] = useState(0);

  const QUESTIONS = [
    {
      prompt: 'If acceleration is measured in m/s² and time is measured in s, what unit should a · t have?',
      options: ['m', 'm/s', 'm/s²', 's'],
      correct: 1,
      feedbackCorrect: 'Exactly. One second cancels from s², leaving m/s. That means a · t describes a change in velocity.',
      feedbackWrong: 'Useful signal. Let\'s look at the units: m/s² · s = m/s. The result describes velocity, not distance.',
    },
    {
      prompt: 'A car moves at constant velocity. Which quantity is zero?',
      options: ['Speed', 'Distance', 'Acceleration', 'Time'],
      correct: 2,
      feedbackCorrect: 'Correct. Constant velocity means no change in speed or direction — so acceleration is zero.',
      feedbackWrong: 'Almost there. If velocity is constant, the rate of change of velocity is zero. That\'s acceleration.',
    },
    {
      prompt: 'v = v₀ + at describes which quantity on the left side?',
      options: ['Position', 'Final velocity', 'Displacement', 'Force'],
      correct: 1,
      feedbackCorrect: 'Yes. v here is final velocity — the velocity reached after accelerating for time t.',
      feedbackWrong: 'Your reasoning is close. The v in this equation is the velocity at time t, not position or displacement.',
    },
  ];

  const q = QUESTIONS[question];
  const isCorrect = selected === q.correct;
  const total = QUESTIONS.length;

  const next = () => {
    if (question < total-1) { setQuestion(q=>q+1); setSelected(null); setConfirmed(false); }
  };

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      <div className="p-scroll" style={{ flex:1, padding:'32px 40px', background:C.bg }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <Badge variant="yellow">Focus: Units in motion</Badge>
              <span style={{ fontSize:12.5, color:C.mute }}>Mission 1 of 3</span>
            </div>
            <h1 style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.03em' }}>Practice Missions</h1>
            <p style={{ fontSize:13.5, color:C.sec, marginTop:6 }}>Short exercises designed around your current focus area.</p>
          </div>
          <Btn variant="ghost" size="sm" onClick={() => setPage('growthpath')}>
            View Growth Path
          </Btn>
        </div>

        {/* Mission card */}
        <div className="p-card" style={{ padding:'22px 26px', marginBottom:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:C.softYellow, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon n="target" size={18} color="#886018"/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:C.text }}>Mission: Units in motion</div>
              <div style={{ fontSize:12, color:C.mute, marginTop:2 }}>
                Your goal is to make the unit match the physical quantity, not just the number.
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div className="p-pbar-track" style={{ flex:1 }}>
              <div className="p-pbar-fill" style={{ width:`${((question + (confirmed ? 1 : 0)) / total) * 100}%` }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:C.green, flexShrink:0 }}>
              {question + (confirmed ? 1 : 0)} of {total}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-card" style={{ padding:'24px 28px', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:22, height:22, borderRadius:50, background:C.softBlue, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:C.blue }}>
              {question+1}
            </div>
            <span style={{ fontSize:12, color:C.mute, fontWeight:600 }}>Question {question+1} of {total}</span>
          </div>
          <p style={{ fontSize:15.5, color:C.text, lineHeight:1.7, marginBottom:22, fontWeight:500 }}>
            {q.prompt}
          </p>

          {/* Options */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {q.options.map((opt, i) => {
              let cls = 'p-opt';
              if (confirmed) {
                if (i === q.correct) cls += ' correct';
                else if (i === selected) cls += ' wrong';
              } else if (i === selected) {
                cls += ' p-opt-hover';
              }
              return (
                <button key={opt} className={cls}
                        onClick={() => !confirmed && setSelected(i)}
                        style={{ borderColor: !confirmed && i===selected ? C.blue : undefined,
                                 background: !confirmed && i===selected ? C.softBlue : undefined }}>
                  <span style={{ display:'inline-block', width:20, height:20, borderRadius:5,
                                 background: confirmed && i===q.correct ? '#EAF7EF' : confirmed && i===selected && i!==q.correct ? '#FFF1F1' : C.soft,
                                 color: confirmed && i===q.correct ? '#2A7850' : confirmed && i===selected && i!==q.correct ? '#BF3A3A' : C.mute,
                                 fontSize:11, fontWeight:700, marginRight:10,
                                 display:'inline-flex', alignItems:'center', justifyContent:'center',
                                 verticalAlign:'middle', lineHeight:1, flexShrink:0 }}>
                    {['A','B','C','D'][i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit / Next */}
        {!confirmed && selected !== null && (
          <div className="p-fade" style={{ marginBottom:16 }}>
            <Btn onClick={() => setConfirmed(true)}>
              <Icon n="check" size={15}/> Submit answer
            </Btn>
          </div>
        )}

        {/* Feedback */}
        {confirmed && (
          <div className={`p-fade ${isCorrect ? 'p-card-progress' : 'p-card-signal'}`}
               style={{ padding:'18px 22px', marginBottom:16 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <Icon n={isCorrect ? 'check' : 'signal'} size={16} color={isCorrect ? '#2A7850' : '#BF3A3A'}/>
              <div>
                <div style={{ fontSize:13.5, fontWeight:700, color: isCorrect ? '#2A7850' : '#B83030', marginBottom:5 }}>
                  {isCorrect ? 'Exactly right.' : 'Useful signal.'}
                </div>
                <p style={{ fontSize:13.5, color: isCorrect ? '#2A5840' : '#9A3030', lineHeight:1.65 }}>
                  {isCorrect ? q.feedbackCorrect : q.feedbackWrong}
                </p>
              </div>
            </div>
          </div>
        )}

        {confirmed && question < total-1 && (
          <Btn onClick={next}>Next question <Icon n="chevRight" size={14}/></Btn>
        )}
        {confirmed && question === total-1 && (
          <div className="p-fade p-card" style={{ padding:'22px 26px', marginTop:8 }}>
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              <PicoAvatar size={48}/>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:6 }}>Mission complete.</div>
                <p style={{ fontSize:13.5, color:C.sec, lineHeight:1.65 }}>
                  Your results have been added to the Growth Map. Keep going — patterns improve with practice.
                </p>
                <div style={{ display:'flex', gap:10, marginTop:14 }}>
                  <Btn onClick={() => { setQuestion(0); setSelected(null); setConfirmed(false); }}>
                    Try again
                  </Btn>
                  <Btn variant="secondary" onClick={() => setPage('growthmap')}>
                    View Growth Map
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Pico */}
      <PicoPanel
        title="Pico's coaching"
        message={
          !confirmed
            ? "Take your time. Think about what the unit tells you about the physical quantity."
            : isCorrect
              ? "That's the pattern. When you see m/s² and s together, picture the seconds cancelling."
              : "That's a useful signal. Units tell you what kind of thing you measured — not just the number."
        }
        size={64}
        extra={
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="p-divider"/>
            <p className="p-section-lbl">Focus area</p>
            <div style={{ padding:'10px 14px', background:C.softYellow, borderRadius:11 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#886018' }}>Units in motion</div>
              <div style={{ fontSize:12, color:'#9A7020', marginTop:3 }}>{question+1} of {total} complete</div>
            </div>
            <div className="p-divider"/>
            <Btn variant="secondary" size="sm" onClick={() => setPage('growthpath')} style={{ width:'100%' }}>
              Growth Path
            </Btn>
          </div>
        }
      />
    </div>
  );
};

// ── Settings sub-components ───────────────────────────────────────────────────

const SettingToggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    aria-checked={value}
    role="switch"
    style={{
      width: 38, height: 22, borderRadius: 11,
      background: value ? 'var(--accent, #4A90E2)' : '#D4D9CF',
      border: 'none', cursor: 'pointer', position: 'relative',
      flexShrink: 0, transition: 'background 0.2s', padding: 0, outline: 'none',
    }}
  >
    <div style={{
      position: 'absolute', top: 3,
      left: value ? 19 : 3,
      width: 16, height: 16, borderRadius: '50%',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
      transition: 'left 0.18s ease',
    }}/>
  </button>
);

const SettingRow = ({ label, desc, control, last = false }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, padding: '14px 20px',
    borderBottom: last ? 'none' : '1px solid #F1F3ED',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{label}</div>
      {desc && <div style={{ fontSize: 12.5, color: C.mute, marginTop: 2.5, lineHeight: 1.55 }}>{desc}</div>}
    </div>
    <div style={{ flexShrink: 0 }}>{control}</div>
  </div>
);

const SettingRowStacked = ({ label, desc, control, last = false }) => (
  <div style={{
    padding: '14px 20px',
    borderBottom: last ? 'none' : '1px solid #F1F3ED',
  }}>
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{label}</div>
      {desc && <div style={{ fontSize: 12.5, color: C.mute, marginTop: 2.5, lineHeight: 1.55 }}>{desc}</div>}
    </div>
    {control}
  </div>
);

const SettingSegment = ({ value, options, onChange }) => (
  <div style={{ display: 'flex', gap: 2, background: C.soft, padding: 3, borderRadius: 9, width: 'fit-content' }}>
    {options.map(([v, label]) => (
      <button key={v} onClick={() => onChange(v)} style={{
        padding: '5px 13px', borderRadius: 7, border: 'none', cursor: 'pointer',
        fontSize: 12.5, fontWeight: value === v ? 600 : 400,
        background: value === v ? 'white' : 'transparent',
        color: value === v ? C.text : C.sec,
        boxShadow: value === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.13s', fontFamily: "'Plus Jakarta Sans', sans-serif",
        whiteSpace: 'nowrap',
      }}>{label}</button>
    ))}
  </div>
);

const SettingSection = ({ title, children }) => (
  <div>
    <div className="p-section-lbl" style={{ marginBottom: 10 }}>{title}</div>
    <div className="p-card" style={{ overflow: 'hidden' }}>{children}</div>
  </div>
);

// ── Settings ──────────────────────────────────────────────────────────────────
const SettingsScreen = () => {
  const [s, setS] = useState({
    saveLearningHistory: true,
    useMistakes: true,
    showCoach: true,
    hintFreq: 'balanced',
    explanationStyle: 'step-by-step',
    encouragementTone: 'balanced',
    dailyChallenge: true,
    streakReminder: true,
    weeklyProgress: false,
    lightMode: true,
    density: 'comfortable',
    accent: '#4A90E2',
    largerFormulas: false,
    reduceMotion: false,
    highContrast: false,
  });

  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  const ACCENTS = [
    '#4A90E2', '#5FBF8F', '#F47C7C', '#8B6FD4', '#E8943A',
  ];

  return (
    <div className="p-scroll" style={{ background: C.bg, padding: '32px 40px' }}>
      <ScreenHeader
        title="Settings"
        subtitle="Privacy, preferences, and personalization."
      />

      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 26 }}>

        {/* 1 · Privacy & data */}
        <SettingSection title="Privacy & data">
          <SettingRow
            label="Save learning history"
            desc="Store your problem attempts and results locally."
            control={<SettingToggle value={s.saveLearningHistory} onChange={v => set('saveLearningHistory', v)}/>}
          />
          <SettingRow
            label="Use mistakes to personalize practice"
            desc="Pico uses error patterns to shape your exercises."
            control={<SettingToggle value={s.useMistakes} onChange={v => set('useMistakes', v)}/>}
          />
          <SettingRow
            label="Export learning data"
            desc="Download all your history and signals as JSON."
            control={<Btn variant="secondary" size="sm">Export</Btn>}
          />
          <SettingRow
            label="Delete learning data"
            desc="Permanently remove all stored history and signals."
            control={<Btn variant="coral" size="sm">Delete</Btn>}
            last
          />
        </SettingSection>

        {/* 2 · Pico preferences */}
        <SettingSection title="Pico preferences">
          <SettingRow
            label="Coach panel"
            desc="Show Pico alongside exercises and the Visual Lab."
            control={<SettingToggle value={s.showCoach} onChange={v => set('showCoach', v)}/>}
          />
          <SettingRowStacked
            label="Hint frequency"
            desc="How often Pico offers hints during practice."
            control={<SettingSegment value={s.hintFreq} onChange={v => set('hintFreq', v)}
              options={[['low','Low'],['balanced','Balanced'],['high','High']]}/>}
          />
          <SettingRowStacked
            label="Explanation style"
            desc="How Pico explains concepts and feedback."
            control={<SettingSegment value={s.explanationStyle} onChange={v => set('explanationStyle', v)}
              options={[['simple','Simple'],['step-by-step','Step-by-step'],['technical','Technical']]}/>}
          />
          <SettingRowStacked
            label="Encouragement tone"
            desc="The style of Pico's motivational messages."
            control={<SettingSegment value={s.encouragementTone} onChange={v => set('encouragementTone', v)}
              options={[['calm','Calm'],['balanced','Balanced'],['direct','More direct']]}/>}
            last
          />
        </SettingSection>

        {/* 3 · Notifications */}
        <SettingSection title="Notifications">
          <SettingRow
            label="Daily challenge reminder"
            desc="A nudge each day to maintain your streak."
            control={<SettingToggle value={s.dailyChallenge} onChange={v => set('dailyChallenge', v)}/>}
          />
          <SettingRow
            label="Streak reminder"
            desc="Alert when you haven't practiced yet today."
            control={<SettingToggle value={s.streakReminder} onChange={v => set('streakReminder', v)}/>}
          />
          <SettingRow
            label="Weekly progress summary"
            desc="A brief digest of your week, every Sunday."
            control={<SettingToggle value={s.weeklyProgress} onChange={v => set('weeklyProgress', v)}/>}
            last
          />
        </SettingSection>

        {/* 4 · Appearance */}
        <SettingSection title="Appearance">
          <SettingRow
            label="Light mode"
            control={<SettingToggle value={s.lightMode} onChange={v => set('lightMode', v)}/>}
          />
          <SettingRowStacked
            label="Layout density"
            desc="Adjust spacing throughout the app."
            control={<SettingSegment value={s.density} onChange={v => set('density', v)}
              options={[['compact','Compact'],['comfortable','Comfortable']]}/>}
          />
          <SettingRowStacked
            label="Accent color"
            desc="Used for buttons, highlights, and active states."
            control={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {ACCENTS.map(color => (
                  <button
                    key={color}
                    onClick={() => set('accent', color)}
                    title={color}
                    style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: color, border: 'none', cursor: 'pointer',
                      outline: s.accent === color ? `2.5px solid ${color}` : '2.5px solid transparent',
                      outlineOffset: 2,
                      transition: 'outline-color 0.14s, transform 0.12s',
                      transform: s.accent === color ? 'scale(1.18)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            }
            last
          />
        </SettingSection>

        {/* 5 · Accessibility */}
        <SettingSection title="Accessibility">
          <SettingRow
            label="Larger formulas"
            desc="Increase the size of mathematical notation throughout."
            control={<SettingToggle value={s.largerFormulas} onChange={v => set('largerFormulas', v)}/>}
          />
          <SettingRow
            label="Reduce motion"
            desc="Minimize animations and transitions."
            control={<SettingToggle value={s.reduceMotion} onChange={v => set('reduceMotion', v)}/>}
          />
          <SettingRow
            label="High contrast"
            desc="Increase contrast for better readability."
            control={<SettingToggle value={s.highContrast} onChange={v => set('highContrast', v)}/>}
            last
          />
        </SettingSection>

      </div>
    </div>
  );
};

Object.assign(window, { GrowthMapScreen, GrowthPathScreen, PracticeMissionsScreen, SettingsScreen });
