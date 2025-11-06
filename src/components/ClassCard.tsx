import { MoreVertical, Trash2, Edit, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import type { Class } from '../utils/storage';

interface ClassCardProps {
  classData: Class;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export function ClassCard({ classData, onEdit, onDelete, onClick }: ClassCardProps) {
  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
      style={{ borderLeft: `4px solid ${classData.color}` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: classData.color }}
            />
            <h3 className="font-medium">{classData.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{classData.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{classData.meetings.length} Pertemuan</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
