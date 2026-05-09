const { useState, useRef, useEffect } = React;

// ─── TEMAS ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#0D0F18", card: "#161923", cardAlt: "#1E2235", border: "#252A40",
  accent: "#6C63FF", accentLight: "#9D97FF", accentBg: "#6C63FF18",
  text: "#EEF0FF", muted: "#6B6F8E",
  green: "#4ADE80", yellow: "#FACC15", red: "#F87171", blue: "#60A5FA",
  pink: "#F472B6", orange: "#FB923C",
  shadow: "0 24px 64px #00000066",
};
const LIGHT = {
  bg: "#F0F2FF", card: "#FFFFFF", cardAlt: "#E8ECFF", border: "#D8DCEF",
  accent: "#5B52F0", accentLight: "#5B52F0", accentBg: "#5B52F010",
  text: "#1A1D35", muted: "#7A7EA0",
  green: "#16A34A", yellow: "#CA8A04", red: "#DC2626", blue: "#2563EB",
  pink: "#DB2777", orange: "#EA580C",
  shadow: "0 24px 64px #0000001A",
};

// ─── DADOS MOCK ───────────────────────────────────────────────────────────────
const MOCK_FAMILIES = {
  "FAM-WAYNE": {
    name: "Wayne", admin: "twgldc@gmail.com", code: "FAM-WAYNE",
    members: [
      { id: 1, name: "Wayne",   email: "twgldc@gmail.com",  password: "011219", role: "admin",  function: "Chefe",  avatar: "👨", color: "#6C63FF", points: 0, permissions: { tasks:true,shopping:true,finance:true,calendar:true,goals:true,routine:true,reports:true,ai:true,notifications:true } },
      { id: 2, name: "Larissa", email: "Larissa@gmail.com", password: "111121", role: "member", function: "Esposa", avatar: "👩", color: "#F472B6", points: 0, permissions: { tasks:true,shopping:true,finance:true,calendar:true,goals:true,routine:true,reports:true,ai:true,notifications:true } },
    ]
  }
};

const INIT_TASKS = [
  { id:1, title:"Pagar conta de luz",      cat:"💰", memberId:1, due:"Hoje",   done:false, pts:20, pending_approval:false },
  { id:2, title:"Fazer compras do mês",    cat:"🛒", memberId:2, due:"Hoje",   done:false, pts:30, pending_approval:false },
  { id:3, title:"Renovar seguro do carro", cat:"💰", memberId:1, due:"Sex",    done:false, pts:25, pending_approval:false },
  { id:4, title:"Organizar a casa",        cat:"🏠", memberId:2, due:"Hoje",   done:false, pts:10, pending_approval:false },
  { id:5, title:"Pagar internet",          cat:"💰", memberId:1, due:"Amanhã", done:false, pts:15, pending_approval:false },
  { id:6, title:"Agendar consulta médica", cat:"📅", memberId:2, due:"Qui",    done:false, pts:20, pending_approval:false },
];

const INIT_SHOPPING = [
  { id:1, name:"Arroz 5kg",     qty:"1",   memberId:1, done:false },
  { id:2, name:"Feijão 1kg",    qty:"2",   memberId:2, done:false },
  { id:3, name:"Leite integral", qty:"6",  memberId:1, done:false },
  { id:4, name:"Frango",        qty:"2kg", memberId:2, done:false },
  { id:5, name:"Detergente",    qty:"3",   memberId:1, done:false },
  { id:6, name:"Sabão em pó",   qty:"1",   memberId:2, done:false },
];

const FINANCES = [
  { name:"Conta de Luz",  amount:210, due:"Hoje",   paid:false, icon:"💡", cat:"Utilidades"  },
  { name:"Internet",      amount:120, due:"5 Mai",  paid:false, icon:"📶", cat:"Utilidades"  },
  { name:"Escola/Curso",   amount:850, due:"10 Mai", paid:false, icon:"🎒", cat:"Educação"    },
  { name:"Mercado",       amount:680, due:"Pago",   paid:true,  icon:"🛒", cat:"Alimentação" },
  { name:"Seguro Carro",  amount:340, due:"2 Mai",  paid:false, icon:"🚗", cat:"Transporte"  },
  { name:"Streaming",     amount:55,  due:"8 Mai",  paid:false, icon:"📺", cat:"Lazer"       },
];

const EVENTS = [
  { day:"Seg", date:"28", items:[] },
  { day:"Ter", date:"29", items:[{ title:"Reunião escolar",  color:"#F472B6" }] },
  { day:"Qua", date:"30", items:[{ title:"Consulta médica",  color:"#60A5FA" }], today:true },
  { day:"Qui", date:"1",  items:[{ title:"Conta de luz",     color:"#FACC15" }] },
  { day:"Sex", date:"2",  items:[{ title:"Seguro carro",     color:"#FB923C" }] },
  { day:"Sáb", date:"3",  items:[] },
  { day:"Dom", date:"4",  items:[{ title:"Almoço família",   color:"#4ADE80" }] },
];

const ROUTINES = [
  { id:1, title:"Organizar a casa",    memberId:2, days:["Seg","Qua","Sex"],  time:"09:00", pts:15 },
  { id:2, title:"Pagar contas",        memberId:1, days:["Dom"],              time:"10:00", pts:30 },
  { id:3, title:"Compras do mercado",  memberId:2, days:["Sáb"],              time:"09:00", pts:25 },
  { id:4, title:"Verificar finanças",  memberId:1, days:["Seg"],              time:"20:00", pts:20 },
  { id:5, title:"Preparar o jantar",   memberId:2, days:["Ter","Qui","Sáb"], time:"18:00", pts:10 },
];

const GOALS = [
  { id:1, title:"Economizar R$ 500",     emoji:"💰", current:380, target:500, color:"#FACC15", deadline:"Mai 2025"    },
  { id:2, title:"Zero tarefas atrasadas",emoji:"✅", current:7,   target:10,  color:"#4ADE80", deadline:"Esta semana" },
  { id:3, title:"Todos estudam juntos",  emoji:"📚", current:2,   target:5,   color:"#60A5FA", deadline:"Este mês"    },
];

const NOTIFICATIONS_DATA = [
  { id:1, icon:"⚠️", title:"Conta de luz vence hoje!",   body:"R$ 210 — não esqueça de pagar.",          time:"08:00", read:false, color:"#FACC15" },
  { id:2, icon:"✅", title:"Larissa concluiu uma tarefa", body:"Organizar a casa marcada como feita.",     time:"19:32", read:false, color:"#4ADE80" },
  { id:3, icon:"🤖", title:"Sugestão da IA",              body:"Que tal planejar o cardápio da semana?",  time:"09:00", read:true,  color:"#6C63FF" },
  { id:4, icon:"🎯", title:"Meta quase lá!",              body:"Faltam R$ 120 para a meta de economia.",  time:"Ontem", read:true,  color:"#F472B6" },
  { id:5, icon:"📅", title:"Consulta médica amanhã",      body:"Wayne, lembre-se do compromisso.",         time:"Ontem", read:true,  color:"#60A5FA" },
];

const AI_RESPONSES = [
  "Analisando a rotina da família... 🧠\n\nWayne e Larissa têm tarefas bem distribuídas esta semana. Sugestão: adicionar 'Verificar despesas' (seg) e 'Planejar fim de semana' (sex) para manter o ritmo! ✅",
  "Há 3 contas a pagar esta semana. 📊\n\nSugestão: Wayne pode cuidar das contas de segunda e Larissa organiza as compras do mercado no sábado.",
  "Plano sugerido para a semana 📋:\n\n• Seg: Wayne — verificar finanças\n• Ter: Larissa — organizar casa\n• Qua: Wayne — pagar contas\n• Qui: Larissa — jantar especial\n• Sex: Wayne — seguro carro\n\nPosso criar essas tarefas automaticamente?",
];

const FUNCTIONS_LIST = ["Pai","Mãe","Filho","Filha","Avô","Avó","Outro"];
const AVATARS_LIST   = ["👨","👩","👧","👦","👴","👵","🧑","👶"];
const COLORS_LIST    = ["#F472B6","#60A5FA","#4ADE80","#FB923C","#FACC15","#A78BFA","#2DD4BF","#F87171"];
const SCREEN_LABELS  = { tasks:"Tarefas", shopping:"Compras", finance:"Finanças", calendar:"Agenda", goals:"Metas", routine:"Rotinas", reports:"Relatórios", ai:"IA Familiar", notifications:"Notificações" };

function genCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "FAM-" + Array.from({length:4}, () => c[Math.floor(Math.random()*c.length)]).join("");
}

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function AvatarBubble({ member, size=36, showName=false, showRole=false, T }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:member.color+"25", border:`2px solid ${member.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.48, flexShrink:0 }}>{member.avatar}</div>
      {(showName||showRole) && <div>
        {showName && <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{member.name}</div>}
        {showRole && <div style={{ fontSize:11, color:T.muted }}>{member.function}{member.role==="admin"?" · 👑 Admin":""}</div>}
      </div>}
    </div>
  );
}

function Btn({ children, onClick, T, variant="primary", full=false, small=false, disabled=false }) {
  const S = { primary:{background:T.accent,color:"#fff",border:"none"}, secondary:{background:T.cardAlt,color:T.text,border:`1.5px solid ${T.border}`}, ghost:{background:"transparent",color:T.accentLight,border:`1.5px solid ${T.accent}44`}, danger:{background:T.red+"18",color:T.red,border:`1.5px solid ${T.red}44`}, success:{background:T.green+"18",color:T.green,border:`1.5px solid ${T.green}44`} };
  return <button onClick={onClick} disabled={disabled} style={{ ...S[variant], borderRadius:14, padding:small?"8px 16px":"13px 20px", fontSize:small?12:14, fontWeight:800, cursor:disabled?"not-allowed":"pointer", width:full?"100%":"auto", opacity:disabled?0.5:1, transition:"all .2s" }}>{children}</button>;
}

function Card({ children, T, style={}, onClick }) {
  return <div onClick={onClick} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:16, cursor:onClick?"pointer":"default", ...style }}>{children}</div>;
}

function Tag({ color, children }) {
  return <span style={{ background:color+"20", color, border:`1px solid ${color}40`, borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{children}</span>;
}

function SecTitle({ children, T }) {
  return <div style={{ fontSize:11, fontWeight:800, color:T.muted, letterSpacing:1.2, marginBottom:10 }}>{children}</div>;
}

function FInput({ label, type="text", value, onChange, placeholder, T, icon }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:11, fontWeight:800, color:T.muted, letterSpacing:1 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>{icon}</span>}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{ width:"100%", background:T.cardAlt, border:`1.5px solid ${T.border}`, borderRadius:14, padding:icon?"13px 14px 13px 42px":"13px 16px", fontSize:14, color:T.text, outline:"none", boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=T.accent}
          onBlur={e=>e.target.style.borderColor=T.border}
        />
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function WelcomeScreen({ T, onLogin, onRegister, onJoin }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px 24px", minHeight:620 }}>
      <div style={{ fontSize:60, marginBottom:14 }}>🏠</div>
      <div style={{ fontSize:30, fontWeight:900, color:T.text, textAlign:"center", lineHeight:1.2, marginBottom:8 }}>Family<span style={{ color:T.accent }}>Flow</span></div>
      <div style={{ fontSize:14, color:T.muted, textAlign:"center", marginBottom:48, lineHeight:1.7 }}>Organize tarefas, finanças e compromissos da sua família em um só lugar.</div>
      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
        <Btn full T={T} onClick={onLogin}>Entrar na minha conta</Btn>
        <Btn full T={T} variant="ghost" onClick={onRegister}>Criar nova família</Btn>
        <div style={{ textAlign:"center", color:T.muted, fontSize:12, margin:"4px 0" }}>ou</div>
        <Btn full T={T} variant="secondary" onClick={onJoin}>Entrar com código de família</Btn>
      </div>
      <div style={{ marginTop:28, padding:"14px 16px", background:T.accentBg, border:`1px solid ${T.accent}33`, borderRadius:14, width:"100%", boxSizing:"border-box" }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.accentLight, marginBottom:6 }}>🧪 DEMO RÁPIDO</div>
        <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>
          <strong style={{ color:T.text }}>Wayne</strong>: twgldc@gmail.com / 011219 (Admin)<br/>
          <strong style={{ color:T.text }}>Larissa</strong>: Larissa@gmail.com / 111121
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ T, onBack, onSuccess }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function doLogin() {
    setErr(""); setLoading(true);
    setTimeout(() => {
      let found=null, fam=null;
      for (const [,f] of Object.entries(MOCK_FAMILIES)) {
        const m = f.members.find(m=>m.email===email && m.password===pass);
        if (m) { found=m; fam=f; break; }
      }
      if (found) onSuccess(found, fam);
      else setErr("E-mail ou senha incorretos.");
      setLoading(false);
    }, 700);
  }

  function doGoogle() {
    const m = MOCK_FAMILIES["FAM-WAYNE"].members[0];
    onSuccess(m, MOCK_FAMILIES["FAM-WAYNE"]);
  }

  return (
    <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:18, minHeight:620 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", textAlign:"left", padding:0 }}>← Voltar</button>
      <div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Bem-vindo(a) de volta 👋</div><div style={{ fontSize:13, color:T.muted, marginTop:4 }}>Entre na sua conta FamilyFlow</div></div>
      <button onClick={doGoogle} style={{ width:"100%", background:T.card, border:`1.5px solid ${T.border}`, borderRadius:14, padding:"13px", fontSize:14, fontWeight:700, color:T.text, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
        <span style={{ fontSize:18, fontWeight:900 }}>G</span> Continuar com Google
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}><div style={{ flex:1, height:1, background:T.border }}/><span style={{ fontSize:12, color:T.muted }}>ou</span><div style={{ flex:1, height:1, background:T.border }}/></div>
      <FInput label="E-MAIL" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" T={T} icon="✉️"/>
      <FInput label="SENHA" type="password" value={pass} onChange={setPass} placeholder="••••••" T={T} icon="🔒"/>
      {err && <div style={{ background:T.red+"18", border:`1px solid ${T.red}44`, borderRadius:12, padding:"10px 14px", fontSize:13, color:T.red }}>{err}</div>}
      <Btn full T={T} onClick={doLogin} disabled={loading}>{loading?"Entrando...":"Entrar"}</Btn>
    </div>
  );
}

function RegisterScreen({ T, onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [famName, setFamName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fn, setFn] = useState("Mãe");
  const [av, setAv] = useState("👩");
  const [col, setCol] = useState("#F472B6");
  const [code] = useState(genCode());
  const [copied, setCopied] = useState(false);

  function create() {
    const m = { id:1, name, email, password:pass, role:"admin", function:fn, avatar:av, color:col, points:0, permissions:{ tasks:true,shopping:true,finance:true,calendar:true,goals:true,routine:true,reports:true,ai:true,notifications:true } };
    const f = { name:famName, admin:email, code, members:[m] };
    MOCK_FAMILIES[code] = f;
    onSuccess(m, f);
  }

  return (
    <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:16, minHeight:620 }}>
      <button onClick={step===1?onBack:()=>setStep(s=>s-1)} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", textAlign:"left", padding:0 }}>← Voltar</button>
      <div style={{ display:"flex", gap:6 }}>{[1,2,3].map(s=><div key={s} style={{ flex:1, height:4, borderRadius:99, background:s<=step?T.accent:T.border, transition:"background .3s" }}/>)}</div>

      {step===1 && <>
        <div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Criar nova família 🏠</div><div style={{ fontSize:13, color:T.muted }}>Passo 1 de 3 — nome da família</div></div>
        <FInput label="NOME DA FAMÍLIA" value={famName} onChange={setFamName} placeholder="Ex: Família Silva" T={T} icon="🏠"/>
        <Btn full T={T} onClick={()=>setStep(2)} disabled={!famName.trim()}>Próximo →</Btn>
      </>}

      {step===2 && <>
        <div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Seu perfil 👤</div><div style={{ fontSize:13, color:T.muted }}>Passo 2 de 3 — seus dados</div></div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>{av}</div>
          <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap", marginBottom:8 }}>
            {AVATARS_LIST.map(a=><button key={a} onClick={()=>setAv(a)} style={{ background:av===a?T.accent+"22":T.cardAlt, border:`2px solid ${av===a?T.accent:T.border}`, borderRadius:10, padding:"6px 8px", fontSize:18, cursor:"pointer" }}>{a}</button>)}
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            {COLORS_LIST.map(c=><button key={c} onClick={()=>setCol(c)} style={{ width:24, height:24, borderRadius:"50%", background:c, border:`3px solid ${col===c?T.text:"transparent"}`, cursor:"pointer" }}/>)}
          </div>
        </div>
        <FInput label="SEU NOME" value={name} onChange={setName} placeholder="Ex: Ana" T={T} icon="👤"/>
        <FInput label="E-MAIL" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" T={T} icon="✉️"/>
        <FInput label="SENHA" type="password" value={pass} onChange={setPass} placeholder="Mínimo 6 caracteres" T={T} icon="🔒"/>
        <div>
          <label style={{ fontSize:11, fontWeight:800, color:T.muted, letterSpacing:1, display:"block", marginBottom:8 }}>FUNÇÃO NA FAMÍLIA</label>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {FUNCTIONS_LIST.map(f=><button key={f} onClick={()=>setFn(f)} style={{ background:fn===f?col+"22":T.cardAlt, border:`1.5px solid ${fn===f?col:T.border}`, color:fn===f?col:T.muted, borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{f}</button>)}
          </div>
        </div>
        <Btn full T={T} onClick={()=>setStep(3)} disabled={!name||!email||pass.length<6}>Próximo →</Btn>
      </>}

      {step===3 && <>
        <div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Família criada! 🎉</div><div style={{ fontSize:13, color:T.muted }}>Compartilhe o código com a família</div></div>
        <Card T={T} style={{ textAlign:"center", border:`2px solid ${T.accent}44` }}>
          <div style={{ fontSize:12, color:T.muted, fontWeight:700, marginBottom:10 }}>CÓDIGO DA FAMÍLIA</div>
          <div style={{ fontSize:34, fontWeight:900, color:T.accent, letterSpacing:6, marginBottom:14 }}>{code}</div>
          <div style={{ fontSize:12, color:T.muted, lineHeight:1.6, marginBottom:14 }}>Envie por WhatsApp para cada membro entrar no app.</div>
          <Btn T={T} variant="ghost" onClick={()=>{ navigator.clipboard?.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>{copied?"✅ Copiado!":"📋 Copiar código"}</Btn>
        </Card>
        <Btn full T={T} onClick={create}>Entrar no FamilyFlow →</Btn>
      </>}
    </div>
  );
}

function JoinScreen({ T, onBack, onSuccess }) {
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [fam, setFam] = useState(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [fn, setFn] = useState("Filho"); const [av, setAv] = useState("👦");
  const [err, setErr] = useState("");

  function find() {
    const f = MOCK_FAMILIES[code.toUpperCase()];
    if (f) { setFam(f); setStep(2); setErr(""); } else setErr("Código não encontrado.");
  }

  function join() {
    const m = { id:Date.now(), name, email, password:pass, role:"member", function:fn, avatar:av, color:COLORS_LIST[Math.floor(Math.random()*COLORS_LIST.length)], points:0, permissions:{ tasks:true,shopping:true,finance:false,calendar:true,goals:true,routine:true,reports:false,ai:false,notifications:true } };
    MOCK_FAMILIES[fam.code].members.push(m);
    onSuccess(m, MOCK_FAMILIES[fam.code]);
  }

  return (
    <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:16, minHeight:620 }}>
      <button onClick={step===1?onBack:()=>setStep(1)} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", textAlign:"left", padding:0 }}>← Voltar</button>

      {step===1 && <>
        <div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Entrar na família 🔑</div><div style={{ fontSize:13, color:T.muted }}>Digite o código enviado pelo administrador</div></div>
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="FAM-XXXX" maxLength={8}
          style={{ width:"100%", background:T.cardAlt, border:`2px solid ${T.border}`, borderRadius:14, padding:16, fontSize:24, fontWeight:900, color:T.accent, outline:"none", boxSizing:"border-box", letterSpacing:6, textAlign:"center" }}
          onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
        {err && <div style={{ background:T.red+"18", border:`1px solid ${T.red}44`, borderRadius:12, padding:"10px 14px", fontSize:13, color:T.red }}>{err}</div>}
        <div style={{ background:T.accentBg, borderRadius:14, padding:12, fontSize:12, color:T.muted }}>💡 Código da família: <strong style={{ color:T.accentLight }}>FAM-WAYNE</strong></div>
        <Btn full T={T} onClick={find} disabled={code.length<4}>Buscar família →</Btn>
      </>}

      {step===2 && fam && <>
        <div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Família encontrada! 🎉</div><div style={{ fontSize:13, color:T.muted }}>Complete seu perfil para entrar</div></div>
        <Card T={T} style={{ display:"flex", alignItems:"center", gap:14, border:`1px solid ${T.green}44` }}>
          <div style={{ fontSize:28 }}>🏠</div>
          <div><div style={{ fontSize:15, fontWeight:800, color:T.text }}>Família {fam.name}</div><div style={{ fontSize:12, color:T.muted }}>{fam.members.length} membros</div></div>
          <Tag color={T.green}>Encontrada</Tag>
        </Card>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:44, marginBottom:6 }}>{av}</div>
          <div style={{ display:"flex", gap:5, justifyContent:"center", flexWrap:"wrap" }}>
            {AVATARS_LIST.map(a=><button key={a} onClick={()=>setAv(a)} style={{ background:av===a?T.accent+"22":T.cardAlt, border:`2px solid ${av===a?T.accent:T.border}`, borderRadius:8, padding:"5px 7px", fontSize:16, cursor:"pointer" }}>{a}</button>)}
          </div>
        </div>
        <FInput label="SEU NOME" value={name} onChange={setName} placeholder="Como quer ser chamado?" T={T} icon="👤"/>
        <FInput label="E-MAIL" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" T={T} icon="✉️"/>
        <FInput label="SENHA" type="password" value={pass} onChange={setPass} placeholder="Mínimo 6 caracteres" T={T} icon="🔒"/>
        <div>
          <label style={{ fontSize:11, fontWeight:800, color:T.muted, letterSpacing:1, display:"block", marginBottom:8 }}>FUNÇÃO</label>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {FUNCTIONS_LIST.map(f=><button key={f} onClick={()=>setFn(f)} style={{ background:fn===f?T.accent+"18":T.cardAlt, border:`1.5px solid ${fn===f?T.accent:T.border}`, color:fn===f?T.accent:T.muted, borderRadius:10, padding:"6px 10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{f}</button>)}
          </div>
        </div>
        <Btn full T={T} onClick={join} disabled={!name||!email||pass.length<6}>Entrar na família →</Btn>
      </>}
    </div>
  );
}

// ─── PAINEL ADMIN ─────────────────────────────────────────────────────────────
function AdminPanel({ T, currentUser, family, setFamily, tasks, setTasks, onClose }) {
  const [tab, setTab] = useState("members");
  const pending = tasks.filter(t => t.pending_approval);

  function togglePerm(mid, screen) {
    const upd = { ...family, members: family.members.map(m => m.id===mid ? { ...m, permissions:{ ...m.permissions, [screen]:!m.permissions[screen] } } : m) };
    setFamily(upd); MOCK_FAMILIES[family.code] = upd;
  }
  function toggleRole(mid) {
    const upd = { ...family, members: family.members.map(m => m.id===mid ? { ...m, role:m.role==="admin"?"member":"admin" } : m) };
    setFamily(upd); MOCK_FAMILIES[family.code] = upd;
  }
  function approve(id) { setTasks(tasks.map(t=>t.id===id?{...t,done:true,pending_approval:false}:t)); }
  function reject(id)  { setTasks(tasks.map(t=>t.id===id?{...t,pending_approval:false}:t)); }

  const tabs = [{ id:"members",label:"Membros",icon:"👥" },{ id:"permissions",label:"Permissões",icon:"🔐" },{ id:"approvals",label:`Aprovações${pending.length>0?" ("+pending.length+")":""}`,icon:"✅" }];

  return (
    <div style={{ position:"absolute", inset:0, background:T.bg, zIndex:100, display:"flex", flexDirection:"column", borderRadius:"inherit", overflow:"hidden" }}>
      <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><div style={{ fontSize:16, fontWeight:900, color:T.text }}>⚙️ Painel Admin</div><div style={{ fontSize:11, color:T.muted }}>Família {family.name}</div></div>
        <button onClick={onClose} style={{ background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"6px 12px", fontSize:12, color:T.muted, cursor:"pointer", fontWeight:700 }}>✕ Fechar</button>
      </div>
      <div style={{ display:"flex", background:T.card, borderBottom:`1px solid ${T.border}` }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, background:"none", border:"none", borderBottom:`3px solid ${tab===t.id?T.accent:"transparent"}`, padding:"11px 4px", fontSize:10, fontWeight:800, color:tab===t.id?T.accent:T.muted, cursor:"pointer" }}>{t.icon} {t.label}</button>)}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 30px" }}>
        {tab==="members" && <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {family.members.map(m=>(
            <Card key={m.id} T={T}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <AvatarBubble member={m} size={38} showName showRole T={T}/>
                <div style={{ marginLeft:"auto" }}><Tag color={m.role==="admin"?T.accent:T.muted}>{m.role==="admin"?"👑 Admin":"Membro"}</Tag></div>
              </div>
              <div style={{ fontSize:12, color:T.muted, marginBottom:8 }}>{m.email}</div>
              {m.id!==currentUser.id && <Btn T={T} small variant={m.role==="admin"?"danger":"ghost"} onClick={()=>toggleRole(m.id)}>{m.role==="admin"?"Remover admin":"Tornar admin"}</Btn>}
            </Card>
          ))}
        </div>}

        {tab==="permissions" && <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {family.members.filter(m=>m.role!=="admin").map(m=>(
            <Card key={m.id} T={T}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <AvatarBubble member={m} size={32} T={T}/>
                <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{m.name} · {m.function}</div>
              </div>
              {Object.entries(SCREEN_LABELS).map(([key,label])=>(
                <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:13, color:T.text }}>{label}</span>
                  <button onClick={()=>togglePerm(m.id,key)} style={{ width:44, height:24, borderRadius:99, border:"none", background:m.permissions[key]?T.green:T.border, cursor:"pointer", position:"relative", transition:"background .2s" }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:m.permissions[key]?23:3, transition:"left .2s" }}/>
                  </button>
                </div>
              ))}
            </Card>
          ))}
        </div>}

        {tab==="approvals" && <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ fontSize:12, color:T.muted, marginBottom:4 }}>Tarefas que membros marcaram como concluídas aguardam aprovação.</div>
          {pending.length===0 && <div style={{ textAlign:"center", padding:40, color:T.muted, fontSize:13 }}>Nenhuma tarefa pendente 🎉</div>}
          {pending.map(t => {
            const m = family.members.find(mb=>mb.id===t.memberId);
            return (
              <Card key={t.id} T={T}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ fontSize:28 }}>{m?.avatar}</div>
                  <div><div style={{ fontSize:14, fontWeight:700, color:T.text }}>{t.cat} {t.title}</div><div style={{ fontSize:12, color:T.muted }}>{m?.name} · +{t.pts} pontos</div></div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn T={T} small variant="success" full onClick={()=>approve(t.id)}>✅ Aprovar</Btn>
                  <Btn T={T} small variant="danger"  full onClick={()=>reject(t.id)}>❌ Rejeitar</Btn>
                </div>
              </Card>
            );
          })}
        </div>}
      </div>
    </div>
  );
}

// ─── TELAS DO APP ─────────────────────────────────────────────────────────────
function TaskItem({ task, T, tasks, setTasks, isAdmin, membersMap }) {
  const member = membersMap[task.memberId];
  function toggle() {
    if (isAdmin) {
      setTasks(tasks.map(t=>t.id===task.id?{...t,done:!t.done,pending_approval:false}:t));
    } else {
      setTasks(tasks.map(t=>t.id===task.id?{...t,pending_approval:!t.done,done:false}:t));
    }
  }
  const isPending = task.pending_approval && !task.done;
  return (
    <div onClick={toggle} style={{ background:task.done?T.cardAlt:T.card, border:`1px solid ${task.done?T.green+"44":isPending?T.yellow+"44":T.border}`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", opacity:task.done?0.6:1, transition:"all .2s" }}>
      <div style={{ width:22, height:22, borderRadius:7, border:`2px solid ${task.done?T.green:isPending?T.yellow:T.border}`, background:task.done?T.green:isPending?T.yellow+"33":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11 }}>{task.done?"✓":isPending?"⏳":""}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.text, textDecoration:task.done?"line-through":"none" }}>{task.cat} {task.title}</div>
        {isPending && <div style={{ fontSize:10, color:T.yellow, fontWeight:700 }}>Aguardando aprovação do admin</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:11, color:T.yellow, fontWeight:800 }}>+{task.pts}pts</span>
        {member && <AvatarBubble member={member} size={26} T={T}/>}
      </div>
    </div>
  );
}

function HomeScreen({ T, currentUser, family, tasks, setTasks }) {
  const membersMap = Object.fromEntries(family.members.map(m=>[m.id,m]));
  const me = membersMap[currentUser.id] || currentUser;
  const today = tasks.filter(t=>t.due==="Hoje");
  const done  = tasks.filter(t=>t.done).length;
  const total = tasks.length;
  const aiTips = ["📌 Que tal planejar o cardápio da semana juntos?", "⚠️ Há contas a vencer esta semana — confira Finanças.", "🎯 A família está indo bem! Continue registrando as tarefas para ganhar pontos."];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div><div style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Quarta, 30 de Abril</div><div style={{ fontSize:22, fontWeight:900, color:T.text }}>Olá, {me.name} {me.avatar}</div></div>
        <div style={{ background:T.accentBg, border:`1px solid ${T.accent}44`, borderRadius:12, padding:"8px 12px", textAlign:"center" }}>
          <div style={{ fontSize:20, fontWeight:900, color:T.accent }}>{total-done}</div>
          <div style={{ fontSize:9, color:T.muted, fontWeight:700 }}>PENDENTES</div>
        </div>
      </div>

      <Card T={T} style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:13, fontWeight:700, color:T.text }}>Progresso de hoje</span><span style={{ fontSize:13, fontWeight:800, color:T.green }}>{done}/{total}</span></div>
        <div style={{ height:8, borderRadius:99, background:T.border, overflow:"hidden" }}><div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${T.accent},${T.green})`, width:`${total>0?(done/total)*100:0}%`, transition:"width 1s" }}/></div>
      </Card>

      <Card T={T}>
        <SecTitle T={T}>🏆 RANKING DA SEMANA</SecTitle>
        {[...family.members].sort((a,b)=>b.points-a.points).map((m,i)=>(
          <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontSize:14, width:20 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}º`}</span>
            <AvatarBubble member={m} size={28} showName T={T}/>
            <div style={{ flex:1 }}><div style={{ height:5, borderRadius:99, background:T.border, overflow:"hidden" }}><div style={{ height:"100%", borderRadius:99, background:m.color, width:`${(m.points/430)*100}%` }}/></div></div>
            <span style={{ fontSize:12, fontWeight:800, color:m.color }}>{m.points}pts</span>
          </div>
        ))}
      </Card>

      <div style={{ background:`linear-gradient(135deg,${T.accent}18,${T.pink}10)`, border:`1px solid ${T.accent}33`, borderRadius:16, padding:14 }}>
        <div style={{ fontSize:10, color:T.accentLight, fontWeight:800, letterSpacing:1, marginBottom:6 }}>🤖 SUGESTÃO DA IA</div>
        <div style={{ fontSize:13, color:T.text, lineHeight:1.6 }}>{aiTips[0]}</div>
      </div>

      <div>
        <SecTitle T={T}>📋 TAREFAS DE HOJE</SecTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {today.map(t=><TaskItem key={t.id} task={t} T={T} tasks={tasks} setTasks={setTasks} isAdmin={currentUser.role==="admin"} membersMap={membersMap}/>)}
        </div>
      </div>
    </div>
  );
}

function TasksScreen({ T, currentUser, family, tasks, setTasks }) {
  const membersMap = Object.fromEntries(family.members.map(m=>[m.id,m]));
  const [filter, setFilter] = useState("Todos");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMid, setNewMid] = useState(currentUser.id);
  const filtered = filter==="Todos" ? tasks : tasks.filter(t=>t.memberId===Number(filter));

  function addTask() {
    if (!newTitle.trim()) return;
    setTasks([...tasks, { id:Date.now(), title:newTitle, cat:"✅", memberId:newMid, due:"Hoje", done:false, pts:10, pending_approval:false }]);
    setNewTitle(""); setShowAdd(false);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>✅ Tarefas</div>
        {currentUser.role==="admin" && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:T.accent, border:"none", borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer" }}>+ Nova</button>}
      </div>

      {showAdd && <Card T={T} style={{ padding:14 }}>
        <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Nome da tarefa..." style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:10 }}/>
        <div style={{ display:"flex", gap:6, marginBottom:10 }}>
          {family.members.map(m=><button key={m.id} onClick={()=>setNewMid(m.id)} style={{ flex:1, background:newMid===m.id?m.color+"22":T.cardAlt, border:`1px solid ${newMid===m.id?m.color:T.border}`, borderRadius:10, padding:"6px", fontSize:16, cursor:"pointer" }}>{m.avatar}</button>)}
        </div>
        <Btn full T={T} onClick={addTask} disabled={!newTitle.trim()}>Adicionar Tarefa</Btn>
      </Card>}

      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
        {[{ id:"Todos", label:"Todos", avatar:"" }, ...family.members.map(m=>({ id:m.id, label:m.name, avatar:m.avatar, color:m.color }))].map(f=>(
          <button key={f.id} onClick={()=>setFilter(String(f.id))} style={{ background:String(filter)===String(f.id)?(f.color||T.accent):T.card, border:`1px solid ${String(filter)===String(f.id)?(f.color||T.accent):T.border}`, color:String(filter)===String(f.id)?"#fff":T.muted, borderRadius:99, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
            {f.avatar?`${f.avatar} ${f.label}`:f.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(t=><TaskItem key={t.id} task={t} T={T} tasks={tasks} setTasks={setTasks} isAdmin={currentUser.role==="admin"} membersMap={membersMap}/>)}
      </div>
    </div>
  );
}

function ShoppingScreen({ T, family }) {
  const membersMap = Object.fromEntries(family.members.map(m=>[m.id,m]));
  const [items, setItems] = useState(INIT_SHOPPING);
  const [newItem, setNewItem] = useState("");
  const [newMid, setNewMid] = useState(family.members[0]?.id||1);
  function toggle(id) { setItems(items.map(i=>i.id===id?{...i,done:!i.done}:i)); }
  function addItem() { if(!newItem.trim()) return; setItems([...items,{id:Date.now(),name:newItem,qty:"1",memberId:newMid,done:false}]); setNewItem(""); }
  const pending=items.filter(i=>!i.done), done=items.filter(i=>i.done);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🛒 Lista de Compras</div>
        <Tag color={T.accent}>{pending.length} itens</Tag>
      </div>
      <Card T={T} style={{ padding:14 }}>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()} placeholder="Adicionar item..." style={{ flex:1, background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none" }}/>
          <button onClick={addItem} style={{ background:T.accent, border:"none", borderRadius:10, padding:"0 16px", fontSize:18, cursor:"pointer", color:"#fff" }}>+</button>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {family.members.map(m=><button key={m.id} onClick={()=>setNewMid(m.id)} style={{ flex:1, background:newMid===m.id?m.color+"22":T.cardAlt, border:`1px solid ${newMid===m.id?m.color:T.border}`, borderRadius:8, padding:"5px", fontSize:15, cursor:"pointer" }}>{m.avatar}</button>)}
        </div>
      </Card>
      <SecTitle T={T}>PENDENTES ({pending.length})</SecTitle>
      {pending.map(item=>{ const m=membersMap[item.memberId]; return <div key={item.id} onClick={()=>toggle(item.id)} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}><div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}/><div style={{ flex:1, fontSize:14, fontWeight:600, color:T.text }}>{item.name}</div><span style={{ fontSize:11, color:T.muted }}>Qtd: {item.qty}</span>{m&&<AvatarBubble member={m} size={24} T={T}/>}</div>; })}
      {done.length>0&&<><SecTitle T={T}>NO CARRINHO ({done.length})</SecTitle>{done.map(item=>{ const m=membersMap[item.memberId]; return <div key={item.id} onClick={()=>toggle(item.id)} style={{ background:T.cardAlt, border:`1px solid ${T.green}44`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", opacity:0.6 }}><div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${T.green}`, background:T.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:"#000" }}>✓</div><div style={{ flex:1, fontSize:14, fontWeight:600, color:T.text, textDecoration:"line-through" }}>{item.name}</div>{m&&<AvatarBubble member={m} size={24} T={T}/>}</div>; })}</>}
    </div>
  );
}

function FinanceScreen({ T }) {
  const [finances, setFinances] = useState(FINANCES);
  const pending=finances.filter(f=>!f.paid), paidList=finances.filter(f=>f.paid);
  const totalPend=pending.reduce((a,f)=>a+f.amount,0), totalPaid=paidList.reduce((a,f)=>a+f.amount,0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>💰 Finanças</div>
      <Card T={T} style={{ background:`linear-gradient(135deg,${T.card},${T.cardAlt})`, border:`1px solid ${T.yellow}33` }}>
        <div style={{ fontSize:11, color:T.muted, fontWeight:800, marginBottom:6 }}>A PAGAR ESTE MÊS</div>
        <div style={{ fontSize:32, fontWeight:900, color:T.yellow }}>R$ {totalPend}</div>
        <div style={{ marginTop:12, height:7, borderRadius:99, background:T.border, overflow:"hidden" }}><div style={{ height:"100%", width:`${(totalPaid/(totalPaid+totalPend))*100}%`, background:T.green, borderRadius:99 }}/></div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:T.muted }}><span>✅ R$ {totalPaid} pago</span><span>⏳ R$ {totalPend} restante</span></div>
      </Card>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {finances.map((f,i)=>(
          <Card key={i} T={T} style={{ display:"flex", alignItems:"center", gap:14, opacity:f.paid?0.6:1, border:`1px solid ${f.paid?T.green+"33":T.border}` }} onClick={()=>setFinances(finances.map((fi,j)=>j===i?{...fi,paid:!fi.paid}:fi))}>
            <div style={{ width:42, height:42, borderRadius:12, background:f.paid?T.green+"18":T.yellow+"18", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>{f.icon}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:T.text }}>{f.name}</div><div style={{ fontSize:11, color:T.muted }}>{f.due} · {f.cat}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:15, fontWeight:900, color:f.paid?T.green:T.text }}>R$ {f.amount}</div><Tag color={f.paid?T.green:T.yellow}>{f.paid?"Pago":"Pendente"}</Tag></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CalendarScreen({ T }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>📅 Agenda — Abril 2025</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:5 }}>
        {EVENTS.map(e=>(
          <div key={e.day} style={{ background:e.today?T.accent:T.card, border:`1px solid ${e.today?T.accent:T.border}`, borderRadius:13, padding:"9px 2px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:e.today?"#fff":T.muted, fontWeight:700 }}>{e.day}</div>
            <div style={{ fontSize:17, fontWeight:900, color:e.today?"#fff":T.text, margin:"3px 0" }}>{e.date}</div>
            {e.items.map((ev,i)=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:ev.color, margin:"0 auto 2px" }}/>)}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {EVENTS.filter(e=>e.items.length>0).map(e=>e.items.map((ev,i)=>(
          <Card key={`${e.day}-${i}`} T={T} style={{ display:"flex", alignItems:"center", gap:14, border:`1px solid ${ev.color}44` }}>
            <div style={{ width:44, height:44, borderRadius:12, background:ev.color+"20", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <div style={{ fontSize:10, color:ev.color, fontWeight:800 }}>{e.day.toUpperCase()}</div>
              <div style={{ fontSize:17, fontWeight:900, color:ev.color }}>{e.date}</div>
            </div>
            <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:T.text }}>{ev.title}</div><div style={{ fontSize:12, color:T.muted }}>Compromisso familiar</div></div>
            <div style={{ width:8, height:8, borderRadius:"50%", background:ev.color }}/>
          </Card>
        )))}
      </div>
    </div>
  );
}

function GoalsScreen({ T, family }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🎯 Metas Familiares</div>
      {GOALS.map(g=>(
        <Card key={g.id} T={T} style={{ border:`1px solid ${g.color}33` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div><div style={{ fontSize:22, marginBottom:4 }}>{g.emoji}</div><div style={{ fontSize:15, fontWeight:800, color:T.text }}>{g.title}</div><div style={{ fontSize:11, color:T.muted }}>Prazo: {g.deadline}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:20, fontWeight:900, color:g.color }}>{Math.round((g.current/g.target)*100)}%</div><div style={{ fontSize:11, color:T.muted }}>{g.current}/{g.target}</div></div>
          </div>
          <div style={{ height:8, borderRadius:99, background:T.border, overflow:"hidden" }}><div style={{ height:"100%", borderRadius:99, background:g.color, width:`${(g.current/g.target)*100}%` }}/></div>
          <div style={{ marginTop:10, display:"flex", gap:5 }}>{family.members.map(m=><div key={m.id} style={{ fontSize:18 }}>{m.avatar}</div>)}<span style={{ fontSize:12, color:T.muted, marginLeft:4, alignSelf:"center" }}>contribuindo</span></div>
        </Card>
      ))}
      <button style={{ background:T.accentBg, border:`1px dashed ${T.accent}66`, borderRadius:14, padding:16, fontSize:13, fontWeight:700, color:T.accentLight, cursor:"pointer", width:"100%" }}>+ Criar nova meta familiar</button>
    </div>
  );
}

function RoutineScreen({ T, family }) {
  const membersMap = Object.fromEntries(family.members.map(m=>[m.id,m]));
  const days = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  const [activeDay, setActiveDay] = useState("Qua");
  const filtered = ROUTINES.filter(r=>r.days.includes(activeDay));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🌙 Rotinas</div>
      <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
        {days.map(d=><button key={d} onClick={()=>setActiveDay(d)} style={{ background:activeDay===d?T.accent:T.card, border:`1px solid ${activeDay===d?T.accent:T.border}`, color:activeDay===d?"#fff":T.muted, borderRadius:10, padding:"7px 11px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{d}</button>)}
      </div>
      {filtered.length===0 ? <div style={{ textAlign:"center", padding:40, color:T.muted, fontSize:13 }}>Nenhuma rotina neste dia 🎉</div> :
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(r=>{ const m=membersMap[r.memberId]; if(!m) return null; return (
            <Card key={r.id} T={T} style={{ display:"flex", alignItems:"center", gap:14, border:`1px solid ${m.color}33` }}>
              <div style={{ width:44, height:44, borderRadius:12, background:m.color+"20", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>{m.avatar}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:T.text }}>{r.title}</div><div style={{ fontSize:11, color:T.muted }}>{m.name} · {r.time}</div>
                <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                  {r.days.map(d=><span key={d} style={{ background:d===activeDay?m.color+"22":T.cardAlt, border:`1px solid ${d===activeDay?m.color:T.border}`, color:d===activeDay?m.color:T.muted, borderRadius:6, padding:"2px 7px", fontSize:10, fontWeight:700 }}>{d}</span>)}
                </div>
              </div>
              <div style={{ fontSize:12, fontWeight:800, color:T.yellow }}>+{r.pts}pts</div>
            </Card>
          ); })}
        </div>}
      <button style={{ background:T.accentBg, border:`1px dashed ${T.accent}66`, borderRadius:14, padding:16, fontSize:13, fontWeight:700, color:T.accentLight, cursor:"pointer", width:"100%" }}>+ Criar nova rotina</button>
    </div>
  );
}

function ReportsScreen({ T, family, tasks }) {
  const [period, setPeriod] = useState("Esta semana");
  const periods = ["Esta semana","Semana passada","Abril 2025"];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>📊 Relatórios</div>
      <div style={{ display:"flex", gap:6 }}>
        {periods.map(p=><button key={p} onClick={()=>setPeriod(p)} style={{ flex:1, background:period===p?T.accent:T.card, border:`1px solid ${period===p?T.accent:T.border}`, color:period===p?"#fff":T.muted, borderRadius:10, padding:"7px 4px", fontSize:10, fontWeight:700, cursor:"pointer" }}>{p}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {[{label:"Tarefas concluídas",value:tasks.filter(t=>t.done).length,icon:"✅",color:T.green},{label:"Pontos ganhos",value:"1.200",icon:"⭐",color:T.yellow},{label:"Contas pagas",value:"R$ 680",icon:"💰",color:T.blue},{label:"Compromissos",value:"4",icon:"📅",color:T.pink}].map((s,i)=>(
          <Card key={i} T={T} style={{ textAlign:"center", border:`1px solid ${s.color}22` }}>
            <div style={{ fontSize:22 }}>{s.icon}</div>
            <div style={{ fontSize:20, fontWeight:900, color:s.color, margin:"4px 0" }}>{s.value}</div>
            <div style={{ fontSize:10, color:T.muted, fontWeight:700 }}>{s.label.toUpperCase()}</div>
          </Card>
        ))}
      </div>
      <Card T={T}>
        <SecTitle T={T}>DESEMPENHO POR MEMBRO</SecTitle>
        {family.members.map(m=>{ const tot=tasks.filter(t=>t.memberId===m.id).length; const done=tasks.filter(t=>t.memberId===m.id&&t.done).length; return (
          <div key={m.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}><AvatarBubble member={m} size={26} showName T={T}/><div style={{ textAlign:"right" }}><div style={{ fontSize:13, fontWeight:800, color:m.color }}>{done}/{tot}</div><div style={{ fontSize:9, color:T.muted }}>tarefas</div></div></div>
            <div style={{ height:6, borderRadius:99, background:T.border, overflow:"hidden" }}><div style={{ height:"100%", borderRadius:99, background:m.color, width:tot?`${(done/tot)*100}%`:"0%" }}/></div>
          </div>
        ); })}
      </Card>
      <Card T={T}>
        <SecTitle T={T}>TAREFAS POR DIA — ESTA SEMANA</SecTitle>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80 }}>
          {[3,5,2,4,6,1,2].map((v,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", borderRadius:"6px 6px 0 0", background:i===2?T.accent:T.accentBg, border:`1px solid ${T.accent}44`, height:`${(v/6)*72}px` }}/>
              <div style={{ fontSize:9, color:T.muted, fontWeight:700 }}>{"STQQSSD"[i]}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationsScreen({ T }) {
  const [notes, setNotes] = useState(NOTIFICATIONS_DATA);
  const unread=notes.filter(n=>!n.read).length;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🔔 Notificações</div>
        {unread>0&&<button onClick={()=>setNotes(notes.map(n=>({...n,read:true})))} style={{ background:"none", border:"none", fontSize:12, color:T.accentLight, fontWeight:700, cursor:"pointer" }}>Marcar todas lidas</button>}
      </div>
      {notes.map(n=>(
        <div key={n.id} onClick={()=>setNotes(notes.map(m=>m.id===n.id?{...m,read:true}:m))} style={{ background:n.read?T.card:T.cardAlt, border:`1px solid ${n.read?T.border:n.color+"44"}`, borderRadius:14, padding:"14px 16px", display:"flex", gap:14, alignItems:"flex-start", cursor:"pointer", opacity:n.read?0.65:1 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:n.color+"20", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n.icon}</div>
          <div style={{ flex:1 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><div style={{ fontSize:13, fontWeight:800, color:T.text }}>{n.title}</div>{!n.read&&<div style={{ width:7, height:7, borderRadius:"50%", background:n.color, flexShrink:0, marginTop:3 }}/>}</div><div style={{ fontSize:12, color:T.muted, lineHeight:1.4 }}>{n.body}</div><div style={{ fontSize:10, color:T.muted, marginTop:5, fontWeight:700 }}>{n.time}</div></div>
        </div>
      ))}
    </div>
  );
}

function AIScreen({ T, currentUser, family }) {
  const initMsg = [{ role:"ai", text:`Olá, ${currentUser.name}! 🤖 Sou a IA do FamilyFlow. Posso sugerir tarefas, reorganizar a rotina da família ${family.name} e muito mais. Como posso ajudar?` }];
  const [chat, setChat] = useState(initMsg);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [idx, setIdx] = useState(0);
  const bottomRef = useRef(null);
  const suggestions = ["Sugira tarefas para Larissa","Como está nossa semana?","Organize a rotina","Analise as finanças"];
  function send(text) {
    const msg=text||input; if(!msg.trim()||loading) return;
    setChat(c=>[...c,{role:"user",text:msg}]); setInput(""); setLoading(true);
    setTimeout(()=>{ setChat(c=>[...c,{role:"ai",text:AI_RESPONSES[idx%AI_RESPONSES.length]}]); setIdx(i=>i+1); setLoading(false); }, 1200);
  }
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[chat,loading]);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🤖 IA Familiar</div>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:14, display:"flex", flexDirection:"column", gap:10, minHeight:300, maxHeight:340, overflowY:"auto" }}>
        {chat.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="ai"&&<div style={{ width:28, height:28, borderRadius:"50%", background:T.accent+"22", border:`1.5px solid ${T.accent}`, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8, alignSelf:"flex-end" }}>🤖</div>}
            <div style={{ maxWidth:"80%", background:m.role==="user"?T.accent:T.cardAlt, border:`1px solid ${m.role==="user"?T.accent:T.border}`, borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", fontSize:13, color:T.text, lineHeight:1.6, whiteSpace:"pre-line" }}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{ display:"flex", gap:8, alignItems:"center" }}><div style={{ width:28, height:28, borderRadius:"50%", background:T.accent+"22", border:`1.5px solid ${T.accent}`, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>🤖</div><div style={{ background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:"18px 18px 18px 4px", padding:"10px 14px", fontSize:13, color:T.muted }}>Analisando... ⏳</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
        {suggestions.map(s=><button key={s} onClick={()=>send(s)} style={{ background:T.accentBg, border:`1px solid ${T.accent}44`, color:T.accentLight, borderRadius:99, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{s}</button>)}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pergunte algo para a IA..." style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"12px 16px", fontSize:13, color:T.text, outline:"none" }}/>
        <button onClick={()=>send()} style={{ background:T.accent, border:"none", borderRadius:14, padding:"12px 18px", fontSize:18, cursor:"pointer", color:"#fff" }}>→</button>
      </div>
    </div>
  );
}

function ProfileScreen({ T, currentUser, family, onLogout, onOpenAdmin }) {
  const me = family.members.find(m=>m.id===currentUser.id)||currentUser;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>👤 Meu Perfil</div>
      <Card T={T} style={{ textAlign:"center", border:`1px solid ${me.color}33` }}>
        <div style={{ fontSize:52, marginBottom:8 }}>{me.avatar}</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>{me.name}</div>
        <div style={{ fontSize:13, color:T.muted, marginBottom:12 }}>{me.function} · Família {family.name}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
          <Tag color={me.role==="admin"?T.accent:T.muted}>{me.role==="admin"?"👑 Admin":"👥 Membro"}</Tag>
          <Tag color={me.color}>{me.points} pts</Tag>
        </div>
      </Card>
      <Card T={T}>
        <SecTitle T={T}>MINHAS PERMISSÕES</SecTitle>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {Object.entries(me.permissions||{}).map(([k,v])=><Tag key={k} color={v?T.green:T.red}>{v?"✓":"✗"} {SCREEN_LABELS[k]}</Tag>)}
        </div>
      </Card>
      <Card T={T}>
        <SecTitle T={T}>CÓDIGO DA FAMÍLIA</SecTitle>
        <div style={{ fontSize:24, fontWeight:900, color:T.accent, letterSpacing:4 }}>{family.code}</div>
        <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>Compartilhe para novos membros entrarem</div>
      </Card>
      <Card T={T}>
        <SecTitle T={T}>MEMBROS DA FAMÍLIA</SecTitle>
        {family.members.map(m=>(
          <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <AvatarBubble member={m} size={30} T={T}/>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:T.text }}>{m.name}</div><div style={{ fontSize:11, color:T.muted }}>{m.function}</div></div>
            <Tag color={m.role==="admin"?T.accent:T.muted}>{m.role==="admin"?"Admin":"Membro"}</Tag>
          </div>
        ))}
      </Card>
      {currentUser.role==="admin"&&<Btn full T={T} variant="ghost" onClick={onOpenAdmin}>⚙️ Painel de Administração</Btn>}
      <Btn full T={T} variant="danger" onClick={onLogout}>Sair da conta</Btn>
    </div>
  );
}

// ─── MURAL DE AVISOS ─────────────────────────────────────────────────────────
const INIT_AVISOS = [
  { id:1, title:"Início do teste do FamilyFlow!", body:"Bem-vindos ao nosso app familiar! Vamos testar por 1 mês.", author:1, time:"Hoje 08:00", pinned:true, emoji:"🎉", color:"#6C63FF" },
  { id:2, title:"Conta de luz vence amanhã", body:"R$ 210 — não esquecer de pagar!", author:1, time:"Hoje 07:30", pinned:false, emoji:"⚠️", color:"#FACC15" },
  { id:3, title:"Compras do mês", body:"Larissa, lista de compras atualizada no app!", author:1, time:"Ontem", pinned:false, emoji:"🛒", color:"#4ADE80" },
  { id:4, title:"Reunião de condomínio", body:"Sábado às 10h no salão. Não esquecer!", author:2, time:"Ontem", pinned:false, emoji:"📢", color:"#F472B6" },
];

function MuralScreen({ T, currentUser, family }) {
  const membersMap = Object.fromEntries(family.members.map(m=>[m.id,m]));
  const [avisos, setAvisos] = useState(INIT_AVISOS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newEmoji, setNewEmoji] = useState("📢");
  const emojis = ["📢","⚠️","🎉","❤️","🏠","📅","💡","🌟","🔔","✅"];

  function addAviso() {
    if (!newTitle.trim()) return;
    setAvisos([{ id:Date.now(), title:newTitle, body:newBody, author:currentUser.id, time:"Agora", pinned:false, emoji:newEmoji, color:currentUser.color||"#6C63FF" }, ...avisos]);
    setNewTitle(""); setNewBody(""); setShowAdd(false);
  }
  function togglePin(id) { setAvisos(avisos.map(a=>a.id===id?{...a,pinned:!a.pinned}:a)); }
  function removeAviso(id) { setAvisos(avisos.filter(a=>a.id!==id)); }

  const pinned = avisos.filter(a=>a.pinned);
  const rest   = avisos.filter(a=>!a.pinned);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>📋 Mural de Avisos</div>
        {currentUser.role==="admin" && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:T.accent, border:"none", borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer" }}>+ Novo</button>}
      </div>

      {showAdd && (
        <Card T={T} style={{ padding:14 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            {emojis.map(e=><button key={e} onClick={()=>setNewEmoji(e)} style={{ background:newEmoji===e?T.accent+"22":T.cardAlt, border:`2px solid ${newEmoji===e?T.accent:T.border}`, borderRadius:8, padding:"5px 7px", fontSize:16, cursor:"pointer" }}>{e}</button>)}
          </div>
          <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Título do aviso..." style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:8 }}/>
          <textarea value={newBody} onChange={e=>setNewBody(e.target.value)} placeholder="Descrição (opcional)..." style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:10, resize:"none", height:70 }}/>
          <Btn full T={T} onClick={addAviso} disabled={!newTitle.trim()}>Publicar Aviso</Btn>
        </Card>
      )}

      {pinned.length>0 && <>
        <SecTitle T={T}>📌 FIXADOS</SecTitle>
        {pinned.map(a=>{ const author=membersMap[a.author]; return (
          <div key={a.id} style={{ background:T.card, border:`2px solid ${a.color}55`, borderRadius:16, padding:16 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:T.text, marginBottom:4 }}>{a.title}</div>
                {a.body && <div style={{ fontSize:13, color:T.muted, lineHeight:1.5, marginBottom:8 }}>{a.body}</div>}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {author && <AvatarBubble member={author} size={20} T={T}/>}
                  <span style={{ fontSize:11, color:T.muted }}>{a.time}</span>
                  <Tag color={a.color}>📌 Fixado</Tag>
                </div>
              </div>
              {currentUser.role==="admin" && (
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <button onClick={()=>togglePin(a.id)} style={{ background:"none", border:"none", fontSize:14, cursor:"pointer", color:T.muted }}>📌</button>
                  <button onClick={()=>removeAviso(a.id)} style={{ background:"none", border:"none", fontSize:14, cursor:"pointer", color:T.red }}>✕</button>
                </div>
              )}
            </div>
          </div>
        ); })}
      </>}

      {rest.length>0 && <>
        <SecTitle T={T}>RECENTES</SecTitle>
        {rest.map(a=>{ const author=membersMap[a.author]; return (
          <Card key={a.id} T={T} style={{ border:`1px solid ${a.color}33` }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:4 }}>{a.title}</div>
                {a.body && <div style={{ fontSize:13, color:T.muted, lineHeight:1.5, marginBottom:8 }}>{a.body}</div>}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {author && <AvatarBubble member={author} size={18} T={T}/>}
                  <span style={{ fontSize:11, color:T.muted }}>{a.time}</span>
                </div>
              </div>
              {currentUser.role==="admin" && (
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={()=>togglePin(a.id)} title="Fixar" style={{ background:"none", border:"none", fontSize:14, cursor:"pointer", color:T.muted }}>📌</button>
                  <button onClick={()=>removeAviso(a.id)} style={{ background:"none", border:"none", fontSize:14, cursor:"pointer", color:T.red }}>✕</button>
                </div>
              )}
            </div>
          </Card>
        ); })}
      </>}
    </div>
  );
}

// ─── RESUMO SEMANAL ───────────────────────────────────────────────────────────
function ResumoScreen({ T, family, tasks }) {
  const [week, setWeek] = useState(0);
  const weeks = ["Esta semana (28 Abr – 4 Mai)", "Semana passada (21–27 Abr)", "14–20 de Abril"];
  const totalDone  = tasks.filter(t=>t.done).length;
  const totalPts   = family.members.reduce((a,m)=>a+m.points,0);
  const topMember  = [...family.members].sort((a,b)=>b.points-a.points)[0];
  const highlights = [
    "✅ Larissa concluiu todas as tarefas da semana!",
    "💰 R$ 680 em contas pagas no prazo.",
    "📈 Família aumentou 12% na pontuação vs semana passada.",
    "⚠️ 2 tarefas ficaram pendentes — conta de luz e seguro do carro.",
  ];
  const dailyData = [3,5,2,4,6,1,2];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>📈 Resumo Semanal</div>

      <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
        {weeks.map((w,i)=><button key={i} onClick={()=>setWeek(i)} style={{ background:week===i?T.accent:T.card, border:`1px solid ${week===i?T.accent:T.border}`, color:week===i?"#fff":T.muted, borderRadius:10, padding:"7px 10px", fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{w}</button>)}
      </div>

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${T.accent}22,${T.pink}12)`, border:`1px solid ${T.accent}33`, borderRadius:18, padding:18 }}>
        <div style={{ fontSize:11, color:T.accentLight, fontWeight:800, letterSpacing:1, marginBottom:12 }}>🏆 DESTAQUE DA SEMANA</div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:44 }}>{topMember.avatar}</div>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:T.text }}>{topMember.name}</div>
            <div style={{ fontSize:13, color:T.muted }}>Melhor da família com <strong style={{ color:topMember.color }}>{topMember.points} pts</strong></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {[
          { label:"Tarefas concluídas", value:totalDone,          icon:"✅", color:T.green  },
          { label:"Pontos totais",      value:totalPts,           icon:"⭐", color:T.yellow },
          { label:"Contas pagas",       value:"R$ 680",           icon:"💰", color:T.blue   },
          { label:"Compromissos",       value:"4 de 5",           icon:"📅", color:T.pink   },
        ].map((s,i)=>(
          <Card key={i} T={T} style={{ textAlign:"center", border:`1px solid ${s.color}22` }}>
            <div style={{ fontSize:22 }}>{s.icon}</div>
            <div style={{ fontSize:20, fontWeight:900, color:s.color, margin:"4px 0" }}>{s.value}</div>
            <div style={{ fontSize:10, color:T.muted, fontWeight:700 }}>{s.label.toUpperCase()}</div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card T={T}>
        <SecTitle T={T}>TAREFAS CONCLUÍDAS POR DIA</SecTitle>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80 }}>
          {dailyData.map((v,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", borderRadius:"5px 5px 0 0", background:i===2?T.accent:T.accentBg, border:`1px solid ${T.accent}44`, height:`${(v/6)*72}px`, transition:"height 1s" }}/>
              <div style={{ fontSize:9, color:T.muted, fontWeight:700 }}>{"STQQSSD"[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Member breakdown */}
      <Card T={T}>
        <SecTitle T={T}>DESEMPENHO POR MEMBRO</SecTitle>
        {family.members.map(m=>{ const tot=tasks.filter(t=>t.memberId===m.id).length; const done=tasks.filter(t=>t.memberId===m.id&&t.done).length; return (
          <div key={m.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <AvatarBubble member={m} size={26} showName T={T}/>
              <div style={{ textAlign:"right" }}><div style={{ fontSize:13, fontWeight:800, color:m.color }}>{done}/{tot}</div><div style={{ fontSize:9, color:T.muted }}>tarefas · {m.points}pts</div></div>
            </div>
            <div style={{ height:6, borderRadius:99, background:T.border, overflow:"hidden" }}><div style={{ height:"100%", borderRadius:99, background:m.color, width:tot?`${(done/tot)*100}%`:"0%" }}/></div>
          </div>
        ); })}
      </Card>

      {/* Highlights */}
      <Card T={T}>
        <SecTitle T={T}>💡 DESTAQUES AUTOMÁTICOS</SecTitle>
        {highlights.map((h,i)=><div key={i} style={{ fontSize:13, color:T.text, padding:"8px 0", borderBottom:i<highlights.length-1?`1px solid ${T.border}`:"none", lineHeight:1.5 }}>{h}</div>)}
      </Card>
    </div>
  );
}

// ─── LOJA DE RECOMPENSAS ──────────────────────────────────────────────────────
const INIT_REWARDS = [
  { id:1, name:"Passeio ao cinema",    emoji:"🎬", pts:200, stock:3, category:"Lazer"    },
  { id:2, name:"Dia sem tarefas",      emoji:"😴", pts:150, stock:5, category:"Descanso" },
  { id:3, name:"Escolher o jantar",    emoji:"🍕", pts:80,  stock:10,category:"Comida"   },
  { id:4, name:"1h a mais de tela",    emoji:"📱", pts:100, stock:7, category:"Tech"     },
  { id:5, name:"Passeio ao parque",    emoji:"🌳", pts:120, stock:4, category:"Lazer"    },
  { id:6, name:"Jogo novo",            emoji:"🎮", pts:500, stock:2, category:"Tech"     },
];

function LojaScreen({ T, currentUser, family }) {
  const me = family.members.find(m=>m.id===currentUser.id)||currentUser;
  const [rewards, setRewards] = useState(INIT_REWARDS);
  const [redeemed, setRedeemed] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState(""); const [newPts, setNewPts] = useState(""); const [newEmoji, setNewEmoji] = useState("🎁");
  const cats = ["Todos", "Lazer", "Descanso", "Comida", "Tech"];
  const [cat, setCat] = useState("Todos");
  const filtered = cat==="Todos" ? rewards : rewards.filter(r=>r.category===cat);
  const emojis = ["🎬","😴","🍕","📱","🌳","🎮","🎁","🏖️","🍦","🎪","🚗","📚"];

  function redeem(r) {
    if (me.points < r.pts) return;
    setRedeemed([...redeemed, { ...r, redeemedBy:me.id, time:"Agora" }]);
  }

  function addReward() {
    if (!newName.trim()||!newPts) return;
    setRewards([...rewards, { id:Date.now(), name:newName, emoji:newEmoji, pts:Number(newPts), stock:5, category:"Lazer" }]);
    setNewName(""); setNewPts(""); setShowAdd(false);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🏪 Loja de Recompensas</div>
        {currentUser.role==="admin" && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:T.accent, border:"none", borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer" }}>+ Nova</button>}
      </div>

      {/* Meus pontos */}
      <div style={{ background:`linear-gradient(135deg,${T.yellow}22,${T.orange}12)`, border:`1px solid ${T.yellow}44`, borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, color:T.muted, fontWeight:800, marginBottom:4 }}>SEUS PONTOS</div>
          <div style={{ fontSize:28, fontWeight:900, color:T.yellow }}>{me.points} pts</div>
        </div>
        <div style={{ fontSize:36 }}>{me.avatar}</div>
      </div>

      {showAdd && (
        <Card T={T} style={{ padding:14 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            {emojis.map(e=><button key={e} onClick={()=>setNewEmoji(e)} style={{ background:newEmoji===e?T.accent+"22":T.cardAlt, border:`2px solid ${newEmoji===e?T.accent:T.border}`, borderRadius:8, padding:"5px 7px", fontSize:16, cursor:"pointer" }}>{e}</button>)}
          </div>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nome da recompensa..." style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:8 }}/>
          <input type="number" value={newPts} onChange={e=>setNewPts(e.target.value)} placeholder="Pontos necessários" style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:10 }}/>
          <Btn full T={T} onClick={addReward} disabled={!newName.trim()||!newPts}>Adicionar Recompensa</Btn>
        </Card>
      )}

      <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{ background:cat===c?T.accent:T.card, border:`1px solid ${cat===c?T.accent:T.border}`, color:cat===c?"#fff":T.muted, borderRadius:99, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{c}</button>)}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(r=>{ const canAfford=me.points>=r.pts; const done=redeemed.find(rd=>rd.id===r.id); return (
          <Card key={r.id} T={T} style={{ display:"flex", alignItems:"center", gap:14, opacity:done?0.5:1, border:`1px solid ${canAfford?T.green+"33":T.border}` }}>
            <div style={{ width:48, height:48, borderRadius:14, background:canAfford?T.green+"18":T.cardAlt, fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{r.name}</div>
              <div style={{ fontSize:11, color:T.muted }}>{r.category} · {r.stock} disponíveis</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15, fontWeight:900, color:canAfford?T.green:T.red }}>{r.pts}pts</div>
              <button onClick={()=>redeem(r)} disabled={!canAfford||!!done} style={{ background:done?"transparent":canAfford?T.green:T.border, border:"none", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, color:done?T.muted:canAfford?"#000":T.muted, cursor:canAfford&&!done?"pointer":"not-allowed", marginTop:4 }}>
                {done?"Resgatado":"Resgatar"}
              </button>
            </div>
          </Card>
        ); })}
      </div>

      {redeemed.length>0 && (
        <Card T={T} style={{ border:`1px solid ${T.green}33` }}>
          <SecTitle T={T}>✅ RESGATES DESTA SEMANA</SecTitle>
          {redeemed.map((r,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontSize:20 }}>{r.emoji}</span>
            <div style={{ flex:1, fontSize:13, color:T.text }}>{r.name}</div>
            <Tag color={T.green}>Aguardando</Tag>
          </div>)}
        </Card>
      )}
    </div>
  );
}

// ─── DIVISÃO DE DESPESAS ──────────────────────────────────────────────────────
const INIT_DESPESAS = [
  { id:1, desc:"Supermercado",    total:320, paidBy:1, splits:[1,2], date:"28 Abr", cat:"🛒" },
  { id:2, desc:"Gasolina",        total:180, paidBy:2, splits:[1,2], date:"27 Abr", cat:"⛽" },
  { id:3, desc:"Pizza sexta",     total:95,  paidBy:1, splits:[1,2], date:"26 Abr", cat:"🍕" },
  { id:4, desc:"Farmácia",        total:64,  paidBy:2, splits:[1,2], date:"25 Abr", cat:"💊" },
];

function DespesasScreen({ T, family }) {
  const adultos = family.members.filter(m=>m.role==="admin"||m.function==="Pai"||m.function==="Mãe");
  const membersMap = Object.fromEntries(family.members.map(m=>[m.id,m]));
  const [despesas, setDespesas] = useState(INIT_DESPESAS);
  const [showAdd, setShowAdd] = useState(false);
  const [newDesc, setNewDesc] = useState(""); const [newTotal, setNewTotal] = useState(""); const [newPaidBy, setNewPaidBy] = useState(family.members[0]?.id||1);
  const cats = ["🛒","⛽","🍕","💊","🎬","🏠","✈️","🎁"];
  const [newCat, setNewCat] = useState("🛒");

  // Calcula balanço entre adultos
  const balance = {};
  family.members.forEach(m=>{ balance[m.id]=0; });
  despesas.forEach(d=>{
    const share = d.total / d.splits.length;
    d.splits.forEach(mid=>{ if(mid!==d.paidBy) balance[d.paidBy]=(balance[d.paidBy]||0)+share; });
    d.splits.forEach(mid=>{ if(mid!==d.paidBy) balance[mid]=(balance[mid]||0)-share; });
  });

  function addDespesa() {
    if(!newDesc.trim()||!newTotal) return;
    setDespesas([{ id:Date.now(), desc:newDesc, total:Number(newTotal), paidBy:newPaidBy, splits:[1,2], date:"Hoje", cat:newCat }, ...despesas]);
    setNewDesc(""); setNewTotal(""); setShowAdd(false);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🤝 Divisão de Despesas</div>
        <button onClick={()=>setShowAdd(!showAdd)} style={{ background:T.accent, border:"none", borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:800, color:"#fff", cursor:"pointer" }}>+ Nova</button>
      </div>

      {/* Balanço */}
      <Card T={T} style={{ border:`1px solid ${T.blue}33` }}>
        <SecTitle T={T}>⚖️ BALANÇO ATUAL</SecTitle>
        {family.members.map(m=>{ const bal=balance[m.id]||0; return (
          <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <AvatarBubble member={m} size={30} T={T}/>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:T.text }}>{m.name}</div></div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15, fontWeight:900, color:bal>0?T.green:bal<0?T.red:T.muted }}>
                {bal>0?`+R$ ${bal.toFixed(0)}`:bal<0?`-R$ ${Math.abs(bal).toFixed(0)}`:"Quitado"}
              </div>
              <div style={{ fontSize:10, color:T.muted }}>{bal>0?"a receber":bal<0?"a pagar":"✅"}</div>
            </div>
          </div>
        ); })}
      </Card>

      {showAdd && (
        <Card T={T} style={{ padding:14 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            {cats.map(c=><button key={c} onClick={()=>setNewCat(c)} style={{ background:newCat===c?T.accent+"22":T.cardAlt, border:`2px solid ${newCat===c?T.accent:T.border}`, borderRadius:8, padding:"5px 7px", fontSize:16, cursor:"pointer" }}>{c}</button>)}
          </div>
          <input value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Descrição..." style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:8 }}/>
          <input type="number" value={newTotal} onChange={e=>setNewTotal(e.target.value)} placeholder="Valor total (R$)" style={{ width:"100%", background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:10 }}/>
          <div style={{ fontSize:11, color:T.muted, fontWeight:700, marginBottom:6 }}>PAGO POR</div>
          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
            {family.members.map(m=><button key={m.id} onClick={()=>setNewPaidBy(m.id)} style={{ flex:1, background:newPaidBy===m.id?m.color+"22":T.cardAlt, border:`1px solid ${newPaidBy===m.id?m.color:T.border}`, borderRadius:8, padding:"6px", fontSize:16, cursor:"pointer" }}>{m.avatar}</button>)}
          </div>
          <Btn full T={T} onClick={addDespesa} disabled={!newDesc.trim()||!newTotal}>Adicionar Despesa</Btn>
        </Card>
      )}

      <SecTitle T={T}>HISTÓRICO</SecTitle>
      {despesas.map(d=>{ const payer=membersMap[d.paidBy]; const share=(d.total/d.splits.length).toFixed(0); return (
        <Card key={d.id} T={T}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:T.cardAlt, fontSize:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{d.cat}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{d.desc}</div>
              <div style={{ fontSize:11, color:T.muted }}>{d.date} · Pago por {payer?.name}</div>
              <div style={{ display:"flex", gap:4, marginTop:4 }}>
                {d.splits.map(sid=>{ const m=membersMap[sid]; return m?<div key={sid} style={{ fontSize:14 }}>{m.avatar}</div>:null; })}
                <span style={{ fontSize:11, color:T.muted, alignSelf:"center" }}>R$ {share}/pessoa</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:16, fontWeight:900, color:T.text }}>R$ {d.total}</div>
              <Tag color={T.blue}>{d.splits.length} pessoas</Tag>
            </div>
          </div>
        </Card>
      ); })}
    </div>
  );
}

// ─── CARDÁPIO SEMANAL ─────────────────────────────────────────────────────────
const DIAS_SEMANA = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const REFEICOES   = ["Café da manhã","Almoço","Jantar"];
const INIT_CARDAPIO = {
  "Seg": { "Café da manhã":"Pão, queijo e café", "Almoço":"Arroz, feijão e frango grelhado", "Jantar":"Macarrão ao molho" },
  "Ter": { "Café da manhã":"Iogurte com granola",  "Almoço":"Salada de atum",               "Jantar":"Sopa de legumes"     },
  "Qua": { "Café da manhã":"Tapioca",              "Almoço":"Arroz, bife e salada",          "Jantar":"Omelete"             },
  "Qui": { "Café da manhã":"Vitamina de banana",   "Almoço":"Frango ao forno e arroz",       "Jantar":"Pizza caseira"       },
  "Sex": { "Café da manhã":"Pão, manteiga e suco", "Almoço":"Marmita de frango",             "Jantar":"Hambúrguer"          },
  "Sáb": { "Café da manhã":"Panqueca",             "Almoço":"Churrasco",                     "Jantar":"Lanche natural"      },
  "Dom": { "Café da manhã":"Tapioca e café",       "Almoço":"Feijoada",                      "Jantar":"Sobras da feijoada"  },
};

function CardapioScreen({ T, currentUser }) {
  const [cardapio, setCardapio] = useState(INIT_CARDAPIO);
  const [activeDay, setActiveDay] = useState("Qua");
  const [editing, setEditing] = useState(null); // {day, meal}
  const [editVal, setEditVal] = useState("");
  const isAdmin = currentUser.role==="admin";

  function startEdit(day, meal) {
    setEditing({day,meal}); setEditVal(cardapio[day]?.[meal]||"");
  }
  function saveEdit() {
    if (!editing) return;
    setCardapio(c=>({ ...c, [editing.day]:{ ...c[editing.day], [editing.meal]:editVal } }));
    setEditing(null);
  }

  const mealIcons = { "Café da manhã":"☀️", "Almoço":"🌤️", "Jantar":"🌙" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:20, fontWeight:900, color:T.text }}>🍽️ Cardápio Semanal</div>

      <div style={{ display:"flex", gap:5, overflowX:"auto" }}>
        {DIAS_SEMANA.map(d=>(
          <button key={d} onClick={()=>setActiveDay(d)} style={{ background:activeDay===d?T.accent:T.card, border:`1px solid ${activeDay===d?T.accent:T.border}`, color:activeDay===d?"#fff":T.muted, borderRadius:10, padding:"7px 11px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{d}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {REFEICOES.map(meal=>{
          const content = cardapio[activeDay]?.[meal]||"Não planejado";
          const isEditing = editing?.day===activeDay && editing?.meal===meal;
          return (
            <Card key={meal} T={T} style={{ border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:T.cardAlt, fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{mealIcons[meal]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:T.muted, letterSpacing:0.8, marginBottom:4 }}>{meal.toUpperCase()}</div>
                  {isEditing ? (
                    <div>
                      <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                        style={{ width:"100%", background:T.cardAlt, border:`1.5px solid ${T.accent}`, borderRadius:8, padding:"8px 10px", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:8 }}/>
                      <div style={{ display:"flex", gap:6 }}>
                        <Btn T={T} small onClick={saveEdit}>Salvar</Btn>
                        <Btn T={T} small variant="secondary" onClick={()=>setEditing(null)}>Cancelar</Btn>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:14, color:T.text, lineHeight:1.4 }}>{content}</div>
                      {isAdmin && <button onClick={()=>startEdit(activeDay,meal)} style={{ background:"none", border:"none", fontSize:14, cursor:"pointer", color:T.muted, marginLeft:8 }}>✏️</button>}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Visão geral semanal */}
      <Card T={T}>
        <SecTitle T={T}>📅 VISÃO DA SEMANA</SecTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {DIAS_SEMANA.map(d=>(
            <div key={d} onClick={()=>setActiveDay(d)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:activeDay===d?T.accentBg:T.cardAlt, border:`1px solid ${activeDay===d?T.accent+"44":T.border}`, borderRadius:10, cursor:"pointer" }}>
              <div style={{ fontSize:12, fontWeight:800, color:activeDay===d?T.accentLight:T.muted, width:28 }}>{d}</div>
              <div style={{ flex:1, fontSize:12, color:T.text }}>{cardapio[d]?.["Almoço"]||"Não planejado"}</div>
              <div style={{ fontSize:14 }}>🌤️</div>
            </div>
          ))}
        </div>
      </Card>

      {isAdmin && (
        <button style={{ background:T.accentBg, border:`1px dashed ${T.accent}66`, borderRadius:14, padding:14, fontSize:13, fontWeight:700, color:T.accentLight, cursor:"pointer", width:"100%" }}>
          🤖 Gerar cardápio automático com IA
        </button>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
function MainApp({ T, dark, setDark, currentUser, family, setFamily, onLogout }) {
  const [screen, setScreen] = useState("home");
  const [showMore, setShowMore] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [tasks, setTasks] = useState(INIT_TASKS);

  const me = family.members.find(m=>m.id===currentUser.id)||currentUser;
  const perms = me.permissions||{};
  const pendingApprovals = tasks.filter(t=>t.pending_approval).length;

  const NAV = [
    { id:"home",     label:"Início",  icon:"🏠", always:true },
    { id:"tasks",    label:"Tarefas", icon:"✅", perm:"tasks" },
    { id:"shopping", label:"Compras", icon:"🛒", perm:"shopping" },
    { id:"finance",  label:"Finanças",icon:"💰", perm:"finance" },
    { id:"more",     label:"Mais",    icon:"⋯", always:true },
  ].filter(n=>n.always||perms[n.perm]);

  const MORE = [
    { id:"calendar",      label:"Agenda",      icon:"📅", perm:"calendar" },
    { id:"goals",         label:"Metas",       icon:"🎯", perm:"goals" },
    { id:"routine",       label:"Rotinas",     icon:"🌙", perm:"routine" },
    { id:"reports",       label:"Relatórios",  icon:"📊", perm:"reports" },
    { id:"notifications", label:"Avisos",      icon:"🔔", perm:"notifications" },
    { id:"ai",            label:"IA",          icon:"🤖", perm:"ai" },
    { id:"mural",         label:"Mural",       icon:"📋", always:true },
    { id:"resumo",        label:"Resumo",      icon:"📈", always:true },
    { id:"loja",          label:"Loja",        icon:"🏪", always:true },
    { id:"despesas",      label:"Despesas",    icon:"🤝", always:true },
    { id:"cardapio",      label:"Cardápio",    icon:"🍽️", always:true },
    { id:"profile",       label:"Perfil",      icon:"👤", always:true },
  ].filter(n=>n.always||perms[n.perm]);

  function renderScreen() {
    const props = { T, currentUser, family, tasks, setTasks };
    switch(screen) {
      case "home":          return <HomeScreen {...props}/>;
      case "tasks":         return <TasksScreen {...props}/>;
      case "shopping":      return <ShoppingScreen T={T} family={family}/>;
      case "finance":       return <FinanceScreen T={T}/>;
      case "calendar":      return <CalendarScreen T={T}/>;
      case "goals":         return <GoalsScreen T={T} family={family}/>;
      case "routine":       return <RoutineScreen T={T} family={family}/>;
      case "reports":       return <ReportsScreen T={T} family={family} tasks={tasks}/>;
      case "notifications": return <NotificationsScreen T={T}/>;
      case "ai":            return <AIScreen T={T} currentUser={currentUser} family={family}/>;
      case "mural":         return <MuralScreen T={T} currentUser={currentUser} family={family}/>;
      case "resumo":        return <ResumoScreen T={T} family={family} tasks={tasks}/>;
      case "loja":          return <LojaScreen T={T} currentUser={currentUser} family={family}/>;
      case "despesas":      return <DespesasScreen T={T} family={family}/>;
      case "cardapio":      return <CardapioScreen T={T} currentUser={currentUser}/>;
      case "profile":       return <ProfileScreen T={T} currentUser={currentUser} family={family} onLogout={onLogout} onOpenAdmin={()=>setShowAdmin(true)}/>;
      default:              return <HomeScreen {...props}/>;
    }
  }

  return (
    <>
      {/* Status bar */}
      <div style={{ background:T.card, padding:"12px 20px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:me.color+"22", border:`2px solid ${me.color}`, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>{me.avatar}</div>
          <span style={{ fontSize:13, fontWeight:900, color:T.accentLight }}>FamilyFlow</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {currentUser.role==="admin" && pendingApprovals>0 && (
            <button onClick={()=>setShowAdmin(true)} style={{ background:T.yellow+"22", border:`1px solid ${T.yellow}44`, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:800, color:T.yellow, cursor:"pointer" }}>⏳ {pendingApprovals}</button>
          )}
          <button onClick={()=>setDark(!dark)} style={{ background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:8, padding:"3px 8px", fontSize:12, cursor:"pointer", color:T.muted }}>{dark?"☀️":"🌙"}</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"18px 16px 88px", minHeight:560, maxHeight:660, overflowY:"auto" }}>{renderScreen()}</div>

      {/* More drawer */}
      {showMore && (
        <div style={{ position:"absolute", bottom:62, left:0, right:0, background:T.card, borderTop:`1px solid ${T.border}`, padding:"14px 14px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {MORE.map(s=>(
            <button key={s.id} onClick={()=>{ setScreen(s.id); setShowMore(false); }} style={{ background:screen===s.id?T.accentBg:T.cardAlt, border:`1px solid ${screen===s.id?T.accent+"55":T.border}`, borderRadius:12, padding:"12px 6px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ fontSize:9, fontWeight:700, color:screen===s.id?T.accentLight:T.muted }}>{s.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:T.card, borderTop:`1px solid ${T.border}`, display:"flex", padding:"8px 0 18px" }}>
        {NAV.map(s=>{ const active=s.id==="more"?showMore:screen===s.id; return (
          <button key={s.id} onClick={()=>{ if(s.id==="more"){setShowMore(!showMore);}else{setScreen(s.id);setShowMore(false);} }} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ fontSize:20, filter:active?"none":"grayscale(1) opacity(.4)", transform:active?"scale(1.18)":"scale(1)", transition:"all .2s" }}>{s.icon}</div>
            <span style={{ fontSize:9, fontWeight:800, color:active?T.accentLight:T.muted }}>{s.label.toUpperCase()}</span>
          </button>
        ); })}
      </div>

      {/* Admin overlay */}
      {showAdmin && currentUser.role==="admin" && (
        <AdminPanel T={T} currentUser={currentUser} family={family} setFamily={setFamily} tasks={tasks} setTasks={setTasks} onClose={()=>setShowAdmin(false)}/>
      )}
    </>
  );
}

// ─── RAIZ ─────────────────────────────────────────────────────────────────────
function App() {
  const [dark, setDark] = useState(true);
  const [authScreen, setAuthScreen] = useState("welcome");
  const [currentUser, setCurrentUser] = useState(null);
  const [family, setFamily] = useState(null);
  const T = dark ? DARK : LIGHT;

  function onSuccess(user, fam) { setCurrentUser(user); setFamily(fam); }
  function onLogout()           { setCurrentUser(null); setFamily(null); setAuthScreen("welcome"); }

  return (
    <div style={{ minHeight:"100vh", background:dark?"#080A12":"#DDE1FF", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI', system-ui, sans-serif", padding:16, transition:"background .4s" }}>
      <div style={{ width:390, background:T.bg, borderRadius:44, border:`1.5px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden", position:"relative", minHeight:700 }}>

        {!currentUser ? (
          <>
            <div style={{ position:"absolute", top:14, right:16, zIndex:10 }}>
              <button onClick={()=>setDark(!dark)} style={{ background:T.cardAlt, border:`1px solid ${T.border}`, borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", color:T.muted }}>{dark?"☀️":"🌙"}</button>
            </div>
            {authScreen==="welcome"  && <WelcomeScreen  T={T} onLogin={()=>setAuthScreen("login")} onRegister={()=>setAuthScreen("register")} onJoin={()=>setAuthScreen("join")}/>}
            {authScreen==="login"    && <LoginScreen    T={T} onBack={()=>setAuthScreen("welcome")} onSuccess={onSuccess}/>}
            {authScreen==="register" && <RegisterScreen T={T} onBack={()=>setAuthScreen("welcome")} onSuccess={onSuccess}/>}
            {authScreen==="join"     && <JoinScreen     T={T} onBack={()=>setAuthScreen("welcome")} onSuccess={onSuccess}/>}
          </>
        ) : (
          <MainApp T={T} dark={dark} setDark={setDark} currentUser={currentUser} family={family} setFamily={setFamily} onLogout={onLogout}/>
        )}
      </div>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
