@echo off
echo ===================================================
echo   FinLife AI - Enviando para o GitHub
echo ===================================================
echo.

:: Inicializa o repositorio Git se necessario
if not exist .git (
    echo [INFO] Inicializando repositorio Git local...
    git init
    git branch -M main
)

:: Remove remote origin anterior (se houver) e adiciona o novo URL fornecido
echo [INFO] Configurando o repositorio remoto...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/pcdosilva01-spec/FINAN-AI.git

:: Adiciona arquivos ao commit (o .gitignore exclui .env automaticamente)
echo [INFO] Adicionando arquivos ao index do Git...
git add .

:: Commit
set /p msg="Digite a mensagem do commit (ou pressione Enter para 'update'): "
if "%msg%"=="" set msg="update"

git commit -m "%msg%"

:: Push
echo [INFO] Enviando para o GitHub (branch main)...
git push -u origin main --force

echo.
echo ===================================================
echo   Concluido! Pressione qualquer tecla para fechar.
echo ===================================================
pause
