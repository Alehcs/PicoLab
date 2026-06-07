// pico-screens-2.jsx — Smart Notebook + Visual Lab

const { useState, useEffect, useRef } = React;

// ── Smart Notebook ────────────────────────────────────────────────────────────
const SmartNotebookScreen = ({ setPage }) => {
  const [step2Fixed, setStep2Fixed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>

      {/* LEFT — problem context */}
      <div className="p-lpanel">
        <div>
          <Badge variant="blue" style={{ marginBottom:10 }}>Physics · Kinematics</Badge>
          <h2 style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:'-0.02em', lineHeight:1.3 }}>Final velocity from acceleration</h2>
        </div>

        {/* Progress */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span className="p-section-lbl">Progress</span>
            <span style={{ fontSize:11, fontWeight:700, color:C.green }}>Step 2 of 4</span>
          </div>
          <div className="p-pbar-track">
            <div className="p-pbar-fill" style={{ width:'50%' }}/>
          </div>
        </div>

        <div className="p-divider"/>

        {/* Problem statement */}
        <div>
          <p className="p-section-lbl" style={{ marginBottom:8 }}>Problem</p>
          <p style={{ fontSize:13, color:C.sec, lineHeight:1.65 }}>
            A car starts from rest and accelerates at 2 m/s² for 5 s. What is its final velocity?
          </p>
        </div>

        {/* Known values */}
        <div>
          <p className="p-section-lbl" style={{ marginBottom:8 }}>Known values</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <VTag>v₀ = 0 m/s</VTag>
            <VTag>a = 2 m/s²</VTag>
            <VTag>t = 5 s</VTag>
          </div>
        </div>

        {/* Goal */}
        <div>
          <p className="p-section-lbl" style={{ marginBottom:8 }}>Find</p>
          <div style={{ padding:'10px 14px', background:C.softBlue, borderRadius:10, display:'inline-block' }}>
            <Formula size={15} color="#2770C2" weight={700}>v_f = ?</Formula>
          </div>
        </div>

        {/* Suggested formula */}
        <div>
          <p className="p-section-lbl" style={{ marginBottom:8 }}>Suggested formula</p>
          <div style={{ padding:'12px 14px', background:C.soft, borderRadius:12 }}>
            <Formula size={16} weight={600}>v = v₀ + at</Formula>
          </div>
          <button className="p-btn p-btn-ghost p-btn-xs" style={{ marginTop:7, color:C.blue, fontSize:12 }}>
            <Icon n="info" size={12}/> Why this formula?
          </button>
        </div>

        <div className="p-divider"/>

        <Btn variant="primary" size="sm" onClick={() => setPage('lab')} style={{ width:'100%' }}>
          <Icon n="flask" size={14}/> Open Visual Lab
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => setPage('growthmap')} style={{ width:'100%', justifyContent:'center' }}>
          View Growth Map
        </Btn>
      </div>

      {/* CENTER — notebook steps */}
      <div className="p-scroll" style={{ flex:1, padding:'28px 28px', background:C.bg, display:'flex', flexDirection:'column', gap:16 }}>

        {/* Page title */}
        <div style={{ marginBottom:4 }}>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, letterSpacing:'-0.03em' }}>Solve step by step</h1>
          <p style={{ fontSize:13, color:C.mute, marginTop:4 }}>Work through each step. Pico will catch small details as you go.</p>
        </div>

        {/* Step 1 — correct */}
        <div className="p-step">
          <div className="p-step-hd">
            <div className="p-step-num" style={{ background:C.softGreen, color:'#2A7850' }}>1</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Set up the formula with the known values.</div>
            </div>
            <Badge variant="green">✓ Correct</Badge>
          </div>
          <div className="p-step-bd" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <p className="p-section-lbl" style={{ marginBottom:8 }}>Your answer</p>
                <div style={{ padding:'12px 16px', background:C.soft, borderRadius:11 }}>
                  <Formula size={20} weight={600}>v = 0 + 2 · 5</Formula>
                </div>
              </div>
            </div>
            <div style={{ padding:'10px 14px', background:C.softGreen, borderRadius:10, display:'flex', gap:8, alignItems:'center' }}>
              <Icon n="check" size={14} color="#2A7850"/>
              <span style={{ fontSize:13, color:'#2A7850', fontWeight:500 }}>
                Nice setup. Your substitution is correct.
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 — learning signal */}
        <div className="p-step" style={{ borderColor: step2Fixed ? C.border : '#FDDADA' }}>
          <div className="p-step-hd">
            <div className="p-step-num" style={{ background: step2Fixed ? C.softGreen : C.softCoral, color: step2Fixed ? '#2A7850' : '#BF3A3A' }}>
              2
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Calculate the final value and include the unit.</div>
            </div>
            {step2Fixed
              ? <Badge variant="green">✓ Fixed</Badge>
              : <Badge variant="coral">Signal found</Badge>
            }
          </div>
          <div className="p-step-bd" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <p className="p-section-lbl" style={{ marginBottom:8 }}>Your answer</p>
              {step2Fixed ? (
                <div style={{ padding:'12px 16px', background:C.softGreen, borderRadius:11 }}>
                  <Formula size={20} weight={600} color="#257550">v = 10 m/s</Formula>
                </div>
              ) : (
                <div style={{ padding:'12px 16px', background:'#FFF8F8', border:`1.5px solid #FDDADA`, borderRadius:11 }}>
                  <Formula size={20} weight={600} color="#8A3030">v = 10 m</Formula>
                </div>
              )}
            </div>

            {step2Fixed ? (
              <div className="p-fade" style={{ padding:'10px 14px', background:C.softGreen, borderRadius:10, display:'flex', gap:8, alignItems:'center' }}>
                <Icon n="check" size={14} color="#2A7850"/>
                <span style={{ fontSize:13, color:'#2A7850', fontWeight:600 }}>
                  Exactly. Velocity is measured in m/s. This step is complete.
                </span>
              </div>
            ) : (
              <div className="p-fade">
                <SignalCard
                  subtitle="Small detail, big understanding."
                  message="Your calculation is right, but the unit needs a small adjustment. Since this is velocity, the unit should be m/s, not m."
                  unitReasoning="(m/s²) · s = m/s"
                  actions={[
                    <Btn key="fix" variant="coral" size="sm" onClick={() => setStep2Fixed(true)}>
                      Fix this step
                    </Btn>,
                    <Btn key="visual" variant="secondary" size="sm" onClick={() => setPage('lab')}>
                      <Icon n="flask" size={13}/> Show visual
                    </Btn>,
                    <Btn key="hint" variant="yellow" size="sm" onClick={() => setShowHint(p=>!p)}>
                      <Icon n="info" size={13}/> Give me a hint
                    </Btn>,
                    <Btn key="map" variant="ghost" size="sm" onClick={() => setPage('growthmap')}>
                      Add to Growth Map
                    </Btn>,
                  ]}
                />
                {showHint && (
                  <div className="p-card-hint p-fade" style={{ padding:'12px 16px', marginTop:10 }}>
                    <p style={{ fontSize:13, color:'#7A5010', lineHeight:1.6 }}>
                      <span style={{ fontWeight:700 }}>Hint: </span>
                      Think about what the <em>unit</em> of the answer tells you. Acceleration is in m/s². Multiply by time (s) and one of those seconds cancels.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Steps 3 & 4 — locked */}
        {[3,4].map(n => (
          <div key={n} className="p-step" style={{ opacity:0.45 }}>
            <div className="p-step-hd">
              <div className="p-step-num" style={{ background:C.soft, color:C.mute }}>{n}</div>
              <div style={{ fontSize:13, fontWeight:500, color:C.mute }}>
                {n===3 ? 'Verify the answer against the formula.' : 'Write a complete answer sentence with units.'}
              </div>
              <Badge variant="grey">Locked</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT — Pico coach */}
      <PicoPanel
        title="Pico says"
        message="You're close. The math is working — we just need the physics unit to match the quantity."
        size={64}
        extra={
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="p-divider"/>
            <p className="p-section-lbl">Pattern tracker</p>
            <div style={{ padding:'11px 14px', background:C.softCoral, borderRadius:11 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#BF3A3A', marginBottom:3 }}>Unit mismatch</div>
              <div style={{ fontSize:12, color:'#C05050' }}>Seen 3 times</div>
            </div>
            <p style={{ fontSize:12.5, color:C.sec, lineHeight:1.65 }}>
              This may become a focus area in your Growth Path.
            </p>
            <div className="p-divider"/>
            <Btn variant="secondary" size="sm" onClick={() => setPage('growthpath')} style={{ width:'100%' }}>
              View Growth Path
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => setPage('growthmap')} style={{ width:'100%', justifyContent:'center' }}>
              Open Growth Map
            </Btn>
          </div>
        }
      />
    </div>
  );
};

// ── Visual Lab ────────────────────────────────────────────────────────────────
const VisualLabScreen = ({ setPage }) => {
  const [v0, setV0]   = useState(0);
  const [a, setA]     = useState(2);
  const [tMax, setTMax] = useState(5);
  const [ct, setCt]   = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed]     = useState(1);

  const tMaxRef = useRef(tMax);
  tMaxRef.current = tMax;

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCt(prev => {
        const next = prev + 0.08 * speed;
        if (next >= tMaxRef.current) { setPlaying(false); return tMaxRef.current; }
        return next;
      });
    }, 40);
    return () => clearInterval(id);
  }, [playing, speed]);

  const vCurrent = v0 + a * ct;
  const vFinal   = v0 + a * tMax;
  const maxDist  = v0 * tMax + 0.5 * a * tMax * tMax;
  const curDist  = v0 * ct  + 0.5 * a * ct  * ct;
  const carPct   = maxDist > 0 ? Math.min(curDist / maxDist, 1) : 0;

  const reset = () => { setPlaying(false); setCt(0); };

  // SVG velocity graph
  const VGraph = () => {
    const L=50, R=340, T=18, B=174;
    const W=R-L, H=B-T;
    const mxT = tMax + 0.6;
    const mxV = Math.max(vFinal + 2, 4);
    const tx = t  => L + (t/mxT)*W;
    const vy = v  => B - (v/mxV)*H;

    const tTicks = Array.from({length:Math.floor(tMax)+1},(_,i)=>i);
    const vTicks = [];
    const vstep = mxV > 12 ? 4 : 2;
    for (let v=0; v<=mxV; v+=vstep) vTicks.push(v);

    return (
      <svg viewBox="0 0 390 210" style={{ width:'100%' }}>
        {/* Grid */}
        {tTicks.map(i=> <line key={i} x1={tx(i)} y1={T} x2={tx(i)} y2={B} stroke="#E8EDE4" strokeWidth="1"/>)}
        {vTicks.map(v=> <line key={v} x1={L} y1={vy(v)} x2={R} y2={vy(v)} stroke="#E8EDE4" strokeWidth="1"/>)}

        {/* Axes */}
        <line x1={L} y1={T-4} x2={L} y2={B+18} stroke="#B0B8AE" strokeWidth="1.5"/>
        <line x1={L-8} y1={B}  x2={R+10} y2={B} stroke="#B0B8AE" strokeWidth="1.5"/>

        {/* Axis labels */}
        {tTicks.filter(i=>i>0).map(i=>(
          <text key={i} x={tx(i)} y={B+30} textAnchor="middle" fill="#8A9188" fontSize="11" fontFamily="JetBrains Mono">{i}</text>
        ))}
        {vTicks.filter(v=>v>0).map(v=>(
          <text key={v} x={L-8} y={vy(v)+4} textAnchor="end" fill="#8A9188" fontSize="11" fontFamily="JetBrains Mono">{v}</text>
        ))}
        <text x={R+16} y={B+4} fill="#8A9188" fontSize="11" fontFamily="JetBrains Mono">t(s)</text>
        <text x={L-5} y={T-8} textAnchor="middle" fill="#8A9188" fontSize="11" fontFamily="JetBrains Mono">v (m/s)</text>

        {/* Projected line (ghost) */}
        <line x1={tx(0)} y1={vy(v0)} x2={tx(tMax)} y2={vy(vFinal)}
          stroke="#4A90E2" strokeWidth="1.5" opacity="0.18" strokeDasharray="5,3"/>

        {/* Actual line */}
        {ct > 0 && (
          <line x1={tx(0)} y1={vy(v0)} x2={tx(ct)} y2={vy(vCurrent)}
            stroke="#4A90E2" strokeWidth="2.5"/>
        )}

        {/* Final highlight */}
        {ct >= tMax && (
          <>
            <circle cx={tx(tMax)} cy={vy(vFinal)} r="11" fill="#4A90E2" opacity="0.12"/>
            <circle cx={tx(tMax)} cy={vy(vFinal)} r="5.5" fill="#4A90E2"/>
            <text x={tx(tMax)+13} y={vy(vFinal)-7} fill="#4A90E2" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">
              ({tMax}s, {vFinal.toFixed(0)} m/s)
            </text>
          </>
        )}

        {/* Moving dot */}
        {ct > 0 && ct < tMax && (
          <circle cx={tx(ct)} cy={vy(vCurrent)} r="5.5" fill="#4A90E2"/>
        )}

        {/* Origin */}
        <circle cx={tx(0)} cy={vy(v0)} r="4" fill="white" stroke="#4A90E2" strokeWidth="2"/>
      </svg>
    );
  };

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:C.bg }}>

      {/* LEFT — controls */}
      <div className="p-lpanel" style={{ gap:18 }}>
        <div>
          <Badge variant="blue" style={{ marginBottom:8 }}>Visual Lab</Badge>
          <h2 style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:'-0.02em', lineHeight:1.3 }}>Kinematics: final velocity</h2>
          <p style={{ fontSize:12, color:C.mute, marginTop:5 }}>Drag sliders to explore. Pico watches the graph.</p>
        </div>

        <div className="p-divider"/>

        {/* Sliders */}
        {[
          { label:'Initial velocity', sym:'v₀', unit:'m/s', val:v0, min:0, max:10, set:setV0 },
          { label:'Acceleration',     sym:'a',  unit:'m/s²', val:a, min:0, max:8, set:setA  },
          { label:'Time',             sym:'t',  unit:'s',    val:tMax, min:1, max:10, set:v => { setTMax(v); if(ct>v) setCt(v); } },
        ].map(sl => (
          <div key={sl.sym}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, alignItems:'baseline' }}>
              <span style={{ fontSize:12.5, color:C.sec, fontWeight:600 }}>{sl.label}</span>
              <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                <Formula size={16} weight={700} color={C.blue}>{sl.val}</Formula>
                <span style={{ fontSize:11, color:C.mute }}>{sl.unit}</span>
              </div>
            </div>
            <input type="range" className="p-range"
              min={sl.min} max={sl.max} step="0.5" value={sl.val}
              onChange={e => { sl.set(parseFloat(e.target.value)); reset(); }}
            />
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:3 }}>
              <span style={{ fontSize:10.5, color:C.mute }}>{sl.min} {sl.unit}</span>
              <span style={{ fontSize:10.5, color:C.mute }}>{sl.max} {sl.unit}</span>
            </div>
          </div>
        ))}

        <div className="p-divider"/>

        {/* Live formula */}
        <div>
          <p className="p-section-lbl" style={{ marginBottom:10 }}>Live formula</p>
          <div style={{ padding:'12px 14px', background:C.soft, borderRadius:12, display:'flex', flexDirection:'column', gap:4 }}>
            <Formula size={14} color={C.mute}>v = v₀ + at</Formula>
            <Formula size={16} weight={600}>v = {v0} + ({a})({tMax})</Formula>
            <Formula size={18} weight={700} color={C.blue}>v = {vFinal.toFixed(1)} m/s</Formula>
          </div>
        </div>

        <Btn variant="secondary" size="sm" onClick={() => setPage('notebook')} style={{ marginTop:'auto' }}>
          ← Back to Notebook
        </Btn>
      </div>

      {/* CENTER — simulation */}
      <div className="p-scroll" style={{ flex:1, padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, letterSpacing:'-0.03em' }}>Motion simulation</h1>
          <p style={{ fontSize:13, color:C.mute, marginTop:4 }}>Current mission: Final velocity from acceleration</p>
        </div>

        {/* Track / car animation */}
        <div className="p-card" style={{ padding:'24px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div>
              <span style={{ fontSize:12, color:C.mute }}>Time: </span>
              <Formula size={14} weight={700} color={C.blue}>{ct.toFixed(1)} s</Formula>
              <span style={{ marginLeft:16, fontSize:12, color:C.mute }}>Velocity: </span>
              <Formula size={14} weight={700} color={C.green}>{vCurrent.toFixed(1)} m/s</Formula>
            </div>
            {ct >= tMax && (
              <div style={{ padding:'5px 12px', background:C.softGreen, borderRadius:20, fontSize:12, fontWeight:700, color:'#2A7850' }}>
                At t = {tMax}s → velocity is {vFinal.toFixed(0)} m/s
              </div>
            )}
          </div>

          {/* Track */}
          <div style={{ position:'relative', height:64, margin:'8px 0 4px' }}>
            {/* Road */}
            <div style={{ position:'absolute', top:30, left:20, right:20, height:4, background:'#E1E6DB', borderRadius:2 }}/>
            {/* Start marker */}
            <div style={{ position:'absolute', top:18, left:18, height:28, width:2, background:C.mute }}/>
            <span style={{ position:'absolute', top:50, left:14, fontSize:10, color:C.mute, fontFamily:'JetBrains Mono' }}>0</span>
            {/* End marker */}
            <div style={{ position:'absolute', top:18, right:18, height:28, width:2, background:C.green }}/>
            <span style={{ position:'absolute', top:50, right:10, fontSize:10, color:C.green, fontFamily:'JetBrains Mono', fontWeight:700 }}>{vFinal.toFixed(0)} m/s</span>
            {/* Car */}
            <div style={{
              position:'absolute', top:18, left:20,
              transform:`translateX(${carPct * (document.querySelector('.p-scroll') ? Math.max(0, (document.querySelector('.p-scroll').getBoundingClientRect().width - 330)) : 280) * 0.88}px)`,
              transition: playing ? 'none' : 'transform 0.15s ease',
              width:28, height:20, display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {/* Simple car */}
              <svg width="36" height="20" viewBox="0 0 36 20">
                <rect x="2" y="8" width="32" height="10" rx="3" fill={C.blue}/>
                <rect x="7" y="2" width="18" height="8" rx="2" fill="#3A7FD0"/>
                <circle cx="9" cy="19" r="4" fill={C.text}/>
                <circle cx="9" cy="19" r="2" fill="#8A9A88"/>
                <circle cx="27" cy="19" r="4" fill={C.text}/>
                <circle cx="27" cy="19" r="2" fill="#8A9A88"/>
              </svg>
            </div>
          </div>

          {/* Playback controls */}
          <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:12 }}>
            <button className="p-btn p-btn-primary p-btn-sm" onClick={() => { if(ct>=tMax) reset(); setPlaying(p=>!p); }}>
              <Icon n={playing ? 'pause' : 'play'} size={14}/> {playing ? 'Pause' : ct>=tMax ? 'Replay' : ct>0 ? 'Resume':'Play'}
            </button>
            <button className="p-btn p-btn-secondary p-btn-sm" onClick={reset}>
              <Icon n="refresh" size={13}/> Reset
            </button>
            <div style={{ display:'flex', gap:7, marginLeft:'auto', alignItems:'center' }}>
              <span style={{ fontSize:12, color:C.mute }}>Speed:</span>
              {[['0.5×',0.5],['1×',1],['2×',2]].map(([lbl,v])=>(
                <button key={lbl} className={`p-btn p-btn-xs ${speed===v ? 'p-btn-primary':'p-btn-secondary'}`}
                        onClick={()=>setSpeed(v)}>{lbl}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Velocity graph */}
        <div className="p-card" style={{ padding:'20px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:C.text }}>Velocity – Time graph</h3>
              <p style={{ fontSize:12, color:C.mute, marginTop:2 }}>The slope shows constant acceleration.</p>
            </div>
            {ct >= tMax && <Badge variant="blue">Complete</Badge>}
          </div>
          <VGraph/>
        </div>
      </div>

      {/* RIGHT — Pico */}
      <PicoPanel
        title="Pico explains"
        message={ct >= tMax
          ? `The graph ends at ${vFinal.toFixed(0)} m/s, so the answer describes velocity. That is why the unit is meters per second, not meters.`
          : "Try adjusting the sliders. Notice how the slope of the graph changes with acceleration. Steeper slope = faster change in velocity."}
        size={64}
        extra={
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="p-divider"/>
            <p className="p-section-lbl">Unit insight</p>
            <div style={{ padding:'11px 14px', background:C.softBlue, borderRadius:11 }}>
              <Formula size={13} color="#2A60A8">(m/s²) · s = m/s</Formula>
              <p style={{ fontSize:12, color:'#2A60A8', marginTop:6, lineHeight:1.6 }}>
                The seconds cancel from the denominator, leaving meters per second.
              </p>
            </div>
            <div className="p-divider"/>
            <Btn variant="secondary" size="sm" onClick={() => setPage('notebook')} style={{ width:'100%' }}>
              Back to Notebook
            </Btn>
          </div>
        }
      />
    </div>
  );
};

Object.assign(window, { SmartNotebookScreen, VisualLabScreen });
