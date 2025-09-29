// AI Service for managing multiple AI providers
export interface AIProvider {
  name: string
  model: string
  apiKey: string
}

export const AI_PROVIDERS = {
  GEMINI: {
    name: "Gemini",
    model: "gemini-pro",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  },
  OPENAI: {
    name: "OpenAI",
    model: "gpt-4",
    endpoint: "https://api.openai.com/v1/chat/completions",
  },
  CLAUDE: {
    name: "Claude",
    model: "claude-3-sonnet",
    endpoint: "https://api.anthropic.com/v1/messages",
  },
  GROK: {
    name: "Grok",
    model: "grok-beta",
    endpoint: "https://api.x.ai/v1/chat/completions",
  },
} as const

export async function generateAIResponse(
  message: string,
  provider: keyof typeof AI_PROVIDERS,
  apiKey: string,
): Promise<string> {
  const providerConfig = AI_PROVIDERS[provider]

  switch (provider) {
    case "GEMINI":
      return generateGeminiResponse(message, apiKey)
    case "OPENAI":
      return generateOpenAIResponse(message, apiKey)
    case "CLAUDE":
      return generateClaudeResponse(message, apiKey)
    case "GROK":
      return generateGrokResponse(message, apiKey)
    default:
      throw new Error("Unsupported AI provider")
  }
}

async function generateGeminiResponse(message: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }),
    },
  )

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar resposta"
}

async function generateOpenAIResponse(message: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é o Kuenda IA, um assistente inteligente e prestativo.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "Erro ao gerar resposta"
}

async function generateClaudeResponse(message: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  })

  const data = await response.json()
  return data.content?.[0]?.text || "Erro ao gerar resposta"
}

async function generateGrokResponse(message: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: "Você é o Kuenda IA, um assistente inteligente e prestativo.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "Erro ao gerar resposta"
}
