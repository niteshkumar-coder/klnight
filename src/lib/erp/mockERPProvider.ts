import {
  AttendanceRecord,
  CourseInfo,
  DayOfWeek,
  OverallAttendance,
  StudentProfile,
  TimetableEntry,
} from '../../types';
import {
  createMockStudent,
  DEMO_ATTENDANCE_OVERALL,
  DEMO_ATTENDANCE_SUBJECTS,
  DEMO_COURSES,
  DEMO_TIMETABLE,
} from './mockData';
import { ERPAuthResult, ERPProvider } from './types';

export class MockERPProvider implements ERPProvider {
  name = 'KL University Mock ERP Adapter';
  isMock = true;

  // In-memory student profile cache by session token or ID
  private profileStore = new Map<string, StudentProfile>();

  async authenticate(
    universityId: string,
    password?: string,
    semester: string = 'Odd',
    academicYear: string = '2026-27'
  ): Promise<ERPAuthResult> {
    // Simulate realistic ERP authentication round-trip
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanId = (universityId || '').trim();
    if (!cleanId) {
      return {
        success: false,
        error: 'University ID is required.',
      };
    }

    if (!password || password.trim().length === 0) {
      return {
        success: false,
        error: 'Password is required.',
      };
    }

    // Return student profile dynamically tied strictly to user input
    const student: StudentProfile = {
      ...createMockStudent(
        cleanId,
        semester === 'Even' ? 'Even' : 'Odd',
        academicYear || '2026-27'
      ),
      studentId: cleanId,
      universityId: cleanId,
      name: 'Student',
      email: `${cleanId}@kluniversity.in`,
      avatar: cleanId.charAt(0).toUpperCase() || 'S',
      isMockData: true,
    };

    const sessionToken = `mock_erp_session_${cleanId}_${Date.now()}`;
    this.profileStore.set(sessionToken, student);
    this.profileStore.set(cleanId, student);

    return {
      success: true,
      sessionToken,
      student,
      expiresInSeconds: 86400 * 7,
    };
  }

  async getStudentProfile(sessionToken: string): Promise<StudentProfile> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (this.profileStore.has(sessionToken)) {
      return this.profileStore.get(sessionToken)!;
    }

    // Extract studentId if encoded in session token
    const parts = sessionToken.split('_');
    const id = parts.length >= 4 ? parts[3] : '';

    if (id && this.profileStore.has(id)) {
      return this.profileStore.get(id)!;
    }

    const fallback = createMockStudent(id || 'Student', 'Odd', '2026-27');
    if (id) {
      this.profileStore.set(id, fallback);
    }
    return fallback;
  }

  async updateStudentProfile(sessionToken: string, updates: Partial<StudentProfile>): Promise<StudentProfile> {
    const current = await this.getStudentProfile(sessionToken);
    const updated: StudentProfile = {
      ...current,
      ...updates,
      // Immutable identity field
      studentId: current.studentId,
      universityId: current.universityId || current.studentId,
    };
    this.profileStore.set(sessionToken, updated);
    this.profileStore.set(updated.studentId, updated);
    return updated;
  }

  async getTimetable(
    sessionToken: string,
    semester: string = 'Odd',
    academicYear: string = '2026-27',
    day?: DayOfWeek
  ): Promise<TimetableEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (day) {
      return DEMO_TIMETABLE.filter((entry) => entry.day.toLowerCase() === day.toLowerCase());
    }
    return DEMO_TIMETABLE;
  }

  async getAttendance(
    sessionToken: string
  ): Promise<{ overall: OverallAttendance; subjects: AttendanceRecord[] }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      overall: DEMO_ATTENDANCE_OVERALL,
      subjects: DEMO_ATTENDANCE_SUBJECTS,
    };
  }

  async getCourses(sessionToken: string): Promise<CourseInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return DEMO_COURSES;
  }

  async testConnection(): Promise<{ connected: boolean; latencyMs: number; message: string }> {
    const start = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      latencyMs,
      message: 'Mock ERP adapter operational (Demo Mode active)',
    };
  }
}
