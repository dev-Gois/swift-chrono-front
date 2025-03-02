import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  LogOut, 
  User, 
  Settings, 
  Home, 
  Trophy, 
  Calendar, 
  Users, 
  Clock,
  ChevronRight,
  Star,
  Medal,
  Route,
  Timer,
  ListFilter,
  Activity
} from 'lucide-react';

// Mock data for competitions
const competitions = [
  {
    id: 1,
    title: "Maratona da Cidade",
    date: "15 de Outubro, 2025",
    status: "Em breve",
    participants: 1280,
    category: "Corrida",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop",
    progress: 0,
    distance: "42km",
    location: "Centro da Cidade"
  },
  {
    id: 2,
    title: "Triathlon Regional",
    date: "3 de Setembro, 2025",
    status: "Inscrições abertas",
    participants: 350,
    category: "Triathlon",
    image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=2070&auto=format&fit=crop",
    progress: 25,
    distance: "Olympic",
    location: "Praia Central"
  },
  {
    id: 3,
    title: "Corrida de Montanha",
    date: "20 de Agosto, 2025",
    status: "Em andamento",
    participants: 210,
    category: "Trail",
    image: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=2070&auto=format&fit=crop",
    progress: 65,
    distance: "21km",
    location: "Serra do Mar"
  },
  {
    id: 4,
    title: "Ciclismo de Estrada",
    date: "5 de Julho, 2025",
    status: "Finalizado",
    participants: 156,
    category: "Ciclismo",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
    progress: 100,
    distance: "120km",
    location: "Rodovia Estadual"
  },
];

// Mock data for athletes
const athletes = [
  {
    id: 1,
    name: "Ana Silva",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    rank: 1,
    points: 2450,
    competitions: 12,
    bestTime: "2h 45m 12s",
    category: "Elite Feminino",
    age: 28
  },
  {
    id: 2,
    name: "Carlos Mendes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    rank: 2,
    points: 2320,
    competitions: 10,
    bestTime: "2h 38m 45s",
    category: "Elite Masculino",
    age: 32
  },
  {
    id: 3,
    name: "Juliana Costa",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    rank: 3,
    points: 2180,
    competitions: 15,
    bestTime: "2h 47m 30s",
    category: "Elite Feminino",
    age: 26
  },
  {
    id: 4,
    name: "Roberto Almeida",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    rank: 4,
    points: 2050,
    competitions: 8,
    bestTime: "2h 42m 18s",
    category: "Elite Masculino",
    age: 35
  },
  {
    id: 5,
    name: "Fernanda Lima",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    rank: 5,
    points: 1980,
    competitions: 11,
    bestTime: "2h 51m 22s",
    category: "Elite Feminino",
    age: 29
  },
  {
    id: 6,
    name: "Paulo Santos",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    rank: 6,
    points: 1920,
    competitions: 9,
    bestTime: "2h 44m 55s",
    category: "Elite Masculino",
    age: 31
  }
];

// Mock data for categories
const categories = [
  {
    id: 1,
    name: "Elite Masculino",
    participants: 124,
    ageRange: "18-39",
    description: "Categoria principal masculina para atletas de alto rendimento"
  },
  {
    id: 2,
    name: "Elite Feminino",
    participants: 98,
    ageRange: "18-39",
    description: "Categoria principal feminina para atletas de alto rendimento"
  },
  {
    id: 3,
    name: "Master A Masculino",
    participants: 156,
    ageRange: "40-49",
    description: "Categoria masculina para atletas entre 40 e 49 anos"
  },
  {
    id: 4,
    name: "Master A Feminino",
    participants: 87,
    ageRange: "40-49",
    description: "Categoria feminina para atletas entre 40 e 49 anos"
  },
  {
    id: 5,
    name: "Master B Masculino",
    participants: 112,
    ageRange: "50-59",
    description: "Categoria masculina para atletas entre 50 e 59 anos"
  },
  {
    id: 6,
    name: "Master B Feminino",
    participants: 64,
    ageRange: "50-59",
    description: "Categoria feminina para atletas entre 50 e 59 anos"
  },
  {
    id: 7,
    name: "Master C",
    participants: 78,
    ageRange: "60+",
    description: "Categoria para atletas com 60 anos ou mais"
  },
  {
    id: 8,
    name: "Juvenil",
    participants: 92,
    ageRange: "14-17",
    description: "Categoria para jovens atletas entre 14 e 17 anos"
  }
];

// Mock data for routes/courses
const routes = [
  {
    id: 1,
    name: "Percurso Maratona",
    distance: "42km",
    elevation: "350m",
    terrain: "Asfalto",
    checkpoints: 8,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop",
    description: "Percurso oficial de maratona que atravessa os principais pontos da cidade"
  },
  {
    id: 2,
    name: "Meia Maratona",
    distance: "21km",
    elevation: "180m",
    terrain: "Asfalto",
    checkpoints: 4,
    image: "https://images.unsplash.com/photo-1465310477141-6fb93167a273?q=80&w=2070&auto=format&fit=crop",
    description: "Percurso de meia maratona ideal para atletas intermediários"
  },
  {
    id: 3,
    name: "Trilha da Montanha",
    distance: "15km",
    elevation: "850m",
    terrain: "Trail",
    checkpoints: 5,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
    description: "Percurso desafiador em trilha com subidas íngremes e terreno técnico"
  },
  {
    id: 4,
    name: "Circuito de Ciclismo",
    distance: "120km",
    elevation: "1200m",
    terrain: "Asfalto",
    checkpoints: 6,
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop",
    description: "Percurso de ciclismo de estrada com diversas subidas e descidas técnicas"
  },
  {
    id: 5,
    name: "Sprint Urbano",
    distance: "5km",
    elevation: "50m",
    terrain: "Asfalto",
    checkpoints: 2,
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop",
    description: "Percurso rápido pelo centro da cidade, ideal para iniciantes"
  },
  {
    id: 6,
    name: "Triathlon Olímpico",
    distance: "51.5km",
    elevation: "400m",
    terrain: "Misto",
    checkpoints: 7,
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=2074&auto=format&fit=crop",
    description: "Percurso completo de triathlon com natação (1.5km), ciclismo (40km) e corrida (10km)"
  }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Timer className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ChronoTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden md:block p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("overview")}>
              <Home className="mr-2 h-5 w-5" />
              Visão Geral
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("competitions")}>
              <Trophy className="mr-2 h-5 w-5" />
              Competições
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("athletes")}>
              <Users className="mr-2 h-5 w-5" />
              Atletas
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("categories")}>
              <ListFilter className="mr-2 h-5 w-5" />
              Categorias
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("routes")}>
              <Route className="mr-2 h-5 w-5" />
              Percursos
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight">Sistema de Cronometragem</h2>
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="competitions">Competições</TabsTrigger>
                <TabsTrigger value="athletes">Atletas</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="routes">Percursos</TabsTrigger>
              </TabsList>
            </div>

            {/* VISÃO GERAL */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Competições</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">4 competições ativas</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Atletas Registrados</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,845</div>
                    <p className="text-xs text-muted-foreground">+156 no último mês</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">8 categorias ativas</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Percursos</CardTitle>
                    <Route className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">6 percursos ativos</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Próximas Competições</CardTitle>
                    <CardDescription>
                      Competições que estão por vir ou em andamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {competitions.slice(0, 3).map((competition) => (
                        <div key={competition.id} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={competition.image} 
                              alt={competition.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{competition.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{competition.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Route className="h-3 w-3" />
                              <span>{competition.distance} - {competition.location}</span>
                            </div>
                            <Progress value={competition.progress} className="h-1 mt-2" />
                          </div>
                          <Badge variant={competition.status === "Finalizado" ? "secondary" : "default"}>
                            {competition.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setActiveTab("competitions")}>
                      Ver todas
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Atletas Destaque</CardTitle>
                    <CardDescription>
                      Top atletas da plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {athletes.slice(0, 3).map((athlete) => (
                        <div key={athlete.id} className="flex items-center gap-3">
                          <div className="flex-shrink-0 relative">
                            <Avatar>
                              <AvatarImage src={athlete.avatar} alt={athlete.name} />
                              <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {athlete.rank <= 3 && (
                              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {athlete.rank}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{athlete.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{athlete.points} pts</span>
                            </div>
                          </div>
                          <div className="text-xs text-right">
                            <div className="font-medium">{athlete.bestTime}</div>
                            <div className="text-muted-foreground">melhor tempo</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>
                    Últimas atualizações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Resultados publicados</p>
                        <p className="text-sm text-muted-foreground">Os resultados da Maratona da Cidade foram publicados</p>
                        <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Novo atleta registrado</p>
                        <p className="text-sm text-muted-foreground">Marcos Oliveira se registrou para o Triathlon Regional</p>
                        <p className="text-xs text-muted-foreground mt-1">Há 5 horas</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Trophy className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Nova competição criada</p>
                        <p className="text-sm text-muted-foreground">Corrida de Montanha foi adicionada ao calendário</p>
                        <p className="text-xs text-muted-foreground mt-1">Há 1 dia</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* COMPETIÇÕES */}
            <TabsContent value="competitions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Competições</CardTitle>
                      <CardDescription>
                        Gerencie todas as competições do sistema
                      </CardDescription>
                    </div>
                    <Button>Nova Competição</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {competitions.map((competition) => (
                      <Card key={competition.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={competition.image} 
                            alt={competition.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{competition.title}</CardTitle>
                            <Badge variant={competition.status === "Finalizado" ? "secondary" : "default"}>
                              {competition.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{competition.date}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{competition.participants} atletas</span>
                            </div>
                            <Badge variant="outline">{competition.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Route className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{competition.distance} - {competition.location}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{competition.progress}%</span>
                            </div>
                            <Progress value={competition.progress} className="h-2" />
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline">Detalhes</Button>
                          {competition.status === "Finalizado" ? (
                            <Button variant="secondary">Resultados</Button>
                          ) : competition.status === "Em andamento" ? (
                            <Button>Cronometrar</Button>
                          ) : (
                            <Button>Gerenciar</Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendário de Competições</CardTitle>
                  <CardDescription>
                    Visualize as próximas datas importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitions.map((competition) => (
                      <div key={competition.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={competition.image} 
                            alt={competition.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{competition.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{competition.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>07:00 - 14:00</span>
                          </div>
                        </div>
                        <Badge variant={competition.status === "Finalizado" ? "secondary" : "default"}>
                          {competition.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ATLETAS */}
            <TabsContent value="athletes" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Atletas</CardTitle>
                      <CardDescription>
                        Gerencie todos os atletas registrados no sistema
                      </CardDescription>
                    </div>
                    <Button>Novo Atleta</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 p-4 border-b font-medium">
                      <div className="col-span-4">Nome</div>
                      <div className="col-span-2">Categoria</div>
                      <div className="col-span-1 text-center">Idade</div>
                      <div className="col-span-2 text-center">Melhor Tempo</div>
                      <div className="col-span-1 text-center">Eventos</div>
                      <div className="col-span-2 text-right">Ações</div>
                    </div>
                    
                    {athletes.map((athlete) => (
                      <div key={athlete.id} className="grid grid-cols-12 p-4 border-b items-center hover:bg-muted/50">
                        <div className="col-span-4 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={athlete.avatar} alt={athlete.name} />
                            <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{athlete.name}</div>
                            <div className="text-xs text-muted-foreground">{athlete.points} pontos</div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">{athlete.category}</Badge>
                        </div>
                        <div className="col-span-1 text-center">{athlete.age}</div>
                        <div className="col-span-2 text-center font-mono">{athlete.bestTime}</div>
                        <div className="col-span-1 text-center">{athlete.competitions}</div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button variant="outline" size="sm">Perfil</Button>
                          <Button variant="outline" size="sm">Resultados</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando 6 de 2,845 atletas
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="outline" size="sm">Próximo</Button>
                  </div>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Categoria</CardTitle>
                    <CardDescription>
                      Número de atletas por categoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.slice(0, 4).map((category) => (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{category.ageRange} anos</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{category.participants}</div>
                            <Progress value={(category.participants / 200) * 100} className="h-2 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas de Atletas</CardTitle>
                    <CardDescription>
                      Dados gerais sobre os atletas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Idade Média</p>
                        <p className="text-2xl font-bold">34.5</p>
                      </div>
                      <div className="space-y-1 border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Tempo Médio</p>
                        <p className="text-2xl font-bold">3h 12m</p>
                      </div>
                      <div className="space-y-1 border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Masculino</p>
                        <p className="text-2xl font-bold">62%</p>
                      </div>
                      <div className="space-y-1 border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Feminino</p>
                        <p className="text-2xl font-bold">38%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CATEGORIAS */}
            <TabsContent value="categories" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Categorias</CardTitle>
                      <CardDescription>
                        Gerencie as categorias de competição
                      </CardDescription>
                    </div>
                    <Button>Nova Categoria</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                      <Card key={category.id}>
                        <CardHeader>
                          <CardTitle>{category.name}</CardTitle>
                          <CardDescription>
                            Faixa etária: {category.ageRange} anos
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {category.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{category.participants} atletas</span>
                            </div>
                            <Badge variant="outline">Ativa</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm">Ver Atletas</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regras de Categorização</CardTitle>
                  <CardDescription>
                    Como os atletas são classificados nas categorias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Categorias por Idade</h3>
                      <p className="text-sm text-muted-foreground">
                        Os atletas são classificados por idade de acordo com o ano de nascimento, 
                        considerando a idade que completarão no ano da competição.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Categorias por Gênero</h3>
                      <p className="text-sm text-muted-foreground">
                        As categorias são divididas por gênero, com exceção da categoria Master C 
                        que pode incluir atletas de ambos os gêneros acima de 60 anos.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Categorias Especiais</h3>
                      <p className="text-sm text-muted-foreground">
                        Atletas com deficiência podem ser classificados em categorias específicas 
                        de acordo com sua classificação funcional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PERCURSOS */}
            <TabsContent value="routes" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Percursos</CardTitle>
                      <CardDescription>
                        Gerencie os percursos das competições
                      </CardDescription>
                    </div>
                    <Button>Novo Percurso</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {routes.map((route) => (
                      <Card key={route.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={route.image} 
                            alt={route.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle>{route.name}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-2">
                              <Route className="h-4 w-4" />
                              <span>{route.distance}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {route.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Elevação</p>
                              <p className="text-sm font-medium">{route.elevation}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Terreno</p>
                              <p className="text-sm font-medium">{route.terrain}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Checkpoints</p>
                              <p className="text-sm font-medium">{route.checkpoints}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Status</p>
                              <Badge variant="outline">Ativo</Badge>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline">Editar</Button>
                          <Button>Ver Mapa</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pontos de Cronometragem</CardTitle>
                  <CardDescription>
                    Configuração dos pontos de controle e cronometragem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Tipos de Pontos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                            <p className="font-medium">Largada</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Ponto inicial da competição onde é registrado o tempo de saída.
                          </p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
                            <p className="font-medium">Intermediário</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Pontos ao longo do percurso para registro de tempos parciais.
                          </p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                            <p className="font-medium">Chegada</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Ponto final onde é registrado o tempo total da prova.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Tecnologias de Cronometragem</h3>
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">RFID</p>
                              <p className="text-xs text-muted-foreground">Chips passivos de identificação por radiofrequência</p>
                            </div>
                          </div>
                          <Badge>Principal</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">QR Code</p>
                              <p className="text-xs text-muted-foreground">Leitura de códigos QR nos números de peito</p>
                            </div>
                          </div>
                          <Badge variant="outline">Secundário</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Manual</p>
                              <p className="text-xs text-muted-foreground">Registro manual com cronômetros</p>
                            </div>
                          </div>
                          <Badge variant="outline">Backup</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}