import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleWatchDemo = () => {
    console.log("Watch demo clicked");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image with Gradients */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.75) 100%),
            url('/lovable-uploads/13458868-628a-42a2-9cbc-6e5c2077c22b.png')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center justify-between py-8">
          <span className="text-2xl font-bold text-white animate-fade-in">
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-fade-in">
              Your Personal
              <span className="text-primary block animate-fade-in delay-150">
                Streaming Notebook
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in delay-300">
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
                className="transform transition-all duration-300 hover:scale-105 text-white border-white hover:bg-white/10"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;