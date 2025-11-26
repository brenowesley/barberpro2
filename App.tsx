
import React, { useState } from 'react';
import { 
  Scissors, LayoutDashboard, Calendar, Users, CreditCard, Settings, 
  LogOut, TrendingUp, Lock, CheckCircle, Plus, Sparkles, 
  Menu, X, UserIcon
} from './components/Icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { PlanTier, UserRole, User, PLAN_CONFIGS, Service, Appointment } from './types';
import { generateBusinessAdvice, generateServiceDescription } from './services/geminiService';

// --- Mock Data & Initial State ---

const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Corte Masculino', price: 35, duration: 30, description: 'Corte clássico na tesoura e máquina.' },
  { id: '2', name: 'Barba', price: 20, duration: 15, description: 'Modelagem e aparo da barba.' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: '101', serviceId: '1', clientName: 'João Silva', date: new Date().toISOString(), status: 'CONFIRMED', price: 35 },
  { id: '102', serviceId: '2', clientName: 'Marcos Souza', date: new Date(Date.now() - 86400000).toISOString(), status: 'COMPLETED', price: 20 },
  { id: '103', serviceId: '1', clientName: 'Alexandre Dias', date: new Date(Date.now() - 172800000).toISOString(), status: 'COMPLETED', price: 35 },
];

const MOCK_USER: User = {
  id: 'u1',
  name: 'Esteban Barber',
  role: UserRole.PROVIDER,
  plan: PlanTier.FREE, 
  services: [...INITIAL_SERVICES],
  appointments: [...INITIAL_APPOINTMENTS],
  portfolioImages: ['https://picsum.photos/300/300', 'https://picsum.photos/300/301'],
  shopName: "Esteban's Cuts",
};

// --- Components ---

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ 
  children, onClick, variant = 'primary', className = '', disabled = false, type = 'button'
}: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 active:scale-95",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

interface BadgeProps {
  children?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const Badge = ({ children, color = 'blue' }: BadgeProps) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${colors[color]}`}>{children}</span>;
};

// --- Payment Modal Component ---

const PaymentModal = ({ planId, planPrice, onClose, onConfirm }: { planId: PlanTier, planPrice: string, onClose: () => void, onConfirm: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // ---------------------------------------------------------
    // INTEGRAÇÃO DE PAGAMENTO (COMO GANHAR DINHEIRO):
    // ---------------------------------------------------------
    // 1. Aqui você chamaria seu Backend (Node.js/NestJS).
    // 2. O Backend se comunicaria com o Stripe ou MercadoPago.
    // 3. Criaria uma "Subscription" (Assinatura Recorrente).
    // 4. Retornaria sucesso se o cartão for válido.
    // ---------------------------------------------------------

    setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Lock size={18} className="text-green-600" /> Checkout Seguro
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-1">Assinando plano</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold text-brand-600">{planId}</span>
              <span className="font-bold text-slate-800">{planPrice}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
              <input required type="text" placeholder="ESTEBAN BARBER" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número do Cartão</label>
              <div className="relative">
                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none pl-10" />
                <CreditCard className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade</label>
                <input required type="text" placeholder="MM/AA" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div className="w-24">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                <input required type="text" placeholder="123" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full py-3 text-lg" disabled={isProcessing}>
              {isProcessing ? 'Processando...' : `Pagar ${planPrice}`}
            </Button>
            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
              <Lock size={10} /> Pagamento processado via Gateway Seguro (Stripe/MP)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Features ---

// 1. Subscription & Upgrade UI
const PlansPage = ({ currentPlan, onUpgrade }: { currentPlan: PlanTier, onUpgrade: (plan: PlanTier) => void }) => {
  const [selectedPlan, setSelectedPlan] = useState<{id: PlanTier, price: string} | null>(null);

  const plans = [
    {
      id: PlanTier.FREE,
      name: 'Starter',
      price: 'R$ 0',
      color: 'bg-slate-100',
      features: ['5 Serviços Max', '10 Fotos Portfólio', '0% Taxa por Agenda', 'Agenda Básica', 'Sem Dashboard'],
      btnText: 'Plano Atual',
      disabled: currentPlan === PlanTier.FREE
    },
    {
      id: PlanTier.PRO,
      name: 'Pro',
      price: 'R$ 49/mês',
      color: 'bg-brand-50 border-2 border-brand-500',
      features: ['Serviços Ilimitados', 'Fotos Ilimitadas', '0% Taxa por Agenda', 'Dashboard Financeiro', 'Link Personalizado', 'Relatórios IA'],
      btnText: currentPlan === PlanTier.PRO ? 'Plano Atual' : 'Assinar Pro',
      disabled: currentPlan === PlanTier.PRO || currentPlan === PlanTier.BUSINESS
    },
    {
      id: PlanTier.BUSINESS,
      name: 'Business',
      price: 'R$ 129/mês',
      color: 'bg-slate-900 text-white',
      features: ['Tudo do Pro', 'Múltiplos Barbeiros', 'Gestão de Comissões', 'Suporte Prioritário', 'Acesso API'],
      btnText: currentPlan === PlanTier.BUSINESS ? 'Plano Atual' : 'Assinar Business',
      disabled: currentPlan === PlanTier.BUSINESS
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Escolha seu Plano</h2>
      <p className="text-center text-slate-500 mb-8">Desbloqueie recursos para crescer seu negócio.</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`p-6 rounded-2xl shadow-lg flex flex-col ${plan.color} ${plan.id === PlanTier.BUSINESS ? 'text-white' : 'text-slate-900'}`}>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="text-4xl font-extrabold mb-6">{plan.price}</div>
            <ul className="mb-8 space-y-3 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle size={18} className={plan.id === PlanTier.BUSINESS ? 'text-brand-400' : 'text-brand-600'} />
                  <span className="text-sm font-medium opacity-90">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => setSelectedPlan({ id: plan.id, price: plan.price })} 
              variant={plan.id === PlanTier.BUSINESS ? 'primary' : 'secondary'}
              className="w-full"
              disabled={plan.disabled}
            >
              {plan.btnText}
            </Button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal 
          planId={selectedPlan.id} 
          planPrice={selectedPlan.price} 
          onClose={() => setSelectedPlan(null)}
          onConfirm={() => {
            onUpgrade(selectedPlan.id);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

// 2. Dashboard with Restricted Access
const DashboardStats = ({ user }: { user: User }) => {
  const limits = PLAN_CONFIGS[user.plan];
  const isLocked = !limits.hasFinancialDashboard;

  // Mock financial data
  const data = [
    { name: 'Seg', income: 400 },
    { name: 'Ter', income: 300 },
    { name: 'Qua', income: 550 },
    { name: 'Qui', income: 450 },
    { name: 'Sex', income: 800 },
    { name: 'Sab', income: 900 },
    { name: 'Dom', income: 200 },
  ];

  if (isLocked) {
    return (
      <div className="relative p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center h-96 overflow-hidden">
        <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[2px] z-10"></div>
        <div className="z-20 flex flex-col items-center">
          <Lock size={48} className="text-slate-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Painel Financeiro Bloqueado</h3>
          <p className="text-slate-500 mb-4 max-w-sm">Atualize para PRO para ver gráficos de receita detalhados, rastreamento de comissões e análises de crescimento.</p>
        </div>
        {/* Blurred Content Background */}
        <div className="absolute inset-0 opacity-20 filter blur-sm">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar dataKey="income" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Resumo de Receita</h3>
        <Badge color="green">Ao Vivo</Badge>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
            <RechartsTooltip 
              cursor={{fill: '#f1f5f9'}} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="income" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 3. Service Management (With Limits)
const ServicesManager = ({ user, onAddService }: { user: User, onAddService: (s: Service) => void }) => {
  const limits = PLAN_CONFIGS[user.plan];
  const atLimit = user.services.length >= limits.maxServices;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAdd = async () => {
    if (!newService.name || !newService.price) return;
    
    let description = '';
    if (user.plan !== PlanTier.FREE) {
       setIsGenerating(true);
       description = await generateServiceDescription(newService.name, Number(newService.price));
       setIsGenerating(false);
    } else {
       description = "Serviço padrão.";
    }

    onAddService({
      id: Date.now().toString(),
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration),
      description
    });
    setNewService({ name: '', price: '', duration: '30' });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">Meus Serviços</h3>
          <p className="text-sm text-slate-500">
            {user.services.length} / {limits.maxServices > 100 ? '∞' : limits.maxServices} slots usados
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={atLimit} variant="outline">
          <Plus size={16} /> Novo Serviço
        </Button>
      </div>

      {atLimit && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg flex items-center gap-2">
          <Lock size={14} /> Você atingiu o limite do plano {user.plan}. Faça upgrade para adicionar mais.
        </div>
      )}

      <div className="space-y-3">
        {user.services.map(s => (
          <div key={s.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-slate-500">{s.duration} min • {s.description}</div>
            </div>
            <div className="font-bold text-brand-600">R$ {s.price}</div>
          </div>
        ))}
      </div>

      {/* Simple Modal for Add Service */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Novo Serviço</h3>
            <div className="space-y-4">
              <input 
                className="w-full p-2 border rounded" 
                placeholder="Nome (ex: Corte Degradê)"
                value={newService.name}
                onChange={e => setNewService({...newService, name: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  type="number"
                  className="w-full p-2 border rounded" 
                  placeholder="Preço (R$)"
                  value={newService.price}
                  onChange={e => setNewService({...newService, price: e.target.value})}
                />
                 <select 
                  className="w-full p-2 border rounded"
                  value={newService.duration}
                  onChange={e => setNewService({...newService, duration: e.target.value})}
                 >
                   <option value="15">15 min</option>
                   <option value="30">30 min</option>
                   <option value="45">45 min</option>
                   <option value="60">1 hora</option>
                 </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdd} disabled={isGenerating}>
                {isGenerating ? 'IA Escrevendo...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. AI Assistant Component
const AIAssistant = ({ user }: { user: User }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askAI = async (topic: string) => {
    if (!PLAN_CONFIGS[user.plan].hasAIReports) return;
    setLoading(true);
    const advice = await generateBusinessAdvice(topic, `Sou um barbeiro dono da barbearia ${user.shopName}. Tenho ${user.appointments.length} agendamentos recentes.`);
    setResponse(advice);
    setLoading(false);
  };

  const isLocked = !PLAN_CONFIGS[user.plan].hasAIReports;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-400" />
          <h3 className="text-lg font-bold">Coach de Negócios IA</h3>
        </div>
        
        {isLocked ? (
           <div className="text-center py-4">
             <p className="opacity-80 mb-4 text-sm">Desbloqueie insights personalizados de IA sobre seus preços, marketing e retenção de clientes.</p>
             <Badge color="yellow">Recurso PRO</Badge>
           </div>
        ) : (
          <>
            <p className="text-indigo-100 text-sm mb-4">Pergunte-me como melhorar seu negócio:</p>
            <div className="flex gap-2 flex-wrap mb-4">
              <button onClick={() => askAI("Aumentar recorrência")} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition">Aumentar Reservas</button>
              <button onClick={() => askAI("Otimizar preços")} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition">Estratégia de Preço</button>
            </div>
            
            {loading && <div className="text-sm animate-pulse">Pensando...</div>}
            
            {response && (
              <div className="bg-white/10 p-3 rounded-lg text-sm leading-relaxed border border-white/10 animate-fade-in">
                "{response}"
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
    </div>
  );
};

// --- Application Layout & Views ---

const Sidebar = ({ user, activeView, setView }: { user: User, activeView: string, setView: (v: string) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'schedule', icon: Calendar, label: 'Agenda' },
    { id: 'services', icon: Scissors, label: 'Serviços' },
    { id: 'subscription', icon: CreditCard, label: 'Planos & Billing' },
  ];

  if (user.plan === PlanTier.BUSINESS) {
    navItems.push({ id: 'team', icon: Users, label: 'Equipe' });
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col hidden md:flex fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
        <span className="font-bold text-xl tracking-tight">BarberBoss</span>
      </div>
      
      <div className="p-4 flex-1">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
               {/* Avatar Placeholder */}
               <UserIcon className="w-full h-full p-2 text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-sm truncate">{user.name}</div>
              <div className="text-xs text-slate-500 truncate">{user.shopName}</div>
            </div>
          </div>
          <Badge color={user.plan === PlanTier.FREE ? 'blue' : user.plan === PlanTier.PRO ? 'purple' : 'yellow'}>
            PLANO {user.plan}
          </Badge>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  );
};

// --- Mobile Navigation ---
const MobileNav = ({ activeView, setView }: { activeView: string, setView: (v: string) => void }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
            <button onClick={() => setView('dashboard')} className={`flex flex-col items-center ${activeView === 'dashboard' ? 'text-brand-600' : 'text-slate-400'}`}>
                <LayoutDashboard size={20} />
                <span className="text-[10px] mt-1">Início</span>
            </button>
            <button onClick={() => setView('schedule')} className={`flex flex-col items-center ${activeView === 'schedule' ? 'text-brand-600' : 'text-slate-400'}`}>
                <Calendar size={20} />
                <span className="text-[10px] mt-1">Agenda</span>
            </button>
             <button onClick={() => setView('services')} className={`flex flex-col items-center ${activeView === 'services' ? 'text-brand-600' : 'text-slate-400'}`}>
                <Scissors size={20} />
                <span className="text-[10px] mt-1">Serviços</span>
            </button>
            <button onClick={() => setView('subscription')} className={`flex flex-col items-center ${activeView === 'subscription' ? 'text-brand-600' : 'text-slate-400'}`}>
                <CreditCard size={20} />
                <span className="text-[10px] mt-1">Planos</span>
            </button>
        </div>
    )
}

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [view, setView] = useState('dashboard');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleUpgrade = (newPlan: PlanTier) => {
    // ----------------------------------------------------------------
    // SUCESSO DO PAGAMENTO:
    // 1. O Gateway chama seu Webhook.
    // 2. Seu Backend atualiza o banco de dados (UPDATE users SET plan = 'PRO').
    // 3. O Frontend recebe essa atualização (via WebSocket ou re-fetch).
    // ----------------------------------------------------------------
    
    // Simulate API Call
    setUser(prev => ({ ...prev, plan: newPlan }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // Move to dashboard to see new features
    setView('dashboard');
  };

  const handleAddService = (service: Service) => {
    setUser(prev => ({
      ...prev,
      services: [...prev.services, service]
    }));
  };

  // Views Logic
  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total Agendamentos</p>
                  <h3 className="text-3xl font-bold text-slate-800">{user.appointments.length}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Calendar /></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                 <div>
                  <p className="text-slate-500 text-sm font-medium">Receita Est.</p>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {user.plan === PlanTier.FREE ? 'Bloqueado' : `R$ ${user.appointments.reduce((sum, app) => sum + app.price, 0)}`}
                  </h3>
                  {user.plan === PlanTier.FREE && <p className="text-xs text-brand-600 mt-1 cursor-pointer hover:underline" onClick={() => setView('subscription')}>Assine para ver</p>}
                </div>
                <div className="bg-green-50 p-3 rounded-full text-green-600"><TrendingUp /></div>
              </div>
              <AIAssistant user={user} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                 <DashboardStats user={user} />
              </div>
              <div>
                 {/* Recent Activity / Agenda Preview */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                    <h3 className="font-bold mb-4">Próximos</h3>
                    <div className="space-y-4">
                      {user.appointments.filter(a => a.status === 'CONFIRMED').map(app => (
                        <div key={app.id} className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0">
                          <div className="bg-brand-100 text-brand-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold leading-none">
                             <span>{new Date(app.date).getDate()}</span>
                             <span className="text-[10px] uppercase">{new Date(app.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{app.clientName}</div>
                            <div className="text-xs text-slate-500">Serviço ID: {app.serviceId} • R$ {app.price}</div>
                          </div>
                        </div>
                      ))}
                      {user.appointments.filter(a => a.status === 'CONFIRMED').length === 0 && (
                        <div className="text-center text-slate-400 text-sm py-4">Sem agendamentos futuros</div>
                      )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'services':
        return <ServicesManager user={user} onAddService={handleAddService} />;
      case 'subscription':
        return <PlansPage currentPlan={user.plan} onUpgrade={handleUpgrade} />;
      case 'schedule':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center min-h-[400px] flex flex-col items-center justify-center">
            <Calendar size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold">Visão de Agenda</h3>
            <p className="text-slate-500">Implementação completa do calendário iria aqui.</p>
          </div>
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar user={user} activeView={view} setView={setView} />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center md:hidden">
             <div className="font-bold text-lg text-brand-700">BarberBoss</div>
             <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">{user.name[0]}</div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <MobileNav activeView={view} setView={setView} />

      {/* Confetti / Success Modal */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-brand-200 animate-bounce-in text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <Sparkles size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Parabéns!</h2>
            <p className="text-slate-600">Você agora tem acesso aos recursos do plano {user.plan}.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
