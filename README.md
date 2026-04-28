
# BoraLer

Aplicacao web de biblioteca virtual com autenticacao local, busca de livros via Open Library e uma experiencia de leitura com progresso, anotacoes, destaques e organizacao de biblioteca pessoal.

<img width="1915" height="1017" alt="prints_boraler" src="https://github.com/user-attachments/assets/0a6876d2-6bd3-40e2-8f34-add03419605d" />
<img width="1916" height="1018" alt="Captura de tela 2026-04-28 120339" src="https://github.com/user-attachments/assets/7ee6306f-5ebd-442c-9778-0ab0f5545f12" />
<img width="1911" height="1012" alt="Captura de tela 2026-04-28 120404" src="https://github.com/user-attachments/assets/92be5135-e1df-491d-929a-d5d7fdf49027" />


## Visao Geral

O projeto combina um servidor Express enxuto com uma interface front-end statica em HTML, CSS e JavaScript modular. A aplicacao foi desenhada para simular uma pequena plataforma de leitura digital, cobrindo tres etapas centrais da jornada do usuario:

- autenticacao local com cadastro e login;
- exploracao do catalogo com filtros e busca por titulo, autor ou tema;
- leitura e acompanhamento de livros salvos em uma biblioteca pessoal.

O estado principal da aplicacao e persistido no navegador com `localStorage`, o que elimina dependencia de banco de dados neste estagio e simplifica a execucao local.

## Principais Funcionalidades

- Cadastro e login com persistencia local do usuario autenticado.
- Busca de livros pela API publica da Open Library.
- Fallback local com acervo predefinido quando a API nao responde ou nao retorna resultados suficientes.
- Catalogo com filtros por categoria, autor, status na biblioteca e ordenacao.
- Biblioteca pessoal com contador de livros e selecao do item ativo.
- Tela de leitura com temas visuais, ajuste de fonte, navegacao por paginas e modo tela cheia.
- Controle de status de leitura: `quero-ler`, `lendo` e `concluido`.
- Persistencia de progresso, favoritos, anotacoes e destaques.

## Stack Tecnica

- Node.js
- Express 5
- JavaScript ES Modules
- HTML5 e CSS3
- `localStorage` para persistencia do lado do cliente
- Open Library API para consulta de livros e capas
- Anime.js para animacoes na tela de autenticacao

## Arquitetura

### Backend

O backend atual tem papel de servidor estatico. O arquivo principal [app.js](./app.js) publica a pasta `public/` e expõe quatro rotas HTML:

- `/` -> tela de login
- `/register` -> tela de cadastro
- `/home` -> catalogo principal
- `/book` -> leitor e biblioteca pessoal

Nao ha API propria, regras de negocio no servidor nem persistencia em banco de dados.

### Frontend

O front-end esta organizado por pagina e por modulos reutilizaveis:

- `public/templates/login/` controla autenticacao e animacoes da tela inicial.
- `public/templates/home/` concentra busca, filtros e renderizacao do catalogo.
- `public/templates/book/` implementa a experiencia de leitura e a biblioteca pessoal.
- `public/src/modules/` reune modulos compartilhados de autenticacao, acesso a dados externos e armazenamento do leitor.

### Persistencia

O projeto usa duas chaves principais no `localStorage`:

- `libdb_users`: usuarios cadastrados localmente.
- `libdb_current_user`: usuario autenticado.
- `libdb_reader_state_v1`: estado da biblioteca, progresso, favoritos, anotacoes e destaques.

## Estrutura do Projeto

```text
.
├── app.js
├── package.json
├── public/
│   ├── assets/
│   ├── css/
│   │   ├── book.css
│   │   ├── cadastro.css
│   │   ├── home.css
│   │   └── login.css
│   ├── data/
│   │   ├── autores.json
│   │   └── livros_fallback.json
│   ├── src/
│   │   └── modules/
│   │       ├── api.js
│   │       ├── auth.js
│   │       └── reader_store.js
│   └── templates/
│       ├── book/
│       │   ├── book.html
│       │   └── book.js
│       ├── home/
│       │   ├── buscar_livros.js
│       │   ├── home.html
│       │   └── livros_carrossels.js
│       └── login/
│           ├── anime.js
│           ├── cadastro.html
│           ├── cadastro.js
│           ├── login.html
│           └── login.js
└── package-lock.json
```

## Fluxo da Aplicacao

### 1. Autenticacao

O usuario cria uma conta localmente e faz login usando email e senha. O modulo [public/src/modules/auth.js](./public/src/modules/auth.js) normaliza o email, salva usuarios no navegador e controla a sessao atual.

### 2. Catalogo

Na home, o modulo [public/templates/home/buscar_livros.js](./public/templates/home/buscar_livros.js) carrega um conjunto inicial de livros, consulta a Open Library por autores conhecidos e aplica filtros locais para refinamento da lista.

### 3. Biblioteca e leitura

Ao adicionar um livro, a aplicacao salva seus metadados em [public/src/modules/reader_store.js](./public/src/modules/reader_store.js). A tela [public/templates/book/book.js](./public/templates/book/book.js) usa esse estado para montar o leitor, controlar progresso e armazenar interacoes do usuario.

## Como Executar

### Requisitos

- Node.js 18 ou superior
- npm

### Instalacao

```bash
npm install
```

### Execucao

```bash
node app.js
```

Depois, abra no navegador:

```text
http://localhost:5000
```

## Analise Tecnica

### Pontos fortes

- Separacao razoavel entre telas e modulos compartilhados.
- Boa experiencia de prototipacao para uma aplicacao sem backend de dados.
- Uso de fallback local para reduzir dependencia total da API externa.
- Leitor com funcionalidades relevantes para produto real: progresso, destaque, anotacoes e favoritos.
- Interface orientada a jornada do usuario, com fluxo claro entre login, descoberta e leitura.

### Limitacoes observadas

- A autenticacao e apenas local e usa codificacao simples com `btoa`, sem seguranca real para producao.
- Nao existe banco de dados, API propria, validacao server-side nem controle de sessao robusto.
- O servidor sobe na porta `5000`, mas o log atual em [app.js](./app.js) informa `3000`, o que pode gerar confusao na operacao.
- O script `test` em [package.json](./package.json) nao executa testes automatizados reais.
- A dependencia `vite` esta instalada, mas nao faz parte do fluxo atual de build ou desenvolvimento.
- Ha inconsistencias de naming entre `LibDB`, `BoraLer` e `Boraler` em partes da interface e do armazenamento.
- O modulo de carrossel em [public/templates/home/livros_carrossels.js](./public/templates/home/livros_carrossels.js) parece legado ou parcialmente desacoplado da tela principal atual.

### Maturidade atual

O projeto esta em um estagio de prototipo funcional. Ele demonstra bem a proposta de produto e cobre interacoes importantes de front-end, mas ainda precisa de padronizacao, seguranca e instrumentacao para ser tratado como aplicacao pronta para producao.

## Melhorias Recomendadas

- Padronizar o nome do produto em toda a aplicacao e nos identificadores de armazenamento.
- Corrigir scripts do `package.json` e adicionar comandos de desenvolvimento e teste.
- Introduzir lint, formatacao automatica e testes de interface ou unidade.
- Migrar autenticacao e persistencia para backend real com banco de dados.
- Criar camada propria de servicos para desacoplar a Open Library do front-end.
- Revisar acessibilidade, mensagens de erro e estados vazios.
- Organizar melhor codigo legado ou nao utilizado para reduzir ambiguidade arquitetural.

## Roadmap Sugerido

- Cadastro com recuperacao de senha e validacoes mais robustas.
- Perfil do usuario e sincronizacao em nuvem.
- Marcadores de leitura por pagina ou capitulo.
- Recomendacoes personalizadas por historico.
- Busca com cache local e experiencia offline mais consistente.

## Licenca

Sem licenca definida atualmente no repositorio.
