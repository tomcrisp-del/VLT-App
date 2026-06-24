// ============================================================
// identify-species — secure proxy to Claude's vision API.
//
// The browser sends a (downscaled) photo plus the list of species
// known to occur on Vinalhaven. We ask Claude to identify the organism
// using ONLY that list, and to return nothing when it isn't confident.
//
// The Anthropic API key lives ONLY in the ANTHROPIC_API_KEY Netlify
// environment variable — never in client code or the repo.
// ============================================================

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

// Safety caps so a bad/abusive request can't inflate cost.
const MAX_IMAGE_CHARS = 7_000_000; // ~5 MB of base64, per image
const MAX_IMAGES = 3;
const MAX_SPECIES = 1500;

const ALLOWED_MEDIA = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

function json(statusCode, payload) {
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    };
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return json(405, { error: "Method not allowed" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return json(500, { error: "Identification is not configured." });
    }

    let body;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return json(400, { error: "Invalid request." });
    }

    const { images, species } = body;

    if (!Array.isArray(images) || images.length === 0) {
        return json(400, { error: "Missing photo." });
    }
    const photos = images.slice(0, MAX_IMAGES);
    for (const p of photos) {
        if (!p || typeof p.base64 !== "string" || !p.base64) {
            return json(400, { error: "Invalid photo." });
        }
        if (p.base64.length > MAX_IMAGE_CHARS) {
            return json(413, { error: "A photo is too large." });
        }
        if (!ALLOWED_MEDIA.has(p.mediaType)) {
            return json(400, { error: "Unsupported image type." });
        }
    }
    if (!Array.isArray(species) || species.length === 0) {
        return json(400, { error: "Missing species list." });
    }

    // Build the menu of allowed species. This block is identical on every
    // request, so we mark it for prompt caching to keep cost down.
    const menu = species
        .slice(0, MAX_SPECIES)
        .map((s) => `${s.id}\t${s.commonName} (${s.scientificName})`)
        .join("\n");

    const rules =
        "You are a careful naturalist identifying organisms from photos for a " +
        "nature app on Vinalhaven Island, Maine.\n\n" +
        "Below is the COMPLETE list of species known to occur on Vinalhaven. " +
        "Each line is: id<TAB>Common Name (Scientific name).\n\n" +
        "Rules:\n" +
        "1. The photos all show the SAME single organism, possibly from different " +
        "angles (e.g. whole plant, a close-up, a leaf or stem). Identify that one organism.\n" +
        "2. Look closely at distinctive features — leaf shape and arrangement, stem, " +
        "flower or fruit, bark, overall form — before deciding.\n" +
        "3. Identify it using ONLY species from this list. Never invent or return a " +
        "species that is not on the list.\n" +
        "4. Return up to 3 candidates, ranked best first, each with its exact id.\n" +
        '5. Assign confidence: "high" (clearly this species), "medium" (a likely match), ' +
        'or "low" (uncertain, poor photo, or no good match on the list).\n' +
        "6. If you cannot match the photos to a listed species at medium or high " +
        "confidence, return an empty matches array.\n" +
        '7. Respond with ONLY valid JSON, no prose: ' +
        '{"matches":[{"id":"...","confidence":"high|medium|low"}]}\n\n' +
        "SPECIES LIST:\n" +
        menu;

    const content = [
        {
            type: "text",
            text: rules,
            cache_control: { type: "ephemeral" },
        },
    ];
    for (const p of photos) {
        content.push({
            type: "image",
            source: { type: "base64", media_type: p.mediaType, data: p.base64 },
        });
    }
    content.push({
        type: "text",
        text:
            (photos.length > 1
                ? "The photos above all show the same organism. "
                : "") +
            "Identify it using only the species list above. Respond with JSON only.",
    });

    const requestBody = {
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content }],
    };

    let resp;
    try {
        resp = await fetch(ANTHROPIC_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(requestBody),
        });
    } catch (err) {
        return json(502, { error: "Could not reach the identification service." });
    }

    if (!resp.ok) {
        const detail = await resp.text().catch(() => "");
        console.error("Anthropic error", resp.status, detail);
        return json(502, { error: "The identification service had a problem." });
    }

    const data = await resp.json();

    // Concatenate any text blocks from the response.
    const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();

    const parsed = parseMatches(text);

    // Only surface confident matches; map back to the ids the client knows.
    const validIds = new Set(species.map((s) => s.id));
    const matches = parsed
        .filter((m) => m && validIds.has(m.id))
        .filter((m) => m.confidence === "high" || m.confidence === "medium")
        .slice(0, 3);

    return json(200, { matches });
};

// Pull the JSON object out of the model's reply, tolerating code fences
// or stray text, and return its matches array (or []).
function parseMatches(text) {
    if (!text) return [];
    let raw = text;
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
        raw = raw.slice(start, end + 1);
    }
    try {
        const obj = JSON.parse(raw);
        return Array.isArray(obj.matches) ? obj.matches : [];
    } catch {
        return [];
    }
}
