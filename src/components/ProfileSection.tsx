import {
  AlertCircle,
  Building,
  Calendar,
  Check,
  GraduationCap,
  Info,
  Lock,
  Mail,
  Pencil,
  Shield,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface ProfileSectionProps {
  student: StudentProfile;
  onUpdateProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  isMockMode?: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  student,
  onUpdateProfile,
  isMockMode = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [section, setSection] = useState(student.section);
  const [email, setEmail] = useState(student.email);
  const [advisor, setAdvisor] = useState(student.advisor || 'Academic Coordinator');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      await onUpdateProfile({
        name: name.trim() || 'Student',
        section: section.trim() || student.section,
        email: email.trim() || student.email,
        advisor: advisor.trim() || 'Academic Coordinator',
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(student.name);
    setSection(student.section);
    setEmail(student.email);
    setAdvisor(student.advisor || 'Academic Coordinator');
    setIsEditing(false);
    setErrorMsg(null);
  };

  const actualUniversityId = student.universityId || student.studentId;

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#FFFFFF] flex items-center justify-center text-2xl font-bold font-display shrink-0">
              {student.avatar || student.name.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display tracking-tight">
                  STUDENT PROFILE
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#666666] font-medium mt-0.5">
                Authenticated student credentials and enrollment details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code font-bold text-[#111111] transition-all cursor-pointer shadow-2xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>EDIT PROFILE</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code text-[#666666] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Details Form or Read-only Display */}
        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                FULL NAME
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] outline-none"
                  required
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-bold text-[#111111] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#666666]" />
                  <span>{student.name}</span>
                </div>
              )}
            </div>

            {/* University ID (Immutable) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] font-mono-code">
                  UNIVERSITY ID
                </label>
                <span className="text-[10px] text-[#666666] flex items-center gap-1 font-mono-code">
                  <Lock className="w-3 h-3 text-[#666666]" /> IMMUTABLE
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code font-bold text-[#111111] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#111111]" />
                <span>{actualUniversityId}</span>
              </div>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                SECTION
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] outline-none"
                  required
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code font-bold text-[#111111] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#666666]" />
                  <span>{student.section}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                EMAIL ADDRESS
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] outline-none"
                  required
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code text-[#111111] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#666666]" />
                  <span>{student.email}</span>
                </div>
              )}
            </div>

            {/* Program */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                PROGRAM & DEGREE
              </label>
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code text-[#111111] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#666666]" />
                <span>{student.program}</span>
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                BRANCH / DEPARTMENT
              </label>
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code text-[#111111] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#666666]" />
                <span>{student.branch}</span>
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                CURRENT SEMESTER
              </label>
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code text-[#111111] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#666666]" />
                <span>{student.semester}</span>
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code">
                ACADEMIC YEAR
              </label>
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-sm font-mono-code text-[#111111] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#666666]" />
                <span>{student.academicYear}</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-[#E5E5E5] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono-code text-[#666666] hover:bg-[#F9FAFB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-bold font-mono-code transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
