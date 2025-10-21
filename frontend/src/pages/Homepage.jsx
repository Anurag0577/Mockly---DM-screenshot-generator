export function Homepage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-primary mb-4">Welcome to Mockly</h1>
      <p className="text-muted-foreground mb-6">
        Your one-stop solution for all your design needs.
      </p>
      <a
        href="/login"
        className="text-sm underline underline-offset-4 text-primary hover:text-primary/80"
      >
        Get Started
      </a>
    </div>
  );
}
