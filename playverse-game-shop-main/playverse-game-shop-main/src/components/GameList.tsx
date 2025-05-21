
import React, { useState } from "react";
import GameCard from "./GameCard";
import { Game } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GameListProps {
  games: Game[];
  title?: string;
}

export default function GameList({ games, title }: GameListProps) {
  const [sortOption, setSortOption] = useState<string>("featured");
  
  const sortedGames = [...games].sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      case "releaseDesc":
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        {title && <h2 className="text-2xl font-bold mb-4 sm:mb-0">{title}</h2>}
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="releaseDesc">Newest</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              <SelectItem value="titleAsc">Title: A to Z</SelectItem>
              <SelectItem value="titleDesc">Title: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No games found.</p>
        </div>
      )}
    </div>
  );
}
