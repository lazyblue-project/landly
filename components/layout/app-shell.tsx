import { BottomNav } from "./bottom-nav";
import { FloatingActionHub } from "./floating-action-hub";
import { SnackbarHost } from "./snackbar-host";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function AppShell({ children, hideNav = false, className }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-gray-50 max-w-md mx-auto">
      <main className={cn("pb-20", className)}>{children}</main>
      <SnackbarHost />
      {!hideNav && <FloatingActionHub />}
      {!hideNav && <BottomNav />}
    </div>
  );
}
