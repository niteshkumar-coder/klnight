import {
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  MapPin,
  User,
} from 'lucide-react';
import React from 'react';
import { AttendanceRecord, CourseInfo } from '../types';

interface CoursesSectionProps {
  courses: CourseInfo[];
  attendanceRecords: AttendanceRecord[];
  onOpenRoom: (roomCode: string) => void;
  onOpenAttendance: (sub: AttendanceRecord) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  attendanceRecords,
  onOpenRoom,
  onOpenAttendance,
}) => {
  const getAttendanceForCourse = (code: string) => {
    return attendanceRecords.find((a) => a.courseCode.toUpperCase() === code.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#111111]" />
            <h2 className="text-lg font-bold text-[#111111] font-display">
              REGISTERED COURSES & CURRICULUM
            </h2>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Odd Semester 2026-27 · Computer Science and Engineering Department
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-code">
          <div className="px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
            <span className="text-[#666666]">TOTAL CREDITS: </span>
            <span className="text-[#111111] font-bold">14</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
            <span className="text-[#666666]">TOTAL COURSES: </span>
            <span className="text-[#111111] font-bold">{courses.length}</span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => {
          const att = getAttendanceForCourse(course.code);

          return (
            <div
              key={course.code}
              id={`card-course-${course.code}`}
              className="bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#D1D5DB] rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Course Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded-lg border border-[#E5E5E5] bg-[#F3F4F6] text-[#111111] inline-block mb-2">
                      {course.code}
                    </span>
                    <h3 className="text-base font-bold text-[#111111] font-display">
                      {course.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5] text-[#111111] shrink-0">
                    {course.credits} Credits
                  </span>
                </div>

                {/* Faculty & Room Information */}
                <div className="space-y-2 text-xs font-mono-code py-3 border-y border-[#E5E5E5]">
                  <div className="flex items-center justify-between text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#666666]" />
                      Instructor:
                    </span>
                    <span className="font-bold text-[#111111]">{course.faculty}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#666666]" />
                      Classroom:
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenRoom(course.room)}
                      className="font-bold text-[#111111] underline cursor-pointer"
                    >
                      Room {course.room}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#666666]" />
                      Type:
                    </span>
                    <span className="font-bold text-[#111111]">{course.type}</span>
                  </div>
                </div>

                {/* Schedule Days */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono-code uppercase font-bold text-[#666666] mb-1.5">
                    WEEKLY SLOTS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {course.schedule.map((sch, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono-code px-2 py-0.5 rounded-md bg-[#F9FAFB] border border-[#E5E5E5] text-[#111111]"
                      >
                        {sch.day.substring(0, 3)}: {sch.time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendance quick row */}
              {att && (
                <div
                  onClick={() => onOpenAttendance(att)}
                  className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs cursor-pointer hover:opacity-80"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span className="text-[#666666]">Current Attendance:</span>
                  </div>
                  <span className="font-bold font-mono-code text-[#111111]">
                    {att.percentage}% ({att.attended}/{att.total}) →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
