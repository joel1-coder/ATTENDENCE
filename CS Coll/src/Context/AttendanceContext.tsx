import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AttendanceRecord, StaffMember } from '@/types/auth';

interface AttendanceContextType {
  records: AttendanceRecord[];
  staff: StaffMember[];
  markCheckIn: (staffId: string, staffName: string) => void;
  markCheckOut: (staffId: string) => void;
  getTodayRecord: (staffId: string) => AttendanceRecord | undefined;
  getStaffRecords: (staffId: string) => AttendanceRecord[];
  addStaffMember: (staff: Omit<StaffMember, 'id'>) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Demo data
const INITIAL_STAFF: StaffMember[] = [
  { id: '2', name: 'Jane Staff', email: 'staff@attenance.com', department: 'Engineering', joinDate: '2024-01-15' },
  { id: '3', name: 'Mike Johnson', email: 'mike@attenance.com', department: 'Marketing', joinDate: '2024-02-01' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@attenance.com', department: 'Design', joinDate: '2024-03-10' },
  { id: '5', name: 'Tom Brown', email: 'tom@attenance.com', department: 'Sales', joinDate: '2024-01-20' },
];

const generatePastRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  INITIAL_STAFF.forEach(staff => {
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        const status = Math.random() > 0.1 ? 'present' : (Math.random() > 0.5 ? 'late' : 'absent');
        records.push({
          id: `${staff.id}-${date.toISOString().split('T')[0]}`,
          staffId: staff.id,
          staffName: staff.name,
          date: date.toISOString().split('T')[0],
          checkIn: status !== 'absent' ? `0${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null,
          checkOut: status !== 'absent' ? `1${7 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null,
          status: status as AttendanceRecord['status'],
        });
      }
    }
  });
  
  return records;
};

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const stored = localStorage.getItem('attenance_records');
    return stored ? JSON.parse(stored) : generatePastRecords();
  });
  
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const stored = localStorage.getItem('attenance_staff');
    return stored ? JSON.parse(stored) : INITIAL_STAFF;
  });

  const saveRecords = (newRecords: AttendanceRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('attenance_records', JSON.stringify(newRecords));
  };

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaff(newStaff);
    localStorage.setItem('attenance_staff', JSON.stringify(newStaff));
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const markCheckIn = (staffId: string, staffName: string) => {
    const today = getTodayDate();
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isLate = now.getHours() >= 9 && now.getMinutes() > 30;
    
    const existingRecord = records.find(r => r.staffId === staffId && r.date === today);
    
    if (existingRecord) {
      const updated = records.map(r => 
        r.id === existingRecord.id 
          ? { ...r, checkIn: checkInTime, status: isLate ? 'late' as const : 'present' as const }
          : r
      );
      saveRecords(updated);
    } else {
      const newRecord: AttendanceRecord = {
        id: `${staffId}-${today}`,
        staffId,
        staffName,
        date: today,
        checkIn: checkInTime,
        checkOut: null,
        status: isLate ? 'late' : 'present',
      };
      saveRecords([...records, newRecord]);
    }
  };

  const markCheckOut = (staffId: string) => {
    const today = getTodayDate();
    const now = new Date();
    const checkOutTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updated = records.map(r => 
      r.staffId === staffId && r.date === today
        ? { ...r, checkOut: checkOutTime }
        : r
    );
    saveRecords(updated);
  };

  const getTodayRecord = (staffId: string) => {
    const today = getTodayDate();
    return records.find(r => r.staffId === staffId && r.date === today);
  };

  const getStaffRecords = (staffId: string) => {
    return records.filter(r => r.staffId === staffId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const addStaffMember = (newStaff: Omit<StaffMember, 'id'>) => {
    const staffMember: StaffMember = {
      ...newStaff,
      id: String(Date.now()),
    };
    saveStaff([...staff, staffMember]);
  };

  return (
    <AttendanceContext.Provider value={{ 
      records, 
      staff, 
      markCheckIn, 
      markCheckOut, 
      getTodayRecord, 
      getStaffRecords,
      addStaffMember 
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
