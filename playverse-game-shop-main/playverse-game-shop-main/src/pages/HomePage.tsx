
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Layout from "@/components/Layout/Layout";
import GameCard from "@/components/GameCard";
import GameList from "@/components/GameList";
import { games } from "@/data/games";

const featuredGames = games.filter((game) => game.featured);
const newReleases = [...games].sort((a, b) => 
  new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
).slice(0, 4);

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ps-black text-white">
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Experimente Jogos de Próxima Geração
            </h1>
            <p className="text-lg mb-8">
              Compre os mais recentes jogos para PlayStation 5 com frete grátis e ofertas exclusivas.
            </p>
            <div className="flex gap-4">
              <Link to="/games">
                <Button className="bg-ps-orange hover:bg-ps-darkorange">
                  Comprar Agora
                </Button>
              </Link>
              <Link to="/new-releases">
                <Button className="bg-ps-orange hover:bg-ps-darkorange">
                  Lançamentos
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ps-black via-ps-darkgray/80 to-transparent"></div>
      </section>

      {/* Featured Games Carousel */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Jogos em Destaque</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredGames.map((game) => (
                <CarouselItem key={game.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-6">
                  <GameCard game={game} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
      </section>

      {/* New Releases */}
      <section className="py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Lançamentos</h2>
            <Link to="/new-releases" className="text-ps-orange hover:text-ps-darkorange hover:underline">
              Ver Todos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newReleases.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="w-12 h-12 mb-4 rounded-full bg-ps-orange/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ps-orange">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Frete Grátis</h3>
              <p className="text-muted-foreground">Em todos os pedidos acima de R$200. Receba seus jogos em casa gratuitamente.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="w-12 h-12 mb-4 rounded-full bg-ps-orange/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ps-orange">
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9-9v18"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Suporte 24/7</h3>
              <p className="text-muted-foreground">Nossa equipe de suporte está disponível 24 horas por dia para ajudá-lo.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="w-12 h-12 mb-4 rounded-full bg-ps-orange/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ps-orange">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pagamentos Seguros</h3>
              <p className="text-muted-foreground">Todas as suas informações de pagamento são criptografadas e seguras conosco.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-ps-orange text-white">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Inscreva-se em Nossa Newsletter</h2>
            <p className="mb-6">Receba as últimas notícias, ofertas exclusivas e atualizações de jogos diretamente na sua caixa de entrada.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Seu endereço de e-mail" 
                className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-ps-orange hover:bg-white/90">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
