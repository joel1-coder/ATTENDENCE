import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Clock } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Attenance</h1>
            <p className="text-xs text-muted-foreground">Attendance Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">{user?.name}</span>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                {user?.role}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
