import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// AI Gateway API Key provided by user
const AI_GATEWAY_KEY = "v1:13kXlWs2bvYSIxt7MDIHF5iM:gKFsdUCf70qwIxWJr1caFnCn"
const GEMINI_API_KEY = "AIzaSyDaU-2y8u-94gCDghFfL83gm1lFqB0l7Cs"

export async function POST(request: Request) {
  try {
    const { message, model, userId } = await request.json()

    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check subscription for pro model
    if (model === "kuenda-4.8-pro") {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("plan_type", "pro")
        .eq("status", "active")
        .single()

      if (!subscription) {
        return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
      }
    }

    // Get AI response based on model
    let aiResponse: string

    if (model === "kuenda-2.5") {
      // Use Gemini for free model
      aiResponse = await getGeminiResponse(message)
    } else {
      // Use GPT-4 for pro model via AI Gateway
      aiResponse = await getGPT4Response(message)
    }

    // Save message to database
    await supabase.from("chat_messages").insert({
      user_id: userId,
      message: message,
      response: aiResponse,
      model_used: model,
    })

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getGeminiResponse(message: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      },
    )

    const data = await response.json()

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }

    return "Desculpe, não consegui processar sua mensagem. Tente novamente."
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return "Desculpe, ocorreu um erro ao processar sua mensagem."
  }
}

async function getGPT4Response(message: string): Promise<string> {
  try {
    // Using OpenAI API with the provided gateway key
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
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
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const data = await response.json()

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content
    }

    return "Desculpe, não consegui processar sua mensagem. Tente novamente."
  } catch (error) {
    console.error("[v0] GPT-4 API error:", error)
    return "Desculpe, ocorreu um erro ao processar sua mensagem."
  }
}
