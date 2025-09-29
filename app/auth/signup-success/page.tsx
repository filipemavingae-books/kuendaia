import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KuendaLogo } from "@/components/kuenda-logo"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <KuendaLogo />
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-foreground">Conta Criada!</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Verifique seu e-mail para confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Você criou sua conta com sucesso. Por favor, verifique seu e-mail para confirmar sua conta antes de fazer
              login.
            </p>
            <Button asChild className="w-full font-semibold">
              <Link href="/auth/login">Ir para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
