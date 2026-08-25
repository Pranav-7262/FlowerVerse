import { Ollama } from "ollama";

const ollamaBaseUrl = (
  process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"
).replace(/\/$/, "");
const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2";
const ollamaTimeout = Number(process.env.OLLAMA_TIMEOUT_MS || 30000);
const ollama = new Ollama({
  host: ollamaBaseUrl,
  fetch: (input, init = {}) =>
    fetch(input, {
      ...init,
      signal: AbortSignal.timeout(ollamaTimeout),
    }),
});

export const askOllama = async ({
  messages,
  temperature = 0.5,
  json = false,
}) => {
  const response = await ollama.chat({
    model: ollamaModel,
    messages,
    stream: false,
    ...(json ? { format: "json" } : {}),
    options: { temperature },
  });
  const content = response.message?.content?.trim();

  if (!content) {
    throw new Error("Ollama returned an empty response");
  }

  return content;
};
