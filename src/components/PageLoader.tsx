import { Loader } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-fade-in">
          GuiaStream
        </div>
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-primary/60 animate-pulse" />
          <div className="relative bg-background rounded-lg p-4">
            <Loader className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;