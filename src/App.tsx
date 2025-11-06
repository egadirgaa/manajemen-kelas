import { useState, useEffect } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import { Button } from './components/ui/button';
import { ClassCard } from './components/ClassCard';
import { ClassDialog } from './components/ClassDialog';
import { ClassDetailView } from './components/ClassDetailView';
import { MeetingDetailView } from './components/MeetingDetailView';
import { ThemeToggle } from './components/ThemeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { storage, type Class, type MediaFile } from './utils/storage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type View = 'list' | 'class-detail' | 'meeting-detail';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [classes, setClasses] = useState<Class[]>([]);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [deleteMeetingDialogOpen, setDeleteMeetingDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  useEffect(() => {
    setClasses(storage.getClasses());
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddClass = (data: { name: string; description: string; color: string }) => {
    if (editingClass) {
      storage.updateClass(editingClass.id, data);
      toast.success('Kelas berhasil diupdate');
    } else {
      storage.addClass(data);
      toast.success('Kelas berhasil ditambahkan');
    }
    setClasses(storage.getClasses());
    setEditingClass(undefined);
  };

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData);
    setDialogOpen(true);
  };

  const handleDeleteClass = (classId: string) => {
    setClassToDelete(classId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClass = () => {
    if (classToDelete) {
      storage.deleteClass(classToDelete);
      setClasses(storage.getClasses());
      setDeleteDialogOpen(false);
      setClassToDelete(null);
      toast.success('Kelas berhasil dihapus');
      if (selectedClassId === classToDelete) {
        setCurrentView('list');
        setSelectedClassId(null);
      }
    }
  };

  const handleClassClick = (classId: string) => {
    setSelectedClassId(classId);
    setCurrentView('class-detail');
  };

  const handleAddMeeting = () => {
    if (selectedClassId) {
      storage.addMeeting(selectedClassId);
      setClasses(storage.getClasses());
      toast.success('Pertemuan baru berhasil ditambahkan');
    }
  };

  const handleMeetingClick = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView('meeting-detail');
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetingToDelete(meetingId);
    setDeleteMeetingDialogOpen(true);
  };

  const confirmDeleteMeeting = () => {
    if (selectedClassId && meetingToDelete) {
      storage.deleteMeeting(selectedClassId, meetingToDelete);
      setClasses(storage.getClasses());
      setDeleteMeetingDialogOpen(false);
      setMeetingToDelete(null);
      toast.success('Pertemuan berhasil dihapus');
    }
  };

  const handleAddFile = (file: MediaFile) => {
    if (selectedClassId && selectedMeetingId) {
      storage.addFileToMeeting(selectedClassId, selectedMeetingId, file);
      setClasses(storage.getClasses());
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (selectedClassId && selectedMeetingId) {
      storage.deleteFileFromMeeting(selectedClassId, selectedMeetingId, fileId);
      setClasses(storage.getClasses());
      toast.success('File berhasil dihapus');
    }
  };

  const handleUpdateNotes = (notes: string) => {
    if (selectedClassId && selectedMeetingId) {
      storage.updateMeeting(selectedClassId, selectedMeetingId, { notes });
      setClasses(storage.getClasses());
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const selectedMeeting = selectedClass?.meetings.find(m => m.id === selectedMeetingId);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <h1>ClassManager</h1>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {currentView === 'list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1>Daftar Kelas</h1>
                <p className="text-muted-foreground mt-1">Kelola kelas dan pertemuan Anda</p>
              </div>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Kelas
              </Button>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-16">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2>Belum ada kelas</h2>
                <p className="text-muted-foreground mt-2 mb-6">
                  Mulai dengan menambahkan kelas pertama Anda
                </p>
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Kelas Pertama
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((classData) => (
                  <ClassCard
                    key={classData.id}
                    classData={classData}
                    onClick={() => handleClassClick(classData.id)}
                    onEdit={() => handleEditClass(classData)}
                    onDelete={() => handleDeleteClass(classData.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'class-detail' && selectedClass && (
          <ClassDetailView
            classData={selectedClass}
            onBack={() => {
              setCurrentView('list');
              setSelectedClassId(null);
            }}
            onAddMeeting={handleAddMeeting}
            onMeetingClick={handleMeetingClick}
            onDeleteMeeting={handleDeleteMeeting}
          />
        )}

        {currentView === 'meeting-detail' && selectedClass && selectedMeeting && (
          <MeetingDetailView
            meeting={selectedMeeting}
            classColor={selectedClass.color}
            onBack={() => {
              setCurrentView('class-detail');
              setSelectedMeetingId(null);
            }}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
            onUpdateNotes={handleUpdateNotes}
          />
        )}
      </main>

      <ClassDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingClass(undefined);
        }}
        onSave={handleAddClass}
        editData={editingClass}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kelas?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua pertemuan dan file dalam kelas ini akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClass} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteMeetingDialogOpen} onOpenChange={setDeleteMeetingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pertemuan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua file dan catatan dalam pertemuan ini akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMeeting} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
