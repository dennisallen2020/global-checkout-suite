# Global Checkout - Sistema de Pagamento Avançado

## 🚀 Sobre o Projeto

O Global Checkout é uma solução completa de checkout/pagamento desenvolvida em React + TypeScript com recursos avançados de:

- ✅ **Checkout em uma página** - Fluxo otimizado para conversão
- ✅ **Multi-idioma** - Suporte a 15+ idiomas
- ✅ **Multi-moeda** - Detecção automática de país/moeda
- ✅ **Geolocalização** - Preços e idioma automáticos
- ✅ **Integração Stripe** - Pagamentos seguros
- ✅ **Painel Admin** - Gestão completa
- ✅ **Recursos de Segurança** - Proteção anti-fraud
- ✅ **Design Responsivo** - Funciona em todos os dispositivos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **UI/UX**: shadcn/ui, Tailwind CSS
- **Pagamentos**: Stripe
- **Formulários**: React Hook Form, Zod
- **Internacionalização**: Sistema próprio
- **Deployment**: Vercel/Netlify ready

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Stripe (para pagamentos)

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd global-checkout
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
```

### 4. Configure o Stripe
1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha suas chaves API (Publishable Key e Secret Key)
3. Configure no arquivo `.env.local`

### 5. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI (shadcn)
│   ├── admin/          # Componentes administrativos
│   ├── CheckoutSystem.tsx
│   ├── CheckoutForm.tsx
│   └── AdminPanel.tsx
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── i18n/               # Internacionalização
├── config/             # Configurações
└── styles/             # Estilos globais
```

## 🎯 Funcionalidades Principais

### Checkout
- Formulário de dados do cliente
- Integração com Stripe
- Validação em tempo real
- Múltiplas moedas
- Preços dinâmicos por localização

### Painel Administrativo
- Dashboard com métricas
- Configuração de produtos
- Personalização visual
- Gerenciamento de segurança
- Relatórios de vendas

### Recursos Avançados
- Detecção automática de país/idioma
- Conversão de moedas
- Sistema de notificações
- Recursos de segurança
- Responsividade completa

## 🔧 Configuração Avançada

### Stripe
```typescript
// Configurar chaves do Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Personalização
```typescript
// src/config/checkout-config.ts
export const defaultConfig = {
  productName: "Seu Produto",
  productDescription: "Descrição do produto",
  originalPrice: 297.00,
  salePrice: 97.00,
  currency: "USD",
  // ... outras configurações
};
```

## 📱 Páginas Disponíveis

- `/` - Checkout principal
- `/admin` - Painel administrativo
- `/404` - Página não encontrada

## 🔒 Segurança

O sistema inclui recursos de segurança como:
- Proteção contra debugging
- Bloqueio de ferramentas de desenvolvedor
- Validação de dados
- Tokens JWT (quando backend implementado)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload da pasta 'dist' para Netlify
```

### Outros Provedores
```bash
npm run build
# Upload da pasta 'dist' para seu provedor
```

## 📊 Analytics e Monitoramento

O sistema está preparado para:
- Google Analytics
- Pixel do Facebook
- Métricas de conversão
- Logs de erro (Sentry)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte técnico:
- 📧 Email: suporte@exemplo.com
- 📞 WhatsApp: +55 11 99999-9999
- 💬 Discord: [Link do servidor]

## 📈 Roadmap

- [ ] Backend Node.js completo
- [ ] Banco de dados PostgreSQL
- [ ] Sistema de usuários
- [ ] API RESTful
- [ ] Webhooks do Stripe
- [ ] Testes automatizados
- [ ] Docker containerization
- [ ] CI/CD Pipeline

## 🏆 Recursos Premium

Para a versão completa com backend:
- Sistema de usuários
- Banco de dados
- API completa
- Webhooks
- Analytics avançados
- Suporte técnico

Entre em contato para mais informações sobre a versão premium.

---

**Desenvolvido com ❤️ para maximizar suas conversões de venda**
