
export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  genre: string[];
  releaseDate: string;
  publisher: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}
