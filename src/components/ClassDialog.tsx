import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { Class } from '../utils/storage';

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; description: string; color: string }) => void;
  editData?: Class;
}

const PRESET_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export function ClassDialog({ open, onOpenChange, onSave, editData }: ClassDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setDescription(editData.description);
      setColor(editData.color);
    } else {
      setName('');
      setDescription('');
      setColor(PRESET_COLORS[0]);
    }
  }, [editData, open]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name, description, color });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kelas</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Matematika Kelas 10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang kelas ini..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Warna</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    color === presetColor ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            {editData ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
