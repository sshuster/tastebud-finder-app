
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions?: string[];
  cuisinePreferences?: string[];
  priceRange?: number[];
  allergies?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string[];
  priceRange: number; // 1-4, $ to $$$$
  rating: number; // 0-5
  address: string;
  image: string;
  dietaryOptions: string[]; // vegan, vegetarian, gluten-free, etc.
  popularDishes: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
