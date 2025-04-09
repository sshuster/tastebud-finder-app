
import { Restaurant } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const priceSymbol = Array(restaurant.priceRange).fill('$').join('');
  
  return (
    <Card className="food-card overflow-hidden h-full flex flex-col">
      <div className="relative h-40 bg-gray-100">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white text-black">
            <StarIcon className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
            {restaurant.rating}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{restaurant.name}</CardTitle>
          <span className="text-food-orange font-medium">{priceSymbol}</span>
        </div>
        <CardDescription className="text-sm text-muted-foreground">{restaurant.address}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm mb-3">{restaurant.description}</p>
        <div className="flex flex-wrap gap-1">
          {restaurant.cuisineType.map((cuisine) => (
            <Badge key={cuisine} variant="outline" className="text-xs">
              {cuisine}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex-col items-start gap-2">
        <p className="text-xs font-medium text-gray-500">Dietary Options:</p>
        <div className="flex flex-wrap gap-1">
          {restaurant.dietaryOptions.map((option) => (
            <span key={option} className="food-filter-badge">
              {option}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
