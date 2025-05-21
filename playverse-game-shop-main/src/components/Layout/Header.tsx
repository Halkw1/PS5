
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LogIn, 
  PackageOpen, 
  Search 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="hidden md:flex md:w-1/4">
          <Link to="/" className="flex items-center font-bold text-lg text-ps-orange hover:text-ps-lightorange transition-colors">
            PS5<span className="text-ps-lightorange">Store</span>
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="mr-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Mobile Logo */}
        <div className="md:hidden flex flex-1 items-center justify-center">
          <Link to="/" className="flex items-center font-bold text-lg text-ps-orange hover:text-ps-lightorange transition-colors">
            PS5<span className="text-ps-lightorange">Store</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-foreground hover:text-ps-orange transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link to="/games" className="text-foreground hover:text-ps-orange transition-colors">
                Todos os Jogos
              </Link>
            </li>
            <li>
              <Link to="/new-releases" className="text-foreground hover:text-ps-orange transition-colors">
                Lançamentos
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex md:w-1/4 md:justify-end md:space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ps-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-ps-orange text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex w-full items-center">
                    <User size={16} className="mr-2" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/orders" className="flex w-full items-center">
                    <PackageOpen size={16} className="mr-2" />
                    Meus Pedidos
                  </Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem>
                    <Link to="/admin" className="flex w-full items-center">
                      Painel de Administração
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <LogIn size={20} />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile Actions */}
        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ps-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-border py-3 px-4">
          <div className="container">
            <div className="flex items-center">
              <Input 
                placeholder="Buscar jogos..." 
                className="flex-1"
                autoFocus
              />
              <Button className="ml-2 bg-ps-orange hover:bg-ps-darkorange" size="sm">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container py-4">
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Início
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/games" 
                    className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Todos os Jogos
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/new-releases" 
                    className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Lançamentos
                  </Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link 
                        to="/profile" 
                        className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Meu Perfil
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/orders" 
                        className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Meus Pedidos
                      </Link>
                    </li>
                    {user?.isAdmin && (
                      <li>
                        <Link 
                          to="/admin" 
                          className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Painel de Administração
                        </Link>
                      </li>
                    )}
                    <li>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto text-foreground hover:text-ps-orange transition-colors" 
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sair
                      </Button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      to="/login" 
                      className="flex py-2 text-foreground hover:text-ps-orange transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Entrar / Cadastrar
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
