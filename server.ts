import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getERPProvider } from './src/lib/erp/erpClient';
import {
  DEMO_ATTENDANCE_OVERALL,
  DEMO_ATTENDANCE_SUBJECTS,
  DEMO_COURSES,
  DEMO_STUDENT,
  DEMO_TIMETABLE,
  ROOM_DATABASE,
} from './src/lib/erp/mockData';
import { DayOfWeek, StudentProfile, UserSettings } from './src/types';

interface SessionData {
  sessionToken: string;
  student: StudentProfile;
  createdAt: number;
  lastSync: number;
  settings: UserSettings;
}

// In-memory session store (keyed by internal session ID and token)
const activeSessions = new Map<string, SessionData>();

// User settings store per student
const userSettingsStore = new Map<string, UserSettings>();

let syncCount = 0;
let lastSyncTimestamp = Date.now();

const DEFAULT_SETTINGS: UserSettings = {
  reminderTime: '10m',
  autoRefresh: '10m',
  theme: 'dark',
  soundAlerts: false,
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Session Middleware Helper ---
  const getSession = (req: Request): SessionData | null => {
    const customHeader = req.headers['x-session-id'] as string;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
    const cookieSessionId = req.cookies?.kl_session_id;

    const tokenOrId = customHeader || bearerToken || cookieSessionId;

    if (tokenOrId) {
      const session = activeSessions.get(tokenOrId);
      if (session) {
        if (Date.now() - session.createdAt <= 30 * 24 * 60 * 60 * 1000) {
          return session;
        } else {
          activeSessions.delete(tokenOrId);
        }
      }
    }

    return null;
  };

  // --- API Routes ---

  // Health / Ping
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { universityId, password, semester, academicYear, rememberMe } = req.body;

      if (!universityId || !String(universityId).trim()) {
        res.status(400).json({ error: 'Please enter your University ID.' });
        return;
      }

      if (!password || !String(password).trim()) {
        res.status(400).json({ error: 'Please enter your password.' });
        return;
      }

      const erp = getERPProvider();
      const authResult = await erp.authenticate(
        String(universityId).trim(),
        String(password).trim(),
        semester || 'Odd',
        academicYear || '2026-27'
      );

      if (!authResult.success || !authResult.student || !authResult.sessionToken) {
        res.status(401).json({
          error: authResult.error || 'Unable to sign in. Please check your credentials.',
        });
        return;
      }

      const internalSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const savedSettings =
        userSettingsStore.get(authResult.student.studentId) || { ...DEFAULT_SETTINGS };

      const sessionObj: SessionData = {
        sessionToken: authResult.sessionToken,
        student: authResult.student,
        createdAt: Date.now(),
        lastSync: Date.now(),
        settings: savedSettings,
      };

      activeSessions.set(internalSessionId, sessionObj);
      activeSessions.set(authResult.sessionToken, sessionObj);

      // Set cookie with fallback-friendly settings
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
      res.cookie('kl_session_id', internalSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge,
      });

      res.json({
        success: true,
        sessionToken: internalSessionId,
        student: authResult.student,
        mode: erp.isMock ? 'mock' : 'authorized',
        message: erp.isMock ? 'Demo Mode: Local data stays in browser' : 'Authenticated with ERP',
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal authentication server error.' });
    }
  });

  // Check Current Session
  app.get('/api/auth/session', async (req: Request, res: Response) => {
    const session = getSession(req);
    const erp = getERPProvider();

    if (!session) {
      res.json({ authenticated: false });
      return;
    }

    res.json({
      authenticated: true,
      student: session.student,
      sessionToken: session.sessionToken,
      mode: erp.isMock ? 'mock' : 'authorized',
      lastSync: new Date(session.lastSync).toISOString(),
    });
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const customHeader = req.headers['x-session-id'] as string;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
    const cookieSessionId = req.cookies?.kl_session_id;

    if (customHeader) activeSessions.delete(customHeader);
    if (bearerToken) activeSessions.delete(bearerToken);
    if (cookieSessionId) activeSessions.delete(cookieSessionId);

    res.clearCookie('kl_session_id', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Student Profile
  app.get('/api/student/profile', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }
    res.json({ student: session.student });
  });

  // Update Locally Editable Profile Fields
  app.put('/api/student/profile', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    const { name, section, email, advisor } = req.body;
    const updatedStudent: StudentProfile = {
      ...session.student,
      name: name !== undefined ? String(name).trim() || session.student.name : session.student.name,
      section: section !== undefined ? String(section).trim() || session.student.section : session.student.section,
      email: email !== undefined ? String(email).trim() : session.student.email,
      advisor: advisor !== undefined ? String(advisor).trim() : session.student.advisor,
      // Strictly immutable identity
      studentId: session.student.studentId,
      universityId: session.student.universityId || session.student.studentId,
    };

    session.student = updatedStudent;
    res.json({ success: true, student: updatedStudent });
  });

  // Timetable (All or Filtered)
  app.get('/api/timetable', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      const erp = getERPProvider();
      const day = req.query.day as DayOfWeek | undefined;
      const type = req.query.type as string | undefined;
      const room = req.query.room as string | undefined;
      const search = (req.query.search as string | undefined)?.toLowerCase().trim();

      let entries = await erp.getTimetable(
        session.sessionToken,
        session.student.semester,
        session.student.academicYear,
        day
      );

      if (type && type !== 'All') {
        entries = entries.filter((e) => e.classType === type);
      }

      if (room && room !== 'All') {
        entries = entries.filter((e) => e.room.toLowerCase().includes(room.toLowerCase()));
      }

      if (search) {
        entries = entries.filter(
          (e) =>
            e.courseName.toLowerCase().includes(search) ||
            e.courseCode.toLowerCase().includes(search) ||
            e.room.toLowerCase().includes(search) ||
            e.faculty.toLowerCase().includes(search)
        );
      }

      res.json({
        timetable: entries,
        studentId: session.student.studentId,
        semester: session.student.semester,
        academicYear: session.student.academicYear,
        lastSync: new Date(session.lastSync).toISOString(),
      });
    } catch (err: any) {
      console.error('Timetable error:', err);
      res.status(500).json({ error: 'Timetable could not be loaded.' });
    }
  });

  // Today's Timetable
  app.get('/api/timetable/today', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      const dayParam = req.query.day as string | undefined;
      let dayName: DayOfWeek;

      if (dayParam) {
        dayName = dayParam as DayOfWeek;
      } else {
        const days: DayOfWeek[] = [
          'Monday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
        dayName = currentDayIndex === 0 ? 'Monday' : days[currentDayIndex];
      }

      const erp = getERPProvider();
      const allEntries = await erp.getTimetable(
        session.sessionToken,
        session.student.semester,
        session.student.academicYear
      );

      const todayEntries = allEntries.filter(
        (e) => e.day.toLowerCase() === dayName.toLowerCase()
      );

      res.json({
        day: dayName,
        classes: todayEntries,
        count: todayEntries.length,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Today schedule could not be loaded.' });
    }
  });

  // Next / Current Class Dynamically
  app.get('/api/timetable/next', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      const erp = getERPProvider();
      const allEntries = await erp.getTimetable(
        session.sessionToken,
        session.student.semester,
        session.student.academicYear
      );

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
      const currentDay = now.getDay() === 0 ? 'Monday' : days[now.getDay()];
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMin = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMin}`;

      const todayClasses = allEntries.filter(
        (e) => e.day.toLowerCase() === currentDay.toLowerCase()
      );

      if (todayClasses.length === 0) {
        res.json({
          status: 'no_classes_today',
          message: 'No classes today 🎉',
          day: currentDay,
          currentTime: currentTimeStr,
        });
        return;
      }

      // Check for LIVE class
      const currentLiveClass = todayClasses.find(
        (c) => currentTimeStr >= c.startTime && currentTimeStr < c.endTime
      );

      if (currentLiveClass) {
        res.json({
          status: 'live_now',
          currentClass: currentLiveClass,
          day: currentDay,
          currentTime: currentTimeStr,
          message: 'Class currently in progress',
        });
        return;
      }

      // Check for next upcoming class today
      const upcomingClasses = todayClasses
        .filter((c) => c.startTime > currentTimeStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      if (upcomingClasses.length > 0) {
        const next = upcomingClasses[0];
        // Calculate minutes remaining
        const [curH, curM] = currentTimeStr.split(':').map(Number);
        const [nextH, nextM] = next.startTime.split(':').map(Number);
        const diffMinutes = nextH * 60 + nextM - (curH * 60 + curM);

        res.json({
          status: 'upcoming',
          nextClass: next,
          minutesUntil: Math.max(0, diffMinutes),
          day: currentDay,
          currentTime: currentTimeStr,
        });
        return;
      }

      // All classes completed for today
      res.json({
        status: 'completed_for_today',
        message: "You're done for today 🎉",
        day: currentDay,
        currentTime: currentTimeStr,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to compute next class.' });
    }
  });

  // Attendance
  app.get('/api/attendance', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      const erp = getERPProvider();
      const attendance = await erp.getAttendance(session.sessionToken);
      res.json(attendance);
    } catch (err: any) {
      console.warn('Falling back to default demo attendance data:', err?.message || err);
      res.json({
        overall: DEMO_ATTENDANCE_OVERALL,
        subjects: DEMO_ATTENDANCE_SUBJECTS,
      });
    }
  });

  // Specific Subject Attendance Detail
  app.get('/api/attendance/course/:code', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      const { code } = req.params;
      const erp = getERPProvider();
      const attendance = await erp.getAttendance(session.sessionToken).catch(() => ({
        overall: DEMO_ATTENDANCE_OVERALL,
        subjects: DEMO_ATTENDANCE_SUBJECTS,
      }));
      const subject = attendance.subjects.find(
        (s) => s.courseCode.toUpperCase() === code.toUpperCase()
      );

      if (!subject) {
        res.status(404).json({ error: 'Course attendance record not found.' });
        return;
      }

      res.json({ subject, overall: attendance.overall });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch course attendance.' });
    }
  });

  // Courses
  app.get('/api/courses', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      const erp = getERPProvider();
      const courses = await erp.getCourses(session.sessionToken);
      res.json({ courses });
    } catch (err: any) {
      console.warn('Falling back to default demo courses:', err?.message || err);
      res.json({ courses: DEMO_COURSES });
    }
  });

  // Room Details
  app.get('/api/rooms/:code', (req: Request, res: Response) => {
    const code = req.params.code.toUpperCase();
    const room = ROOM_DATABASE[code];
    if (room) {
      res.json({ room });
    } else {
      res.json({
        room: {
          code,
          building: 'Main Academic Complex',
          floor: 'Classroom Wing',
          block: 'Academic Block',
          capacity: 60,
          type: 'Lecture Classroom',
          facilities: ['Projector', 'Whiteboard', 'Air Conditioned'],
          directions: `Located on the campus academic wing. Follow signage for room ${code}.`,
        },
      });
    }
  });

  // Sync Data (Simulated ERP Refresh)
  app.post('/api/sync', async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    try {
      syncCount += 1;
      lastSyncTimestamp = Date.now();
      session.lastSync = lastSyncTimestamp;

      // Small simulated latency for sync animation
      await new Promise((r) => setTimeout(r, 450));

      res.json({
        success: true,
        lastSync: new Date(lastSyncTimestamp).toISOString(),
        message: 'Timetable and attendance synced successfully.',
        syncCount,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to sync with ERP.' });
    }
  });

  // User Settings
  app.get('/api/settings', (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }
    res.json({ settings: session.settings });
  });

  app.post('/api/settings', (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return;
    }

    session.settings = {
      ...session.settings,
      ...req.body,
    };
    userSettingsStore.set(session.student.studentId, session.settings);

    res.json({ success: true, settings: session.settings });
  });

  // System / Debug Status
  app.get('/api/system/debug', async (req: Request, res: Response) => {
    const erp = getERPProvider();
    const connTest = await erp.testConnection();

    res.json({
      provider: erp.name,
      mode: erp.isMock ? 'mock' : 'authorized',
      connected: connTest.connected,
      latencyMs: connTest.latencyMs,
      message: connTest.message,
      activeSessionsCount: activeSessions.size,
      totalSyncs: syncCount,
      lastSync: new Date(lastSyncTimestamp).toISOString(),
      currentTime: new Date().toISOString(),
    });
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KL Timetable Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
