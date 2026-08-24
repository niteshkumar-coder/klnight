import {
  AttendanceRecord,
  CourseInfo,
  DayOfWeek,
  OverallAttendance,
  StudentProfile,
  TimetableEntry,
} from '../../types';

export interface ERPAuthResult {
  success: boolean;
  sessionToken?: string;
  student?: StudentProfile;
  error?: string;
  expiresInSeconds?: number;
}

export interface ERPProvider {
  name: string;
  isMock: boolean;
  authenticate(
    universityId: string,
    password?: string,
    semester?: string,
    academicYear?: string
  ): Promise<ERPAuthResult>;
  getStudentProfile(sessionToken: string): Promise<StudentProfile>;
  getTimetable(
    sessionToken: string,
    semester: string,
    academicYear: string,
    day?: DayOfWeek
  ): Promise<TimetableEntry[]>;
  getAttendance(
    sessionToken: string
  ): Promise<{ overall: OverallAttendance; subjects: AttendanceRecord[] }>;
  getCourses(sessionToken: string): Promise<CourseInfo[]>;
  testConnection(): Promise<{ connected: boolean; latencyMs: number; message: string }>;
}
