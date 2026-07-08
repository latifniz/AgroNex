export function AgroNexLoginHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome to AgroNex</h1>
      <p className="text-sm text-muted-foreground">Sign in to access the admin dashboard</p>
      <div className="w-full rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        Demo account: <strong>superadmin</strong> / <strong>superadmin</strong>
      </div>
    </div>
  );
}
