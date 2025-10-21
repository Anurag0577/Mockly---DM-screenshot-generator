export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <p className="text-muted-foreground mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="text-sm underline underline-offset-4 text-primary hover:text-primary/80"
      >
        Go back to home
      </a>
    </div>
  );
}
