import Link from "next/link"
import { Button } from "@/components/ui/button"
import { KuendaLogo } from "@/components/kuenda-logo"
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/80 border-b border-border">
        <KuendaLogo />
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="font-semibold">
              Entrar
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="font-semibold shadow-lg hover:shadow-xl transition-all">Começar Grátis</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Plataforma de IA de Nova Geração
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Inteligência Artificial
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ao Seu Alcance
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experimente o poder dos modelos de IA mais avançados. Kuenda IA oferece respostas inteligentes, rápidas e
            precisas para todas as suas necessidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="font-semibold text-base h-12 px-8 shadow-xl hover:shadow-2xl transition-all group"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="font-semibold text-base h-12 px-8 bg-transparent">
                Já tenho conta
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all">
              <Zap className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-foreground mb-2">Ultra Rápido</h3>
              <p className="text-sm text-muted-foreground">Respostas instantâneas com tecnologia de ponta</p>
            </div>

            <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all">
              <Sparkles className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-foreground mb-2">IA Avançada</h3>
              <p className="text-sm text-muted-foreground">Modelos de última geração para resultados precisos</p>
            </div>

            <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all">
              <Shield className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-foreground mb-2">100% Seguro</h3>
              <p className="text-sm text-muted-foreground">Seus dados protegidos com criptografia avançada</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6 text-center text-sm text-muted-foreground backdrop-blur-sm bg-white/80 border-t border-border">
        <p>© 2025 Kuenda IA. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
