
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

const ATERRAMENTO_ACTIVITIES = `✅ 1) mobilização a area de atividade:
✅ 2) atentar a exposição a fonte de radiação não ionizante ( radiação solar, campos magneticos );
✅ 3) exposição a condição climática ( chuva, tempestade, chuvisco );
✅ 4) transporte manual de ferramentais e acessorios para frente de serviço;
✅ 5) apresentação entre a equipe de execução e análise da atividade, levando em conta a condição na posição e frente de serviço;
✅ 6) leitura e análise de todos os passos da atividade a serem executados, seu processo, riscos e perigos. discutidos e informados a todos os integrantes;
✅ _ utilizar e estar em acordo com a art da atividade, pts e outros que forem apresentadas, assinando e confirmando a compreensão das informações;
✅ 7) realizar o bloqueio do circuito descrito pela matriz de bloqueio das condições e necessidades para a atividade proposta;
✅ 8) se posicionar ao switch correspondente a solicitação;
✅ 9) faça a conferencia para atividade para o serviço, faça o acesso com segurança e conforme regras de segurança;
✅ 10) faça uma  pré-tanálise e confirme a falta ou deficiencia do aterramentoe sua funcionalidade de atuação e sinalização da mesma;
✅ 11) execute a conferencia de ligação dos cabos de alimentação e sinal com o desenho eletrico / projeto;
✅ 12) identifique os cabos de alimentação, caso não exista, marque com anilha ou caneta, certificando conforme desenho / projeto;
✅ 13) observe os cabos ao entorno da área de trabalho. faça o desligamento dos bornes e efetue o isolamento provisorio dos fios e pontas dos cabos;
✅ 14) faça a analise defina dos componentes a subtituir. efetue a retirada dos cabos de ligação;
✅ 15) efetue a retirada dos componentes danificados e os deixe ao lado para futuro descarte;
✅ 16) faça a reinstalação dos componentes novos no painel conforme especificações devidas, conforme projeto;
✅ 17) faça a religamento dos cabos de alimentação e controle, conforme especificações tecnicas;
✅ 18) faça a inserção dos cabos de alimentação, comando e sinal dos instrumentos, conforme projeto / desenho levantado;
✅ 19) faça o religamento dos instrumentos conforme necessidade e indicação do fabricante;
✅ 20) faça os ajustes dos suportes e sensores conforme perfeita leitura de dados dos mesmos;
✅ 21) fazer teste funcional com o instrumento;
✅ 22) após as atividades, efetuar os desboqueios eletricos;
✅ 23) caso haja sobra de material novo em que se possa ser utilizado e ou aproveitado em outra obra, reunir, descrever e devolver todos estes ao aprovisionamento / preparação, para posterior devolução ao mro e ou demandar para outra ordem;
✅ 24) efetuar vistoria em toda a área trabalhada, garantindo a retirada de todo e qualquer componente que possa acarretar avarias em circuito produtivo;
✅ 25) efetuar a desmobilização da área;
✅ 26) dar tratativa de descarte de todos os materiais / sobras (materiais que não servem para utilização);
✅ 27) efetuar descarte de materiais, utilizando de locais e dispositivos já definidos e alinhados conforme padronização vigente;
✅ 28) efetuar apropriação de hh e preenchimentos das ordens, finalização e encerramento tecnico das mesmas.`;

const MP_RADIO_RAJANT_ACTIVITIES = `✅  Verificar e registrar nivel sinal enlace.
✅  Verificar e registrar relacao sinal ruido enlace.
✅  Verificar e registrar canal de comunicacao.
✅  Verificar a visada entre as antenas.
✅  Verificar e corrigir desvios cabo coaxial.
✅  Verificar e corrigir desvios nos conectores.
✅  Verificar cabos e conexoes do painel do radio, quanto a desgate e oxidações.
✅  Verificar energia,conexoes e cabos eletricos; validar se o rádio está devidamente conectado aos dispositivos de proteção elétrica, validar se os leds de status estão sem alarmes, validar se as conexões elétricas estão bem feitas e se os cabos elétricos estão íntegros.
✅  Verificar componentes painel do radio.
✅  Fazer limpeza interna painel do radio.
✅  Fazer limpeza externa painel do radio.
✅  Verificar a vedacao do painel do radio.
✅  Verificar identificacao painel do radio.
✅  Registrar informacoes dos desvios na om observações.`;

const LIMPEZA_ATIVOS_ACTIVITIES = `✅  Checar controle de acesso
✅  Efetuar limpeza externa e interna do painel
✅  Efetuar limpeza dos componentes do painel
✅  Checar vedação do painel
✅  Verificar cabos das botoeiras (quando aplicavel)
✅  Realizar reaperto das conexoes dos cabos de rede profibus(cor roxa), cabos da rede entre cartões (cabo verde), cabos de alimetação da fonte de alimetação
✅  Checar link principal
✅  Checar falha nos cartoes
✅  Organizar cabos e identificalos
✅  Checar integridade da fonte, ajustando o nível de tensão de saída se necessário para 24 volts
✅  Conferir fixação da luminária interna do painel
✅  Conferir aperto nos parafusos de fixação do espelho do painel
✅  Conferir aperto nos parafusos de fixação do painel
✅  Conferir na conexão do aterramento
✅  Inspecionar distribuidores dio do painel
✅  Verificar a integridade e limpezar do dio no interior do painel
✅  Verificarar cabos de ligação do dio
✅  Verificarar elements de fixação quanto a perda do dio
✅  Desmobilização e 5s`;

const FIXACAO_SIMPLES_ACTIVITIES = `✅ Fazer procedimentos de segurança
✅ Preparar ferramentas e materiais
✅ Realizar bloqueio do equipamento
✅ Realizar teste
✅ Limpar local da tarefa
✅ Retirar bloqueio do equipamento
✅ Descartar residuos gerados
✅ Apropriar mão de obra`;

const FIXACAO_TAGS_ACTIVITIES = `✅ Passo a passo da atividade
✅ Fazer procedimentos de segurança;
✅ Preparar ferramentas e materiais;
✅ Realizar limpeza geral do pl;
✅ Confeccionar e instalar tag;
✅ Apropriar mão de obra.`;

const REPETIDORA_ACTIVITIES = `✅   limpar e avaliar os módulos fotovoltaicos (placas solares);
✅  Verificar carga do controlador de carga;
✅  Medir niveis de tensao do banco de baterias, dos paineis e do controlador de carga (substituir caso necessario)
✅  Limpar e secar caixa do painel de controle (se necessario);
✅  Limpar o dissipador de calor do controlador;
✅  Verificar rádio cisco/rádio rajant;
✅  Verificar integridades das antena(substituir se necessario)
✅  Aferir pressão e calibrar pneus;
✅  Registrar informacoes dos desvios na om`;

const INITIAL_TEMPLATES: Report[] = [
  {
    id: 'template-truckless-inspecao-redundancia',
    type: 'template',
    omDescription: 'MP INSPEÇÃO DE REDE DE REDUNDÂNCIA',
    activityExecuted: REDE_REDUNDANCIA_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-instalar-aterramento',
    type: 'template',
    omDescription: 'INSTALAR ATERRAMENTO NO ATIVO',
    activityExecuted: ATERRAMENTO_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-mp-radio-rajant',
    type: 'template',
    omDescription: 'MP RADIO RAJAT',
    activityExecuted: MP_RADIO_RAJANT_ACTIVITIES,
    date: '2025-12-24',
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-limpeza-ativos',
    type: 'template',
    omDescription: 'MP LIMPEZA DE ATIVOS',
    activityExecuted: LIMPEZA_ATIVOS_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-fixar-fonte',
    type: 'template',
    omDescription: 'FIXAR FONTE RAJANT',
    activityExecuted: FIXACAO_SIMPLES_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-tag-definitivo',
    type: 'template',
    omDescription: 'REALIZAR FIXAÇÃO DE TAG DEFINITIVO NO SW',
    activityExecuted: FIXACAO_TAGS_ACTIVITIES,
    date: '2025-12-25',
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-tag-cabos',
    type: 'template',
    omDescription: 'INSTALAR TAG DE IDENTIFICAÇÃO NOS CABOS',
    activityExecuted: FIXACAO_TAGS_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '', endTime: '', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'template-truckless-repetidoras-moveis',
    type: 'template',
    omDescription: 'MP REPETIDORAS MOVEIS',
    activityExecuted: REPETIDORA_ACTIVITIES,
    date: new Date().toISOString().split('T')[0],
    omNumber: '', equipment: '', local: '', activityType: 'preventiva',
    startTime: '00:50', endTime: '02:51', iamoDeviation: false, isFinished: true, hasPendencies: false,
    teamShift: 'B', workCenter: 'SC108HH', technicians: '', photos: [], createdAt: Date.now(), updatedAt: Date.now()
  }
];

export const storage = {
  getReports: (): Report[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEMPLATES));
        return INITIAL_TEMPLATES;
      }
      return JSON.parse(data);
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
