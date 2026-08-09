import React from 'react';

// Skeleton for Impact Metric Cards
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-[#d8e2d8] shadow-2xs animate-pulse flex flex-col justify-between h-36"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#e2e9e2]" />
            <div className="w-20 h-5 rounded-full bg-[#e2e9e2]" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="w-24 h-7 rounded-lg bg-[#e2e9e2]" />
            <div className="w-36 h-3 rounded-md bg-[#e2e9e2]" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for Listing Item Cards in Feeds
export const ListingCardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 border border-[#d8e2d8] shadow-2xs space-y-4 animate-pulse"
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-3">
            <div className="space-y-2">
              <div className="w-32 h-5 rounded-md bg-[#e2e9e2]" />
              <div className="w-24 h-3 rounded-md bg-[#e2e9e2]" />
            </div>
            <div className="w-20 h-6 rounded-full bg-[#e2e9e2]" />
          </div>

          {/* Details Skeleton */}
          <div className="space-y-2 bg-[#f8faf8] p-3 rounded-xl border border-[#e2e9e2]">
            <div className="flex justify-between items-center">
              <div className="w-16 h-3 rounded bg-[#e2e9e2]" />
              <div className="w-24 h-4 rounded bg-[#e2e9e2]" />
            </div>
            <div className="flex justify-between items-center pt-1">
              <div className="w-20 h-3 rounded bg-[#e2e9e2]" />
              <div className="w-28 h-3 rounded bg-[#e2e9e2]" />
            </div>
            <div className="flex justify-between items-center pt-1">
              <div className="w-16 h-3 rounded bg-[#e2e9e2]" />
              <div className="w-36 h-3 rounded bg-[#e2e9e2]" />
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className="w-full h-10 rounded-xl bg-[#e2e9e2]" />
        </div>
      ))}
    </div>
  );
};

// Skeleton for Analytics Charts Section
export const ChartSectionSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d8e2d8] shadow-xs space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e9e2] pb-4">
        <div className="space-y-2">
          <div className="w-32 h-4 rounded bg-[#e2e9e2]" />
          <div className="w-64 h-6 rounded bg-[#e2e9e2]" />
        </div>
        <div className="w-48 h-9 rounded-xl bg-[#e2e9e2]" />
      </div>

      <div className="h-72 w-full rounded-2xl bg-[#f8faf8] border border-[#e2e9e2] flex items-end justify-between p-6 space-x-4">
        {[40, 65, 30, 85, 50, 75, 60].map((h, i) => (
          <div
            key={i}
            className="w-full bg-[#e2e9e2] rounded-t-xl"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};
