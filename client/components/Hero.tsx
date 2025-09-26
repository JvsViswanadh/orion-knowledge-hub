import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="text-center py-20 px-6 max-w-4xl mx-auto">
      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        <span className="text-foreground">Orion </span>
        <span className="text-primary">Knowledge Hub</span>
      </h1>

      {/* Subtitle */}
      <h2 className="text-xl md:text-2xl text-foreground mb-8 font-medium">
        Knowledge Empowered by Your Insights
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-4 max-w-3xl mx-auto">
        Designed for professionals and students who need to unlock insights faster — upload,
        summarize, and ask your documents in seconds. Join our early access program. Be the first
        to experience{" "}
        <span className="text-primary font-medium">AI-powered learning</span> and productivity.
      </p>

      {/* CTA Button */}
      <div className="mt-12">
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg rounded-lg"
        >
          <Link to="/login">Get Started — Free Beta Access</Link>
        </Button>
      </div>
    </section>
  );
}
