import { Button } from "@/components/ui/button";

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
        <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent">
          Login
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6">
          Get Started
        </Button>
      </div>
    </header>
  );
}
