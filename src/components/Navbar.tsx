
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-food-orange">
          TasteBud Finder
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-food-orange transition-colors">
            Home
          </Link>
          <Link to="/restaurants" className="text-gray-700 hover:text-food-orange transition-colors">
            Find Restaurants
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-food-orange transition-colors">
            Pricing
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === "admin" ? "/admin" : "/dashboard"} 
                className="text-gray-700 hover:text-food-orange transition-colors"
              >
                {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
              </Link>
              
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{user?.username}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 py-2 hover:text-food-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className="text-gray-700 py-2 hover:text-food-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Restaurants
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 py-2 hover:text-food-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === "admin" ? "/admin" : "/dashboard"} 
                  className="text-gray-700 py-2 hover:text-food-orange transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Link>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
