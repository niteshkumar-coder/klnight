import {
  AttendanceRecord,
  ClassType,
  CourseInfo,
  DayOfWeek,
  OverallAttendance,
  StudentProfile,
  TimetableEntry,
} from '../../types';

export function normalizeDay(rawDay: string): DayOfWeek {
  const clean = (rawDay || '').trim().toLowerCase();
  if (clean.startsWith('mon')) return 'Monday';
  if (clean.startsWith('tue')) return 'Tuesday';
  if (clean.startsWith('wed')) return 'Wednesday';
  if (clean.startsWith('thu')) return 'Thursday';
  if (clean.startsWith('fri')) return 'Friday';
  if (clean.startsWith('sat')) return 'Saturday';
  return 'Monday';
}

export function normalizeClassType(rawType: string): ClassType {
  const clean = (rawType || '').trim().toUpperCase();
  if (clean === 'L' || clean.includes('LECTURE')) return 'L';
  if (clean === 'T' || clean.includes('TUTORIAL')) return 'T';
  if (clean === 'P' || clean.includes('PRACTICAL') || clean.includes('LAB')) return 'P';
  if (clean === 'S' || clean.includes('SESSION') || clean.includes('SKILL')) return 'S';
  return 'L';
}

export function getClassTypeLabel(type: ClassType): string {
  switch (type) {
    case 'L':
      return 'Lecture';
    case 'T':
      return 'Tutorial';
    case 'P':
      return 'Practical';
    case 'S':
      return 'Session';
    default:
      return 'Class';
  }
}

export function formatTime12(time24: string): string {
  if (!time24) return '';
  const clean = time24.trim();
  const parts = clean.split(':');
  if (parts.length < 2) return clean;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].slice(0, 2);
  if (isNaN(hours)) return clean;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = hours.toString().padStart(2, '0');
  return `${hh}:${minutes} ${ampm}`;
}

export function normalizeStudent(raw: any): StudentProfile {
  const id = String(raw.studentId || raw.universityId || '').trim();
  return {
    studentId: id,
    universityId: id,
    name: String(raw.name || raw.studentName || 'Student').trim(),
    program: String(raw.program || 'B.Tech').trim(),
    branch: String(raw.branch || 'Computer Science and Engineering').trim(),
    section: String(raw.section || 'S-1-A').trim(),
    semester: raw.semester === 'Even' ? 'Even' : 'Odd',
    academicYear: String(raw.academicYear || '2026-27').trim(),
    email: String(raw.email || (id ? `${id}@kluniversity.in` : '')).trim(),
    avatar: raw.avatar || (raw.name ? raw.name.charAt(0).toUpperCase() : (id ? id.charAt(0).toUpperCase() : 'S')),
    cgpa: typeof raw.cgpa === 'number' ? raw.cgpa : 8.85,
    advisor: raw.advisor || 'Academic Coordinator',
    isMockData: Boolean(raw.isMockData),
  };
}

export function normalizeCourse(raw: any): CourseInfo {
  return {
    code: String(raw.code || raw.courseCode || '').trim().toUpperCase(),
    name: String(raw.name || raw.courseName || 'Course Title').trim(),
    type: String(raw.type || raw.courseType || 'Core Course').trim(),
    credits: Number(raw.credits || 3),
    faculty: String(raw.faculty || raw.facultyName || 'Faculty In-Charge').trim(),
    weeklyClasses: Number(raw.weeklyClasses || 4),
    color: raw.color || '#B8FF00',
    primaryRoom: String(raw.primaryRoom || raw.room || 'F105').trim(),
    description: raw.description || '',
  };
}

export function normalizeTimetableEntry(raw: any, index: number = 0): TimetableEntry {
  const day = normalizeDay(raw.day || raw.dayOfWeek || 'Monday');
  const classType = normalizeClassType(raw.classType || raw.type || 'L');

  return {
    id: String(raw.id || `${day.toLowerCase()}-${raw.slot || index + 1}-${raw.startTime || '0710'}`),
    day,
    slot: Number(raw.slot || index + 1),
    startTime: String(raw.startTime || '07:10').trim(),
    endTime: String(raw.endTime || '08:00').trim(),
    courseCode: String(raw.courseCode || raw.code || '').trim().toUpperCase(),
    courseName: String(raw.courseName || raw.name || 'Subject').trim(),
    classType,
    section: String(raw.section || 'S-1-A').trim(),
    room: String(raw.room || raw.roomNumber || 'F105').trim(),
    faculty: String(raw.faculty || raw.facultyName || 'Faculty Member').trim(),
    isCancelled: Boolean(raw.isCancelled),
  };
}

export function normalizeAttendance(raw: any): {
  overall: OverallAttendance;
  subjects: AttendanceRecord[];
} {
  const subjects: AttendanceRecord[] = Array.isArray(raw.subjects)
    ? raw.subjects.map((sub: any) => {
        const total = Number(sub.totalClasses || 0);
        const attended = Number(sub.attended || 0);
        const absent = Number(sub.absent !== undefined ? sub.absent : Math.max(0, total - attended));
        const percentage = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 0;
        
        let status: 'good' | 'warning' | 'low' = 'good';
        if (percentage < 75) status = 'low';
        else if (percentage < 85) status = 'warning';

        return {
          courseCode: String(sub.courseCode || '').trim().toUpperCase(),
          courseName: String(sub.courseName || 'Course').trim(),
          faculty: String(sub.faculty || 'Faculty In-Charge').trim(),
          totalClasses: total,
          attended,
          absent,
          percentage,
          lastUpdated: sub.lastUpdated || 'Recently synced',
          status,
        };
      })
    : [];

  const totalClasses = subjects.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attended = subjects.reduce((acc, curr) => acc + curr.attended, 0);
  const absent = subjects.reduce((acc, curr) => acc + curr.absent, 0);
  const percentage = totalClasses > 0 ? Number(((attended / totalClasses) * 100).toFixed(1)) : 86.4;

  let overallStatus: 'good' | 'warning' | 'low' = 'good';
  if (percentage < 75) overallStatus = 'low';
  else if (percentage < 85) overallStatus = 'warning';

  return {
    overall: {
      percentage,
      totalClasses,
      attended,
      absent,
      status: overallStatus,
      lastUpdated: raw.overall?.lastUpdated || '10 minutes ago',
    },
    subjects,
  };
}
