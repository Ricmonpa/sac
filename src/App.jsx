import React, { useState } from 'react';
import { LayoutDashboard, Presentation, Calculator, CalendarDays, Sparkles, Users, Building, ArrowRight, Loader2, AlertCircle, Copy, Check } from 'lucide-react';

// ─── GEMINI HELPER ───────────────────────────────────────────────────────────
async function callGemini(apiKey, prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `Error ${res.status}`);
  }
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(raw);
}

// ─── APP ─────────────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('presentation');
  const [apiKey, setApiKey] = useState('');

  const tabLabel = {
    dashboard: 'Visión General de Eventos',
    presentation: 'Consola de Presentaciones de Alto Valor',
    budget: 'Generador Inteligente de Cotizaciones',
    schedule: 'Agendador Automático',
  };

  return (
    <div className="flex h-screen bg-zinc-100 text-zinc-900 font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col shadow-xl z-10">

        {/* Logo */}
        <div className="px-6 pt-7 pb-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {/* SAC diagonal-stripe logo replica */}
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
              <svg viewBox="0 0 40 40" width="40" height="40">
                <rect width="40" height="40" fill="white"/>
                {[...Array(9)].map((_, i) => (
                  <line key={i} x1={-10 + i * 7} y1="0" x2={-10 + i * 7 + 40} y2="40"
                    stroke="#111" strokeWidth="3.5" />
                ))}
                <rect width="40" height="40" fill="transparent"/>
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                  fontSize="13" fontWeight="800" fill="white"
                  style={{ fontFamily: 'sans-serif', letterSpacing: '1px' }}>SAC</text>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-tight">
                SAC<span className="text-zinc-400">Toolkit</span>
              </h1>
              <p className="text-zinc-500 text-xs">Plataforma IA v1.0</p>
            </div>
          </div>
        </div>

        {/* API Key input */}
        <div className="px-4 pt-4 pb-2">
          <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
            🔑 Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
          />
          <p className="text-zinc-600 text-xs mt-1">Tu key no sale de tu navegador.</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 mt-3">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard"           active={activeTab === 'dashboard'}    onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Presentation size={18} />}  label="Creador de Slides"     active={activeTab === 'presentation'} onClick={() => setActiveTab('presentation')} />
          <NavItem icon={<Calculator size={18} />}    label="Presupuestos"           active={activeTab === 'budget'}       onClick={() => setActiveTab('budget')} />
          <NavItem icon={<CalendarDays size={18} />}  label="Agenda Automatizada"   active={activeTab === 'schedule'}     onClick={() => setActiveTab('schedule')} />
        </nav>

        {/* User */}
        <div className="p-3 m-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-sm">Z</div>
            <div>
              <p className="font-semibold text-sm">Zac (Admin)</p>
              <p className="text-zinc-500 text-xs">Plan Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex justify-between items-center sticky top-0 z-0 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">{tabLabel[activeTab]}</h2>
          <span className="text-sm text-zinc-500 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full inline-block ${apiKey ? 'bg-green-500' : 'bg-zinc-400'}`}></span>
            {apiKey ? 'IA Operativa' : 'Conecta tu API Key'}
          </span>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard'    && <DashboardView />}
          {activeTab === 'presentation' && <PresentationToolkit apiKey={apiKey} />}
          {activeTab === 'budget'       && <BudgetGenerator />}
          {activeTab === 'schedule'     && <ScheduleView />}
        </div>
      </main>
    </div>
  );
};

// ─── PRESENTATION TOOLKIT ────────────────────────────────────────────────────
const PresentationToolkit = ({ apiKey }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ industry: '', eventType: '', differentiator: '', tone: '' });

  const buildPrompt = () => `
Eres un experto en ventas B2B y diseñador de presentaciones para "SAC Convenciones", empresa líder en organización de eventos corporativos en México.

Crea una estructura de presentación de ventas para un pitch a un cliente de la industria: ${formData.industry}.
Tipo de evento a organizar: ${formData.eventType}.
Diferenciador / argumento principal de SAC: ${formData.differentiator || 'Experiencia de 15 años y tecnología de punta'}.
Tono de la presentación: ${formData.tone}.

Responde ÚNICAMENTE con un objeto JSON con esta estructura exacta (sin markdown, sin texto extra):
{
  "slides": [
    {
      "number": "01",
      "title": "Título impactante del slide",
      "points": ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
      "visual": "Descripción de la imagen o gráfico recomendado"
    }
  ]
}

Genera exactamente 5 slides. Los títulos deben ser poderosos y orientados a cerrar la venta.
`.trim();

  const handleGenerate = async () => {
    if (!apiKey) { setError('Pega tu Gemini API Key en el sidebar para continuar.'); return; }
    setError(null);
    setSlides(null);
    setIsGenerating(true);
    try {
      const data = await callGemini(apiKey, buildPrompt());
      setSlides(data.slides);
    } catch (e) {
      setError(`Error de Gemini: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!slides) return;
    const text = slides.map(s =>
      `SLIDE ${s.number}: ${s.title}\n` +
      s.points.map(p => `  • ${p}`).join('\n') +
      `\n  📸 Visual: ${s.visual}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = formData.industry && formData.eventType && formData.tone && !isGenerating;

  return (
    <div className="max-w-5xl mx-auto flex gap-8">

      {/* ── Formulario ── */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-zinc-200 p-6 self-start">
        <h3 className="text-base font-bold flex items-center gap-2 mb-1">
          <Sparkles className="text-zinc-900" size={18}/> El Embudo de 4 Datos
        </h3>
        <p className="text-xs text-zinc-500 mb-5">La IA hará el trabajo pesado por ti.</p>

        <div className="space-y-4">
          <Field label="1. Industria del Cliente">
            <select className={selectCls} onChange={(e) => setFormData({ ...formData, industry: e.target.value })}>
              <option value="">Selecciona industria...</option>
              <option>Farmacéutica</option>
              <option>Automotriz</option>
              <option>Tecnología (SaaS / IT)</option>
              <option>Financiera / Banca</option>
              <option>Retail / Consumo masivo</option>
              <option>Manufactura / Industrial</option>
            </select>
          </Field>

          <Field label="2. ¿Qué le vamos a organizar?">
            <select className={selectCls} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}>
              <option value="">Tipo de evento...</option>
              <option>Congreso Anual</option>
              <option>Lanzamiento de Producto</option>
              <option>Viaje de Incentivo</option>
              <option>Fiesta de Fin de Año</option>
              <option>Convención de Ventas</option>
              <option>Summit Ejecutivo</option>
            </select>
          </Field>

          <Field label="3. Diferenciador de SAC (¿por qué ganamos?)">
            <input
              type="text"
              placeholder="Ej: Tecnología LED inmersiva..."
              className={inputCls}
              onChange={(e) => setFormData({ ...formData, differentiator: e.target.value })}
            />
          </Field>

          <Field label="4. Tono de la Presentación">
            <select className={selectCls} onChange={(e) => setFormData({ ...formData, tone: e.target.value })}>
              <option value="">Selecciona el tono...</option>
              <option>Ultra Formal y Corporativo</option>
              <option>Creativo, Disruptivo y Moderno</option>
              <option>Emocional e Inspirador</option>
              <option>Técnico y basado en datos</option>
            </select>
          </Field>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full mt-2 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all
              ${canGenerate
                ? 'bg-zinc-950 text-white hover:bg-zinc-700 shadow-md'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
          >
            {isGenerating
              ? <><Loader2 className="animate-spin" size={16}/> Generando con IA...</>
              : <><Sparkles size={16}/> Crear Presentación Maestra</>}
          </button>
        </div>
      </div>

      {/* ── Resultado ── */}
      <div className="w-2/3 flex flex-col gap-5">

        {/* Estado vacío */}
        {!slides && !isGenerating && !error && (
          <div className="bg-white rounded-xl border-2 border-dashed border-zinc-200 p-14 flex flex-col items-center justify-center text-center">
            <Presentation size={44} className="mb-4 text-zinc-300" />
            <h4 className="text-base font-semibold text-zinc-600">El lienzo está en blanco</h4>
            <p className="max-w-xs mt-2 text-sm text-zinc-400">
              Llena el formulario y presiona el botón. La IA de Gemini estructurará el guion perfecto para cerrar esta venta.
            </p>
          </div>
        )}

        {/* Cargando */}
        {isGenerating && (
          <div className="bg-white rounded-xl border border-zinc-100 p-14 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative w-14 h-14 mb-5">
              <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-zinc-900 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h4 className="text-base font-bold text-zinc-800">Diseñando la estrategia narrativa...</h4>
            <p className="text-sm text-zinc-400 mt-2">Gemini está aplicando tácticas de ventas persuasivas.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5"/>
            <div>
              <p className="font-semibold text-red-700 text-sm">Algo salió mal</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Slides reales de Gemini */}
        {slides && (
          <>
            {/* Prompt detrás de escena */}
            <div className="bg-zinc-900 rounded-xl p-5">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles size={12}/> Prompt Maestro enviado a Gemini
              </h4>
              <pre className="text-zinc-300 text-xs font-mono leading-relaxed bg-black/40 p-3 rounded-lg whitespace-pre-wrap">
                {buildPrompt()}
              </pre>
            </div>

            {/* Cards de slides */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
              <div className="flex justify-between items-center mb-5 border-b border-zinc-100 pb-4">
                <h3 className="text-base font-bold text-zinc-900">
                  ✅ Presentación lista para diseñarse
                </h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-1.5 px-3 rounded-lg font-medium transition-colors"
                >
                  {copied ? <><Check size={13}/> Copiado</> : <><Copy size={13}/> Copiar todo</>}
                </button>
              </div>
              <div className="space-y-7">
                {slides.map((slide) => (
                  <SlideCard key={slide.number} {...slide} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SLIDE CARD ───────────────────────────────────────────────────────────────
const SlideCard = ({ number, title, points, visual }) => (
  <div className="relative pl-12">
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-950 text-white font-bold flex items-center justify-center text-xs">
      {number}
    </div>
    <h4 className="text-base font-bold text-zinc-900 mb-3 leading-snug">{title}</h4>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Puntos a hablar</p>
        <ul className="text-sm text-zinc-700 space-y-1 list-disc pl-4">
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
      <div className="bg-zinc-900 p-3 rounded-lg">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Instrucción visual</p>
        <p className="text-sm text-zinc-300 italic leading-snug">"{visual}"</p>
      </div>
    </div>
  </div>
);

// ─── BUDGET GENERATOR ─────────────────────────────────────────────────────────
const BudgetGenerator = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Calculator className="text-zinc-700" size={20}/> Calculadora y Narrativa de Presupuesto
      </h3>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Field label="Asistentes">
          <input type="number" defaultValue={500} className={inputCls} />
        </Field>
        <Field label="Días de Evento">
          <input type="number" defaultValue={3} className={inputCls} />
        </Field>
        <Field label="Nivel de Producción">
          <select className={selectCls}>
            <option>Premium (Pantallas LED, Sonido Line Array)</option>
            <option>Estándar</option>
          </select>
        </Field>
      </div>
      <div className="border-t border-zinc-100 pt-6">
        <div className="bg-zinc-50 p-6 rounded-xl mb-6 border border-zinc-100">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Resumen Ejecutivo — IA</h4>
          <p className="text-zinc-700 text-sm leading-relaxed">
            "Para garantizar el éxito de su evento de 3 días con 500 asistentes, hemos estructurado una inversión estratégica de{' '}
            <strong className="text-zinc-900">$450,000 MXN</strong>. Esta propuesta nivel Premium no es solo un gasto logístico,
            sino una inversión en la retención de su audiencia, asegurando tecnología audiovisual de punta y una gestión operativa
            impecable por parte del equipo de SAC."
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-zinc-900">$450,000 <span className="text-lg text-zinc-400 font-normal">MXN</span></div>
          <button className="bg-zinc-950 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
            Exportar PDF Oficial <ArrowRight size={15}/>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const DashboardView = () => (
  <div className="max-w-6xl mx-auto space-y-6">
    <div className="grid grid-cols-3 gap-6">
      <StatCard title="Eventos Activos (Este Mes)" value="12" icon={<Building size={20} className="text-zinc-600"/>} trend="+2 vs mes pasado" />
      <StatCard title="Propuestas Enviadas"         value="8"  icon={<Presentation size={20} className="text-zinc-600"/>} trend="3 pendientes de firma" />
      <StatCard title="Capacidad de Equipo"         value="85%" icon={<Users size={20} className="text-zinc-600"/>} trend="Alta ocupación" />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
      <h3 className="text-base font-bold mb-4 text-zinc-900">Próximos 15 días</h3>
      <div className="space-y-2">
        <EventRow date="15 Oct" name="Congreso Médico Nacional"    status="Confirmado" confirmed />
        <EventRow date="18 Oct" name="Lanzamiento Auto Eléctrico"  status="Tentativo"  confirmed={false} />
        <EventRow date="22 Oct" name="Convención Ventas Seguros"   status="Confirmado" confirmed />
      </div>
    </div>
  </div>
);

// ─── SCHEDULE VIEW ────────────────────────────────────────────────────────────
const ScheduleView = () => (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-zinc-200 text-center py-16">
    <CalendarDays size={44} className="mx-auto text-zinc-300 mb-4" />
    <h3 className="text-xl font-bold text-zinc-900 mb-2">Agendador Integrado</h3>
    <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
      Envía la propuesta generada por IA con un link para que el cliente agende la llamada de revisión,
      sincronizado con el calendario de SAC.
    </p>
    <button className="bg-zinc-950 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-700 inline-flex items-center gap-2 text-sm transition-colors">
      Conectar con Google Calendar
    </button>
  </div>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const selectCls = 'w-full border border-zinc-200 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-800';
const inputCls  = 'w-full border border-zinc-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-zinc-900 outline-none placeholder-zinc-400';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">{label}</label>
    {children}
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
      ${active ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
    <div className="p-2 bg-zinc-100 rounded-lg w-fit mb-4">{icon}</div>
    <h4 className="text-3xl font-bold text-zinc-900 mb-1">{value}</h4>
    <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
    <p className="text-xs text-zinc-400">{trend}</p>
  </div>
);

const EventRow = ({ date, name, status, confirmed }) => (
  <div className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-lg transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-16 text-center font-bold text-zinc-900 bg-zinc-100 py-1 rounded-md text-xs">{date}</div>
      <div className="font-medium text-zinc-700 text-sm">{name}</div>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${confirmed ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
      {status}
    </span>
  </div>
);

export default App;
