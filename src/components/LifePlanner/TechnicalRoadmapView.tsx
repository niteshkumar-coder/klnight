import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  FileCode,
  Flame,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';
import React, { useState } from 'react';
import { TECHNICAL_ROADMAP, TechnicalRoadmapDay } from '../../data/lifePlannerData';

interface TechnicalRoadmapViewProps {
  onToggleStatus?: (dayNum: number) => void;
}

export const TechnicalRoadmapView: React.FC<TechnicalRoadmapViewProps> = () => {
  const [activePhase, setActivePhase] = useState<'ALL' | 'JAVA' | 'PYTHON' | 'AI_AUTOMATION'>('ALL');
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('klu_tech_completed_days');
      return saved ? JSON.parse(saved) : { 1: false };
    } catch {
      return {};
    }
  });

  const toggleDayStatus = (dayNum: number) => {
    setCompletedDays((prev) => {
      const updated = { ...prev, [dayNum]: !prev[dayNum] };
      try {
        localStorage.setItem('klu_tech_completed_days', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save tech status:', err);
      }
      return updated;
    });
  };

  const filteredRoadmap = TECHNICAL_ROADMAP.filter((item: TechnicalRoadmapDay) => {
    if (activePhase === 'ALL') return true;
    return item.phase === activePhase;
  });

  // Calculate phase counts
  const javaDone = TECHNICAL_ROADMAP.filter((d) => d.phase === 'JAVA' && completedDays[d.dayNum]).length;
  const pythonDone = TECHNICAL_ROADMAP.filter((d) => d.phase === 'PYTHON' && completedDays[d.dayNum]).length;
  const aiDone = TECHNICAL_ROADMAP.filter((d) => d.phase === 'AI_AUTOMATION' && completedDays[d.dayNum]).length;

  return (
    <div className="space-y-6">
      {/* 3-PHASE SEQUENTIAL PIPELINE OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PHASE 1: JAVA */}
        <div
          onClick={() => setActivePhase('JAVA')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activePhase === 'JAVA'
              ? 'bg-[#F5F3FF] border-[#8B5CF6] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#D1D5DB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center font-bold text-sm">
                ☕
              </span>
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-[#6D28D9]">
                  PHASE 1 (FIRST)
                </span>
                <h4 className="text-sm font-bold text-[#111111] font-display">JAVA CORE & OOP</h4>
              </div>
            </div>
            <span className="text-xs font-mono-code font-bold text-[#6D28D9] bg-[#EDE9FE] px-2 py-0.5 rounded-full">
              {javaDone}/10 Done
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#666666] font-mono-code">
            <span>Days 1–10 (30 Aug – 08 Sep)</span>
            <span className="font-bold text-[#111111]">10 Days</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#8B5CF6] h-full transition-all duration-300"
              style={{ width: `${(javaDone / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* PHASE 2: PYTHON */}
        <div
          onClick={() => setActivePhase('PYTHON')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activePhase === 'PYTHON'
              ? 'bg-[#EFF6FF] border-[#3B82F6] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#D1D5DB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center font-bold text-sm">
                🐍
              </span>
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-[#1D4ED8]">
                  PHASE 2 (AFTER JAVA)
                </span>
                <h4 className="text-sm font-bold text-[#111111] font-display">PYTHON & SCRAPING</h4>
              </div>
            </div>
            <span className="text-xs font-mono-code font-bold text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded-full">
              {pythonDone}/10 Done
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#666666] font-mono-code">
            <span>Days 11–20 (09 Sep – 18 Sep)</span>
            <span className="font-bold text-[#111111]">10 Days</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#3B82F6] h-full transition-all duration-300"
              style={{ width: `${(pythonDone / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* PHASE 3: AI AUTOMATION */}
        <div
          onClick={() => setActivePhase('AI_AUTOMATION')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activePhase === 'AI_AUTOMATION'
              ? 'bg-[#ECFDF5] border-[#10B981] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#D1D5DB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#047857] flex items-center justify-center font-bold text-sm">
                🤖
              </span>
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-[#047857]">
                  PHASE 3 (AFTER PYTHON)
                </span>
                <h4 className="text-sm font-bold text-[#111111] font-display">AI AUTOMATION</h4>
              </div>
            </div>
            <span className="text-xs font-mono-code font-bold text-[#047857] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              {aiDone}/10 Done
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#666666] font-mono-code">
            <span>Days 21–30 (19 Sep – 28 Sep)</span>
            <span className="font-bold text-[#111111]">10 Days</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#10B981] h-full transition-all duration-300"
              style={{ width: `${(aiDone / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS & MATHEMATICS NOTE */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActivePhase('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-code transition-all cursor-pointer font-bold ${
              activePhase === 'ALL'
                ? 'bg-[#111111] text-[#FFFFFF]'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111]'
            }`}
          >
            All 30 Tech Days
          </button>
          <button
            type="button"
            onClick={() => setActivePhase('JAVA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-code transition-all cursor-pointer font-bold ${
              activePhase === 'JAVA'
                ? 'bg-[#8B5CF6] text-[#FFFFFF]'
                : 'bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#DDD6FE]'
            }`}
          >
            Phase 1: Java (Days 1–10)
          </button>
          <button
            type="button"
            onClick={() => setActivePhase('PYTHON')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-code transition-all cursor-pointer font-bold ${
              activePhase === 'PYTHON'
                ? 'bg-[#3B82F6] text-[#FFFFFF]'
                : 'bg-[#DBEAFE] text-[#1D4ED8] hover:bg-[#BFDBFE]'
            }`}
          >
            Phase 2: Python (Days 11–20)
          </button>
          <button
            type="button"
            onClick={() => setActivePhase('AI_AUTOMATION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-code transition-all cursor-pointer font-bold ${
              activePhase === 'AI_AUTOMATION'
                ? 'bg-[#10B981] text-[#FFFFFF]'
                : 'bg-[#DCFCE7] text-[#047857] hover:bg-[#BBF7D0]'
            }`}
          >
            Phase 3: AI Automation (Days 21–30)
          </button>
        </div>

        <div className="text-[11px] font-mono-code text-[#444444] bg-[#EFF6FF] px-3 py-1.5 rounded-xl border border-[#BFDBFE]">
          📐 <strong>Mathematics:</strong> Daily problem sets continue uninterrupted throughout all 30
          days!
        </div>
      </div>

      {/* ROADMAP TABLE WITH EXACT MANDATORY FIELDS */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] font-mono-code font-bold uppercase text-[11px]">
                <th className="py-3 px-3 w-16 text-center">Status</th>
                <th className="py-3 px-3 w-16 text-center">Day</th>
                <th className="py-3 px-3 w-28">Date</th>
                <th className="py-3 px-3 w-24">Phase</th>
                <th className="py-3 px-3 w-64">Topic</th>
                <th className="py-3 px-3 w-24 text-center">Learn</th>
                <th className="py-3 px-3 w-24 text-center">Practice</th>
                <th className="py-3 px-3 w-56">Mini Project / Task</th>
                <th className="py-3 px-3 w-48">Revision & Maths</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredRoadmap.map((item: TechnicalRoadmapDay) => {
                const isDone = completedDays[item.dayNum] || false;
                const isJava = item.phase === 'JAVA';
                const isPython = item.phase === 'PYTHON';
                const isAI = item.phase === 'AI_AUTOMATION';

                return (
                  <tr
                    key={item.dayNum}
                    className={`hover:bg-[#F9FAFB] transition-colors ${
                      isDone ? 'bg-[#F0FDF4]/60' : ''
                    }`}
                  >
                    {/* Status Checkbox */}
                    <td className="py-3 px-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => toggleDayStatus(item.dayNum)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                          isDone
                            ? 'bg-[#16A34A] border-[#16A34A] text-[#FFFFFF]'
                            : 'bg-[#FFFFFF] border-[#D1D5DB] text-transparent hover:border-[#111111]'
                        }`}
                        title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Day */}
                    <td className="py-3 px-3 text-center align-middle font-mono-code font-bold text-xs">
                      D{item.dayNum}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 align-middle font-mono-code text-[#111111]">
                      {item.date}
                    </td>

                    {/* Phase Badge */}
                    <td className="py-3 px-3 align-middle">
                      <span
                        className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full ${
                          isJava
                            ? 'bg-[#EDE9FE] text-[#6D28D9]'
                            : isPython
                            ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                            : 'bg-[#DCFCE7] text-[#047857]'
                        }`}
                      >
                        {item.phase}
                      </span>
                    </td>

                    {/* Topic */}
                    <td className="py-3 px-3 align-middle">
                      <div className="font-semibold text-[#111111] leading-snug">{item.topic}</div>
                      <div className="text-[11px] text-[#666666] font-mono-code mt-0.5">
                        Target: {item.targetGoal}
                      </div>
                    </td>

                    {/* Learning Time */}
                    <td className="py-3 px-3 text-center align-middle font-mono-code text-[#666666]">
                      {item.learningTime}
                    </td>

                    {/* Practice Time */}
                    <td className="py-3 px-3 text-center align-middle font-mono-code text-[#111111] font-bold">
                      {item.practiceTime}
                    </td>

                    {/* Mini Project / Task */}
                    <td className="py-3 px-3 align-middle">
                      <div className="text-[#111111] font-medium leading-snug">
                        {item.miniProject}
                      </div>
                      <div className="text-[10.5px] text-[#666666] mt-0.5">
                        <strong>Task:</strong> {item.homeworkTask}
                      </div>
                    </td>

                    {/* Revision & Maths */}
                    <td className="py-3 px-3 align-middle text-[11px]">
                      <div className="text-[#4B5563]">
                        <strong>Rev:</strong> {item.revision}
                      </div>
                      <div className="text-[#1D4ED8] font-mono-code mt-0.5">
                        <strong>Maths:</strong> {item.mathsFocus}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
