
import type { Visitor } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Search, Eye, Clock, User } from 'lucide-react';

const statusIcons: { [key: string]: React.ReactNode } = {
  'Hot Now': <Flame className="w-4 h-4" />,
  'Researching': <Search className="w-4 h-4" />,
  'Just Looking': <Eye className="w-4 h-4" />,
};

const statusColors: { [key: string]: 'destructive' | 'secondary' | 'outline' } = {
  'Hot Now': 'destructive',
  'Researching': 'secondary',
  'Just Looking': 'outline',
};

// This type is a placeholder. In a real app, you would define this
// based on your actual data structure from the database.
type VisitorDisplayData = {
    id: string;
    name: string;
    status: 'Hot Now' | 'Researching' | 'Just Looking';
    checkInTime: string;
    agent: string;
    mustHave?: string;
}

export function VisitorDetails({ visitor }: { visitor: VisitorDisplayData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{visitor.name}</CardTitle>
        <CardDescription>Visitor Information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Badge variant={statusColors[visitor.status]} className="flex items-center gap-2 py-1 px-3">
            {statusIcons[visitor.status]}
            {visitor.status}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>Checked in at {visitor.checkInTime}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2" />
          <span>Assigned to {visitor.agent}</span>
        </div>
      </CardContent>
    </Card>
  );
}
