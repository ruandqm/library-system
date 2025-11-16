#!/bin/bash

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "Criando arquivo .env.local..."
    cat > .env.local << 'ENVEOF'
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/library-system

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
ENVEOF
    echo "✅ Arquivo .env.local criado!"
fi

# Limpar cache do Next.js
echo "Limpando cache do Next.js..."
rm -rf .next

# Iniciar o servidor
echo "Iniciando servidor..."
npm run dev
