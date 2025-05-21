
import React, { useState } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';


export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      // Redirect is handled by the conditional above
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha no login";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(registerData.email, registerData.name, registerData.password);
      // Redirect is handled by the conditional above
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha no cadastro";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Bem-vindo à Loja PS5</h1>
          
          <div className="bg-card p-6 rounded-lg">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Senha</Label>
                      <Link to="/forgot-password" className="text-xs text-ps-orange hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-ps-orange hover:bg-ps-darkorange"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                  
                  <p className="text-sm text-center text-muted-foreground">
                    Para teste, use: admin@ps5store.com / admin123
                  </p>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <Input
                      id="register-name"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password">Senha</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                    <Input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-ps-orange hover:bg-ps-darkorange"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
