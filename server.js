/**
 * FinLife AI — Servidor de Proxy Local
 * Resolve o bloqueio de CORS da NVIDIA NIM API.
 * Usa apenas módulos nativos do Node.js — sem npm install.
 *
 * Como usar:
 *   node server.js
 *
 * Acesse em: http://localhost:3000
 */

"use strict";

const http  = require("http");
const https = require("https");
const fs    = require("fs");
const path  = require("path");

// ─── Lê .env ────────────────────────────────────────────────────────────────

const ENV = {};
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, "utf8").split(/\r?\n/).forEach(line => {
        const idx = line.indexOf("=");
        if (idx > 0 && !line.startsWith("#")) {
            ENV[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
    });
}

const DEFAULT_KEY  = ENV.NVIDIA_NIM_API_KEY  || "";
const NIM_MODEL    = ENV.NVIDIA_NIM_MODEL_ID  || "openai/gpt-4o-mini";
const NIM_HOST     = "integrate.api.nvidia.com";
const NIM_PATH     = "/v1/chat/completions";
const PORT         = parseInt(ENV.PORT || "3000", 10);

// ─── MIME types ──────────────────────────────────────────────────────────────

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".ico":  "image/x-icon",
    ".png":  "image/png",
    ".svg":  "image/svg+xml",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sendJSON(res, status, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(body);
}

function setCORSHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin",  "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Override-Key");
}

// ─── Proxy para NVIDIA NIM (com retry automático) ────────────────────────────

const MAX_RETRIES   = 3;
const RETRY_DELAY   = 1500; // ms

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function proxyToNIM(req, res) {
    let rawBody = "";
    req.on("data", chunk => { rawBody += chunk; });
    req.on("end", () => {
        let payload;
        try { payload = JSON.parse(rawBody); }
        catch { sendJSON(res, 400, { error: "JSON inválido no corpo da requisição." }); return; }

        // API key: prioriza chave customizada do usuário (X-Override-Key), depois a do .env
        const apiKey = req.headers["x-override-key"] || DEFAULT_KEY;
        if (!apiKey) {
            sendJSON(res, 401, { error: "Nenhuma API key configurada. Adicione NVIDIA_NIM_API_KEY no arquivo .env." });
            return;
        }

        // Garante que o model está correto
        payload.model = NIM_MODEL;
        if (payload.stream !== false) payload.stream = true;

        attemptProxy(payload, apiKey, res, 0);
    });
}

async function attemptProxy(payload, apiKey, res, attempt) {
    const bodyStr = JSON.stringify(payload);

    const options = {
        hostname: NIM_HOST,
        path:     NIM_PATH,
        method:   "POST",
        headers: {
            "Content-Type":   "application/json",
            "Authorization":  `Bearer ${apiKey}`,
            "Content-Length": Buffer.byteLength(bodyStr)
        }
    };

    return new Promise((resolve) => {
        const proxyReq = https.request(options, (proxyRes) => {
            // Se recebeu 500 e ainda tem tentativas, faz retry
            if (proxyRes.statusCode === 500 && attempt < MAX_RETRIES - 1) {
                // Consome o corpo para liberar a conexão
                let errBody = "";
                proxyRes.on("data", chunk => { errBody += chunk; });
                proxyRes.on("end", async () => {
                    console.warn(`[PROXY RETRY] Tentativa ${attempt + 1} falhou (500). Retentando em ${RETRY_DELAY}ms...`);
                    console.warn(`[PROXY RETRY] Resposta: ${errBody.slice(0, 200)}`);
                    await sleep(RETRY_DELAY);
                    attemptProxy(payload, apiKey, res, attempt + 1).then(resolve);
                });
                return;
            }

            // Repassa status e headers SSE
            res.writeHead(proxyRes.statusCode, {
                "Content-Type":  proxyRes.headers["content-type"] || "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection":    "keep-alive",
            });
            // Faz pipe direto do stream da NVIDIA para o cliente
            proxyRes.pipe(res);
            proxyRes.on("end", () => { res.end(); resolve(); });
        });

        proxyReq.on("error", async (err) => {
            console.error("[PROXY ERROR]", err.message);
            // Retry em erros de conexão também
            if (attempt < MAX_RETRIES - 1) {
                console.warn(`[PROXY RETRY] Erro de conexão na tentativa ${attempt + 1}. Retentando...`);
                await sleep(RETRY_DELAY);
                attemptProxy(payload, apiKey, res, attempt + 1).then(resolve);
            } else if (!res.headersSent) {
                sendJSON(res, 502, { error: `Falha ao contactar a NVIDIA NIM após ${MAX_RETRIES} tentativas: ${err.message}` });
                resolve();
            }
        });

        proxyReq.write(bodyStr);
        proxyReq.end();
    });
}

// ─── Servidor de arquivos estáticos ──────────────────────────────────────────

function serveStatic(req, res) {
    let reqPath = req.url.split("?")[0]; // remove query string
    if (reqPath === "/") reqPath = "/index.html";

    const filePath = path.join(__dirname, reqPath);

    // Segurança: impede path traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Acesso negado.");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end(`Arquivo não encontrado: ${reqPath}`);
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, {
            "Content-Type": MIME[ext] || "text/plain",
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache"
        });
        res.end(data);
    });
}

// ─── Roteador principal ───────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
    setCORSHeaders(res);

    // Preflight CORS
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Rota da API proxy
    if (req.method === "POST" && req.url === "/api/chat") {
        proxyToNIM(req, res);
        return;
    }

    // Arquivos estáticos (GET)
    if (req.method === "GET") {
        serveStatic(req, res);
        return;
    }

    res.writeHead(405);
    res.end("Método não permitido.");
});

// ─── Inicialização ────────────────────────────────────────────────────────────

server.listen(PORT, "127.0.0.1", () => {
    console.log("\n  ╔══════════════════════════════════════╗");
    console.log(`  ║  FinLife AI — http://localhost:${PORT}   ║`);
    console.log("  ╠══════════════════════════════════════╣");
    console.log(`  ║  Modelo: ${NIM_MODEL.padEnd(28)}║`);
    console.log(`  ║  API Key: ${DEFAULT_KEY ? "✓ Configurada (.env)".padEnd(27) : "✗ NÃO encontrada!".padEnd(27)}║`);
    console.log("  ╚══════════════════════════════════════╝\n");

    if (!DEFAULT_KEY) {
        console.warn("  ⚠  AVISO: NVIDIA_NIM_API_KEY não encontrada no .env!\n");
    }
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`\n  ✗ Porta ${PORT} já está em uso. Altere PORT no .env ou feche o processo.\n`);
    } else {
        console.error(`\n  ✗ Erro no servidor: ${err.message}\n`);
    }
    process.exit(1);
});
