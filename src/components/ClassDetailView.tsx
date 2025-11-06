import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { MeetingCard } from './MeetingCard';
import type { Class } from '../utils/storage';

interface ClassDetailViewProps {
  classData: Class;
  onBack: () => void;
  onAddMeeting: () => void;
  onMeetingClick: (meetingId: string) => void;
  onDeleteMeeting: (meetingId: string) => void;
}

export function ClassDetailView({
  classData,
  onBack,
  onAddMeeting,
  onMeetingClick,
  onDeleteMeeting,
}: ClassDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: classData.color }}
            />
            <h1>{classData.name}</h1>
          </div>
          <p className="text-muted-foreground">{classData.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2>Daftar Pertemuan</h2>
        <Button onClick={onAddMeeting} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Pertemuan
        </Button>
      </div>

      {classData.meetings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Belum ada pertemuan</p>
          <p className="text-sm mt-2">Klik tombol di atas untuk menambah pertemuan pertama</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classData.meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              classColor={classData.color}
              onClick={() => onMeetingClick(meeting.id)}
              onDelete={() => onDeleteMeeting(meeting.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
