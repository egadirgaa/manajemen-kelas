// Storage utilities for managing classes and meetings in localStorage

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface Meeting {
  id: string;
  number: number;
  date: string;
  files: MediaFile[];
  notes: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  meetings: Meeting[];
}

const STORAGE_KEY = 'class_manager_data';

export const storage = {
  getClasses: (): Class[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveClasses: (classes: Class[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addClass: (classData: Omit<Class, 'id' | 'createdAt' | 'meetings'>): Class => {
    const classes = storage.getClasses();
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      meetings: [],
    };
    classes.push(newClass);
    storage.saveClasses(classes);
    return newClass;
  },

  updateClass: (classId: string, updates: Partial<Class>): void => {
    const classes = storage.getClasses();
    const index = classes.findIndex(c => c.id === classId);
    if (index !== -1) {
      classes[index] = { ...classes[index], ...updates };
      storage.saveClasses(classes);
    }
  },

  deleteClass: (classId: string): void => {
    const classes = storage.getClasses();
    const filtered = classes.filter(c => c.id !== classId);
    storage.saveClasses(filtered);
  },

  addMeeting: (classId: string): Meeting => {
    const classes = storage.getClasses();
    const classIndex = classes.findIndex(c => c.id === classId);
    
    if (classIndex !== -1) {
      const currentClass = classes[classIndex];
      const nextNumber = currentClass.meetings.length === 0 ? 1 : currentClass.meetings.length + 1;
      
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        number: nextNumber,
        date: new Date().toISOString(),
        files: [],
        notes: '',
      };
      
      currentClass.meetings.push(newMeeting);
      storage.saveClasses(classes);
      return newMeeting;
    }
    
    throw new Error('Class not found');
  },

  updateMeeting: (classId: string, meetingId: string, updates: Partial<Meeting>): void => {
    const classes = storage.getClasses();
    const classIndex = classes.findIndex(c => c.id === classId);
    
    if (classIndex !== -1) {
      const meetingIndex = classes[classIndex].meetings.findIndex(m => m.id === meetingId);
      if (meetingIndex !== -1) {
        classes[classIndex].meetings[meetingIndex] = {
          ...classes[classIndex].meetings[meetingIndex],
          ...updates,
        };
        storage.saveClasses(classes);
      }
    }
  },

  deleteMeeting: (classId: string, meetingId: string): void => {
    const classes = storage.getClasses();
    const classIndex = classes.findIndex(c => c.id === classId);
    
    if (classIndex !== -1) {
      classes[classIndex].meetings = classes[classIndex].meetings.filter(m => m.id !== meetingId);
      // Renumber meetings
      classes[classIndex].meetings.forEach((meeting, index) => {
        meeting.number = index + 1;
      });
      storage.saveClasses(classes);
    }
  },

  addFileToMeeting: (classId: string, meetingId: string, file: MediaFile): void => {
    const classes = storage.getClasses();
    const classIndex = classes.findIndex(c => c.id === classId);
    
    if (classIndex !== -1) {
      const meetingIndex = classes[classIndex].meetings.findIndex(m => m.id === meetingId);
      if (meetingIndex !== -1) {
        classes[classIndex].meetings[meetingIndex].files.push(file);
        storage.saveClasses(classes);
      }
    }
  },

  deleteFileFromMeeting: (classId: string, meetingId: string, fileId: string): void => {
    const classes = storage.getClasses();
    const classIndex = classes.findIndex(c => c.id === classId);
    
    if (classIndex !== -1) {
      const meetingIndex = classes[classIndex].meetings.findIndex(m => m.id === meetingId);
      if (meetingIndex !== -1) {
        classes[classIndex].meetings[meetingIndex].files = 
          classes[classIndex].meetings[meetingIndex].files.filter(f => f.id !== fileId);
        storage.saveClasses(classes);
      }
    }
  },
};
