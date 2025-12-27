
import { Report, UserSession, User } from '../types';

const STORAGE_KEY = 'report_master_om_data';
const SHIFT_TEMPLATES_KEY = 'report_master_shift_templates';
const THEME_KEY = 'report_master_theme';
const AUTH_KEY = 'report_master_auth';
const USERS_KEY = 'report_master_registered_users';

// --- Blocos de Atividades Repetitivas ---

const RAJANT_COMMON_ACTIVITIES = `✅  Acessar bccomander
✅  Verificar os parametros
✅  Custos dos peers
✅  Link state change`;

const REDE_REDUNDANCIA_ACTIVITIES = `✅  Preencha os itens abaixo marcando
✅  Verificar indicação dos leds dos ozds, observando se as redundancias dos canais ch02 e ch3 estão ativo
✅  Verificar condições de dio's e cordões
✅  Verificar fixação e regulagem dos cabos.
✅  Verificar integridade dos cabos.
✅  Verificar conectores.
✅  Abrir nota em caso de anormalidade, que não possa ser resolvida de imediato.
✅  Desmobilização e 5s.`;

const ATERRAMENTO_ACTIVITIES = `✅ 1) mobilização a area de atividade
✅ 2) atentar a exposição a fonte de radiação não ionizante
✅ 3) exposição a condição climática
✅ 4) transporte manual de ferramentais e acessorios
✅ 5) apresentação entre a equipe de execução e análise
✅ 6) leitura e análise de todos os passos da atividade
✅ 7) realizar o bloqueio do circuito conforme matriz
✅ 8) se posicionar ao switch correspondente
✅ 9) faça a conferencia para atividade para o serviço
✅ 10) faça uma pré-tanálise e confirme aterramento
✅ 11) execute a conferencia de ligação dos cabos
✅ 12) identifique os cabos de alimentação
✅ 13) observe os cabos ao entorno da área de trabalho
✅ 14) faça a analise defina dos componentes a subtituir
✅ 15) efetue a retirada dos componentes danificados
✅ 16) faça a reinstalação dos componentes novos
✅ 17) faça a religamento dos cabos de alimentação
✅ 18) faça a inserção dos cabos de alimentação
✅ 19) faça o religamento dos instrumentos
✅ 20) faça os ajustes dos suportes e sensores
✅ 21) fazer teste funcional com o instrumento
✅ 22) após as atividades, efetuar os desboqueios
✅ 23) caso haja sobra de material, devolver
✅ 24) efetuar vistoria em toda a área trabalhada
✅ 25) efetuar a desmobilização da área
✅ 26) dar tratativa de descarte de todos os materiais
✅ 27) efetuar descarte de materiais em locais definidos
✅ 28) efetuar apropriação de hh e finalização técnico`;

const MP_RADIO_RAJANT_ACTIVITIES = `✅  Verificar e registrar nivel sinal enlace.
✅  Verificar e registrar relacao sinal ruido enlace.
✅  Verificar e registrar canal de comunicacao.
✅  Verificar a visada entre as antenas.
✅  Verificar e corrigir desvios cabo coaxial.
✅  Verificar e corrigir desvios nos conectores.
✅  Verificar cabos e conexoes do painel do radio.
✅  Verificar energia,conexoes e cabos eletricos.
✅  Verificar componentes painel do radio.
✅  Fazer limpeza interna painel do radio.
✅  Fazer limpeza externa painel do radio.
✅  Verificar a vedacao do painel do radio.
✅  Verificar identificacao painel do radio.
✅  Registrar informacoes dos desvios na om.`;

const AUTOMACAO_CORE_ACTIVITIES = `✅  Verificar status dos ativos de rede (Core)
✅  Limpeza de filtros de ventilação do rack
✅  Verificar redundância de fontes AC/DC
✅  Inspecionar cabos de fibra óptica e patch cords
✅  Testar conectividade com servidores de mina
✅  Verificar logs de erro nos switches industriais
✅  Organização e 5S do contêiner de automação`;

const EMBARCADOS_GPS_ACTIVITIES = `✅  Verificar fixação da antena GPS/Glonass
✅  Testar continuidade do cabo coaxial LMR
✅  Validar recepção de satélites no terminal (VHMS/DISPATCH)
✅  Verificar alimentação 24V do conversor
✅  Limpeza externa do sensor de posição
✅  Teste funcional de deslocamento e precisão`;

const INITIAL_TEMPLATES: Report[] = [
  // --- TRUCKLESS ---
  {
    id: 'template-truckless-1',
    type: 'template', group: 'TRUCKLESS',
    omDescription: 'MP INSPEÇÃO DE REDE DE REDUNDÂNCIA',
    activityExecuted: REDE_REDUNDANCIA_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: 'SISTEMA REDUNDANTE', local: 'CAMPO', activityType: 'preventiva',
    startTime: '08:00', endTime: '17:00', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'A', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-2',
    type: 'template', group: 'TRUCKLESS',
    omDescription: 'INSTALAR ATERRAMENTO NO ATIVO',
    activityExecuted: ATERRAMENTO_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: 'SWITCH CAMPO', local: 'PILARES', activityType: 'preventiva',
    startTime: '08:00', endTime: '17:00', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'A', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  // --- AUTOMAÇÃO ---
  {
    id: 'template-aut-1',
    type: 'template', group: 'AUTOMAÇÃO',
    omDescription: 'MP PREVENTIVA EM ATIVOS DE REDE CORE',
    activityExecuted: AUTOMACAO_CORE_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: 'SWITCH CORE', local: 'CONTÊINER AUTOMAÇÃO', activityType: 'preventiva',
    startTime: '08:00', endTime: '17:00', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'A', workCenter: 'SC103HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  // --- EMBARCADOS ---
  {
    id: 'template-emb-1',
    type: 'template', group: 'EMBARCADOS',
    omDescription: 'TROCA E VALIDAÇÃO DE ANTENA GPS',
    activityExecuted: EMBARCADOS_GPS_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: 'PC8000', local: 'OFICINA MÓVEL', activityType: 'corretiva',
    startTime: '08:00', endTime: '17:00', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'A', workCenter: 'SC117HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  }
];

export const storage = {
  getReports: (): Report[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Se não houver nada, injeta os modelos iniciais
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEMPLATES));
        return INITIAL_TEMPLATES;
      }
      const parsed = JSON.parse(data);
      // Garante que pelo menos os IDs de templates nativos existam se a lista estiver vazia
      if (parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEMPLATES));
        return INITIAL_TEMPLATES;
      }
      return parsed;
    } catch (error) {
      console.error('Error loading reports from storage', error);
      return [];
    }
  },

  saveReport: (report: Report): void => {
    const reports = storage.getReports();
    const index = reports.findIndex((r) => r.id === report.id);
    
    if (index !== -1) {
      reports[index] = { ...report, updatedAt: Date.now() };
    } else {
      reports.push({ ...report, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  deleteReport: (id: string): void => {
    const reports = storage.getReports();
    const filtered = reports.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  registerUser: (newUser: User): { success: boolean; message: string } => {
    const users = storage.getUsers();
    if (users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      return { success: false, message: 'Este nome de usuário já existe.' };
    }
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Usuário cadastrado com sucesso!' };
  },

  authenticateUser: (credentials: User): boolean => {
    const users = storage.getUsers();
    const found = users.find(u => 
      u.username.toLowerCase() === credentials.username.toLowerCase() && 
      u.password === credentials.password
    );
    return !!found;
  },

  setSession: (session: UserSession): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  },

  getSession: (): UserSession | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  getShiftTemplates: (): Record<string, string> | null => {
    try {
      const data = localStorage.getItem(SHIFT_TEMPLATES_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveShiftTemplates: (templates: Record<string, string>): void => {
    localStorage.setItem(SHIFT_TEMPLATES_KEY, JSON.stringify(templates));
  },

  exportBackup: (): void => {
    const reports = storage.getReports();
    const templates = storage.getShiftTemplates();
    const data = JSON.stringify({ reports, templates }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_reportmaster_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.reports && Array.isArray(parsed.reports)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.reports));
        if (parsed.templates) {
          localStorage.setItem(SHIFT_TEMPLATES_KEY, JSON.stringify(parsed.templates));
        }
        return true;
      } else if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, jsonString);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(THEME_KEY, theme);
  }
};
