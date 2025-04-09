
import { useState } from "react";
import { mockRestaurants } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([1, 4]);
  const [dietaryFilters, setDietaryFilters] = useState<Record<string, boolean>>({
    vegetarian: false,
    vegan: false,
    "gluten-free": false,
    pescatarian: false,
  });
  
  const [cuisineFilters, setCuisineFilters] = useState<Record<string, boolean>>({
    italian: false,
    japanese: false,
    mexican: false,
    american: false,
    vegetarian: false,
  });
  
  // Get unique dietary options from all restaurants
  const allDietaryOptions = Array.from(
    new Set(mockRestaurants.flatMap(r => r.dietaryOptions))
  );
  
  // Get unique cuisine types from all restaurants
  const allCuisineTypes = Array.from(
    new Set(mockRestaurants.flatMap(r => r.cuisineType))
  );

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    // Search term filter
    const matchesSearchTerm = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range filter
    const matchesPriceRange = restaurant.priceRange >= priceRange[0] && restaurant.priceRange <= priceRange[1];
    
    // Dietary filter
    const selectedDietary = Object.entries(dietaryFilters).filter(([_, isSelected]) => isSelected).map(([name]) => name);
    const matchesDietary = selectedDietary.length === 0 || 
      selectedDietary.every(diet => restaurant.dietaryOptions.includes(diet));
    
    // Cuisine filter
    const selectedCuisines = Object.entries(cuisineFilters).filter(([_, isSelected]) => isSelected).map(([name]) => name);
    const matchesCuisine = selectedCuisines.length === 0 || 
      restaurant.cuisineType.some(cuisine => selectedCuisines.includes(cuisine));
    
    return matchesSearchTerm && matchesPriceRange && matchesDietary && matchesCuisine;
  });

  const handleDietaryFilterChange = (option: string, checked: boolean) => {
    setDietaryFilters(prev => ({
      ...prev,
      [option]: checked,
    }));
  };

  const handleCuisineFilterChange = (cuisine: string, checked: boolean) => {
    setCuisineFilters(prev => ({
      ...prev,
      [cuisine]: checked,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([1, 4]);
    setDietaryFilters(
      Object.fromEntries(allDietaryOptions.map(option => [option, false]))
    );
    setCuisineFilters(
      Object.fromEntries(allCuisineTypes.map(cuisine => [cuisine, false]))
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Find Your Perfect Restaurant</h1>
      <p className="text-gray-500 mb-8">Discover restaurants that match your taste preferences</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h2 className="font-medium mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search restaurants..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="mb-6">
                    <Slider 
                      min={1} 
                      max={4} 
                      step={1} 
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span>{'$'.repeat(priceRange[0])}</span>
                      <span>{'$'.repeat(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Dietary Options</h3>
                  <div className="space-y-2">
                    {allDietaryOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`diet-${option}`} 
                          checked={dietaryFilters[option] || false}
                          onCheckedChange={(checked) => 
                            handleDietaryFilterChange(option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`diet-${option}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Cuisine Type</h3>
                  <div className="space-y-2">
                    {allCuisineTypes.map(cuisine => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cuisine-${cuisine}`} 
                          checked={cuisineFilters[cuisine] || false}
                          onCheckedChange={(checked) => 
                            handleCuisineFilterChange(cuisine, checked as boolean)
                          }
                        />
                        <Label htmlFor={`cuisine-${cuisine}`} className="text-sm">{cuisine}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="font-medium">
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
            
            {filteredRestaurants.length === 0 && (
              <div className="col-span-full p-12 text-center border border-dashed rounded-md">
                <p className="text-gray-500">No restaurants match your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
