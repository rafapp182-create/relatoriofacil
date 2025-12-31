
import { Report, UserSession, User } from '../types';

const STORAGE_KEY = 'report_master_om_data';
const SHIFT_TEMPLATES_KEY = 'report_master_shift_templates';
const THEME_KEY = 'report_master_theme';
const AUTH_KEY = 'report_master_auth';
const USERS_KEY = 'report_master_registered_users';

export const storage = {
  getReports: (): Report[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
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

  // Seed default templates if they don't exist
  seedDefaultTemplates: (): void => {
    const reports = storage.getReports();
    
    const defaultTemplates: Report[] = [
      {
        id: 'seed-rajant-overland',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: 'MP VALIDAÇÃO LOGICA RAJANTS OVERLANAD',
        local: 'OVERLANAD',
        omDescription: 'VALIDAÇÃO LOGICA RAJANTS - OVERLAND',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Acessar bccomander\n✅  Verificar os parametros\n✅  Custos dos peers\n✅  Link state change`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-rajant-5-linha',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: 'MP VALIDAÇÃO LOGICA RAJANTS 5ª LINHA',
        local: '5ª LINHA',
        omDescription: 'VALIDAÇÃO LOGICA RAJANTS - 5ª LINHA',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Acessar bccomander\n✅  Verificar os parametros\n✅  Custos dos peers\n✅  Link state change`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-rajant-s1',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: 'MP VALIDAÇÃO LOGICA RAJANTS S1',
        local: 'SISTEMA 1',
        omDescription: 'VALIDAÇÃO LOGICA RAJANTS - SISTEMA 1',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Acessar bccomander\n✅  Verificar os parametros\n✅  Custos dos peers\n✅  Link state change`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-rajant-s2',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: 'MP VALIDAÇÃO LOGICA RAJANTS S2',
        local: 'SISTEMA 2',
        omDescription: 'VALIDAÇÃO LOGICA RAJANTS - SISTEMA 2',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Acessar bccomander\n✅  Verificar os parametros\n✅  Custos dos peers\n✅  Link state change`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-rajant-s3',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: 'MP VALIDAÇÃO LOGICA RAJANTS S3',
        local: 'SISTEMA 3',
        omDescription: 'VALIDAÇÃO LOGICA RAJANTS - SISTEMA 3',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Acessar bccomander\n✅  Verificar os parametros\n✅  Custos dos peers\n✅  Link state change`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-rajant-s4',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: 'MP VALIDAÇÃO LOGICA RAJANTS S4',
        local: 'SISTEMA 4',
        omDescription: 'VALIDAÇÃO LOGICA RAJANTS - SISTEMA 4',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Acessar bccomander\n✅  Verificar os parametros\n✅  Custos dos peers\n✅  Link state change`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-inspecao-rede-redundancia',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'MP INSPEÇÃO DE REDE DE REDUNDÂNCIA',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Verificar indicação dos leds dos ozds, observando se as redundancias dos canais ch02 e ch3 estão ativo\n✅  Verificar condições de dio's e cordões\n✅  Verificar fixação e regulagem dos cabos.\n✅  Verificar integridade dos cabos.\n✅  Verificar conectores.\n✅  Abrir nota em caso de anormalidade, que não possa ser resolvida de imediato.\n✅  Desmobilização e 5s.`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'B',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-radio-rajat',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'MP RADIO RAJAT',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Verificar e registrar nivel sinal enlace.\n✅  Verificar e registrar relacao sinal ruido enlace.\n✅  Verificar e registrar canal de comunicacao.\n✅  Verificar a visada entre as antenas.\n✅  Verificar e corrigir desvios cabo coaxial.\n✅  Verificar e corrigir desvios nos conectores.\n✅  Verificar cabos e conexoes do painel do radio, quanto a desgate e oxidações.\n✅  Verificar energia,conexoes e cabos eletricos; validar se o rádio está devidamente conectado aos dispositivos de proteção elétrica, validar se os leds de status estão sem alarmes, validar se as conexões elétricas estão bem feitas e se os cabos elétricos estão íntegros.\n✅  Verificar componentes painel do radio.\n✅  Fazer limpeza interna painel do radio.\n✅  Fazer limpeza externa painel do radio.\n✅  Verificar a vedacao do painel do radio.\n✅  Verificar identificacao painel do radio.\n✅  Registrar informacoes dos desvios na om observações.`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'B',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-limpeza-ativos',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'MP LIMPEZA DE ATIVOS',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Checar controle de acesso\n✅  Efetuar limpeza externa e interna do painel\n✅  Efetuar limpeza dos componentes do painel\n✅  Checar vedação do painel\n✅  Verificar cabos das botoeiras (quando aplicavel)\n✅  Realizar reaperto das conexoes dos cabos de rede profibus(cor roxa), cabos da rede entre cartões (cabo verde), cabos de alimetação da fonte de alimetação\n✅  Checar link principal\n✅  Checar falha nos cartoes\n✅  Organizar cabos e identificalos\n✅  Checar integridade da fonte, ajustando o nível de tensão de saída se necessário para 24 volts\n✅  Conferir fixação da luminária interna do painel\n✅  Conferir aperto nos parafusos de fixação do espelho do painel\n✅  Conferir aperto nos parafusos de fixação do painel\n✅  Conferir na conexão do aterramento\n✅  Inspecionar distribuidores dio do painel\n✅  Verificar a integridade e limpezar do dio no interior do painel\n✅  Verificarar cabos de ligação do dio\n✅  Verificarar elements de fixação quanto a perda do dio\n✅  Desmobilização e 5s`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-fixar-fonte-rajant',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'FIXAR FONTE RAJANT',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅ Fazer procedimentos de segurança\n✅ Preparar ferramentas e materiais\n✅ Realizar bloqueio do equipamento\n✅ Realizar teste\n✅ Limpar local da tarefa\n✅ Retirar bloqueio do equipamento\n✅ Descartar residuos gerados\n✅ Apropriar mão de obra`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'B',
        workCenter: 'SC108HH',
        technicians: 'Luiz Gustavo / Rafael',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-fixacao-tag-sw',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'REALIZAR FIXAÇÃO DE TAG DEFINITIVO NO SW',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅ Passo a passo da atividade\n✅ Fazer procedimentos de segurança;\n✅ Preparar ferramentas e materiais;\n✅ Realizar limpeza geral do pl;\n✅ Confeccionar e instalar tag;\n✅ Apropriar mão de obra.`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'B',
        workCenter: 'SC108HH',
        technicians: 'Luiz Gustavo / Rafael',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-trava-trilho-din',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'INSTALAR TRAVA TRILHO DIN',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Preenchido toda a documentação.\n✅  Checado controle de acesso.\n✅  Verificado cenário da atividade\n✅  Realizado instalação das travas de trilho din\n✅  Desmobilização e 5s`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-preven-logica-sw0663',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'PREVEN. LOGICA SWITCH SW0663',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Verificar se switch está configurado o banner: adcionar, caso não tenha.\n✅  Valiadação da descrição das portas: validar ativo conectado na porta e adcionar descricao.\n✅  Verificar acesso via tacacs: caso não tenha, configurar e testar o acesso via tacacs no ativo.\n✅   verificar se ativo cisco está acessando apenas via telnet: validar versão de firmware e ativar aceso apenas via ssh, caso seja possivel.\n✅  Avaliar se porta do switch com poe ativo: desativar alimentacao poe na porta\n✅  Analisar logs para detecção de falhas: logs de falha elétrica, falha de atenuação, falha de roteamento e configuração\n✅  Teste transceiver: realizar teste de transceiver. aplicável quando houver redundância.\n✅  Revisão de configuracões: revisão de configuracões de acordo com os padrões de engenharia\n✅  Registrar informações dos desvios na om.\n✅  Em caso de identificar anomalia, abrir nota para resolução e informa número na om.`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-limpeza-organizacao-painel',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'REALIZAR LIMPEZA E ORGANIZAÇÃO DO PAINEL',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Fazer procedimentos de segurança.\n✅  Preparar ferramentas e materiais.\n✅  Realizar bloqueio do equipamento.\n✅  Realizar limpeza geral do pl.\n✅  Organizar os cabos.\n✅  Prencher aberturas do painel com espuma expansiva.\n✅  Retirar bloqueio do equipamento.\n✅  Descartar residuos gerados.\n✅  Apropriar mão de obra.`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'seed-mp-logica-cftv-generic',
        type: 'template',
        category: 'fixos',
        omNumber: '',
        equipment: '',
        local: '',
        omDescription: 'MP LOGICA CFTV',
        activityType: 'preventiva',
        startTime: '08:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        activityExecuted: `✅  Verificar se as câmeras estão ativas no sistema e disponíveis para operação\n✅  Verificar se a câmera está cadastrada nos sistemas, Zabbix Netbox CMDB.\n✅  Verificar/corrigir se a câmera está utilizando as credenciais definidas pelo time de automação\n✅  Verificar/corrigir se o nome do dispositivo e o nome do host correspondem à TAG da câmera\n✅  Verificar/corrigir se a máscara de rede está configurada corretamente\n✅  Verificar/corrigir se o gateway de rede está configurado corretamente\n✅  Verificar/corrigir se o SNMP está ativo e com a comunidade correta\n✅  Verificar/corrigir se a RESUL está de acordo com o procedimento\n✅  Verificar se a nitidez pode ser ajustada remotamente (abrir nota se não for possível)\n✅ Verificar se todas as gravações das câmeras estão sendo armazenadas por no mínimo 7 dias e acessíveis pelo sistema operacional\n✅  Verificar se os comandos remotos de movimentação e zoom estão funcionando pelo sistema (apenas para câmeras com esse recurso)\n✅  Registrar informações dos desvios na OM\n✅  Abrir nota em caso de anormalidade`,
        iamoDeviation: false,
        iamoDescription: '',
        isFinished: true,
        hasPendencies: false,
        pendencyDescription: '',
        teamShift: 'A',
        workCenter: 'SC108HH',
        technicians: '',
        photos: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    defaultTemplates.forEach(template => {
      const exists = reports.some(r => r.id === template.id);
      if (!exists) {
        storage.saveReport(template);
      }
    });
  },

  // Auth Management
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

  // Shift Start Templates
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

  // Backup & Restore
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

  // Theme Management
  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(THEME_KEY, theme);
  }
};
