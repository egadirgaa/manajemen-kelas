import { Calendar, FileText, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Meeting } from '../utils/storage';

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
  onDelete: () => void;
  classColor: string;
}

export function MeetingCard({ meeting, onClick, onDelete, classColor }: MeetingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderLeft: `3px solid ${classColor}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: classColor }}
            >
              {meeting.number}
            </div>
            <h4>Pertemuan {meeting.number}</h4>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{meeting.files.length} File</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </Card>
  );
}
