import {
  AttendanceRecord,
  CourseInfo,
  DayOfWeek,
  ERPStatus,
  OverallAttendance,
  StudentProfile,
  TimetableEntry,
  UserSettings,
} from '../types';
import {
  DEMO_ATTENDANCE_OVERALL,
  DEMO_ATTENDANCE_SUBJECTS,
  DEMO_COURSES,
  DEMO_STUDENT,
  DEMO_TIMETABLE,
} from './erp/mockData';

const OFFLINE_CACHE_KEY = 'kl_timetable_offline_cache';
const OFFLINE_SETTINGS_KEY = 'kl_timetable_user_settings';
const OFFLINE_TOKEN_KEY = 'kl_timetable_session_token';

export interface CachedData {
  student: StudentProfile | null;
  timetable: TimetableEntry[];
  courses: CourseInfo[];
  attendance: {
    overall: OverallAttendance;
    subjects: AttendanceRecord[];
  } | null;
  lastSynced: string;
}

export function saveOfflineCache(data: Partial<CachedData>): void {
  try {
    const existing = getOfflineCache();
    const merged = {
      ...existing,
      ...data,
      lastSynced: new Date().toISOString(),
    };
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Could not write to localStorage:', e);
  }
}

export function getOfflineCache(): CachedData {
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
  }
  return {
    student: null,
    timetable: [],
    courses: [],
    attendance: null,
    lastSynced: '',
  };
}

async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(OFFLINE_TOKEN_KEY) : null;
  const headers = new Headers(init?.headers || {});

  if (token) {
    if (!headers.has('x-session-id')) {
      headers.set('x-session-id', token);
    }
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
}

export const api = {
  async login(credentials: {
    universityId: string;
    password?: string;
    semester?: string;
    academicYear?: string;
    rememberMe?: boolean;
  }): Promise<{ success: boolean; student: StudentProfile; mode: string; sessionToken?: string }> {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    if (data.sessionToken) {
      localStorage.setItem(OFFLINE_TOKEN_KEY, data.sessionToken);
    }
    saveOfflineCache({ student: data.student });
    return data;
  },

  async checkSession(): Promise<{
    authenticated: boolean;
    student?: StudentProfile;
    mode?: string;
  }> {
    try {
      const res = await apiFetch('/api/auth/session');
      if (!res.ok) {
        const cached = getOfflineCache();
        if (cached.student) {
          return { authenticated: true, student: cached.student, mode: 'mock' };
        }
        return { authenticated: false };
      }
      const data = await res.json();
      if (data.authenticated && data.student) {
        if (data.sessionToken) {
          localStorage.setItem(OFFLINE_TOKEN_KEY, data.sessionToken);
        }
        saveOfflineCache({ student: data.student });
      }
      return data;
    } catch {
      // If server unreachable, check offline cache
      const cached = getOfflineCache();
      if (cached.student) {
        return { authenticated: true, student: cached.student, mode: 'mock' };
      }
      return { authenticated: false };
    }
  },

  async getSession(): Promise<{
    authenticated: boolean;
    student?: StudentProfile;
    mode?: string;
  }> {
    return this.checkSession();
  },

  getCachedData(): CachedData {
    return getOfflineCache();
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {} finally {
      localStorage.removeItem(OFFLINE_TOKEN_KEY);
      localStorage.removeItem(OFFLINE_CACHE_KEY);
    }
  },

  async getTimetable(params?: {
    day?: DayOfWeek;
    type?: string;
    room?: string;
    search?: string;
  }): Promise<{ timetable: TimetableEntry[]; lastSync: string }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.day) searchParams.set('day', params.day);
      if (params?.type && params.type !== 'All') searchParams.set('type', params.type);
      if (params?.room && params.room !== 'All') searchParams.set('room', params.room);
      if (params?.search) searchParams.set('search', params.search);

      const res = await apiFetch(`/api/timetable?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load timetable from server');
      }

      const data = await res.json();
      if (data.timetable && Array.isArray(data.timetable)) {
        saveOfflineCache({ timetable: data.timetable });
        return data;
      }
      throw new Error('Invalid timetable format');
    } catch (err) {
      const cached = getOfflineCache();
      let list = cached.timetable.length > 0 ? cached.timetable : DEMO_TIMETABLE;
      if (params?.day) list = list.filter((e) => e.day.toLowerCase() === params.day?.toLowerCase());
      if (params?.type && params.type !== 'All') list = list.filter((e) => e.classType === params.type);
      if (params?.room && params.room !== 'All') list = list.filter((e) => e.room.toLowerCase().includes(params.room!.toLowerCase()));
      if (params?.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.courseName.toLowerCase().includes(s) ||
            e.courseCode.toLowerCase().includes(s) ||
            e.room.toLowerCase().includes(s)
        );
      }
      return { timetable: list, lastSync: cached.lastSynced || new Date().toISOString() };
    }
  },

  async getNextClass(simDay?: string, simTime?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (simDay) params.set('simDay', simDay);
      if (simTime) params.set('simTime', simTime);

      const res = await apiFetch(`/api/timetable/next?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Dynamic local fallback for next class
    const days: DayOfWeek[] = [
      'Monday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const now = new Date();
    const currentDay = (simDay as DayOfWeek) || (now.getDay() === 0 ? 'Monday' : days[now.getDay()]);
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMin = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = simTime || `${currentHour}:${currentMin}`;

    const todayClasses = DEMO_TIMETABLE.filter(
      (e) => e.day.toLowerCase() === currentDay.toLowerCase()
    );

    if (todayClasses.length === 0) {
      return {
        status: 'no_classes_today',
        message: 'No classes today 🎉',
        day: currentDay,
        currentTime: currentTimeStr,
      };
    }

    const currentLiveClass = todayClasses.find(
      (c) => currentTimeStr >= c.startTime && currentTimeStr < c.endTime
    );

    if (currentLiveClass) {
      return {
        status: 'live_now',
        currentClass: currentLiveClass,
        day: currentDay,
        currentTime: currentTimeStr,
        message: 'Class currently in progress',
      };
    }

    const upcomingClasses = todayClasses
      .filter((c) => c.startTime > currentTimeStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (upcomingClasses.length > 0) {
      const next = upcomingClasses[0];
      const [curH, curM] = currentTimeStr.split(':').map(Number);
      const [nextH, nextM] = next.startTime.split(':').map(Number);
      const diffMinutes = nextH * 60 + nextM - (curH * 60 + curM);

      return {
        status: 'upcoming',
        nextClass: next,
        minutesUntil: Math.max(0, diffMinutes),
        day: currentDay,
        currentTime: currentTimeStr,
      };
    }

    return {
      status: 'completed_for_today',
      message: "You're done for today 🎉",
      day: currentDay,
      currentTime: currentTimeStr,
    };
  },

  async getAttendance(): Promise<{
    overall: OverallAttendance;
    subjects: AttendanceRecord[];
  }> {
    try {
      const res = await apiFetch('/api/attendance');
      if (res.ok) {
        const data = await res.json();
        if (data.overall && data.subjects) {
          saveOfflineCache({ attendance: data });
          return data;
        }
      }
    } catch {}

    const cached = getOfflineCache();
    if (cached.attendance) {
      return cached.attendance;
    }
    return {
      overall: DEMO_ATTENDANCE_OVERALL,
      subjects: DEMO_ATTENDANCE_SUBJECTS,
    };
  },

  async getCourses(): Promise<CourseInfo[]> {
    try {
      const res = await apiFetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        if (data.courses && Array.isArray(data.courses)) {
          saveOfflineCache({ courses: data.courses });
          return data.courses;
        }
      }
    } catch {}

    const cached = getOfflineCache();
    if (cached.courses.length > 0) return cached.courses;
    return DEMO_COURSES;
  },

  async getRoomDetails(roomCode: string): Promise<any> {
    try {
      const res = await apiFetch(`/api/rooms/${encodeURIComponent(roomCode)}`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      room: {
        code: roomCode,
        building: 'FedEx / Main Academic Block',
        floor: 'Floor 1',
        block: 'F-Block',
        capacity: 65,
        type: 'Lecture & Lab Arena',
        facilities: ['Interactive Projector', 'Acoustic Sound System', 'Air Conditioned'],
        directions: `Navigate to F-Block corridor. Room ${roomCode} is clearly labeled.`,
      },
    };
  },

  async syncNow(): Promise<{ success: boolean; lastSync: string; syncCount: number }> {
    try {
      const res = await apiFetch('/api/sync', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}
    return {
      success: true,
      lastSync: new Date().toISOString(),
      syncCount: 1,
    };
  },

  getSettingsSync(): UserSettings {
    const raw = localStorage.getItem(OFFLINE_SETTINGS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return {
      reminderTime: '10m',
      autoRefresh: '10m',
      theme: 'dark',
      soundAlerts: false,
    };
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettingsSync();
    const updated = { ...current, ...settings };
    localStorage.setItem(OFFLINE_SETTINGS_KEY, JSON.stringify(updated));
    apiFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
    return updated;
  },

  async getSettings(): Promise<UserSettings> {
    try {
      const res = await apiFetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        return data.settings;
      }
    } catch {}
    return this.getSettingsSync();
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const res = await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(OFFLINE_SETTINGS_KEY, JSON.stringify(data.settings));
        return data.settings;
      }
    } catch {}
    const current = this.getSettingsSync();
    const updated = { ...current, ...settings };
    localStorage.setItem(OFFLINE_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  },

  async getProfile(): Promise<StudentProfile | null> {
    try {
      const res = await apiFetch('/api/student/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.student) {
          saveOfflineCache({ student: data.student });
          return data.student;
        }
      }
    } catch {}
    const cached = getOfflineCache();
    return cached.student;
  },

  async updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
    const res = await apiFetch('/api/student/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update profile');
    }

    const data = await res.json();
    if (data.student) {
      saveOfflineCache({ student: data.student });
      return data.student;
    }
    throw new Error('Invalid profile response');
  },

  async getDebugStatus(): Promise<ERPStatus> {
    try {
      const res = await apiFetch('/api/system/debug');
      if (res.ok) return await res.json();
    } catch {}
    return {
      providerName: 'KL University Mock ERP Adapter',
      mode: 'mock',
      connected: true,
      latencyMs: 45,
      syncCount: 1,
      lastSync: new Date().toISOString(),
    };
  },
};

