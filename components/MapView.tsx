import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Wrench,
  Filter,
  Navigation
} from "lucide-react";

export function MapView() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Mock data para pontos no mapa
  const reportPoints = [
    {
      id: 1,
      type: "security",
      title: "Iluminação Defeituosa",
      location: "Estacionamento Principal",
      status: "pendente",
      urgency: "high",
      position: { x: 45, y: 30 }
    },
    {
      id: 2,
      type: "electrical",
      title: "Problema na Rede Elétrica",
      location: "Bloco A - 2º Andar",
      status: "em_andamento",
      urgency: "critical",
      position: { x: 30, y: 45 }
    },
    {
      id: 3,
      type: "maintenance",
      title: "Banheiro Entupido",
      location: "Biblioteca Central",
      status: "resolvido",
      urgency: "medium",
      position: { x: 60, y: 55 }
    },
    {
      id: 4,
      type: "infrastructure",
      title: "Piso Danificado",
      location: "Bloco C - Entrada",
      status: "pendente",
      urgency: "medium",
      position: { x: 25, y: 70 }
    },
    {
      id: 5,
      type: "security",
      title: "Câmera com Defeito",
      location: "Portaria Norte",
      status: "em_andamento",
      urgency: "high",
      position: { x: 70, y: 25 }
    }
  ];

  const filters = [
    { id: "all", label: "Todos", count: reportPoints.length },
    { id: "security", label: "Segurança", count: reportPoints.filter(p => p.type === "security").length },
    { id: "electrical", label: "Elétrico", count: reportPoints.filter(p => p.type === "electrical").length },
    { id: "maintenance", label: "Manutenção", count: reportPoints.filter(p => p.type === "maintenance").length },
    { id: "infrastructure", label: "Infraestrutura", count: reportPoints.filter(p => p.type === "infrastructure").length }
  ];

  const filteredPoints = selectedFilter === "all" 
    ? reportPoints 
    : reportPoints.filter(point => point.type === selectedFilter);

  const getPointIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="w-4 h-4" />;
      case "electrical":
        return <Zap className="w-4 h-4" />;
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "infrastructure":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getPointColor = (status: string, urgency: string) => {
    if (status === "resolvido") return "bg-green-500 border-green-600";
    if (urgency === "critical") return "bg-red-600 border-red-700";
    if (urgency === "high") return "bg-orange-500 border-orange-600";
    if (status === "em_andamento") return "bg-yellow-500 border-yellow-600";
    return "bg-gray-500 border-gray-600";
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Mapa de Ocorrências</h2>
        <Button size="sm" variant="outline" className="rounded-lg">
          <Navigation className="w-4 h-4 mr-2" />
          Localizar
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Filtrar por:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all active:scale-95 ${
                selectedFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          {/* Map Background */}
          <div className="relative bg-gradient-to-br from-green-100 to-green-200 h-80 overflow-hidden">
            {/* Campus Buildings Representation */}
            <div className="absolute inset-4">
              {/* Bloco A */}
              <div className="absolute top-8 left-6 w-16 h-12 bg-blue-300 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-xs text-blue-800">Bloco A</span>
              </div>
              
              {/* Bloco B */}
              <div className="absolute top-8 right-6 w-16 h-12 bg-blue-300 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-xs text-blue-800">Bloco B</span>
              </div>
              
              {/* Bloco C */}
              <div className="absolute bottom-8 left-6 w-16 h-12 bg-blue-300 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-xs text-blue-800">Bloco C</span>
              </div>
              
              {/* Biblioteca */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-16 bg-purple-300 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-xs text-purple-800">Biblioteca</span>
              </div>
              
              {/* Estacionamento */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-gray-300 rounded shadow-sm flex items-center justify-center">
                <span className="text-xs text-gray-700">Estacionamento</span>
              </div>

              {/* Report Points */}
              {filteredPoints.map((point) => (
                <div
                  key={point.id}
                  className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 ${getPointColor(point.status, point.urgency)} text-white shadow-lg`}
                  style={{
                    left: `${point.position.x}%`,
                    top: `${point.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => {
                    alert(`${point.title}\nLocal: ${point.location}\nStatus: ${point.status}`);
                  }}
                >
                  {getPointIcon(point.type)}
                  
                  {/* Pulse animation for critical issues */}
                  {point.urgency === "critical" && (
                    <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-gray-900">Legenda</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Crítico/Emergência</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Alta Urgência</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Em Andamento</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Resolvido</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Pendente</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Reports List */}
      <div>
        <h3 className="mb-3 text-gray-900">Ocorrências Filtradas ({filteredPoints.length})</h3>
        <div className="space-y-2">
          {filteredPoints.map((point) => (
            <Card key={point.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getPointIcon(point.type)}
                    <span className="text-sm text-gray-900">{point.title}</span>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      point.status === "resolvido" 
                        ? "bg-green-100 text-green-800" 
                        : point.status === "em_andamento"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {point.status === "resolvido" ? "Resolvido" : 
                     point.status === "em_andamento" ? "Em Andamento" : "Pendente"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{point.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}