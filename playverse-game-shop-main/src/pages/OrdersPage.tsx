
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export default function OrdersPage() {
  const { orders } = useOrder();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4 text-ps-darkgray">Login Necessário</h1>
          <p className="mb-8">Por favor, faça login para ver seus pedidos.</p>
          <Button 
            onClick={() => navigate("/login", { state: { from: "/orders" } })}
            className="bg-ps-orange hover:bg-ps-darkorange"
          >
            Entrar
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-ps-darkgray">Meus Pedidos</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <Package className="w-16 h-16 mx-auto text-ps-lightgray" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-ps-darkgray">Nenhum pedido ainda</h2>
            <p className="text-muted-foreground mb-8">
              Você ainda não fez nenhum pedido. Comece a comprar para fazer seu primeiro pedido.
            </p>
            <Link to="/games">
              <Button className="bg-ps-orange hover:bg-ps-darkorange">
                Explorar Jogos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-ps-darkgray">
                <TableRow>
                  <TableHead className="text-white">Número do Pedido</TableHead>
                  <TableHead className="text-white">Data</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Itens</TableHead>
                  <TableHead className="text-white text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "delivered" ? "default" : "outline"} className="bg-ps-orange text-white">
                        {order.status === "delivered" ? "Entregue" : "Em processamento"}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items.reduce((total, item) => total + item.quantity, 0)}</TableCell>
                    <TableCell className="text-right">R${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Link to={`/order-confirmation/${order.id}`}>
                        <Button variant="ghost" size="sm" className="text-ps-orange hover:text-ps-darkorange">
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
}
