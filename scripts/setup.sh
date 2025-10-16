#!/bin/bash

# Script de configuração inicial do projeto Init
echo "🚀 Configurando projeto Init..."

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Cria arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📋 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Edite conforme necessário."
fi

# Cria arquivos .env para backend e frontend se não existirem
if [ ! -f back/.env ]; then
    echo "📋 Criando arquivo .env para backend..."
    cat > back/.env << EOF
DATABASE_URL=postgres://admin:password123@database:5432/init
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
NODE_ENV=development
EOF
    echo "✅ Arquivo back/.env criado."
fi

if [ ! -f front/.env ]; then
    echo "📋 Criando arquivo .env para frontend..."
    cat > front/.env << EOF
REACT_APP_API_URL=http://localhost:3001
EOF
    echo "✅ Arquivo front/.env criado."
fi

echo "🐳 Iniciando containers Docker..."
docker-compose up --build -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verifica se os serviços estão rodando
echo "🔍 Verificando status dos serviços..."

# Verifica banco de dados
if docker-compose exec -T database pg_isready -U admin -d init > /dev/null 2>&1; then
    echo "✅ Banco de dados PostgreSQL está funcionando"
else
    echo "❌ Problema com o banco de dados"
fi

# Verifica backend
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend API está funcionando"
else
    echo "❌ Backend não está respondendo"
fi

# Verifica frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend está funcionando"
else
    echo "❌ Frontend não está respondendo"
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📍 Acesse a aplicação:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/api/health"
echo ""
echo "🛠️  Comandos úteis:"
echo "   Ver logs:           docker-compose logs -f"
echo "   Parar serviços:     docker-compose down"
echo "   Reiniciar:          docker-compose restart"
echo "   Rebuild:            docker-compose up --build -d"
echo ""