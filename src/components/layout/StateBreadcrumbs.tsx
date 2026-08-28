import React from 'react';
import { ProjectState } from '../../types/domain';
import { ORDERED_STATES, getStateProgress } from '../../core/stateEngine';
import { Check, Lock, AlertTriangle, Sparkles, Film, ArrowRight } from 'lucide-react';

interface StateBreadcrumbsProps {
  currentState: ProjectState;
  onSelectStateView?: (state: ProjectState) => void;
  activeView: 'design' | 'production' | 'qa' | 'timeline';
  onViewChange: (view: 'design' | 'production' | 'qa' | 'timeline') => void;
}

export const StateBreadcrumbs: React.FC<StateBreadcrumbsProps> = ({
  currentState,
  activeView,
  onViewChange
}) => {
  const currentIndex = ORDERED_STATES.indexOf(currentState);
  const progressPct = getStateProgress(currentState);

  const getStageCategory = (state: ProjectState): 'design' | 'production' | 'qa' | 'timeline' => {
    switch (state) {
      case 'DRAFT':
      case 'DESIGNING':
      case 'DESIGN_READY':
      case 'USER_REVIEW':
      case 'DESIGN_LOCKED':
        return 'design';
      case 'PRODUCTION_QUEUED':
      case 'PRODUCING':
        return 'production';
      case 'QA':
      case 'REPAIRING':
        return 'qa';
      case 'EDITING':
      case 'MASTERING':
      case 'FINAL_QC':
      case 'COMPLETED':
        return 'timeline';
    }
  };

  return (
    <div className="bg-zinc-950/60 border-b border-zinc-900 px-4 lg:px-6 py-2">
      {/* Top Bar: Pipeline Stage Breadcrumb & Category Jumpers */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {ORDERED_STATES.map((state, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isLocked = state === 'DESIGN_LOCKED';
            const category = getStageCategory(state);

            return (
              <React.Fragment key={state}>
                <button
                  onClick={() => onViewChange(category)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm shadow-cyan-500/10'
                      : isPassed
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      : 'text-zinc-600 hover:text-zinc-500 opacity-60'
                  }`}
                  title={`Stage ${idx + 1}: ${state}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                    isCurrent 
                      ? 'bg-cyan-400 text-black' 
                      : isPassed 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : isLocked ? <Lock className="w-2 h-2" /> : idx + 1}
                  </span>
                  <span className="truncate max-w-[85px]">{state.replace('_', ' ')}</span>
                </button>

                {idx < ORDERED_STATES.length - 1 && (
                  <ArrowRight className={`w-2.5 h-2.5 shrink-0 ${
                    idx < currentIndex ? 'text-zinc-600' : 'text-zinc-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right side: Overall Pipeline Completion % */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-zinc-400">Pipeline:</span>
          <div className="w-20 bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-300">{progressPct}%</span>
        </div>
      </div>
    </div>
  );
};
