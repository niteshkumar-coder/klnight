import {
  Check,
  Compass,
  Info,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ROOM_DATABASE, RoomDetail } from '../lib/erp/mockData';

interface RoomModalProps {
  roomCode: string | null;
  onClose: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ roomCode, onClose }) => {
  const [mapNotice, setMapNotice] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!roomCode) return null;

  const room: RoomDetail = ROOM_DATABASE[roomCode.toUpperCase()] || {
    code: roomCode.toUpperCase(),
    building: 'Main Academic Block (FEDEX)',
    floor: 'Academic Floor',
    block: 'Central Academic Wing',
    capacity: 60,
    type: 'Standard Lecture Hall',
    facilities: ['Digital Projector Screen', 'Surround Sound', 'Air Conditioned'],
    directions: `Proceed through the main academic concourse and follow floor signs for Room ${roomCode}.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl relative">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] border border-[#E5E5E5] flex items-center justify-center text-[#111111]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono-code text-[#666666] uppercase font-bold">
                CLASSROOM VENUE
              </div>
              <h2 className="text-xl font-bold text-[#111111] font-display">
                ROOM {room.code}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E5E5] text-[#666666] hover:text-[#111111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono-code">
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] text-[#666666] uppercase block">Building</span>
              <span className="font-bold text-[#111111] mt-0.5 block">{room.building}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] text-[#666666] uppercase block">Floor & Wing</span>
              <span className="font-bold text-[#111111] mt-0.5 block">{room.floor}, {room.block}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] text-[#666666] uppercase block">Seating Capacity</span>
              <span className="font-bold text-[#111111] mt-0.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#666666]" /> {room.capacity} Students
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] text-[#666666] uppercase block">Venue Type</span>
              <span className="font-bold text-[#111111] mt-0.5 block">{room.type}</span>
            </div>
          </div>

          {/* Navigation Directions */}
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono-code text-[#111111]">
              <Compass className="w-3.5 h-3.5 text-[#111111]" />
              WALKING DIRECTIONS
            </div>
            <p className="text-xs text-[#666666] leading-relaxed">
              {room.directions}
            </p>
          </div>

          {/* Room Facilities */}
          <div>
            <div className="text-[11px] font-mono-code font-bold uppercase text-[#666666] mb-2">
              EQUIPMENT & FACILITIES
            </div>
            <div className="flex flex-wrap gap-2">
              {room.facilities.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code text-[#111111] flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-[#16A34A]" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-mono-code font-bold cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
