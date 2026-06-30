const shell = document.getElementById('app-shell');
const AUTH_KEY = 'govbr-prototipo-authenticated';
let carouselIndex = 0;
let authMemory = false;

const MENU = [
  { label: 'Página inicial', page: 'inicio' },
  { label: 'Carteira Digital', children: [
    { label: 'Documentos pessoais', page: 'carteira' },
    { label: 'Dependentes', page: 'dependentes' },
    { label: 'Saúde', page: 'saude' },
    { label: 'Educação', page: 'educacao' },
    { label: 'Trânsito', page: 'transito' }
  ]},
  { label: 'Serviços ao cidadão', children: [
    { label: 'Hub de serviços', page: 'servicos' },
    { label: 'Assistência Social', page: 'social' },
    { label: 'Trabalho e Previdência', page: 'previdencia' },
    { label: 'Finanças e Impostos', page: 'impostos' }
  ]},
  { label: 'Agendamentos', children: [
    { label: 'Calendário único', page: 'agendamentos' },
    { label: 'Consultas SUS', page: 'saude' },
    { label: 'Atendimento CRAS', page: 'social' },
    { label: 'Perícia INSS', page: 'previdencia' }
  ]},
  { label: 'Segurança da conta', page: 'seguranca' },
  { label: 'Modo simplificado', page: 'simplificado' }
];

const DOCUMENTS = [
  { id: 'cin', short: 'CIN', title: 'Carteira de Identidade Nacional', text: 'Documento de identificacao com CPF integrado.', action: 'Visualizar CIN', issuer: 'Ministerio da Justica', status: 'Disponivel', updated: '15/06/2026', fields: [['CPF', '***.456.***-00'], ['Nascimento', '12/04/1999'], ['Validade', 'Indeterminada']] },
  { id: 'cnh', short: 'CNH', title: 'Carteira Nacional de Habilitacao', text: 'Validade, pontuacao, veiculos e renovacao.', action: 'Consultar CNH', issuer: 'Senatran', status: 'Ativa', updated: '08/06/2026', fields: [['Categoria', 'B'], ['Pontos', '0'], ['Validade', '22/07/2027']] },
  { id: 'cpf', short: 'CPF', title: 'Cadastro de Pessoa Fisica', text: 'Situacao cadastral e comprovante de inscricao.', action: 'Emitir CPF', issuer: 'Receita Federal', status: 'Regular', updated: '10/06/2026', fields: [['Inscricao', '***.456.***-00'], ['Situacao', 'Regular'], ['Emitido em', '10/06/2026']] },
  { id: 'ctps', short: 'CTPS', title: 'Carteira de Trabalho Digital', text: 'Vinculos, contratos e dados trabalhistas.', action: 'Abrir CTPS', issuer: 'Ministerio do Trabalho', status: 'Atualizada', updated: '19/06/2026', fields: [['Vinculos ativos', '1'], ['Ultimo contrato', '2024'], ['Beneficios', 'Nenhum pendente']] },
  { id: 'sus', short: 'SUS', title: 'Cartao Nacional de Saude', text: 'Vacinas, receitas e atendimentos vinculados.', action: 'Ver cartao SUS', issuer: 'Ministerio da Saude', status: 'Ativo', updated: '21/06/2026', fields: [['CNS', '898 **** **** 0012'], ['Vacinas', 'Em dia'], ['Proxima consulta', '03/07/2026']] }
];

function isAuthenticated() {
  try {
    return authMemory || sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch (error) {
    return authMemory;
  }
}

function setAuthenticated(value) {
  authMemory = Boolean(value);
  try {
    sessionStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    // Mantém o fluxo funcionando mesmo quando o navegador bloqueia armazenamento local.
  }
}

function currentPage() {
  const params = new URLSearchParams(window.location.search);
  const requestedPage = params.get('page') || shell.dataset.page || 'inicio';
  if (!isAuthenticated()) return 'login';
  if (requestedPage === 'login') return 'inicio';
  return GOV_DATA.pages[requestedPage] ? requestedPage : 'inicio';
}

function currentDocument() {
  const params = new URLSearchParams(window.location.search);
  const docId = params.get('doc') || 'cin';
  return DOCUMENTS.find(doc => doc.id === docId) || DOCUMENTS[0];
}
function navigate(page, options = {}) {
  const target = !isAuthenticated() && page !== 'login' ? 'login' : page;
  const query = new URLSearchParams();
  if (target !== 'inicio') query.set('page', target);
  if (options.doc) query.set('doc', options.doc);
  const url = query.toString() ? `index.html?${query.toString()}` : 'index.html';
  window.history.pushState({}, '', url);
  render(target);
}

function login() {
  setAuthenticated(true);
  navigate('inicio');
}

function logout() {
  setAuthenticated(false);
  window.history.pushState({}, '', 'index.html');
  render('login');
}

function menuHtml(activePage) {
  return MENU.map((item) => {
    if (!item.children) {
      return `<button class="nav-link ${item.page === activePage ? 'active' : ''}" type="button" data-page="${item.page}">${item.label}</button>`;
    }
    const open = item.children.some(child => child.page === activePage) ? 'open' : '';
    return `
      <div class="nav-group ${open}">
        <button class="nav-toggle" type="button">${item.label}<span aria-hidden="true">⌄</span></button>
        <div class="nav-submenu">
          ${item.children.map(child => `<button class="nav-sublink ${child.page === activePage ? 'active' : ''}" type="button" data-page="${child.page}">${child.label}</button>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function loginShellHtml(page) {
  return `
    <div class="skip-link"><a href="#conteudo">Ir para o conteúdo principal</a></div>
    <main class="login-screen" id="conteudo" tabindex="-1">
      <section class="login-brand-panel" aria-label="Apresentação Gov.br">
        <a class="brand login-brand" href="index.html" aria-label="Página inicial do Gov.br">
          <img src="assets/img/logo-govbr.png" alt="gov.br" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
          <strong class="brand-text">gov.br</strong>
        </a>
        <h1>${page.title}</h1>
        <p>${page.intro}</p>
        <div class="login-benefits">
          <span>Documentos digitais</span>
          <span>Serviços públicos</span>
          <span>Agendamentos integrados</span>
        </div>
      </section>
      <section class="login-card" aria-label="Formulário de login">
        ${loginSection()}
      </section>
    </main>
  `;
}

function bottomNavHtml(activePage) {
  const tabs = [
    { page: 'inicio', icon: 'home', label: 'Inicio' },
    { page: 'saude', icon: 'medical_services', label: 'Saude' },
    { page: 'educacao', icon: 'school', label: 'Educacao' },
    { page: 'social', icon: 'group', label: 'Social' }
  ];

  return `<nav class="bottom-nav" aria-label="Navegacao principal">
    ${tabs.map(tab => `<button type="button" class="${tab.page === activePage ? 'active' : ''}" data-page="${tab.page}"><span class="material-symbols-outlined">${tab.icon}</span>${tab.label}</button>`).join('')}
  </nav>`;
}
function shellHtml(activePage, page) {
  return `
    <div class="skip-link"><a href="#conteudo">Ir para o conteúdo principal</a></div>
    <header class="topbar" role="banner">
      <div class="container topbar-inner">
        <span>Portal Gov.br</span>
        <nav aria-label="Links institucionais">
          <a href="#" data-action="Abrir Acesso à informação">Acesso à informação</a>
          <a href="#" data-action="Abrir Participação social">Participação social</a>
          <a href="#" data-action="Abrir Legislação">Legislação</a>
          <a href="#" data-action="Abrir Órgãos do Governo">Órgãos do Governo</a>
        </nav>
      </div>
    </header>

    <header class="brand-header">
      <div class="container brand-inner">
        <div class="brand-left">
          <a class="brand" href="index.html" aria-label="Página inicial do Gov.br" data-page="inicio">
            <img src="assets/img/logo-govbr.png" alt="gov.br" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <strong class="brand-text">gov.br</strong>
            <span>Portal de serviços</span>
          </a>
        </div>
        <div class="brand-actions">
          <button class="link-button" id="fontBtn" type="button">A+</button>
          <button class="link-button" id="contrastBtn" type="button">Alto contraste</button>
          <button class="link-button" id="themeBtn" type="button">Modo escuro</button>
          <button class="link-button" type="button" data-page="ajuda">Ajuda</button>
          <button class="primary-pill" id="logoutBtn" type="button">Sair</button>
        </div>
      </div>
    </header>

    <section class="hero-search">
      <div class="container">
        <p class="breadcrumb">${page.breadcrumb}</p>
        <div class="hero-grid">
          <div class="hero-copy">
            <h1>${page.title}</h1>
            <p>${page.intro}</p>
          </div>
          <div class="search-card">
            <label for="smartSearch">Buscar serviço ou informação</label>
            <div class="search-row">
              <input id="smartSearch" type="search" placeholder="Ex.: CNH, vacina, Bolsa Família, INSS" autocomplete="off">
              <button class="primary-button" id="btnSearch" type="button">Buscar</button>
            </div>
            <div class="suggestions" id="suggestions"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="container page-layout">
      <aside class="sidebar" id="sidebar" aria-label="Menu lateral">
        <div class="sidebar-title">
          <strong>Menu</strong>
          <span>Serviços digitais</span>
        </div>
        <nav>${menuHtml(activePage)}</nav>
      </aside>
      <main class="main" id="conteudo" tabindex="-1">
        <section class="message message-info" id="statusMessage" aria-live="polite">
          <strong>Recomendação</strong>
          <p>${page.highlight}</p>
        </section>
        ${page.sections.map(section => sectionHtml(section)).join('')}
      </main>
    </div>

    <footer class="site-footer">
      <div class="container footer-inner">
        <strong>Gov.br</strong>
        <nav aria-label="Links de rodapé">
          <a href="#" data-action="Abrir transparência">Transparência</a>
          <a href="#" data-action="Abrir privacidade">Privacidade</a>
          <a href="#" data-action="Abrir acessibilidade">Acessibilidade</a>
          <a href="#" data-action="Abrir ouvidoria">Ouvidoria</a>
        </nav>
      </div>
    </footer>

    ${bottomNavHtml(activePage)}
  `;
}

function sectionHtml(section) {
  const templates = {
    documentCarousel: documentCarouselSection,
    documentDetail: documentDetailSection,
    quick: quickSection,
    recommended: recommendedSection,
    process: processSection,
    login: loginSection,
    documents: documentsSection,
    family: familySection,
    services: servicesSection,
    health: healthSection,
    education: educationSection,
    traffic: trafficSection,
    social: socialSection,
    appointments: appointmentsSection,
    simple: simpleSection,
    security: securitySection,
    help: helpSection,
    work: workSection,
    taxes: taxesSection
  };
  return templates[section.type] ? templates[section.type](section) : '';
}

function blockHeader(title, subtitle) {
  return `<div class="section-header"><div><span>${subtitle || 'Serviços digitais'}</span><h2>${title}</h2></div></div>`;
}

function documentCarouselSection() {
  return `
    <section class="document-section" aria-label="Carteira Digital">
      <div class="section-title-row">
        <h2>Carteira Digital</h2>
        <button type="button" data-page="carteira">Ver todos</button>
      </div>
      <div class="document-carousel" id="documentCarousel">
        ${DOCUMENTS.map((doc, index) => `
          <article class="document-slide ${index === 0 ? 'active' : ''} document-${doc.short.toLowerCase()}" data-slide="${index}" data-page="documento" data-doc="${doc.id}" tabindex="0">
            <div class="document-card-top">
              <span>República Federativa do Brasil</span>
              <strong>${doc.short}</strong>
            </div>
            <div class="document-card-body">
              <h3>${doc.title}</h3>
              <p>${doc.text}</p>
            </div>
            <button type="button" data-page="documento" data-doc="${doc.id}">${doc.action}</button>
          </article>
        `).join('')}
      </div>
      <div class="carousel-controls civic-carousel-controls" aria-label="Controles do carrossel">
        <button type="button" class="icon-button" id="carouselPrev" aria-label="Documento anterior">‹</button>
        <div class="carousel-dots" aria-label="Indicadores do carrossel">
          ${DOCUMENTS.map((doc, index) => `<button type="button" class="carousel-dot ${index === 0 ? 'active' : ''}" data-carousel-index="${index}" aria-label="Mostrar ${doc.short}"></button>`).join('')}
        </div>
        <button type="button" class="icon-button" id="carouselNext" aria-label="Próximo documento">›</button>
      </div>
    </section>`;
}

function documentDetailSection() {
  const doc = currentDocument();
  return `
    <section class="document-detail-layout" aria-label="Documento digital selecionado">
      <article class="document-preview-card document-${doc.short.toLowerCase()}">
        <div class="document-card-top">
          <span>Republica Federativa do Brasil</span>
          <strong>${doc.short}</strong>
        </div>
        <div class="document-card-body">
          <h2>${doc.title}</h2>
          <p>${doc.text}</p>
        </div>
        <div class="document-fields">
          <div><span>Orgao emissor</span><strong>${doc.issuer}</strong></div>
          <div><span>Status</span><strong>${doc.status}</strong></div>
          <div><span>Atualizado em</span><strong>${doc.updated}</strong></div>
          ${doc.fields.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('')}
        </div>
      </article>
      <section class="panel document-import-panel">
        <div class="section-header"><div><span>Carteira Digital</span><h2>Importar documento</h2></div></div>
        <p>Atualize a visualizacao deste documento anexando um arquivo do seu computador.</p>
        <label class="file-import-control" for="documentImport">
          <span class="material-symbols-outlined" aria-hidden="true">upload_file</span>
          Selecionar arquivo
          <input id="documentImport" type="file" accept=".pdf,.png,.jpg,.jpeg">
        </label>
        <p class="import-status" id="importStatus">Formatos aceitos: PDF, PNG ou JPG. A importacao e simulada neste prototipo.</p>
        <button type="button" data-page="carteira">Voltar para carteira</button>
      </section>
    </section>`;
}
function quickSection() {
  return `
    <section class="panel">
      ${blockHeader('Acesso rápido', 'Visão geral')}
      <div class="quick-list">
        ${[
          ['carteira','Meus documentos','CIN, CPF, CNH e CTPS reunidos.'],
          ['saude','Saúde','Vacinas, receitas digitais e dados do SUS.'],
          ['transito','Trânsito','CNH, pontos, veículos e multas.'],
          ['social','Benefícios sociais','CadÚnico, CRAS, Bolsa Família e BPC.'],
          ['agendamentos','Agendamentos','Consultas, perícias e atendimentos.'],
          ['previdencia','Trabalho e Previdência','CNIS, FGTS, INSS e Seguro-Desemprego.']
        ].map(([page,title,text]) => `<button class="quick-item" type="button" data-page="${page}"><strong>${title}</strong><span>${text}</span></button>`).join('')}
      </div>
    </section>`;
}

function recommendedSection() {
  return `
    <section class="panel">
      ${blockHeader('Recomendado para você', 'Ações prioritárias')}
      <div class="list">
        <article><strong>Prazo do Imposto de Renda</strong><p>Declaração pré-preenchida disponível para conferência.</p><button type="button" data-page="impostos">Acessar</button></article>
        <article><strong>Atualização do CadÚnico</strong><p>Cadastro deve ser revisado para manter benefícios ativos.</p><button type="button" data-page="social">Consultar</button></article>
        <article><strong>Consulta SUS agendada</strong><p>Compromisso disponível no calendário único.</p><button type="button" data-page="agendamentos">Ver agenda</button></article>
      </div>
    </section>`;
}

function documentsSection() {
  return `
    <section class="panel">
      ${blockHeader('Documentos pessoais', 'Carteira digital')}
      ${tableHtml(['Documento','Situação','Atualização','Ação'], [
        ['Carteira de Identidade Nacional','Disponível','15/06/2026','Visualizar'],
        ['CPF','Regular','10/06/2026','Emitir comprovante'],
        ['CNH','Vence em 30 dias','20/06/2026','Renovar'],
        ['Carteira de Trabalho Digital','Ativa','01/06/2026','Consultar']
      ])}
    </section>`;
}

function healthSection() {
  return `
    <section class="panel">
      ${blockHeader('Saúde', 'SUS integrado')}
      <div class="list three">
        <article><strong>Cartão de vacina</strong><p>Último registro: Influenza - 2026.</p><button type="button" data-action="Ver histórico de vacinação">Ver histórico</button></article>
        <article><strong>Receitas digitais</strong><p>2 receitas ativas vinculadas ao CPF.</p><button type="button" data-action="Consultar receitas digitais">Consultar</button></article>
        <article><strong>Tipo sanguíneo</strong><p>Informação registrada: O+.</p><button type="button" data-action="Ver dados de saúde">Ver dados</button></article>
      </div>
    </section>`;
}

function educationSection() {
  return `
    <section class="panel">
      ${blockHeader('Educação', 'Dados acadêmicos')}
      <div class="list three">
        <article><strong>Histórico escolar</strong><p>Registros consolidados por etapa de ensino.</p><button type="button" data-action="Consultar histórico escolar">Consultar</button></article>
        <article><strong>Diplomas validados</strong><p>Documentos reconhecidos em bases educacionais.</p><button type="button" data-action="Visualizar diplomas">Visualizar</button></article>
        <article><strong>ENEM</strong><p>Notas nacionais disponíveis para consulta.</p><button type="button" data-action="Acessar notas do ENEM">Acessar notas</button></article>
      </div>
    </section>`;
}

function trafficSection() {
  return `
    <section class="panel">
      ${blockHeader('Trânsito', 'CNH, veículos e débitos')}
      ${tableHtml(['Item','Situação','Detalhe','Ação'], [
        ['CNH','Atenção','Vence em 30 dias','Renovar'],
        ['Pontuação','Regular','4 pontos ativos','Detalhes'],
        ['Veículos','Registrado','1 veículo vinculado','Consultar'],
        ['Multas','Pendência','1 multa em aberto','Pagar']
      ])}
    </section>`;
}

function socialSection() {
  return `
    <section class="panel">
      ${blockHeader('Assistência Social', 'CRAS e benefícios')}
      <div class="list three">
        <article><strong>Cadastro Único</strong><p>Status atualizado há 6 meses.</p><button type="button" data-action="Consultar CadÚnico">Consultar status</button></article>
        <article><strong>Bolsa Família</strong><p>Benefício vinculado ao núcleo familiar.</p><button type="button" data-action="Acompanhar Bolsa Família">Acompanhar</button></article>
        <article><strong>CRAS mais próximo</strong><p>Horários disponíveis nesta semana.</p><button type="button" data-page="agendamentos">Agendar</button></article>
      </div>
    </section>`;
}

function servicesSection() {
  return `
    <section class="panel">
      ${blockHeader('Serviços por área', 'Hub central')}
      <div class="service-tree">
        <details open><summary>Documentos</summary><button type="button" data-page="carteira">Segunda via da CIN</button><button type="button" data-page="carteira">Emitir comprovante de CPF</button></details>
        <details open><summary>Assistência Social</summary><button type="button" data-page="social">Atualizar CadÚnico</button><button type="button" data-page="social">Agendar atendimento no CRAS</button></details>
        <details><summary>Trabalho e Previdência</summary><button type="button" data-page="previdencia">Consultar CNIS</button><button type="button" data-page="previdencia">Simular aposentadoria</button></details>
        <details><summary>Finanças</summary><button type="button" data-page="impostos">Declaração pré-preenchida</button><button type="button" data-page="impostos">Consultar restituição</button></details>
      </div>
    </section>`;
}

function appointmentsSection() {
  return `
    <section class="panel">
      ${blockHeader('Calendário único', 'Agendamentos')}
      <div class="timeline">
        <article><time>02/07/2026</time><div><strong>Consulta SUS</strong><p>08:30 - Unidade Básica de Saúde</p></div><button type="button" data-action="Reagendar consulta SUS">Reagendar</button></article>
        <article><time>05/07/2026</time><div><strong>Atendimento CRAS</strong><p>14:00 - CRAS Centro</p></div><button type="button" data-action="Cancelar atendimento CRAS">Cancelar</button></article>
        <article><time>10/07/2026</time><div><strong>Perícia INSS</strong><p>10:15 - Agência INSS</p></div><button type="button" data-action="Ver detalhes da perícia INSS">Detalhes</button></article>
      </div>
    </section>`;
}

function processSection() {
  return `
    <section class="panel">
      ${blockHeader('Segunda via da CIN', 'Acompanhamento')}
      <div class="progress"><span class="done">Solicitado</span><span class="done">Em análise</span><span class="active">Aprovado</span><span>Pronto para retirada</span></div>
    </section>`;
}

function familySection() {
  return `
    <section class="panel">
      ${blockHeader('Núcleo familiar', 'Dependentes')}
      ${tableHtml(['Pessoa','Vínculo','Informações disponíveis','Ação'], [
        ['Titular','Responsável','Documentos, saúde, trânsito e benefícios','Ver perfil'],
        ['Dependente 1','Filho(a)','Vacinação, escola e benefícios familiares','Alternar'],
        ['Dependente 2','Filho(a)','Vacinação e histórico escolar','Alternar']
      ])}
    </section>`;
}

function loginSection() {
  return `
    <section class="panel narrow login-form-panel">
      ${blockHeader('Acesso seguro', 'Passkeys e biometria')}
      <form class="form-demo" id="loginForm">
        <label>CPF<input id="cpfInput" type="text" inputmode="numeric" placeholder="Digite seu CPF" autocomplete="off"></label>
        <button type="button" class="primary-button" data-login-method="cpf">Continuar</button>
        <button type="button" data-login-method="passkey">Entrar com biometria ou passkey</button>
        <p class="form-help">Use qualquer CPF fictício para testar a navegação.</p>
      </form>
    </section>`;
}

function simpleSection() {
  return `
    <section class="panel">
      ${blockHeader('Ações principais', 'Modo simplificado')}
      <div class="simple-actions">
        <button type="button" data-page="carteira">Ver meus documentos</button>
        <button type="button" data-page="transito">Ver minhas multas</button>
        <button type="button" data-page="social">Ver meus benefícios</button>
        <button type="button" data-page="agendamentos">Ver meus agendamentos</button>
        <button type="button" data-page="ajuda">Pedir ajuda</button>
      </div>
    </section>`;
}

function securitySection() {
  return `
    <section class="panel">
      ${blockHeader('Segurança', 'Conta Gov.br')}
      <div class="list three">
        <article><strong>Passkey ativa</strong><p>Biometria ou chave de acesso vinculada ao dispositivo.</p><button type="button" data-action="Gerenciar passkey">Gerenciar</button></article>
        <article><strong>Histórico de acessos</strong><p>Último acesso registrado em 29/06/2026.</p><button type="button" data-action="Ver histórico de acessos">Ver histórico</button></article>
        <article><strong>Privacidade</strong><p>Controle de compartilhamento de dados entre serviços.</p><button type="button" data-action="Configurar privacidade">Configurar</button></article>
      </div>
    </section>`;
}

function helpSection() {
  return `
    <section class="panel">
      ${blockHeader('Ajuda contextual', 'Áudio, texto simples e Libras')}
      <div class="list three">
        <article><strong>Explicação em texto simples</strong><p>Resumo do que preencher e por que o dado é solicitado.</p><button type="button" data-action="Ver exemplo de ajuda contextual">Ver exemplo</button></article>
        <article><strong>Áudio</strong><p>Orientação falada para pessoas com dificuldade de leitura.</p><button type="button" data-action="Ouvir orientação em áudio">Ouvir</button></article>
        <article><strong>VLibras</strong><p>Espaço reservado para suporte em Libras no protótipo.</p><button type="button" data-action="Simular VLibras">Simular</button></article>
      </div>
    </section>`;
}

function workSection() {
  return `
    <section class="panel">
      ${blockHeader('Trabalho e Previdência', 'INSS, FGTS e Seguro-Desemprego')}
      ${tableHtml(['Serviço','Resumo','Situação','Ação'], [
        ['CNIS','Extrato de contribuição','Disponível','Consultar'],
        ['Aposentadoria','Simulação de tempo','Elegível para simular','Simular'],
        ['FGTS','Saldo e extrato','Atualizado','Ver saldo'],
        ['Seguro-Desemprego','Solicitação digital','Não solicitado','Solicitar']
      ])}
    </section>`;
}

function taxesSection() {
  return `
    <section class="panel">
      ${blockHeader('Finanças e Impostos', 'Receita e pagamentos')}
      <div class="list three">
        <article><strong>Imposto de Renda</strong><p>Declaração pré-preenchida disponível.</p><button type="button" data-action="Acessar Imposto de Renda">Acessar</button></article>
        <article><strong>Restituição</strong><p>Consulta de lote e situação do pagamento.</p><button type="button" data-action="Consultar restituição">Consultar</button></article>
        <article><strong>Débitos</strong><p>Pagamento por PIX ou código de barras.</p><button type="button" data-action="Ver pendências fiscais">Ver pendências</button></article>
      </div>
    </section>`;
}

function tableHtml(headers, rows) {
  return `
    <div class="table" role="table">
      <div class="table-row table-head">${headers.map(h => `<span>${h}</span>`).join('')}</div>
      ${rows.map(row => `<div class="table-row">${row.map((cell,i) => i === row.length - 1 ? `<span><button type="button" data-action="${cell}">${cell}</button></span>` : `<span>${cell}</span>`).join('')}</div>`).join('')}
    </div>`;
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.remove('active');
}

function showStatus(title, text) {
  const message = document.getElementById('statusMessage');
  if (!message) return;
  message.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  message.classList.add('message-success');
}

function handleDocumentClick(event) {
  const suggestionsBox = document.getElementById('suggestions');
  const sidebar = document.getElementById('sidebar');

  if (!event.target.closest('.search-card')) suggestionsBox?.classList.remove('active');
  if (sidebar?.classList.contains('active') && !event.target.closest('#sidebar')) {
    closeSidebar();
  }
}

function handleEscape(event) {
  if (event.key !== 'Escape') return;
  document.getElementById('suggestions')?.classList.remove('active');
  closeSidebar();
}

function handlePrototypeAction(event) {
  const actionEl = event.target.closest?.('[data-action]');
  if (!actionEl) return;
  event.preventDefault();
  const action = actionEl.dataset.action || actionEl.textContent.trim();
  showStatus('Ação simulada', action + ' foi acionado no protótipo.');
}

function bindEvents() {
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    login();
  });
  document.querySelectorAll('[data-login-method]').forEach(button => {
    button.addEventListener('click', login);
  });

  document.getElementById('logoutBtn')?.addEventListener('click', logout);

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigate(el.dataset.page, { doc: el.dataset.doc });
      closeSidebar();
    });
  });

  document.removeEventListener('click', handlePrototypeAction);
  document.addEventListener('click', handlePrototypeAction);

  document.querySelectorAll('.nav-toggle').forEach(toggle => {
    const group = toggle.closest('.nav-group');
    toggle.setAttribute('aria-expanded', group?.classList.contains('open') ? 'true' : 'false');
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      group?.classList.toggle('open');
      toggle.setAttribute('aria-expanded', group?.classList.contains('open') ? 'true' : 'false');
    });
  });

  const input = document.getElementById('smartSearch');
  const suggestionsBox = document.getElementById('suggestions');
  const btnSearch = document.getElementById('btnSearch');
  input?.addEventListener('input', () => renderSuggestions(input, suggestionsBox));
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch(input);
    }
  });
  btnSearch?.addEventListener('click', () => submitSearch(input));

  const documentImport = document.getElementById('documentImport');
  documentImport?.addEventListener('change', () => {
    const file = documentImport.files?.[0];
    const status = document.getElementById('importStatus');
    const message = file
      ? `Arquivo ${file.name} importado para ${currentDocument().short}.`
      : 'Nenhum arquivo selecionado.';
    if (status) status.textContent = message;
    showStatus('Documento importado', message);
  });

  bindCarousel();

  document.removeEventListener('click', handleDocumentClick);
  document.addEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleEscape);
  document.addEventListener('keydown', handleEscape);

  if (typeof initAccessibility === 'function') initAccessibility();
}

function bindCarousel() {
  const carousel = document.getElementById('documentCarousel');
  if (!carousel) return;
  document.getElementById('carouselPrev')?.addEventListener('click', () => moveCarousel(-1));
  document.getElementById('carouselNext')?.addEventListener('click', () => moveCarousel(1));
  document.querySelectorAll('[data-carousel-index]').forEach(dot => {
    dot.addEventListener('click', () => updateCarousel(Number(dot.dataset.carouselIndex), true));
  });
  updateCarousel(carouselIndex, false);
}

function moveCarousel(direction) {
  updateCarousel(carouselIndex + direction, true);
}

function updateCarousel(index, shouldScroll) {
  const carousel = document.getElementById('documentCarousel');
  const slides = Array.from(document.querySelectorAll('.document-slide'));
  if (!slides.length) return;
  carouselIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === carouselIndex));
  document.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === carouselIndex));
  if (shouldScroll && carousel) {
    carousel.scrollTo({ left: slides[carouselIndex].offsetLeft, behavior: 'smooth' });
  }
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function findSearchMatches(value) {
  const normalizedValue = normalizeText(value);
  if (normalizedValue.length < 2) return [];

  return GOV_DATA.search.filter(item => item.terms.some(term => {
    const normalizedTerm = normalizeText(term);
    if (normalizedTerm === normalizedValue) return true;
    if (normalizedTerm.startsWith(normalizedValue)) return true;
    if (normalizedValue.length >= 4 && normalizedTerm.includes(normalizedValue)) return true;
    return normalizedTerm.length >= 4 && normalizedValue.includes(normalizedTerm);
  }));
}

function submitSearch(input) {
  const matches = findSearchMatches(input?.value);
  const target = matches[0]?.page || 'servicos';
  navigate(target);
}

function renderSuggestions(input, box) {
  const matches = findSearchMatches(input.value).slice(0, 5);
  box.innerHTML = '';
  if (!input.value.trim()) return box.classList.remove('active');

  const items = matches.length ? matches : [{ label: 'Ver todos os serviços', page: 'servicos' }];
  items.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.label;
    button.addEventListener('click', () => {
      box.classList.remove('active');
      navigate(item.page);
    });
    box.appendChild(button);
  });
  box.classList.add('active');
}

function render(pageName = currentPage()) {
  const page = GOV_DATA.pages[pageName] || GOV_DATA.pages.login;
  shell.dataset.page = pageName;
  document.body.classList.toggle('login-page', pageName === 'login');
  document.body.classList.toggle('simple-page', pageName === 'simplificado');
  document.title = `${page.title} - Gov.br Reformulado`;
  shell.innerHTML = pageName === 'login' ? loginShellHtml(page) : shellHtml(pageName, page);
  bindEvents();
}

window.addEventListener('popstate', () => render(currentPage()));
render(currentPage());
