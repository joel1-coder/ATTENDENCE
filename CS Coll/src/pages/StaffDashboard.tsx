import { Header } from '@/components/layout/Header';
import { CheckInCard } from '@/components/attendance/CheckInCard';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { StatsCard } from '@/components/attendance/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { getStaffRecords } = useAttendance();

  const myRecords = user ? getStaffRecords(user.id) : [];

  const stats = useMemo(() => {
    const totalDays = myRecords.length;
    const presentDays = myRecords.filter(r => r.status === 'present').length;
    const lateDays = myRecords.filter(r => r.status === 'late').length;
    const attendanceRate = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 100;
    
    return { totalDays, presentDays, lateDays, attendanceRate };
  }, [myRecords]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your attendance and view history</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Check In Card */}
          <div className="lg:col-span-1">
            <CheckInCard />
          </div>

          {/* Stats */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
              <StatsCard
                title="Attendance Rate"
                value={`${stats.attendanceRate}%`}
                icon={TrendingUp}
                variant="success"
              />
              <StatsCard
                title="Days Present"
                value={stats.presentDays}
                icon={CheckCircle}
                variant="default"
              />
              <StatsCard
                title="Late Arrivals"
                value={stats.lateDays}
                icon={Clock}
                variant="warning"
              />
              <StatsCard
                title="Total Days"
                value={stats.totalDays}
                icon={Calendar}
                variant="accent"
              />
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>My Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTable records={myRecords.slice(0, 10)} showStaffName={false} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
