# FinDash - Painel de Controle Financeiro Pessoal

## 🏗️ Arquitetura e Stack Tecnológica

### Backend: Node.js + Express + TypeScript
Escolhemos **Node.js** com **Express** e **TypeScript** pelas seguintes razões:
- **Unificação da Linguagem:** O uso de TypeScript no Frontend e Backend permite compartilhamento de interfaces e tipos (DTOs), reduzindo erros e facilitando a manutenção.
- **Performance I/O:** O modelo não-bloqueante do Node.js é ideal para APIs que lidam com muitas requisições de leitura/escrita de dados (transações, relatórios).
- **Ecossistema:** Ferramentas como **Prisma ORM** e **Zod** possuem integração de primeira classe com TypeScript/Node.
- **Escalabilidade:** Fácil de containerizar (Docker) e escalar horizontalmente.

### Banco de Dados
- **Ambiente de Desenvolvimento (Preview):** SQLite (`file:./dev.db`). Escolhido pela simplicidade de configuração neste ambiente de execução, sem necessidade de containers adicionais rodando.
- **Ambiente de Produção:** PostgreSQL. O código é agnóstico ao banco graças ao Prisma ORM. O `docker-compose.yml` incluirá a configuração do Postgres.

### Arquitetura em Camadas (Backend)
O backend seguirá uma arquitetura limpa e modular:
1.  **Controllers:** Recebem a requisição HTTP, validam dados básicos e chamam os serviços.
2.  **Services:** Contêm a regra de negócio (ex: verificar saldo, calcular totais).
3.  **Repositories:** Abstração do acesso ao banco de dados (Prisma).
4.  **Middlewares:** Autenticação, tratamento de erros, logs.

## 📂 Estrutura de Pastas

```
/
├── prisma/                # Schema do banco de dados e migrations
├── server/                # Código do Backend
│   ├── config/            # Configurações (env, constantes)
│   ├── controllers/       # Controladores das rotas
│   ├── middlewares/       # Middlewares (Auth, Error Handling)
│   ├── routes/            # Definição das rotas da API
│   ├── services/          # Regras de negócio
│   ├── utils/             # Funções utilitárias
│   └── server.ts          # Entry point do servidor
├── src/                   # Código do Frontend (React)
│   ├── components/        # Componentes reutilizáveis (UI)
│   ├── contexts/          # Gerenciamento de estado global (Auth)
│   ├── hooks/             # Custom Hooks
│   ├── layouts/           # Layouts de página (Sidebar, Header)
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Integração com API (Axios)
│   ├── types/             # Definições de tipos TypeScript
│   └── utils/             # Formatadores e helpers
├── docker-compose.yml     # Orquestração de containers
├── Dockerfile             # Build da imagem
└── README.md              # Documentação
```

## 🗃️ Modelagem do Banco de Dados (Prisma Schema)

### Models Principais
*   **User:** Gerencia autenticação e perfil.
*   **Transaction:** O núcleo do sistema. Registra receitas e despesas.
*   **Category:** Categorização de transações (ex: Alimentação, Transporte).
*   **Budget:** Metas de gastos por categoria.
*   **RefreshToken:** Segurança para manter a sessão do usuário.

---
*Próximos passos: Instalação de dependências e configuração inicial do servidor.*
