
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { 
  Plus, 
  ChevronLeft, 
  Trash2, 
  Download, 
  Share2, 
  Camera, 
  ImageIcon,
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
  Cpu,
  Layers,
  Wrench,
  Anchor,
  Square,
  CheckSquare,
  Wifi,
  WifiOff
} from 'lucide-react';
import { storage } from './services/storage';
import { Report, Shift, ReportType, ReportPhoto, WorkCenter, UserSession, User } from './types';
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
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/CREARE`,
  'B': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do turno B
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/ALCON/CREARE`,
  'C': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do Turno C
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/CREARE`,
  'D': `📣 Evento: Boa Jornada ✅  
📋 Tema: Atividades relacionadas ao turno.
📍 Local: Contêiner Automação de Mina
🗓 Data: {{date}}
⛑ Palestrantes: Todos
📈 Realizado o DSS com equipe do Turno D
🗣️ Participantes Equipe SONDA/SOTREQ/HEXAGON/CREARE`
};

// --- Utilitários ---
const stripSpecialChars = (text: string) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\s\xA1-\xFF]/g, "") 
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

// --- Helper para renderizar Emojis como Imagem no PDF ---
const renderEmojiToDataUrl = (emoji: string): string | null => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 32, 32);
    return canvas.toDataURL('image/png');
  } catch (e) {
    return null;
  }
};

// --- Componente de Status de Conexão ---
const ConnectionBadge = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
      {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
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
  const base = "px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100";
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
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}> = ({ label, value, onChange, type = 'text', placeholder, required, error, icon, disabled }) => (
  <div className={`flex flex-col gap-1 w-full ${disabled ? 'opacity-60' : ''}`}>
    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1 flex items-center gap-1">
      {label} {required && !disabled && <span className="text-rose-600">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 scale-[0.8]">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-9' : 'px-3'} py-2.5 rounded-xl border bg-white dark:bg-dark-card ${error ? 'border-rose-400 ring-1 ring-rose-100' : 'border-slate-300 dark:border-dark-border'} focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-white shadow-sm placeholder:text-slate-400 disabled:bg-slate-100`}
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
    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1 flex items-center gap-1">
      {label} {required && !disabled && <span className="text-rose-600">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-dark-card ${error ? 'border-rose-400 ring-1 ring-rose-100' : 'border-slate-300 dark:border-dark-border'} focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-white resize-none shadow-sm placeholder:text-slate-400 disabled:bg-slate-100`}
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
    <div className="min-h-screen bg-slate-100 dark:bg-dark-bg flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
        <div className="bg-blue-600 p-8 flex flex-col items-center text-white relative">
          {isRegistering && (
            <button 
              onClick={() => setIsRegistering(false)} 
              className="absolute left-6 top-8 p-2 bg-white/10 rounded-xl active:scale-90 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
            {isRegistering ? <UserPlus className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-black tracking-tight">ReportMaster</h2>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">
            {isRegistering ? 'Criar Nova Conta' : 'Acesso Restrito'}
          </p>
        </div>
        
        <form onSubmit={handleAction} className="p-8 space-y-6">
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
                className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest p-2 hover:opacity-70 transition-all"
              >
                Não tem uma conta? Criar Agora
              </button>
            )}
          </div>
          
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
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
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientX - rect.top;

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
      <div className="mt-4 flex gap-3">
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [shiftTemplates, setShiftTemplates] = useState<Record<string, string>>(DEFAULT_SHIFT_TEMPLATES);
  const [editingShift, setEditingShift] = useState<string | null>(null);
  const [tempTemplate, setTempTemplate] = useState("");

  useEffect(() => {
    const state = location.state as { tab?: ReportType } | null;
    if (state?.tab) setActiveTab(state.tab);
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

  const filteredReports = reports.filter(r => r.type === activeTab);

  return (
    <div className="flex flex-col gap-5 p-5 max-w-2xl mx-auto w-full pb-20">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <header className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 bg-white dark:bg-dark-card border dark:border-dark-border rounded-xl shadow-sm text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">ReportMaster</h1>
            <div className="flex items-center gap-2 mt-0.5">
               <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none">S11D - Serra Sul</p>
               <ConnectionBadge />
            </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-200 dark:bg-dark-card p-1 rounded-xl flex shadow-inner overflow-x-auto gap-1">
        <button onClick={() => setActiveTab('template')} className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${activeTab === 'template' ? 'bg-white dark:bg-dark-bg text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Meus Modelos</button>
        <button onClick={() => setActiveTab('report')} className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${activeTab === 'report' ? 'bg-white dark:bg-dark-bg text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Relatórios</button>
        <button onClick={() => setActiveTab('shift_start')} className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${activeTab === 'shift_start' ? 'bg-white dark:bg-dark-bg text-purple-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Início de Turno</button>
      </div>

      {activeTab === 'template' && (
        <Button onClick={() => navigate('/new')} className="h-14 rounded-xl text-base shadow-lg">
          <Plus className="w-5 h-5" /> Criar Novo Modelo
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
                      const message = `INFORME DE INCIO DE TURNO\n\n${template.replace('{{date}}', today)}`;
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
              <button onClick={(e) => handleDelete(e, report.id)} className="absolute top-4 right-3 text-slate-300 dark:text-slate-600 hover:text-rose-600 transition-colors p-1"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
          {filteredReports.length === 0 && (
             <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-bold border-2 border-dashed border-slate-200 dark:border-dark-border rounded-3xl opacity-60">
               Nenhum item encontrado.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReportFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  
  const [isNew, setIsNew] = useState(!id);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<ReportPhoto | null>(null);
  const [customTechnician, setCustomTechnician] = useState('');
  
  const [formData, setFormData] = useState<Partial<Report>>({
    id: crypto.randomUUID(), 
    type: 'template',
    omDescription: '', 
    activityExecuted: '', 
    date: new Date().toISOString().split('T')[0], 
    omNumber: '', 
    equipment: '', 
    local: '', 
    activityType: 'preventiva', 
    startTime: '08:00', 
    endTime: '17:00', 
    iamoDeviation: false, 
    iamoDescription: '', 
    isFinished: true, 
    hasPendencies: false, 
    pendencyDescription: '', 
    teamShift: 'A', 
    workCenter: 'SC108HH', 
    technicians: '', 
    photos: []
  });

  useEffect(() => {
    if (id) {
      const existing = storage.getReports().find(r => r.id === id);
      if (existing) {
        setFormData({ ...existing });
        setIsNew(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    const shouldAutoSave = formData.type === 'report' || (formData.type === 'template' && (formData.omDescription || formData.activityExecuted));
    if (shouldAutoSave) {
      autoSaveTimerRef.current = window.setTimeout(() => {
        storage.saveReport({ ...formData, updatedAt: Date.now() } as Report);
      }, 1000);
    }
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [formData]);

  const validate = (): string[] => {
    if (isNew) {
      const errs: string[] = [];
      if (!formData.omDescription) errs.push("Descrição da OM");
      if (!formData.activityExecuted) errs.push("Atividades executada");
      return errs;
    }

    const fields = [
      { key: 'date', label: 'Data' }, 
      { key: 'equipment', label: 'Equipamento' }, 
      { key: 'local', label: 'Local' }, 
      { key: 'omNumber', label: 'N° OM' }, 
      { key: 'startTime', label: 'Horário Inicial' }, 
      { key: 'endTime', label: 'Horário Final' }, 
      { key: 'omDescription', label: 'Descrição da OM' }, 
      { key: 'activityExecuted', label: 'Atividades executada' }, 
      { key: 'technicians', label: 'Técnicos' }
    ];
    const errs = fields.filter(f => !formData[f.key as keyof Report]).map(f => f.label);
    if (formData.iamoDeviation && !formData.iamoDescription) errs.push("Explicação IAMO");
    if (formData.hasPendencies && !formData.pendencyDescription) errs.push("Detalhes Pendência");
    return errs;
  };

  const handleAction = (saveType: 'template' | 'report') => {
    const errs = validate();
    if (errs.length > 0) {
      setValidationErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (saveType === 'report' && formData.type === 'template') {
      const templateToUpdate = { ...formData, type: 'template', updatedAt: Date.now() } as Report;
      storage.saveReport(templateToUpdate);
      const newReportEntry = { ...formData, id: crypto.randomUUID(), type: 'report', date: new Date().toISOString().split('T')[0], updatedAt: Date.now(), createdAt: Date.now() } as Report;
      storage.saveReport(newReportEntry);
      navigate('/', { state: { tab: 'report' } });
    } else {
      const finalReport = { ...formData, type: saveType, updatedAt: Date.now() } as Report;
      storage.saveReport(finalReport);
      navigate('/', { state: { tab: saveType } });
    }
  };

  const toggleTechnician = (name: string) => {
    const currentList = formData.technicians ? formData.technicians.split(', ').filter(n => n) : [];
    let newList: string[] = currentList.includes(name) ? currentList.filter(n => n !== name) : [...currentList, name];
    setFormData(prev => ({ ...prev, technicians: newList.join(', ') }));
  };

  const addCustomTechnician = () => {
    if (!customTechnician.trim()) return;
    const name = customTechnician.trim();
    const currentList = formData.technicians ? formData.technicians.split(', ').filter(n => n) : [];
    if (!currentList.includes(name)) {
      setFormData(prev => ({ ...prev, technicians: [...currentList, name].join(', ') }));
    }
    setCustomTechnician('');
  };

  const updatePhotoCaption = (photoId: string, caption: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.map(p => p.id === photoId ? { ...p, caption } : p)
    }));
  };

  const saveMarkedPhoto = (newDataUrl: string) => {
    if (editingPhoto) {
      setFormData(prev => ({
        ...prev,
        photos: prev.photos?.map(p => p.id === editingPhoto.id ? { ...p, dataUrl: newDataUrl } : p)
      }));
      setEditingPhoto(null);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    // --- Cores Profissionais ---
    const COLORS = {
      NAVY: [30, 41, 59], // Slate 800 / Navy
      PRIMARY: [37, 99, 235], // Blue 600
      GRAY_TEXT: [100, 116, 139], // Slate 500
      BG_LIGHT: [248, 250, 252], // Slate 50
      BORDER: [226, 232, 240], // Slate 200
      DANGER: [185, 28, 28], // Red 700
      SUCCESS: [22, 163, 74], // Green 700
      WARNING: [180, 83, 9] // Amber 700
    };

    const addFooter = (pageNum: number) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("Relatório Técnico Gerado via ReportMaster - S11D Automação de Mina", margin, 287);
      doc.text(`Doc ID: ${formData.id?.slice(0, 8)} | Pág: ${pageNum}`, pageWidth - margin, 287, { align: 'right' });
    };

    const addEmoji = (emoji: string, currentX: number, currentY: number, size: number = 4) => {
      const dataUrl = renderEmojiToDataUrl(emoji);
      if (dataUrl) {
        doc.addImage(dataUrl, 'PNG', currentX, currentY - size + 1, size, size);
        return true;
      }
      return false;
    };

    // --- CABEÇALHO ---
    doc.setFillColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("SISTEMA DE GESTÃO TÉCNICA", margin, 15);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RELATÓRIO TÉCNICO DE EXECUÇÃO", margin, 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Automação S11D - Serra Sul | Data Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin, 34);

    // Badge Superior: Número da OM
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - margin - 55, 12, 55, 10, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
    doc.text(`ORDEM: ${formData.omNumber || 'N/A'}`, pageWidth - margin - 27.5, 18.5, { align: 'center' });

    y = 52;

    const drawSectionHeader = (emoji: string, title: string, color: number[]) => {
      addEmoji(emoji, margin, y, 6);
      doc.setFontSize(10);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), margin + 8, y);
      y += 3;
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    };

    // --- SEÇÃO 1: IDENTIFICAÇÃO ---
    drawSectionHeader("📍", "Identificação e Ativos", COLORS.NAVY);

    const drawGridItem = (label: string, value: string, xPos: number, w: number) => {
      doc.setFillColor(COLORS.BG_LIGHT[0], COLORS.BG_LIGHT[1], COLORS.BG_LIGHT[2]);
      doc.rect(xPos, y - 4, w, 15, 'F');
      doc.setDrawColor(COLORS.BORDER[0], COLORS.BORDER[1], COLORS.BORDER[2]);
      doc.setLineWidth(0.1);
      doc.rect(xPos, y - 4, w, 15, 'D');
      
      doc.setFontSize(7);
      doc.setTextColor(COLORS.GRAY_TEXT[0], COLORS.GRAY_TEXT[1], COLORS.GRAY_TEXT[2]);
      doc.setFont("helvetica", "bold");
      doc.text(label.toUpperCase(), xPos + 2, y);
      
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "normal");
      doc.text(stripSpecialChars(value), xPos + 2, y + 7, { maxWidth: w - 4 });
    };

    drawGridItem("Data Atividade", new Date(formData.date!).toLocaleDateString('pt-BR'), margin, 40);
    drawGridItem("Equipamento", formData.equipment!, margin + 45, 60);
    drawGridItem("Localização", formData.local!, margin + 110, 70);
    y += 18;
    drawGridItem("Intervalo", `${formData.startTime} às ${formData.endTime}`, margin, 40);
    drawGridItem("Natureza da OM", formData.activityType!, margin + 45, 60);
    drawGridItem("Equipe / Turno", `EQUIPE TURNO ${formData.teamShift}`, margin + 110, 70);
    y += 20;

    // Badge IAMO Profissional
    if (formData.iamoDeviation) {
      doc.setDrawColor(COLORS.DANGER[0], COLORS.DANGER[1], COLORS.DANGER[2]);
      doc.setLineWidth(1);
      doc.line(margin, y - 2, margin, y + 16);
      doc.setFillColor(254, 242, 242);
      doc.rect(margin + 0.5, y - 2, contentWidth - 0.5, 18, 'F');
      
      addEmoji("🛑", margin + 4, y + 4, 5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.DANGER[0], COLORS.DANGER[1], COLORS.DANGER[2]);
      doc.setFontSize(9);
      doc.text("REGISTRO DE DESVIO IAMO:", margin + 11, y + 4);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
      doc.setFontSize(8.5);
      const iamoLines = doc.splitTextToSize(stripSpecialChars(formData.iamoDescription!), contentWidth - 16);
      doc.text(iamoLines, margin + 4, y + 10);
      y += 25;
    }

    // --- SEÇÃO 2: EXECUÇÃO ---
    drawSectionHeader("📝", "Detalhamento de Execução", COLORS.NAVY);

    const addTechnicalText = (label: string, content: string) => {
      doc.setFontSize(8);
      doc.setTextColor(COLORS.GRAY_TEXT[0], COLORS.GRAY_TEXT[1], COLORS.GRAY_TEXT[2]);
      doc.setFont("helvetica", "bold");
      doc.text(label.toUpperCase(), margin, y);
      y += 4;
      doc.setFontSize(9.5);
      doc.setTextColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(stripSpecialChars(content), contentWidth);
      doc.text(lines, margin, y, { lineHeightFactor: 1.2 });
      y += (lines.length * 5) + 6;
    };

    addTechnicalText("Escopo Original da Ordem", formData.omDescription!);
    
    if (y > 220) { addFooter(1); doc.addPage(); y = 25; }
    
    addTechnicalText("Atividades Efetivamente Realizadas", formData.activityExecuted!);

    // --- SEÇÃO 3: RESPONSÁVEIS ---
    drawSectionHeader("👥", "Controle de Equipe e Pendências", COLORS.NAVY);

    drawGridItem("Centro de Trabalho", formData.workCenter!, margin, 45);
    drawGridItem("Inspetores / Técnicos", formData.technicians!, margin + 50, 130);
    y += 20;

    if (formData.hasPendencies) {
      doc.setDrawColor(COLORS.WARNING[0], COLORS.WARNING[1], COLORS.WARNING[2]);
      doc.setLineWidth(1);
      doc.line(margin, y - 2, margin, y + 14);
      doc.setFillColor(COLORS.BG_LIGHT[0], COLORS.BG_LIGHT[1], COLORS.BG_LIGHT[2]);
      doc.rect(margin + 0.5, y - 2, contentWidth - 0.5, 16, 'F');
      
      addEmoji("⚠️", margin + 4, y + 3, 5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.WARNING[0], COLORS.WARNING[1], COLORS.WARNING[2]);
      doc.setFontSize(9);
      doc.text("NOTIFICAÇÃO DE PENDÊNCIA:", margin + 11, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
      doc.setFontSize(8.5);
      doc.text(stripSpecialChars(formData.pendencyDescription!), margin + 4, y + 9);
      y += 20;
    }

    // Status de Conclusão Final (Fixado em CONCLUÍDA)
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.SUCCESS[0], COLORS.SUCCESS[1], COLORS.SUCCESS[2]);
    addEmoji("✅", margin, y + 1, 5);
    doc.text(`STATUS DA ORDEM: CONCLUÍDA`, margin + 7, y + 1);

    addFooter(1);

    // --- PÁGINA DE ANEXOS ---
    if (formData.photos?.length) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
      doc.text("ANEXO: EVIDÊNCIAS FOTOGRÁFICAS", margin, y);
      y += 4;
      doc.setDrawColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
      doc.line(margin, y, margin + 80, y);
      y += 12;

      const photoWidth = 85;
      const photoHeight = 65;
      const spacing = 10;

      formData.photos.forEach((p, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2) % 3;
        if (i > 0 && i % 6 === 0) {
          addFooter(Math.floor(i/6) + 1);
          doc.addPage();
          y = 30;
        }
        const xPos = margin + (col * (photoWidth + spacing));
        const currentY = (row === 0 && i % 6 === 0) ? y : (y + (row * (photoHeight + 32)));
        
        // Frame Foto
        doc.setDrawColor(COLORS.BORDER[0], COLORS.BORDER[1], COLORS.BORDER[2]);
        doc.setLineWidth(0.1);
        doc.rect(xPos, currentY, photoWidth, photoHeight, 'D');

        try {
          doc.addImage(p.dataUrl, 'JPEG', xPos + 1, currentY + 1, photoWidth - 2, photoHeight - 2);
        } catch (e) {}

        // Legenda Técnica
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(COLORS.GRAY_TEXT[0], COLORS.GRAY_TEXT[1], COLORS.GRAY_TEXT[2]);
        doc.text(`EVIDÊNCIA 0${i + 1}`, xPos, currentY + photoHeight + 5);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(COLORS.NAVY[0], COLORS.NAVY[1], COLORS.NAVY[2]);
        const capLines = doc.splitTextToSize(stripSpecialChars(p.caption || "Registro técnico sem observação adicional."), photoWidth);
        doc.text(capLines, xPos, currentY + photoHeight + 10);
      });
      addFooter(Math.ceil(formData.photos.length / 6) + 1);
    }

    doc.save(`RELATORIO_TECNICO_OM_${formData.omNumber || 'SEM_NUMERO'}.pdf`);
  };

  const shareViaWhatsApp = () => {
    const message = `🛠️ *RELATÓRIO DE EXECUÇÃO*
🏢 *AUTOMAÇÃO MINA SERRA SUL*

🗓️ *Data:* ${formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : ''}
🚜 *Equipamento:* ${formData.equipment || ''}
📌 *Local:* ${formData.local || ''}
📂 *N° OM:* ${formData.omNumber || ''}

🛠️ *Tipo:* ${formData.activityType?.toUpperCase() || ''}
⏰ *Horário:* ${formData.startTime} - ${formData.endTime}
🛑 *Desvio IAMO:* ${formData.iamoDeviation ? 'SIM (' + (formData.iamoDescription || '') + ')' : 'NÃO'}

♻️ *Descrição da OM:* ${formData.omDescription || ''}

⚙️ *Atividades Realizadas:* 
${formData.activityExecuted || ''}

🎯 *OM Finalizada:* CONCLUÍDA
🔔 *Pendências:* ${formData.hasPendencies ? 'SIM (' + (formData.pendencyDescription || '') + ')' : 'NÃO'}
👥 *Técnicos:* ${formData.technicians || ''}`;
    sendToWhatsApp(message);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-32 text-slate-800 dark:text-white transition-colors">
      <nav className="sticky top-0 z-30 bg-white dark:bg-dark-card border-b dark:border-dark-border px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-bg transition-colors"><ChevronLeft className="dark:text-white w-6 h-6" /></button>
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-widest text-blue-600">RELATÓRIO DE EXECUÇÃO</h1>
          <p className="font-extrabold text-sm leading-none text-slate-800 dark:text-white">AUTOMAÇÃO MINA SERRA SUL</p>
        </div>
      </nav>

      {editingPhoto && <ImageEditor photo={editingPhoto} onSave={saveMarkedPhoto} onCancel={() => setEditingPhoto(null)} />}

      <div className="p-4 max-w-2xl mx-auto flex flex-col gap-4">
        {isNew && (
          <div className="bg-white dark:bg-dark-card border-2 border-blue-500/20 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
             <div className="bg-blue-500/10 p-3 rounded-2xl"><ClipboardList className="w-6 h-6 text-blue-600" /></div>
             <div className="flex flex-col">
                <span className="font-black text-xs uppercase text-blue-700 dark:text-blue-400">Novo Modelo</span>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Preencha o escopo da atividade base.</p>
             </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-500/20 p-4 rounded-3xl animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="font-black text-[11px] uppercase dark:text-white">Atenção: Campos Pendentes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {validationErrors.map((e, i) => <span key={i} className="px-3 py-1 bg-white dark:bg-dark-bg rounded-lg text-[10px] font-black text-rose-600 uppercase border border-rose-100">{e}</span>)}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-200 dark:border-dark-border shadow-md overflow-hidden p-5 space-y-6">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-blue-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">📍 Identificação</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <CompactInput label="🗓️ Data" type="date" value={formData.date!} onChange={v => setFormData(p => ({...p, date: v}))} required disabled={isNew} icon={<Calendar className="w-4 h-4" />} />
              <CompactInput label="🚜 Equipamento" value={formData.equipment!} onChange={v => setFormData(p => ({...p, equipment: v}))} required placeholder="Ex: PC200" disabled={isNew} icon={<Zap className="w-4 h-4" />} />
            </div>
            
            <CompactInput label="📌 Local" value={formData.local!} onChange={v => setFormData(p => ({...p, local: v}))} required placeholder="Qual o local da atividade?" disabled={isNew} icon={<MapPin className="w-4 h-4" />} />
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-indigo-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">📂 Manutenção</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CompactInput label="📂 N° OM" value={formData.omNumber!} onChange={v => setFormData(p => ({...p, omNumber: v}))} required placeholder="Número OM" disabled={isNew} icon={<Hash className="w-4 h-4" />} />
              <div className={`flex flex-col gap-1 ${isNew ? 'opacity-60' : ''}`}>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🛠️ Tipo</label>
                <select disabled={isNew} value={formData.activityType} onChange={e => setFormData(p => ({...p, activityType: e.target.value as any}))} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card dark:text-white text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="preventiva">Preventiva</option>
                  <option value="corretiva">Corretiva</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-amber-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">⏰ Horários / IAMO</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CompactInput label="⏰ Início" type="time" value={formData.startTime!} onChange={v => setFormData(p => ({...p, startTime: v}))} required disabled={isNew} />
              <CompactInput label="⏰ Término" type="time" value={formData.endTime!} onChange={v => setFormData(p => ({...p, endTime: v}))} required disabled={isNew} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🛑 Desvio IAMO?</label>
              <button disabled={isNew} onClick={() => setFormData(p => ({...p, iamoDeviation: !p.iamoDeviation}))} className={`w-full py-3 rounded-xl text-[11px] font-black transition-all border-2 flex items-center justify-center gap-2 ${formData.iamoDeviation ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-600' : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-dark-border text-slate-400'}`}>
                {formData.iamoDeviation ? 'OCORRÊNCIA REGISTRADA' : 'SEM DESVIOS'}
              </button>
            </div>
            {formData.iamoDeviation && (
              <CompactTextArea label="🚨 Detalhes do IAMO" value={formData.iamoDescription!} onChange={v => setFormData(p => ({...p, iamoDescription: v}))} required placeholder="Explique o desvio ocorrido..." rows={2} />
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-emerald-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">📝 Detalhamento</h3>
            </div>
            <CompactTextArea label="♻️ Descrição da OM" value={formData.omDescription!} onChange={v => setFormData(p => ({...p, omDescription: v}))} required placeholder="Escopo planejado..." rows={3} />
            
            <CompactTextArea 
              label="📈 Atividades Realizadas" 
              value={formData.activityExecuted!} 
              onChange={v => setFormData(p => ({...p, activityExecuted: v}))} 
              required 
              rows={8} 
              placeholder="Descreva as atividades executadas..." 
            />
          </div>

          <div className={`flex flex-col gap-4 pt-4 border-t dark:border-dark-border ${isNew ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-rose-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">🏁 Finalização</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🎯 Status</label>
                <div className="w-full py-3 rounded-xl text-[11px] font-black text-center bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-500 text-emerald-600">
                  CONCLUÍDA
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🔔 Pendências?</label>
                <button onClick={() => setFormData(p => ({...p, hasPendencies: !p.hasPendencies}))} className={`w-full py-3 rounded-xl text-[11px] font-black transition-all border-2 ${formData.hasPendencies ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-600' : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-dark-border text-slate-400'}`}>
                  {formData.hasPendencies ? 'COM PENDÊNCIA' : 'SEM PENDÊNCIA'}
                </button>
              </div>
            </div>
            {formData.hasPendencies && (
              <CompactTextArea label="📝 Relatório de Pendência" value={formData.pendencyDescription!} onChange={v => setFormData(p => ({...p, pendencyDescription: v}))} required placeholder="Descreva as pendências..." rows={2} />
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">📈 Turno</label>
                <select value={formData.teamShift} onChange={e => setFormData(p => ({...p, teamShift: e.target.value as Shift, technicians: ''}))} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card dark:text-white text-sm font-bold shadow-sm outline-none">
                  {SHIFTS.map(s => <option key={s} value={s}>Turno {s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🔖 C. Trabalho</label>
                <select value={formData.workCenter} onChange={e => setFormData(p => ({...p, workCenter: e.target.value as WorkCenter}))} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card dark:text-white text-sm font-bold shadow-sm outline-none">
                  {WORK_CENTERS.map(wc => <option key={wc} value={wc}>{wc}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">👥 Equipe Envolvida</label>
              <div className="flex flex-wrap gap-2">
                {TECHNICIANS_BY_SHIFT[formData.teamShift! || 'A'].map(name => {
                  const isSelected = formData.technicians?.includes(name);
                  return (
                    <button key={name} onClick={() => toggleTechnician(name)} className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-2 ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400'}`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technicians?.split(', ').filter(name => name && !TECHNICIANS_BY_SHIFT[formData.teamShift! || 'A'].includes(name)).map(name => (
                  <button key={name} onClick={() => toggleTechnician(name)} className="px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-2 bg-indigo-600 border-indigo-600 text-white shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-end mt-1">
                <div className="flex-1">
                  <CompactInput label="👤 Adicionar Outro Técnico" value={customTechnician} onChange={setCustomTechnician} placeholder="Nome completo..." icon={<UserPlus className="w-4 h-4" />} />
                </div>
                <button onClick={addCustomTechnician} disabled={!customTechnician.trim()} className="bg-slate-100 dark:bg-dark-bg p-2.5 rounded-xl text-blue-600 disabled:opacity-40 border border-slate-200 dark:border-dark-border">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className={`flex flex-col gap-4 pt-4 border-t dark:border-dark-border ${isNew ? 'opacity-40 pointer-events-none' : ''}`}>
             <div className="flex items-center gap-2">
               <div className="h-4 w-1 bg-purple-600 rounded-full" />
               <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">📸 Registro Fotográfico</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => fileInputRef.current?.click()} className="py-6 border-2 border-dashed rounded-[1.5rem] border-slate-300 dark:border-dark-border text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col items-center shadow-sm">
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Galeria</span>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    if (!e.target.files) return;
                    Array.from(e.target.files).forEach((file: File) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (typeof ev.target?.result === 'string') setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), { id: crypto.randomUUID(), dataUrl: ev.target!.result as string, timestamp: Date.now() }] })); };
                      reader.readAsDataURL(file);
                    });
                  }} />
               </button>
               <button onClick={() => cameraInputRef.current?.click()} className="py-6 border-2 border-dashed rounded-[1.5rem] border-slate-300 dark:border-dark-border text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col items-center shadow-sm">
                  <Camera className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Câmera</span>
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
                    if (!e.target.files) return;
                    Array.from(e.target.files).forEach((file: File) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (typeof ev.target?.result === 'string') setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), { id: crypto.randomUUID(), dataUrl: ev.target!.result as string, timestamp: Date.now() }] })); };
                      reader.readAsDataURL(file);
                    });
                  }} />
               </button>
             </div>
             <div className="space-y-4">
               {formData.photos?.map(p => (
                 <div key={p.id} className="bg-slate-50 dark:bg-dark-bg p-3 rounded-2xl border border-slate-200 dark:border-dark-border flex gap-3 shadow-sm">
                   <div className="relative w-24 aspect-square rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 shadow-inner">
                     <img src={p.dataUrl} className="w-full h-full object-cover" />
                     <button onClick={() => setFormData(prev => ({...prev, photos: prev.photos?.filter(ph => ph.id !== p.id)}))} className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white p-1 rounded-lg shadow-md active:scale-90 transition-all"><X className="w-4 h-4" /></button>
                   </div>
                   <div className="flex-1 flex flex-col gap-2 py-1">
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Legenda e Edição</span>
                       <button onClick={() => setEditingPhoto(p)} className="text-blue-600 text-[10px] font-black uppercase flex items-center gap-1 active:scale-95 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">Desenhar <Edit3 className="w-3 h-3" /></button>
                     </div>
                     <input placeholder="Ex: Painel após manutenção..." value={p.caption || ''} onChange={(e) => updatePhotoCaption(p.id, e.target.value)} className="w-full bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:ring-2 focus:ring-blue-100" />
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {formData.type === 'report' && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t dark:border-dark-border">
              <Button onClick={generatePDF} variant="secondary" className="h-12 text-xs uppercase tracking-widest col-span-2 shadow-sm">
                <Download className="w-4 h-4" /> Exportar PDF Completo
              </Button>
              <Button onClick={shareViaWhatsApp} variant="success" className="h-14 text-sm uppercase font-black col-span-2 shadow-emerald-100/50">
                <MessageCircle className="w-5 h-5" /> Enviar Tudo via WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border-t dark:border-dark-border flex justify-center z-40 safe-area-bottom shadow-2xl">
        <div className="w-full max-w-2xl flex gap-3">
          {isNew ? (
            <Button onClick={() => handleAction('template')} className="w-full h-14 rounded-2xl shadow-lg text-base">💾 Salvar Modelo Base</Button>
          ) : formData.type === 'template' ? (
            <Button onClick={() => handleAction('report')} variant="success" className="w-full h-14 rounded-2xl shadow-lg text-base">🛠️ Iniciar Atividade</Button>
          ) : (
            <Button onClick={() => handleAction('report')} variant="primary" className="w-full h-14 rounded-2xl shadow-lg text-base">✅ Finalizar Relatório</Button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [user, setUser] = useState<UserSession | null>(storage.getSession());

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (username: string) => {
    const session = { username, loginTime: Date.now() };
    setUser(session);
    storage.setSession(session);
  };

  const logout = () => {
    setUser(null);
    storage.logout();
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
      <HashRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex flex-col transition-colors">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><ReportFormPage /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><ReportFormPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
