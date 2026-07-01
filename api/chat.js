const https = require("https");

module.exports = (req, res) => {
    // CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Override-Key");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
        return;
    }

    let rawBody = "";
    req.on("data", chunk => { rawBody += chunk; });
    req.on("end", () => {
        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "JSON inválido" }));
            return;
        }

        const apiKey = req.headers["x-override-key"] || process.env.NVIDIA_NIM_API_KEY;
        if (!apiKey) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Nenhuma API key configurada." }));
            return;
        }

        payload.model = process.env.NVIDIA_NIM_MODEL_ID || "openai/gpt-4o-mini";
        if (payload.stream !== false) payload.stream = true;
        if (typeof payload.max_tokens !== "number") payload.max_tokens = 700;

        const bodyStr = JSON.stringify(payload);

        const options = {
            hostname: "integrate.api.nvidia.com",
            path: "/v1/chat/completions",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "Content-Length": Buffer.byteLength(bodyStr)
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                "Content-Type": proxyRes.headers["content-type"] || "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            });
            proxyRes.pipe(res);
            proxyRes.on("end", () => res.end());
        });

        proxyReq.on("error", (err) => {
            if (!res.headersSent) {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: `Falha: ${err.message}` }));
            }
        });

        proxyReq.write(bodyStr);
        proxyReq.end();
    });
};
