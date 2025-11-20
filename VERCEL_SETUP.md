# Configuração MongoDB Atlas na Vercel

## Problema Comum: Erro SSL/TLS

Se você está enfrentando erros SSL/TLS ao conectar ao MongoDB Atlas na Vercel, siga estas etapas:

## 1. Verificar a String de Conexão

A string de conexão do MongoDB Atlas deve usar o protocolo `mongodb+srv://`:

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Importante:**

- Use `mongodb+srv://` (não `mongodb://`)
- O protocolo `mongodb+srv://` automaticamente habilita TLS/SSL
- Não adicione `tls=true` manualmente na string

## 2. Configurar Network Access no MongoDB Atlas

1. Acesse o MongoDB Atlas Dashboard
2. Vá em **Network Access** (ou **IP Access List**)
3. Adicione `0.0.0.0/0` para permitir conexões de qualquer IP
   - Ou adicione os IPs específicos da Vercel se preferir

## 3. Variáveis de Ambiente na Vercel

Configure as seguintes variáveis de ambiente no painel da Vercel:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB=library
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```

## 4. Verificar Credenciais

- Certifique-se de que o usuário do banco de dados tem as permissões corretas
- Verifique se a senha está correta (sem caracteres especiais codificados incorretamente)
- O nome do banco de dados deve existir no cluster

## 5. Testar a Conexão

Após configurar, faça o deploy novamente na Vercel. O código agora:

- Normaliza automaticamente a URI para usar `mongodb+srv://` se necessário
- Cria conexões frescas em cada invocação serverless (Vercel)
- Configura timeouts apropriados para ambientes serverless
- Gerencia conexões de forma otimizada para Vercel

## Troubleshooting

Se o erro persistir:

1. **Verifique os logs da Vercel** para ver a mensagem de erro completa
2. **Teste a conexão localmente** com a mesma string de conexão
3. **Verifique se o cluster está ativo** no MongoDB Atlas
4. **Confirme que a versão do Node.js** na Vercel é compatível (18+)

## Exemplo de String de Conexão Correta

```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/library?retryWrites=true&w=majority
```

**NÃO use:**

```
mongodb://myuser:mypassword@cluster0.xxxxx.mongodb.net:27017/library?tls=true
```

O protocolo `mongodb+srv://` é obrigatório para MongoDB Atlas e gerencia TLS automaticamente.
