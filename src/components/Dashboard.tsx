import {
  Calendar,
  Grid,
  List,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { createMockStudent, DEMO_COURSES, DEMO_TIMETABLE } from '../lib/erp/mockData';
import {
  AttendanceRecord,
  CourseInfo,
  DayOfWeek,
  OverallAttendance,
  StudentProfile,
  TimetableEntry,
  UserSettings,
} from '../types';
import { usePWAInstall } from '../lib/usePWAInstall';
import { AttendanceSection } from './AttendanceSection';
import { BottomNav } from './BottomNav';
import { CoursesSection } from './CoursesSection';
import { DayWiseTimetable } from './DayWiseTimetable';
import { DebugModal } from './DebugModal';
import { Header } from './Header';
import { InstallAppBanner } from './InstallAppBanner';
import { LifePlannerSection } from './LifePlannerSection';
import { NextClassCard } from './NextClassCard';
import { OfflineBanner } from './OfflineBanner';
import { ProfileSection } from './ProfileSection';
import { PWAInstallModal } from './PWAInstallModal';
import { RoomModal } from './RoomModal';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { SettingsModal } from './SettingsModal';
import { NavTab, Sidebar } from './Sidebar';
import { SubjectDetailModal } from './SubjectDetailModal';
import { WeeklyGridCalendar } from './WeeklyGridCalendar';

const DAYS_ORDER: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const NEXT_DAY_MAP: Record<DayOfWeek, DayOfWeek> = {
  Monday: 'Tuesday',
  Tuesday: 'Wednesday',
  Wednesday: 'Thursday',
  Thursday: 'Friday',
  Friday: 'Saturday',
  Saturday: 'Sunday',
  Sunday: 'Monday',
};

// Helper to determine real device current day
export function getCurrentDay(): DayOfWeek {
  const dayIdx = new Date().getDay();
  const mapDays: Record<number, DayOfWeek> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return mapDays[dayIdx] || 'Sunday';
}

// Helper to determine real device current 24-hour time HH:MM
export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

interface DashboardProps {
  onLogout: () => void;
  initialStudent?: StudentProfile | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, initialStudent }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [timetableViewMode, setTimetableViewMode] = useState<'day_wise' | 'grid'>('day_wise');

  // Real device clock states (updates smoothly every second)
  const [currentRealTime, setCurrentRealTime] = useState<string>(getCurrentTime);
  const [currentRealDay, setCurrentRealDay] = useState<DayOfWeek>(getCurrentDay);

  // Selected Day for Timetable (defaults strictly to real today)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDay);

  // Authenticated student state
  const [student, setStudent] = useState<StudentProfile>(
    initialStudent || createMockStudent('', 'Odd', '2026-27')
  );

  // Timetable, Courses & Attendance state
  const [timetable, setTimetable] = useState<TimetableEntry[]>(DEMO_TIMETABLE);
  const [attendance, setAttendance] = useState<{
    overall: OverallAttendance;
    subjects: AttendanceRecord[];
  }>({
    overall: {
      percentage: 86.4,
      totalClasses: 110,
      attended: 95,
      absent: 15,
      status: 'good',
      lastUpdated: 'Today',
    },
    subjects: [],
  });
  const [courses, setCourses] = useState<CourseInfo[]>(DEMO_COURSES);

  // Status & Sync states
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isOffline, setIsOffline] = useState(false);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(api.getSettingsSync());

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('All');

  // Modals
  const [activeRoomModal, setActiveRoomModal] = useState<string | null>(null);
  const [activeSubjectModal, setActiveSubjectModal] = useState<AttendanceRecord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Progressive Web App (PWA) Install Management
  const {
    canPromptNative,
    isInstalled,
    isInstallModalOpen,
    openInstallModal,
    closeInstallModal,
    triggerNativePrompt,
  } = usePWAInstall();

  // Real system device clock loop (1-second tick)
  useEffect(() => {
    const updateTick = () => {
      setCurrentRealTime(getCurrentTime());
      setCurrentRealDay(getCurrentDay());
    };

    updateTick();
    const interval = setInterval(updateTick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load initial data
  const loadDashboardData = useCallback(async (showSyncAnimation = false) => {
    if (showSyncAnimation) setIsSyncing(true);
    try {
      const [session, timetableRes, attRes] = await Promise.all([
        api.getSession(),
        api.getTimetable(),
        api.getAttendance(),
      ]);

      if (session.authenticated && session.student) {
        setStudent(session.student);
      }

      setTimetable(timetableRes.timetable || DEMO_TIMETABLE);
      setAttendance(attRes);
      setLastSyncTime(timetableRes.lastSync || new Date().toISOString());
      setIsOffline(false);
    } catch (err) {
      console.error('Failed loading timetable data, fallback to cache:', err);
      setIsOffline(true);
      const cached = api.getCachedData();
      if (cached) {
        if (cached.timetable && cached.timetable.length > 0) {
          setTimetable(cached.timetable);
        }
        if (cached.attendance) {
          setAttendance(cached.attendance);
        }
        setLastSyncTime(cached.lastSynced);
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh interval listener
  useEffect(() => {
    if (settings.autoRefresh === 'off') return;
    const minutes = parseInt(settings.autoRefresh.replace('m', ''), 10) || 10;
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.autoRefresh, loadDashboardData]);

  const handleUpdateSettings = (newSet: Partial<UserSettings>) => {
    const updated = api.saveSettings(newSet);
    setSettings(updated);
  };

  const handleLogout = async () => {
    await api.logout();
    onLogout();
  };

  // Helper functions for schedule logic
  const getDaySchedule = useCallback(
    (day: DayOfWeek) => {
      return timetable
        .filter((e) => e.day.toLowerCase() === day.toLowerCase())
        .sort((a, b) => a.slot - b.slot || a.startTime.localeCompare(b.startTime));
    },
    [timetable]
  );

  const getTodaySchedule = useCallback(() => {
    return getDaySchedule(currentRealDay);
  }, [getDaySchedule, currentRealDay]);

  const getCurrentClass = useCallback(() => {
    const todayItems = getTodaySchedule();
    return todayItems.find(
      (e) => currentRealTime >= e.startTime && currentRealTime < e.endTime
    );
  }, [getTodaySchedule, currentRealTime]);

  const getNextClass = useCallback(() => {
    const todayItems = getTodaySchedule();
    return todayItems.find((e) => e.startTime > currentRealTime);
  }, [getTodaySchedule, currentRealTime]);

  const getTimeUntilNextClass = useCallback(() => {
    const upcoming = getNextClass();
    if (!upcoming) return undefined;
    const [curH, curM] = currentRealTime.split(':').map(Number);
    const [startH, startM] = upcoming.startTime.split(':').map(Number);
    return Math.max(0, (startH * 60 + startM) - (curH * 60 + curM));
  }, [getNextClass, currentRealTime]);

  // Distinct room list for filtering
  const availableRooms = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach((e) => {
      if (e.room) set.add(e.room);
    });
    return Array.from(set).sort();
  }, [timetable]);

  // Filtered timetable entries
  const filteredTimetable = useMemo(() => {
    return timetable.filter((entry) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = entry.courseName.toLowerCase().includes(q);
        const matchesCode = entry.courseCode.toLowerCase().includes(q);
        const matchesRoom = entry.room.toLowerCase().includes(q);
        const matchesFaculty = entry.faculty.toLowerCase().includes(q);
        const matchesType = entry.classType.toLowerCase().includes(q);
        const matchesDay = entry.day.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesRoom && !matchesFaculty && !matchesType && !matchesDay) {
          return false;
        }
      }

      if (selectedTypeFilter !== 'All' && entry.classType !== selectedTypeFilter) {
        return false;
      }

      if (selectedRoomFilter !== 'All' && entry.room !== selectedRoomFilter) {
        return false;
      }

      return true;
    });
  }, [timetable, searchQuery, selectedTypeFilter, selectedRoomFilter]);

  // Next class & Live class computation based on real system clock
  const { status, currentClass, nextClass, nextClassTomorrow, minutesUntil, todayClasses } = useMemo(() => {
    if (timetable.length === 0) {
      return {
        status: 'no_classes_today' as const,
        todayClasses: [],
      };
    }

    const todayItems = getTodaySchedule();

    // Smart lookup for next day with classes (handles Sunday holiday / weekend skip)
    const findNextUpcomingDayWithClasses = () => {
      let curr = currentRealDay;
      for (let step = 1; step <= 7; step++) {
        const nextDay = NEXT_DAY_MAP[curr];
        const items = getDaySchedule(nextDay);
        if (items.length > 0) {
          return { day: nextDay, entry: items[0], daysAhead: step };
        }
        curr = nextDay;
      }
      return undefined;
    };

    const nextUpcomingObj = findNextUpcomingDayWithClasses();

    if (todayItems.length === 0) {
      return {
        status: 'no_classes_today' as const,
        nextClassTomorrow: nextUpcomingObj,
        todayClasses: [],
      };
    }

    const live = getCurrentClass();
    if (live) {
      return {
        status: 'live_now' as const,
        currentClass: live,
        todayClasses: todayItems,
      };
    }

    const upcoming = getNextClass();
    if (upcoming) {
      return {
        status: 'upcoming' as const,
        nextClass: upcoming,
        minutesUntil: getTimeUntilNextClass(),
        todayClasses: todayItems,
      };
    }

    // All classes done today
    return {
      status: 'completed_for_today' as const,
      nextClassTomorrow: nextUpcomingObj,
      todayClasses: todayItems,
    };
  }, [
    timetable,
    currentRealDay,
    currentRealTime,
    getTodaySchedule,
    getDaySchedule,
    getCurrentClass,
    getNextClass,
    getTimeUntilNextClass,
  ]);

  const handleUpdateProfile = async (updates: Partial<StudentProfile>) => {
    const updated = await api.updateProfile(updates);
    setStudent(updated);
  };

  const actualUniversityId = student.universityId || student.studentId;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col font-sans">
      {/* Top Header with Real-Time Clock & App Install */}
      <Header
        student={student}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        onSync={() => loadDashboardData(true)}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDebug={() => setIsDebugOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenInstall={openInstallModal}
        isInstalled={isInstalled}
        isMockMode={true}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          attendancePercent={attendance.overall.percentage}
          onOpenInstall={openInstallModal}
          isInstalled={isInstalled}
        />

        {/* Center Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto pb-24 md:pb-8">
          {/* Offline Notice */}
          {isOffline && (
            <OfflineBanner
              lastSync={lastSyncTime}
              onRetry={() => loadDashboardData(true)}
              isRetrying={isSyncing}
            />
          )}

          {/* TAB 1: HOME (Dashboard Overview, Student Card, Next Class & Weekly Timetable) */}
          {currentTab === 'home' && (
            <div className="space-y-6">
              {/* Install Mobile App / PWA Banner */}
              <InstallAppBanner
                onOpenModal={openInstallModal}
                canPromptNative={canPromptNative}
                onNativeInstall={triggerNativePrompt}
                isInstalled={isInstalled}
              />

              {/* Top Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#111111] font-display">
                    Good morning, {student.name} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
                    Here's your schedule and class timetable for today ({currentRealDay}).
                  </p>
                </div>
              </div>

              {/* Student Information Card */}
              <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#111111]" />
                    <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-[#111111]">
                      STUDENT INFORMATION
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono-code font-semibold px-2 py-0.5 rounded bg-[#F3F4F6] text-[#666666] border border-[#E5E5E5]">
                    {student.academicYear}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                    <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                      University ID
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] font-mono-code mt-0.5 block truncate">
                      {actualUniversityId}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                    <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                      Section
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] font-mono-code mt-0.5 block">
                      {student.section}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                    <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                      Program
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] mt-0.5 block truncate">
                      {student.program}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                    <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                      Branch
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] mt-0.5 block truncate" title={student.branch}>
                      {student.branch}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                    <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                      Semester
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] font-mono-code mt-0.5 block">
                      {student.semester}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                    <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                      Academic Year
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] font-mono-code mt-0.5 block">
                      {student.academicYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prominent Next Class / Live Card */}
              <NextClassCard
                status={status}
                currentClass={currentClass}
                nextClass={nextClass}
                nextClassTomorrow={nextClassTomorrow}
                day={currentRealDay}
                onOpenRoom={(room) => setActiveRoomModal(room)}
                onViewSchedule={() => {
                  setCurrentTab('timetable');
                  setSelectedDay(currentRealDay);
                }}
              />

              {/* 30-Day Master Life & Study Timetable Quick Access Banner */}
              <div className="bg-[#FFFFFF] border border-[#DDD6FE] rounded-2xl p-5 shadow-xs relative overflow-hidden bg-radial from-[#F5F3FF] via-[#FFFFFF] to-[#FFFFFF]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center font-bold text-xl shrink-0">
                      🎯
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                          30-DAY MASTER PLAN (30 AUG – 28 SEP 2026)
                        </span>
                        <span className="text-[10px] font-mono-code text-[#16A34A] font-bold">
                          ● DAY 1 TODAY
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111111] font-display mt-1">
                        Complete Life, Study & Work Routine
                      </h3>
                      <p className="text-xs text-[#555555] mt-0.5 max-w-xl leading-relaxed">
                        College (7 AM–1 PM) + Java Mastery + Restaurant Job (5 PM–10 PM) + Gym/Swim +
                        Digital Marketing + YouTube + 7–8h Sleep.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentTab('life_planner')}
                    className="px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-[#FFFFFF] font-mono-code font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <span>Open 30-Day Timetable</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Weekly Timetable with Day Selector */}
              <DayWiseTimetable
                timetable={filteredTimetable}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                onOpenRoom={(room) => setActiveRoomModal(room)}
                currentTime={currentRealTime}
                currentDayName={currentRealDay}
              />
            </div>
          )}

          {/* TAB: 30-DAY LIFE, STUDY & WORK MASTER PLANNER */}
          {currentTab === 'life_planner' && (
            <LifePlannerSection
              currentDayName={currentRealDay}
              currentDateRaw="2026-08-30"
            />
          )}

          {/* TAB 2: TIMETABLE VIEW */}
          {currentTab === 'timetable' && (
            <div className="space-y-6">
              {/* Search & Filter Component */}
              <SearchAndFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedTypeFilter}
                onTypeChange={setSelectedTypeFilter}
                selectedRoom={selectedRoomFilter}
                onRoomChange={setSelectedRoomFilter}
                availableRooms={availableRooms}
                onReset={() => {
                  setSearchQuery('');
                  setSelectedTypeFilter('All');
                  setSelectedRoomFilter('All');
                }}
                totalResults={filteredTimetable.length}
              />

              {/* View Switcher: Day Cards vs Matrix Grid */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#666666] font-mono-code uppercase">
                  DISPLAY MODE
                </div>

                <div className="flex items-center gap-1 bg-[#F9FAFB] p-1 rounded-xl border border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setTimetableViewMode('day_wise')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      timetableViewMode === 'day_wise'
                        ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                        : 'text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>DAY-WISE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimetableViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      timetableViewMode === 'grid'
                        ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                        : 'text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>WEEK MATRIX</span>
                  </button>
                </div>
              </div>

              {/* Timetable View */}
              {timetableViewMode === 'day_wise' ? (
                <DayWiseTimetable
                  timetable={filteredTimetable}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  onOpenRoom={(room) => setActiveRoomModal(room)}
                  currentTime={currentRealTime}
                  currentDayName={currentRealDay}
                />
              ) : (
                <WeeklyGridCalendar
                  timetable={filteredTimetable}
                  onOpenRoom={(room) => setActiveRoomModal(room)}
                  currentDayName={currentRealDay}
                  currentTime={currentRealTime}
                />
              )}
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {currentTab === 'attendance' && (
            <AttendanceSection
              overall={attendance.overall}
              subjects={attendance.subjects}
              onSelectSubject={(sub) => setActiveSubjectModal(sub)}
              onRefresh={() => loadDashboardData(true)}
            />
          )}

          {/* TAB 4: MY COURSES */}
          {currentTab === 'courses' && (
            <CoursesSection
              courses={courses}
              attendanceRecords={attendance.subjects}
              onOpenRoom={(room) => setActiveRoomModal(room)}
              onOpenAttendance={(sub) => setActiveSubjectModal(sub)}
            />
          )}

          {/* TAB 5: PROFILE */}
          {currentTab === 'profile' && (
            <ProfileSection
              student={student}
              onUpdateProfile={handleUpdateProfile}
              isMockMode={true}
            />
          )}

          {/* TAB 6: SETTINGS */}
          {currentTab === 'settings' && (
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-bold text-[#111111] font-display uppercase">
                  PREFERENCES & SETTINGS
                </h2>
                <button
                  type="button"
                  onClick={() => setCurrentTab('profile')}
                  className="text-xs text-[#111111] font-mono-code font-bold hover:underline cursor-pointer"
                >
                  VIEW PROFILE →
                </button>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-mono-code font-bold text-[#666666] uppercase block mb-1">
                    STUDENT ID
                  </label>
                  <div className="p-3 bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-sm font-mono-code font-bold text-[#111111]">
                    {actualUniversityId} · {student.name}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono-code font-bold text-[#666666] uppercase block mb-1">
                    SEMESTER & SECTION
                  </label>
                  <div className="p-3 bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-sm font-mono-code text-[#111111]">
                    {student.semester} Semester · Section {student.section} ({student.academicYear})
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FFFFFF] font-bold text-xs transition-colors cursor-pointer"
                  >
                    CONFIGURE NOTIFICATIONS & REFRESH
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTab('profile')}
                    className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code font-bold text-[#111111] transition-colors cursor-pointer"
                  >
                    EDIT PROFILE
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-xs font-mono-code font-bold text-[#DC2626] transition-colors cursor-pointer"
                  >
                    LOG OUT
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        attendancePercent={attendance.overall.percentage}
        onOpenInstall={openInstallModal}
        isInstalled={isInstalled}
      />

      {/* Classroom Details Modal */}
      {activeRoomModal && (
        <RoomModal
          roomCode={activeRoomModal}
          onClose={() => setActiveRoomModal(null)}
        />
      )}

      {/* Subject Attendance Breakdown Modal */}
      {activeSubjectModal && (
        <SubjectDetailModal
          subject={activeSubjectModal}
          onClose={() => setActiveSubjectModal(null)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Developer Inspector Gateway Modal */}
      {isDebugOpen && (
        <DebugModal onClose={() => setIsDebugOpen(false)} />
      )}

      {/* Progressive Web App (PWA) Mobile Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={closeInstallModal}
        onInstallPrompt={triggerNativePrompt}
        canPromptNative={canPromptNative}
        isInstalled={isInstalled}
      />
    </div>
  );
};
