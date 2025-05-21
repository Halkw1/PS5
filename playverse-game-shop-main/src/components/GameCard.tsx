
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Game } from "@/types/types";
import { useCart } from "@/contexts/CartContext";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <Link to={`/games/${game.id}`}>
        <div className="aspect-[3/4] overflow-hidden relative">
          <img 
            src={game.imageUrl || "/placeholder.svg"} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {game.featured && (
            <Badge className="absolute top-2 left-2 bg-ps-blue hover:bg-ps-blue">
              Promoção
            </Badge>
          )}
          {!game.inStock && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg font-semibold text-foreground">Out of Stock</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {game.genre.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-lg leading-tight mb-1 hover:text-ps-blue transition-colors line-clamp-2">
            {game.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {game.publisher}
          </p>
          <p className="font-bold text-lg">R${game.price.toFixed(2)}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-orange-600 hover:bg-orange-500"
            disabled={!game.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
           Adicionar ao Carrinho
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
