import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { User, Shield, AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onLogin: (userType: string, email: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userType, setUserType] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!userType) {
      alert("Por favor, selecione seu perfil de acesso");
      return;
    }
    if (!email || !password) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    
    onLogin(userType, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-blue-600 p-4 rounded-full shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="mb-1 text-gray-900">UNIFAP Alerta</h1>
          <p className="text-sm text-gray-600">Sistema de Alertas Universitários</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6 pt-6">
            <CardTitle className="text-center">Entrar</CardTitle>
            <p className="text-center text-sm text-gray-600">Acesse sua conta</p>
          </CardHeader>
          
          <CardContent className="space-y-6 px-6 pb-6">
            {/* User Type Selection */}
            <div className="space-y-4">
              <Label className="text-gray-700">Selecione seu perfil</Label>
              <RadioGroup 
                value={userType} 
                onValueChange={setUserType}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem 
                    value="student" 
                    id="student" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="student"
                    className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 active:scale-95 min-h-[80px] ${
                      userType === "student" 
                        ? "border-blue-500 bg-blue-50 shadow-sm" 
                        : "border-gray-200"
                    }`}
                  >
                    <User className={`w-7 h-7 mb-2 ${
                      userType === "student" ? "text-blue-600" : "text-gray-400"
                    }`} />
                    <span className={`text-sm ${
                      userType === "student" ? "text-blue-600" : "text-gray-600"
                    }`}>
                      Aluno
                    </span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem 
                    value="admin" 
                    id="admin" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="admin"
                    className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 active:scale-95 min-h-[80px] ${
                      userType === "admin" 
                        ? "border-blue-500 bg-blue-50 shadow-sm" 
                        : "border-gray-200"
                    }`}
                  >
                    <Shield className={`w-7 h-7 mb-2 ${
                      userType === "admin" ? "text-blue-600" : "text-gray-400"
                    }`} />
                    <span className={`text-sm ${
                      userType === "admin" ? "text-blue-600" : "text-gray-600"
                    }`}>
                      Administrador
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email institucional
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@unifap.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-base rounded-xl"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-base rounded-xl"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white transition-all rounded-xl active:scale-95 shadow-lg"
              disabled={!userType || !email || !password}
            >
              Entrar
            </Button>

            {/* Additional Links */}
            <div className="text-center space-y-3">
              <button className="text-sm text-blue-600 hover:underline active:text-blue-800 p-2">
                Esqueceu sua senha?
              </button>
              
              {userType === "student" && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p>Primeiro acesso? Use seu email institucional</p>
                  <p>e sua matrícula como senha inicial</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500 px-4">
          <p>Universidade Federal do Amapá - UNIFAP</p>
          <p>Sistema de Alertas e Notificações</p>
        </div>
      </div>
    </div>
  );
}