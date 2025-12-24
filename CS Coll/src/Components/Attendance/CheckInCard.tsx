import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Clock, LogIn, LogOut, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function CheckInCard() {
  const { user } = useAuth();
  const { getTodayRecord, markCheckIn, markCheckOut } = useAttendance();
  const [isProcessing, setIsProcessing] = useState(false);

  const todayRecord = user ? getTodayRecord(user.id) : undefined;
  const hasCheckedIn = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;

  const handleCheckIn = async () => {
    if (!user) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    markCheckIn(user.id, user.name);
    setIsProcessing(false);
  };

  const handleCheckOut = async () => {
    if (!user) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    markCheckOut(user.id);
    setIsProcessing(false);
  };

  const currentTime = format(new Date(), 'HH:mm:ss');
  const currentDate = format(new Date(), 'EEEE, MMMM dd, yyyy');

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Welcome back,</p>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
          </div>
          <Clock className="h-12 w-12 opacity-80" />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-6 text-center">
          <p className="text-4xl font-bold font-mono tracking-tight">{currentTime}</p>
          <p className="mt-1 text-sm text-muted-foreground">{currentDate}</p>
        </div>

        {hasCheckedOut ? (
          <div className="rounded-lg bg-success/10 p-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-success animate-check" />
            <p className="mt-3 font-semibold text-success">Day Complete!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Checked in at {todayRecord?.checkIn} • Checked out at {todayRecord?.checkOut}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {!hasCheckedIn ? (
              <Button 
                onClick={handleCheckIn} 
                disabled={isProcessing}
                className="w-full gap-2"
                variant="success"
                size="lg"
              >
                {isProcessing ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                Check In
              </Button>
            ) : (
              <>
                <div className="rounded-lg bg-success/10 p-4 text-center">
                  <p className="text-sm font-medium text-success">Checked in at</p>
                  <p className="text-2xl font-bold font-mono">{todayRecord?.checkIn}</p>
                </div>
                <Button 
                  onClick={handleCheckOut} 
                  disabled={isProcessing}
                  className="w-full gap-2"
                  variant="destructive"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <LogOut className="h-5 w-5" />
                  )}
                  Check Out
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
