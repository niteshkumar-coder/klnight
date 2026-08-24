import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { api } from './lib/api';
import { StudentProfile } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);

  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const session = await api.getSession();
        if (session.authenticated && session.student) {
          setIsAuthenticated(true);
          setCurrentStudent(session.student);
        } else {
          // Check local cache
          const cached = api.getCachedData();
          if (cached && cached.student) {
            setIsAuthenticated(true);
            setCurrentStudent(cached.student);
          }
        }
      } catch (err) {
        console.warn('Session check fallback to cached student if present:', err);
        const cached = api.getCachedData();
        if (cached && cached.student) {
          setIsAuthenticated(true);
          setCurrentStudent(cached.student);
        }
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkInitialSession();
  }, []);

  const handleLogin = async (credentials: {
    universityId: string;
    password?: string;
    semester?: string;
    academicYear?: string;
    rememberMe?: boolean;
  }) => {
    const res = await api.login(credentials);
    return res;
  };

  const handleLoginSuccess = (student: StudentProfile) => {
    setCurrentStudent(student);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setCurrentStudent(null);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono-code font-bold text-[#666666] tracking-widest uppercase">
            LOADING TIMETABLE...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111]">
      {isAuthenticated && currentStudent ? (
        <Dashboard
          key={currentStudent.universityId || currentStudent.studentId}
          initialStudent={currentStudent}
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage
          onLogin={handleLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
