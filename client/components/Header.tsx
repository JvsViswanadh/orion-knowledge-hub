import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center">
      {/* Orion Logo */}
      <div className="flex items-center">
        <div className="w-6 h-6 bg-primary rounded mr-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
            <rect width="24" height="24" rx="4" />
          </svg>
        </div>
        <span className="text-xl font-semibold text-foreground">Orion</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent">
          <Link to={{ pathname: "/login" }} state={{ focusEmail: true }}>Login</Link>
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-medium px-6">
          <Link to={{ pathname: "/login" }} state={{ focusEmail: true }}>Get Started</Link>
        </Button>
      </div>
    </header>
  );
}
