
import { Restaurant, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    username: "muser",
    email: "muser@example.com",
    role: "user",
    createdAt: new Date().toISOString(),
    preferences: {
      dietaryRestrictions: ["vegetarian"],
      cuisinePreferences: ["italian", "japanese", "mexican"],
      priceRange: [1, 3],
      allergies: ["nuts"],
    },
  },
  {
    id: "2",
    username: "mvc",
    email: "mvc@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Italiano Authentico",
    description: "Authentic Italian cuisine with handmade pasta and wood-fired pizza",
    cuisineType: ["italian"],
    priceRange: 3,
    rating: 4.7,
    address: "123 Pasta Street, Foodville",
    image: "/placeholder.svg",
    dietaryOptions: ["vegetarian", "gluten-free"],
    popularDishes: ["Margherita Pizza", "Fettuccine Alfredo", "Tiramisu"],
  },
  {
    id: "2",
    name: "Sushi Paradise",
    description: "Fresh sushi and Japanese delicacies",
    cuisineType: ["japanese"],
    priceRange: 4,
    rating: 4.9,
    address: "456 Ocean Avenue, Seafood City",
    image: "/placeholder.svg",
    dietaryOptions: ["vegetarian", "gluten-free", "pescatarian"],
    popularDishes: ["Dragon Roll", "Sashimi Platter", "Miso Soup"],
  },
  {
    id: "3",
    name: "Taco Town",
    description: "Authentic Mexican street food",
    cuisineType: ["mexican"],
    priceRange: 2,
    rating: 4.5,
    address: "789 Salsa Road, Spiceville",
    image: "/placeholder.svg",
    dietaryOptions: ["vegetarian", "vegan"],
    popularDishes: ["Street Tacos", "Guacamole", "Churros"],
  },
  {
    id: "4",
    name: "Veggie Delight",
    description: "Plant-based heaven with creative vegetarian and vegan options",
    cuisineType: ["vegetarian", "vegan"],
    priceRange: 3,
    rating: 4.6,
    address: "101 Green Lane, Plantville",
    image: "/placeholder.svg",
    dietaryOptions: ["vegetarian", "vegan", "gluten-free"],
    popularDishes: ["Buddha Bowl", "Impossible Burger", "Raw Cheesecake"],
  },
  {
    id: "5",
    name: "Burger & Brew",
    description: "Craft burgers paired with local beers",
    cuisineType: ["american"],
    priceRange: 2,
    rating: 4.4,
    address: "202 Patty Place, Burgertown",
    image: "/placeholder.svg",
    dietaryOptions: ["vegetarian"],
    popularDishes: ["Classic Cheeseburger", "Sweet Potato Fries", "Craft Beer Flight"],
  },
];

// Mock restaurant recommendations based on user preferences
export const getUserRecommendations = (userId: string): Restaurant[] => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user || !user.preferences) return mockRestaurants;
  
  return mockRestaurants.filter(restaurant => {
    // Match cuisine preferences
    const cuisineMatch = restaurant.cuisineType.some(cuisine => 
      user.preferences?.cuisinePreferences?.includes(cuisine)
    );
    
    // Match dietary restrictions
    const dietaryMatch = user.preferences.dietaryRestrictions?.every(restriction => 
      restaurant.dietaryOptions.includes(restriction)
    );
    
    // Match price range
    const priceMatch = user.preferences.priceRange ? 
      restaurant.priceRange >= user.preferences.priceRange[0] && 
      restaurant.priceRange <= user.preferences.priceRange[1] : true;
    
    return cuisineMatch && dietaryMatch && priceMatch;
  });
};
