# 🚀 Guia de Deploy - Init Platform

Este documento fornece instruções detalhadas para fazer deploy da aplicação em diferentes serviços de hospedagem.

## 📋 Visão Geral

A aplicação Init é composta por:
- **Frontend React**: Pode ser hospedado em Vercel, Netlify, etc.
- **Backend Node.js**: Pode ser hospedado em Railway, Render, Heroku, etc.
- **Banco PostgreSQL**: Pode usar bancos gerenciados dos próprios serviços

## 🎯 Deploy Completo (Recomendado)

### Opção 1: Railway (Backend + Banco) + Vercel (Frontend)

#### 1. Deploy do Backend no Railway

1. **Crie uma conta** em [railway.app](https://railway.app)

2. **Conecte seu repositório**:
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório

3. **Configure as variáveis de ambiente**:
   ```
   NODE_ENV=production
   JWT_SECRET=sua-chave-super-secreta-aqui-mude-em-producao
   PORT=3001
   ```

4. **Adicione PostgreSQL**:
   - No painel do Railway, clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
   - O Railway irá gerar automaticamente a `DATABASE_URL`

5. **Configure o deploy**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

#### 2. Deploy do Frontend no Vercel

1. **Crie uma conta** em [vercel.com](https://vercel.com)

2. **Conecte seu repositório**:
   - Clique em "New Project"
   - Selecione seu repositório do GitHub

3. **Configure as variáveis de ambiente**:
   ```
   REACT_APP_API_URL=https://sua-api-railway.up.railway.app
   ```

4. **Configure o deploy**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### Opção 2: Render (Completo)

#### 1. Deploy do Banco de Dados

1. **Crie uma conta** em [render.com](https://render.com)

2. **Crie um PostgreSQL**:
   - Dashboard → New → PostgreSQL
   - Nome: `init-db`
   - Plano gratuito disponível

#### 2. Deploy do Backend

1. **Crie um Web Service**:
   - Dashboard → New → Web Service
   - Conecte seu repositório

2. **Configure o serviço**:
   ```
   Name: init-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Adicione variáveis de ambiente**:
   ```
   NODE_ENV=production
   JWT_SECRET=sua-chave-super-secreta
   DATABASE_URL=[URL do PostgreSQL criado acima]
   ```

#### 3. Deploy do Frontend

1. **Crie um Static Site**:
   - Dashboard → New → Static Site
   - Conecte seu repositório

2. **Configure o site**:
   ```
   Name: init-frontend
   Root Directory: frontend
   Build Command: npm run build
   Publish Directory: build
   ```

3. **Adicione variáveis de ambiente**:
   ```
   REACT_APP_API_URL=https://init-backend.onrender.com
   ```

## 🏗️ Deploy com Docker

### Opção 3: DigitalOcean App Platform

1. **Crie uma conta** em [digitalocean.com](https://digitalocean.com)

2. **Crie uma nova app**:
   - Apps → Create App
   - Conecte seu repositório GitHub

3. **Configure os serviços**:

   **Backend:**
   ```yaml
   name: init-backend
   source_dir: /backend
   dockerfile_path: backend/Dockerfile
   http_port: 3001
   environment_slug: node-js
   instance_count: 1
   instance_size_slug: basic-xxs
   envs:
     - key: NODE_ENV
       value: production
     - key: JWT_SECRET
       value: sua-chave-secreta
   ```

   **Frontend:**
   ```yaml
   name: init-frontend
   source_dir: /frontend
   dockerfile_path: frontend/Dockerfile
   http_port: 3000
   environment_slug: node-js
   instance_count: 1
   instance_size_slug: basic-xxs
   envs:
     - key: REACT_APP_API_URL
       value: ${init-backend.PUBLIC_URL}
   ```

4. **Adicione PostgreSQL**:
   - Na seção "Database", adicione PostgreSQL
   - Configure a `DATABASE_URL` no backend

## 💾 Configurações de Banco de Dados

### Usando Bancos Gerenciados

#### Supabase (Gratuito)
```bash
# URL de exemplo
DATABASE_URL=postgresql://username:password@db.xxxx.supabase.co:5432/postgres
```

#### Neon (Gratuito)
```bash
# URL de exemplo  
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb
```

#### ElephantSQL (Gratuito)
```bash
# URL de exemplo
DATABASE_URL=postgres://username:password@raja.db.elephantsql.com/database
```

## 🔧 Configurações Adicionais

### Configurar CORS para Produção

No arquivo `backend/server.js`, atualize:

```javascript
app.use(cors({
  origin: [
    'https://seu-dominio-frontend.vercel.app',
    'https://seu-dominio-frontend.netlify.app'
  ],
  credentials: true
}));
```

### Configurar Headers de Segurança

Adicione no `backend/server.js`:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## 📊 Monitoramento

### Logs de Produção

Para Railway:
```bash
railway logs
```

Para Render:
- Acesse o dashboard → Logs

Para Vercel:
- Acesse o dashboard → Functions → View Logs

## 🚨 Checklist de Produção

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET alterado para produção
- [ ] CORS configurado com domínios corretos
- [ ] Database URL configurada
- [ ] SSL/HTTPS habilitado
- [ ] Logs configurados
- [ ] Health checks funcionando
- [ ] Backup do banco configurado (se aplicável)

## 🆘 Troubleshooting de Deploy

### Erro: "Cannot connect to database"
```bash
# Verifique a DATABASE_URL
echo $DATABASE_URL

# Teste a conexão
psql $DATABASE_URL -c "SELECT 1;"
```

### Erro: "CORS blocked"
- Verifique se o domínio frontend está na lista de CORS
- Confirme se está usando HTTPS em produção

### Erro: "Build failed"
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Health check failed"
- Verifique se a porta está correta
- Confirme se `/api/health` está respondendo

## 🔄 Atualizações

Para atualizar a aplicação em produção:

1. **Git push** para a branch main
2. Os serviços farão **redeploy automático**
3. **Monitore os logs** para verificar se tudo funcionou
4. **Teste a aplicação** após o deploy

## 📞 Suporte

Se encontrar problemas no deploy:

1. Verifique os logs do serviço
2. Consulte a documentação oficial do provedor
3. Teste localmente primeiro
4. Abra uma issue no repositório com detalhes do erro