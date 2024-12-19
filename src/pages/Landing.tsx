import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BackgroundVideoCarousel } from "@/components/landing/BackgroundVideoCarousel";
import { Pen, Cake, Film, Mic, Palette, Music } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleWatchDemo = () => {
    // Demo video logic would go here
    console.log("Watch demo clicked");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundVideoCarousel />
      
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <Pen className="absolute top-[15%] left-[10%] w-16 h-16 animate-fade-in" />
        <Cake className="absolute top-[25%] right-[15%] w-12 h-12 animate-fade-in delay-100" />
        <Film className="absolute bottom-[30%] left-[20%] w-20 h-20 animate-fade-in delay-200" />
        <Music className="absolute top-[45%] right-[25%] w-14 h-14 animate-fade-in delay-300" />
        <Mic className="absolute bottom-[20%] right-[10%] w-16 h-16 animate-fade-in delay-400" />
        <Palette className="absolute top-[60%] left-[15%] w-12 h-12 animate-fade-in delay-500" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <nav className="flex items-center justify-between py-8">
          <span className="text-2xl font-bold text-primary animate-fade-in">
            GuiaStream
          </span>
          <Button 
            onClick={handleGetStarted}
            className="bg-primary hover:bg-primary-dark animate-fade-in"
          >
            Start for Free
          </Button>
        </nav>

        <main className="py-20">
          <div className="text-center space-y-8 relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in">
              Your Personal
              <span className="text-primary block animate-fade-in delay-150">
                Streaming Notebook
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-300">
              Organize, categorize, and keep track of your favorite streaming content all in one place. 
              Never lose track of what you want to watch next.
            </p>
            <div className="space-x-4 animate-fade-in delay-500">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark transform transition-all duration-300 hover:scale-105"
                onClick={handleGetStarted}
              >
                Start for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transform transition-all duration-300 hover:scale-105"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Organize Content",
                description: "Keep all your streaming content organized in one place with custom categories and tags."
              },
              {
                title: "Track Progress",
                description: "Never lose track of where you left off in your favorite shows and movies."
              },
              {
                title: "Share & Discover",
                description: "Share your collections with friends and discover new content to watch."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg border bg-card/50 backdrop-blur-sm 
                          transform transition-all duration-500 hover:scale-110 
                          animate-fade-in group"
                style={{ animationDelay: `${(index + 4) * 150}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;