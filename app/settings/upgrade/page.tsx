"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function UpgradePage() {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string>("free")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (subscription) {
      setCurrentPlan(subscription.plan_type)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Basic validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Número do cartão inválido")
      setIsLoading(false)
      return
    }

    if (cvv.length !== 3) {
      setError("CVV inválido")
      setIsLoading(false)
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Process payment (in production, this would integrate with a real payment gateway)
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cardNumber: cardNumber.replace(/\s/g, ""),
          cardName,
          expiryDate,
          cvv,
          plan: "pro",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento")
      }

      // Update subscription
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      await supabase
        .from("subscriptions")
        .update({
          plan_type: "pro",
          status: "active",
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", user.id)

      alert("Pagamento processado com sucesso! Bem-vindo ao Kuenda IA Pro!")
      router.push("/chat")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao processar o pagamento")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  if (currentPlan === "pro") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/chat">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Chat
            </Link>
          </Button>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground text-center">Você já é Pro!</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Você já tem acesso a todos os recursos premium
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/chat">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Chat
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Details */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Kuenda IA Pro</CardTitle>
              <CardDescription className="text-muted-foreground">Desbloqueie todo o potencial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-foreground">
                R$ 29,90<span className="text-lg font-normal text-muted-foreground">/mês</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Modelo Kuenda 4.8 Pro</p>
                    <p className="text-sm text-muted-foreground">Acesso ao modelo mais avançado</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Respostas mais rápidas</p>
                    <p className="text-sm text-muted-foreground">Prioridade no processamento</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Mensagens ilimitadas</p>
                    <p className="text-sm text-muted-foreground">Sem limites de uso</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Suporte prioritário</p>
                    <p className="text-sm text-muted-foreground">Atendimento preferencial</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Pagamento
              </CardTitle>
              <CardDescription className="text-muted-foreground">Insira os dados do seu cartão</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-foreground font-semibold">
                    Número do Cartão
                  </Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="border-border bg-background text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-foreground font-semibold">
                    Nome no Cartão
                  </Label>
                  <Input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="NOME COMPLETO"
                    required
                    className="border-border bg-background text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-foreground font-semibold">
                      Validade
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                      className="border-border bg-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-foreground font-semibold">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      maxLength={3}
                      required
                      className="border-border bg-background text-foreground"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                  {isLoading ? "Processando..." : "Assinar Pro - R$ 29,90/mês"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pagamento seguro. Cancele a qualquer momento.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
