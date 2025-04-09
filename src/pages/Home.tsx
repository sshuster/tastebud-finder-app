
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Utensils, Heart, Filter } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-food-orange/30 to-food-yellow/30 -z-10"></div>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Restaurants That Match Your 
              <span className="text-food-orange"> Perfect Taste</span>
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Find restaurants tailored to your dietary needs, health restrictions, and personal preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-food-orange hover:bg-food-brown">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "View Dashboard" : "Get Started"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Finding your perfect restaurant match has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 bg-food-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-food-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tell Us Your Preferences</h3>
              <p className="text-gray-600">
                Share your dietary needs, allergies, cuisine preferences, and other restrictions.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-food-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-food-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                Our algorithm finds restaurants that perfectly match your unique requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-food-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-food-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enjoy Perfect Meals</h3>
              <p className="text-gray-600">
                Discover and enjoy meals that match your tastes and dietary needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Our Users Love Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here's what our satisfied users have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "As someone with celiac disease, finding safe restaurants was always a challenge. TasteBud Finder has made it so much easier to discover gluten-free options I can trust."
              </p>
              <p className="font-medium">Sarah J.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "The personalized recommendations are spot on! I've discovered so many new restaurants that perfectly match my vegan lifestyle and love for spicy food."
              </p>
              <p className="font-medium">Michael T.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "With multiple food allergies, dining out was anxiety-inducing. This app has changed that completely. I can now find safe places to eat with confidence."
              </p>
              <p className="font-medium">Emily R.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-food-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Restaurant?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers who've discovered their new favorite restaurants with TasteBud Finder.
          </p>
          <Button size="lg" variant="outline" className="bg-white text-food-orange hover:bg-gray-100" asChild>
            <Link to={isAuthenticated ? "/restaurants" : "/register"}>
              {isAuthenticated ? "Find Restaurants" : "Sign Up Free"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">TasteBud Finder</h3>
              <p className="text-gray-300">
                Helping you discover restaurants that match your perfect taste and dietary needs.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><Link to="/pricing" className="text-gray-300 hover:text-white">Pricing</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>© {new Date().getFullYear()} TasteBud Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
