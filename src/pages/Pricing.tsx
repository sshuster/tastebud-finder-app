
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic restaurant discovery",
      features: [
        "Basic restaurant search",
        "View restaurant details",
        "Limited filters",
        "5 saved favorites",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "monthly",
      description: "Enhanced discovery with personalization",
      features: [
        "Advanced restaurant filters",
        "Personalized recommendations",
        "Unlimited saved favorites",
        "Dietary preference matching",
        "Taste profile analysis",
      ],
      cta: "Subscribe Now",
      popular: true,
    },
    {
      name: "Ultimate",
      price: "$19.99",
      period: "monthly",
      description: "Complete restaurant discovery suite",
      features: [
        "Everything in Premium",
        "Priority reservations",
        "Exclusive restaurant deals",
        "Group booking assistance",
        "Personalized chef recommendations",
        "24/7 concierge service",
      ],
      cta: "Go Ultimate",
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that's right for you and start discovering restaurants tailored to your taste preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col ${
              plan.popular 
                ? "border-food-orange shadow-lg relative" 
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-food-orange text-white text-sm font-medium rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div>
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-500 ml-1">/{plan.period}</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-food-green" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.popular ? "bg-food-orange hover:bg-food-orange/90" : ""}`} 
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6 mt-8">
          <div>
            <h3 className="text-lg font-medium">Can I change my plan later?</h3>
            <p className="text-gray-600 mt-1">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Is there a free trial?</h3>
            <p className="text-gray-600 mt-1">
              All paid plans come with a 14-day free trial so you can try all the premium features before committing.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">How do personalized recommendations work?</h3>
            <p className="text-gray-600 mt-1">
              Our algorithm analyzes your taste preferences, dietary restrictions, and past restaurant interactions to suggest places you're likely to enjoy.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Can I cancel anytime?</h3>
            <p className="text-gray-600 mt-1">
              Absolutely! There are no long-term contracts, and you can cancel your subscription at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
