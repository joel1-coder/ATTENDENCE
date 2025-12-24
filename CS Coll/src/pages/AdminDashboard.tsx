import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/attendance/StatsCard';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CheckCircle, XCircle, Clock, UserPlus, Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { records, staff, addStaffMember } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newStaff, setNewStaff] = useState({ name: '', email: '', department: '' });
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const todayRecords = useMemo(() => {
    return records.filter(r => r.date === selectedDate);
  }, [records, selectedDate]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return todayRecords;
    return todayRecords.filter(r => 
      r.staffName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todayRecords, searchQuery]);

  const stats = useMemo(() => {
    const present = todayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const absent = staff.length - present;
    const late = todayRecords.filter(r => r.status === 'late').length;
    return { present, absent, late, total: staff.length };
  }, [todayRecords, staff]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingStaff(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addStaffMember({
      ...newStaff,
      joinDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setNewStaff({ name: '', email: '', department: '' });
    setIsAddingStaff(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage attendance and staff members</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 stagger-children">
          <StatsCard
            title="Total Staff"
            value={stats.total}
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Present Today"
            value={stats.present}
            subtitle={`${Math.round((stats.present / stats.total) * 100)}% attendance`}
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Absent Today"
            value={stats.absent}
            icon={XCircle}
            variant="destructive"
          />
          <StatsCard
            title="Late Arrivals"
            value={stats.late}
            icon={Clock}
            variant="warning"
          />
        </div>

        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="attendance" className="gap-2">
              <Calendar className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="h-4 w-4" />
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Attendance Records</CardTitle>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-48"
                      />
                    </div>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AttendanceTable records={filteredRecords} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Add Staff Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add Staff Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStaff} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff(s => ({ ...s, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff(s => ({ ...s, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="Enter department"
                        value={newStaff.department}
                        onChange={(e) => setNewStaff(s => ({ ...s, department: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isAddingStaff}>
                      {isAddingStaff ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Staff
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Staff List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Staff Members ({staff.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {staff.map((member, index) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between rounded-lg border bg-card p-4 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                            {member.department}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined {format(new Date(member.joinDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
