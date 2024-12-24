import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
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
          <span className="text-2xl font-bold text-white">
            GuiaStream
          </span>
        </nav>

        <main className="py-20">
          <div className="text-center space-y-8 relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Your Personal
              <span className="text-primary block">
                Streaming Notebook
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Organize, categorize, and keep track of your favorite streaming content all in one place. 
              Never lose track of what you want to watch next.
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark transform transition-all duration-300 hover:scale-105"
                onClick={handleGetStarted}
              >
                Start for Free
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;