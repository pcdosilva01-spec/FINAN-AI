"use strict";

const https = require("https");

const NIM_HOST  = "integrate.api.nvidia.com";
const NIM_PATH  = "/v1/chat/completions";
const NIM_MODEL = process.env.NVIDIA_NIM_MODEL_ID || "openai/gpt-4o-mini";

function sendJSON(res, status, obj) {
    if (res.headersSent) return;
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
}

module.exports = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin",  "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Override-Key");

    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    if (req.method !== "POST")    { sendJSON(res, 405, { error: "Método não permitido." }); return; }

    let rawBody = "";
    req.on("data", chunk => { rawBody += chunk; });
    req.on("end", () => {
        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch {
            sendJSON(res, 400, { error: "JSON inválido no corpo da requisição." });
            return;
        }

        const apiKey = req.headers["x-override-key"] || process.env.NVIDIA_NIM_API_KEY;
        if (!apiKey) {
            sendJSON(res, 401, { error: "API key não configurada. Defina NVIDIA_NIM_API_KEY nas variáveis de ambiente." });
            return;
        }

        payload.model = NIM_MODEL;
        if (payload.stream !== false) payload.stream = true;

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

        const proxyReq = https.request(options, (proxyRes) => {
            if (res.headersSent) return;
            res.writeHead(proxyRes.statusCode, {
                "Content-Type":  proxyRes.headers["content-type"] || "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection":    "keep-alive"
            });
            proxyRes.pipe(res);
            proxyRes.on("end", () => { if (!res.writableEnded) res.end(); });
        });

        proxyReq.on("error", (err) => {
            console.error("[api/chat] Erro no proxy:", err.message);
            sendJSON(res, 502, { error: `Falha ao contactar o serviço de IA: ${err.message}` });
        });

        proxyReq.write(bodyStr);
        proxyReq.end();
    });
};
