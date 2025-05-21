
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { games } from "@/data/games";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import GameList from "@/components/GameList";

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const game = games.find((g) => g.id === id);
  
  if (!game) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Jogo Não Encontrado</h1>
          <p className="mb-8">Desculpe, não conseguimos encontrar o jogo que você está procurando.</p>
          <Button onClick={() => navigate("/games")} className="bg-ps-orange hover:bg-ps-darkorange">
            Explorar Todos os Jogos
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Get related games (same genre)
  const relatedGames = games
    .filter(
      (g) =>
        g.id !== game.id &&
        g.genre.some((genre) => game.genre.includes(genre))
    )
    .slice(0, 4);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Game Image */}
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden border">
              <img
                src={game.imageUrl || "/placeholder.svg"}
                alt={game.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Game Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-muted-foreground mb-4">{game.publisher}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {game.genre.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-ps-lightgray text-ps-darkgray">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <p className="mb-6 text-lg font-semibold text-ps-orange">
              R${game.price.toFixed(2)}
            </p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Data de Lançamento:</h3>
              <p>{new Date(game.releaseDate).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Descrição:</h3>
              <p className="text-muted-foreground">{game.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Disponibilidade:</h3>
              <p>
                {game.inStock ? (
                  <span className="text-green-600">Em Estoque</span>
                ) : (
                  <span className="text-red-600">Fora de Estoque</span>
                )}
              </p>
            </div>
            
            <Button
              onClick={() => addToCart(game)}
              className="w-full sm:w-auto bg-ps-orange hover:bg-ps-darkorange text-white"
              size="lg"
              disabled={!game.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
        
        {/* Related Games Section */}
        {relatedGames.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Você Também Pode Gostar</h2>
            <GameList games={relatedGames} />
          </section>
        )}
      </div>
    </Layout>
  );
}
