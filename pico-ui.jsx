// pico-ui.jsx — Pico mascot SVG, icons, sidebar, shared UI components

const { useState, useEffect, useRef } = React;

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:'#F7F8F4', surface:'#FFFFFF', soft:'#F1F3ED', border:'#E1E6DB',
  text:'#263238', sec:'#5F6468', mute:'#8A9188',
  red:'#D94F4F', blue:'#4A90E2', green:'#5FBF8F', yellow:'#F6C85F', coral:'#F47C7C',
  softBlue:'#EAF4FF', softGreen:'#EAF7EF', softYellow:'#FFF6DC', softCoral:'#FFF1F1',
};

// ── Pico mascot — African grey parrot ────────────────────────────────────────
const PicoAvatar = ({ size = 56, style: sx = {} }) => (
  <svg width={size} height={Math.round(size * 1.32)} viewBox="0 0 100 132"
    fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0, ...sx }}>

    {/* Red tail — the signature feature */}
    <path d="M41 102 C37 116 41 128 50 124 C59 128 63 116 59 102
             Q54 112 50 110 Q46 112 41 102Z" fill="#D94F4F"/>
    <path d="M50 110 L50 124" stroke="#B02828" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <path d="M44 107 C42 115 46 121 50 124" stroke="#B02828" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M56 107 C58 115 54 121 50 124" stroke="#B02828" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>

    {/* Body */}
    <ellipse cx="50" cy="79" rx="22" ry="25" fill="#7C8C7A"/>
    {/* Belly lighter patch */}
    <ellipse cx="50" cy="84" rx="12" ry="15" fill="#8C9C8A" opacity="0.5"/>
    {/* Wing edges */}
    <path d="M30 70 C28 82 30 95 32 103" stroke="#62726A" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M70 70 C72 82 70 95 68 103" stroke="#62726A" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M33 75 C31 85 32 93 34 100" stroke="#7C8C7A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M67 75 C69 85 68 93 66 100" stroke="#7C8C7A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>

    {/* Neck */}
    <ellipse cx="50" cy="56" rx="14" ry="12" fill="#8A9A88"/>

    {/* Head group — slight observational tilt */}
    <g transform="rotate(-5, 50, 37)">
      {/* Head */}
      <circle cx="50" cy="37" r="21" fill="#8A9A88"/>

      {/* Facial disc — pale grey, the most distinctive African grey feature */}
      <path d="M35 38 C35 26 42 19 50 19 C58 19 65 26 65 38
               C65 47 58 54 50 56 C42 54 35 47 35 38Z" fill="#BFC9BC"/>
      {/* Inner face lighter */}
      <ellipse cx="50" cy="40" rx="10" ry="9" fill="#CED6CB"/>

      {/* Right eye socket ring */}
      <circle cx="58" cy="32" r="8.5" fill="#DCE6D9"/>
      {/* Iris */}
      <circle cx="58" cy="32" r="5.8" fill="#181C16" className="pico-eye"/>
      {/* Pupil */}
      <circle cx="58" cy="32" r="3.2" fill="#0A0C08"/>
      {/* Highlight */}
      <circle cx="60.5" cy="29.5" r="2.4" fill="rgba(255,255,255,0.96)"/>
      <circle cx="56.5" cy="34" r="1.1" fill="rgba(255,255,255,0.28)"/>

      {/* Left eye (subtle — partially hidden by tilt) */}
      <ellipse cx="43" cy="33" rx="3" ry="4" fill="#DCE6D9" opacity="0.38"/>
      <circle cx="43" cy="34" r="2.5" fill="#181C16" opacity="0.35"/>

      {/* Beak — upper mandible */}
      <path d="M46 44 Q50 41 54 44 Q53 52 50 54 Q47 52 46 44Z" fill="#38362C"/>
      {/* Beak — lower mandible */}
      <path d="M47.5 50 Q50 55 52.5 50 L50 54Z" fill="#28261C"/>
      {/* Nostril */}
      <circle cx="48.5" cy="46" r="1.3" fill="rgba(0,0,0,0.22)"/>

      {/* Crown feathers */}
      <path d="M46 18 C45 12 49 9 50 16 C51 9 55 12 54 18"
        stroke="#8A9A88" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

// ── SVG icon set (Feather-style) ─────────────────────────────────────────────
const ICONS = {
  home:      <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  book:      <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="12" y1="6" x2="16" y2="6"/><line x1="12" y1="10" x2="16" y2="10"/></>,
  flask:     <><path d="M9 3h6M9 3v7l-5 11h16L15 10V3"/></>,
  map:       <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
  route:     <><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><path d="M8 18.5a10 10 0 0010-10"/></>,
  target:    <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  check:     <polyline points="20 6 9 17 4 12"/>,
  chevRight: <polyline points="9 18 15 12 9 6"/>,
  play:      <polygon points="5 3 19 12 5 21 5 3"/>,
  pause:     <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
  refresh:   <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
  signal:    <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
  sparkle:   <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></>,
  arrow:     <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  edit:      <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  scan:      <><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></>,
  info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
  zoomin:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>,
  user:       <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  award:      <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  zap:        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
};

const Icon = ({ n, size = 18, color = 'currentColor', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink:0 }}>
    {ICONS[n] || null}
  </svg>
);

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:'home',      label:'Home',              icon:'home'   },
  { id:'add',       label:'Add Problem',       icon:'plus'   },
  { id:'notebook',  label:'Smart Notebook',    icon:'book'   },
  { id:'lab',       label:'Visual Lab',        icon:'flask'  },
  { id:'growthmap', label:'Growth Map',        icon:'map'    },
  { id:'growthpath',label:'Growth Path',       icon:'route'  },
  { id:'missions',  label:'Practice Missions', icon:'target' },
  { id:'profile',   label:'Profile',           icon:'user'   },
];

const Sidebar = ({ page, setPage }) => (
  <div className="p-sidebar">
    {/* Logo */}
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 10px 16px', cursor:'pointer' }}
         onClick={() => setPage('home')}>
      <PicoAvatar size={34}/>
      <div>
        <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:'-0.02em', lineHeight:1.1 }}>PicoLab</div>
        <div style={{ fontSize:10, color:C.mute, fontWeight:500, letterSpacing:'0.04em', marginTop:1 }}>Visual STEM coach</div>
      </div>
    </div>

    <div className="p-divider"/>

    {/* Nav */}
    <div style={{ display:'flex', flexDirection:'column', gap:2, marginTop:6, flex:1 }}>
      {NAV_ITEMS.map(item => (
        <div key={item.id}
          className={`p-nav${page === item.id ? ' active' : ''}`}
          onClick={() => setPage(item.id)}>
          <Icon n={item.icon} size={16}/>
          {item.label}
        </div>
      ))}
    </div>

    <div className="p-divider" style={{ marginTop:'auto' }}/>
    <div className={`p-nav${page === 'settings' ? ' active' : ''}`}
         onClick={() => setPage('settings')} style={{ marginTop:4 }}>
      <Icon n="settings" size={16}/>Settings
    </div>

    {/* Bottom Pico note */}
    <div style={{ marginTop:14, padding:'10px 12px', background:C.softYellow, borderRadius:12, fontSize:12, color:'#886018', lineHeight:1.5 }}>
      <span style={{ fontWeight:700 }}>Pico's tip:</span> Mistakes are the most useful data in learning.
    </div>
  </div>
);

// ── Shared components ─────────────────────────────────────────────────────────

const Badge = ({ children, variant='grey', style:sx={} }) => (
  <span className={`p-badge p-badge-${variant}`} style={sx}>{children}</span>
);

const Btn = ({ children, variant='primary', size='', onClick, style:sx={} }) => (
  <button className={`p-btn p-btn-${variant}${size ? ' p-btn-'+size : ''}`}
          onClick={onClick} style={sx}>
    {children}
  </button>
);

const VTag = ({ children }) => <span className="p-vtag p-mono">{children}</span>;

// Formula display — clean monospace with optional size
const Formula = ({ children, size=18, color=C.text, weight=500, style:sx={} }) => (
  <span className="p-mono" style={{ fontSize:size, color, fontWeight:weight, lineHeight:1.4, ...sx }}>
    {children}
  </span>
);

// Pico coach panel — right side panel with mascot + message
const PicoPanel = ({ title='Pico says', message, extra, size=64 }) => (
  <div className="p-rpanel">
    {/* Avatar + name */}
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, paddingBottom:16, borderBottom:`1.5px solid ${C.border}` }}>
      <PicoAvatar size={size}/>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:C.mute }}>Pico</div>
    </div>

    {/* Title */}
    <div style={{ fontWeight:700, fontSize:13.5, color:C.sec }}>{title}</div>

    {/* Message */}
    <div style={{ fontSize:13.5, color:C.sec, lineHeight:1.65, padding:'12px 14px', background:C.soft, borderRadius:12 }}>
      {message}
    </div>

    {extra}
  </div>
);

// Section header within a screen
const ScreenHeader = ({ eyebrow, title, subtitle, actions }) => (
  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
    <div>
      {eyebrow && <div className="p-section-lbl" style={{ marginBottom:6 }}>{eyebrow}</div>}
      <h1 style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.03em', lineHeight:1.2 }}>{title}</h1>
      {subtitle && <p style={{ marginTop:6, fontSize:13.5, color:C.sec, lineHeight:1.6, maxWidth:560 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display:'flex', gap:8, flexShrink:0, marginTop:2 }}>{actions}</div>}
  </div>
);

// Small Pico inline note (used inside cards)
const PicoNote = ({ children, icon='info' }) => (
  <div style={{ display:'flex', gap:10, padding:'11px 14px', background:C.softBlue, borderRadius:12, alignItems:'flex-start' }}>
    <Icon n={icon} size={15} color={C.blue}/>
    <span style={{ fontSize:12.5, color:'#2A60A8', lineHeight:1.6 }}>{children}</span>
  </div>
);

// Learning signal card
const SignalCard = ({ title='Learning signal found', subtitle, message, unitReasoning, actions }) => (
  <div className="p-card-signal p-fade" style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:12 }}>
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <Icon n="signal" size={16} color="#C04040"/>
      <div>
        <div style={{ fontWeight:700, fontSize:13.5, color:'#B83030' }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:'#C05050', marginTop:1 }}>{subtitle}</div>}
      </div>
    </div>
    <p style={{ fontSize:13.5, color:C.sec, lineHeight:1.65 }}>{message}</p>
    {unitReasoning && (
      <div style={{ padding:'9px 14px', background:'rgba(244,124,124,0.10)', borderRadius:10, display:'flex', alignItems:'center', gap:8 }}>
        <Formula size={14} color="#7A2020">{unitReasoning}</Formula>
      </div>
    )}
    {actions && (
      <div style={{ display:'flex', flexWrap:'wrap', gap:7, paddingTop:2 }}>
        {actions}
      </div>
    )}
  </div>
);

// Dot grid hero background — subtle, math-notebook feeling
const DotGridBg = ({ children, style:sx={} }) => (
  <div style={{
    position:'relative',
    backgroundImage:'radial-gradient(circle, #D8DDD4 1px, transparent 0)',
    backgroundSize:'22px 22px',
    ...sx
  }}>
    {children}
  </div>
);

// Export all to window
Object.assign(window, {
  C, PicoAvatar, Icon, ICONS, Sidebar, Badge, Btn, VTag, Formula,
  PicoPanel, ScreenHeader, PicoNote, SignalCard, DotGridBg,
});
