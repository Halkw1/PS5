
import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import GameList from "@/components/GameList";
import { games } from "@/data/games";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  // Extract all unique genres
  const allGenres = Array.from(
    new Set(games.flatMap((game) => game.genre))
  ).sort();
  
  // Filter games based on search term and selected genres
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenres.length === 0 || 
                         game.genre.some((genre) => selectedGenres.includes(genre));
    
    return matchesSearch && matchesGenre;
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 text-ps-darkgray">Todos os Jogos PS5</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-ps-darkgray">Buscar</h3>
              <Input
                placeholder="Buscar jogos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-ps-lightgray focus:border-ps-orange"
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-ps-darkgray">Filtrar por Gênero</h3>
              <div className="space-y-2">
                {allGenres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`genre-${genre}`}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                      className="text-ps-orange border-ps-lightgray"
                    />
                    <Label htmlFor={`genre-${genre}`} className="text-ps-gray">{genre}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedGenres.length > 0 && (
              <button
                onClick={() => setSelectedGenres([])}
                className="text-sm text-ps-orange hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
          
          {/* Game List */}
          <div className="flex-1">
            <GameList games={filteredGames} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
