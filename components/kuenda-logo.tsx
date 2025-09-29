import { Brain, Bot, Sparkles } from "lucide-react"

export function KuendaLogo() {
  return (
    <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
      <div className="relative">
        <Bot className="h-10 w-10 text-primary animate-pulse" />
        <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-bounce" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
        Kuenda IA
      </h1>
      <div className="relative">
        <Brain className="h-10 w-10 text-primary animate-pulse" />
        <Sparkles
          className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
      </div>
    </div>
  )
}
