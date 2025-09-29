"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EmailSettingsPage() {
  const [currentEmail, setCurrentEmail] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadEmail()
  }, [])

  const loadEmail = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    setCurrentEmail(user.email || "")
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) throw error

      setSuccess("E-mail atualizado! Verifique seu novo e-mail para confirmar.")
      setTimeout(() => router.push("/chat"), 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

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
            <CardTitle className="text-2xl font-bold text-foreground">Alterar E-mail</CardTitle>
            <CardDescription className="text-muted-foreground">Atualize seu endereço de e-mail</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentEmail" className="text-foreground font-semibold">
                  E-mail Atual
                </Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={currentEmail}
                  disabled
                  className="border-border bg-muted text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newEmail" className="text-foreground font-semibold">
                  Novo E-mail
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="Digite seu novo e-mail"
                  className="border-border bg-background text-foreground"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                {isLoading ? "Atualizando..." : "Atualizar E-mail"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
