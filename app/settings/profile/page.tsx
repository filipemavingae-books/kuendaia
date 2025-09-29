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

export default function ProfileSettingsPage() {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profile) {
      setFullName(profile.full_name)
      setUsername(profile.username)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username,
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccess("Perfil atualizado com sucesso!")
      setTimeout(() => router.push("/chat"), 2000)
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
            <CardTitle className="text-2xl font-bold text-foreground">Editar Perfil</CardTitle>
            <CardDescription className="text-muted-foreground">Atualize seu nome e nome de usuário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-semibold">
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-semibold">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
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
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
