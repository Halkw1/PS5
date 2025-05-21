
import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/OrderContext";
import { Check, Package, Truck } from "lucide-react";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrder();
  
  const order = id ? getOrderById(id) : undefined;
  
  if (!order) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-ps-darkgray">Obrigado pelo Seu Pedido!</h1>
          <p className="text-muted-foreground mb-8">
            Seu pedido foi recebido e está sendo processado.
          </p>
          
          <div className="bg-card p-6 rounded-lg mb-8 border border-ps-lightgray">
            <h2 className="text-lg font-semibold mb-2 text-ps-darkgray">Pedido #{order.id.slice(-6)}</h2>
            <p className="text-muted-foreground mb-4">
              Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{" "}
              {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
            </p>
            
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-ps-darkgray">Status do Pedido</h3>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="capitalize">
                      {order.status === "pending" ? "Pendente" : 
                       order.status === "processing" ? "Em processamento" : 
                       order.status === "shipped" ? "Enviado" : 
                       order.status === "delivered" ? "Entregue" : order.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-ps-darkgray">Pagamento</h3>
                  <span className="text-green-600">Pago</span>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-ps-darkgray">Total</h3>
                  <span className="font-semibold">R${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg mb-8 border border-ps-lightgray">
            <h2 className="text-lg font-semibold mb-4 text-ps-darkgray">Itens do Pedido</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.game.id} className="flex items-center border-b pb-4">
                  <div className="w-16 h-16 overflow-hidden rounded-md mr-4">
                    <img
                      src={item.game.imageUrl || "/placeholder.svg"}
                      alt={item.game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.game.title}</h3>
                    <p className="text-muted-foreground">
                      Qtd: {item.quantity} x R${item.game.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="font-semibold">
                    R${(item.game.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4 pt-4 border-t">
              <div className="text-right">
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span className="mr-8">Subtotal:</span>
                  <span>R${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span className="mr-8">Frete:</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="mr-8">Total:</span>
                  <span>R${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4 text-ps-darkgray">O Que Vem a Seguir?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center p-4">
                <Package className="h-10 w-10 text-ps-orange mb-4" />
                <h3 className="font-medium mb-2">Processamento do Pedido</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Estamos preparando seu pedido para envio.
                  Você receberá um e-mail assim que estiver pronto.
                </p>
              </div>
              
              <div className="flex flex-col items-center p-4">
                <Truck className="h-10 w-10 text-ps-orange mb-4" />
                <h3 className="font-medium mb-2">Entrega</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Seus jogos serão entregues em 3-5 dias úteis.
                  Acompanhe seu pedido na sua conta.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/orders">
              <Button variant="outline" className="border-ps-orange text-ps-orange hover:bg-ps-orange hover:text-white">Ver Todos os Pedidos</Button>
            </Link>
            <Link to="/games">
              <Button className="bg-ps-orange hover:bg-ps-darkorange">Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
