"use client"

import { Button } from "@/components/ui/button"
import { X, LogOut, User, Mail, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile, Subscription } from "@/lib/types"
import Link from "next/link"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  user: SupabaseUser
  profile: Profile | null
  subscription: Subscription | null
}

export function SettingsPanel({ isOpen, onClose, user, profile, subscription }: SettingsPanelProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Configurações</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
            {/* User Info */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold text-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">@{profile?.username}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                {subscription?.plan_type === "pro" ? "Pro" : "Gratuito"}
              </div>
            </div>

            {/* Menu Items */}
            <Button variant="ghost" className="w-full justify-start gap-3 font-semibold" asChild>
              <Link href="/settings/profile">
                <User className="h-4 w-4" />
                Trocar Nome e Usuário
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3 font-semibold" asChild>
              <Link href="/settings/email">
                <Mail className="h-4 w-4" />
                Trocar E-mail
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3 font-semibold" asChild>
              <Link href="/settings/password">
                <Lock className="h-4 w-4" />
                Trocar Senha
              </Link>
            </Button>

            {subscription?.plan_type !== "pro" && (
              <Button variant="ghost" className="w-full justify-start gap-3 font-semibold" asChild>
                <Link href="/settings/upgrade">
                  <Sparkles className="h-4 w-4" />
                  Assinar Pro
                </Link>
              </Button>
            )}

            <div className="pt-4 border-t border-border mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-semibold text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair da Conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
