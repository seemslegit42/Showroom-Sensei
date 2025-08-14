
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Search, Eye, Clock, User } from 'lucide-react';
import type { VisitWithVisitor } from '@/lib/types';
import { format } from 'date-fns';

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


export function VisitorDetails({ visit }: { visit: VisitWithVisitor }) {
  const checkInTime = visit.startedAt ? format(new Date(visit.startedAt), 'p') : 'N/A';
  const agentName = visit.host?.name || 'Unassigned';
  const status = visit.stage || 'Researching';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{visit.visitor.name}</CardTitle>
        <CardDescription>Visitor Information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Badge variant={statusColors[status]} className="flex items-center gap-2 py-1 px-3">
            {statusIcons[status]}
            {status}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>Checked in at {checkInTime}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2" />
          <span>Assigned to {agentName}</span>
        </div>
        {visit.mustHave && (
            <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-semibold">Must-Have Feature</p>
                <p className="text-sm text-muted-foreground">{visit.mustHave}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
