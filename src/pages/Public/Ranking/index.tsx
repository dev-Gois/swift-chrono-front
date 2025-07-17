import { useParams, useNavigate } from "react-router-dom";
import { useFetchRanking } from "@/services/useRanking";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award, ArrowLeft, Clock, Hash, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PublicRanking = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data: ranking, isLoading } = useFetchRanking(categoryId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center bg-gray-100 rounded-full text-sm font-semibold text-gray-600">{position}</div>;
    }
  };

  const getPodiumColors = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-white text-gray-900";
    }
  };

  const categoryName = Array.isArray(ranking) && ranking.length > 0 ? ranking[0].category : "Categoria";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <Button
              variant="ghost"
              onClick={() => navigate('/categories')}
              className="flex items-center text-gray-600 hover:text-gray-900 self-start"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar às categorias
            </Button>
            
            <div className="text-center md:flex-1">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Ranking - {categoryName}
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Classificação atual dos atletas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Array.isArray(ranking) && ranking.length > 0 ? (
          <>
            {/* Podium - Top 3 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Pódio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {ranking.slice(0, 3).map((athlete: any) => (
                  <Card 
                    key={athlete.position} 
                    className={`transform hover:scale-105 transition-all duration-300 border-0 shadow-lg ${
                      athlete.position === 1 ? 'md:order-2 md:scale-110' : 
                      athlete.position === 2 ? 'md:order-1' : 'md:order-3'
                    }`}
                  >
                    <CardContent className={`p-6 ${getPodiumColors(athlete.position)}`}>
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          {getPodiumIcon(athlete.position)}
                        </div>
                        <div className="text-3xl font-bold mb-2">{athlete.position}º</div>
                        <div className="text-lg font-semibold mb-1">{athlete.name}</div>
                        <div className="text-sm opacity-90 mb-2">#{athlete.plate}</div>
                        <div className="text-sm opacity-90 mb-3">{athlete.team}</div>
                        <div className="text-xl font-mono font-bold">{athlete.time}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Complete Ranking */}
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Classificação Completa</h2>
              <div className="space-y-3">
                {ranking.map((athlete: any) => (
                  <Card 
                    key={athlete.position} 
                    className={`transition-all duration-200 hover:shadow-md border-0 shadow-sm ${
                      athlete.position <= 3 ? 'ring-2 ring-blue-200' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                            {athlete.position <= 3 ? (
                              getPodiumIcon(athlete.position)
                            ) : (
                              <span className="font-bold text-gray-600">{athlete.position}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{athlete.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Hash className="h-4 w-4 mr-1" />
                                    {athlete.plate}
                                  </div>
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-1" />
                                    {athlete.team}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">Tempo</span>
                          </div>
                          <div className="text-2xl font-mono font-bold text-gray-900">
                            {athlete.time}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum atleta classificado</h3>
            <p className="text-gray-600">Não há atletas classificados nesta categoria ainda.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SwiftChrono. Sistema de cronometragem esportiva.</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 