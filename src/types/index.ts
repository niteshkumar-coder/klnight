export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ClassType = 'L' | 'T' | 'P' | 'S';

export interface ClassSlot {
  slot: number;
  startTime: string; // "07:10"
  endTime: string;   // "08:00"
  label: string;
}

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  slot: number;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  classType: ClassType; // L = Lecture, T = Tutorial, P = Practical, S = Session
  section: string;
  room: string;
  faculty: string;
  isCancelled?: boolean;
}

export interface StudentProfile {
  studentId: string;
  universityId?: string;
  name: string;
  program: string;
  branch: string;
  section: string;
  semester: 'Odd' | 'Even';
  academicYear: string;
  email: string;
  avatar?: string;
  cgpa?: number;
  advisor?: string;
  isMockData?: boolean;
}

export interface CourseInfo {
  code: string;
  name: string;
  type: string;
  credits: number;
  faculty: string;
  weeklyClasses: number;
  color: string;
  primaryRoom: string;
  description?: string;
}

export type AttendanceStatus = 'good' | 'warning' | 'low';

export interface AttendanceRecord {
  courseCode: string;
  courseName: string;
  faculty: string;
  totalClasses: number;
  attended: number;
  absent: number;
  percentage: number;
  lastUpdated: string;
  status: AttendanceStatus;
}

export interface OverallAttendance {
  percentage: number;
  totalClasses: number;
  attended: number;
  absent: number;
  status: AttendanceStatus;
  lastUpdated: string;
}

export interface UserSettings {
  reminderTime: 'off' | '5m' | '10m' | '15m';
  autoRefresh: 'off' | '5m' | '10m' | '15m';
  theme: 'dark' | 'light' | 'system';
  soundAlerts: boolean;
}

export interface ERPStatus {
  mode: 'mock' | 'authorized';
  connected: boolean;
  providerName: string;
  lastSync: string;
  latencyMs: number;
  apiBaseUrl?: string;
  syncCount: number;
}
