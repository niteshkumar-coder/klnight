import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import React from 'react';

export const EvaluationReportView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* FINAL SCORECARD HERO BANNER */}
      <div className="bg-[#111111] text-[#FFFFFF] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF]/10 text-[#B8FF00] text-xs font-mono-code font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>30-DAY GRADUATION AUDIT · 28 SEPTEMBER 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#FFFFFF]">
              30-DAY LIFE, STUDY & WORK EVALUATION
            </h2>
            <p className="text-xs text-[#AAAAAA] max-w-xl leading-relaxed">
              Comprehensive evaluation of B.Tech CSE coursework, technical roadmaps (Java → Python
              → AI Automation), restaurant shifts, fitness, and business ventures.
            </p>
          </div>

          <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 rounded-2xl p-4 sm:p-5 text-center min-w-[160px] shrink-0">
            <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#B8FF00]">
              OVERALL SCORE
            </div>
            <div className="text-4xl sm:text-5xl font-bold font-display text-[#FFFFFF] mt-1">
              92<span className="text-xl text-[#B8FF00]">/100</span>
            </div>
            <div className="text-[10px] font-mono-code text-[#DCFCE7] mt-1 font-bold">
              ★ DISTINCTION GRADE
            </div>
          </div>
        </div>
      </div>

      {/* 5-PILLAR BREAKDOWN MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. TECHNICAL SKILLS */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-code font-bold text-xs text-[#6D28D9]">💻 TECHNICAL (P3)</span>
            <span className="font-mono-code font-bold text-xs text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
              28/30 Pts
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#111111] font-display">Java, Python & AI Mastery</h4>
          <p className="text-xs text-[#666666] leading-relaxed">
            Completed Core Java OOP capstone, Python web scrapers & automated REST pipelines, and AI
            automation LLM integrations cleanly in sequence.
          </p>
        </div>

        {/* 2. COLLEGE & MATHEMATICS */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-code font-bold text-xs text-[#1D4ED8]">📐 COLLEGE & MATHS (P2)</span>
            <span className="font-mono-code font-bold text-xs text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
              24/25 Pts
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#111111] font-display">Attendance & Assignments</h4>
          <p className="text-xs text-[#666666] leading-relaxed">
            Maintained ~86%+ college attendance from 7:00 AM – 1:00 PM. Solved daily mathematics
            problem sets consistently throughout all 30 days.
          </p>
        </div>

        {/* 3. WORK & INCOME */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-code font-bold text-xs text-[#B45309]">💼 WORK & INCOME (P4)</span>
            <span className="font-mono-code font-bold text-xs text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
              19/20 Pts
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#111111] font-display">Restaurant & Marketing</h4>
          <p className="text-xs text-[#666666] leading-relaxed">
            Fulfilled 6-day 5:00 PM – 10:00 PM restaurant job shifts without fail. Delivered client AI
            websites and published 3 USA-targeted YouTube videos.
          </p>
        </div>

        {/* 4. HEALTH & SLEEP */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-code font-bold text-xs text-[#047857]">🏋️ HEALTH & SLEEP (P1)</span>
            <span className="font-mono-code font-bold text-xs text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
              14/15 Pts
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#111111] font-display">7–8h Sleep & Weekly Fitness</h4>
          <p className="text-xs text-[#666666] leading-relaxed">
            Zero sleep sacrifice. Completed sustainable rotation: Monday Gym, Wednesday Swimming,
            Friday Gym with planned rest days.
          </p>
        </div>

        {/* 5. PERSONAL & TRADING */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-code font-bold text-xs text-[#C2410C]">❤️ PERSONAL & TRADING</span>
            <span className="font-mono-code font-bold text-xs text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
              7/10 Pts
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#111111] font-display">Family Time & Learning</h4>
          <p className="text-xs text-[#666666] leading-relaxed">
            Preserved 20 minutes daily family chats and relaxed Sundays. Completed educational trading
            theory without risking real capital.
          </p>
        </div>
      </div>

      {/* DETAILED RETROSPECTIVE TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* WHAT WAS COMPLETED */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#15803D] pb-2 border-b border-[#E5E5E5]">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="font-bold font-display uppercase tracking-wide">
              ✅ What Was Fully Completed (100%)
            </h4>
          </div>
          <ul className="space-y-2 text-[#333333] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">✓</span>
              <span>
                <strong>Java Phase 1 (Days 1–10):</strong> Completed Core OOP, Collections, File
                I/O, and Student Management CLI capstone.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">✓</span>
              <span>
                <strong>Python Phase 2 (Days 11–20):</strong> Data structures, Web Scraping
                (BeautifulSoup), REST API handling, and Pandas scraper capstone.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">✓</span>
              <span>
                <strong>AI Automation Phase 3 (Days 21–30):</strong> LLM API integrations, Prompt
                engineering, n8n webhook workflows & autonomous business bot.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">✓</span>
              <span>
                <strong>Restaurant Job:</strong> 100% attendance across all 26 scheduled evening
                shifts (5:00 PM – 10:00 PM).
              </span>
            </li>
          </ul>
        </div>

        {/* PARTIAL & NEXT PHASE ROADMAP */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#D97706] pb-2 border-b border-[#E5E5E5]">
            <Target className="w-4 h-4" />
            <h4 className="font-bold font-display uppercase tracking-wide">
              🚀 Next 30 Days Roadmap & Optimizations
            </h4>
          </div>
          <ul className="space-y-2 text-[#333333] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">→</span>
              <span>
                <strong>What to Continue:</strong> Full-stack Java Spring Boot / Python FastAPI
                integration, AI client automation pipelines, and daily 7–8h sleep routine.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">→</span>
              <span>
                <strong>What to Delegate / Reduce:</strong> Delegate routine website maintenance to
                student team to free up 2 hours/week.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">→</span>
              <span>
                <strong>YouTube Strategy:</strong> Maintain 1 high-quality USA video/week rather
                than pushing for multiple rushed edits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">→</span>
              <span>
                <strong>Trading:</strong> Keep purely educational with zero live capital risk.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
