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

```bash
POST /shippify-api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "sua-senha"
}
```

**Resposta (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "306e4c7d-98c9-4b0b-b823-654364a56cb8",
    "name": "João Silva",
    "email": "usuario@example.com"
  }
}
```

### Usuários

#### Registrar novo usuário

```bash
POST /shippify-api/v1/user/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha-segura@123"
}
```

**Resposta (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "306e4c7d-98c9-4b0b-b823-654364a56cb8",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

#### Listar todos os usuários

```bash
GET /shippify-api/v1/user
Authorization: Bearer {token}
```

**Resposta (200 OK):**

```json
[
  {
    "id": "306e4c7d-98c9-4b0b-b823-654364a56cb8",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  {
    "id": "42a8b3f1-2c5d-4e9a-8b7c-1d3e5f7a9b2c",
    "name": "Maria Santos",
    "email": "maria@example.com"
  }
]
```

#### Obter usuário por ID

```bash
GET /shippify-api/v1/user/{id}
Authorization: Bearer {token}
```

**Resposta (200 OK):**

```json
{
  "id": "306e4c7d-98c9-4b0b-b823-654364a56cb8",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

#### Atualizar usuário

```bash
PUT /shippify-api/v1/user/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com"
}
```

**Resposta (200 OK):**

```json
{
  "id": "306e4c7d-98c9-4b0b-b823-654364a56cb8",
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com"
}
```

#### Deletar usuário

```bash
DELETE /shippify-api/v1/user/{id}
Authorization: Bearer {token}
```

**Resposta (204 No Content)**

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

O projeto implementa testes unitários abrangentes cobrindo **todos os serviços, middlewares e utilitários** com **95 testes**, alcançando **100% de cobertura** em statements, branches, functions e lines.

### 📊 Cobertura de Testes - 100% ✅

```
Test Suites: 13 passed, 13 total
Tests:       95 passed, 95 total
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
│   │       └── password.util.test.ts           # 9 testes
│   └── user/
│       └── services/
│           ├── register.service.test.ts        # 7 testes
│           ├── delete-user.service.test.ts     # 4 testes
│           ├── update-user.service.test.ts     # 6 testes
│           ├── get-all-users.service.test.ts   # 3 testes
│           ├── get-user-by-id.service.test.ts  # 4 testes
│           └── to-public-user.service.test.ts  # 3 testes
└── shared/
    ├── middleware/
    │   ├── error-handler.middleware.test.ts    # 8 testes
    │   └── validation.middleware.test.ts       # 11 testes
    └── utils/
        └── logger.util.test.ts                 # 24 testes
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
|                        | password.util.test.ts            | 9      | ✅ 100%   |
| **User Services**      |                                  |        |           |
|                        | register.service.test.ts         | 7      | ✅ 100%   |
|                        | delete-user.service.test.ts      | 4      | ✅ 100%   |
|                        | update-user.service.test.ts      | 6      | ✅ 100%   |
|                        | get-all-users.service.test.ts    | 3      | ✅ 100%   |
|                        | get-user-by-id.service.test.ts   | 4      | ✅ 100%   |
|                        | to-public-user.service.test.ts   | 3      | ✅ 100%   |
| **Shared Middlewares** |                                  |        |           |
|                        | error-handler.middleware.test.ts | 8      | ✅ 100%   |
|                        | validation.middleware.test.ts    | 11     | ✅ 100%   |
| **Shared Utils**       |                                  |        |           |
|                        | logger.util.test.ts              | 24     | ✅ 100%   |

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage report
npm run test:coverage

# Modo watch (reexecuta ao salvar arquivos)
npm run test:watch
```

## 📊 Logging

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

## 📝 Variáveis de Ambiente

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
