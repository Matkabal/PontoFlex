# PontoFlex

Aplicativo PWA para controle de ponto pessoal, com funcionamento offline e armazenamento local.

## Funcionalidades

- Lançamento manual de horários com pareamento automático de entrada e saída.
- Múltiplas marcações por dia.
- Cálculo de horas trabalhadas, esperadas e saldo diário.
- Relatório mensal com totais do mês.
- Configuração de jornada por dia da semana (ex.: quinta 8h, sexta 9h).
- Cadastro manual de feriados.
- Sincronização automática de feriados nacionais do ano atual (cache local).
- Instalação como aplicativo (PWA).

## Tecnologias

- React
- Vite
- Dexie (IndexedDB)
- date-fns
- vite-plugin-pwa

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie em desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador:

- `http://localhost:5173`

## Build de produção

```bash
npm run build
```

Pré-visualizar build:

```bash
npm run preview
```

## PWA e iPhone

Para instalar no iPhone:

1. Abra o app no Safari.
2. Toque em Compartilhar.
3. Selecione "Adicionar à Tela de Início".

## Observações

- Os dados ficam no IndexedDB do dispositivo.
- Sem backend: as informações não são sincronizadas com nuvem.
- Se virar o ano, o app tenta carregar feriados do novo ano apenas se ainda não existir cache local.
