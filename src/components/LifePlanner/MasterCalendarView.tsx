import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  Layers,
  Search,
  Sparkles,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DatePlanItem, MASTER_30_DAY_PLAN } from '../../data/lifePlannerData';

interface MasterCalendarViewProps {
  currentDateRaw?: string; // '2026-08-30'
}

export const MasterCalendarView: React.FC<MasterCalendarViewProps> = ({
  currentDateRaw = '2026-08-30',
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Day 1 open by default

  const filteredDays = useMemo(() => {
    return MASTER_30_DAY_PLAN.filter((item: DatePlanItem) => {
      const matchWeek = selectedWeek === 'all' || item.week === selectedWeek;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchWeek;

      const matchText =
        item.date.toLowerCase().includes(q) ||
        item.dayOfWeek.toLowerCase().includes(q) ||
        item.mainFocus.toLowerCase().includes(q) ||
        item.techStudy.toLowerCase().includes(q) ||
        item.collegeMaths.toLowerCase().includes(q) ||
        item.digitalMarketing.toLowerCase().includes(q) ||
        item.youtubePcm.toLowerCase().includes(q);

      return matchWeek && matchText;
    });
  }, [selectedWeek, searchQuery]);

  return (
    <div className="space-y-6">
      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#111111]" />
            <div>
              <h3 className="text-sm font-mono-code font-bold uppercase tracking-wider text-[#111111]">
                EXACT 30-DAY MASTER DATE-WISE PLAN
              </h3>
              <p className="text-xs text-[#666666]">
                30 August 2026 – 28 September 2026 · Daily focus & commitments
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topic, maths, YouTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code focus:outline-hidden focus:border-[#111111] transition-colors"
            />
          </div>
        </div>

        {/* Week Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-mono-code text-[#666666] shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Week:
          </span>

          <button
            type="button"
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold transition-all shrink-0 cursor-pointer ${
              selectedWeek === 'all'
                ? 'bg-[#111111] text-[#FFFFFF]'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5]'
            }`}
          >
            All 30 Days ({MASTER_30_DAY_PLAN.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedWeek(1)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all shrink-0 cursor-pointer ${
              selectedWeek === 1
                ? 'bg-[#111111] text-[#FFFFFF] font-bold'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5]'
            }`}
          >
            Week 1 (30 Aug – 05 Sep) · Java Basics
          </button>

          <button
            type="button"
            onClick={() => setSelectedWeek(2)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all shrink-0 cursor-pointer ${
              selectedWeek === 2
                ? 'bg-[#111111] text-[#FFFFFF] font-bold'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5]'
            }`}
          >
            Week 2 (06 Sep – 12 Sep) · Java OOP & Python Intro
          </button>

          <button
            type="button"
            onClick={() => setSelectedWeek(3)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all shrink-0 cursor-pointer ${
              selectedWeek === 3
                ? 'bg-[#111111] text-[#FFFFFF] font-bold'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5]'
            }`}
          >
            Week 3 (13 Sep – 19 Sep) · Python Scraping, APIs & AI Start
          </button>

          <button
            type="button"
            onClick={() => setSelectedWeek(4)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all shrink-0 cursor-pointer ${
              selectedWeek === 4
                ? 'bg-[#111111] text-[#FFFFFF] font-bold'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5]'
            }`}
          >
            Week 4 (20 Sep – 26 Sep) · AI Automation Workflows
          </button>

          <button
            type="button"
            onClick={() => setSelectedWeek(5)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all shrink-0 cursor-pointer ${
              selectedWeek === 5
                ? 'bg-[#111111] text-[#FFFFFF] font-bold'
                : 'bg-[#F3F4F6] text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5]'
            }`}
          >
            Final Evaluation (27 – 28 Sep)
          </button>
        </div>
      </div>

      {/* 30-DAY MASTER TABLE (RESPONSIVE) */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] font-mono-code font-bold uppercase text-[11px]">
                <th className="py-3 px-3 w-16 text-center">Day</th>
                <th className="py-3 px-3 w-28">Date & Day</th>
                <th className="py-3 px-3 w-56">Main Focus</th>
                <th className="py-3 px-3 w-64">Technical Study (P3)</th>
                <th className="py-3 px-3 w-48">College & Maths (P2)</th>
                <th className="py-3 px-3 w-36">Restaurant (P4)</th>
                <th className="py-3 px-3 w-36">Fitness (P1)</th>
                <th className="py-3 px-3 w-44">Digital Marketing</th>
                <th className="py-3 px-3 w-44">YouTube / PCM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredDays.map((item: DatePlanItem) => {
                const isToday = item.rawDate === currentDateRaw;
                const isSunday = item.dayOfWeek === 'Sunday';
                const isExpanded = expandedDay === item.dayNum;

                return (
                  <React.Fragment key={item.dayNum}>
                    <tr
                      onClick={() => setExpandedDay(isExpanded ? null : item.dayNum)}
                      className={`hover:bg-[#F9FAFB] transition-colors cursor-pointer ${
                        isToday
                          ? 'bg-[#F0FDF4]/80 font-medium'
                          : isSunday
                          ? 'bg-[#FFFBEB]/40'
                          : ''
                      }`}
                    >
                      {/* Day Number */}
                      <td className="py-3 px-3 text-center align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono-code font-bold text-xs ${
                            isToday
                              ? 'bg-[#16A34A] text-[#FFFFFF]'
                              : isSunday
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : 'bg-[#F3F4F6] text-[#111111]'
                          }`}
                        >
                          D{item.dayNum}
                        </span>
                      </td>

                      {/* Date & Day */}
                      <td className="py-3 px-3 align-top font-mono-code">
                        <div className="font-bold text-[#111111]">{item.date}</div>
                        <div
                          className={`text-[11px] ${
                            isSunday ? 'text-[#D97706] font-bold' : 'text-[#666666]'
                          }`}
                        >
                          {item.dayOfWeek}
                          {isToday && (
                            <span className="ml-1 text-[9px] px-1 py-0.2 bg-[#16A34A] text-[#FFFFFF] rounded font-bold">
                              TODAY
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Main Focus */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-semibold text-[#111111] leading-snug">
                          {item.mainFocus}
                        </div>
                        {item.rawDate === '2026-09-08' && (
                          <span className="inline-block mt-1 text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D]">
                            JAVA COMPLETE 🏁
                          </span>
                        )}
                        {item.rawDate === '2026-09-18' && (
                          <span className="inline-block mt-1 text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D]">
                            PYTHON COMPLETE 🏁
                          </span>
                        )}
                        {item.rawDate === '2026-09-28' && (
                          <span className="inline-block mt-1 text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#92400E]">
                            AI & 30-DAY GRADUATION 🏆
                          </span>
                        )}
                      </td>

                      {/* Technical Study */}
                      <td className="py-3 px-3 align-top font-mono-code text-[11.5px] text-[#5B21B6] bg-[#F5F3FF]/40">
                        {item.techStudy}
                      </td>

                      {/* College & Maths */}
                      <td className="py-3 px-3 align-top text-[#1E40AF] text-[11.5px]">
                        {item.collegeMaths}
                      </td>

                      {/* Restaurant */}
                      <td className="py-3 px-3 align-top font-mono-code text-[11px] text-[#92400E]">
                        {item.restaurant}
                      </td>

                      {/* Fitness */}
                      <td className="py-3 px-3 align-top text-[11px] text-[#047857]">
                        {item.gymSwimming}
                      </td>

                      {/* Digital Marketing */}
                      <td className="py-3 px-3 align-top text-[11px] text-[#666666]">
                        {item.digitalMarketing}
                      </td>

                      {/* YouTube / PCM */}
                      <td className="py-3 px-3 align-top text-[11px] text-[#666666]">
                        {item.youtubePcm}
                      </td>
                    </tr>

                    {/* EXPANDED ACCORDION DETAILS */}
                    {isExpanded && (
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5]">
                        <td colSpan={9} className="p-4">
                          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono-code font-bold text-xs bg-[#111111] text-[#FFFFFF] px-2 py-0.5 rounded">
                                  DAY {item.dayNum} · {item.date} ({item.dayOfWeek})
                                </span>
                                <span className="text-xs font-bold text-[#111111]">
                                  {item.mainFocus}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono-code text-[#666666]">
                                Click row to close details
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="p-2.5 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE]">
                                <span className="font-mono-code font-bold text-[#5B21B6] uppercase text-[10px] block mb-1">
                                  💻 Technical Deep Dive
                                </span>
                                <p className="text-[#333333] leading-relaxed">{item.techStudy}</p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]">
                                <span className="font-mono-code font-bold text-[#1D4ED8] uppercase text-[10px] block mb-1">
                                  📐 College & Mathematics
                                </span>
                                <p className="text-[#333333] leading-relaxed">{item.collegeMaths}</p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
                                <span className="font-mono-code font-bold text-[#B45309] uppercase text-[10px] block mb-1">
                                  💼 Income, YouTube & Family
                                </span>
                                <p className="text-[#333333] leading-relaxed">
                                  <strong>Job:</strong> {item.restaurant} <br />
                                  <strong>Marketing:</strong> {item.digitalMarketing} <br />
                                  <strong>YouTube:</strong> {item.youtubePcm} <br />
                                  <strong>Other:</strong> {item.otherActivities}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
