
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { 
  Plus, 
  ChevronLeft, 
  Trash2, 
  Download, 
  Share2, 
  Camera, 
  Image as ImageIcon,
  CheckCircle2,
  User as UserIcon,
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  X,
  MapPin,
  Users,
  Edit3,
  Check,
  Hash,
  Clock,
  Menu,
  Moon,
  Sun,
  Database,
  Upload,
  Heart,
  Briefcase,
  FileText,
  Calendar,
  Zap,
  UserPlus,
  MessageCircle,
  Play,
  Save,
  Lock,
  LogIn,
  LogOut,
  ArrowLeft,
  Truck,
  Wrench,
  Search
} from 'lucide-react';
import { storage } from './services/storage';
import { Report, Shift, ReportType, ReportPhoto, WorkCenter, UserSession, User, ReportCategory, ActivityType } from './types';
import { SHIFTS, WORK_CENTERS, TECHNICIANS_BY_SHIFT } from './constants';
import { jsPDF } from 'jspdf';

// --- Contexto de Tema ---
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: UserSession | null;
  login: (username: string) => void;
  logout: () => void;
} | null>(null);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// --- Modelos de Início de Turno Padrão ---
const DEFAULT_SHIFT_TEMPLATES = {
  'A': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do Turno D
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/CREARE

Boa dia pessoal, estamos assumindo as demandas do Turno A.
Bom descanso para o turno B.

Vale: 
Ilton

Equipe Sonda:
Truckulles 
Hannyel 
Misael

Móveis 
Eduardo 
Marcos 

Sotreq: 
Diran 

Hexagon:
Alcino

Creare:
Assuero

Alcon:
Kesia`,
  'B': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do turno B
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/ALCON/CREARE

Boa noite pessoal, estamos assumindo as atividades do Turno B, ao Turno A bom descanso!!!

Equipes Mobilizadas. 

SONDA

EQ. Fixos
Luiz Gustavo 
Rafael

EQ. Móveis
Jeferson 
Geneilsom 

Sotreq
Mauro 

Hexagon
Luiz Neto

Creare
Vitor

Vale
Alessandra`,
  'C': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do Turno C
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/VALE/CREARE

Bom dia pessoal, estamos assumindo as atividades do Turno C, ao Turno D bom descanso!!

* Equipes Mobilizadas

* SONDA

* Téc. Controle
* Camila ADM

* Eq. Truckless
* Marcos
* Wanderson  

* Eq. Móveis
* Wilian 
* Gustavo  

* Sotreq
* Joao leno

* Hexagon
* Patrick 
* Jhon Dultra 

* Alcon
* Fabricio 

* Creare
* Victor  

* Vale
* Daniel Alves`,
  'D': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do Turno D
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/CREARE

Boa noite galera, estamos assumindo as atividades do Turno D, ao Turno C bom descanso!!

Equipes Mobilizadas

SONDA

EQ. Fixos
Doclenio
Geraldo

EQ. Móveis
Darlan
Cícero 

Sotreq
Thiago

Hexagon
Rodrigo

Creare
Hitalo

Vale
Renato`
};

// --- Utilitários ---
const stripSpecialChars = (text: string) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\s]/g, "")
    .replace(/✅/g, "  ") // Espaço duplo para o checkmark desenhado no PDF
    .replace(/🛑/g, "[!] ")
    .replace(/🗓️/g, "")
    .replace(/🚜/g, "")
    .replace(/📌/g, "")
    .replace(/📂/g, "")
    .replace(/🛠️/g, "")
    .replace(/⏰/g, "")
    .replace(/♻️/g, "")
    .replace(/📈/g, "")
    .replace(/🎯/g, "")
    .replace(/🔔/g, "")
    .replace(/🔖/g, "")
    .replace(/👥/g, "")
    .replace(/⚠️/g, "[ATENCAO]")
    .trim();
};

const sendToWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
  const link = document.createElement('a');
  link.href = whatsappUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Componentes de UI ---

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, toggleTheme, user, logout } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storage.importBackup(content)) {
        alert("Dados restaurados com sucesso! O app será reiniciado.");
        window.location.reload();
      } else {
        alert("Falha ao importar. Verifique se o arquivo está correto.");
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = () => {
    if (window.confirm("Deseja encerrar sua sessão?")) {
      logout();
      navigate('/login');
      onClose();
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <div className={`fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-dark-card z-[110] shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b dark:border-dark-border flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-blue-600 dark:text-blue-400">ReportMaster</h2>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Configurações</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-bg transition-colors">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {user && (
            <div className="px-4 py-3 mb-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black uppercase shadow-sm">
                {user.username.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-blue-600 uppercase tracking-wider">Usuário Logado</span>
                <span className="text-sm font-bold dark:text-white truncate max-w-[150px]">{user.username}</span>
              </div>
            </div>
          )}

          <div className="px-4 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">Aparência</div>
          
          <button onClick={toggleTheme} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-dark-bg transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-dark-bg flex items-center justify-center text-slate-600 dark:text-slate-400">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold dark:text-white">Tema {theme === 'light' ? 'Escuro' : 'Claro'}</span>
              <span className="text-[10px] text-slate-500 uppercase font-black">Alterar modo visual</span>
            </div>
          </button>

          <div className="px-4 py-2 pt-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Dados do Aplicativo</div>

          <button onClick={() => storage.exportBackup()} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold dark:text-white">Fazer Backup</span>
              <span className="text-[10px] text-slate-500 uppercase font-black">Exportar para JSON</span>
            </div>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
              <Upload className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold dark:text-white">Restaurar Dados</span>
              <span className="text-[10px] text-slate-500 uppercase font-black">Importar de JSON</span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
          </button>

          <div className="px-4 py-2 pt-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sessão</div>
          
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold dark:text-white">Sair do App</span>
              <span className="text-[10px] text-slate-500 uppercase font-black">Encerrar sessão local</span>
            </div>
          </button>
        </div>

        <div className="p-6 border-t dark:border-dark-border flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 opacity-60">
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">V 1.0.0</span>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            app criado por rafael
          </p>
        </div>
      </div>
    </>
  );
};

const Button = ({ 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button', 
  disabled, 
  children 
}: {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  const base = "px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 min-h-[44px]";
  const variants = {
    primary: "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none",
    secondary: "bg-slate-200 dark:bg-dark-card text-slate-800 dark:text-white",
    success: "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none",
    danger: "bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-none",
    ghost: "bg-transparent text-slate-800 dark:text-white"
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const CompactInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal";
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}> = ({ label, value, onChange, type = 'text', inputMode, placeholder, required, error, icon, disabled }) => (
  <div className={`flex flex-col gap-1 w-full ${disabled ? 'opacity-60' : ''}`}>
    <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1 flex items-center gap-1">
      {label} {required && !disabled && <span className="text-rose-600">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 scale-[0.8]">{icon}</div>}
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-9' : 'px-3'} py-3 rounded-xl border bg-white dark:bg-dark-card ${error ? 'border-rose-400 ring-1 ring-rose-100' : 'border-slate-300 dark:border-dark-border'} focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-white shadow-sm placeholder:text-slate-400 disabled:bg-slate-100`}
      />
    </div>
  </div>
);

const CompactTextArea: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  rows?: number;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, required, error, rows = 3, disabled }) => (
  <div className={`flex flex-col gap-1 w-full ${disabled ? 'opacity-60' : ''}`}>
    <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1 flex items-center gap-1">
      {label} {required && !disabled && <span className="text-rose-600">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-3 py-3 rounded-xl border bg-white dark:bg-dark-card ${error ? 'border-rose-400 ring-1 ring-rose-100' : 'border-slate-300 dark:border-dark-border'} focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-white resize-none shadow-sm placeholder:text-slate-400 disabled:bg-slate-100`}
    />
  </div>
);

// --- Componente de Login ---
const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login } = useTheme();
  const navigate = useNavigate();

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegistering) {
      if (username.length < 3) return setErrorMsg('Nome deve ter 3+ caracteres');
      if (password.length < 4) return setErrorMsg('Senha deve ter 4+ caracteres');
      if (password !== confirmPassword) return setErrorMsg('Senhas não conferem');

      const result = storage.registerUser({ username, password });
      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          setIsRegistering(false);
          setPassword('');
          setConfirmPassword('');
        }, 1500);
      } else {
        setErrorMsg(result.message);
      }
    } else {
      const isValid = storage.authenticateUser({ username, password });
      if (isValid) {
        login(username);
        navigate('/');
      } else {
        setErrorMsg('Usuário ou senha inválidos');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark-bg flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
        <div className="bg-blue-600 p-6 sm:p-8 flex flex-col items-center text-white relative">
          {isRegistering && (
            <button 
              onClick={() => setIsRegistering(false)} 
              className="absolute left-4 top-6 sm:left-6 sm:top-8 p-2 bg-white/10 rounded-xl active:scale-90 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
            {isRegistering ? <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> : <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">ReportMaster</h2>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">
            {isRegistering ? 'Criar Nova Conta' : 'Acesso Restrito'}
          </p>
        </div>
        
        <form onSubmit={handleAction} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <CompactInput 
              label="Nome de Usuário" 
              value={username} 
              onChange={setUsername} 
              placeholder="Digite seu nome..." 
              required 
              icon={<UserIcon className="w-4 h-4" />}
            />
            <CompactInput 
              label="Senha de Acesso" 
              type="password"
              value={password} 
              onChange={setPassword} 
              placeholder="Sua senha..." 
              required 
              icon={<LogIn className="w-4 h-4" />}
            />
            {isRegistering && (
              <CompactInput 
                label="Confirmar Senha" 
                type="password"
                value={confirmPassword} 
                onChange={setConfirmPassword} 
                placeholder="Repita a senha..." 
                required 
                icon={<Check className="w-4 h-4" />}
              />
            )}
          </div>
          
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 p-3 rounded-xl flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-wider animate-in shake duration-300">
              <AlertTriangle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 p-3 rounded-xl flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-wider animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full h-14 rounded-2xl text-base shadow-xl shadow-blue-200 dark:shadow-none">
              {isRegistering ? 'Criar Conta' : 'Entrar no Aplicativo'}
            </Button>
            
            {!isRegistering && (
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)}
                className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest p-2 hover:opacity-70 transition-all"
              >
                Não tem uma conta? Criar Agora
              </button>
            )}
          </div>
          
          <p className="text-center text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Sua conta é armazenada localmente.<br/>S11D - Serra Sul
          </p>
        </form>
      </div>
    </div>
  );
};

// --- Componente de Rota Protegida ---
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useTheme();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// --- Editor de Imagem ---
const ImageEditor: React.FC<{
  photo: ReportPhoto;
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}> = ({ photo, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.src = photo.dataUrl;
    img.onload = () => {
      const maxWidth = window.innerWidth * 0.95;
      const scale = maxWidth / img.width;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.lineWidth = 4;
      context.strokeStyle = '#e11d48';
      setCtx(context);
    };
  }, [photo]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSave = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL('image/jpeg', 0.8));
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col p-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black text-xs uppercase tracking-widest">Editor de Evidência</h3>
        <button onClick={onCancel} className="p-2 bg-white/10 rounded-full text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-slate-900/50 rounded-2xl border border-white/10">
        <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="touch-none bg-white rounded-sm shadow-2xl" />
      </div>
      <div className="mt-4 flex gap-3 pb-safe">
        <Button onClick={onCancel} variant="secondary" className="flex-1 h-12">Cancelar</Button>
        <Button onClick={handleSave} variant="primary" className="flex-1 h-12">Salvar</Button>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<ReportType>('template');
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('fixos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modelos de Início de Turno Editáveis
  const [shiftTemplates, setShiftTemplates] = useState<Record<string, string>>(DEFAULT_SHIFT_TEMPLATES);
  const [editingShift, setEditingShift] = useState<string | null>(null);
  const [tempTemplate, setTempTemplate] = useState("");

  useEffect(() => {
    // Seed default ready-made templates
    storage.seedDefaultTemplates();

    const state = location.state as { tab?: ReportType, category?: ReportCategory } | null;
    if (state?.tab) setActiveTab(state.tab);
    if (state?.category) setActiveCategory(state.category);
  }, [location]);

  useEffect(() => {
    const allReports = storage.getReports();
    setReports(allReports.sort((a, b) => b.updatedAt - a.updatedAt));
    
    const savedTemplates = storage.getShiftTemplates();
    if (savedTemplates) {
      setShiftTemplates(savedTemplates);
    }
  }, []);

  const handleDelete = (e: React.BaseSyntheticEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm("Excluir item permanentemente?")) {
      storage.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditShift = (shift: string) => {
    setEditingShift(shift);
    setTempTemplate(shiftTemplates[shift]);
  };

  const handleSaveShift = () => {
    if (editingShift) {
      const newTemplates = { ...shiftTemplates, [editingShift]: tempTemplate };
      setShiftTemplates(newTemplates);
      storage.saveShiftTemplates(newTemplates);
      setEditingShift(null);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesTab = r.type === activeTab;
    const matchesCategory = r.category === activeCategory || !r.category;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch = 
      r.omDescription.toLowerCase().includes(lowerSearch) || 
      r.omNumber.toLowerCase().includes(lowerSearch) ||
      r.equipment.toLowerCase().includes(lowerSearch);
    
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-5 max-w-2xl mx-auto w-full pb-24">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <header className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 bg-white dark:bg-dark-card border dark:border-dark-border rounded-xl shadow-sm text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">ReportMaster</h1>
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none">S11D - Serra Sul</p>
          </div>
        </div>
      </header>

      {/* Barra de Busca */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          placeholder={`Buscar em ${activeTab === 'template' ? 'modelos' : 'relatórios'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Abas de Categoria (FIXOS / MÓVEIS) */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-dark-card rounded-2xl shadow-inner">
        <button 
          onClick={() => setActiveCategory('fixos')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeCategory === 'fixos' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          <Wrench className="w-4 h-4" /> FIXOS
        </button>
        <button 
          onClick={() => setActiveCategory('moveis')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeCategory === 'moveis' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400'}`}
        >
          <Truck className="w-4 h-4" /> MÓVEIS
        </button>
      </div>

      <div className="bg-slate-200 dark:bg-dark-card p-1 rounded-xl flex shadow-inner overflow-x-auto gap-1">
        <button onClick={() => setActiveTab('template')} className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${activeTab === 'template' ? 'bg-white dark:bg-dark-bg text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Meus Modelos</button>
        <button onClick={() => setActiveTab('report')} className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${activeTab === 'report' ? 'bg-white dark:bg-dark-bg text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Relatórios</button>
        <button onClick={() => setActiveTab('shift_start')} className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${activeTab === 'shift_start' ? 'bg-white dark:bg-dark-bg text-purple-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Início de Turno</button>
      </div>

      {activeTab === 'template' && (
        <Button onClick={() => navigate('/new', { state: { category: activeCategory, type: 'template' } })} className="h-14 rounded-xl text-base shadow-lg">
          <Plus className="w-5 h-5" /> Novo Modelo {activeCategory === 'fixos' ? 'FIXO' : 'MÓVEL'}
        </Button>
      )}

      {activeTab === 'shift_start' ? (
        <div className="grid grid-cols-1 gap-4 mt-2">
          {['A', 'B', 'C', 'D'].map((shift) => (
            <div key={shift} className="bg-white dark:bg-dark-card p-5 rounded-3xl border-l-8 border-purple-500 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aviso de Início</span>
                  <h3 className="text-lg font-black dark:text-white">Turno {shift}</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditShift(shift)}
                    className="p-2.5 bg-slate-100 dark:bg-dark-bg rounded-xl text-slate-600 dark:text-slate-400 active:scale-90 transition-all border border-slate-200 dark:border-dark-border"
                    title="Editar Integrantes"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      const today = new Date().toLocaleDateString('pt-BR');
                      const template = shiftTemplates[shift];
                      const message = `INFORME DE INÍCIO DE TURNO\n\n${template.replace('{{date}}', today)}`;
                      sendToWhatsApp(message);
                    }}
                    className="bg-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none active:scale-90 transition-all"
                    title="Enviar via WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {editingShift === shift ? (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <textarea 
                    value={tempTemplate} 
                    onChange={(e) => setTempTemplate(e.target.value)}
                    rows={12}
                    className="w-full p-3 text-xs font-mono font-semibold bg-slate-50 dark:bg-dark-bg border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-purple-200 outline-none dark:text-white"
                    placeholder="Edite as informações e nomes dos integrantes..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingShift(null)} variant="secondary" className="flex-1 py-2 text-xs">Cancelar</Button>
                    <Button onClick={handleSaveShift} variant="primary" className="flex-1 py-2 text-xs bg-purple-600 shadow-purple-100">
                      <Save className="w-4 h-4" /> Salvar Modelo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-dark-bg p-3 rounded-2xl border border-slate-100 dark:border-dark-border">
                   <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed line-clamp-3">
                     {shiftTemplates[shift].replace('{{date}}', new Date().toLocaleDateString('pt-BR'))}
                   </p>
                   <button onClick={() => handleEditShift(shift)} className="mt-2 text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">Ver mais / Editar Integrantes</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 mt-1">
          {filteredReports.map((report) => (
            <div key={report.id} onClick={() => navigate(`/edit/${report.id}`)} className={`bg-white dark:bg-dark-card p-4 rounded-2xl border-l-[6px] shadow-sm relative active:scale-[0.98] transition-all ${report.type === 'report' ? 'border-emerald-500' : 'border-blue-600'}`}>
              <div className="flex flex-col pr-8">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{report.omNumber || 'SEM NÚMERO'}</span>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight mt-0.5 truncate">{report.omDescription}</h3>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-blue-500" /> {new Date(report.date).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-blue-500" /> {report.activityType}</span>
              </div>
              {!report.id.startsWith('seed-') && (
                <button onClick={(e) => handleDelete(e, report.id)} className="absolute top-4 right-3 text-slate-300 dark:text-slate-600 hover:text-rose-600 transition-colors p-1"><Trash2 className="w-5 h-5" /></button>
              )}
            </div>
          ))}
          {filteredReports.length === 0 && (
             <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-bold border-2 border-dashed border-slate-200 dark:border-dark-border rounded-3xl opacity-60">
               {searchTerm ? 'Nenhum resultado para a busca.' : `Nenhum item encontrado na categoria ${activeCategory}.`}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Report Form Page ---
const ReportFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useTheme();
  
  const [report, setReport] = useState<Partial<Report>>({
    id: crypto.randomUUID(),
    type: 'report',
    category: 'fixos',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    activityType: 'preventiva',
    iamoDeviation: false,
    hasPendencies: false,
    isFinished: true,
    photos: [],
    teamShift: 'A',
    workCenter: 'SC108HH',
    technicians: user?.username || ''
  });

  const [isEditingPhoto, setIsEditingPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const existing = storage.getReports().find(r => r.id === id);
      if (existing) {
        setReport(existing);
      }
    } else if (location.state) {
      const state = location.state as { type?: ReportType, category?: ReportCategory };
      if (state.type) setReport(prev => ({ ...prev, type: state.type }));
      if (state.category) setReport(prev => ({ ...prev, category: state.category }));
    }
  }, [id, location.state]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.omDescription || !report.omNumber) {
      alert("Preencha a descrição e o número da OM");
      return;
    }
    storage.saveReport(report as Report);
    navigate('/', { state: { tab: report.type, category: report.category } });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newPhoto: ReportPhoto = {
          id: crypto.randomUUID(),
          dataUrl,
          timestamp: Date.now()
        };
        setReport(prev => ({
          ...prev,
          photos: [...(prev.photos || []), newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const updatePhoto = (photoId: string, newDataUrl: string) => {
    setReport(prev => ({
      ...prev,
      photos: (prev.photos || []).map(p => p.id === photoId ? { ...p, dataUrl: newDataUrl } : p)
    }));
    setIsEditingPhoto(null);
  };

  const deletePhoto = (photoId: string) => {
    setReport(prev => ({
      ...prev,
      photos: (prev.photos || []).filter(p => p.id !== photoId)
    }));
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-2xl mx-auto w-full pb-24">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-dark-card border dark:border-dark-border rounded-xl text-slate-700 dark:text-slate-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black dark:text-white">
            {id ? 'Editar' : 'Novo'} {report.type === 'template' ? 'Modelo' : 'Relatório'}
          </h1>
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Categoria: {report.category === 'fixos' ? 'Fixos' : 'Móveis'}
          </span>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-dark-card p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border space-y-5">
           <div className="grid grid-cols-2 gap-4">
              <CompactInput label="Data" type="date" value={report.date || ''} onChange={v => setReport(p => ({...p, date: v}))} required />
              <CompactInput label="Número OM" value={report.omNumber || ''} onChange={v => setReport(p => ({...p, omNumber: v}))} required placeholder="Ex: 30012345" />
           </div>
           
           <CompactInput label="Equipamento" value={report.equipment || ''} onChange={v => setReport(p => ({...p, equipment: v}))} placeholder="Ex: CAT 793F / SW0663" />
           <CompactInput label="Local / TAG" value={report.local || ''} onChange={v => setReport(p => ({...p, local: v}))} placeholder="Ex: Baia 05 / Overland" />
           
           <CompactTextArea label="Descrição da OM" value={report.omDescription || ''} onChange={v => setReport(p => ({...p, omDescription: v}))} required placeholder="O que consta na ordem de manutenção..." />
           
           <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
               <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">Turno</label>
               <select value={report.teamShift} onChange={e => setReport(p => ({...p, teamShift: e.target.value as Shift}))} className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-sm font-semibold dark:text-white">
                 {SHIFTS.map(s => <option key={s} value={s}>Turno {s}</option>)}
               </select>
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">Centro Trab.</label>
               <select value={report.workCenter} onChange={e => setReport(p => ({...p, workCenter: e.target.value as WorkCenter}))} className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-sm font-semibold dark:text-white">
                 {WORK_CENTERS.map(wc => <option key={wc} value={wc}>{wc}</option>)}
               </select>
             </div>
           </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Execução Técnica</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <CompactInput label="Início" type="time" value={report.startTime || ''} onChange={v => setReport(p => ({...p, startTime: v}))} />
             <CompactInput label="Fim" type="time" value={report.endTime || ''} onChange={v => setReport(p => ({...p, endTime: v}))} />
          </div>

          <div className="flex flex-col gap-1">
             <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">Tipo de Atividade</label>
             <div className="flex gap-2">
               {['preventiva', 'corretiva'].map(t => (
                 <button key={t} type="button" onClick={() => setReport(p => ({...p, activityType: t as ActivityType}))} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${report.activityType === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 dark:bg-dark-bg text-slate-400 border-slate-200 dark:border-dark-border'}`}>
                   {t}
                 </button>
               ))}
             </div>
          </div>

          <CompactTextArea label="Atividade Executada" rows={6} value={report.activityExecuted || ''} onChange={v => setReport(p => ({...p, activityExecuted: v}))} placeholder="Descreva o passo a passo da atividade..." />
          
          <CompactInput label="Técnicos" value={report.technicians || ''} onChange={v => setReport(p => ({...p, technicians: v}))} placeholder="Nomes dos técnicos..." />
        </div>

        <div className="bg-white dark:bg-dark-card p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border space-y-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Evidências (Fotos)</h3>
            </div>
            <label className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl cursor-pointer active:scale-90 transition-all">
              <Plus className="w-5 h-5" />
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {report.photos?.map(photo => (
              <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden border dark:border-dark-border group">
                <img src={photo.dataUrl} className="w-full h-full object-cover" alt="Evidência" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => setIsEditingPhoto(photo.id)} className="p-2 bg-white rounded-lg text-blue-600"><Edit3 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => deletePhoto(photo.id)} className="p-2 bg-white rounded-lg text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {(!report.photos || report.photos.length === 0) && (
              <div className="col-span-2 py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-dark-border rounded-2xl opacity-50">
                <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                <span className="text-[10px] font-black uppercase text-slate-400">Nenhuma foto adicionada</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">Desvio IAM-O?</span>
              </div>
              <button type="button" onClick={() => setReport(p => ({...p, iamoDeviation: !p.iamoDeviation}))} className={`w-12 h-6 rounded-full transition-colors relative ${report.iamoDeviation ? 'bg-amber-500' : 'bg-slate-200 dark:bg-dark-bg'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${report.iamoDeviation ? 'left-7' : 'left-1'}`} />
              </button>
           </div>
           {report.iamoDeviation && (
             <CompactTextArea label="Descrição do Desvio" value={report.iamoDescription || ''} onChange={v => setReport(p => ({...p, iamoDescription: v}))} />
           )}

           <div className="flex items-center justify-between border-t dark:border-dark-border pt-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">Pendências?</span>
              </div>
              <button type="button" onClick={() => setReport(p => ({...p, hasPendencies: !p.hasPendencies}))} className={`w-12 h-6 rounded-full transition-colors relative ${report.hasPendencies ? 'bg-blue-600' : 'bg-slate-200 dark:bg-dark-bg'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${report.hasPendencies ? 'left-7' : 'left-1'}`} />
              </button>
           </div>
           {report.hasPendencies && (
             <CompactTextArea label="O que ficou pendente?" value={report.pendencyDescription || ''} onChange={v => setReport(p => ({...p, pendencyDescription: v}))} />
           )}
        </div>

        <div className="flex flex-col gap-3 pt-4">
           <Button type="submit" className="h-14 rounded-2xl text-base shadow-xl shadow-blue-200">
             <Save className="w-5 h-5" /> {id ? 'Atualizar' : 'Salvar'} {report.type === 'template' ? 'Modelo' : 'Relatório'}
           </Button>
           
           {id && (
             <div className="flex gap-2">
                <Button onClick={() => {
                  const today = new Date().toLocaleDateString('pt-BR');
                  const msg = `📑 *RELATÓRIO DE ATIVIDADE*\n\n🛠️ *OM:* ${report.omNumber}\n📝 *DESC:* ${report.omDescription}\n📍 *EQUIP:* ${report.equipment || 'N/A'}\n📍 *LOCAL:* ${report.local || 'N/A'}\n🗓️ *DATA:* ${today}\n⏰ *HORÁRIO:* ${report.startTime} às ${report.endTime}\n✅ *EXECUTADO:*\n${report.activityExecuted}\n\n👤 *TÉCNICOS:* ${report.technicians}\n${report.iamoDeviation ? `⚠️ *IAM-O:* ${report.iamoDescription}` : ''}\n${report.hasPendencies ? `🛑 *PENDÊNCIA:* ${report.pendencyDescription}` : ''}`;
                  sendToWhatsApp(msg);
                }} variant="success" className="flex-1 h-12 text-xs">
                  <MessageCircle className="w-4 h-4" /> Enviar WhatsApp
                </Button>
                <Button onClick={() => {
                  const doc = new jsPDF();
                  const cleanOm = stripSpecialChars(report.omDescription || '');
                  doc.setFontSize(18);
                  doc.text("RELATORIO DE ATIVIDADE", 10, 20);
                  doc.setFontSize(10);
                  doc.text(`OM: ${report.omNumber}`, 10, 30);
                  doc.text(`EQUIPAMENTO: ${report.equipment || 'N/A'}`, 10, 35);
                  doc.text(`LOCAL: ${report.local || 'N/A'}`, 10, 40);
                  doc.text(`DATA: ${report.date}`, 10, 45);
                  doc.text(`TÉCNICOS: ${report.technicians}`, 10, 50);
                  doc.line(10, 55, 200, 55);
                  doc.setFontSize(12);
                  doc.text("ATIVIDADE EXECUTADA:", 10, 65);
                  doc.setFontSize(10);
                  const splitExec = doc.splitTextToSize(stripSpecialChars(report.activityExecuted || ''), 180);
                  doc.text(splitExec, 10, 75);
                  doc.save(`Relatorio_${report.omNumber}.pdf`);
                }} variant="secondary" className="flex-1 h-12 text-xs">
                  <Download className="w-4 h-4" /> Baixar PDF
                </Button>
             </div>
           )}
        </div>
      </form>

      {isEditingPhoto && (
        <ImageEditor 
          photo={report.photos!.find(p => p.id === isEditingPhoto)!} 
          onSave={(data) => updatePhoto(isEditingPhoto, data)} 
          onCancel={() => setIsEditingPhoto(null)} 
        />
      )}
    </div>
  );
};

// --- ThemeProvider & Main App Container ---

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [user, setUser] = useState<UserSession | null>(storage.getSession());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (username: string) => {
    const session = { username, loginTime: Date.now() };
    storage.setSession(session);
    setUser(session);
  };

  const logout = () => {
    storage.logout();
    setUser(null);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, user, login, logout }}>
      {children}
    </ThemeContext.Provider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><ReportFormPage /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><ReportFormPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
