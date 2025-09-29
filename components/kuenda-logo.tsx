import { Brain, Bot } from "lucide-react"

export function KuendaLogo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <Bot className="h-8 w-8 text-foreground" />
      <h1 className="text-3xl font-bold text-foreground">Kuenda IA</h1>
      <Brain className="h-8 w-8 text-foreground" />
    </div>
  )
}
