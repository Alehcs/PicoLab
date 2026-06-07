// pico-screens-1.jsx — Home, Add Problem, Scan & Confirm

const { useState } = React;

// ── Home / Dashboard ──────────────────────────────────────────────────────────
const HomeScreen = ({ setPage }) => (
  <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>

    {/* Main scroll */}
    <div className="p-scroll" style={{ padding:'32px 36px', background:C.bg }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:12, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:C.mute, marginBottom:6 }}>Sunday, June 6</p>
        <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.035em', color:C.text, lineHeight:1.15 }}>Welcome back, Alex.</h1>
        <p style={{ marginTop:7, fontSize:14, color:C.sec, lineHeight:1.6 }}>
          Pick up where you left off, or start a new STEM mission with Pico.
        </p>
      </div>

      {/* Hero card */}
      <DotGridBg style={{ borderRadius:22, marginBottom:20, overflow:'hidden', border:`1.5px solid ${C.border}`, background:'white' }}>
        <div style={{ padding:'32px 36px', position:'relative' }}>
          {/* Decorative formula ghost */}
          <div className="p-mono" style={{
            position:'absolute', right:32, top:24,
            fontSize:42, color:'rgba(74,144,226,0.07)', fontWeight:700, userSelect:'none',
            letterSpacing:'-0.02em', pointerEvents:'none'
          }}>v = v₀ + at</div>

          <Badge variant="blue" style={{ marginBottom:14 }}>Start here</Badge>
          <h2 style={{ fontSize:21, fontWeight:800, color:C.text, letterSpacing:'-0.03em', lineHeight:1.2, maxWidth:460, marginBottom:10 }}>
            Learn from the step,<br/>not just the answer.
          </h2>
          <p style={{ fontSize:13.5, color:C.sec, lineHeight:1.7, maxWidth:500, marginBottom:22 }}>
            PicoLab helps you solve math and physics problems visually, spot learning signals,
            and build a practice path around the concepts that need attention.
          </p>
          <div style={{ display:'flex', gap:10 }}>
            <Btn onClick={() => setPage('missions')}>
              <Icon n="target" size={15}/> Start a mission
            </Btn>
            <Btn variant="secondary" onClick={() => setPage('notebook')}>
              Try sample problem
            </Btn>
          </div>
        </div>
      </DotGridBg>

      {/* Mini preview — learning signal example */}
      <div className="p-card" style={{ padding:'18px 22px', marginBottom:20, display:'flex', gap:20, alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          <p className="p-section-lbl" style={{ marginBottom:10 }}>Recent learning signal</p>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
            <span style={{ fontSize:12, color:C.sec, fontWeight:500 }}>Student answer</span>
            <Formula size={16} color={C.text} weight={600}>v = 10 m</Formula>
          </div>
          <div style={{ padding:'10px 14px', background:C.softCoral, borderRadius:11, fontSize:13, color:'#B83030', lineHeight:1.6 }}>
            <span style={{ fontWeight:700 }}>Pico noticed: </span>
            The number is right. The unit should be <Formula size={13} color="#B83030" weight={700}>m/s</Formula>, not <Formula size={13} color="#B83030">m</Formula>.
          </div>
        </div>
        <div style={{ flexShrink:0, textAlign:'center', paddingTop:4 }}>
          <Badge variant="coral">Learning signal found</Badge>
          <div style={{ marginTop:10 }}>
            <Btn variant="ghost" size="sm" onClick={() => setPage('notebook')} style={{ fontSize:12 }}>
              Open Notebook <Icon n="chevRight" size={13}/>
            </Btn>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
        {[
          { label:'Current focus', value:'Units in motion', sub:'Active learning area', bg:C.softYellow, tc:'#886018', bc:'#FDEEBA' },
          { label:'Latest signal',  value:'Unit mismatch',   sub:'Seen 4 times this week', bg:C.softCoral,  tc:'#BF3A3A', bc:'#FDDADA' },
          { label:'Next skill',     value:'Velocity vs. distance', sub:'Ready to practice', bg:C.softBlue, tc:'#2770C2', bc:'#B8D8F4' },
        ].map(card => (
          <div key={card.label} style={{ background:card.bg, border:`1.5px solid ${card.bc}`, borderRadius:16, padding:'18px 20px' }}>
            <p className="p-section-lbl" style={{ color:card.tc, marginBottom:8, opacity:0.75 }}>{card.label}</p>
            <p style={{ fontSize:15, fontWeight:700, color:card.tc, lineHeight:1.3, marginBottom:4 }}>{card.value}</p>
            <p style={{ fontSize:12, color:card.tc, opacity:0.75 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div style={{ marginTop:20, display:'flex', gap:10, flexWrap:'wrap' }}>
        {[['notebook','Open Smart Notebook'],['lab','Visual Lab'],['growthmap','Growth Map'],['missions','Practice Missions']].map(([id,label])=>(
          <Btn key={id} variant="secondary" size="sm" onClick={() => setPage(id)}>
            {label} <Icon n="chevRight" size={13}/>
          </Btn>
        ))}
      </div>
    </div>

    {/* Pico coach */}
    <PicoPanel
      title="Pico's note"
      message="Mistakes are useful here. I'll help you turn each one into a signal, then into practice."
      size={72}
      extra={
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
          <div className="p-divider"/>
          <p className="p-section-lbl">Today's snapshot</p>
          {[
            { label:'Problems solved', val:'3', color:C.green },
            { label:'Signals found',   val:'2', color:C.coral },
            { label:'Skills practiced',val:'1', color:C.blue  },
          ].map(row => (
            <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12.5, color:C.sec }}>{row.label}</span>
              <span style={{ fontSize:14, fontWeight:700, color:row.color }}>{row.val}</span>
            </div>
          ))}
          <div className="p-divider"/>
          <Btn variant="primary" size="sm" onClick={() => setPage('growthpath')} style={{ width:'100%' }}>
            View Growth Path <Icon n="chevRight" size={13}/>
          </Btn>
        </div>
      }
    />
  </div>
);

// ── Add Problem ───────────────────────────────────────────────────────────────
const AddProblemScreen = ({ setPage }) => {
  const [tab, setTab] = useState('scan');
  const [selectedChips, setSelectedChips] = useState([]);
  const [formulaText, setFormulaText] = useState('v = v₀ + at');
  const [problemText, setProblemText] = useState('');

  const toggleChip = (c) => setSelectedChips(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);
  const CHIPS = ['Kinematics','Linear functions','Units','Graph reading','Algebra steps','Vectors'];
  const TOOLBAR = ['x²','√','π','Δ','θ','±','≤','≥','→','m/s','m/s²','N','J'];

  return (
    <div className="p-scroll" style={{ padding:'32px 36px', background:C.bg, maxWidth:860 }}>
      <ScreenHeader
        eyebrow="New problem"
        title="Add Problem"
        subtitle="Scan, type, or build a formula. Pico will extract every number, sign, and unit before you start solving."
      />

      {/* Tab bar */}
      <div style={{ display:'flex', gap:4, background:C.soft, padding:4, borderRadius:12, marginBottom:28, width:'fit-content' }}>
        {[['scan','Scan image'],['type','Type problem'],['formula','Formula editor']].map(([id,label])=>(
          <button key={id} className={`p-tab${tab===id?' active':''}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {/* Scan tab */}
      {tab === 'scan' && (
        <div className="p-fade">
          <div className="p-upload" onClick={() => setPage('scan')}>
            <Icon n="scan" size={40} color="#B0B8AE"/>
            <h3 style={{ marginTop:16, fontSize:17, fontWeight:700, color:C.text }}>Scan a worksheet or notebook page</h3>
            <p style={{ marginTop:8, fontSize:13.5, color:C.sec, lineHeight:1.65, maxWidth:400, margin:'8px auto 20px' }}>
              Upload a clear image. Pico will extract the problem, then you can review every number, sign, formula, and unit before continuing.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <Btn>Upload image</Btn>
              <Btn variant="secondary" onClick={e => { e.stopPropagation(); setPage('scan'); }}>Try sample scan</Btn>
            </div>
          </div>
          <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:8, padding:'10px 16px', background:C.softGreen, borderRadius:10 }}>
            <Icon n="check" size={14} color="#2A7850"/>
            <span style={{ fontSize:12.5, color:'#2A7850' }}>
              You'll always confirm the extracted problem before solving.
            </span>
          </div>
        </div>
      )}

      {/* Type tab */}
      {tab === 'type' && (
        <div className="p-fade" style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <textarea
            className="p-input"
            style={{ minHeight:110, fontSize:14 }}
            placeholder="Example: A car starts from rest and accelerates at 2 m/s² for 5 s. What is its final velocity?"
            value={problemText}
            onChange={e => setProblemText(e.target.value)}
          />
          <div>
            <p className="p-section-lbl" style={{ marginBottom:10 }}>Topic chips</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {CHIPS.map(c => (
                <button key={c} className={`p-chip${selectedChips.includes(c)?' sel':''}`}
                        onClick={() => toggleChip(c)}>{c}</button>
              ))}
            </div>
          </div>
          <Btn style={{ width:'fit-content' }} onClick={() => setPage('notebook')}>
            <Icon n="sparkle" size={15}/> Analyze problem
          </Btn>
        </div>
      )}

      {/* Formula editor tab */}
      {tab === 'formula' && (
        <div className="p-fade" style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <p className="p-section-lbl" style={{ marginBottom:10 }}>Formula toolbar</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {TOOLBAR.map(t => (
                <button key={t} className="p-toolbar-btn"
                        onClick={() => setFormulaText(p => p + t)}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="p-section-lbl" style={{ marginBottom:8 }}>Edit formula</p>
            <input className="p-input p-mono" style={{ fontSize:18 }}
                   value={formulaText}
                   onChange={e => setFormulaText(e.target.value)}/>
          </div>
          {/* Rendered preview */}
          <div className="p-card" style={{ padding:'20px 24px' }}>
            <p className="p-section-lbl" style={{ marginBottom:12 }}>Preview</p>
            <Formula size={24} weight={600}>{formulaText}</Formula>
          </div>
          <PicoNote>
            Use the formula editor when signs, powers, roots, or units matter.
          </PicoNote>
          <Btn style={{ width:'fit-content' }} onClick={() => setPage('notebook')}>
            <Icon n="sparkle" size={15}/> Analyze formula
          </Btn>
        </div>
      )}
    </div>
  );
};

// ── Scan & Confirm ────────────────────────────────────────────────────────────
const ScanConfirmScreen = ({ setPage }) => {
  const [ambiguityDismissed, setAmbiguityDismissed] = useState(false);
  const [problem, setProblem] = useState(
    'A car starts from rest and accelerates at 2 m/s² for 5 s. What is its final velocity?'
  );

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:C.bg }}>

      {/* Left — scan image */}
      <div className="p-lpanel" style={{ width:380, padding:24, gap:16 }}>
        <div>
          <h2 style={{ fontSize:17, fontWeight:800, color:C.text, letterSpacing:'-0.02em' }}>Original scan</h2>
          <p style={{ fontSize:12.5, color:C.sec, marginTop:4 }}>Zoom in to check exponents, negative signs, and units.</p>
        </div>

        {/* Fake scan image with highlights */}
        <div style={{ position:'relative', background:'#F5F0E8', border:`1.5px solid ${C.border}`, borderRadius:14, overflow:'hidden', aspectRatio:'3/4', flexShrink:0 }}>
          {/* Notebook lines */}
          {Array.from({length:14}).map((_,i)=>(
            <div key={i} style={{ position:'absolute', left:20, right:20, top:32+i*32, height:1, background:'rgba(150,160,180,0.18)' }}/>
          ))}
          {/* Simulated handwritten problem text */}
          <div style={{ position:'absolute', top:44, left:26, right:20, fontFamily:'Georgia, serif', fontSize:13, color:'#3A3020', lineHeight:2.2 }}>
            <div>A car starts from rest</div>
            <div>and accelerates at <span style={{ fontWeight:700 }}>2 m/s²</span></div>
            <div>for <span style={{ fontWeight:700 }}>5 s</span>. What is</div>
            <div>its final velocity?</div>
            <div style={{ marginTop:12, fontFamily:'JetBrains Mono, monospace', fontSize:12 }}>v₀ = 0</div>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:12 }}>a = 2 m/s²</div>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:12 }}>t = 5 s</div>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:12 }}>Find: v<sub>f</sub> = ?</div>
          </div>

          {/* Scan highlights */}
          <div className="p-scan-hl" style={{ top:74, left:113, width:44, height:20 }} title="2 m/s²"/>
          <div className="p-scan-hl" style={{ top:106, left:27, width:26, height:20 }} title="5 s"/>
          <div className="p-scan-hl" style={{ top:195, left:40, width:62, height:18 }} title="v₀ = 0"/>
          <div className="p-scan-hl" style={{ top:227, left:40, width:80, height:18 }} title="a = 2 m/s²"/>
          <div className="p-scan-hl" style={{ top:258, left:40, width:48, height:18 }} title="t = 5 s"/>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
          <Btn variant="ghost" size="sm"><Icon n="zoomin" size={13}/> Zoom</Btn>
          <Btn variant="ghost" size="sm"><Icon n="refresh" size={13}/> Rotate</Btn>
          <Btn variant="ghost" size="sm"><Icon n="edit" size={13}/> Replace</Btn>
        </div>
      </div>

      {/* Right — extracted problem + confirmation */}
      <div className="p-scroll" style={{ flex:1, padding:'28px 30px', display:'flex', flexDirection:'column', gap:18 }}>

        <ScreenHeader
          eyebrow="Step 1 of 2"
          title="Check the details"
          subtitle="Pico highlighted the numbers, signs, formulas, and units it found. Review them before solving."
        />

        {/* Ambiguity alert */}
        {!ambiguityDismissed && (
          <div className="p-card-hint p-fade" style={{ padding:'12px 16px', display:'flex', gap:12, alignItems:'flex-start' }}>
            <Icon n="info" size={16} color="#8A6018"/>
            <div style={{ flex:1 }}>
              <span style={{ fontWeight:700, fontSize:13, color:'#7A5010' }}>Needs a quick check: </span>
              <span style={{ fontSize:13, color:'#7A5010' }}>I'm not sure if this says <Formula size={13} color="#7A5010" weight={700}>5 s</Formula> or <Formula size={13} color="#7A5010" weight={700}>55 s</Formula>. Please confirm before solving.</span>
            </div>
            <button className="p-btn p-btn-ghost p-btn-xs" onClick={()=>setAmbiguityDismissed(true)} style={{ padding:'3px 7px', fontSize:12, color:C.mute }}>✕</button>
          </div>
        )}

        {/* Editable problem */}
        <div className="p-card" style={{ padding:'18px 22px' }}>
          <p className="p-section-lbl" style={{ marginBottom:10 }}>Extracted problem</p>
          <textarea className="p-input" style={{ minHeight:72, fontSize:14, lineHeight:1.7 }}
                    value={problem} onChange={e=>setProblem(e.target.value)}/>
        </div>

        {/* Detected values */}
        <div className="p-card" style={{ padding:'18px 22px' }}>
          <p className="p-section-lbl" style={{ marginBottom:12 }}>Detected values</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['v₀ = 0','initial velocity'],['a = 2 m/s²','acceleration'],['t = 5 s','time'],['Find: v_f','final velocity']].map(([val,desc])=>(
              <div key={val} style={{ display:'flex', flexDirection:'column', gap:3, padding:'10px 14px', background:C.soft, borderRadius:10 }}>
                <Formula size={15} weight={600}>{val}</Formula>
                <span style={{ fontSize:11, color:C.mute }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pico review */}
        <div style={{ padding:'14px 18px', background:C.softBlue, border:`1.5px solid #B8D8F4`, borderRadius:14, display:'flex', gap:12, alignItems:'flex-start' }}>
          <PicoAvatar size={32}/>
          <p style={{ fontSize:13.5, color:'#2A60A8', lineHeight:1.65 }}>
            I found a motion problem. The units suggest we are solving for final velocity, so the answer should likely be in <Formula size={13.5} color="#2A60A8" weight={700}>m/s</Formula>.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <Btn onClick={() => setPage('notebook')}>
            <Icon n="check" size={15}/> Looks good — start solving
          </Btn>
          <Btn variant="secondary"><Icon n="edit" size={14}/> Edit details</Btn>
          <Btn variant="secondary">Ask Pico to re-check</Btn>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { HomeScreen, AddProblemScreen, ScanConfirmScreen });
