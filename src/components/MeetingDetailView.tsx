import { useState } from 'react';
import { ArrowLeft, Upload, X, FileVideo, FileImage, File } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import type { Meeting, MediaFile } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface MeetingDetailViewProps {
  meeting: Meeting;
  classColor: string;
  onBack: () => void;
  onAddFile: (file: MediaFile) => void;
  onDeleteFile: (fileId: string) => void;
  onUpdateNotes: (notes: string) => void;
}

export function MeetingDetailView({
  meeting,
  classColor,
  onBack,
  onAddFile,
  onDeleteFile,
  onUpdateNotes,
}: MeetingDetailViewProps) {
  const [notes, setNotes] = useState(meeting.notes);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast.error('Ukuran file terlalu besar (maksimal 10MB)');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const mediaFile: MediaFile = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          dataUrl: event.target?.result as string,
          uploadedAt: new Date().toISOString(),
        };
        onAddFile(mediaFile);
        toast.success('File berhasil diupload');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Gagal mengupload file');
    }

    e.target.value = '';
  };

  const handleNotesBlur = () => {
    if (notes !== meeting.notes) {
      onUpdateNotes(notes);
      toast.success('Catatan disimpan');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="h-5 w-5" />;
    if (type.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const renderFilePreview = (file: MediaFile) => {
    if (file.type.startsWith('image/')) {
      return (
        <img 
          src={file.dataUrl} 
          alt={file.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      );
    }
    if (file.type.startsWith('video/')) {
      return (
        <video 
          src={file.dataUrl} 
          controls
          className="w-full h-48 rounded-lg bg-black"
        />
      );
    }
    return (
      <div className="w-full h-48 flex items-center justify-center bg-muted rounded-lg">
        <File className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: classColor }}
          >
            {meeting.number}
          </div>
          <div>
            <h1>Pertemuan {meeting.number}</h1>
            <p className="text-sm text-muted-foreground">{formatDate(meeting.date)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>File & Media</h2>
          <Button className="gap-2" asChild>
            <label>
              <Upload className="h-4 w-4" />
              Upload File
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,application/pdf"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
        </div>

        {meeting.files.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada file yang diupload</p>
            <p className="text-sm mt-2">Upload foto, video, atau dokumen</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meeting.files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                {renderFilePreview(file)}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan Pertemuan</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          placeholder="Tulis catatan untuk pertemuan ini..."
          rows={6}
        />
      </div>
    </div>
  );
}
