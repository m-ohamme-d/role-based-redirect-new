
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, Search } from 'lucide-react';
import { toast } from 'sonner';
import DropdownDateFilter from '@/components/charts/DropdownDateFilter';

// Mock records data
const mockRecords = [
  { id: 101, title: 'Q1 Performance Review', department: 'IT', locked: true, date: '2025-03-15' },
  { id: 102, title: 'Annual Budget Report', department: 'Finance', locked: true, date: '2025-01-30' },
  { id: 103, title: 'HR Policy Update', department: 'HR', locked: false, date: '2025-04-10' },
  { id: 104, title: 'Marketing Campaign Results', department: 'Marketing', locked: true, date: '2025-02-20' },
  { id: 105, title: 'Sales Quarterly Report', department: 'Sales', locked: false, date: '2025-04-05' },
];

const AdminRecords = () => {
  const [records, setRecords] = useState(mockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('month');
  const [filteredByDate, setFilteredByDate] = useState(mockRecords);

  const toggleLock = (recordId: number) => {
    setRecords(records.map(record => 
      record.id === recordId 
        ? { ...record, locked: !record.locked } 
        : record
    ));
    
    const record = records.find(r => r.id === recordId);
    toast.success(`Record ${record?.locked ? 'unlocked' : 'locked'} successfully`);
  };

  const handleDateFilterChange = (period: string, customRange?: { start: Date; end: Date }) => {
    setDateFilter(period);
    
    let filtered = [...mockRecords];
    const currentDate = new Date();
    
    switch (period) {
      case 'month':
        // Filter records from this month
        filtered = mockRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === currentDate.getMonth() && 
                 recordDate.getFullYear() === currentDate.getFullYear();
        });
        break;
      case 'quarter':
        // Filter records from this quarter
        const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
        filtered = mockRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= quarterStart;
        });
        break;
      case 'year':
        // Filter records from this year
        filtered = mockRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getFullYear() === currentDate.getFullYear();
        });
        break;
      case 'custom':
        // Custom range filtering
        if (customRange) {
          filtered = mockRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= customRange.start && recordDate <= customRange.end;
          });
          console.log('Custom date filter applied to records:', customRange);
        }
        break;
      default:
        filtered = mockRecords;
    }
    
    setFilteredByDate(filtered);
    setRecords(filtered);
    console.log(`Records filtered by ${period}:`, filtered);
  };

  const filteredRecords = records.filter(record => 
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Records Management</h1>
      <p className="text-gray-600">View and manage locked records</p>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search records..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownDateFilter 
          onFilterChange={handleDateFilterChange}
          currentFilter={dateFilter}
        />
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Locked Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.title}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {record.locked ? (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Unlock className="h-3 w-3" />
                        Unlocked
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant={record.locked ? "outline" : "destructive"} 
                      size="sm"
                      onClick={() => toggleLock(record.id)}
                    >
                      {record.locked ? (
                        <>
                          <Unlock className="h-4 w-4 mr-1" />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-1" />
                          Lock
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecords;
