import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const goLogin = () => navigate("/login", { state: { focusEmail: true } });
  const goDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen orion-bg flex flex-col">
      <header className="w-full px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="w-6 h-6 bg-primary rounded mr-3">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-white"
            >
              <rect width="24" height="24" rx="4" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-foreground">
            Orion Knowledge Hub
          </span>
        </Link>
        <Button
          onClick={goLogin}
          variant="ghost"
          className="text-foreground hover:text-primary hover:bg-transparent"
        >
          Log in
        </Button>
      </header>

      <main className="flex-1 w-full px-6 pb-10">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 items-center">
          {/* Left: form */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join us and unlock the future of knowledge.
              </p>
            </div>

            <Card className="bg-card/60 backdrop-blur border-border/60 shadow-lg shadow-primary/10">
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••���••"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="button"
                  onClick={goDashboard}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  Create Account
                </Button>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="bg-background/60 backdrop-blur"
                    onClick={goLogin}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        fill="#EA4335"
                        d="M12 10.2v3.8h5.4c-.2 1.2-1.6 3.6-5.4 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.6-2.5C16.9 3 14.7 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.7 12 20.7c6.9 0 9.3-4.8 9.3-7.3 0-.5-.1-.9-.2-1.2H12z"
                      />
                      <path
                        fill="#34A853"
                        d="M3.8 7.3l3.1 2.3C7.7 7.1 9.7 5.7 12 5.7c1.9 0 3.2.8 3.9 1.5l2.6-2.5C16.9 3 14.7 2 12 2 8 2 4.6 4.3 3.8 7.3z"
                      />
                      <path
                        fill="#4285F4"
                        d="M12 20.7c3.8 0 5.2-2.4 5.4-3.6l-5.4-3.1v3.8h-9.3c1.3 2.5 4 2.9 4 2.9 1.2 0 2.2-.4 3-.9l2.3 1.6z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.9 14.6c-.3-.8-.5-1.7-.5-2.6s.2-1.8.5-2.6L3.8 7.3c-.7 1.4-1.1 2.7-1.1 4.2s.4 2.9 1.1 4.2l3.1-2.1z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-background/60 backdrop-blur"
                    onClick={goLogin}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                    >
                      <path d="M20.5 2h-17C2.7 2 2 2.7 2 3.5v17C2 21.3 2.7 22 3.5 22h17c.8 0 1.5-.7 1.5-1.5v-17C22 2.7 21.3 2 20.5 2zM8.7 19.3H5.9V9.8h2.8v9.5zM7.3 8.5c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6c0 .9-.7 1.6-1.6 1.6zm12 10.8h-2.8v-5.1c0-1.2-.4-2-1.4-2-.8 0-1.3.6-1.5 1.2-.1.2-.1.5-.1.8v5.1H10v-9.5h2.7v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.2v5.5z" />
                    </svg>
                    LinkedIn
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Already have an account?{" "}
                  <button
                    onClick={goLogin}
                    className="text-primary hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: illustration */}
          <div className="w-full max-w-xl mx-auto md:mx-0 hidden md:block">
            <div className="relative rounded-2xl p-1 bg-gradient-to-br from-teal-400/40 via-teal-500/20 to-transparent">
              <div className="rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.12),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.2),transparent_45%)] p-8">
                <div className="aspect-square rounded-xl bg-secondary/30 shadow-2xl shadow-primary/20 flex items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-b from-teal-400/30 to-teal-500/10 shadow-[0_0_40px_rgba(20,184,166,0.35)]">
                    <div className="absolute inset-1 rounded-full border border-primary/40" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-primary/20 blur-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
