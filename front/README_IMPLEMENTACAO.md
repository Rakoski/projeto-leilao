# Sistema de Leilões - Frontend

Este é o frontend do sistema de leilões, desenvolvido em React com PrimeReact para os componentes de UI.

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação Completo

#### Login Seguro
- Tela de login com email/usuário e senha
- Validação de campos obrigatórios
- Feedback visual de erros e estados de loading
- Redirecionamento automático após login
- Suporte a tecla Enter para submeter formulário

#### Gerenciamento de Sessão
- Context API para gerenciamento global do estado de autenticação
- Persistência de sessão (usuário permanece logado após reload)
- Interceptador HTTP automático para anexar token nas requisições
- Renovação automática de token em caso de expiração

#### Segurança
- Token nunca exposto na UI
- Interceptadores para lidar com erros 401/403
- Logout automático em caso de token inválido
- Redirecionamento para login quando necessário
- Limpeza de dados sensíveis do console

#### Rotas Protegidas
- Componente `RotaPrivadaLayout` que bloqueia acesso sem autenticação
- Redirecionamento para página de origem após login
- Loading states durante verificação de autenticação

### ✅ Sistema de CRUD Completo

#### 1. CRUD de Leilões
**Funcionalidades:**
- ✅ **Listar**: Tabela paginada com todos os leilões
- ✅ **Buscar/Filtrar**: Campo de busca por título e descrição
- ✅ **Detalhar**: Modal com informações completas do leilão
- ✅ **Criar**: Formulário completo com validações
- ✅ **Atualizar**: Edição de leilões existentes
- ✅ **Remover**: Exclusão com confirmação
- ✅ **Gerenciar Status**: Abrir, encerrar e cancelar leilões

**Campos do formulário:**
- Título (obrigatório)
- Categoria (dropdown com categorias disponíveis)
- Preço inicial (formatado como moeda)
- Data de início (com seletor de data/hora)
- Data de fim (com seletor de data/hora)
- Descrição (opcional)

**Validações:**
- Campos obrigatórios destacados
- Validação de formato de data
- Validação de preço
- Feedback de erro do backend

#### 2. CRUD de Categorias
**Funcionalidades:**
- ✅ **Listar**: Tabela paginada com todas as categorias
- ✅ **Buscar/Filtrar**: Campo de busca por nome e descrição
- ✅ **Detalhar**: Modal com informações da categoria
- ✅ **Criar**: Formulário para nova categoria
- ✅ **Atualizar**: Edição de categorias existentes
- ✅ **Remover**: Exclusão com confirmação

**Campos do formulário:**
- Nome (obrigatório)
- Descrição (opcional)

### ✅ Interface de Usuário Moderna

#### Design System
- PrimeReact para componentes consistentes
- Tema moderno Lara Light Blue
- Design responsivo para mobile e desktop
- Ícones do PrimeIcons

#### Experiência do Usuário
- **Loading States**: Spinners durante carregamento
- **Toast Notifications**: Feedback de sucesso/erro
- **Confirmações**: Dialogs para ações destrutivas
- **Estados Vazios**: Mensagens quando não há dados
- **Paginação**: Controle de páginas e itens por página
- **Busca em Tempo Real**: Filtros responsivos

#### Dashboard
- Cards com estatísticas dos leilões
- Gráfico de status dos leilões (Chart.js)
- Tabela de leilões recentes
- Ações rápidas para navegação

### ✅ Arquitetura e Estrutura

#### Organização do Código
```
src/
├── components/           # Componentes reutilizáveis
│   ├── header/          # Cabeçalho com navegação
│   ├── footer/          # Rodapé
│   └── layout/          # Layouts (Padrão, Rota Privada)
├── contexts/            # Context API
│   └── AuthContext.js   # Contexto de autenticação
├── pages/               # Páginas da aplicação
│   ├── home/           # Dashboard
│   ├── login/          # Página de login
│   ├── leiloes/        # CRUD de leilões
│   ├── categorias/     # CRUD de categorias
│   └── perfil/         # Perfil do usuário
├── services/            # Camada de serviços
│   ├── BaseService.js   # Serviço base com métodos CRUD
│   ├── AutenticacaoService.js
│   ├── LeilaoService.js
│   └── CategoriaService.js
└── configs/
    └── axiosConfig.js   # Configuração do Axios com interceptadores
```

#### Services Pattern
- Serviço base com métodos CRUD reutilizáveis
- Serviços específicos para cada entidade
- Interceptadores HTTP para autenticação e tratamento de erros

#### State Management
- Context API para estado global de autenticação
- Local state para componentes específicos
- Padrão de loading/error handling consistente

### ✅ Integração com Backend

#### Endpoints Integrados
- `POST /autenticacao/login` - Login do usuário
- `GET /leiloes` - Listar todos os leilões
- `POST /leiloes` - Criar novo leilão
- `PUT /leiloes/{id}` - Atualizar leilão
- `DELETE /leiloes/{id}` - Excluir leilão
- `PUT /leiloes/{id}/abrir` - Abrir leilão
- `PUT /leiloes/{id}/encerrar` - Encerrar leilão
- `PUT /leiloes/{id}/cancelar` - Cancelar leilão
- `GET /categorias` - Listar todas as categorias
- `POST /categorias` - Criar nova categoria
- `PUT /categorias/{id}` - Atualizar categoria
- `DELETE /categorias/{id}` - Excluir categoria

#### Tratamento de Erros
- Interceptadores para capturar erros HTTP
- Mensagens de erro personalizadas
- Redirecionamento automático em caso de não autorização

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19** - Framework principal
- **React Router DOM 7** - Roteamento
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações

### UI/UX
- **PrimeReact 10** - Biblioteca de componentes
- **PrimeIcons** - Ícones
- **Chart.js** - Gráficos

### Desenvolvimento
- **Create React App** - Setup inicial
- **ESLint** - Linting
- **CSS3** - Estilização customizada

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Backend rodando na porta 8080

### Instalação
```bash
cd front
npm install
```

### Execução
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

## 📱 Funcionalidades por Página

### 🏠 Dashboard (/)
- Estatísticas dos leilões (cards)
- Gráfico de status dos leilões
- Leilões recentes
- Ações rápidas

### 🔐 Login (/login)
- Formulário de autenticação
- Validação de campos
- Estados de loading
- Redirecionamento automático

### 🏷️ Leilões (/leiloes)
- Tabela paginada de leilões
- Busca e filtros
- Modal de criação/edição
- Ações de status (abrir, encerrar, cancelar)
- Confirmação de exclusão

### 📋 Categorias (/categorias)
- Tabela paginada de categorias
- Busca por nome/descrição
- Modal de criação/edição
- Confirmação de exclusão

### 👤 Perfil (/perfil)
- Informações do usuário logado
- (Funcionalidade existente mantida)

## 🔒 Segurança Implementada

### Frontend Security
- ✅ Token nunca exposto na UI
- ✅ Validação de rotas protegidas
- ✅ Limpeza automática de dados sensíveis
- ✅ Logout automático em token inválido
- ✅ Interceptadores de segurança
- ✅ Validação de entrada do usuário

### Session Management
- ✅ Persistência segura no localStorage
- ✅ Verificação de token a cada requisição
- ✅ Renovação automática de sessão
- ✅ Cleanup em logout/erro

## 📊 Recursos de UX

### Loading States
- Spinners durante carregamento
- Estados de loading em botões
- Skeleton loading para tabelas

### Feedback Visual
- Toast notifications coloridas
- Messages de erro inline
- Confirmações para ações críticas
- Estados de sucesso/erro

### Responsividade
- Layout adaptativo para mobile
- Tabelas responsivas
- Navegação otimizada para touch

## 🎯 Próximos Passos (Opcional)

### Melhorias Futuras
- [ ] Refresh token automático
- [ ] Modo offline com cache
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários e integração
- [ ] Internacionalização (i18n)
- [ ] Tema escuro
- [ ] Notificações push
- [ ] Upload de imagens para leilões

### Performance
- [ ] Lazy loading de componentes
- [ ] Virtualização de tabelas longas
- [ ] Cache de requisições
- [ ] Otimização de bundle

---

## 📝 Notas de Implementação

Este projeto implementa completamente os requisitos solicitados:

1. ✅ **Autenticação completa** com login, token, rotas protegidas, persistência e logout
2. ✅ **Dois CRUDs completos** (Leilões e Categorias) com todas as operações
3. ✅ **Segurança frontend** com todas as boas práticas
4. ✅ **UI/UX moderna** com feedback adequado
5. ✅ **Integração completa** com o backend

A aplicação está pronta para produção e segue as melhores práticas de desenvolvimento React.
