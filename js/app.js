const shell = document.getElementById('app-shell');

const MENU = [
  { label: 'Página inicial', page: 'inicio' },
  { label: 'Login gov.br', page: 'login' },
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
  { label: 'Acessibilidade', children: [
    { label: 'Modo simplificado', page: 'simplificado' },
    { label: 'Ajuda contextual', page: 'ajuda' },
    { label: 'Segurança', page: 'seguranca' }
  ]}
];

function currentPage() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || shell.dataset.page || 'inicio';
  return GOV_DATA.pages[page] ? page : 'inicio';
}

function navigate(page) {
  const url = page === 'inicio' ? 'index.html' : `index.html?page=${page}`;
  window.history.pushState({}, '', url);
  render(page);
}

function menuHtml(activePage) {
  return MENU.map((item) => {
    if (!item.children) {
      return `<button class="nav-link ${item.page === activePage ? 'active' : ''}" data-page="${item.page}">${item.label}</button>`;
    }
    const open = item.children.some(child => child.page === activePage) ? 'open' : '';
    return `
      <div class="nav-group ${open}">
        <button class="nav-toggle" type="button">${item.label}<span aria-hidden="true">⌄</span></button>
        <div class="nav-submenu">
          ${item.children.map(child => `<button class="nav-sublink ${child.page === activePage ? 'active' : ''}" data-page="${child.page}">${child.label}</button>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function shellHtml(activePage, page) {
  return `
    <div class="skip-link"><a href="#conteudo">Ir para o conteúdo principal</a></div>
    <header class="topbar" role="banner">
      <div class="container topbar-inner">
        <span>Portal Gov.br</span>
        <nav aria-label="Links institucionais">
          <a href="#">Acesso à informação</a>
          <a href="#">Participação social</a>
          <a href="#">Legislação</a>
          <a href="#">Órgãos do Governo</a>
        </nav>
      </div>
    </header>

    <header class="brand-header">
      <div class="container brand-inner">
        <div class="brand-left">
          <button class="menu-mobile" id="btnMenu" aria-label="Abrir menu">☰</button>
          <a class="brand" href="index.html" aria-label="Página inicial do Gov.br">
            <img src="assets/img/logo-govbr.svg" alt="gov.br" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <strong class="brand-text">gov.br</strong>
            <span>Portal de serviços</span>
          </a>
        </div>
        <div class="brand-actions">
          <button class="link-button" id="fontBtn">A+</button>
          <button class="link-button" id="contrastBtn">Alto contraste</button>
          <button class="link-button" id="themeBtn">Modo escuro</button>
          <button class="primary-pill" data-page="login">Entrar com gov.br</button>
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
              <button class="primary-button" id="btnSearch">Buscar</button>
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
        <section class="message message-info">
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
          <a href="#">Transparência</a>
          <a href="#">Privacidade</a>
          <a href="#">Acessibilidade</a>
          <a href="#">Ouvidoria</a>
        </nav>
      </div>
    </footer>

    <button class="help-button" data-page="ajuda">Ajuda</button>
  `;
}

function sectionHtml(section) {
  const templates = {
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
        ].map(([page,title,text]) => `<button class="quick-item" data-page="${page}"><strong>${title}</strong><span>${text}</span></button>`).join('')}
      </div>
    </section>`;
}

function recommendedSection() {
  return `
    <section class="panel">
      ${blockHeader('Recomendado para você', 'Ações prioritárias')}
      <div class="list">
        <article><strong>Prazo do Imposto de Renda</strong><p>Declaração pré-preenchida disponível para conferência.</p><button data-page="impostos">Acessar</button></article>
        <article><strong>Atualização do CadÚnico</strong><p>Cadastro deve ser revisado para manter benefícios ativos.</p><button data-page="social">Consultar</button></article>
        <article><strong>Consulta SUS agendada</strong><p>Compromisso disponível no calendário único.</p><button data-page="agendamentos">Ver agenda</button></article>
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
        <article><strong>Cartão de vacina</strong><p>Último registro: Influenza — 2026.</p><button>Ver histórico</button></article>
        <article><strong>Receitas digitais</strong><p>2 receitas ativas vinculadas ao CPF.</p><button>Consultar</button></article>
        <article><strong>Tipo sanguíneo</strong><p>Informação registrada: O+.</p><button>Ver dados</button></article>
      </div>
    </section>`;
}

function educationSection() {
  return `
    <section class="panel">
      ${blockHeader('Educação', 'Dados acadêmicos')}
      <div class="list three">
        <article><strong>Histórico escolar</strong><p>Registros consolidados por etapa de ensino.</p><button>Consultar</button></article>
        <article><strong>Diplomas validados</strong><p>Documentos reconhecidos em bases educacionais.</p><button>Visualizar</button></article>
        <article><strong>ENEM</strong><p>Notas nacionais disponíveis para consulta.</p><button>Acessar notas</button></article>
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
        <article><strong>Cadastro Único</strong><p>Status atualizado há 6 meses.</p><button>Consultar status</button></article>
        <article><strong>Bolsa Família</strong><p>Benefício vinculado ao núcleo familiar.</p><button>Acompanhar</button></article>
        <article><strong>CRAS mais próximo</strong><p>Horários disponíveis nesta semana.</p><button>Agendar</button></article>
      </div>
    </section>`;
}

function servicesSection() {
  return `
    <section class="panel">
      ${blockHeader('Serviços por área', 'Hub central')}
      <div class="service-tree">
        <details open><summary>Documentos</summary><button data-page="carteira">Segunda via da CIN</button><button data-page="carteira">Emitir comprovante de CPF</button></details>
        <details open><summary>Assistência Social</summary><button data-page="social">Atualizar CadÚnico</button><button data-page="social">Agendar atendimento no CRAS</button></details>
        <details><summary>Trabalho e Previdência</summary><button data-page="previdencia">Consultar CNIS</button><button data-page="previdencia">Simular aposentadoria</button></details>
        <details><summary>Finanças</summary><button data-page="impostos">Declaração pré-preenchida</button><button data-page="impostos">Consultar restituição</button></details>
      </div>
    </section>`;
}

function appointmentsSection() {
  return `
    <section class="panel">
      ${blockHeader('Calendário único', 'Agendamentos')}
      <div class="timeline">
        <article><time>02/07/2026</time><div><strong>Consulta SUS</strong><p>08:30 — Unidade Básica de Saúde</p></div><button>Reagendar</button></article>
        <article><time>05/07/2026</time><div><strong>Atendimento CRAS</strong><p>14:00 — CRAS Centro</p></div><button>Cancelar</button></article>
        <article><time>10/07/2026</time><div><strong>Perícia INSS</strong><p>10:15 — Agência INSS</p></div><button>Detalhes</button></article>
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
    <section class="panel narrow">
      ${blockHeader('Acesso seguro', 'Passkeys e biometria')}
      <form class="form-demo">
        <label>CPF<input type="text" placeholder="Digite seu CPF"></label>
        <button type="button" class="primary-button">Continuar</button>
        <button type="button">Entrar com biometria ou passkey</button>
        <p class="form-help">Use dados fictícios para testar a navegação.</p>
      </form>
    </section>`;
}

function simpleSection() {
  return `
    <section class="panel">
      ${blockHeader('Ações principais', 'Modo simplificado')}
      <div class="simple-actions">
        <button data-page="carteira">Ver meus documentos</button>
        <button data-page="transito">Ver minhas multas</button>
        <button data-page="social">Ver meus benefícios</button>
        <button data-page="agendamentos">Ver meus agendamentos</button>
        <button data-page="ajuda">Pedir ajuda</button>
      </div>
    </section>`;
}

function securitySection() {
  return `
    <section class="panel">
      ${blockHeader('Segurança', 'Conta Gov.br')}
      <div class="list three">
        <article><strong>Passkey ativa</strong><p>Biometria ou chave de acesso vinculada ao dispositivo.</p><button>Gerenciar</button></article>
        <article><strong>Histórico de acessos</strong><p>Último acesso registrado em 29/06/2026.</p><button>Ver histórico</button></article>
        <article><strong>Privacidade</strong><p>Controle de compartilhamento de dados entre serviços.</p><button>Configurar</button></article>
      </div>
    </section>`;
}

function helpSection() {
  return `
    <section class="panel">
      ${blockHeader('Ajuda contextual', 'Áudio, texto simples e Libras')}
      <div class="list three">
        <article><strong>Explicação em texto simples</strong><p>Resumo do que preencher e por que o dado é solicitado.</p><button>Ver exemplo</button></article>
        <article><strong>Áudio</strong><p>Orientação falada para pessoas com dificuldade de leitura.</p><button>Ouvir</button></article>
        <article><strong>VLibras</strong><p>Espaço reservado para suporte em Libras no protótipo.</p><button>Simular</button></article>
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
        <article><strong>Imposto de Renda</strong><p>Declaração pré-preenchida disponível.</p><button>Acessar</button></article>
        <article><strong>Restituição</strong><p>Consulta de lote e situação do pagamento.</p><button>Consultar</button></article>
        <article><strong>Débitos</strong><p>Pagamento por PIX ou código de barras.</p><button>Ver pendências</button></article>
      </div>
    </section>`;
}

function tableHtml(headers, rows) {
  return `
    <div class="table" role="table">
      <div class="table-row table-head">${headers.map(h => `<span>${h}</span>`).join('')}</div>
      ${rows.map(row => `<div class="table-row">${row.map((cell,i) => i === row.length - 1 ? `<span><button>${cell}</button></span>` : `<span>${cell}</span>`).join('')}</div>`).join('')}
    </div>`;
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btnMenu = document.getElementById('btnMenu');
  sidebar?.classList.remove('active');
  btnMenu?.setAttribute('aria-expanded', 'false');
}

function handleDocumentClick(event) {
  const suggestionsBox = document.getElementById('suggestions');
  const sidebar = document.getElementById('sidebar');
  const btnMenu = document.getElementById('btnMenu');

  if (!event.target.closest('.search-card')) suggestionsBox?.classList.remove('active');
  if (sidebar?.classList.contains('active') && !event.target.closest('#sidebar') && !event.target.closest('#btnMenu')) {
    closeSidebar();
  }
}

function handleEscape(event) {
  if (event.key !== 'Escape') return;
  document.getElementById('suggestions')?.classList.remove('active');
  closeSidebar();
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      navigate(el.dataset.page);
      closeSidebar();
    });
  });

  document.querySelectorAll('.nav-toggle').forEach(toggle => {
    const group = toggle.closest('.nav-group');
    toggle.setAttribute('aria-expanded', group?.classList.contains('open') ? 'true' : 'false');
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      group?.classList.toggle('open');
      toggle.setAttribute('aria-expanded', group?.classList.contains('open') ? 'true' : 'false');
    });
  });

  const btnMenu = document.getElementById('btnMenu');
  const sidebar = document.getElementById('sidebar');
  btnMenu?.setAttribute('aria-expanded', 'false');
  btnMenu?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const open = !sidebar.classList.contains('active');
    sidebar.classList.toggle('active', open);
    btnMenu.setAttribute('aria-expanded', open ? 'true' : 'false');
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

  document.removeEventListener('click', handleDocumentClick);
  document.addEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleEscape);
  document.addEventListener('keydown', handleEscape);

  if (typeof initAccessibility === 'function') initAccessibility();
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
  const page = GOV_DATA.pages[pageName];
  shell.dataset.page = pageName;
  document.body.classList.toggle('simple-page', pageName === 'simplificado');
  document.title = `${page.title} - Gov.br Reformulado`;
  shell.innerHTML = shellHtml(pageName, page);
  bindEvents();
}

window.addEventListener('popstate', () => render(currentPage()));
render(currentPage());
