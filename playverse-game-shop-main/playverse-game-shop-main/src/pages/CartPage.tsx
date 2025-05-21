
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { X, Trash, ShoppingCart, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleQuantityChange = (gameId: string, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(gameId, quantity);
    }
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho de Compras</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-8">
              Parece que você ainda não adicionou nenhum jogo ao seu carrinho.
            </p>
            <Link to="/games">
              <Button className="bg-ps-orange hover:bg-ps-darkorange">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Produto</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.game.id}>
                      <TableCell>
                        <div className="w-16 h-16 overflow-hidden rounded-md">
                          <img
                            src={item.game.imageUrl || "/placeholder.svg"}
                            alt={item.game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/games/${item.game.id}`}
                          className="font-medium hover:text-ps-orange transition-colors"
                        >
                          {item.game.title}
                        </Link>
                      </TableCell>
                      <TableCell>R${item.game.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.game.id, e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        R${(item.game.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.game.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="flex items-center"
              >
                <Trash className="mr-2 h-4 w-4" />
                Limpar Carrinho
              </Button>
              
              <Link to="/games">
                <Button variant="ghost" className="flex items-center">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 p-6 bg-card rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Subtotal:</span>
                <span className="text-lg font-semibold">R${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-muted-foreground">
                <span>Frete:</span>
                <span>Calculado no checkout</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-xl font-bold">R${totalPrice.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-ps-orange hover:bg-ps-darkorange"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
