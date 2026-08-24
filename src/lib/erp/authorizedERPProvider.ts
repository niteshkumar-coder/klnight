import {
  AttendanceRecord,
  CourseInfo,
  DayOfWeek,
  OverallAttendance,
  StudentProfile,
  TimetableEntry,
} from '../../types';
import {
  normalizeAttendance,
  normalizeCourse,
  normalizeStudent,
  normalizeTimetableEntry,
} from './normalizers';
import { ERPAuthResult, ERPProvider } from './types';

export class AuthorizedUniversityERPProvider implements ERPProvider {
  name = 'KL University Authorized ERP Gateway';
  isMock = false;

  private baseUrl: string;
  private apiKey: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl = process.env.ERP_BASE_URL || '';
    this.apiKey = process.env.ERP_API_KEY || '';
    this.clientId = process.env.ERP_CLIENT_ID || '';
    this.clientSecret = process.env.ERP_CLIENT_SECRET || '';
  }

  private isConfigured(): boolean {
    return Boolean(this.baseUrl && (this.apiKey || this.clientId));
  }

  async authenticate(
    universityId: string,
    password?: string,
    semester: string = 'Odd',
    academicYear: string = '2026-27'
  ): Promise<ERPAuthResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          'Official ERP integration is pending configuration. Please check ERP_BASE_URL and credentials or set USE_MOCK_ERP=true for demo access.',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/student/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ERP-Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          universityId,
          password,
          semester,
          academicYear,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            error: 'Unable to sign in. Please check your credentials.',
          };
        }
        return {
          success: false,
          error: 'University ERP is temporarily unavailable. Please try again later.',
        };
      }

      const data = await response.json();
      const student = normalizeStudent(data.student || data);

      return {
        success: true,
        sessionToken: data.sessionToken || data.token,
        student,
        expiresInSeconds: data.expiresInSeconds || 86400,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'University ERP connection timed out. Please retry or switch to demo mode.',
      };
    }
  }

  async getStudentProfile(sessionToken: string): Promise<StudentProfile> {
    if (!this.isConfigured()) {
      throw new Error('ERP provider not configured.');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/student/profile`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'X-ERP-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student profile from ERP');
    }

    const data = await response.json();
    return normalizeStudent(data);
  }

  async getTimetable(
    sessionToken: string,
    semester: string,
    academicYear: string,
    day?: DayOfWeek
  ): Promise<TimetableEntry[]> {
    if (!this.isConfigured()) {
      throw new Error('ERP provider not configured.');
    }

    const url = new URL(`${this.baseUrl}/api/v1/student/timetable`);
    url.searchParams.set('semester', semester);
    url.searchParams.set('academicYear', academicYear);
    if (day) url.searchParams.set('day', day);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'X-ERP-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch timetable from ERP');
    }

    const data = await response.json();
    const rawList = Array.isArray(data) ? data : data.timetable || data.schedule || [];
    return rawList.map((item: any, idx: number) => normalizeTimetableEntry(item, idx));
  }

  async getAttendance(
    sessionToken: string
  ): Promise<{ overall: OverallAttendance; subjects: AttendanceRecord[] }> {
    if (!this.isConfigured()) {
      throw new Error('ERP provider not configured.');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/student/attendance`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'X-ERP-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance from ERP');
    }

    const data = await response.json();
    return normalizeAttendance(data);
  }

  async getCourses(sessionToken: string): Promise<CourseInfo[]> {
    if (!this.isConfigured()) {
      throw new Error('ERP provider not configured.');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/student/courses`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'X-ERP-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch registered courses from ERP');
    }

    const data = await response.json();
    const rawList = Array.isArray(data) ? data : data.courses || [];
    return rawList.map(normalizeCourse);
  }

  async testConnection(): Promise<{ connected: boolean; latencyMs: number; message: string }> {
    if (!this.isConfigured()) {
      return {
        connected: false,
        latencyMs: 0,
        message: 'ERP_BASE_URL or credentials not set. Operating in Demo/Mock Mode.',
      };
    }

    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        headers: { 'X-ERP-Api-Key': this.apiKey },
        signal: AbortSignal.timeout(4000),
      });
      const latencyMs = Date.now() - start;
      return {
        connected: response.ok,
        latencyMs,
        message: response.ok
          ? `Connected to official ERP gateway (${latencyMs}ms)`
          : `ERP returned status ${response.status}`,
      };
    } catch (err: any) {
      return {
        connected: false,
        latencyMs: Date.now() - start,
        message: `Connection failed: ${err.message}`,
      };
    }
  }
}
