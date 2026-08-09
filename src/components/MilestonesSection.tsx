import React, { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, CheckCircle2, Lock, Flame, ChevronRight, Star } from 'lucide-react';
import { ImpactStats, Role } from '../types';
import { Milestone, MILESTONES_LIST, MilestoneCelebrationModal } from './MilestoneCelebrationModal';

interface MilestonesSectionProps {
  impact: ImpactStats;
  role: Role;
  entityName: string;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  impact,
  role,
  entityName,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Determine if milestone is unlocked
  const isMilestoneUnlocked = (m: Milestone): boolean => {
    if (m.type === 'kgSaved') return impact.kgSaved >= m.thresholdValue;
    if (m.type === 'completedPickups') return impact.completedListingsCount >= m.thresholdValue;
    if (m.type === 'totalMeals') return impact.totalMeals >= m.thresholdValue;
    return false;
  };

  // Get current value for milestone progress calculation
  const getMilestoneCurrentValue = (m: Milestone): number => {
    if (m.type === 'kgSaved') return impact.kgSaved;
    if (m.type === 'completedPickups') return impact.completedListingsCount;
    if (m.type === 'totalMeals') return impact.totalMeals;
    return 0;
  };

  // Get count of unlocked milestones
  const unlockedCount = MILESTONES_LIST.filter(isMilestoneUnlocked).length;

  const handleOpenMilestone = (m: Milestone) => {
    setSelectedMilestone(m);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#d8e2d8] shadow-xs space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e9e2] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#3e7053] uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-[#d97757]" />
            <span>Donor Impact Milestones</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#1e2e25] flex items-center gap-2">
            <span>Milestone Trophies & Thresholds</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e8f1ec] text-[#245237] border border-[#c3dccf] font-bold">
              {unlockedCount} / {MILESTONES_LIST.length} Unlocked
            </span>
          </h3>
        </div>

        {/* Quick Trigger Celebration Button */}
        <button
          onClick={() => {
            // Find highest unlocked milestone, or default to first
            const unlocked = MILESTONES_LIST.filter(isMilestoneUnlocked);
            const target = unlocked.length > 0 ? unlocked[unlocked.length - 1] : MILESTONES_LIST[0];
            handleOpenMilestone(target);
          }}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#3e7053] to-[#245237] text-white font-extrabold text-xs shadow-2xs hover:shadow-md transition-all flex items-center space-x-2 active:scale-95"
          id="btn-celebrate-milestone-hero"
        >
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>Launch Celebration Overlay 🎉</span>
        </button>
      </div>

      {/* Grid of Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MILESTONES_LIST.map((m) => {
          const unlocked = isMilestoneUnlocked(m);
          const currentValue = getMilestoneCurrentValue(m);
          const progressPct = Math.min(
            100,
            Math.round((currentValue / m.thresholdValue) * 100)
          );

          return (
            <div
              key={m.id}
              onClick={() => handleOpenMilestone(m)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 group ${
                unlocked
                  ? 'bg-gradient-to-b from-white to-[#f8faf8] border-[#3e7053]/30 hover:border-[#3e7053] hover:shadow-md'
                  : 'bg-[#fafbfa] border-[#e2e9e2] opacity-80 hover:opacity-100 hover:border-[#b8ccb8]'
              }`}
              id={`card-milestone-${m.id}`}
            >
              {/* Header Status */}
              <div className="flex items-center justify-between">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110 inline-block">
                  {m.iconEmoji}
                </span>

                {unlocked ? (
                  <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 border border-[#c3dccf]">
                    <CheckCircle2 className="w-3 h-3 text-[#3e7053]" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="bg-[#f0f4f1] text-[#556b5e] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-[#889b8e]" />
                    <span>{progressPct}%</span>
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#1e2e25] group-hover:text-[#3e7053] transition-colors">
                  {m.title}
                </h4>
                <p className="text-[11px] text-[#556b5e] line-clamp-2 leading-snug">
                  {m.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2 border-t border-[#e2e9e2]">
                <div className="flex justify-between text-[10px] font-bold text-[#1e2e25]">
                  <span>
                    {currentValue} / {m.thresholdValue}{' '}
                    {m.type === 'kgSaved'
                      ? 'kg'
                      : m.type === 'totalMeals'
                      ? 'meals'
                      : 'pickups'}
                  </span>
                  <span className={unlocked ? 'text-[#3e7053]' : 'text-[#889b8e]'}>
                    {unlocked ? 'Complete!' : `${progressPct}%`}
                  </span>
                </div>

                <div className="w-full bg-[#e2e9e2] h-2 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      unlocked
                        ? 'bg-[#3e7053]'
                        : 'bg-gradient-to-r from-[#889b8e] to-[#3e7053]'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal celebration pop-up */}
      {selectedMilestone && (
        <MilestoneCelebrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
          role={role}
          entityName={entityName}
        />
      )}
    </div>
  );
};
