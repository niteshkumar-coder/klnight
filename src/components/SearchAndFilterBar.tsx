import { Filter, RotateCcw, Search, X } from 'lucide-react';
import React from 'react';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedRoom: string;
  onRoomChange: (room: string) => void;
  availableRooms: string[];
  onReset: () => void;
  totalResults: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedRoom,
  onRoomChange,
  availableRooms,
  onReset,
  totalResults,
}) => {
  const isFiltered = searchQuery || selectedType !== 'All' || selectedRoom !== 'All';

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-timetable-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search course name, code (26SC1101), room (F108), or faculty..."
            className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#111111] placeholder-[#9CA3AF] outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter: Class Type */}
        <div className="flex items-center gap-2">
          <select
            id="select-filter-type"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] text-xs text-[#111111] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="L">Lectures [L]</option>
            <option value="T">Tutorials [T]</option>
            <option value="P">Practicals [P]</option>
            <option value="S">Sessions [S]</option>
          </select>

          {/* Filter: Room */}
          <select
            id="select-filter-room"
            value={selectedRoom}
            onChange={(e) => onRoomChange(e.target.value)}
            className="bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] text-xs text-[#111111] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
          >
            <option value="All">All Rooms</option>
            {availableRooms.map((r) => (
              <option key={r} value={r}>
                Room {r}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-[#DC2626] text-xs transition-colors cursor-pointer flex items-center gap-1 font-mono-code font-bold"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Search Tag Suggestions */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-[#666666] pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span>Quick filters:</span>
          {['Java', '26MT1101', 'F108', 'F105', 'Practical'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSearchChange(tag)}
              className="px-2 py-0.5 rounded-md bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E5E5] text-[#111111] transition-colors cursor-pointer text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        <div>
          <span>Found: </span>
          <span className="text-[#111111] font-bold">{totalResults}</span>
          <span> classes</span>
        </div>
      </div>
    </div>
  );
};
