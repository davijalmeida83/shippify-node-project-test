# Shippify API

API RESTful robusta e segura para gerenciamento de autenticação e usuários, desenvolvida com Node.js, Express e TypeScript.

## 📋 Sobre o Projeto

A Shippify API é um serviço de backend completo que fornece funcionalidades essenciais para autenticação de usuários, gerenciamento de contas e rastreamento de auditoria. Desenvolvida com as melhores práticas de segurança e padrões de arquitetura limpa.

### ✨ Funcionalidades Principais

- **Autenticação segura** com JWT
- **Registro e login** de usuários
- **Gerenciamento completo** de usuários (CRUD)
- **Validação robusta** de entrada de dados com DTOs
- **Hash seguro de senhas** com bcrypt
- **Rastreamento de auditoria** com registro de todas as operações
- **Tratamento centralizado** de erros
- **Logging estruturado** de todas as operações para tracking
- **Injeção e Inversão de dependência** com TSyringe
- **Cache com Redis** para otimizar performance com decoradores @Cached e @InvalidateCache
- **Rate Limiting** com proteção contra força bruta e operações sensíveis

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express.js** - Framework web
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM para banco de dados
- **MySQL** - Banco de dados
- **class-validator** & **class-transformer** - Validação e transformação de dados
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **TSyringe** - Injeção de dependência

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn
- MySQL 8.0+

### Passos

1. **Clone o repositório**

   ```bash
   git clone <seu-repositorio>
   cd shippify-node-project-test
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas configurações:

   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/shippify
   JWT_SECRET=sua-chave-secreta-super-segura
   NODE_ENV=development
   ```

4. **Execute as migrações do banco de dados**

   ```bash
   npm run migration:run
   ```

5. **Inicie o servidor**
   ```bash
   npm run dev
   ```

## � Docker & Docker Compose

A aplicação possui uma configuração completa de Docker Compose para orquestração de contêineres da API e do banco de dados MySQL.

### Iniciando com Docker Compose

1. **Certifique-se de ter Docker e Docker Compose instalados**

   ```bash
   docker --version
   docker-compose --version
   ```

2. **Inicie os serviços (API + MySQL)**

   ```bash
   docker-compose up
   ```

   Ou em modo background:

   ```bash
   docker-compose up -d
   ```

3. **Parar os serviços**
   ```bash
   docker-compose down
   ```

### Estrutura do Docker Compose

O arquivo `docker-compose.yml` orquestra dois serviços:

- **shippify-api** - Aplicação Node.js/Express running nas dependências configuradas
- **mysql** - Banco de dados MySQL 8.0

Ambos os serviços estabelecem uma conexão segura através de uma rede Docker interna.

> **Dica**: Se você preferir instalar manualmente sem Docker, siga os passos de instalação acima.

## �🔌 Endpoints da API

### Autenticação

#### Login

A documentação e exemplos de consumo estão disponíveis no Swagger UI:

```
http://localhost:3000/api-docs
```

### Usuários

#### Registrar novo usuário

Consulte o Swagger UI para exemplos de requisição e resposta.

#### Listar todos os usuários

Consulte o Swagger UI para exemplos de requisição e resposta.

#### Obter usuário por ID

Consulte o Swagger UI para exemplos de requisição e resposta.

#### Atualizar usuário

Consulte o Swagger UI para exemplos de requisição e resposta.

#### Deletar usuário

```bash
DELETE /shippify-api/v1/user/{id}
Authorization: Bearer {token}
```

**Resposta (204 No Content)**

Consulte o Swagger UI para exemplos de requisição e resposta.

## 🔌 Documentação de Endpoints

### 📖 Acessar Swagger da API

A documentação completa de todos os endpoints está disponível no **Swagger UI** da aplicação.

Após iniciar a aplicação, acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

No Swagger UI você pode:

- ✅ Visualizar todos os endpoints disponíveis
- ✅ Ver os schemas de request e response
- ✅ Testar os endpoints diretamente
- ✅ Autenticar com JWT para testar rotas protegidas
- ✅ Consultar códigos de erro e validações

### Principais Endpoints

| Método   | Rota                             | Descrição                |
| -------- | -------------------------------- | ------------------------ |
| `POST`   | `/shippify-api/v1/auth/login`    | Login de usuário         |
| `POST`   | `/shippify-api/v1/user/register` | Registrar novo usuário   |
| `GET`    | `/shippify-api/v1/user`          | Listar todos os usuários |
| `GET`    | `/shippify-api/v1/user/{id}`     | Obter usuário por ID     |
| `PUT`    | `/shippify-api/v1/user/{id}`     | Atualizar usuário        |
| `DELETE` | `/shippify-api/v1/user/{id}`     | Deletar usuário          |

## 🔐 Segurança

### Implementações de Segurança

- **Whitelist de campos** - Apenas campos explicitamente marcados com `@Expose()` são aceitos
- **Validação de entrada** - Todos os dados são validados através de DTOs
- **Hash de senhas** - Senhas são hasheadas com bcryptjs
- **Authentication JWT** - Proteção de rotas com tokens JWT
- **Auditoria** - Todas as operações são registradas com histórico de mudanças
- **Tratamento de erros** - Erros padronizados sem exposição de detalhes sensíveis
- **Rate Limiting** - Proteção contra DDoS e força bruta com limites inteligentes

### Rate Limiting (Proteção contra DDoS e Força Bruta) 🛡️

A API implementa uma estratégia robusta de rate limiting com 4 níveis de proteção, prevenindo ataques DDoS e força bruta com suporte completo a IPv6.

#### 📊 Estratégias de Rate Limiting

| Tipo             | Limite                 | Aplicação                  | Objetivo                   |
| ---------------- | ---------------------- | -------------------------- | -------------------------- |
| **Global**       | 100 req/15min          | Todas as rotas             | Proteção geral contra DDoS |
| **Autenticação** | 5 tentativas/15min     | `/api/auth/login`          | Força bruta em login       |
| **Criação**      | 20 req/15min           | `POST /api/user/register`  | Spam de registros          |
| **Sensível**     | 10 op/15min por IP+UID | `PUT/DELETE /api/user/:id` | Operações críticas         |

#### 🌍 Rate Limiter Global

```
Limite: 100 requisições por 15 minutos por IP
Aplicação: Todas as rotas (exceto /health)
Headers: Retorna RateLimit-* com informações de limite
Suporte: IPv4 e IPv6
```

#### 🔑 Rate Limiter de Autenticação

```
Limite: 5 tentativas por 15 minutos por IP
Aplicação: POST /api/auth/login
Objetivo: Proteção contra força bruta
Contagem: Todas as requisições são contadas
Suporte: IPv4 e IPv6
```

#### ➕ Rate Limiter de Criação

```
Limite: 20 requisições por 15 minutos por IP
Aplicação: POST /api/user/register
Objetivo: Prevenção de spam de registros
Suporte: IPv4 e IPv6
```

#### ⚠️ Rate Limiter de Operações Sensíveis

```
Limite: 10 operações por 15 minutos por IP + User ID
Aplicação: PUT /api/user/:id, DELETE /api/user/:id
Objetivo: Proteção de operações críticas
Rastreamento: Combinação de IP e ID do usuário para maior segurança
Suporte: IPv4 e IPv6
```

#### Resposta ao Atingir Limite

**Status Code: 429 (Too Many Requests)**

```json
{
  "statusCode": 429,
  "message": "Muitas requisições deste IP, tente novamente depois de 15 minutos"
}
```

**Headers de Rate Limiting:**

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1674193088
Retry-After: 876
```

#### 🔧 Configuração Centralizada

Todas as configurações de rate limiting estão centralizadas em um único arquivo para facilitar manutenção:

**Arquivo: `src/shared/config/rate-limit.config.ts`**

```typescript
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // Janela de tempo: 15 minutos

  global: {
    max: 100, // 100 requisições
    message: "Muitas requisições deste IP...",
  },

  auth: {
    max: 5, // 5 tentativas
    message: "Muitas tentativas de autenticação...",
    skipSuccessfulRequests: false, // Contar todas
  },

  creation: {
    max: 20, // 20 requisições
    message: "Muitas requisições de criação...",
  },

  sensitive: {
    max: 10, // 10 operações
    message: "Muitas operações sensíveis...",
  },
};
```

**Arquivo: `src/shared/middleware/rate-limit.middleware.ts`**

```typescript
// Implementação dos 4 limitadores usando RATE_LIMIT_CONFIG
export const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.global.max,
  message: RATE_LIMIT_CONFIG.global.message,
  keyGenerator: getIpBasedKey, // Suporta IPv6
  skip: shouldSkipRateLimit,
});

export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.auth.max,
  message: RATE_LIMIT_CONFIG.auth.message,
  skipSuccessfulRequests: RATE_LIMIT_CONFIG.auth.skipSuccessfulRequests,
  keyGenerator: getIpBasedKey,
});

// ... Mais limitadores
```

#### ✅ Vantagens da Implementação

- **🔒 Proteção contra DDoS** - Limita requisições por IP
- **🛡️ Prevenção de força bruta** - Limite reduzido em autenticação (5 tentativas)
- **📊 Visibilidade total** - Headers padrão `RateLimit-*` informam cliente
- **🎯 Estratégia granular** - Diferentes limites para diferentes tipos de operação
- **⚡ Performance** - Store em memória com opção para Redis em produção
- **🌐 Suporte IPv6** - Compatível com endereços IPv6 usando `ipKeyGenerator`
- **🔧 Configuração centralizada** - Fácil de manter e ajustar
- **📝 Bem documentado** - Código limpo e autodescritivo

#### 🧪 Testes de Rate Limiting

O rate limiting possui cobertura completa de testes:

```bash
npm test -- --testPathPatterns="rate-limit"
```

**Cobertura:** 100% statements, branches, functions e lines

### Campos Proibidos

A API rejeita automaticamente campos não permitidos. Por exemplo, tentar enviar um campo `password` em uma requisição de atualização resultará em:

```json
{
  "statusCode": 400,
  "message": "Forbidden field(s): password"
}
```

## 📁 Estrutura do Projeto

```
src/
├── index.ts                    # Entrada da aplicação
├── modules/
│   ├── auth/                   # Módulo de autenticação
│   │   ├── controllers/        # Controladores
│   │   ├── services/           # Lógica de negócio
│   │   ├── dtos/              # Data Transfer Objects
│   │   ├── routes/            # Rotas
│   │   └── utils/             # Utilitários (hash, validação)
│   └── user/                   # Módulo de usuários
│       ├── controllers/
│       ├── services/
│       ├── dtos/
│       ├── routes/
│       ├── repositories/       # Acesso a dados
│       └── domain/             # Entidades do domínio
└── shared/
    ├── db/                     # Configuração de banco de dados
    │   ├── config/            # Configuração TypeORM
    │   ├── entities/          # Entidades do banco
    │   ├── migrations/        # Migrações
    │   └── subscribers/       # Listeners de eventos
    ├── middleware/            # Middlewares Express
    ├── errors/               # Tratamento de erros
    ├── routes/               # Rotas globais
    ├── utils/                # Utilitários globais
    └── container/            # Configuração de DI
```

## 📖 Clean Code

O projeto é desenvolvido seguindo rigorosamente os princípios de **Clean Code** de Robert C. Martin, resultando em código legível, manutenível e profissional.

### ✨ Implementações de Clean Code

#### 1. **Nomes Significativos** ⭐⭐⭐⭐⭐

- Variáveis, funções e classes com nomes autoexplicativos
- Exemplos: `findByEmail()`, `IUserPersistence`, `DeleteUserCriteria`
- Sem abreviações desnecessárias ou nomes genéricos

#### 2. **Funções Pequenas e Focadas** ⭐⭐⭐⭐⭐

- Cada função tem uma única responsabilidade
- Classes de serviço dedicadas a uma funcionalidade específica
- Métodos com máximo de 10-15 linhas

#### 3. **Tratamento de Erros** ⭐⭐⭐⭐⭐

- Erros centralizados em middleware específico
- Classes de erro customizadas (`AppError`)
- Sem stack traces expostos ao cliente

#### 4. **Comentários Mínimos** ⭐⭐⭐⭐⭐

- Código autoexplicativo reduz necessidade de comentários
- JSDoc em interfaces para documentar contratos públicos
- Sem comentários óbvios ("incrementar contador", "validar email")

#### 5. **Formatação e Estrutura** ⭐⭐⭐⭐⭐

- Organização modular clara
- Separação de concerns (Controllers → Services → Repositories)
- Estrutura de pastas intuitiva

#### 6. **Tipo Seguro (Type Safety)** ⭐⭐⭐⭐⭐

- TypeScript com `strict: true`
- Sem uso de `any` types
- Interfaces específicas e bem documentadas
- Type aliases semânticos (`DeleteUserCriteria`)

#### 7. **DRY (Don't Repeat Yourself)** ⭐⭐⭐⭐⭐

- `BaseRepository` reutilizável para acesso a dados
- Validação centralizada em DTOs
- Middleware compartilhado para tratamento de erros

#### 8. **KISS (Keep It Simple, Stupid)** ⭐⭐⭐⭐⭐

- Soluções diretas sem over-engineering
- Não implementa o desnecessário
- Usa apenas dependências essenciais

### 📊 Score Clean Code: **10/10** ✅

Agora com cobertura de testes unitários implementada!

- ✅ Nomes descritivos e autoexplicativos
- ✅ Funções pequenas e coesas
- ✅ Tratamento robusto de erros
- ✅ Documentação JSDoc completa em interfaces públicas
- ✅ Sem comentários desnecessários
- ✅ Type-safety com TypeScript strict
- ✅ Estrutura modular e extensível

### 📝 Exemplos de Clean Code no Projeto

**Interface com JSDoc e Type Alias significativo:**

```typescript
type DeleteUserCriteria = Partial<{ id: string }>;

export interface IUserPersistence {
  /**
   * Remove um usuário do repositório.
   * @param criteria Critério de exclusão (por enquanto, apenas por ID)
   * @returns Promessa com número de registros afetados
   */
  delete(criteria: DeleteUserCriteria): Promise<{ affected?: number | null }>;
}
```

**Serviço com responsabilidade única e tratamento de erro:**

```typescript
@injectable()
export class RegisterService {
  constructor(
    @inject(UserRepository) private userRepository: IUserPersistence,
    @inject(TokenService) private tokenService: TokenService,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const userAlreadyExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (userAlreadyExists) {
      throw new AppError("Email already registered", 400);
    }

    const user = await this.userRepository.create(dto);
    const token = this.tokenService.generateToken(user);

    return { token, user };
  }
}
```

---

## 🎯 Princípios SOLID

Esta aplicação segue rigorosamente os princípios SOLID para garantir um código limpo, manutenível e extensível:

### S - Single Responsibility Principle (SRP)

Cada classe e interface tem uma única responsabilidade:

- `IUserFinder` - Apenas operações de leitura de usuários
- `IUserPersistence` - Apenas operações de persistência
- Cada serviço (`RegisterService`, `UpdateUserService`, etc.) tem uma única responsabilidade

### O - Open/Closed Principle (OCP)

O código está aberto para extensão, fechado para modificação:

- Novas implementações de repositórios podem ser criadas sem alterar as interfaces existentes
- Exemplo: Poderia criar `AdminUserRepository` com lógica adicional sem quebrar a interface

### L - Liskov Substitution Principle (LSP)

Implementações são intercambiáveis:

- `UserRepository` implementa `IUserFinder` e `IUserPersistence` corretamente
- Qualquer outra implementação dessas interfaces funcionaria sem alterar a lógica

### I - Interface Segregation Principle (ISP)

Interfaces segregadas e específicas:

- Separadas em arquivos distintos: `user-finder.interface.ts`, `user-persistence.interface.ts`
- Cada serviço injeta apenas as interfaces que realmente usam
- Exemplo: `GetAllUsersService` só precisa de `IUserFinder`, não da interface completa

### D - Dependency Inversion Principle (DIP)

Depende de abstrações, não de implementações concretas:

- Serviços dependem de interfaces (`IUserFinder`, `IUserPersistence`)
- O container (TSyringe) gerencia as dependências
- Facilita testes unitários com mocks

### ✅ Resultado

O código está **100% alinhado com SOLID**:

- ⭐⭐⭐⭐⭐ SRP - Responsabilidades bem separadas
- ⭐⭐⭐⭐⭐ OCP - Preparado para extensão
- ⭐⭐⭐⭐⭐ LSP - Implementações corretas
- ⭐⭐⭐⭐⭐ ISP - Interfaces segregadas
- ⭐⭐⭐⭐⭐ DIP - Inversão de dependências

## 🧪 Testes Unitários

O projeto implementa testes unitários abrangentes cobrindo **todos os serviços, middlewares e utilitários** com **118 testes**, alcançando **100% de cobertura** em statements, branches, functions e lines.

### 📊 Cobertura de Testes - 100% ✅

```
Test Suites: 16 passed, 16 total
Tests:       118 passed, 118 total
Statements:  100%
Branches:    100%
Functions:   100%
Lines:       100%
```

### Estrutura de Testes

```
src/test/
├── modules/
│   ├── auth/
│   │   ├── services/
│   │   │   ├── login.service.test.ts           # 5 testes
│   │   │   └── token.service.test.ts           # 3 testes
│   │   ├── middlewares/
│   │   │   └── ensure-authenticated.test.ts    # 9 testes
│   │   └── utils/
│   │       └── password.util.test.ts           # 11 testes
│   └── user/
│       └── services/
│           ├── register.service.test.ts        # 4 testes
│           ├── delete-user.service.test.ts     # 4 testes
│           ├── update-user.service.test.ts     # 6 testes
│           ├── get-all-users.service.test.ts   # 3 testes
│           ├── get-user-by-id.service.test.ts  # 4 testes
│           └── to-public-user.service.test.ts  # 3 testes
└── shared/
    ├── cache/
    │   ├── redis-cache.service.test.ts         # 9 testes
    │   └── cache.decorator.test.ts             # 10 testes
    ├── middleware/
    │   ├── error-handler.middleware.test.ts    # 8 testes
    │   ├── validation.middleware.test.ts       # 11 testes
    │   └── rate-limit.middleware.test.ts       # 16 testes
    └── utils/
        └── logger.util.test.ts                 # 12 testes
```

### Cobertura Detalhada de Testes

| Módulo                 | Arquivo                          | Testes | Cobertura |
| ---------------------- | -------------------------------- | ------ | --------- |
| **Auth Services**      |                                  |        |           |
|                        | login.service.test.ts            | 5      | ✅ 100%   |
|                        | token.service.test.ts            | 3      | ✅ 100%   |
| **Auth Middlewares**   |                                  |        |           |
|                        | ensure-authenticated.test.ts     | 9      | ✅ 100%   |
| **Auth Utils**         |                                  |        |           |
|                        | password.util.test.ts            | 11     | ✅ 100%   |
| **User Services**      |                                  |        |           |
|                        | register.service.test.ts         | 4      | ✅ 100%   |
|                        | delete-user.service.test.ts      | 4      | ✅ 100%   |
|                        | update-user.service.test.ts      | 6      | ✅ 100%   |
|                        | get-all-users.service.test.ts    | 3      | ✅ 100%   |
|                        | get-user-by-id.service.test.ts   | 4      | ✅ 100%   |
|                        | to-public-user.service.test.ts   | 3      | ✅ 100%   |
| **Shared Cache**       |                                  |        |           |
|                        | redis-cache.service.test.ts      | 9      | ✅ 100%   |
|                        | cache.decorator.test.ts          | 10     | ✅ 100%   |
| **Shared Middlewares** |                                  |        |           |
|                        | error-handler.middleware.test.ts | 8      | ✅ 100%   |
|                        | validation.middleware.test.ts    | 11     | ✅ 100%   |
|                        | rate-limit.middleware.test.ts    | 16     | ✅ 100%   |
| **Shared Utils**       |                                  |        |           |
|                        | logger.util.test.ts              | 12     | ✅ 100%   |

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage report
npm run test:coverage

# Modo watch (reexecuta ao salvar arquivos)
npm run test:watch
```

## CI/CD - GitHub Actions

### Workflows Automáticos

Este projeto implementa dois workflows GitHub Actions que garantem qualidade de código e execução de testes automáticos a cada Pull Request:

#### 1. Build - Compilação TypeScript

- **Arquivo**: `.github/workflows/build.yaml`
- **Trigger**: Push e Pull Requests para `main`
- **Ações**:
  - Setup Node.js 18
  - Instala dependências (`npm install --legacy-peer-deps`)
  - Compila TypeScript (`npm run build`)
- **Objetivo**: Garantir que o código compila sem erros

#### 2. Coverage - Relatório de Cobertura

- **Arquivo**: `.github/workflows/coverage.yaml`
- **Trigger**: Após build completar com sucesso (`workflow_run`)
- **Ações**:
  - Setup Node.js 18
  - Instala dependências
  - Executa testes (`npm test`)
  - Gera relatório de cobertura (`npm run test:coverage`)
  - Envia para Codecov (com `CODECOV_TOKEN`)
  - Comenta no PR com resumo de cobertura (statements, branches, functions, lines)
- **Objetivo**: Garantir 100% de cobertura de testes

### Sequencia de Execução

```
Pull Request Aberto
        |
   Build Workflow (push trigger)
        |
   Compila TypeScript
        |
   Build Sucesso [OK]
        |
   Coverage Workflow (workflow_run trigger)
        |
   Executa Testes + Coverage
        |
   Comenta no PR com resultado
        |
   Status Checks Passam [OK]
```

### Variaveis de Ambiente (Secrets)

Para que o Coverage funcione e comente no PR, configure:

1. **CODECOV_TOKEN** - Token do Codecov para enviar relatórios
   - Acesse: https://app.codecov.io
   - Copie o token do repositório

2. **GITHUB_TOKEN** - Token do GitHub (disponível automaticamente)
   - Usado para postar comentários no PR

### Como Usar

1. **Abra um Pull Request** para a branch `main`
2. **Workflows disparam automaticamente**:
   - Build executa primeiro
   - Coverage executa após build suceder
3. **Veja os resultados**:
   - No PR, clique em "Checks" para ver status
   - Coverage comenta automaticamente no PR com resumo

## Protecao de Branch e Code Review

### GitHub Rulesets (Branch Protection)

A branch `main` é protegida por GitHub Rulesets que garantem qualidade e segurança:

#### Regras Ativas:

✅ **Require a pull request before merging**

- Obriga criacao de PR para fazer merge
- Requer aprovacao de Code Owner (@davijalmeida83)
- PR authors nao conseguem aprovar seu proprio PR

✅ **Require status checks to pass before merging**

- Build workflow deve passar
- Coverage workflow deve passar
- Testes devem rodar com sucesso

✅ **Require branches to be up to date before merging**

- PR deve estar sincronizada com main antes do merge
- Evita conflitos no merge

✅ **Require conversation resolution before merging**

- Comentarios no PR devem ser resolvidos
- Garante que feedback foi considerado

### CODEOWNERS - Code Review Obrigatorio

O arquivo `.github/CODEOWNERS` define quem deve revisar as mudancas:

```
# Todos os arquivos requerem aprovacao de:
* @davijalmeida83

# Workflows de CI/CD - requerem revisao extra
.github/workflows/* @davijalmeida83

# Configuracoes criticas
tsconfig.json @davijalmeida83
jest.config.js @davijalmeida83
package.json @davijalmeida83
```

**Resultado**: Qualquer PR precisa de aprovacao do owner antes de fazer merge!

### Workflow de Desenvolvimento com Seguranca

#### Passo 1: Crie uma branch

```bash
git checkout -b feat/sua-feature
```

#### Passo 2: Faça suas mudancas

```bash
# Edite arquivos, faça commits
git add .
git commit -m "feat: descricao da mudanca"
```

#### Passo 3: Push para remota

```bash
git push origin feat/sua-feature
```

#### Passo 4: Abra um PR

- Vá para GitHub
- Clique em "Compare & pull request"
- Preencha titulo e descricao

#### Passo 5: Aguarde Workflows

- Build workflow executa (compilacao)
- Coverage workflow executa (testes + cobertura)
- Se ambos passarem, um comentario com resumo aparece

#### Passo 6: Code Review

- Owner (ou Code Owner) revisa o PR
- Se OK, aprova

#### Passo 7: Merge

- Clique "Squash and merge" ou "Merge pull request"
- PR é mergeado automaticamente na main

#### Passo 8: Sincronize local

```bash
git checkout main
git pull origin main
```

### Restricoes de Push Direto

**IMPORTANTE**: Nao e possivel fazer push direto na branch main:

```bash
git push origin main
# ERROR: Pushing to this branch requires pull request and review
```

Isso garante que TODAS as mudancas passem por:

1. Compilacao (build workflow)
2. Testes (coverage workflow)
3. Code review (aprovacao)

## Logging

A API implementa logging estruturado em todos os pontos críticos:

```
[INFO]: [Validation] Validando RegisterRequestDto...
[INFO]: [UserController] POST /register recebida
[INFO]: [RegisterService] Iniciando registro para email: usuario@example.com
[INFO]: [RegisterService] Criando usuário...
[INFO]: [AuditSubscriber] Salvando auditoria...
[INFO]: [RegisterService] ✓ Registro concluído com sucesso
[INFO]: [UserController] Retornando resposta de registro
```

## 🔄 Fluxo de Auditoria

Todas as operações que modificam dados são registradas automaticamente:

- **INSERT** - Novo registro criado
- **UPDATE** - Registro modificado (oldData e newData)
- **DELETE** - Registro removido

Exemplo de registro de auditoria:

```json
{
  "entity": "User",
  "operation": "UPDATE",
  "oldData": "{\"name\": \"João\", \"email\": \"joao@example.com\"}",
  "newData": "{\"name\": \"João Silva\", \"email\": \"joao.silva@example.com\"}",
  "user": "system",
  "createdAt": "2024-03-22T10:30:45.000Z"
}
```

## � Cache com Redis

A API utiliza Redis para cache em memória, melhorando significativamente a performance e reduzindo a carga no banco de dados.

### 🎯 Estratégia de Cache

- **TTL configurável**: Tempo de vida padrão para cada tipo de dado
- **Invalidação automática**: Cache é automaticamente invalidado quando dados são modificados
- **Compatibilidade com falhas**: Se Redis não estiver disponível, a aplicação continua funcionando sem cache

### 📌 Decoradores de Cache

#### @Cached()

Armazena o resultado de uma função/método no Redis:

```typescript
import { Cached } from "@shared/db/cache/decorators";

@injectable()
export class UserService {
  // Cache por 15 minutos (900 segundos)
  @Cached({ key: "user:{{0}}", ttl: 900 })
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // Cache dinâmico com múltiplos parâmetros
  @Cached({ key: "user:email:{{0}}:active:{{1}}", ttl: 600 })
  async getUserByEmail(email: string, isActive: boolean): Promise<User> {
    return await this.userRepository.findOne({ where: { email, isActive } });
  }

  // Cache com condição (só cacheia se a condição for verdadeira)
  @Cached({
    key: "users:all",
    ttl: 1800,
    condition: () => process.env.NODE_ENV === "production",
  })
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
```

#### @InvalidateCache()

Remove valores em cache quando dados são modificados:

```typescript
@injectable()
export class UserService {
  // Remove do cache após criar usuário
  @InvalidateCache("users:all", "user:cache:*")
  async createUser(data: CreateUserDto): Promise<User> {
    return await this.userRepository.create(data);
  }

  // Invalida múltiplos padrões de cache
  @InvalidateCache("user:{{0}}", "users:all")
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return await this.userRepository.update(id, data);
  }

  // Remove padrão de cache com wildcard
  @InvalidateCache("user:*")
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.remove(id);
  }
}
```

### 🔑 Padrões de Chave de Cache

A interpolação de parâmetros usa a sintaxe `{{index}}`:

```typescript
// {{0}} = primeiro parâmetro
// {{1}} = segundo parâmetro
// {{2}} = terceiro parâmetro

@Cached({ key: "user:{{0}}:role:{{1}}" })
async getUserByIdAndRole(id: string, role: string) { }
```

### 📊 Configuração de Cache

No arquivo `.env`:

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# Cache TTLs (em segundos)
CACHE_TTL_USER=900        # 15 minutos
CACHE_TTL_USERS=1800      # 30 minutos
CACHE_TTL_SESSION=3600    # 1 hora
```

No arquivo `.env.docker`:

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
```

### 🏗️ Estrutura de Cache

```
src/shared/cache/
├── redis-cache.service.ts     # Implementação do serviço Redis
├── interfaces/
│   └── cache-service.interface.ts  # Contrato do serviço
└── decorators/
    └── cache.decorator.ts      # Decoradores @Cached e @InvalidateCache
```

### 💡 Exemplo de Uso Completo

```typescript
@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: IUserPersistence,
  ) {}

  // Busca do banco, armazena em cache por 15 min
  @Cached({ key: "user:{{0}}", ttl: 900 })
  async getUserById(id: string): Promise<User> {
    console.log(`Buscando usuário ${id} no banco...`);
    return await this.userRepository.findOne({ where: { id } });
  }

  // Lista em cache por 30 min
  @Cached({ key: "users:all", ttl: 1800 })
  async getAllUsers(): Promise<User[]> {
    console.log("Buscando todos os usuários no banco...");
    return await this.userRepository.find();
  }

  // Cria usuário e invalida cache
  @InvalidateCache("users:all")
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    // Cache "users:all" é removido automaticamente
    return user;
  }

  // Atualiza e invalida cache específico
  @InvalidateCache("user:{{0}}", "users:all")
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, dto);
    // Cache "user:{id}" e "users:all" são removidos automaticamente
    return user;
  }
}
```

**Comportamento esperado:**

```
GET /api/users (primeira chamada)
→ Cache miss, executa método, armazena resultado por 30 min
→ Resposta: [usuarios do banco]

GET /api/users (segunda chamada, dentro de 30 min)
→ Cache hit, retorna resultado de cache
→ Resposta: [usuarios do cache]

POST /api/users (criar novo usuário)
→ Executa createUser() que invalida cache "users:all"

GET /api/users (chamada após criar)
→ Cache miss (foi invalidado), executa método novamente
→ Resposta: [usuarios atualizados do banco]
```

## �️ Rate Limiting

A API implementa rate limiting em múltiplas camadas para proteção contra força bruta, abuso e operações sensíveis. Utiliza Redis para armazenar contadores de requisições.

### 📊 Estratégias de Rate Limiting

A API possui 4 níveis diferentes de proteção:

| Limitador     | Limit   | Janela | Proteção                     | Chave        |
| ------------- | ------- | ------ | ---------------------------- | ------------ |
| **Global**    | 100 req | 15 min | Todas requisições            | IP           |
| **Auth**      | 5 req   | 15 min | Login/Register (força bruta) | IP           |
| **Creation**  | 20 req  | 15 min | POST endpoints               | IP           |
| **Sensitive** | 10 req  | 15 min | DELETE/PUT autenticado       | IP + User ID |

### 🎯 Como Funciona

**Rate Limiting Global:**

- Aplica-se a TODAS as requisições
- Limite: 100 requisições por IP a cada 15 minutos
- Exceções: `/health` (health checks) não contam

```bash
GET /api/users
# Headers da resposta:
# RateLimit-Limit: 100
# RateLimit-Remaining: 99
# RateLimit-Reset: 1711199400
```

**Rate Limiting de Autenticação (Força Bruta):**

- Protege endpoints de login e registro
- Limite: 5 tentativas por IP a cada 15 minutos
- Melhor prática: Implementar espera exponencial no cliente

```bash
POST /api/auth/login
X-Forwarded-For: 192.168.1.1

# Resposta na 6ª tentativa:
HTTP/1.1 429 Too Many Requests
{
  "message": "Muitas tentativas de autenticação, tente novamente depois de 15 minutos"
}

# Headers:
# Retry-After: 830 (segundos até reset)
```

**Rate Limiting de Criação (POST):**

- Protege endpoints de criação de recursos
- Limite: 20 requisições por IP a cada 15 minutos
- Aplicado em: `POST /api/user/register`, `POST /api/users`

```bash
POST /api/user/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha-segura@123"
}

# Resposta na 21ª tentativa:
HTTP/1.1 429 Too Many Requests
{
  "message": "Muitas requisições de criação, tente novamente depois de 15 minutos"
}
```

**Rate Limiting Sensível (Operações Protegidas):**

- Protege operações destrutivas/críticas
- Limite: 10 operações por (IP + User ID) a cada 15 minutos
- Aplicado em: `PUT /api/user/:id`, `DELETE /api/user/:id`
- Combina IP + User ID para ser mais preciso

```bash
DELETE /api/user/306e4c7d-98c9-4b0b-b823-654364a56cb8
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resposta na 11ª tentativa:
HTTP/1.1 429 Too Many Requests
{
  "message": "Muitas operações sensíveis, tente novamente depois de 15 minutos"
}
```

### 🔑 Headers de Rate Limit

Toda resposta inclui headers padrão RateLimit:

```
RateLimit-Limit: 100          # Limite total
RateLimit-Remaining: 87       # Requisições restantes
RateLimit-Reset: 1711199400   # Timestamp Unix quando reseta
```

Se exceder o limite, recebe também:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 520              # Segundos até poder fazer nova tentativa
```

### 📋 Configuração de Rate Limit

No arquivo `src/shared/config/rate-limit.config.ts`:

```typescript
export const RATE_LIMIT_CONFIG = {
  // Janela de tempo (15 minutos)
  windowMs: 15 * 60 * 1000,

  // Rate limit global
  global: {
    max: 100,
    message:
      "Muitas requisições deste IP, tente novamente depois de 15 minutos",
  },

  // Rate limit de autenticação
  auth: {
    max: 5,
    message:
      "Muitas tentativas de autenticação, tente novamente depois de 15 minutos",
    skipSuccessfulRequests: false,
  },

  // Rate limit de criação
  creation: {
    max: 20,
    message:
      "Muitas requisições de criação, tente novamente depois de 15 minutos",
  },

  // Rate limit sensível
  sensitive: {
    max: 10,
    message: "Muitas operações sensíveis, tente novamente depois de 15 minutos",
  },
};
```

### 🏗️ Estrutura de Rate Limit

```
src/shared/middleware/
├── rate-limit.middleware.ts        # Implementação dos limitadores
└── rate-limit.config.ts            # Configuração centralizada
```

Funcionários auxiliares:

- `extractClientIpWithUserId()` - Combina IP + User ID para chave
- `shouldSkipRateLimit()` - Define rotas que não contam com rate limit
- `getIpBasedKey()` - Extrai IP com suporte a IPv6

### 💡 Exemplo de Tratamento de Rate Limit no Cliente

```typescript
// React/Angular/Vue
async function loginWithRetry(
  email: string,
  password: string,
  maxRetries = 3,
): Promise<AuthResponse> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "60",
        );
        const waitSeconds = retryAfter * Math.pow(2, attempt - 1); // Exponencial

        console.warn(
          `Rate limited. Aguarde ${waitSeconds}s antes de tentar novamente`,
        );
        await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
    }
  }
}

// Uso:
try {
  const auth = await loginWithRetry("user@example.com", "password");
  console.log("Logged in:", auth.user.name);
} catch (error) {
  console.error("Login failed:", error);
}
```

### ⚙️ Customização de Rate Limit

Para alterar os limites, edite `src/shared/config/rate-limit.config.ts`:

```typescript
// Aumentar limite global para 200 req/15min
global: {
  max: 200,  // ← alterar aqui
  message: "..."
}

// Reduzir tentativas de auth para 3 (mais restritivo)
auth: {
  max: 3,    // ← alterar aqui
  message: "..."
}
```

Depois recompile e reinicie:

```bash
npm run build
npm start
```

## �📝 Variáveis de Ambiente

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/shippify
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=shippify

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura
JWT_EXPIRATION=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# Server
NODE_ENV=development
PORT=3000
API_PREFIX=/shippify-api/v1
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev              # Inicia servidor em modo desenvolvimento
npm run build           # Build para produção
npm run start           # Inicia servidor em produção
npm test                # Executa testes
npm run migration:run   # Executa migrações
npm run typeorm         # CLI do TypeORM
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feat/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feat/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email: support@shippify.com

---

**Desenvolvido com ❤️ usando Node.js, Express e TypeScript**
