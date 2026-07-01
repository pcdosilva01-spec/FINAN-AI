"use strict";

// ============================================================================
// CONSTANTES DE CONFIGURAÇÃO E MODELO
// ============================================================================

const PROXY_URL = "/api/chat";

const PROFESSIONS = {
    estudante:    "Estudante / Estagiário",
    desenvolvedor:"Desenvolvedor de Software",
    designer:     "Designer / Criativo",
    medico:       "Médico / Profissional de Saúde",
    autonomo:     "Autônomo / Profissional Liberal",
    servidor:     "Servidor Público",
    comerciante:  "Comerciante / Empreendedor"
};

const DREAMS = {
    imovel:        "comprar imóvel próprio",
    carro:         "adquirir um veículo",
    viagem:        "fazer uma grande viagem ou intercâmbio",
    negocio:       "abrir o próprio negócio ou startup",
    independencia: "conquistar independência financeira",
    aposentadoria: "garantir uma aposentadoria tranquila"
};

const STRUGGLES = {
    gastos_impulso: "compras por impulso / consumo supérfluo",
    sem_controle:   "falta de controle ou planilha de gastos",
    medo_investir:  "medo de começar a investir / não saber onde aplicar",
    renda_baixa:    "renda atual muito baixa",
    dividas:        "dívidas ativas ou contas atrasadas"
};

const LOCAL_FALLBACK_PROFILES = [
    { terms: ["professor", "professora", "docente", "tutor", "educador", "historia", "matematica", "ingles", "portugues"], salaryAvg: 4300, costAvg: 2600, struggle: "sem_controle", dream: "imovel" },
    { terms: ["medico", "medica", "médico", "médica"], salaryAvg: 12000, costAvg: 7200, struggle: "dividas", dream: "aposentadoria" },
    { terms: ["enfermeiro", "enfermeira", "saude", "saude", "hospital", "clinica"], salaryAvg: 5800, costAvg: 3600, struggle: "sem_controle", dream: "viagem" },
    { terms: ["dentista", "odontologista"], salaryAvg: 10500, costAvg: 6500, struggle: "dividas", dream: "aposentadoria" },
    { terms: ["psicologo", "psicóloga", "psicologa", "terapeuta"], salaryAvg: 6500, costAvg: 3900, struggle: "medo_investir", dream: "independencia" },
    { terms: ["fisioterapeuta", "fisioterapia"], salaryAvg: 5200, costAvg: 3200, struggle: "sem_controle", dream: "viagem" },
    { terms: ["advogado", "advogada", "juridico", "jurídico", "advocacia", "defensor", "promotor"], salaryAvg: 8200, costAvg: 5200, struggle: "sem_controle", dream: "imovel" },
    { terms: ["contador", "contadora", "contabilista", "contabilidade", "analista financeiro", "financeiro"], salaryAvg: 6100, costAvg: 3800, struggle: "sem_controle", dream: "imovel" },
    { terms: ["engenheiro", "engenheira", "engenharia", "arquiteteto", "arquiteto", "arquiteta", "arquitetura"], salaryAvg: 9000, costAvg: 5800, struggle: "medo_investir", dream: "imovel" },
    { terms: ["desenvolvedor", "desenvolvedora", "programador", "programadora", "dev", "software", "front-end", "frontend", "back-end", "backend", "fullstack", "full stack", "analista de sistemas", "sysadmin", "suporte tecnico"], salaryAvg: 9200, costAvg: 6200, struggle: "medo_investir", dream: "independencia" },
    { terms: ["designer", "designer grafico", "designer ui", "designer ux", "ux", "ui", "ilustrador", "ilustradora", "publicitario", "publicitária"], salaryAvg: 5300, costAvg: 3400, struggle: "sem_controle", dream: "viagem" },
    { terms: ["fotografo", "fotografa", "cinegrafista", "produtor de conteudo", "criador de conteudo", "social media", "marketing digital"], salaryAvg: 4200, costAvg: 2700, struggle: "sem_controle", dream: "viagem" },
    { terms: ["vendedor", "vendedora", "comerciante", "lojista", "atendente", "atendente de loja"], salaryAvg: 4500, costAvg: 3000, struggle: "sem_controle", dream: "negocio" },
    { terms: ["caixa", "balconista", "recepcionista", "assistente", "auxiliar administrativo", "administrativo", "auxiliar"], salaryAvg: 3200, costAvg: 2200, struggle: "sem_controle", dream: "imovel" },
    { terms: ["garcom", "garçon", "garconete", "balconista de bar", "atendimento"], salaryAvg: 2400, costAvg: 1700, struggle: "sem_controle", dream: "viagem" },
    { terms: ["cozinheiro", "chef", "padeiro", "confeiteiro", "culinaria"], salaryAvg: 2600, costAvg: 1900, struggle: "sem_controle", dream: "viagem" },
    { terms: ["motorista", "motoboy", "motoboy", "uber", "taxista", "caminhoneiro", "motorista de aplicativo", "entregador"], salaryAvg: 3200, costAvg: 2300, struggle: "renda_baixa", dream: "carro" },
    { terms: ["pedreiro", "eletricista", "encanador", "carpinteiro", "pintor", "mecanico", "soldador", "serralheiro", "marceneiro"], salaryAvg: 4300, costAvg: 2900, struggle: "sem_controle", dream: "imovel" },
    { terms: ["cabeleireiro", "barbeiro", "esteticista", "manicure", "maquiador", "cosmetico", "beleza"], salaryAvg: 3300, costAvg: 2200, struggle: "sem_controle", dream: "viagem" },
    { terms: ["faxineiro", "faxineira", "diarista", "zelador", "caseiro", "domestica", "domestico"], salaryAvg: 1950, costAvg: 1500, struggle: "renda_baixa", dream: "viagem" },
    { terms: ["cuidador", "cuidar", "babá", "baba", "cuidadora", "assistente pessoal"], salaryAvg: 2200, costAvg: 1550, struggle: "renda_baixa", dream: "viagem" },
    { terms: ["estudante", "estagiario", "estagiária", "aprendiz", "jovem aprendiz"], salaryAvg: 1650, costAvg: 1250, struggle: "sem_controle", dream: "viagem" },
    { terms: ["autonomo", "autônomo", "freelancer", "empreendedor", "microempreendedor", "consultor", "coach", "influenciador", "influencer"], salaryAvg: 4500, costAvg: 3100, struggle: "gastos_impulso", dream: "negocio" },
    { terms: ["servidor publico", "concursado", "publico", "servico publico", "policial", "militar", "bombeiro"], salaryAvg: 7200, costAvg: 4300, struggle: "sem_controle", dream: "imovel" },
    { terms: ["jornalista", "repórter", "redator", "editor", "assessor de imprensa"], salaryAvg: 5200, costAvg: 3300, struggle: "sem_controle", dream: "viagem" },
    { terms: ["farmaceutico", "farmaceutica", "farmaceutico", "farmacia"], salaryAvg: 6200, costAvg: 3900, struggle: "medo_investir", dream: "aposentadoria" },
    { terms: ["psicologo"], salaryAvg: 6500, costAvg: 3900, struggle: "medo_investir", dream: "independencia" },
    { terms: ["logistica", "analista logistica", "transportadora"], salaryAvg: 5200, costAvg: 3200, struggle: "sem_controle", dream: "imovel" },
    { terms: ["marketing", "analista de marketing", "coordenador marketing", "planejador"], salaryAvg: 5600, costAvg: 3500, struggle: "sem_controle", dream: "viagem" },
    { terms: ["veterinario", "veterinaria", "vet", "zootecnista"], salaryAvg: 7200, costAvg: 4500, struggle: "medo_investir", dream: "imovel" },
    { terms: ["cientista", "pesquisador", "pesquisa", "cientista de dados", "data scientist"], salaryAvg: 9800, costAvg: 6200, struggle: "medo_investir", dream: "independencia" },
    { terms: ["analista", "business analyst", "analista de negocio", "consultor de negocio"], salaryAvg: 6400, costAvg: 4000, struggle: "sem_controle", dream: "imovel" },
    { terms: ["programa", "programador"], salaryAvg: 9200, costAvg: 6200, struggle: "medo_investir", dream: "independencia" }
];

const GENERIC_FALLBACK_PROFILE = {
    salaryAvg: 3200,
    costAvg: 2200,
    struggle: "sem_controle",
    dream: "independencia"
};

function normalizeText(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "string") return NaN;

    let text = value.trim();
    if (!text) return NaN;

    text = text.replace(/R\$|BRL|\$|€|£|\s+/gi, "");
    const hasComma = text.includes(",");
    const hasDot = text.includes(".");

    if (hasComma && hasDot) {
        text = text.replace(/\./g, "").replace(/,/g, ".");
    } else if (hasComma && !hasDot) {
        const parts = text.split(",");
        if (parts.length === 2 && parts[1].length === 2) {
            text = parts.join(".");
        } else {
            text = text.replace(/,/g, "");
        }
    } else if (hasDot && !hasComma) {
        const parts = text.split(".");
        if (parts.length === 2 && parts[1].length === 3) {
            text = parts.join("");
        }
    }

    text = text.replace(/[^0-9.-]/g, "");
    const number = Number(text);
    return Number.isFinite(number) ? number : NaN;
}

function tryParseLooseJSON(raw) {
    if (raw == null) return null;
    let text = String(raw).trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();

    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) text = braceMatch[0];

    try {
        return JSON.parse(text);
    } catch {
        const relaxed = text
            .replace(/,\s*([}\]])/g, "$1")
            .replace(/([{,])\s*([a-zA-Z0-9_\-]+)\s*:/g, '$1"$2":')
            .replace(/:\s*'([^']*)'/g, ':"$1"')
            .replace(/\"'/g, '"')
            .replace(/\s*\n\s*/g, " ")
            .trim();

        try {
            return JSON.parse(relaxed);
        } catch {
            return null;
        }
    }
}

function collectHeaders(headers) {
    const result = {};
    if (!headers || typeof headers.forEach !== "function") return result;
    headers.forEach((value, key) => result[key] = value);
    return result;
}

function getLocalFallbackProfile(profession) {
    const normalized = normalizeText(profession);
    if (!normalized) return GENERIC_FALLBACK_PROFILE;

    for (const profile of LOCAL_FALLBACK_PROFILES) {
        for (const term of profile.terms) {
            const normalizedTerm = normalizeText(term);
            if (!normalizedTerm) continue;
            if (normalized === normalizedTerm || normalized.includes(` ${normalizedTerm} `) || normalized.startsWith(`${normalizedTerm} `) || normalized.endsWith(` ${normalizedTerm}`) || normalized.includes(normalizedTerm)) {
                return profile;
            }
        }
    }

    let bestMatch = null;
    let bestScore = 0;
    for (const profile of LOCAL_FALLBACK_PROFILES) {
        let score = 0;
        for (const term of profile.terms) {
            if (!term) continue;
            const normalizedTerm = normalizeText(term);
            if (normalized.includes(normalizedTerm)) score += 1;
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = profile;
        }
    }

    return bestMatch && bestScore > 0 ? bestMatch : GENERIC_FALLBACK_PROFILE;
}


// ============================================================================
// UTILITÁRIOS
// ============================================================================

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtCompact = (value) => {
    if (value >= 1000000) {
        const formatted = (value / 1000000).toFixed(1).replace(".", ",");
        return `R$ ${formatted.replace(",0", "")}M`;
    }
    if (value >= 1000) {
        const formatted = (value / 1000).toFixed(1).replace(".", ",");
        return `R$ ${formatted.replace(",0", "")}K`;
    }
    return fmt(value);
};

function el(id) { return document.getElementById(id); }

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ============================================================================
// STORAGE
// ============================================================================

const Storage = {
    KEY_STATE: "finlife_v6_state",
    KEY_API:   "finlife_v6_apikey",

    saveState(value) {
        try {
            localStorage.setItem(this.KEY_STATE, JSON.stringify(value));
        } catch (error) {
            console.warn("Falha ao salvar estado local:", error);
        }
    },

    loadState() {
        try {
            const raw = localStorage.getItem(this.KEY_STATE);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.warn("Falha ao ler estado local:", error);
            return null;
        }
    },

    clearState() {
        localStorage.removeItem(this.KEY_STATE);
    },

    saveKey(value) {
        try {
            localStorage.setItem(this.KEY_API, value);
        } catch (error) {
            console.warn("Falha ao salvar chave local:", error);
        }
    },

    loadKey() {
        return localStorage.getItem(this.KEY_API) || "";
    },

    clearKey() {
        localStorage.removeItem(this.KEY_API);
    }
};

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

const Toast = {
    _t: null,
    _i: null,

    show(type, title, body) {
        clearTimeout(this._t);
        clearInterval(this._i);

        const t = el("toast");
        t.className = `toast t-${type}`;
        el("toast-icon").textContent  = { green: "🟢", amber: "⚠️", red: "🚨", info: "💡" }[type] || "💡";
        el("toast-title").textContent = title;
        el("toast-body").textContent  = body;

        t.classList.remove("hidden");

        const fill = el("toast-bar-fill");
        fill.style.width = "100%";
        let pct = 100;
        this._i = setInterval(() => {
            pct -= 2.5;
            fill.style.width = Math.max(0, pct) + "%";
            if (pct <= 0) clearInterval(this._i);
        }, 100);

        this._t = setTimeout(() => { this.hide(); }, 4000);
    },

    hide() {
        clearTimeout(this._t);
        clearInterval(this._i);
        const t = el("toast");
        t.classList.add("hidden");
        el("toast-bar-fill").style.width = "100%";
    }
};

// ============================================================================
// ANALYZER
// ============================================================================

const Analyzer = {
    compute(p, f) {
        const surplus      = p.income - p.cost;
        const savingRate   = p.income > 0 ? surplus / p.income : 0;
        const idealReserve = p.cost * 6;
        const reservePct   = idealReserve > 0 ? Math.min(1, f.reserve / idealReserve) : 0;

        let grade = "D";
        if (surplus < 0) grade = "D";
        else if (savingRate >= 0.35 && reservePct >= 1)   grade = "A+";
        else if (savingRate >= 0.20 && reservePct >= 0.5) grade = "A";
        else if (savingRate >= 0.10)                      grade = "B";
        else if (surplus >= 0)                            grade = "C";

        let summary = "";
        let conclusion = "";

        if (grade === "A+" || grade === "A") {
            summary = "Excelente equilíbrio. Você possui sobra de caixa saudável e está construindo sua segurança.";
            conclusion = "Sofia sugere: Continue investindo e planeje a conquista do seu sonho.";
        } else if (grade === "B") {
            summary = "Caminho correto. Você economiza uma parte da renda, mas sua reserva precisa de reforço.";
            conclusion = "Sofia sugere: Reduza pequenos custos diários para acelerar seu colchão financeiro.";
        } else if (grade === "C") {
            summary = "Atenção necessária. O orçamento está muito apertado e sobra muito pouco ao fim do mês.";
            conclusion = "Sofia sugere: Evite novas parcelas e foque em economizar pelo menos 10% da renda.";
        } else {
            summary = "Zona de risco. Seus gastos mensais superam sua renda. Você está operando no vermelho.";
            conclusion = "Sofia sugere: Corte despesas não essenciais imediatamente para evitar dívidas.";
        }

        return { surplus, savingRate, idealReserve, reservePct, grade, summary, conclusion };
    }
};

// ============================================================================
// AI SERVICE
// ============================================================================

const NimAI = {
    getUserKey() {
        return Storage.loadKey() || "";
    },

    buildSystemPrompt(profile, finances, metrics) {
        const surplus      = fmt(metrics.surplus);
        const idealReserve = fmt(metrics.idealReserve);
        const reservePct   = Math.round(metrics.reservePct * 100);
        const dream        = DREAMS[profile.dream]    || profile.dream;
        const struggle     = STRUGGLES[profile.struggle] || profile.struggle;

        return `Você é a Sofia, consultora financeira digital. Responda com foco no caso específico do usuário, usando apenas os dados que ele forneceu. Nunca use um texto padrão, modelo fixo ou estrutura repetida. Cada resposta deve ser única e personalizada para a pergunta enviada.
Use somente o contexto fornecido pelo usuário e a pergunta atual; não recicle frases genéricas ou seções prontas.
Seu objetivo é analisar a pergunta do usuário e explicar claramente por que uma decisão está alinhada ou desalinhada com a situação financeira dele.

Estilo de resposta:
- Seja organizado, direto e profissional.
- Use títulos curtos e claros como "Diagnóstico", "Impacto" e "Próximos passos".
- Prefira parágrafos curtos e listas quando fizer sentido.
- Não use tabelas Markdown.
- Não repita o mesmo texto nem formatos de resposta anteriores.
- Não apresente o perfil do usuário como um bloco de texto separado; use os dados apenas para análise.

Você TEM os seguintes dados do usuário e deve usá-los sempre:
- Nome: ${profile.name}
- Idade: ${profile.age}
- Ocupação: ${profile.profession}
- Renda: ${fmt(profile.income)}
- Gastos: ${fmt(profile.cost)}
- Reserva atual: ${fmt(finances.reserve)}
- Meta de reserva recomendada: ${fmt(metrics.idealReserve)}
- Sobra mensal: ${surplus}

NÃO peça esses dados novamente. NUNCA responda que você não sabe ou não tem essas informações.

Antes de responder, siga este raciocínio:
1. Entenda exatamente o que o usuário quer.
2. Compare o preço aproximado do item ou a decisão com renda, gastos, sobra, reserva e patrimônio.
3. Explique POR QUE comprar ou não comprar, ou por que seguir outra decisão.
4. Mostre o impacto financeiro em números ou prazos simples.
5. Dê uma alternativa melhor, quando existir.
6. Finalize com uma recomendação objetiva.

Regras importantes:
- Nunca reutilize o mesmo texto; cada resposta deve ser diferente.
- Nunca repita seções como "O que você fez certo", "O que precisa melhorar" ou "O que eu faria".
- Não use um modelo fixo de resposta; responda de forma natural e específica para a pergunta.
- Se a pergunta for sobre um item ou compra concreta, fale apenas desse item.
- Use cálculos simples sempre que possível: tempo para juntar o valor, comparação com sobra mensal, impacto de custos fixos adicionais.
- Prefira linguagem direta: diga "compre", "adicie", "não é compatível", "priorize", "gaste".
- Evite jargões técnicos e frases vagas como "pode ser interessante".

Exemplos de raciocínio para perguntas de compra:
- Para um item caro, calcule quanto tempo levaria para juntar o valor com a sobra atual.
- Para um item barato, compare com a reserva e com prioridade de gastos.
- Para uma decisão financeira, use os números do usuário para mostrar impacto real.

Se o usuário perguntar "Posso comprar um PS5?", responda apenas sobre o PS5.
Se o usuário perguntar "Posso comprar uma Porsche?", responda apenas sobre a Porsche.

Termine com uma recomendação clara e objetiva, como "Adie a compra" ou "Faça a compra com cautela".`;
    },

    normalizeFieldName(key) {
        if (!key || typeof key !== "string") return null;
        const normalized = normalizeText(key).replace(/\s+/g, "");
        const map = {
            salary: "salary", income: "salary", salario: "salary", rendamensal: "salary", mensal: "salary", monthlysalary: "salary", monthlySalary: "salary", monthlyincome: "salary", grosssalary: "salary", receita: "salary", remuneracao: "salary", pagamento: "salary",
            expenses: "expenses", monthlyexpenses: "expenses", monthlyExpenses: "expenses", monthly_expenses: "expenses", cost: "expenses", gastos: "expenses", despesas: "expenses", custo: "expenses", gastosmensais: "expenses", despesasmensais: "expenses",
            confidence: "confidence", confianca: "confidence", confidencepct: "confidence", confidencepercentage: "confidence", confidence_percentage: "confidence",
            struggle: "struggle", dificuldade: "struggle", principal: "struggle", problem: "struggle",
            dream: "dream", sonho: "dream", meta: "dream", objetivo: "dream"
        };
        return map[normalized] || null;
    },

    extractTextFromPayload(payload) {
        if (payload == null) return null;
        if (typeof payload === "string") return payload;
        if (typeof payload !== "object") return null;

        if (typeof payload.content === "string") return payload.content;
        if (Array.isArray(payload.content)) {
            const parts = payload.content.map(item => typeof item === "string" ? item : item?.text || item?.content || "");
            return parts.filter(Boolean).join(" ").trim() || null;
        }

        if (typeof payload.text === "string") return payload.text;

        if (Array.isArray(payload.choices) && payload.choices.length) {
            for (const choice of payload.choices) {
                const candidate = choice?.message?.content || choice?.message?.text || choice?.text || choice?.delta?.content || choice?.delta?.text || choice?.output?.[0]?.content || choice?.output?.[0]?.text;
                if (typeof candidate === "string") return candidate;
                if (Array.isArray(candidate)) {
                    const parts = candidate.map(item => typeof item === "string" ? item : item?.text || item?.content || "");
                    const joined = parts.filter(Boolean).join(" ").trim();
                    if (joined) return joined;
                }
                if (choice?.message && typeof choice.message === "object") {
                    const nested = this.extractTextFromPayload(choice.message);
                    if (nested) return nested;
                }
                if (choice?.delta && typeof choice.delta === "object") {
                    const nested = this.extractTextFromPayload(choice.delta);
                    if (nested) return nested;
                }
                if (choice?.output && typeof choice.output === "object") {
                    const nested = this.extractTextFromPayload(choice.output);
                    if (nested) return nested;
                }
            }
        }

        if (Array.isArray(payload.output) && payload.output.length) {
            const item = payload.output[0];
            if (typeof item === "string") return item;
            if (typeof item?.content === "string") return item.content;
            if (Array.isArray(item?.content)) {
                const parts = item.content.map(inner => typeof inner === "string" ? inner : inner?.text || "");
                return parts.filter(Boolean).join(" ").trim() || null;
            }
            const nested = this.extractTextFromPayload(item);
            if (nested) return nested;
        }

        if (payload.data && typeof payload.data === "object") return this.extractTextFromPayload(payload.data);
        if (payload.response && typeof payload.response === "object") return this.extractTextFromPayload(payload.response);
        if (payload.result && typeof payload.result === "object") return this.extractTextFromPayload(payload.result);
        if (payload.message && typeof payload.message === "object") return this.extractTextFromPayload(payload.message);
        if (payload.choices && typeof payload.choices === "object") return this.extractTextFromPayload(payload.choices);

        return null;
    },

    extractMessageJSON(payload) {
        if (!payload || typeof payload !== "object") return null;
        const choice = Array.isArray(payload.choices) ? payload.choices[0] : payload.choices;
        if (!choice) return null;

        const content = choice?.message?.content || choice?.message?.text || choice?.text || choice?.delta?.content || choice?.delta?.text;
        if (typeof content === "string") return content;
        if (Array.isArray(content)) {
            const parts = content.map(item => typeof item === "string" ? item : item?.text || item?.content || "");
            return parts.filter(Boolean).join(" ").trim() || null;
        }
        return null;
    },

    cleanJSONText(raw) {
        if (raw == null) return null;
        let text = String(raw);
        text = text.replace(/```\s*json/i, "");
        text = text.replace(/```/g, "");
        text = text.trim();
        return text;
    },

    extractBracedJSON(raw) {
        if (raw == null) return null;
        const text = String(raw);
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start === -1 || end === -1 || end <= start) return null;
        return text.slice(start, end + 1);
    },

    parseJSONText(raw) {
        if (raw == null) return null;
        const cleaned = this.cleanJSONText(raw);
        let parsed = tryParseLooseJSON(cleaned);
        if (parsed) return parsed;

        const braced = this.extractBracedJSON(cleaned);
        if (braced && braced !== cleaned) {
            parsed = tryParseLooseJSON(braced);
            if (parsed) return parsed;
        }

        return null;
    },

    findJSONText(payload) {
        if (payload == null) return null;
        if (typeof payload === "string") {
            const trimmed = payload.trim();
            if ((trimmed.includes("salary") || trimmed.includes("expenses") || trimmed.includes("confidence")) && trimmed.startsWith("{")) {
                return trimmed;
            }
            return null;
        }
        if (typeof payload !== "object") return null;

        if (Array.isArray(payload)) {
            for (const item of payload) {
                const found = this.findJSONText(item);
                if (found) return found;
            }
            return null;
        }

        for (const [key, value] of Object.entries(payload)) {
            if (typeof value === "string") {
                const found = this.findJSONText(value);
                if (found) return found;
            }
            if (typeof value === "object") {
                const found = this.findJSONText(value);
                if (found) return found;
            }
        }

        return null;
    },

    parsePayloadObject(payload) {
        if (!payload || typeof payload !== "object") return null;
        const normalized = {};

        const visit = (node) => {
            if (node == null || typeof node !== "object") return;
            if (Array.isArray(node)) {
                for (const item of node) {
                    visit(item);
                }
                return;
            }
            for (const [key, value] of Object.entries(node)) {
                const field = this.normalizeFieldName(key);
                if (field && normalized[field] == null) {
                    normalized[field] = value;
                }
                if (typeof value === "object") {
                    visit(value);
                }
            }
        };

        visit(payload);
        return Object.keys(normalized).length ? normalized : null;
    },

    normalizeStruggle(value) {
        if (!value || typeof value !== "string") return null;
        const valueKey = normalizeText(value).replace(/\s+/g, "");
        const mapping = {
            gastos_impulso: ["gastosimpulso", "gasto", "impulso", "descontrole"],
            sem_controle: ["semcontrole", "descontrole", "falta de controle"],
            medo_investir: ["medoinvestir", "medo investir", "investir", "investimentos"],
            renda_baixa: ["rendabaixa", "renda baixa", "baixo salario", "salario baixo"],
            dividas: ["dividas", "divida", "divida", "dividas"]
        };

        for (const [key, aliases] of Object.entries(mapping)) {
            if (aliases.some(alias => valueKey.includes(alias))) return key;
        }

        return STRUGGLES[valueKey] ? valueKey : null;
    },

    normalizeDream(value) {
        if (!value || typeof value !== "string") return null;
        const valueKey = normalizeText(value).replace(/\s+/g, "");
        const mapping = {
            imovel: ["imovel", "casa", "apartamento", "moradia"],
            carro: ["carro", "veiculo", "automovel", "auto"],
            viagem: ["viagem", "viajar", "trip", "turismo"],
            negocio: ["negocio", "empreender", "empresa", "startup"],
            independencia: ["independencia", "liberdade", "autonomia"],
            aposentadoria: ["aposentadoria", "aposentar"]
        };

        for (const [key, aliases] of Object.entries(mapping)) {
            if (aliases.some(alias => valueKey.includes(alias))) return key;
        }

        return DREAMS[valueKey] ? valueKey : null;
    },

    validateProfilePayload(payload, profession) {
        if (payload == null) {
            return { profile: null, reason: "Resposta vazia" };
        }

        let candidate = null;
        let extractedJSON = null;
        let parsedJSON = null;
        let content = null;
        let choices = null;
        let message = null;

        if (typeof payload === "string") {
            content = payload;
            extractedJSON = this.cleanJSONText(content);
            parsedJSON = this.parseJSONText(extractedJSON);
            if (!parsedJSON) {
                console.log("validateProfilePayload erro: JSON inválido", { parsedBody: payload, content: extractedJSON });
                return { profile: null, reason: "JSON inválido", details: payload };
            }
            candidate = this.parsePayloadObject(parsedJSON);
            if (!candidate) {
                console.log("validateProfilePayload erro: campos ausentes", { parsedBody: payload, parsedJSON });
                return { profile: null, reason: "Campos salary/expenses ausentes", details: parsedJSON };
            }
        } else if (typeof payload === "object") {
            choices = Array.isArray(payload.choices) ? payload.choices : payload.choices ? [payload.choices] : [];
            const firstChoice = choices[0] || null;
            message = firstChoice?.message || null;
            const rawMessageContent =
                firstChoice?.message?.content ??
                firstChoice?.message?.text ??
                firstChoice?.text ??
                firstChoice?.delta?.content ??
                firstChoice?.delta?.text ??
                this.extractMessageJSON(payload);
            const fallbackPayloadText = this.extractTextFromPayload(payload);
            content = this.extractTextFromPayload(rawMessageContent) || this.extractTextFromPayload(firstChoice) || fallbackPayloadText;

            if (typeof content === "string") {
                extractedJSON = this.cleanJSONText(content);
                parsedJSON = this.parseJSONText(extractedJSON);
            }

            if (parsedJSON) {
                candidate = this.parsePayloadObject(parsedJSON);
            }

            if (!candidate && typeof content === "string" && !parsedJSON) {
                const fallbackText = this.findJSONText(content) || this.extractBracedJSON(content);
                if (fallbackText) {
                    extractedJSON = this.cleanJSONText(fallbackText);
                    parsedJSON = this.parseJSONText(extractedJSON);
                    candidate = parsedJSON ? this.parsePayloadObject(parsedJSON) : null;
                }
            }

            if (!candidate) {
                candidate = this.parsePayloadObject(payload);
            }

            if (!candidate) {
                console.log("validateProfilePayload erro: resposta sem conteúdo JSON válido", {
                    parsedBody: payload,
                    choices,
                    message,
                    content,
                    extractedJSON,
                    parsedJSON
                });
                return { profile: null, reason: "Resposta sem conteúdo JSON válido", details: payload };
            }
        } else {
            return { profile: null, reason: "Resposta inválida" };
        }

        const salary = parseNumber(candidate.salary ?? candidate.income ?? candidate.salario ?? candidate.monthlysalary ?? candidate.grosssalary ?? candidate.renda ?? candidate.receita ?? candidate.remuneracao ?? candidate.pagamento);
        const expenses = parseNumber(candidate.expenses ?? candidate.cost ?? candidate.gastos ?? candidate.despesas ?? candidate.custo ?? candidate.gastosmensais ?? candidate.despesasmensais);

        if (!Number.isFinite(salary)) {
            return { profile: null, reason: "Campo salary ausente ou inválido", details: candidate };
        }

        if (!Number.isFinite(expenses)) {
            return { profile: null, reason: "Campo expenses ausente ou inválido", details: candidate };
        }

        if (salary < 500 || salary > 150000) {
            return { profile: null, reason: `salary fora da faixa permitida (${salary})`, details: candidate };
        }

        if (expenses < 0) {
            return { profile: null, reason: `expenses negativo (${expenses})`, details: candidate };
        }

        if (expenses > salary) {
            return { profile: null, reason: `expenses maior que salary (${expenses} > ${salary})`, details: candidate };
        }

        const fallback = getLocalFallbackProfile(profession);
        const struggle = this.normalizeStruggle(candidate.struggle) || fallback.struggle;
        const dream = this.normalizeDream(candidate.dream) || fallback.dream;

        return {
            profile: {
                income: Math.round(salary),
                cost: Math.round(expenses),
                struggle,
                dream
            }
        };
    },

    safeParseResponseBody(rawText) {
        try {
            return JSON.parse(rawText);
        } catch {
            return rawText;
        }
    },

    buildEstimationPrompt(profession, attempt = 1, lastReason = "") {
        let prompt = `Você é um estimador de renda brasileiro.
` +
            `Receberá apenas o nome de uma profissão.
` +
            `Use seu conhecimento para estimar a renda líquida mensal média no Brasil e os gastos mensais médios dessa profissão.
` +
            `RESPONDA APENAS COM JSON VÁLIDO. NÃO ENVIE EXPLICAÇÕES, NÃO USE MARKDOWN, NÃO USE \`\`\`json.
` +
            `O único conteúdo da resposta deve ser um objeto JSON com os campos abaixo.
` +
            `Formato obrigatório:
` +
            `{
` +
            `  "salary": 4300,
` +
            `  "expenses": 2600
` +
            `}

` +
            `Regras:
` +
            `- salary = inteiro
` +
            `- expenses = inteiro
` +
            `- expenses nunca pode ser maior que salary
` +
            `- expenses deve ficar entre 50% e 90% do salário
` +
            `- se a profissão for desconhecida, estime o valor mais plausível

` +
            `Profissão: ${profession}
`;

        if (attempt > 1 && lastReason) {
            prompt += `A resposta anterior estava incorreta porque ${lastReason}. Envie novamente apenas o JSON solicitado.
`;
        }

        return prompt;
    },

    parseProfilePayload(payload, profession) {
        const validation = this.validateProfilePayload(payload, profession);
        return validation.profile || null;
    },

    localEstimateProfile(profession) {
        const profile = getLocalFallbackProfile(profession);
        return {
            income: Math.round(profile.salaryAvg),
            cost: Math.round(profile.costAvg),
            struggle: profile.struggle,
            dream: profile.dream
        };
    },

    async estimateProfile(profession) {
        const headers = { "Content-Type": "application/json" };
        const userKey = this.getUserKey();
        if (userKey) headers["X-Override-Key"] = userKey;

        let lastReason = "";

        for (let attempt = 1; attempt <= 3; attempt++) {
            const prompt = this.buildEstimationPrompt(profession, attempt, lastReason);
            const body = {
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: `Cargo: ${profession}` }
                ],
                temperature: 0.0,
                top_p: 1,
                max_tokens: 120,
                stream: false
            };

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 25000);

            try {
                console.groupCollapsed(`Tentativa ${attempt}`);
                console.debug("POST /api/chat", { attempt, profession, body });

                const response = await fetch(PROXY_URL, {
                    method: "POST",
                    headers,
                    signal: controller.signal,
                    body: JSON.stringify(body)
                });

                const rawText = await response.text();
                const parsedBody = this.safeParseResponseBody(rawText);
                const responseHeaders = collectHeaders(response.headers);

                console.debug("Status HTTP:", response.status, response.statusText);
                console.debug("Headers:", responseHeaders);
                console.debug("Body bruto:", rawText);
                console.debug("Body parseado:", parsedBody);
                console.groupEnd();

                if (!response.ok) {
                    lastReason = `HTTP ${response.status} ${response.statusText}`;
                    console.warn(`Tentativa ${attempt} falhou: ${lastReason}`);
                    if (attempt < 3) continue;
                    break;
                }

                const validation = this.validateProfilePayload(parsedBody, profession);
                if (validation.profile) {
                    console.info("Sucesso", { attempt, profession, profile: validation.profile });
                    return validation.profile;
                }

                lastReason = validation.reason || "Resposta inválida da IA";
                console.warn(`Tentativa ${attempt} falhou: ${lastReason}`, validation.details);
                if (attempt < 3) continue;
                break;
            } catch (err) {
                lastReason = err.name === "AbortError" ? "timeout" : err.message;
                console.warn(`Tentativa ${attempt} falhou:`, lastReason);
                if (attempt < 3) continue;
                break;
            } finally {
                clearTimeout(timeout);
            }
        }

        console.error("Falha após 3 tentativas", { profession, lastReason });
        return this.localEstimateProfile(profession);
    },

    async streamMessage(systemPrompt, messages, onChunk, onDone, onError) {
        const headers = { "Content-Type": "application/json" };
        const userKey = this.getUserKey();
        if (userKey) headers["X-Override-Key"] = userKey;

        try {
            const response = await fetch(PROXY_URL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.12,
                    top_p: 0.8,
                    max_tokens: 700,
                    stream: true
                })
            });

            const reader  = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer    = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === "data: [DONE]") continue;
                    if (!trimmed.startsWith("data: ")) continue;

                    try {
                        const json    = JSON.parse(trimmed.slice(6));
                        const content = json?.choices?.[0]?.delta?.content;
                        if (content) onChunk(content);
                    } catch {
                        // ignore
                    }
                }
            }

            onDone();

        } catch (err) {
            if (err.name === "AbortError") return;
            onError(`Erro de conexão: ${err.message}`);
        }
    }
};

// ============================================================================
// UI CONTROLLER
// ============================================================================

const UI = {
    state: null,          // { profile, finances }
    chatHistory: [],      // context messages
    isSending: false,
    isEstimating: false,

    init() {
        this.state = null;
        this.chatHistory = [];
        this.wizardStep = 1;

        const saved = Storage.loadState();
        if (saved?.profile && saved?.finances) {
            this.state = saved;
            this.chatHistory = Array.isArray(saved.history) ? saved.history : [];
            this.showApp();
            this.renderChatHistory();
        } else {
            this.showSplash();
        }

        this.bindEvents();
    },

    showScreen(id) {
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        el(id).classList.add("active");
    },

    showSplash()  { this.showScreen("splash"); },
    showWizard()  { this.showScreen("wizard"); this.setWizardStep(1); },

    showApp() {
        this.showScreen("app");
        this.syncSidebar();

        if (this.chatHistory.length === 0 && el("chat-feed").children.length === 0) {
            this.appendAIIntro();
        }
    },

    syncSidebar() {
        const p = this.state.profile;
        const f = this.state.finances;
        const m = Analyzer.compute(p, f);

        // Identidade
        el("lbl-avatar").textContent = (p.name || "?").charAt(0).toUpperCase();
        el("lbl-name").textContent = p.name;
        el("lbl-job").textContent = `${p.profession} · ${p.age} anos`;
        el("lbl-income").textContent = fmtCompact(p.income);
        el("lbl-cost").textContent = fmtCompact(p.cost);
        el("lbl-surplus").textContent = fmtCompact(m.surplus);

        // Cor da Sobra
        const surplusEl = el("lbl-surplus");
        surplusEl.className = m.surplus >= 0 ? "c-green" : "c-red";
    },

    setWizardStep(value) {
        this.wizardStep = Math.max(1, Math.min(WIZARD_TOTAL, value));
        updateWizardBar();
    },

    renderChatHistory() {
        const feed = el("chat-feed");
        feed.innerHTML = "";
        this.chatHistory.forEach(item => {
            const html = item.role === "user"
                ? escapeHTML(item.content)
                : this.renderMarkdown(item.content);
            this.appendMessage(item.role, item.role === "user" ? "Você" : "Sofia", html);
        });
    },

    appendAIIntro() {
        this.appendMessage("ai", "Sofia", `Olá, <strong>${escapeHTML(this.state.profile.name)}</strong>! Eu sou a Sofia, sua consultora financeira. ` +
            `Já analisei seus dados e estou pronta para falar o que você deve fazer em seguida.<br><br>` +
            `Escreva sua dúvida para começarmos a agir agora.`);
    },

    saveCurrentState() {
        if (!this.state) return;
        Storage.saveState({
            ...this.state,
            history: this.chatHistory.slice(-20)
        });
    },

    _isAtBottom(feed) {
        return feed.scrollHeight - feed.scrollTop - feed.clientHeight < 60;
    },

    _smartScroll(feed) {
        if (this._isAtBottom(feed)) {
            feed.scrollTop = feed.scrollHeight;
        }
    },

    appendMessage(role, sender, html) {
        const feed = el("chat-feed");
        const wasAtBottom = this._isAtBottom(feed);
        const div = document.createElement("div");
        div.className = `msg ${role}`;
        div.innerHTML = `
            <div class="msg-sender">${escapeHTML(sender)}</div>
            <div class="bubble">${role === "user" ? escapeHTML(html) : html}</div>
        `;
        feed.appendChild(div);
        if (wasAtBottom) feed.scrollTop = feed.scrollHeight;
        return div.querySelector(".bubble");
    },

    async sendMessage(userText) {
        if (!userText.trim() || this.isSending) return;
        this.isSending = true;

        const sendBtn = el("btn-send");
        const inputEl = el("chat-input");
        sendBtn.disabled = true;
        inputEl.disabled = true;

        this.appendMessage("user", "Você", userText);
        this.chatHistory.push({ role: "user", content: userText });
        this.saveCurrentState();

        const bubble = this.appendMessage("ai", "Sofia", "");
        bubble.classList.add("typing-cursor");
        bubble.innerHTML = `<span class="typing-placeholder">Analisando seus dados...</span>`;

        const statusPhases = [
            "Analisando seus dados...",
            "Montando recomendações...",
            "Preparando resposta..."
        ];
        let statusIndex = 0;
        const statusTimer = setInterval(() => {
            statusIndex = Math.min(statusIndex + 1, statusPhases.length - 1);
            bubble.innerHTML = `<span class="typing-placeholder">${statusPhases[statusIndex]}</span>`;
        }, 1200);

        const m = Analyzer.compute(this.state.profile, this.state.finances);
        const systemPrompt = NimAI.buildSystemPrompt(this.state.profile, this.state.finances, m);
        let fullResponse = "";

        await NimAI.streamMessage(
            systemPrompt,
            this.chatHistory.slice(-10),
            (chunk) => {
                fullResponse += chunk;
                const cleanText = this.filterToastTag(fullResponse).text;
                bubble.innerHTML = this.renderMarkdown(cleanText);
                this._smartScroll(el("chat-feed"));
            },
            () => {
                clearInterval(statusTimer);
                bubble.classList.remove("typing-cursor");
                const parsed = this.filterToastTag(fullResponse);
                bubble.innerHTML = this.renderMarkdown(parsed.text);
                if (parsed.toast) {
                    Toast.show(parsed.toast.type, parsed.toast.title, parsed.toast.msg);
                }

                this.chatHistory.push({ role: "assistant", content: parsed.text });
                this.saveCurrentState();
                this.isSending = false;
                sendBtn.disabled = false;
                inputEl.disabled = false;
                inputEl.focus();
            },
            (errMsg) => {
                clearInterval(statusTimer);
                bubble.classList.remove("typing-cursor");
                bubble.innerHTML = `<span style="color:var(--red);">⚠️ ${escapeHTML(errMsg)}</span>`;
                this.isSending = false;
                sendBtn.disabled = false;
                inputEl.disabled = false;
            }
        );
    },

    filterToastTag(text) {
        const regex = /\[TOAST:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/i;
        const match = text.match(regex);
        if (match) {
            return {
                text: text.replace(regex, "").trim(),
                toast: {
                    type:  match[1].trim().toLowerCase(),
                    title: match[2].trim(),
                    msg:   match[3].trim()
                }
            };
        }
        return { text: text.trim(), toast: null };
    },

    renderMarkdown(raw) {
    let t = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Code blocks
    t = t.replace(/```[\w]*\n?([\s\S]*?)```/g,
        (_, code) => `<pre><code>${code.trim()}</code></pre>`);

    // Inline code
    t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);

    // Corrige headings quando o modelo junta o título à primeira frase
    t = t.replace(/(## 📊 Seu diagnóstico)(?!\n)/g, '$1\n');
    t = t.replace(/(## ✅ O que você fez certo)(?!\n)/g, '$1\n');
    t = t.replace(/(## ⚠️ O que precisa melhorar)(?!\n)/g, '$1\n');
    t = t.replace(/(## 💡 O que eu faria)(?!\n)/g, '$1\n');
    t = t.replace(/(## 📌 Resumo)(?!\n)/g, '$1\n');

    // Cabeçalhos
    t = t.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    t = t.replace(/^## (.+)$/gm,  '<h2>$1</h2>');
    t = t.replace(/^# (.+)$/gm,   '<h1>$1</h1>');

    // Blockquotes
    t = t.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Formatação de prós, contras e ações com foco
    t = t.replace(/^✔\s*(.+)$/gm, '<span class="md-check">✔ $1</span>');
    t = t.replace(/^❌\s*(.+)$/gm, '<span class="md-cross">❌ $1</span>');
    t = t.replace(/^✅\s*(.+)$/gm, '<div class="md-check">✅ $1</div>');
    t = t.replace(/^⚠️\s*(.+)$/gm, '<div class="md-cross">⚠️ $1</div>');

    // Listas simples
    t = t.replace(/^[-*•] (.+)$/gm, '<li>$1</li>');
    t = t.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    // Negritos
    t = t.replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>');
    t = t.replace(/\*(.+?)\*/gs,      '<em>$1</em>');

    // Divide parágrafos
    const blocks = t.split(/\n{2,}/);
    t = blocks.map(block => {
        const isBlock = /^\s*<(h[1-5]|ul|ol|li|pre|blockquote)/.test(block);
        if (isBlock) return block.replace(/\n/g, "");
        return `<p class="md-p">${block.replace(/\n/g, "<br>")}</p>`;
    }).join("");

    return t;
    },

    bindEvents() {
    el("btn-start").addEventListener("click", () => this.showWizard());
    el("wiz-next").addEventListener("click", () => advanceWizard(1));
    el("wiz-prev").addEventListener("click", () => advanceWizard(-1));

    // Botão de estimar perfil diretamente no Passo 2
    el("btn-estimate-profile").addEventListener("click", () => triggerIAEstimation());

    el("chat-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const q = el("chat-input").value.trim();
        el("chat-input").value = "";
        this.sendMessage(q);
    });

    el("btn-reset").addEventListener("click", () => {
        if (!confirm("Deseja apagar os dados salvos e recomeçar a análise?")) return;
        Storage.clearState();
        this.state = null;
        this.chatHistory = [];
        el("chat-feed").innerHTML = "";
        this.showWizard();
    });

    const toastClose = el("toast-close");
    if (toastClose) {
        toastClose.addEventListener("click", () => Toast.hide());
    }
    }
};

// ============================================================================
// WIZARD
// ============================================================================

const WIZARD_TOTAL = 4;

function updateWizardBar() {
    const step = UI.wizardStep || 1;
    const pct = ((step - 1) / (WIZARD_TOTAL - 1)) * 100;
    el("wiz-bar").style.width = pct + "%";
    el("wiz-step-label").textContent = `Passo ${step} de ${WIZARD_TOTAL}`;
    el("wiz-prev").disabled = step === 1;
    el("wiz-next").textContent = step === WIZARD_TOTAL ? "Ver Diagnóstico ✦" : "Avançar →";

    if (step === 2) {
        el("wiz-next").style.display = "none"; // Usuário deve clicar em "Estimar com IA"
    } else {
        el("wiz-next").style.display = "";
    }

    for (let i = 1; i <= WIZARD_TOTAL; i++) {
        const s = el(`ws-${i}`);
        s.classList.toggle("active", i === step);
    }
}

function validateCurrentStep() {
    const step = el(`ws-${UI.wizardStep}`);
    let ok = true;
    step.querySelectorAll("[required]").forEach(inp => {
        inp.classList.remove("error");
        if (!inp.value) {
            inp.classList.add("error");
            ok = false;
        }
    });
    return ok;
}

async function triggerIAEstimation() {
    const profInput = el("f-prof");
    profInput.classList.remove("error");

    const profession = profInput.value.trim();
    if (!profession) {
        profInput.classList.add("error");
        Toast.show("red", "Atenção", "Por favor, digite sua ocupação primeiro.");
        return;
    }

    if (UI.isEstimating) return;
    UI.isEstimating = true;

    const btn = el("btn-estimate-profile");
    const originalText = btn.textContent;
    btn.textContent = "Estimando perfil... ✦";
    btn.disabled = true;

    Toast.show("info", "Sofia está trabalhando", "Estimando dados financeiros realistas via IA...");

    try {
        const estimation = await NimAI.estimateProfile(profession);
        
        // Preenche os passos seguintes
        el("f-income").value  = estimation.income || 3000;
        el("f-cost").value    = estimation.cost || 2200;
        el("f-struggle").value = estimation.struggle || "gastos_impulso";
        el("f-dream").value    = estimation.dream || "imovel";

        // Estima uma meta sugerida (por ex: 20x a renda anual ou similar)
        el("f-goal").value = (estimation.income || 3000) * 24;

        Toast.show("green", "Perfil Estimado!", "Ajuste os valores sugeridos nos próximos passos.");
        
        // Permite avançar
        UI.isEstimating = false;
        btn.textContent = originalText;
        btn.disabled = false;

        // Avança automaticamente para o passo 3
        UI.setWizardStep(3);

    } catch (err) {
        console.error("Erro na estimativa da IA:", err);
        
        // Fallback robusto se a API falhar (preenche valores padrão)
        el("f-income").value  = 3200;
        el("f-cost").value    = 2400;
        el("f-struggle").value = "sem_controle";
        el("f-dream").value    = "independencia";
        el("f-goal").value     = 75000;

        Toast.show("amber", "Sofia avisa", "Falha de conexão com a IA. Usando valores sugeridos padrão.");
        
        UI.isEstimating = false;
        btn.textContent = originalText;
        btn.disabled = false;

        UI.setWizardStep(3);
    }
}

function advanceWizard(dir) {
    if (dir > 0 && !validateCurrentStep()) return;

    if (dir > 0 && UI.wizardStep === WIZARD_TOTAL) {
        finishWizard();
        return;
    }

    UI.setWizardStep(UI.wizardStep + dir);
}

function finishWizard() {
    const income  = parseFloat(el("f-income").value)  || 0;
    const cost    = parseFloat(el("f-cost").value)    || 0;
    const reserve = parseFloat(el("f-reserve").value) || 0;

    UI.state = {
        profile: {
            name:       el("f-name").value.trim(),
            age:        parseInt(el("f-age").value) || 25,
            profession: el("f-prof").value.trim(),
            income,
            cost,
            goal:       parseFloat(el("f-goal").value) || 0,
            dream:      el("f-dream").value,
            struggle:   el("f-struggle").value
        },
        finances: {
            reserve,
            netWorth: reserve
        }
    };

    Storage.saveState(UI.state);
    UI.chatHistory = [];
    el("chat-feed").innerHTML = "";
    UI.showApp();

    setTimeout(() => {
        const firstPrompt = "Por favor, elabore meu diagnóstico inicial detalhado e me mostre por onde começar.";
        UI.sendMessage(firstPrompt);
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => UI.init());
