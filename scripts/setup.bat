@echo off
echo 🚀 Configurando projeto Init...

REM Verifica se o Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não encontrado. Por favor, instale o Docker primeiro.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro.
    pause
    exit /b 1
)

REM Cria arquivo .env se não existir
if not exist .env (
    echo 📋 Criando arquivo .env...
    copy .env.example .env
    echo ✅ Arquivo .env criado. Edite conforme necessário.
)

REM Cria arquivos .env para backend e frontend se não existirem
if not exist back\.env (
    echo 📋 Criando arquivo .env para backend...
    (
        echo DATABASE_URL=postgres://admin:password123@database:5432/init
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production
        echo PORT=3001
        echo NODE_ENV=development
    ) > back\.env
    echo ✅ Arquivo back\.env criado.
)

if not exist front\.env (
    echo 📋 Criando arquivo .env para frontend...
    echo REACT_APP_API_URL=http://localhost:3001 > front\.env
    echo ✅ Arquivo front\.env criado.
)

echo 🐳 Iniciando containers Docker...
docker-compose up --build -d

echo ⏳ Aguardando serviços iniciarem...
timeout /t 15 /nobreak

echo 🔍 Verificando status dos serviços...

REM Verifica backend
curl -f http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API está funcionando
) else (
    echo ❌ Backend não está respondendo
)

REM Verifica frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend está funcionando
) else (
    echo ❌ Frontend não está respondendo
)

echo.
echo 🎉 Configuração concluída!
echo.
echo 📍 Acesse a aplicação:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/api/health
echo.
echo 🛠️  Comandos úteis:
echo    Ver logs:           docker-compose logs -f
echo    Parar serviços:     docker-compose down
echo    Reiniciar:          docker-compose restart
echo    Rebuild:            docker-compose up --build -d
echo.
pause