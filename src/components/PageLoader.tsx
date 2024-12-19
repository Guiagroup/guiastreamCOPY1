import { Loader } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <div className="text-4xl font-bold text-primary animate-fade-in">
        GuiaStream
      </div>
      <Loader className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default PageLoader;