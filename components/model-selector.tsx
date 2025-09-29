"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Lock } from "lucide-react"

interface ModelSelectorProps {
  selectedModel: "kuenda-2.5" | "kuenda-4.8-pro"
  onModelChange: (model: "kuenda-2.5" | "kuenda-4.8-pro") => void
  isPro: boolean
}

export function ModelSelector({ selectedModel, onModelChange, isPro }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 font-semibold bg-transparent">
          {selectedModel === "kuenda-2.5" ? "Kuenda 2.5" : "Kuenda 4.8 Pro"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onModelChange("kuenda-2.5")} className="cursor-pointer">
          <div className="flex flex-col">
            <span className="font-semibold">Kuenda 2.5</span>
            <span className="text-xs text-muted-foreground">Modelo gratuito</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (isPro) {
              onModelChange("kuenda-4.8-pro")
            } else {
              alert("Você precisa de uma assinatura Pro para usar este modelo")
            }
          }}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="font-semibold">Kuenda 4.8 Pro</span>
              <span className="text-xs text-muted-foreground">Modelo avançado</span>
            </div>
            {!isPro && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
