"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Send, Loader2 } from "lucide-react"
import { KuendaLogo } from "@/components/kuenda-logo"
import { ModelSelector } from "@/components/model-selector"
import { SettingsPanel } from "@/components/settings-panel"
import { ChatMessage } from "@/components/chat-message"
import type { User } from "@supabase/supabase-js"
import type { Profile, Subscription } from "@/lib/types"

interface ChatInterfaceProps {
  user: User
  profile: Profile | null
  subscription: Subscription | null
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatInterface({ user, profile, subscription }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<"kuenda-2.5" | "kuenda-4.8-pro">("kuenda-2.5")
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Welcome message
  useEffect(() => {
    if (profile && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Olá ${profile.full_name}! Bem-vindo ao Kuenda IA. Como posso ajudá-lo hoje?`,
          timestamp: new Date(),
        },
      ])
    }
  }, [profile, messages.length])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Check if user has access to selected model
    if (selectedModel === "kuenda-4.8-pro" && subscription?.plan_type !== "pro") {
      alert("Você precisa de uma assinatura Pro para usar o Kuenda 4.8 Pro")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate 5 second delay
    await new Promise((resolve) => setTimeout(resolve, 5000))

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          model: selectedModel,
          userId: user.id,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-blue-50/20">
      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        profile={profile}
        subscription={subscription}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border backdrop-blur-sm bg-background/95 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-foreground hover:bg-accent transition-colors"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <KuendaLogo />
            </div>
          </div>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            isPro={subscription?.plan_type === "pro"}
          />
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-muted-foreground animate-fade-in">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Kuenda IA está pensando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border backdrop-blur-sm bg-background/95 px-4 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 border-border bg-background text-foreground h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="font-semibold h-11 px-6 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Kuenda IA pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  )
}
