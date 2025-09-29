import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"

// The AI Gateway is already configured and supports multiple models

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

    // kuenda-2.5 uses Gemini Flash (free tier)
    // kuenda-4.8-pro uses GPT-4 (pro tier)
    const aiModel = model === "kuenda-2.5" ? "google/gemini-1.5-flash" : "openai/gpt-4"

    const { text: aiResponse } = await generateText({
      model: aiModel,
      prompt: message,
      system: "Você é o Kuenda IA, um assistente inteligente e prestativo que ajuda usuários em português.",
      temperature: 0.7,
      maxTokens: 1000,
    })

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
    return NextResponse.json(
      { error: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente." },
      { status: 500 },
    )
  }
}
