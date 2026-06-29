const GOV_DATA = {
  pages: {
    inicio: {
      breadcrumb: 'Início',
      title: 'Portal Gov.br',
      intro: 'Acesse serviços digitais, documentos, benefícios e agendamentos em uma experiência mais direta e organizada.',
      highlight: 'Sua CNH vence em 30 dias. Inicie a renovação sem precisar navegar por diferentes páginas.',
      sections: [
        { type: 'quick', title: 'Acesso rápido', subtitle: 'Serviços e dados mais usados pelo cidadão' },
        { type: 'recommended', title: 'Recomendado para você', subtitle: 'Alertas contextuais simulados com base em situações comuns do cidadão' },
        { type: 'process', title: 'Acompanhamento de solicitações', subtitle: 'Status claro e sem redirecionamentos desnecessários' }
      ]
    },
    login: {
      breadcrumb: 'Início / Login',
      title: 'Entrar com gov.br',
      intro: 'Acesse sua conta com CPF, passkey, biometria ou validação tradicional.',
      highlight: 'O uso de passkeys reduz dependência de senha e deixa o acesso mais direto.',
      sections: [{ type: 'login' }]
    },
    carteira: {
      breadcrumb: 'Início / Carteira Digital',
      title: 'Carteira Digital de Dados',
      intro: 'Documentos e dados públicos reunidos em uma única área, com consulta rápida e organizada.',
      highlight: 'CIN, CPF, CNH e CTPS aparecem no mesmo ambiente, sem redirecionar o cidadão.',
      sections: [{ type: 'documents' }, { type: 'family' }]
    },
    servicos: {
      breadcrumb: 'Início / Serviços',
      title: 'Serviços',
      intro: 'Serviços públicos agrupados por finalidade, mantendo menus em cascata e atalhos diretos.',
      highlight: 'Acesse serviços por área, pela busca ou pelos atalhos mais usados.',
      sections: [{ type: 'services' }]
    },
    saude: {
      breadcrumb: 'Início / Saúde',
      title: 'Saúde e SUS',
      intro: 'Consulta de vacinação, receitas digitais, tipo sanguíneo e agendamentos vinculados ao SUS.',
      highlight: 'Dados essenciais de saúde são exibidos com linguagem simples e ações diretas.',
      sections: [{ type: 'health' }]
    },
    educacao: {
      breadcrumb: 'Início / Educação',
      title: 'Educação',
      intro: 'Histórico escolar, diplomas validados, ENEM e dados de dependentes em idade escolar.',
      highlight: 'Históricos e documentos acadêmicos ficam reunidos no perfil do cidadão.',
      sections: [{ type: 'education' }]
    },
    transito: {
      breadcrumb: 'Início / Trânsito',
      title: 'Trânsito, CNH e Veículos',
      intro: 'Consulta de CNH, pontuação, veículos registrados, multas e pagamentos.',
      highlight: 'Multas e débitos aparecem com opção direta de pagamento por PIX ou código de barras.',
      sections: [{ type: 'traffic' }]
    },
    social: {
      breadcrumb: 'Início / Assistência Social',
      title: 'Assistência Social',
      intro: 'CadÚnico, CRAS, Bolsa Família, BPC e benefícios vinculados ao núcleo familiar.',
      highlight: 'A situação cadastral e os benefícios são apresentados em linguagem clara.',
      sections: [{ type: 'social' }]
    },
    agendamentos: {
      breadcrumb: 'Início / Agendamentos',
      title: 'Calendário Único',
      intro: 'Linha do tempo integrada para compromissos com órgãos públicos.',
      highlight: 'Consultas, perícias e atendimentos ficam reunidos em uma agenda única.',
      sections: [{ type: 'appointments' }]
    },
    simplificado: {
      breadcrumb: 'Início / Modo Simplificado',
      title: 'Modo de Navegação Simplificada',
      intro: 'Versão com menos elementos, textos maiores e ações diretas para inclusão digital.',
      highlight: 'Ideal para idosos ou usuários com baixa familiaridade digital.',
      sections: [{ type: 'simple' }]
    },
    seguranca: {
      breadcrumb: 'Início / Segurança',
      title: 'Segurança da Conta',
      intro: 'Autenticação por passkeys, biometria, histórico de acessos e proteção de dados.',
      highlight: 'Passkeys e biometria reduzem a dependência de senhas e deixam o acesso mais claro.',
      sections: [{ type: 'security' }]
    },
    ajuda: {
      breadcrumb: 'Início / Ajuda',
      title: 'Ajuda Contextual',
      intro: 'Suporte em linguagem simples, áudio e Libras para formulários e serviços complexos.',
      highlight: 'A ajuda contextual diminui erros e abandono de formulários.',
      sections: [{ type: 'help' }]
    },
    dependentes: {
      breadcrumb: 'Início / Dependentes',
      title: 'Núcleo Familiar e Dependentes',
      intro: 'Consulta de informações vinculadas a filhos e dependentes: vacina, escola e benefícios.',
      highlight: 'O cidadão alterna entre titular e dependentes sem sair do portal.',
      sections: [{ type: 'family' }, { type: 'health' }, { type: 'education' }]
    },
    previdencia: {
      breadcrumb: 'Início / Trabalho e Previdência',
      title: 'Trabalho e Previdência',
      intro: 'CNIS, simulação de aposentadoria, FGTS e Seguro-Desemprego em uma área centralizada.',
      highlight: 'Serviços trabalhistas e previdenciários organizados em uma navegação objetiva.',
      sections: [{ type: 'work' }]
    },
    impostos: {
      breadcrumb: 'Início / Finanças e Impostos',
      title: 'Finanças e Impostos',
      intro: 'Declaração pré-preenchida, restituição e pendências fiscais com atalhos diretos.',
      highlight: 'Prazos e ações prioritárias aparecem de forma objetiva, sem excesso de informação.',
      sections: [{ type: 'taxes' }]
    }
  },
  search: [
    { terms: ['cnh', 'multa', 'veiculo', 'veículo', 'transito', 'trânsito'], label: 'Consultar CNH, veículos e multas', page: 'transito' },
    { terms: ['vacina', 'sus', 'saude', 'saúde', 'receita'], label: 'Consultar dados de saúde e SUS', page: 'saude' },
    { terms: ['bolsa', 'familia', 'família', 'cadunico', 'cadúnico', 'cras', 'bpc'], label: 'Ver assistência social e benefícios', page: 'social' },
    { terms: ['cpf', 'cin', 'rg', 'ctps', 'documento'], label: 'Acessar carteira digital', page: 'carteira' },
    { terms: ['enem', 'escola', 'diploma', 'educacao', 'educação'], label: 'Consultar dados de educação', page: 'educacao' },
    { terms: ['agenda', 'agendamento', 'consulta', 'pericia', 'perícia'], label: 'Abrir calendário único', page: 'agendamentos' },
    { terms: ['inss', 'fgts', 'aposentadoria', 'seguro desemprego'], label: 'Acessar trabalho e previdência', page: 'previdencia' },
    { terms: ['imposto', 'irpf', 'receita', 'restituicao', 'restituição'], label: 'Ver finanças e impostos', page: 'impostos' }
  ]
};
