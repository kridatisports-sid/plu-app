import { useState, useRef, useEffect, useCallback } from "react";

// ── Palette & theme ────────────────────────────────────────────
const T = {
  bg:      "#0A0F1E",
  surface: "#111827",
  card:    "#161D2F",
  border:  "#1E2D45",
  accent:  "#00C896",
  accent2: "#0EA5E9",
  warn:    "#F59E0B",
  danger:  "#EF4444",
  text:    "#F1F5F9",
  muted:   "#64748B",
  soft:    "#CBD5E1",
};

// ── Utility ────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

// ── Simulated nose-print hash ──────────────────────────────────
const genNosePrint = () => {
  const chars = "ABCDEF0123456789";
  return Array.from({length:32}, () => chars[Math.floor(Math.random()*chars.length)]).join("").match(/.{4}/g).join("-");
};

// ── Initial demo database ──────────────────────────────────────
const DEMO_PETS = [
  { id:uid(), name:"Bruno",  species:"Dog",  breed:"Labrador Retriever",   age:"3",  gender:"Male",   color:"Golden",      owner:"Rajesh Sharma",    ownerPhone:"9876543210", ownerEmail:"rajesh@email.com",  address:"Bandra, Mumbai",     status:"Registered", noseHash:genNosePrint(), regDate:"12 Jan 2025", vaccinated:true,  sterilised:true,  lastSeen:"Bandra", notes:"Friendly, loves water", photo:null, scans:[] },
  { id:uid(), name:"Misha",  species:"Cat",  breed:"Persian",              age:"5",  gender:"Female", color:"White/Grey",  owner:"Priya Nair",       ownerPhone:"8765432109", ownerEmail:"priya@email.com",   address:"Koramangala, Bengaluru", status:"Registered", noseHash:genNosePrint(), regDate:"03 Mar 2025", vaccinated:true,  sterilised:true,  lastSeen:"Koramangala", notes:"Indoor cat", photo:null, scans:[] },
  { id:uid(), name:"Rocky",  species:"Dog",  breed:"German Shepherd",      age:"2",  gender:"Male",   color:"Black/Tan",   owner:"Amit Verma",       ownerPhone:"7654321098", ownerEmail:"amit@email.com",    address:"Sector 18, Noida",   status:"Stray",      noseHash:genNosePrint(), regDate:"19 Feb 2025", vaccinated:false, sterilised:false, lastSeen:"Sector 21 Noida", notes:"Rescued from highway", photo:null, scans:[] },
  { id:uid(), name:"Lily",   species:"Dog",  breed:"Beagle",               age:"4",  gender:"Female", color:"Tri-color",   owner:"Sunita Rao",       ownerPhone:"6543210987", ownerEmail:"sunita@email.com",  address:"Anna Nagar, Chennai", status:"Registered", noseHash:genNosePrint(), regDate:"28 Apr 2025", vaccinated:true,  sterilised:true,  lastSeen:"Anna Nagar", notes:"Very active", photo:null, scans:[] },
  { id:uid(), name:"Tiger",  species:"Dog",  breed:"Indie/Mixed",          age:"1",  gender:"Male",   color:"Brown/White", owner:"Unknown",          ownerPhone:"—",          ownerEmail:"—",                 address:"Andheri, Mumbai",    status:"Stray",      noseHash:genNosePrint(), regDate:"07 May 2025", vaccinated:true,  sterilised:false, lastSeen:"Andheri West", notes:"Rescued by volunteer", photo:null, scans:[] },
];

// ── Icons (inline SVG) ─────────────────────────────────────────
const Icon = ({ name, size=20, color="currentColor" }) => {
  const paths = {
    paw: <><path d="M11 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3 5c-2.2 0-4 1.8-4 4 0 .7.2 1.4.5 2l.5 1c.4.8 1.1 1.4 2 1.7V19h2v-1.3c.9-.3 1.6-.9 2-1.7l.5-1c.3-.6.5-1.3.5-2 0-2.2-1.8-4-4-4z"/></>,
    camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    scan: <><polyline points="23 7 23 1 17 1"/><line x1="23" y1="1" x2="14" y2="10"/><polyline points="1 17 1 23 7 23"/><line x1="1" y1="23" x2="10" y2="14"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    db: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    chevron: <><polyline points="9 18 15 12 9 6"/></>,
    dna: <><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="M2 9c6.667 6 13.333 0 20 6"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    syringe: <><line x1="19" y1="5" x2="5" y2="19"/><path d="M14 5l5 5"/><path d="M11 2l2 2"/><path d="M8 18l-6 6 6-1 1-6"/><path d="M15 3l6 6"/></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    fingerprint: <><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ── Nose Scanner Component ─────────────────────────────────────
const NoseScanner = ({ onCapture, onClose, mode = "register" }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("init"); // init|scanning|processing|done|error
  const [progress, setProgress] = useState(0);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [scanLines, setScanLines] = useState([]);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    generateDots();
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const generateDots = () => {
    const d = Array.from({length: 60}, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 25 + Math.random() * 50,
      r: 0.8 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setDots(d);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width:{ideal:1280}, height:{ideal:720} } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setPhase("ready");
    } catch {
      setPhase("nocam");
    }
  };

  const runScan = () => {
    setPhase("scanning");
    setProgress(0);
    const lines = Array.from({length: 8}, (_, i) => ({ id: i, y: 10 + i * 10, delay: i * 0.15 }));
    setScanLines(lines);
    let p = 0;
    const iv = setInterval(() => {
      p += 1.2;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        captureFrame();
      }
    }, 40);
  };

  const captureFrame = () => {
    setPhase("processing");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const img = canvas.toDataURL("image/jpeg", 0.8);
      setCaptured(img);
    }
    setTimeout(() => {
      setPhase("done");
      if (stream) stream.getTracks().forEach(t => t.stop());
    }, 1800);
  };

  const handleDone = () => {
    const hash = genNosePrint();
    onCapture({ hash, image: captured });
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:100,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:480, padding:"0 20px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <div style={{ color:T.accent, fontFamily:"'Space Grotesk',sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>
              {mode === "register" ? "Nose Print Registration" : "Nose Print Identification"}
            </div>
            <div style={{ color:T.text, fontSize:20, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>
              Biometric Scanner
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8,
            padding:"8px 12px", color:T.muted, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="x" size={16} /> Cancel
          </button>
        </div>

        {/* Scanner viewport */}
        <div style={{ position:"relative", width:"100%", paddingBottom:"70%", borderRadius:16,
          overflow:"hidden", border:`2px solid ${phase==="done"?T.accent:T.border}`,
          boxShadow: phase==="done" ? `0 0 40px ${T.accent}44` : "none",
          transition:"all 0.4s ease", background:"#000" }}>

          {/* Video feed */}
          <video ref={videoRef} autoPlay playsInline muted
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
              opacity: phase==="nocam"||phase==="init"||phase==="done" ? 0 : 1, transition:"opacity 0.3s" }} />

          {/* Captured image */}
          {captured && (
            <img src={captured} alt="captured"
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
                opacity: phase==="done" ? 1 : 0, transition:"opacity 0.5s" }} />
          )}

          {/* Scan overlay */}
          {(phase==="scanning" || phase==="processing") && (
            <div style={{ position:"absolute", inset:0 }}>
              {/* Grid lines */}
              {scanLines.map(l => (
                <div key={l.id} style={{ position:"absolute", top:`${l.y}%`, left:0, right:0,
                  height:1, background:`linear-gradient(90deg, transparent, ${T.accent}66, transparent)`,
                  animation:`scanline 1.5s ${l.delay}s ease-in-out infinite` }} />
              ))}
              {/* Moving scan bar */}
              <div style={{ position:"absolute", left:0, right:0, height:3,
                background:`linear-gradient(90deg, transparent, ${T.accent}, ${T.accent2}, ${T.accent}, transparent)`,
                top:`${progress}%`, transition:"top 0.04s linear",
                boxShadow:`0 0 20px ${T.accent}` }} />
              {/* Corner brackets */}
              {[[0,0],[0,100],[100,0],[100,100]].map(([t,l], i) => (
                <div key={i} style={{ position:"absolute",
                  top:`${t===0?'5%':'auto'}`, bottom:`${t===100?'5%':'auto'}`,
                  left:`${l===0?'5%':'auto'}`, right:`${l===100?'5%':'auto'}`,
                  width:24, height:24,
                  borderTop: t===0 ? `2px solid ${T.accent}` : "none",
                  borderBottom: t===100 ? `2px solid ${T.accent}` : "none",
                  borderLeft: l===0 ? `2px solid ${T.accent}` : "none",
                  borderRight: l===100 ? `2px solid ${T.accent}` : "none",
                }} />
              ))}
              {/* Biometric dots */}
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.6 }}
                viewBox="0 0 100 70" preserveAspectRatio="none">
                {dots.map(d => (
                  <circle key={d.id} cx={d.x} cy={d.y} r={d.r}
                    fill={T.accent} opacity={0.4 + Math.random()*0.6} />
                ))}
                {dots.slice(0,20).map((d, i) => i < 19 && (
                  <line key={i} x1={d.x} y1={d.y} x2={dots[i+1].x} y2={dots[i+1].y}
                    stroke={T.accent} strokeWidth="0.3" opacity="0.3" />
                ))}
              </svg>
            </div>
          )}

          {/* Done overlay */}
          {phase === "done" && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              background:"linear-gradient(135deg, rgba(0,200,150,0.15), rgba(14,165,233,0.15))" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:T.accent,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 0 40px ${T.accent}`, marginBottom:16 }}>
                <Icon name="check" size={32} color="#000" />
              </div>
              <div style={{ color:T.accent, fontWeight:700, fontSize:18, fontFamily:"'Space Grotesk',sans-serif" }}>
                Print Captured
              </div>
            </div>
          )}

          {/* No camera */}
          {phase === "nocam" && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:12 }}>
              <Icon name="camera" size={48} color={T.muted} />
              <div style={{ color:T.muted, textAlign:"center", fontSize:14, padding:"0 20px" }}>
                Camera not available.<br/>A simulated scan will be performed.
              </div>
            </div>
          )}

          {/* Ready overlay */}
          {phase === "ready" && (
            <div style={{ position:"absolute", inset:0 }}>
              {[[0,0],[0,100],[100,0],[100,100]].map(([t,l], i) => (
                <div key={i} style={{ position:"absolute",
                  top:`${t===0?'5%':'auto'}`, bottom:`${t===100?'5%':'auto'}`,
                  left:`${l===0?'5%':'auto'}`, right:`${l===100?'5%':'auto'}`,
                  width:24, height:24,
                  borderTop: t===0 ? `2px solid ${T.muted}88` : "none",
                  borderBottom: t===100 ? `2px solid ${T.muted}88` : "none",
                  borderLeft: l===0 ? `2px solid ${T.muted}88` : "none",
                  borderRight: l===100 ? `2px solid ${T.muted}88` : "none",
                }} />
              ))}
              <div style={{ position:"absolute", bottom:12, left:0, right:0, textAlign:"center",
                color:T.muted, fontSize:12 }}>
                Position the pet's nose in the frame
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display:"none" }} />

        {/* Progress bar */}
        {(phase==="scanning"||phase==="processing") && (
          <div style={{ marginTop:16, height:4, background:T.border, borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, transition:"width 0.04s linear",
              background:`linear-gradient(90deg, ${T.accent}, ${T.accent2})`, borderRadius:4 }} />
          </div>
        )}

        {/* Status text */}
        <div style={{ marginTop:16, textAlign:"center", color:T.muted, fontSize:13 }}>
          { phase==="init"     && "Initialising camera..." }
          { phase==="ready"    && "Camera ready. Press Scan to begin." }
          { phase==="nocam"    && "Simulation mode active." }
          { phase==="scanning" && `Extracting biometric features… ${Math.round(progress)}%` }
          { phase==="processing"&&"Generating unique nose-print hash…" }
          { phase==="done"     && "Biometric data ready. Proceed to complete registration." }
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:12, marginTop:20 }}>
          { (phase==="ready"||phase==="nocam") && (
            <button onClick={runScan} style={{ flex:1, padding:"14px 0",
              background:`linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              border:"none", borderRadius:12, color:"#000", fontWeight:700, fontSize:15,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              fontFamily:"'Space Grotesk',sans-serif" }}>
              <Icon name="scan" size={18} color="#000" /> Begin Scan
            </button>
          )}
          { phase==="done" && (
            <button onClick={handleDone} style={{ flex:1, padding:"14px 0",
              background:`linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              border:"none", borderRadius:12, color:"#000", fontWeight:700, fontSize:15,
              cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif" }}>
              Use This Print ✓
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%,100%{opacity:0} 50%{opacity:1}
        }
      `}</style>
    </div>
  );
};

// ── Pet Card ───────────────────────────────────────────────────
const PetCard = ({ pet, onClick }) => {
  const statusColor = pet.status === "Registered" ? T.accent : T.warn;
  const species = pet.species === "Dog" ? "🐕" : pet.species === "Cat" ? "🐈" : "🐾";

  return (
    <div onClick={() => onClick(pet)}
      style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16,
        padding:20, cursor:"pointer", transition:"all 0.2s",
        display:"flex", gap:16, alignItems:"flex-start" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent+"66"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; }}>

      {/* Avatar */}
      <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg, ${T.accent}22, ${T.accent2}22)`,
        border:`1px solid ${T.accent}44`, display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0, fontSize:26 }}>
        {species}
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div style={{ fontWeight:700, fontSize:16, color:T.text, fontFamily:"'Space Grotesk',sans-serif" }}>
            {pet.name}
          </div>
          <span style={{ fontSize:10, padding:"3px 8px", borderRadius:20,
            background: statusColor+"22", color: statusColor, fontWeight:600, letterSpacing:0.5 }}>
            {pet.status}
          </span>
        </div>
        <div style={{ color:T.muted, fontSize:13, marginBottom:8 }}>
          {pet.breed} · {pet.age}yr · {pet.gender}
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {pet.vaccinated && (
            <span style={{ fontSize:10, color:T.accent, background:T.accent+"15", padding:"2px 7px", borderRadius:10 }}>
              ✓ Vaccinated
            </span>
          )}
          {pet.sterilised && (
            <span style={{ fontSize:10, color:T.accent2, background:T.accent2+"15", padding:"2px 7px", borderRadius:10 }}>
              ✓ Sterilised
            </span>
          )}
          {pet.noseHash && (
            <span style={{ fontSize:10, color:T.muted, background:T.border, padding:"2px 7px", borderRadius:10 }}>
              🔬 Biometric
            </span>
          )}
        </div>
        <div style={{ marginTop:8, fontSize:11, color:T.muted, display:"flex", alignItems:"center", gap:4 }}>
          <Icon name="map" size={11} color={T.muted} />
          {pet.lastSeen || pet.address}
        </div>
      </div>
    </div>
  );
};

// ── Pet Detail Modal ───────────────────────────────────────────
const PetDetail = ({ pet, onClose, onScan, onUpdate }) => {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...pet });

  const Field = ({ label, value, field, type="text" }) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:11, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
      {editing ? (
        <input value={form[field]||""} onChange={e => setForm(f => ({...f, [field]:e.target.value}))}
          type={type} style={{ width:"100%", background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:8, padding:"8px 12px", color:T.text, fontSize:14, boxSizing:"border-box",
            outline:"none" }} />
      ) : (
        <div style={{ color:T.text, fontSize:14 }}>{value || "—"}</div>
      )}
    </div>
  );

  const tabs = [
    { id:"profile", label:"Profile", icon:"paw" },
    { id:"medical", label:"Medical", icon:"syringe" },
    { id:"owner",   label:"Owner",   icon:"tag" },
    { id:"biometric",label:"Biometric",icon:"fingerprint" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:50,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20,
        width:"100%", maxWidth:520, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:`linear-gradient(135deg, ${T.accent}11, ${T.accent2}11)` }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif", color:T.text }}>
              {pet.species === "Dog" ? "🐕" : "🐈"} {pet.name}
            </div>
            <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>ID: {pet.id} · Reg: {pet.regDate}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setEditing(e => !e)} style={{ background:editing?T.accent+"22":"none",
              border:`1px solid ${editing?T.accent:T.border}`, borderRadius:8, padding:"7px 12px",
              color:editing?T.accent:T.muted, cursor:"pointer", fontSize:13, fontWeight:600 }}>
              {editing ? "Editing…" : "Edit"}
            </button>
            {editing && (
              <button onClick={() => { onUpdate({...form}); setEditing(false); }}
                style={{ background:T.accent, border:"none", borderRadius:8, padding:"7px 12px",
                  color:"#000", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                Save
              </button>
            )}
            <button onClick={onClose} style={{ background:"none", border:`1px solid ${T.border}`,
              borderRadius:8, padding:"7px 10px", color:T.muted, cursor:"pointer" }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, padding:"0 24px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:"12px 14px", background:"none", border:"none", cursor:"pointer",
                color: tab===t.id ? T.accent : T.muted, fontWeight: tab===t.id ? 700 : 400,
                fontSize:13, borderBottom: tab===t.id ? `2px solid ${T.accent}` : "2px solid transparent",
                display:"flex", alignItems:"center", gap:6, transition:"all 0.2s",
                fontFamily:"'Space Grotesk',sans-serif" }}>
              <Icon name={t.icon} size={14} color={tab===t.id?T.accent:T.muted} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto", padding:24 }}>
          {tab==="profile" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
                <Field label="Name" value={pet.name} field="name" />
                <Field label="Species" value={pet.species} field="species" />
                <Field label="Breed" value={pet.breed} field="breed" />
                <Field label="Age (years)" value={pet.age} field="age" type="number" />
                <Field label="Gender" value={pet.gender} field="gender" />
                <Field label="Colour / Markings" value={pet.color} field="color" />
                <Field label="Status" value={pet.status} field="status" />
                <Field label="Last Seen Location" value={pet.lastSeen} field="lastSeen" />
              </div>
              <Field label="Notes" value={pet.notes} field="notes" />
            </div>
          )}
          {tab==="medical" && (
            <div>
              <div style={{ display:"flex", gap:12, marginBottom:24 }}>
                {[["Vaccinated","vaccinated",T.accent],["Sterilised","sterilised",T.accent2]].map(([l,k,c]) => (
                  <div key={k} style={{ flex:1, background:pet[k]?c+"22":T.surface,
                    border:`1px solid ${pet[k]?c:T.border}`, borderRadius:12, padding:16, textAlign:"center" }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{pet[k]?"✅":"❌"}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:pet[k]?c:T.muted }}>{l}</div>
                  </div>
                ))}
              </div>
              <Field label="Registration Date" value={pet.regDate} field="regDate" />
              <Field label="Medical Notes" value={pet.notes} field="notes" />
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
                padding:16, marginTop:16 }}>
                <div style={{ fontSize:12, color:T.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>
                  Scan History
                </div>
                {(pet.scans||[]).length === 0 ? (
                  <div style={{ color:T.muted, fontSize:13 }}>No previous scans recorded.</div>
                ) : (
                  pet.scans.map((s,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
                      borderBottom: i<pet.scans.length-1?`1px solid ${T.border}`:"none" }}>
                      <span style={{ fontSize:13, color:T.text }}>{s.date}</span>
                      <span style={{ fontSize:13, color:T.muted }}>{s.location}</span>
                      <span style={{ fontSize:11, color:T.accent }}>MATCH ✓</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {tab==="owner" && (
            <div>
              <Field label="Owner Name" value={pet.owner} field="owner" />
              <Field label="Phone Number" value={pet.ownerPhone} field="ownerPhone" />
              <Field label="Email Address" value={pet.ownerEmail} field="ownerEmail" />
              <Field label="Address" value={pet.address} field="address" />
            </div>
          )}
          {tab==="biometric" && (
            <div>
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:20, marginBottom:16 }}>
                <div style={{ fontSize:11, color:T.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>
                  Nose-Print Hash (NP-256)
                </div>
                {pet.noseHash ? (
                  <div style={{ fontFamily:"monospace", fontSize:13, color:T.accent, wordBreak:"break-all",
                    background:T.accent+"11", padding:12, borderRadius:8, border:`1px solid ${T.accent}33` }}>
                    {pet.noseHash}
                  </div>
                ) : (
                  <div style={{ color:T.muted, fontSize:13 }}>No biometric data registered.</div>
                )}
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={onScan} style={{ flex:1, padding:"12px 0",
                  background:`linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                  border:"none", borderRadius:12, color:"#000", fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  fontFamily:"'Space Grotesk',sans-serif" }}>
                  <Icon name="scan" size={16} color="#000" />
                  {pet.noseHash ? "Re-scan Nose Print" : "Register Nose Print"}
                </button>
              </div>
              {pet.noseHash && (
                <div style={{ marginTop:16, background:T.accent+"11", border:`1px solid ${T.accent}33`,
                  borderRadius:12, padding:16 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <Icon name="shield" size={18} color={T.accent} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.accent, marginBottom:4 }}>
                        Biometric Verified
                      </div>
                      <div style={{ fontSize:12, color:T.muted }}>
                        This animal's identity is secured with a unique nose-print biometric. Match confidence threshold: 94.7%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Registration Form ──────────────────────────────────────────
const RegisterForm = ({ onSubmit, onClose }) => {
  const [step, setStep] = useState(1);
  const [noseData, setNoseData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({
    name:"", species:"Dog", breed:"", age:"", gender:"Male", color:"",
    owner:"", ownerPhone:"", ownerEmail:"", address:"",
    status:"Registered", vaccinated:false, sterilised:false, notes:""
  });

  const update = (k, v) => setForm(f => ({...f, [k]:v}));
  const Input = ({ label, field, type="text", placeholder="" }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:11, color:T.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>{label}</label>
      <input value={form[field]||""} onChange={e => update(field, e.target.value)} type={type} placeholder={placeholder}
        style={{ width:"100%", background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:10, padding:"10px 14px", color:T.text, fontSize:14, boxSizing:"border-box",
          outline:"none", transition:"border 0.2s" }}
        onFocus={e => e.target.style.borderColor=T.accent}
        onBlur={e => e.target.style.borderColor=T.border} />
    </div>
  );
  const Select = ({ label, field, options }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:11, color:T.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>{label}</label>
      <select value={form[field]} onChange={e => update(field, e.target.value)}
        style={{ width:"100%", background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:10, padding:"10px 14px", color:T.text, fontSize:14, boxSizing:"border-box",
          outline:"none", cursor:"pointer" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const steps = ["Animal Info", "Owner Info", "Medical", "Biometric"];

  return (
    <>
    {showScanner && (
      <NoseScanner mode="register"
        onCapture={(data) => { setNoseData(data); setShowScanner(false); }}
        onClose={() => setShowScanner(false)} />
    )}
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:40,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20,
        width:"100%", maxWidth:500, maxHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:T.accent, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:3 }}>
              New Registration
            </div>
            <div style={{ color:T.text, fontSize:18, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>
              Register Animal
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${T.border}`,
            borderRadius:8, padding:"7px 10px", color:T.muted, cursor:"pointer" }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Step indicators */}
        <div style={{ padding:"16px 24px", display:"flex", gap:6 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex:1 }}>
              <div style={{ height:3, borderRadius:4,
                background: i+1<=step ? `linear-gradient(90deg,${T.accent},${T.accent2})` : T.border,
                marginBottom:4, transition:"background 0.3s" }} />
              <div style={{ fontSize:10, color: i+1===step ? T.accent : T.muted, fontWeight: i+1===step ? 700 : 400 }}>
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* Form content */}
        <div style={{ flex:1, overflow:"auto", padding:"0 24px 24px" }}>
          {step === 1 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
                <Input label="Animal Name" field="name" placeholder="e.g. Bruno" />
                <Select label="Species" field="species" options={["Dog","Cat","Rabbit","Bird","Other"]} />
                <Input label="Breed" field="breed" placeholder="e.g. Labrador" />
                <Input label="Age (years)" field="age" type="number" placeholder="e.g. 3" />
                <Select label="Gender" field="gender" options={["Male","Female","Unknown"]} />
                <Input label="Colour / Markings" field="color" placeholder="e.g. Golden" />
              </div>
              <Select label="Status" field="status" options={["Registered","Stray","Missing","Adopted","Deceased"]} />
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, color:T.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>Notes</label>
                <textarea value={form.notes} onChange={e => update("notes", e.target.value)} rows={3}
                  placeholder="Any additional information..."
                  style={{ width:"100%", background:T.surface, border:`1px solid ${T.border}`,
                    borderRadius:10, padding:"10px 14px", color:T.text, fontSize:14, boxSizing:"border-box",
                    outline:"none", resize:"vertical" }} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <Input label="Owner Full Name" field="owner" placeholder="e.g. Rajesh Sharma" />
              <Input label="Phone Number" field="ownerPhone" placeholder="e.g. 9876543210" type="tel" />
              <Input label="Email Address" field="ownerEmail" placeholder="e.g. owner@email.com" type="email" />
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, color:T.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>Address</label>
                <textarea value={form.address} onChange={e => update("address", e.target.value)} rows={3}
                  placeholder="Full residential address..."
                  style={{ width:"100%", background:T.surface, border:`1px solid ${T.border}`,
                    borderRadius:10, padding:"10px 14px", color:T.text, fontSize:14, boxSizing:"border-box",
                    outline:"none", resize:"vertical" }} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                {[["vaccinated","Vaccinated","💉"],["sterilised","Sterilised","✂️"]].map(([k,l,ic]) => (
                  <button key={k} onClick={() => update(k, !form[k])}
                    style={{ padding:20, borderRadius:14, cursor:"pointer", textAlign:"center",
                      background: form[k] ? T.accent+"22" : T.surface,
                      border:`2px solid ${form[k] ? T.accent : T.border}`,
                      transition:"all 0.2s" }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>{ic}</div>
                    <div style={{ fontSize:14, fontWeight:600, color: form[k] ? T.accent : T.muted }}>{l}</div>
                    <div style={{ fontSize:11, color: form[k] ? T.accent : T.muted, marginTop:2 }}>
                      {form[k] ? "Yes" : "No / Unknown"}
                    </div>
                  </button>
                ))}
              </div>
              <Input label="Last Known Location" field="lastSeen" placeholder="e.g. Bandra, Mumbai" />
            </div>
          )}
          {step === 4 && (
            <div>
              <div style={{ textAlign:"center", padding:"24px 0 16px" }}>
                <div style={{ width:80, height:80, borderRadius:"50%",
                  background: noseData ? T.accent+"22" : T.surface,
                  border:`2px solid ${noseData ? T.accent : T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 16px", fontSize:36 }}>
                  {noseData ? "✅" : "🐽"}
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:"'Space Grotesk',sans-serif", marginBottom:6 }}>
                  {noseData ? "Nose Print Registered!" : "Capture Nose Print"}
                </div>
                <div style={{ fontSize:13, color:T.muted, marginBottom:20, lineHeight:1.5 }}>
                  {noseData
                    ? "The biometric data has been captured and will be stored securely in the database."
                    : "Take a clear photo of the animal's nose for biometric identification. This enables unique animal tracking."}
                </div>
                {noseData ? (
                  <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:14,
                    fontFamily:"monospace", fontSize:11, color:T.accent, wordBreak:"break-all", textAlign:"left" }}>
                    <div style={{ color:T.muted, fontSize:10, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>
                      NP-256 Hash
                    </div>
                    {noseData.hash}
                  </div>
                ) : null}
                <button onClick={() => setShowScanner(true)}
                  style={{ marginTop:16, padding:"12px 28px",
                    background: noseData ? T.surface : `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                    border: noseData ? `1px solid ${T.border}` : "none",
                    borderRadius:12, color: noseData ? T.muted : "#000",
                    fontWeight:700, cursor:"pointer", fontSize:14,
                    display:"flex", alignItems:"center", gap:8, margin:"16px auto 0",
                    fontFamily:"'Space Grotesk',sans-serif" }}>
                  <Icon name="scan" size={16} color={noseData?"#64748B":"#000"} />
                  {noseData ? "Re-capture" : "Launch Scanner"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", gap:12 }}>
          <button onClick={() => step > 1 ? setStep(s=>s-1) : onClose}
            style={{ padding:"11px 20px", background:"none", border:`1px solid ${T.border}`,
              borderRadius:10, color:T.muted, cursor:"pointer", fontSize:14 }}>
            {step > 1 ? "← Back" : "Cancel"}
          </button>
          <button
            onClick={() => {
              if (step < 4) setStep(s=>s+1);
              else {
                onSubmit({ ...form, id:uid(), regDate:now(), noseHash:noseData?.hash||null,
                  noseImage:noseData?.image||null, scans:[], lastSeen:form.lastSeen||form.address });
              }
            }}
            style={{ flex:1, padding:"11px 20px",
              background:`linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              border:"none", borderRadius:10, color:"#000", fontWeight:700, cursor:"pointer", fontSize:14,
              fontFamily:"'Space Grotesk',sans-serif" }}>
            {step < 4 ? "Continue →" : "✓ Complete Registration"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

// ── Identify Modal ─────────────────────────────────────────────
const IdentifyModal = ({ pets, onClose, onResult }) => {
  const [phase, setPhase] = useState("scanner");
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleCapture = (data) => {
    setPhase("matching");
    setTimeout(() => {
      const registered = pets.filter(p => p.noseHash);
      if (registered.length > 0) {
        const match = registered[Math.floor(Math.random() * registered.length)];
        const confidence = (88 + Math.random() * 11).toFixed(1);
        setResult({ match, confidence, hash:data.hash });
      } else {
        setResult({ match:null, hash:data.hash });
      }
      setPhase("result");
    }, 2000);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:60,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      {phase === "scanner" && (
        <NoseScanner mode="identify" onCapture={handleCapture} onClose={onClose} />
      )}
      {phase === "matching" && (
        <div style={{ textAlign:"center", color:T.text }}>
          <div style={{ width:80, height:80, borderRadius:"50%", border:`3px solid ${T.accent}`,
            margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center",
            animation:"spin 1s linear infinite" }}>
            <Icon name="search" size={32} color={T.accent} />
          </div>
          <div style={{ fontSize:20, fontWeight:700, marginBottom:8, fontFamily:"'Space Grotesk',sans-serif" }}>
            Searching Database…
          </div>
          <div style={{ color:T.muted }}>Comparing biometric signatures</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {phase === "result" && result && (
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20,
          width:"100%", maxWidth:420, padding:28 }}>
          {result.match ? (
            <>
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:T.accent,
                  display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px",
                  boxShadow:`0 0 40px ${T.accent}` }}>
                  <Icon name="check" size={36} color="#000" />
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:T.accent, fontFamily:"'Space Grotesk',sans-serif" }}>
                  Match Found!
                </div>
                <div style={{ color:T.muted, marginTop:4 }}>Confidence: {result.confidence}%</div>
              </div>
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
                <div style={{ fontSize:20, fontWeight:700, color:T.text, fontFamily:"'Space Grotesk',sans-serif", marginBottom:6 }}>
                  {result.match.species==="Dog"?"🐕":"🐈"} {result.match.name}
                </div>
                <div style={{ color:T.muted, fontSize:13, marginBottom:10 }}>{result.match.breed} · {result.match.gender} · {result.match.age}yr</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:12 }}>
                  {[["Owner",result.match.owner],["Phone",result.match.ownerPhone],["Status",result.match.status],["Last Seen",result.match.lastSeen]].map(([l,v]) => (
                    <div key={l}>
                      <div style={{ color:T.muted, marginBottom:2 }}>{l}</div>
                      <div style={{ color:T.text, fontWeight:600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={onClose} style={{ flex:1, padding:"11px 0",
                  background:"none", border:`1px solid ${T.border}`, borderRadius:10,
                  color:T.muted, cursor:"pointer" }}>
                  Close
                </button>
                <button onClick={() => { onResult(result.match); onClose(); }}
                  style={{ flex:2, padding:"11px 0",
                    background:`linear-gradient(135deg,${T.accent},${T.accent2})`,
                    border:"none", borderRadius:10, color:"#000", fontWeight:700, cursor:"pointer",
                    fontFamily:"'Space Grotesk',sans-serif" }}>
                  View Full Profile
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:T.warn+"22",
                  border:`2px solid ${T.warn}`, display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 14px" }}>
                  <Icon name="alert" size={36} color={T.warn} />
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:T.warn, fontFamily:"'Space Grotesk',sans-serif" }}>
                  No Match Found
                </div>
                <div style={{ color:T.muted, marginTop:4 }}>This animal is not in the database.</div>
              </div>
              <div style={{ fontSize:13, color:T.muted, marginBottom:20, lineHeight:1.6 }}>
                The nose-print scan did not match any registered animal. Consider registering this animal to help with future identification.
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={onClose} style={{ flex:1, padding:"11px 0",
                  background:"none", border:`1px solid ${T.border}`, borderRadius:10,
                  color:T.muted, cursor:"pointer" }}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── Dashboard stats ────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16,
    padding:"18px 20px", flex:1, minWidth:130 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
      <div style={{ fontSize:11, color:T.muted, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
      <div style={{ width:32, height:32, borderRadius:10, background:color+"22",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name={icon} size={16} color={color} />
      </div>
    </div>
    <div style={{ fontSize:28, fontWeight:800, color:T.text, fontFamily:"'Space Grotesk',sans-serif" }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{sub}</div>}
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [pets, setPets] = useState(DEMO_PETS);
  const [view, setView] = useState("home");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSpecies, setFilterSpecies] = useState("All");
  const [showRegister, setShowRegister] = useState(false);
  const [showIdentify, setShowIdentify] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [scanTarget, setScanTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addPet = (pet) => {
    setPets(p => [pet, ...p]);
    setShowRegister(false);
    showToast(`${pet.name} registered successfully!`);
  };

  const updatePet = (updated) => {
    setPets(p => p.map(pet => pet.id === updated.id ? updated : pet));
    setSelectedPet(updated);
    showToast("Record updated.");
  };

  const handleRescan = () => {
    setScanTarget(selectedPet);
    setSelectedPet(null);
  };

  const handleScanDone = (data) => {
    const updated = { ...scanTarget, noseHash:data.hash, noseImage:data.image,
      scans:[...(scanTarget.scans||[]), { date:now(), location:"Manual rescan" }] };
    updatePet(updated);
    setScanTarget(null);
    setSelectedPet(updated);
    showToast("Nose print updated!");
  };

  const filtered = pets.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q)
      || p.owner.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    const matchS = filterStatus==="All" || p.status===filterStatus;
    const matchSp = filterSpecies==="All" || p.species===filterSpecies;
    return matchQ && matchS && matchSp;
  });

  const stats = {
    total: pets.length,
    registered: pets.filter(p => p.status==="Registered").length,
    stray: pets.filter(p => p.status==="Stray").length,
    biometric: pets.filter(p => p.noseHash).length,
  };

  const navItems = [
    { id:"home", icon:"home", label:"Home" },
    { id:"database", icon:"db", label:"Database" },
    { id:"track", icon:"map", label:"Track" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text,
      fontFamily:"'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto",
      position:"relative" }}>

      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
          zIndex:200, background: toast.type==="success" ? T.accent : T.danger,
          color:"#000", padding:"10px 20px", borderRadius:40, fontSize:13, fontWeight:600,
          boxShadow:"0 8px 32px rgba(0,0,0,0.4)", whiteSpace:"nowrap",
          animation:"slideDown 0.3s ease" }}>
          {toast.type==="success" ? "✓" : "!"} {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showRegister && <RegisterForm onSubmit={addPet} onClose={() => setShowRegister(false)} />}
      {showIdentify && (
        <IdentifyModal pets={pets} onClose={() => setShowIdentify(false)}
          onResult={pet => { setSelectedPet(pet); setView("database"); }} />
      )}
      {selectedPet && (
        <PetDetail pet={selectedPet} onClose={() => setSelectedPet(null)}
          onScan={handleRescan} onUpdate={updatePet} />
      )}
      {scanTarget && (
        <NoseScanner mode="register" onCapture={handleScanDone}
          onClose={() => { setScanTarget(null); setSelectedPet(scanTarget); }} />
      )}

      {/* ── HOME ── */}
      {view === "home" && (
        <div style={{ flex:1, padding:"24px 20px 100px" }}>
          {/* Header */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:11, color:T.accent, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>
                  Animal Welfare
                </div>
                <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1.2 }}>
                  PawPrint<br/>
                  <span style={{ background:`linear-gradient(90deg,${T.accent},${T.accent2})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Registry</span>
                </div>
              </div>
              <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${T.accent},${T.accent2})`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                🐾
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
            <StatCard icon="paw" label="Total Animals" value={stats.total} color={T.accent2} />
            <StatCard icon="shield" label="Registered" value={stats.registered} color={T.accent} />
            <StatCard icon="alert" label="Stray / Rescued" value={stats.stray} color={T.warn} />
            <StatCard icon="fingerprint" label="Biometric ID" value={stats.biometric} color="#A78BFA" />
          </div>

          {/* Quick actions */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:12, color:T.muted, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>
              Quick Actions
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <button onClick={() => setShowRegister(true)}
                style={{ padding:"20px 16px", borderRadius:16,
                  background:`linear-gradient(135deg,${T.accent}22,${T.accent2}11)`,
                  border:`1px solid ${T.accent}44`, cursor:"pointer", textAlign:"left" }}>
                <div style={{ marginBottom:10 }}><Icon name="plus" size={22} color={T.accent} /></div>
                <div style={{ fontSize:15, fontWeight:700, color:T.text, fontFamily:"'Space Grotesk',sans-serif" }}>
                  Register Animal
                </div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>New pet + nose print</div>
              </button>
              <button onClick={() => setShowIdentify(true)}
                style={{ padding:"20px 16px", borderRadius:16,
                  background:`linear-gradient(135deg,#A78BFA22,#7C3AED11)`,
                  border:"1px solid #A78BFA44", cursor:"pointer", textAlign:"left" }}>
                <div style={{ marginBottom:10 }}><Icon name="scan" size={22} color="#A78BFA" /></div>
                <div style={{ fontSize:15, fontWeight:700, color:T.text, fontFamily:"'Space Grotesk',sans-serif" }}>
                  Identify Animal
                </div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Scan to find owner</div>
              </button>
              <button onClick={() => setView("database")}
                style={{ padding:"20px 16px", borderRadius:16,
                  background:`linear-gradient(135deg,${T.accent2}22,${T.accent}11)`,
                  border:`1px solid ${T.accent2}44`, cursor:"pointer", textAlign:"left" }}>
                <div style={{ marginBottom:10 }}><Icon name="search" size={22} color={T.accent2} /></div>
                <div style={{ fontSize:15, fontWeight:700, color:T.text, fontFamily:"'Space Grotesk',sans-serif" }}>
                  Search Database
                </div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Find any animal</div>
              </button>
              <button onClick={() => setView("track")}
                style={{ padding:"20px 16px", borderRadius:16,
                  background:"linear-gradient(135deg,#F59E0B22,#EF444411)",
                  border:"1px solid #F59E0B44", cursor:"pointer", textAlign:"left" }}>
                <div style={{ marginBottom:10 }}><Icon name="map" size={22} color={T.warn} /></div>
                <div style={{ fontSize:15, fontWeight:700, color:T.text, fontFamily:"'Space Grotesk',sans-serif" }}>
                  Track & Locate
                </div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Last seen locations</div>
              </button>
            </div>
          </div>

          {/* Recent */}
          <div>
            <div style={{ fontSize:12, color:T.muted, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>
              Recently Registered
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {pets.slice(0,3).map(p => (
                <PetCard key={p.id} pet={p} onClick={setSelectedPet} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DATABASE ── */}
      {view === "database" && (
        <div style={{ flex:1, padding:"24px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:T.accent, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>
              Animal Database
            </div>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif" }}>
              {filtered.length} Records
            </div>
          </div>

          {/* Search */}
          <div style={{ position:"relative", marginBottom:12 }}>
            <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}>
              <Icon name="search" size={16} color={T.muted} />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, breed, owner, location…"
              style={{ width:"100%", background:T.card, border:`1px solid ${T.border}`,
                borderRadius:12, padding:"11px 14px 11px 42px", color:T.text, fontSize:14,
                boxSizing:"border-box", outline:"none" }} />
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            {["All","Registered","Stray","Missing"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:12, cursor:"pointer",
                  background: filterStatus===s ? T.accent+"22" : T.card,
                  border:`1px solid ${filterStatus===s ? T.accent : T.border}`,
                  color: filterStatus===s ? T.accent : T.muted, fontWeight: filterStatus===s ? 600 : 400 }}>
                {s}
              </button>
            ))}
            {["All","Dog","Cat"].map(s => (
              <button key={s} onClick={() => setFilterSpecies(s)}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:12, cursor:"pointer",
                  background: filterSpecies===s ? T.accent2+"22" : T.card,
                  border:`1px solid ${filterSpecies===s ? T.accent2 : T.border}`,
                  color: filterSpecies===s ? T.accent2 : T.muted, fontWeight: filterSpecies===s ? 600 : 400 }}>
                {s==="All"?"All Species":s}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:T.muted }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
                No animals found matching your search.
              </div>
            ) : filtered.map(p => (
              <PetCard key={p.id} pet={p} onClick={setSelectedPet} />
            ))}
          </div>
        </div>
      )}

      {/* ── TRACK ── */}
      {view === "track" && (
        <div style={{ flex:1, padding:"24px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:T.accent, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>
              Location Tracking
            </div>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif" }}>
              Animal Tracker
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ borderRadius:16, overflow:"hidden", border:`1px solid ${T.border}`,
            marginBottom:20, position:"relative", height:200,
            background:`linear-gradient(135deg, #0D1B2A, #1a2640)` }}>
            <div style={{ position:"absolute", inset:0, opacity:0.3 }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                {Array.from({length:8}, (_,i) => (
                  <line key={i} x1={i*50} y1="0" x2={i*50} y2="200" stroke="#00C896" strokeWidth="0.5" opacity="0.5" />
                ))}
                {Array.from({length:5}, (_,i) => (
                  <line key={i} x1="0" y1={i*50} x2="400" y2={i*50} stroke="#00C896" strokeWidth="0.5" opacity="0.5" />
                ))}
              </svg>
            </div>
            {[{x:80,y:80,name:"Bruno",c:T.accent},{x:200,y:120,name:"Rocky",c:T.warn},{x:300,y:60,name:"Lily",c:T.accent2}].map(p => (
              <div key={p.name} style={{ position:"absolute", left:p.x, top:p.y, transform:"translate(-50%,-50%)" }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:p.c,
                  boxShadow:`0 0 16px ${p.c}`, border:"2px solid #fff" }} />
                <div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)",
                  background:"rgba(0,0,0,0.7)", color:p.c, fontSize:10, padding:"2px 6px",
                  borderRadius:4, whiteSpace:"nowrap", fontWeight:600 }}>{p.name}</div>
              </div>
            ))}
            <div style={{ position:"absolute", bottom:12, right:12, background:"rgba(0,0,0,0.6)",
              color:T.muted, fontSize:10, padding:"4px 10px", borderRadius:6 }}>
              Live tracking requires GPS integration
            </div>
          </div>

          {/* Tracking list */}
          <div style={{ fontSize:12, color:T.muted, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>
            Last Known Locations
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {pets.map(p => (
              <div key={p.id} onClick={() => setSelectedPet(p)}
                style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14,
                  padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14,
                  transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor=T.accent+"66"}
                onMouseLeave={e => e.currentTarget.style.borderColor=T.border}>
                <div style={{ width:40, height:40, borderRadius:12,
                  background:`linear-gradient(135deg,${T.accent}22,${T.accent2}22)`,
                  border:`1px solid ${T.accent}33`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22 }}>
                  {p.species==="Dog"?"🐕":"🐈"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, fontFamily:"'Space Grotesk',sans-serif", color:T.text }}>{p.name}</div>
                  <div style={{ fontSize:12, color:T.muted, display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                    <Icon name="map" size={11} color={T.muted} /> {p.lastSeen || p.address}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ fontSize:10, padding:"3px 8px", borderRadius:20,
                    background: p.status==="Registered" ? T.accent+"22" : T.warn+"22",
                    color: p.status==="Registered" ? T.accent : T.warn }}>
                    {p.status}
                  </span>
                  <div style={{ fontSize:10, color:T.muted }}>{p.regDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, background:T.surface, borderTop:`1px solid ${T.border}`,
        display:"flex", padding:"10px 20px 16px", zIndex:30 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)}
            style={{ flex:1, background:"none", border:"none", cursor:"pointer", padding:"6px 0",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <Icon name={item.icon} size={22} color={view===item.id ? T.accent : T.muted} />
            <span style={{ fontSize:11, color: view===item.id ? T.accent : T.muted,
              fontWeight: view===item.id ? 700 : 400 }}>
              {item.label}
            </span>
          </button>
        ))}
        <button onClick={() => setShowRegister(true)}
          style={{ position:"absolute", left:"50%", transform:"translateX(-50%) translateY(-50%)", top:0,
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.accent},${T.accent2})`,
            border:`3px solid ${T.surface}`, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 20px ${T.accent}66` }}>
          <Icon name="plus" size={22} color="#000" />
        </button>
      </div>

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translate(-50%,-10px)} to{opacity:1;transform:translate(-50%,0)} }
        * { -webkit-tap-highlight-color: transparent; }
        input::placeholder { color: #475569; }
        textarea::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 4px; }
        select option { background: #111827; }
      `}</style>
    </div>
  );
}
