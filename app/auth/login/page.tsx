"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KuendaLogo } from "@/components/kuenda-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailOrPhone,
        password,
      })
      if (error) throw error
      router.push("/chat")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <KuendaLogo />

        <Card className="border-border shadow-2xl backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-300">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm sm:text-base">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone" className="text-foreground font-semibold text-sm">
                  E-mail ou Número
                </Label>
                <Input
                  id="emailOrPhone"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="border-border bg-background text-foreground h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-semibold text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border bg-background text-foreground pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-shake">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full font-semibold h-11 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Não tem uma conta?{" "}
                <Link href="/auth/signup" className="text-primary font-semibold hover:underline transition-all">
                  Criar Conta
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Plataforma segura e protegida com criptografia de ponta a ponta
        </p>
      </div>
    </div>
  )
}
