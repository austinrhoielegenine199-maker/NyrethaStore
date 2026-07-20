import { useLocation } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div className="flex w-full items-center justify-center py-20">
      <div className="mc-panel max-w-md w-full p-8 text-center bg-card/80 backdrop-blur">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-destructive/20 border-4 border-destructive rounded-sm flex items-center justify-center animate-pulse">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="font-display text-4xl font-bold text-white mb-2 tracking-wider">
          404
        </h1>
        <h2 className="font-display text-xl text-primary mb-4 uppercase">
          Void Reached
        </h2>
        
        <p className="text-muted-foreground font-sans mb-8">
          The page you are looking for has fallen out of the world or never existed in this dimension.
        </p>
        
        <Button 
          variant="default"
          size="lg"
          onClick={() => setLocation("/")}
          className="w-full"
        >
          Return to Spawn
        </Button>
      </div>
    </div>
  );
}
