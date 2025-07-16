
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Dashboard = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Selecione um torneio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Escolha um torneio no menu lateral para continuar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 