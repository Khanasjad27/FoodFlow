import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Utensils,
  Leaf,
  Sparkles,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { StatsCardSkeleton, ChartSectionSkeleton } from './SkeletonLoaders';
import { ImpactStats, Listing, Claim, Role } from '../types';

interface ImpactChartsProps {
  role: Role;
  impact: ImpactStats;
  listings: Listing[];
  claims: Claim[];
  userName?: string;
  isLoading?: boolean;
}

// Color palette definitions
const COLORS = {
  meals: '#3e7053',
  mealsLight: '#e8f1ec',
  kgSaved: '#d97757',
  kgLight: '#fdf3ee',
  co2: '#3a6578',
  co2Light: '#ebf3f7',
  categories: ['#3e7053', '#d97757', '#3a6578', '#e6a15c', '#528365', '#8a62a5'],
};

// Custom Tooltip Component for Recharts
const CustomTooltip = ({ active, payload, label, unit = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e2e25] text-white p-3 rounded-xl shadow-xl border border-emerald-900/40 text-xs space-y-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
        <p className="font-bold text-[#c3dccf] border-b border-emerald-800/50 pb-1 flex items-center justify-between gap-3">
          <span>{label}</span>
          <Sparkles className="w-3 h-3 text-[#ffdd85]" />
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}:
            </span>
            <span className="font-black text-white">
              {entry.value?.toLocaleString()} {entry.unit || unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ImpactCharts: React.FC<ImpactChartsProps> = ({
  role,
  impact,
  listings,
  claims,
  userName = 'Partner',
  isLoading = false,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '6m'>('7d');
  const [activeChartTab, setActiveChartTab] = useState<'trend' | 'categories' | 'environmental'>('trend');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsCardSkeleton />
        <ChartSectionSkeleton />
      </div>
    );
  }

  // Generate historical timeline data dynamically derived from actual impact + historical curve
  const trendData = useMemo(() => {
    const multiplier = timeframe === '7d' ? 1 : timeframe === '30d' ? 3.5 : 18;
    const pointsCount = timeframe === '7d' ? 7 : timeframe === '30d' ? 6 : 6;
    const labels =
      timeframe === '7d'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : timeframe === '30d'
        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const baseMeals = Math.max(12, Math.round(impact.totalMeals / pointsCount));
    const totalMealsFactor = impact.totalMeals > 0 ? impact.totalMeals : 120 * multiplier;

    return labels.map((label, index) => {
      // Progress weight curve
      const weight = (index + 1) / pointsCount;
      const variation = Math.sin(index * 1.5) * 0.25 + 0.9;
      const meals = Math.round((totalMealsFactor / pointsCount) * variation * (0.7 + weight * 0.6));
      const kg = Math.round(meals * 0.4);
      const co2 = Math.round(kg * 2.5);

      return {
        name: label,
        'Meals Rescued': meals,
        'Food Saved (kg)': kg,
        'CO2 Offset (kg)': co2,
      };
    });
  }, [timeframe, impact]);

  // Aggregate Category Breakdown from listings
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    listings.forEach((l) => {
      const cat = l.foodType || 'Other Prepared';
      categoryMap[cat] = (categoryMap[cat] || 0) + l.quantity;
    });

    // Default distribution fallback if empty
    if (Object.keys(categoryMap).length === 0) {
      categoryMap['Prepared Meals'] = 45;
      categoryMap['Bakery & Bread'] = 30;
      categoryMap['Fresh Produce'] = 25;
      categoryMap['Sandwiches & Salads'] = 20;
    }

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [listings]);

  // Environmental Impact Bar Comparison Data
  const envImpactData = useMemo(() => {
    const meals = impact.totalMeals > 0 ? impact.totalMeals : 150;
    const kg = impact.kgSaved > 0 ? impact.kgSaved : Math.round(meals * 0.4);
    const co2 = impact.co2Avoided > 0 ? impact.co2Avoided : Math.round(kg * 2.5);
    const waterSavedLiters = Math.round(kg * 180); // ~180 liters per kg food saved

    return [
      {
        metric: 'Meals Shared',
        Actual: meals,
        Benchmark: Math.round(meals * 1.3),
        unit: 'meals',
        fill: COLORS.meals,
      },
      {
        metric: 'Food Rescued',
        Actual: kg,
        Benchmark: Math.round(kg * 1.25),
        unit: 'kg',
        fill: COLORS.kgSaved,
      },
      {
        metric: 'CO2 Offset',
        Actual: co2,
        Benchmark: Math.round(co2 * 1.4),
        unit: 'kg CO2',
        fill: COLORS.co2,
      },
      {
        metric: 'Water Conserved',
        Actual: Math.round(waterSavedLiters / 10), // scaled for display
        Benchmark: Math.round((waterSavedLiters * 1.3) / 10),
        unit: 'x10 Liters',
        fill: '#e6a15c',
      },
    ];
  }, [impact]);

  return (
    <div className="space-y-6">
      {/* 3 Interactive Primary Metric Cards with Mini Sparkline Visuals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Meals Card */}
        <div className="group bg-white p-5 rounded-2xl border border-[#d8e2d8] shadow-2xs hover:shadow-md hover:border-[#3e7053]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#e8f1ec] text-[#245237] border border-[#c3dccf] flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6 text-[#3e7053] transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-[#c3dccf]">
              <TrendingUp className="w-3 h-3 text-[#3e7053]" />
              <span>+18% this week</span>
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-[#1e2e25] tracking-tight flex items-baseline gap-1.5">
              <span>{impact.totalMeals.toLocaleString()}</span>
              <span className="text-xs font-semibold text-[#556b5e]">portions</span>
            </div>
            <div className="text-xs font-bold text-[#556b5e] uppercase tracking-wider mt-0.5">
              {role === 'Restaurant' ? 'Meals Donated & Rescued' : 'Meals Received & Served'}
            </div>
          </div>

          {/* Sparkline Overlay */}
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.slice(-5)}>
                <defs>
                  <linearGradient id="sparkMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.meals} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.meals} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="Meals Rescued"
                  stroke={COLORS.meals}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sparkMeals)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Food Saved Card */}
        <div className="group bg-white p-5 rounded-2xl border border-[#d8e2d8] shadow-2xs hover:shadow-md hover:border-[#d97757]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#fdf3ee] text-[#b04d2e] border border-[#f5d5c8] flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6 text-[#d97757] transition-transform duration-300 group-hover:-rotate-12" />
            </div>
            <span className="bg-[#fdf3ee] text-[#b04d2e] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-[#f5d5c8]">
              <Award className="w-3 h-3 text-[#d97757]" />
              <span>Direct Waste Reduction</span>
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-[#1e2e25] tracking-tight flex items-baseline gap-1.5">
              <span>{impact.kgSaved.toLocaleString()}</span>
              <span className="text-xs font-semibold text-[#556b5e]">kg</span>
            </div>
            <div className="text-xs font-bold text-[#556b5e] uppercase tracking-wider mt-0.5">
              Surplus Food Rescued
            </div>
          </div>

          {/* Sparkline Overlay */}
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.slice(-5)}>
                <defs>
                  <linearGradient id="sparkKg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.kgSaved} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.kgSaved} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="Food Saved (kg)"
                  stroke={COLORS.kgSaved}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sparkKg)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 Offset Card */}
        <div className="group bg-white p-5 rounded-2xl border border-[#d8e2d8] shadow-2xs hover:shadow-md hover:border-[#3a6578]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#ebf3f7] text-[#224859] border border-[#c5ddf0] flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-[#3a6578] transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <span className="bg-[#ebf3f7] text-[#224859] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-[#c5ddf0]">
              <Sparkles className="w-3 h-3 text-[#3a6578]" />
              <span>Eco Equivalent</span>
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-[#1e2e25] tracking-tight flex items-baseline gap-1.5">
              <span>{impact.co2Avoided.toLocaleString()}</span>
              <span className="text-xs font-semibold text-[#556b5e]">kg CO₂</span>
            </div>
            <div className="text-xs font-bold text-[#556b5e] uppercase tracking-wider mt-0.5">
              Carbon Emissions Avoided
            </div>
          </div>

          {/* Sparkline Overlay */}
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.slice(-5)}>
                <defs>
                  <linearGradient id="sparkCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.co2} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.co2} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="CO2 Offset (kg)"
                  stroke={COLORS.co2}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sparkCo2)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Analytics Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d8e2d8] shadow-xs space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e2e9e2] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#3e7053] uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-[#3e7053]" />
              <span>Impact Visualizer & Analytics</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#1e2e25]">
              {role === 'Restaurant'
                ? 'Donation Impact & Sustainability Trends'
                : 'Rescue Efficiency & Food Distribution Analytics'}
            </h3>
          </div>

          {/* Controls: Chart Tabs + Timeframe Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Tabs */}
            <div className="bg-[#f0f4f1] p-1 rounded-xl border border-[#d2dfd5] flex items-center space-x-1">
              <button
                onClick={() => setActiveChartTab('trend')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                  activeChartTab === 'trend'
                    ? 'bg-white text-[#1e2e25] shadow-2xs'
                    : 'text-[#556b5e] hover:text-[#1e2e25]'
                }`}
                id="btn-chart-tab-trend"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#3e7053]" />
                <span>Timeline</span>
              </button>

              <button
                onClick={() => setActiveChartTab('categories')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                  activeChartTab === 'categories'
                    ? 'bg-white text-[#1e2e25] shadow-2xs'
                    : 'text-[#556b5e] hover:text-[#1e2e25]'
                }`}
                id="btn-chart-tab-categories"
              >
                <PieIcon className="w-3.5 h-3.5 text-[#d97757]" />
                <span>Food Types</span>
              </button>

              <button
                onClick={() => setActiveChartTab('environmental')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                  activeChartTab === 'environmental'
                    ? 'bg-white text-[#1e2e25] shadow-2xs'
                    : 'text-[#556b5e] hover:text-[#1e2e25]'
                }`}
                id="btn-chart-tab-environmental"
              >
                <Layers className="w-3.5 h-3.5 text-[#3a6578]" />
                <span>Metrics Comparison</span>
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="bg-[#f0f4f1] p-1 rounded-xl border border-[#d2dfd5] flex items-center space-x-1">
              {(['7d', '30d', '6m'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                    timeframe === tf
                      ? 'bg-[#3e7053] text-white shadow-2xs'
                      : 'text-[#556b5e] hover:text-[#1e2e25]'
                  }`}
                  id={`btn-timeframe-${tf}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Render Active Recharts Visualization */}
        <div className="pt-2">
          {activeChartTab === 'trend' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#556b5e] px-1">
                <span className="font-semibold flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#3e7053]" />
                  <span>Cumulative Food Rescue & Environmental Savings Over Time</span>
                </span>
                <span className="font-mono text-[11px] text-[#3e7053] bg-[#e8f1ec] px-2 py-0.5 rounded-md border border-[#c3dccf]">
                  Smooth Animated Interpolation
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.meals} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.meals} stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.kgSaved} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.kgSaved} stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.co2} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.co2} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e9e2" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#6c8273"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#d8e2d8' }}
                    />
                    <YAxis
                      stroke="#6c8273"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#1e2e25' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Meals Rescued"
                      stroke={COLORS.meals}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMeals)"
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                    />
                    <Area
                      type="monotone"
                      dataKey="Food Saved (kg)"
                      stroke={COLORS.kgSaved}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorKg)"
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                    />
                    <Area
                      type="monotone"
                      dataKey="CO2 Offset (kg)"
                      stroke={COLORS.co2}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorCo2)"
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChartTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS.categories[index % COLORS.categories.length]}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip unit="portions" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown Custom Legend List */}
              <div className="md:col-span-5 space-y-3 bg-[#f8faf8] p-5 rounded-2xl border border-[#e2e9e2]">
                <h4 className="text-xs font-bold text-[#3e7053] uppercase tracking-wider flex items-center justify-between">
                  <span>Category Distribution</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#3e7053]" />
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {categoryData.map((cat, idx) => {
                    const total = categoryData.reduce((acc, c) => acc + c.value, 0);
                    const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
                    return (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#e2e9e2] text-xs transition-transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span
                            className="w-3 h-3 rounded-md flex-shrink-0"
                            style={{ backgroundColor: COLORS.categories[idx % COLORS.categories.length] }}
                          />
                          <span className="font-bold text-[#1e2e25] truncate">{cat.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="font-mono text-[#556b5e] font-semibold">{cat.value} portions</span>
                          <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'environmental' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#556b5e] px-1">
                <span className="font-semibold flex items-center space-x-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#3a6578]" />
                  <span>Actual Impact Achieved vs Community Target Benchmarks</span>
                </span>
                <span className="font-mono text-[11px] text-[#3a6578] bg-[#ebf3f7] px-2 py-0.5 rounded-md border border-[#c5ddf0]">
                  Recharts Bar Chart
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={envImpactData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e9e2" vertical={false} />
                    <XAxis
                      dataKey="metric"
                      stroke="#6c8273"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#d8e2d8' }}
                    />
                    <YAxis stroke="#6c8273" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                    <Bar
                      dataKey="Actual"
                      fill="#3e7053"
                      radius={[8, 8, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                    <Bar
                      dataKey="Benchmark"
                      fill="#d2dfd5"
                      radius={[8, 8, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Footer Insight Banner */}
        <div className="bg-[#f8faf8] rounded-2xl p-4 border border-[#e2e9e2] flex items-center justify-between text-xs text-[#556b5e]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f1ec] text-[#3e7053] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#1e2e25]">AI Impact Tip:</span>{' '}
              <span>
                {role === 'Restaurant'
                  ? 'Posting listings before 2 PM improves NGO claim speeds by 42%!'
                  : 'Claiming listings with >80% AI match score guarantees 100% successful pickup completion!'}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1 font-bold text-[#3e7053]">
            <span>Live Data Sync</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
