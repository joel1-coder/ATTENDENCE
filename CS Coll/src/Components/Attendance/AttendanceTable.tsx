import { AttendanceRecord } from '@/types/auth';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showStaffName?: boolean;
}

export function AttendanceTable({ records, showStaffName = true }: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-soft overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Date</TableHead>
            {showStaffName && <TableHead className="font-semibold">Staff Name</TableHead>}
            <TableHead className="font-semibold">Check In</TableHead>
            <TableHead className="font-semibold">Check Out</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, index) => (
            <TableRow 
              key={record.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">
                {format(new Date(record.date), 'MMM dd, yyyy')}
              </TableCell>
              {showStaffName && (
                <TableCell>{record.staffName}</TableCell>
              )}
              <TableCell>
                {record.checkIn ? (
                  <span className="font-mono text-sm">{record.checkIn}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {record.checkOut ? (
                  <span className="font-mono text-sm">{record.checkOut}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
