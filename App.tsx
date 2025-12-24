
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Plus, 
  ChevronLeft, 
  Trash2, 
  Download, 
  Share2, 
  Camera, 
  Image as ImageIcon,
  CheckCircle2,
  User,
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
  UserPlus
} from 'lucide-react';
import { storage } from './services/storage';
import { Report, Shift, ReportType, ReportPhoto, WorkCenter } from './types';
import { SHIFTS, WORK_CENTERS, TECHNICIANS_BY_SHIFT } from './constants';
import { jsPDF } from 'jspdf';

// --- Contexto de Tema ---
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
} | null>(null);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// --- Utilitários ---
const stripSpecialChars = (text: string) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\s]/g, "")
    .trim();
};

// --- Componentes de UI ---

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

const Button: React.FC<{
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, variant = 'primary', className = '', type = 'button', disabled, children }) => {
  const base = "px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100";
  const variants = {
    primary: "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none",
    secondary: "bg-slate-200 dark:bg-dark-card text-black dark:text-white",
    success: "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none",
    danger: "bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-none",
    ghost: "bg-transparent text-black dark:text-white"
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
        className={`w-full ${icon ? 'pl-9' : 'px-3'} py-2.5 rounded-xl border bg-white dark:bg-dark-card ${error ? 'border-rose-400 ring-1 ring-rose-100' : 'border-slate-300 dark:border-dark-border'} focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-black dark:text-white shadow-sm placeholder:text-slate-400 disabled:bg-slate-100`}
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
      className={`w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-dark-card ${error ? 'border-rose-400 ring-1 ring-rose-100' : 'border-slate-300 dark:border-dark-border'} focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-black dark:text-white resize-none shadow-sm placeholder:text-slate-400 disabled:bg-slate-100`}
    />
  </div>
);

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

  useEffect(() => {
    const state = location.state as { tab?: ReportType } | null;
    if (state?.tab) setActiveTab(state.tab);
  }, [location]);

  useEffect(() => {
    const allReports = storage.getReports();
    setReports(allReports.sort((a, b) => b.updatedAt - a.updatedAt));
  }, []);

  const handleDelete = (e: React.BaseSyntheticEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm("Excluir item permanentemente?")) {
      storage.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
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
            <h1 className="text-2xl font-black text-black dark:text-white tracking-tight">ReportMaster</h1>
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none">S11D - Serra Sul</p>
          </div>
        </div>
      </header>

      <div className="bg-slate-200 dark:bg-dark-card p-1 rounded-xl flex shadow-inner">
        <button onClick={() => setActiveTab('template')} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'template' ? 'bg-white dark:bg-dark-bg text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Meus Modelos</button>
        <button onClick={() => setActiveTab('report')} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'report' ? 'bg-white dark:bg-dark-bg text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 opacity-70'}`}>Relatórios Prontos</button>
      </div>

      {activeTab === 'template' && (
        <Button onClick={() => navigate('/new')} className="h-14 rounded-xl text-base shadow-lg">
          <Plus className="w-5 h-5" /> Criar Novo Modelo
        </Button>
      )}

      <div className="grid gap-3 mt-1">
        {filteredReports.map((report) => (
          <div key={report.id} onClick={() => navigate(`/edit/${report.id}`)} className={`bg-white dark:bg-dark-card p-4 rounded-2xl border-l-[6px] shadow-sm relative active:scale-[0.98] transition-all ${report.type === 'report' ? 'border-emerald-500' : 'border-blue-600'}`}>
            <div className="flex flex-col pr-8">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{report.omNumber || 'SEM NÚMERO'}</span>
              <h3 className="font-bold text-black dark:text-white text-sm leading-tight mt-0.5 truncate">{report.omDescription}</h3>
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
    </div>
  );
};

const ReportFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
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
      const newReportEntry = { ...formData, id: crypto.randomUUID(), type: 'report', updatedAt: Date.now(), createdAt: Date.now() } as Report;
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
    let y = 15;

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("SISTEMA DE RELATORIOS AUTOMACAO", margin, 15);
    doc.setFontSize(18);
    doc.text("RELATORIO DE EXECUCAO", margin, 26);
    doc.setFontSize(10);
    doc.text("MINA SERRA SUL - S11D", margin, 34);
    
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(140, 12, 55, 18, 2, 2, 'F');
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(8);
    doc.text("NUMERO DA OM", 145, 18);
    doc.setFontSize(14);
    doc.text(stripSpecialChars(formData.omNumber || "8000XXXX"), 145, 26);

    doc.setTextColor(0, 0, 0);
    y = 55;

    const addSectionHeader = (title: string) => {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 5, 180, 8, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(title.toUpperCase(), margin + 3, y + 1);
      y += 12;
    };

    const addDataRow = (label: string, value: string | boolean, xOffset = 0) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(stripSpecialChars(label).toUpperCase(), margin + xOffset, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(typeof value === 'boolean' ? (value ? "SIM" : "NAO") : stripSpecialChars(value || "-"), margin + xOffset, y + 5);
      return y + 12;
    };

    addSectionHeader("DADOS DE IDENTIFICACAO");
    addDataRow("Data de Execucao", new Date(formData.date!).toLocaleDateString('pt-BR'));
    addDataRow("Equipamento", formData.equipment!, 60);
    addDataRow("Local/Frente", formData.local!, 120);
    y += 15;
    
    addDataRow("Tipo de Atividade", formData.activityType!);
    addDataRow("Periodo", `${formData.startTime} ate ${formData.endTime}`, 60);
    addDataRow("Turno da Equipe", `TURNO ${formData.teamShift}`, 120);
    y += 15;

    if (formData.iamoDeviation) {
      addDataRow("Ocorrencia IAMO", "SIM");
      addDataRow("Justificativa IAMO", formData.iamoDescription || "-", 60);
      y += 15;
    }

    addSectionHeader("DETALHAMENTO TECNICO");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("DESCRICAO DA OM", margin, y);
    y += 4;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(stripSpecialChars(formData.omDescription!), 180);
    doc.text(descLines, margin, y);
    y += (descLines.length * 5) + 6;

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("ATIVIDADES EFETIVAMENTE EXECUTADAS", margin, y);
    y += 4;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const execLines = doc.splitTextToSize(stripSpecialChars(formData.activityExecuted!), 180);
    doc.text(execLines, margin, y);
    y += (execLines.length * 5) + 10;

    addSectionHeader("STATUS FINAL E EQUIPE");
    addDataRow("Status OM", formData.isFinished ? "CONCLUIDA" : "EM ANDAMENTO");
    addDataRow("Pendencias", formData.hasPendencies ? "SIM" : "NAO", 60);
    if (formData.hasPendencies) addDataRow("Descritivo Pendencia", formData.pendencyDescription!, 120);
    y += 15;
    addDataRow("Centro de Trabalho", formData.workCenter!);
    addDataRow("Equipe Técnica Envolvida", formData.technicians!, 60);
    y += 20;

    if (formData.photos?.length) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("EVIDENCIAS FOTOGRAFICAS", margin, y);
      y += 10;

      formData.photos.forEach((p, i) => {
        if (y > 230) { doc.addPage(); y = 20; }
        const col = i % 2;
        const xPos = margin + (col * 92);
        doc.setDrawColor(203, 213, 225);
        doc.rect(xPos, y, 88, 72);
        try { doc.addImage(p.dataUrl, 'JPEG', xPos + 1.5, y + 1.5, 85, 60); } catch (e) { }
        if (p.caption) {
          doc.setFillColor(248, 250, 252);
          doc.rect(xPos + 1.5, y + 62, 85, 8.5, 'F');
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(51, 65, 85);
          doc.text(doc.splitTextToSize(stripSpecialChars(p.caption), 82), xPos + 4, y + 66.5);
        }
        if (col === 1 || i === formData.photos!.length - 1) y += 80;
      });
    }

    doc.save(`RELATORIO_OM_${formData.omNumber || 'PENDENTE'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-32 text-black dark:text-white transition-colors">
      <nav className="sticky top-0 z-30 bg-white dark:bg-dark-card border-b dark:border-dark-border px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-bg transition-colors"><ChevronLeft className="dark:text-white w-6 h-6" /></button>
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-widest text-blue-600">RELATÓRIO DE EXECUÇÃO</h1>
          <p className="font-extrabold text-sm leading-none text-slate-900 dark:text-white">AUTOMAÇÃO MINA SERRA SUL</p>
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
          
          {/* 1. Identificação */}
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

          {/* 2. Ordem de Manutenção */}
          <div className="flex flex-col gap-4 pt-4 border-t dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-indigo-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">📂 Manutenção</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CompactInput label="📂 N° OM" value={formData.omNumber!} onChange={v => setFormData(p => ({...p, omNumber: v}))} required placeholder="Número OM" disabled={isNew} icon={<Hash className="w-4 h-4" />} />

              <div className={`flex flex-col gap-1 ${isNew ? 'opacity-60' : ''}`}>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🛠️ Tipo</label>
                <select disabled={isNew} value={formData.activityType} onChange={e => setFormData(p => ({...p, activityType: e.target.value as any}))} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="preventiva">Preventiva</option>
                  <option value="corretiva">Corretiva</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Horários e IAMO */}
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

          {/* 4. Escopo e Execução */}
          <div className="flex flex-col gap-4 pt-4 border-t dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-emerald-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">📝 Detalhamento</h3>
            </div>

            <CompactTextArea label="♻️ Descrição da OM" value={formData.omDescription!} onChange={v => setFormData(p => ({...p, omDescription: v}))} required placeholder="Escopo planejado..." rows={3} />
            
            <CompactTextArea label="📈 Atividades Realizadas" value={formData.activityExecuted!} onChange={v => setFormData(p => ({...p, activityExecuted: v}))} required rows={6} placeholder="O que foi executado na prática?" />
          </div>

          {/* 5. Fechamento e Equipe */}
          <div className={`flex flex-col gap-4 pt-4 border-t dark:border-dark-border ${isNew ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-rose-600 rounded-full" />
              <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">🏁 Finalização</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight px-1">🎯 Concluída?</label>
                <button onClick={() => setFormData(p => ({...p, isFinished: !p.isFinished}))} className={`w-full py-3 rounded-xl text-[11px] font-black transition-all border-2 ${formData.isFinished ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 text-amber-600'}`}>
                  {formData.isFinished ? 'CONCLUÍDA' : 'EM ANDAMENTO'}
                </button>
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
                  <CompactInput 
                    label="👤 Adicionar Outro Técnico" 
                    value={customTechnician} 
                    onChange={setCustomTechnician} 
                    placeholder="Nome completo..."
                    icon={<UserPlus className="w-4 h-4" />}
                  />
                </div>
                <button 
                  onClick={addCustomTechnician} 
                  disabled={!customTechnician.trim()}
                  className="bg-slate-100 dark:bg-dark-bg p-2.5 rounded-xl text-blue-600 disabled:opacity-40 active:scale-90 transition-all border border-slate-200 dark:border-dark-border"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* 6. Evidências (Fotos) */}
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

          {/* Opções de Exportação */}
          {formData.type === 'report' && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t dark:border-dark-border">
              <Button onClick={generatePDF} variant="secondary" className="h-12 text-xs uppercase tracking-widest"><Download className="w-4 h-4" /> PDF</Button>
              <Button onClick={() => navigator.share && navigator.share({title: `Relatório OM ${formData.omNumber}`})} variant="secondary" className="h-12 text-xs uppercase tracking-widest"><Share2 className="w-4 h-4" /> Enviar</Button>
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

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
            <Route path="/" element={<HomePage />} />
            <Route path="/new" element={<ReportFormPage />} />
            <Route path="/edit/:id" element={<ReportFormPage />} />
          </Routes>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
