import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { AlertProvider } from "./components/AlertContext";
import { TicketProvider } from "./components/TicketContext";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string>("");
  const [user, setUser] = useState<{email: string, name: string} | null>(null);

  const handleLogin = (type: string, email: string, password: string) => {
    // Simulação de login
    setUserType(type);
    setUser({
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase()
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType("");
    setUser(null);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AlertProvider>
      <TicketProvider>
        {userType === "student" ? (
          <StudentDashboard user={user} onLogout={handleLogout} />
        ) : userType === "admin" ? (
          <AdminDashboard user={user} onLogout={handleLogout} />
        ) : (
          <div>Tipo de usuário não reconhecido</div>
        )}
      </TicketProvider>
    </AlertProvider>
  );
}