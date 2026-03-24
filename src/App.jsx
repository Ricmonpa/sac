import React, { useState } from 'react';
import { LayoutDashboard, Presentation, Calculator, CalendarDays, Sparkles, ChevronRight, Users, Building, ArrowRight, Loader2 } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('presentation');
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col shadow-xl z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">
            SAC<span className="text-white">Toolkit</span>
          </h1>
          <p className="text-indigo-200 text-xs mt-1">Plataforma Operativa v1.0</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Presentation size={20} />} label="Creador de Slides" active={activeTab === 'presentation'} onClick={() => setActiveTab('presentation')} />
          <NavItem icon={<Calculator size={20} />} label="Presupuestos" active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
          <NavItem icon={<CalendarDays size={20} />} label="Agenda Automatizada" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        </nav>
        <div className="p-4 m-4 bg-indigo-900 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">Z</div>
            <div>
              <p className="font-semibold">Zac (Admin)</p>
              <p className="text-indigo-300 text-xs">Plan Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {activeTab === 'dashboard' && 'Visión General de Eventos'}
            {activeTab === 'presentation' && 'Consola de Presentaciones de Alto Valor'}
            {activeTab === 'budget' && 'Generador Inteligente de Cotizaciones'}
            {activeTab === 'schedule' && 'Agendador Automático'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> IA Operativa
            </span>
          </div>
        </header>
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'presentation' && <PresentationToolkit />}
          {activeTab === 'budget' && <BudgetGenerator />}
          {activeTab === 'schedule' && <ScheduleView />}
        </div>
      </main>
    </div>
  );
};

// --- VIEWS ---
const PresentationToolkit = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({ industry: '', eventType: '', differentiator: '', tone: '' });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setResult(true);
    }, 2000);
  };

  const hiddenPrompt = `Actúa como un experto en ventas B2B y diseñador de presentaciones para "SAC Convenciones".
Necesito una estructura de presentación para un cliente de la industria [${formData.industry || 'Tecnológica'}].
El evento que les vamos a organizar es un [${formData.eventType || 'Lanzamiento de Producto'}].
Nuestro enfoque principal para ganar este cliente será [${formData.differentiator || 'Innovación y Experiencia Inmersiva'}].
El tono de la presentación debe ser [${formData.tone || 'Creativo y Disruptivo'}].
Genera una estructura de 5 slides clave. Para cada slide dame: 1. Título impactante, 2. Puntos clave a mencionar, 3. Sugerencia visual.`;

  return (
    <div className="max-w-5xl mx-auto flex gap-8">
      {/* Formulario */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 self-start">
        <div className="mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="text-indigo-500" size={20} /> El Embudo</h3>
          <p className="text-sm text-slate-500 mt-1">Llena estos 4 datos. La IA hará el resto del trabajo pesado por ti.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">1. Industria del Cliente</label>
            <select className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({ ...formData, industry: e.target.value })}>
              <option value="">Selecciona industria...</option>
              <option value="Farmacéutica">Farmacéutica</option>
              <option value="Automotriz">Automotriz</option>
              <option value="Tecnología">Tecnología (SaaS / IT)</option>
              <option value="Financiera">Financiera / Banca</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">2. ¿Qué le vamos a organizar?</label>
            <select className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}>
              <option value="">Tipo de evento...</option>
              <option value="Congreso Anual">Congreso Anual</option>
              <option value="Lanzamiento de Producto">Lanzamiento de Producto</option>
              <option value="Viaje de Incentivo">Viaje de Incentivo</option>
              <option value="Fiesta de Fin de Año">Fiesta de Fin de Año</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">3. ¿Por qué SAC ganará este pitch?</label>
            <input type="text" placeholder="Ej: Presupuesto optimizado, Tecnología LED..." className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({ ...formData, differentiator: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">4. Tono de la Presentación</label>
            <select className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({ ...formData, tone: e.target.value })}>
              <option value="">Selecciona el tono...</option>
              <option value="Ultra Formal y Corporativo">Ultra Formal y Corporativo</option>
              <option value="Creativo, Disruptivo y Moderno">Creativo, Disruptivo y Moderno</option>
              <option value="Emocional e Inspirador">Emocional e Inspirador</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.industry}
            className={`w-full mt-4 py-3 rounded-md font-medium text-white flex items-center justify-center gap-2 transition-all ${isGenerating || !formData.industry ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
          >
            {isGenerating ? <><Loader2 className="animate-spin" size={18} /> Generando Magia...</> : <><Sparkles size={18} /> Crear Presentación Maestra</>}
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="w-2/3 flex flex-col gap-6">
        {!result && !isGenerating && (
          <div className="bg-slate-100 rounded-xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center h-full text-slate-400">
            <Presentation size={48} className="mb-4 text-slate-300" />
            <h4 className="text-lg font-medium text-slate-600">El lienzo está en blanco</h4>
            <p className="max-w-sm mt-2">Llena el formulario de la izquierda. La IA estructurará el guion perfecto para que cierres esta venta.</p>
          </div>
        )}
        {isGenerating && (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-12 flex flex-col items-center justify-center text-center h-full">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h4 className="text-lg font-bold text-slate-700">Diseñando la estrategia narrativa...</h4>
            <p className="text-sm text-slate-500 mt-2">Aplicando tácticas de ventas persuasivas y estructurando slides.</p>
          </div>
        )}
        {result && (
          <>
            <div className="bg-slate-800 rounded-xl p-5 shadow-inner">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles size={14} /> Lo que pasa detrás de escena (Prompt Maestro inyectado a la IA)
              </h4>
              <p className="text-slate-300 text-sm font-mono leading-relaxed bg-slate-900 p-3 rounded whitespace-pre-wrap">
                {hiddenPrompt}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-slate-800">Tu Presentación está lista para diseñarse</h3>
                <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-3 rounded font-medium transition-colors">
                  Copiar al Portapapeles
                </button>
              </div>
              <div className="space-y-6">
                <SlideCard number="01" title={`El futuro de la industria ${formData.industry || 'Tecnológica'} comienza aquí`} points={["El reto actual del sector", "Por qué este evento no puede ser 'uno más'", "El objetivo central: Dejar huella."]} visual="Fondo oscuro con una imagen de alta calidad de un auditorio moderno iluminado en tonos azules." />
                <SlideCard number="02" title={`La Experiencia: ${formData.eventType || 'Lanzamiento de Producto'}`} points={["Cronograma visual del evento", "Momentos 'Wow' planeados", "Integración de los asistentes."]} visual="Mockup 3D del venue propuesto, mostrando la distribución y el flujo de gente." />
                <SlideCard number="03" title="¿Por qué SAC Convenciones?" points={[`Nuestra ventaja competitiva: ${formData.differentiator || 'Innovación'}`, "Equipo dedicado 24/7", "Cero estrés para tu comité organizador."]} visual="Iconografía limpia y minimalista, quizás un gráfico de pastel mostrando eficiencia de tiempos." />
                <SlideCard number="04" title="Casos de Éxito Similares" points={["Evento X para Cliente Y (Logros)", "Retorno de inversión demostrado", "Testimonial corto."]} visual="Un collage elegante de 3 fotografías de eventos pasados de alta gama." />
                <SlideCard number="05" title="Siguientes Pasos" points={["Revisión de presupuesto", "Firma de contrato", "Kick-off meeting."]} visual="Call to Action claro. Código QR para agendar la próxima reunión." />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SlideCard = ({ number, title, points, visual }) => (
  <div className="relative pl-12">
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200">
      {number}
    </div>
    <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Puntos a Hablar</p>
        <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
      <div className="bg-indigo-50/50 p-3 rounded-md border border-indigo-100/50">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Instrucción Visual</p>
        <p className="text-sm text-indigo-900/80 italic">"{visual}"</p>
      </div>
    </div>
  </div>
);

const BudgetGenerator = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-green-500" /> Calculadora y Narrativa de Presupuesto</h3>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Asistentes</label>
          <input type="number" defaultValue={500} className="w-full border border-slate-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Días de Evento</label>
          <input type="number" defaultValue={3} className="w-full border border-slate-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nivel de Producción</label>
          <select className="w-full border border-slate-300 rounded-md p-2">
            <option>Premium (Pantallas LED, Sonido Line Array)</option>
            <option>Estándar</option>
          </select>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-6">
        <div className="bg-slate-50 p-6 rounded-lg mb-6">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Resumen Ejecutivo Generado por IA</h4>
          <p className="text-slate-700 text-sm leading-relaxed">
            "Para garantizar el éxito de su evento de 3 días con 500 asistentes, hemos estructurado una inversión estratégica de <strong className="text-green-600">$450,000 MXN</strong>. Esta propuesta nivel Premium no es solo un gasto logístico, sino una inversión en la retención de su audiencia, asegurando tecnología audiovisual de punta y una gestión operativa impecable por parte del equipo de SAC."
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-slate-800">$450,000 <span className="text-lg text-slate-400 font-normal">MXN</span></div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
            Exportar PDF Oficial <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DashboardView = () => (
  <div className="max-w-6xl mx-auto space-y-6">
    <div className="grid grid-cols-3 gap-6">
      <StatCard title="Eventos Activos (Este Mes)" value="12" icon={<Building className="text-blue-500" />} trend="+2 vs mes pasado" />
      <StatCard title="Propuestas Enviadas" value="8" icon={<Presentation className="text-purple-500" />} trend="3 pendientes de firma" />
      <StatCard title="Capacidad de Equipo" value="85%" icon={<Users className="text-orange-500" />} trend="Alta ocupación" />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold mb-4">Próximos 15 días</h3>
      <div className="space-y-3">
        <EventRow date="15 Oct" name="Congreso Médico Nacional" status="Confirmado" color="bg-green-100 text-green-700" />
        <EventRow date="18 Oct" name="Lanzamiento Auto Eléctrico" status="Tentativo" color="bg-orange-100 text-orange-700" />
        <EventRow date="22 Oct" name="Convención Ventas Seguros" status="Confirmado" color="bg-green-100 text-green-700" />
      </div>
    </div>
  </div>
);

const ScheduleView = () => (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center py-16">
    <CalendarDays size={48} className="mx-auto text-indigo-300 mb-4" />
    <h3 className="text-2xl font-bold text-slate-800 mb-2">Agendador Integrado</h3>
    <p className="text-slate-500 mb-6">Envía tu propuesta generada por IA junto con un link directo para que el cliente agende la llamada de revisión, sincronizado con el calendario del equipo SAC.</p>
    <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium shadow-md hover:bg-indigo-700 inline-flex items-center gap-2">
      Conectar con Google Calendar
    </button>
  </div>
);

// --- HELPER COMPONENTS ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <h4 className="text-3xl font-bold text-slate-800 mb-1">{value}</h4>
    <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
    <p className="text-xs text-slate-400">{trend}</p>
  </div>
);

const EventRow = ({ date, name, status, color }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-16 text-center font-bold text-indigo-600 bg-indigo-50 py-1 rounded-md text-sm">{date}</div>
      <div className="font-medium text-slate-700">{name}</div>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>{status}</span>
  </div>
);

export default App;
