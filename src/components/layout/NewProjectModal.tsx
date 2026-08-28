import React, { useState } from 'react';
import { Project, AspectRatio, BudgetTier } from '../../types/domain';
import { INITIAL_PROJECT_PRESETS, createDefaultProject } from '../../core/defaultProject';
import { Sparkles, Film, X, Clapperboard, Clock, Monitor, Wand2 } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (customProject: Partial<Project>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-cyberpunk');
  const [title, setTitle] = useState('');
  const [premise, setPremise] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('2.39:1');
  const [duration, setDuration] = useState<number>(45);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('CINEMATIC_PRO');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof INITIAL_PROJECT_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.title);
    setPremise(preset.premise);
    setAspectRatio(preset.aspectRatio);
    setDuration(preset.targetDurationSeconds);
    setBudgetTier(preset.budgetTier);
  };

  const handleCreate = () => {
    const finalTitle = title.trim() || 'UNTITLED CINEMATIC VISION';
    const finalPremise = premise.trim() || 'A lone wanderer in a decaying synthetic world uncovers a forgotten archive of humanity.';
    
    onCreateProject({
      title: finalTitle,
      premise: finalPremise,
      aspectRatio,
      targetDurationSeconds: duration,
      budgetTier,
      currentState: 'USER_REVIEW'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
            <Clapperboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-mono">Create New AI Film Project</h2>
            <p className="text-xs text-zinc-400">Initialize a creative brief for autonomous multi-agent film production</p>
          </div>
        </div>

        {/* Cinematic Presets */}
        <div className="mb-5">
          <label className="block text-xs font-mono text-zinc-400 mb-2">Quick-Start Film Presets</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {INITIAL_PROJECT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-sm shadow-cyan-500/20'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-zinc-200 text-xs mb-1 truncate">{preset.title}</div>
                <div className="text-[11px] text-zinc-400 line-clamp-2">{preset.premise}</div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono">
                  <span>{preset.aspectRatio}</span> • <span>{preset.targetDurationSeconds}s</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Film Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NEON VEIL: The Memory Heist"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Core Premise & Story Idea</label>
            <textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              rows={3}
              placeholder="Describe your film idea, world, characters, dramatic conflict, or visual atmosphere..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Aspect Ratio & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                <Monitor className="w-3 h-3 text-cyan-400" />
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="2.39:1">2.39:1 (CinemaScope Anamorphic)</option>
                <option value="16:9">16:9 (Cinematic Widescreen)</option>
                <option value="9:16">9:16 (Vertical Short)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                Target Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value={30}>30s (Teaser / 4 Shots)</option>
                <option value={45}>45s (Trailer / 6 Shots)</option>
                <option value={60}>60s (Cinematic Short / 8 Shots)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Quality Tier
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value as BudgetTier)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="CINEMATIC_PRO">Cinematic Pro (4K + QA Retake)</option>
                <option value="FAST_DRAFT">Fast Draft (Quick Iteration)</option>
                <option value="HYPER_DETAILED">Hyper Detailed (Multi-pass)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-900 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Initialize Film Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
