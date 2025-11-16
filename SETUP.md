# Setup Instructions

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/library-system

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Instalação

```bash
npm install
```

## Executar o Projeto

```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3000

## Problemas Resolvidos

1. ✅ Conflitos de dependências do Vitest resolvidos
2. ✅ Compatibilidade entre Next.js 15, React 18 e next-auth
3. ✅ Pacote `@tailwindcss/postcss` instalado
4. ✅ Importação `tw-animate-css` removida (não existe)
5. ✅ Configuração de paths do TypeScript ajustada para `@/*`
6. ✅ Arquivo `auth.ts` movido para `src/`
