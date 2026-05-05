import { useMemo, useState } from "react";

const HELP_SECTIONS = [
  {
    id: "visao-geral",
    title: "Visão geral",
    content: [
      "O PontoFlex é um aplicativo para controle de jornada pessoal com funcionamento offline.",
      "Seus dados ficam salvos no próprio dispositivo usando IndexedDB.",
      "Você pode lançar horários manualmente, editar dias passados e acompanhar saldo diário e mensal."
    ]
  },
  {
    id: "registro",
    title: "Como registrar horários",
    content: [
      "Na aba Início, adicione os horários do dia (ex.: 08:00, 12:00, 13:00, 18:00).",
      "O app faz o pareamento automático de entrada e saída por ordem de horário.",
      "Você pode editar ou excluir horários a qualquer momento para corrigir esquecimentos."
    ]
  },
  {
    id: "relatorio",
    title: "Relatório mensal",
    content: [
      "Na aba Relatório, você vê trabalhado, esperado, falta, hora extra e saldo total do mês.",
      "Use os filtros para incluir ou ocultar fins de semana, feriados e dias sem marcação.",
      "É possível exportar o relatório em CSV para análise externa."
    ]
  },
  {
    id: "configuracoes",
    title: "Configurações",
    content: [
      "Defina quantas horas quer trabalhar em cada dia da semana.",
      "Os feriados podem ser sincronizados automaticamente por ano e também cadastrados manualmente.",
      "Use as preferências de idioma, aparência e notificações para personalizar o app."
    ]
  },
  {
    id: "privacidade",
    title: "Privacidade e dados",
    content: [
      "Os dados não são enviados para servidor externo por padrão.",
      "Tudo fica local no navegador/dispositivo.",
      "Para evitar perda de dados, exporte regularmente seu relatório mensal em CSV."
    ]
  }
];

const FAQ_ITEMS = [
  {
    q: "Por que meu saldo ficou negativo?",
    a: "Saldo negativo significa que as horas trabalhadas ficaram abaixo das horas esperadas para os dias configurados."
  },
  {
    q: "Posso usar sem internet?",
    a: "Sim. Após o primeiro carregamento online, o app funciona offline e continua salvando dados localmente."
  },
  {
    q: "Esqueci de lançar horários, como corrigir?",
    a: "Abra o relatório, selecione o dia e edite os horários diretamente no detalhe do dia."
  },
  {
    q: "Quando vira o ano, os feriados somem?",
    a: "Não. O app mantém cache por ano e sincroniza automaticamente o ano atual quando necessário."
  },
  {
    q: "Não consigo sincronizar feriados, e agora?",
    a: "Você pode continuar usando normalmente e cadastrar feriados manualmente na aba Configurações."
  }
];

const TROUBLESHOOTING = [
  {
    title: "App não abre offline",
    steps: [
      "Abra o app uma vez com internet para atualizar cache e service worker.",
      "Feche e reabra pelo atalho instalado ou navegador.",
      "Se necessário, limpe cache do site e recarregue online."
    ]
  },
  {
    title: "Horários não salvam",
    steps: [
      "Verifique se há horários duplicados no mesmo dia.",
      "Confirme se o horário está no formato válido (HH:mm).",
      "Tente remover o último horário e adicionar novamente."
    ]
  },
  {
    title: "Dados não aparecem no relatório",
    steps: [
      "Confira se está no mês correto.",
      "Desative filtros que possam ocultar dias sem marcação.",
      "Selecione o dia diretamente no campo de data para revisar lançamentos."
    ]
  }
];

function HelpPage() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return HELP_SECTIONS;
    return HELP_SECTIONS.filter((section) => {
      const inTitle = section.title.toLowerCase().includes(normalizedQuery);
      const inContent = section.content.some((line) => line.toLowerCase().includes(normalizedQuery));
      return inTitle || inContent;
    });
  }, [normalizedQuery]);

  const filteredFaq = useMemo(() => {
    if (!normalizedQuery) return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) =>
      item.q.toLowerCase().includes(normalizedQuery) || item.a.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  return (
    <section className="page">
      <section className="card help-hero">
        <h2>Central de ajuda</h2>
        <p>Encontre respostas rápidas, guias e soluções para dúvidas do uso diário do PontoFlex.</p>
        <input
          type="search"
          placeholder="Buscar na ajuda"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar na ajuda"
        />
      </section>

      {filteredSections.map((section) => (
        <details key={section.id} className="card help-item" open>
          <summary>{section.title}</summary>
          <ul>
            {section.content.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
      ))}

      <section className="card help-item">
        <h3>Perguntas frequentes</h3>
        <ul>
          {filteredFaq.map((item) => (
            <li key={item.q}>
              <strong>{item.q}</strong>
              <p>{item.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card help-item">
        <h3>Solução de problemas</h3>
        <ul>
          {TROUBLESHOOTING.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <ol>
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default HelpPage;
