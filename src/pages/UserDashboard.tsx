
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantCard from "@/components/RestaurantCard";
import { getUserRecommendations, mockRestaurants } from "@/data/mockData";
import { Restaurant } from "@/types";
import { Navigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [cuisineFilter, setCuisineFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      setRecommendations(getUserRecommendations(user.id));
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" />;
  }

  const filteredRestaurants = cuisineFilter === "all"
    ? recommendations
    : recommendations.filter(r => r.cuisineType.includes(cuisineFilter));

  // Prepare data for cuisine pie chart
  const cuisineData = mockRestaurants.reduce((acc: {name: string, value: number}[], restaurant) => {
    restaurant.cuisineType.forEach(cuisine => {
      const existing = acc.find(item => item.name === cuisine);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: cuisine, value: 1 });
      }
    });
    return acc;
  }, []);

  // Prepare data for price range bar chart
  const priceRangeData = Array(4).fill(0).map((_, idx) => {
    const count = mockRestaurants.filter(r => r.priceRange === idx + 1).length;
    return {
      name: '$'.repeat(idx + 1),
      count
    };
  });

  // Colors for pie chart
  const COLORS = ['#F97316', '#84CC16', '#0EA5E9', '#8B5CF6', '#F43F5E'];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
      <p className="text-gray-500 mb-8">Here are your personalized restaurant recommendations</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Recommended Restaurants</CardTitle>
              <CardDescription>Based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">Filter by cuisine:</span>
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cuisines</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Badge className="bg-food-orange">{filteredRestaurants.length} matches</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
                
                {filteredRestaurants.length === 0 && (
                  <div className="col-span-full p-8 text-center border border-dashed rounded-md">
                    <p className="text-gray-500">No restaurants match your selected filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Taste Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.preferences?.dietaryRestrictions?.map((restriction) => (
                    <Badge key={restriction} variant="outline">{restriction}</Badge>
                  ))}
                  {!user?.preferences?.dietaryRestrictions?.length && (
                    <span className="text-sm text-gray-500">None specified</span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cuisine Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.preferences?.cuisinePreferences?.map((cuisine) => (
                    <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                  ))}
                  {!user?.preferences?.cuisinePreferences?.length && (
                    <span className="text-sm text-gray-500">None specified</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Price Range</h3>
                <div className="flex items-center">
                  <span className="text-food-orange font-medium">
                    {user?.preferences?.priceRange ? 
                      `${'$'.repeat(user.preferences.priceRange[0])} to ${'$'.repeat(user.preferences.priceRange[1])}` : 
                      'Any price range'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restaurant Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Cuisine Distribution</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cuisineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name}) => name}
                      >
                        {cuisineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Price Ranges</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceRangeData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
