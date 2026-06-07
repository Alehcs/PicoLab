// pico-app.jsx — Main app shell, routing, tweaks, mount

const { useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#4A90E2",
  "showCoach": true,
  "density": "comfortable"
}/*EDITMODE-END*/;

const App = () => {
  const [page, setPage]   = useState('home');
  const [t, setTweak]     = useTweaks(TWEAK_DEFAULTS);

  // Apply accent color to CSS custom property
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    // Patch buttons that use hard-coded blue — override via CSS var if set
  }, [t.accent]);

  const renderPage = () => {
    switch (page) {
      case 'home':       return <HomeScreen       setPage={setPage}/>;
      case 'add':        return <AddProblemScreen  setPage={setPage}/>;
      case 'scan':       return <ScanConfirmScreen setPage={setPage}/>;
      case 'notebook':   return <SmartNotebookScreen setPage={setPage}/>;
      case 'lab':        return <VisualLabScreen   setPage={setPage}/>;
      case 'growthmap':  return <GrowthMapScreen   setPage={setPage}/>;
      case 'growthpath': return <GrowthPathScreen  setPage={setPage}/>;
      case 'missions':   return <PracticeMissionsScreen setPage={setPage}/>;
      case 'profile':    return <ProfileScreen   setPage={setPage}/>;
      case 'settings':   return <SettingsScreen/>;
      default:           return <HomeScreen setPage={setPage}/>;
    }
  };

  return (
    <div className="p-app">
      <Sidebar page={page} setPage={setPage}/>

      <div className="p-content">
        {renderPage()}
      </div>

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Accent color"/>
        <TweakColor
          label="Primary"
          value={t.accent}
          options={['#4A90E2', '#5FBF8F', '#F47C7C', '#8B6FD4']}
          onChange={v => setTweak('accent', v)}
        />
        <TweakSection label="Layout"/>
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'comfortable']}
          onChange={v => setTweak('density', v)}
        />
        <TweakToggle
          label="Coach panel"
          value={t.showCoach}
          onChange={v => setTweak('showCoach', v)}
        />
      </TweaksPanel>

      {/* Accent color injection */}
      <style>{`
        .p-btn-primary  { background: ${t.accent} !important; }
        .p-btn-primary:hover { background: color-mix(in srgb, ${t.accent} 85%, black) !important; }
        .p-nav.active   { color: ${t.accent} !important; }
        .p-tab.active   { color: ${t.accent} !important; }
        .p-badge-blue   { color: color-mix(in srgb, ${t.accent} 75%, #1A2A40) !important; }
        .p-range::-webkit-slider-thumb { background: ${t.accent} !important; }
        .p-input:focus  { border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${t.accent}18 !important; }
        .p-chip:hover, .p-chip.sel { background: ${t.accent}14 !important; border-color: ${t.accent}60 !important; color: ${t.accent} !important; }
        .p-pbar-fill    { background: ${t.accent === '#5FBF8F' ? '#5FBF8F' : t.accent === '#F47C7C' ? '#F47C7C' : '#5FBF8F'} !important; }
        .p-opt:hover    { border-color: ${t.accent} !important; background: ${t.accent}10 !important; }
        ${t.density === 'compact' ? `
          .p-card    { border-radius: 12px !important; }
          .p-btn     { padding: 7px 14px !important; }
          .p-rpanel, .p-lpanel { padding: 16px 14px !important; }
        ` : ''}
      `}</style>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
